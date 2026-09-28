-- Phase 5: trusted guest order creation.
create or replace function public.create_guest_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_state text,
  p_lga text,
  p_delivery_address text,
  p_delivery_instructions text,
  p_delivery_method text,
  p_items jsonb,
  p_coupon_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12,2) := 0;
  v_discount numeric(12,2) := 0;
  v_delivery_fee numeric(12,2);
  v_total numeric(12,2);
  v_coupon coupons%rowtype;
  v_item jsonb;
  v_product products%rowtype;
  v_variant product_variants%rowtype;
  v_product_id uuid;
  v_variant_id uuid;
  v_quantity integer;
  v_unit_price numeric(12,2);
  v_item_total numeric(12,2);
  v_variant_name text;
  v_selection jsonb;
  v_key text;
  v_value text;
begin
  if nullif(trim(p_customer_name), '') is null
     or nullif(trim(p_customer_email), '') is null
     or nullif(trim(p_customer_phone), '') is null
     or nullif(trim(p_state), '') is null
     or nullif(trim(p_lga), '') is null
     or nullif(trim(p_delivery_address), '') is null then
    raise exception 'Customer and delivery information are required';
  end if;

  if p_delivery_method not in ('standard','express') then
    raise exception 'Invalid delivery method';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'productId')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    v_selection := coalesce(v_item->'selectedVariants', '{}'::jsonb);

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity';
    end if;

    select * into v_product
    from products
    where id = v_product_id and is_active = true
    for update;

    if not found then
      raise exception 'Product is unavailable';
    end if;

    v_variant_id := null;
    select * into v_variant
    from product_variants
    where product_id = v_product.id and is_active = true
    order by created_at
    limit 1
    for update;

    if found then
      for v_key, v_value in select key, value #>> '{}' from jsonb_each_text(v_selection)
      loop
        if not (v_variant.attributes @> jsonb_build_object(v_key, jsonb_build_array(v_value))) then
          raise exception 'Selected variant is unavailable for %', v_product.name;
        end if;
      end loop;

      if v_variant.stock_quantity < v_quantity then
        raise exception 'Insufficient stock for %', v_product.name;
      end if;

      v_variant_id := v_variant.id;
      v_unit_price := coalesce(v_variant.sale_price, v_variant.price);
      v_variant_name := nullif(
        array_to_string(
          array(
            select key || ': ' || value #>> '{}'
            from jsonb_each_text(v_selection)
            order by key
          ), ', '
        ), ''
      );

      update product_variants
      set stock_quantity = stock_quantity - v_quantity
      where id = v_variant.id;
      update products
      set stock_quantity = greatest(0, stock_quantity - v_quantity)
      where id = v_product.id;
    else
      if v_product.stock_quantity < v_quantity then
        raise exception 'Insufficient stock for %', v_product.name;
      end if;

      v_unit_price := coalesce(v_product.sale_price, v_product.price);
      update products
      set stock_quantity = stock_quantity - v_quantity
      where id = v_product.id;
    end if;

    v_item_total := v_unit_price * v_quantity;
    v_subtotal := v_subtotal + v_item_total;
  end loop;

  if p_coupon_code is not null and nullif(trim(p_coupon_code), '') is not null then
    select * into v_coupon
    from coupons
    where code = upper(trim(p_coupon_code))
      and is_active = true
    for update;

    if not found then raise exception 'Coupon code is invalid'; end if;
    if v_coupon.expires_at is not null and v_coupon.expires_at <= now() then
      raise exception 'Coupon has expired';
    end if;
    if v_coupon.usage_limit is not null and v_coupon.usage_count >= v_coupon.usage_limit then
      raise exception 'Coupon usage limit has been reached';
    end if;
    if v_subtotal < v_coupon.minimum_order_value then
      raise exception 'Minimum order value for this coupon has not been reached';
    end if;

    if v_coupon.discount_type = 'percentage' then
      v_discount := round(v_subtotal * v_coupon.discount_value / 100, 2);
      if v_coupon.maximum_discount is not null then
        v_discount := least(v_discount, v_coupon.maximum_discount);
      end if;
    else
      v_discount := least(v_coupon.discount_value, v_subtotal);
    end if;
  end if;

  if p_delivery_method = 'express' then
    v_delivery_fee := 6500;
  elsif v_subtotal >= 50000 then
    v_delivery_fee := 0;
  else
    v_delivery_fee := 3500;
  end if;

  v_total := greatest(0, v_subtotal - v_discount + v_delivery_fee);
  v_order_number := 'APX-' || to_char(now(), 'YYYYMMDD') || '-' ||
                    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into orders (
    order_number, customer_name, customer_email, customer_phone, state, lga,
    delivery_address, delivery_instructions, delivery_method, delivery_fee,
    subtotal, discount, total, coupon_code, payment_status, order_status
  )
  values (
    v_order_number, trim(p_customer_name), lower(trim(p_customer_email)), trim(p_customer_phone),
    trim(p_state), trim(p_lga), trim(p_delivery_address), nullif(trim(p_delivery_instructions), ''),
    p_delivery_method, v_delivery_fee, v_subtotal, v_discount, v_total,
    nullif(upper(trim(p_coupon_code)), ''), 'pending', 'pending'
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'productId')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    v_selection := coalesce(v_item->'selectedVariants', '{}'::jsonb);

    select * into v_product from products where id = v_product_id;
    select * into v_variant
    from product_variants
    where product_id = v_product_id and is_active = true
    order by created_at limit 1;

    if found then
      v_unit_price := coalesce(v_variant.sale_price, v_variant.price);
      v_variant_name := nullif(
        array_to_string(array(
          select key || ': ' || value #>> '{}'
          from jsonb_each_text(v_selection) order by key
        ), ', '), ''
      );
      v_variant_id := v_variant.id;
    else
      v_unit_price := coalesce(v_product.sale_price, v_product.price);
      v_variant_id := null;
      v_variant_name := null;
    end if;

    insert into order_items (
      order_id, product_id, variant_id, product_name, variant_name,
      quantity, unit_price, total_price
    )
    values (
      v_order_id, v_product.id, v_variant_id, v_product.name, v_variant_name,
      v_quantity, v_unit_price, v_unit_price * v_quantity
    );
  end loop;

  if p_coupon_code is not null and nullif(trim(p_coupon_code), '') is not null then
    update coupons set usage_count = usage_count + 1 where id = v_coupon.id;
    insert into coupon_usage(coupon_id, order_id) values (v_coupon.id, v_order_id);
  end if;

  return jsonb_build_object(
    'id', v_order_id,
    'orderNumber', v_order_number,
    'subtotal', v_subtotal,
    'discount', v_discount,
    'deliveryFee', v_delivery_fee,
    'total', v_total,
    'paymentStatus', 'pending',
    'orderStatus', 'pending'
  );
end;
$$;

revoke all on function public.create_guest_order(text,text,text,text,text,text,text,text,jsonb,text) from public;
grant execute on function public.create_guest_order(text,text,text,text,text,text,text,text,jsonb,text) to service_role;

insert into public.coupons(code,discount_type,discount_value,minimum_order_value,maximum_discount,is_active)
values
('APEX10','percentage',10,100000,100000,true),
('SAVE5000','fixed',5000,150000,null,true)
on conflict(code) do update set
discount_type=excluded.discount_type,
discount_value=excluded.discount_value,
minimum_order_value=excluded.minimum_order_value,
maximum_discount=excluded.maximum_discount,
is_active=true;
