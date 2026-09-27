-- Apex Gadgets Supabase schema
-- Phase 2: database structure, constraints, indexes, and RLS foundation.
-- Run this migration in the Supabase SQL editor or migration pipeline.

create extension if not exists pgcrypto;

create type public.discount_type as enum ('percentage', 'fixed');
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type public.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  brand text not null,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2),
  sku text not null unique,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_sale_price_check check (sale_price is null or (sale_price >= 0 and sale_price <= price))
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text not null unique,
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  attributes jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint product_variants_sale_price_check check (sale_price is null or (sale_price >= 0 and sale_price <= price))
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  state text not null,
  lga text not null,
  delivery_address text not null,
  delivery_instructions text,
  delivery_method text not null check (delivery_method in ('standard', 'express')),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount numeric(12,2) not null default 0 check (discount >= 0),
  total numeric(12,2) not null check (total >= 0),
  coupon_code text,
  payment_status public.payment_status not null default 'pending',
  order_status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_check check (total = subtotal - discount + delivery_fee)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total_price numeric(12,2) not null check (total_price = unit_price * quantity),
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type public.discount_type not null,
  discount_value numeric(12,2) not null check (discount_value >= 0),
  minimum_order_value numeric(12,2) not null default 0 check (minimum_order_value >= 0),
  maximum_discount numeric(12,2) check (maximum_discount is null or maximum_discount >= 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint coupons_percentage_value_check check (
    discount_type <> 'percentage' or discount_value <= 100
  ),
  constraint coupons_usage_check check (
    usage_limit is null or usage_count <= usage_limit
  )
);

create table public.coupon_usage (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete restrict,
  order_id uuid not null unique references public.orders(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

-- Query indexes
create index products_category_id_idx on public.products(category_id);
create index products_brand_idx on public.products(brand);
create index products_price_idx on public.products(price);
create index products_active_idx on public.products(is_active);
create index products_featured_idx on public.products(is_featured) where is_featured;
create index products_bestseller_idx on public.products(is_bestseller) where is_bestseller;
create index products_new_idx on public.products(is_new) where is_new;
create index products_stock_idx on public.products(stock_quantity);

create index product_variants_product_id_idx on public.product_variants(product_id);
create index product_variants_active_idx on public.product_variants(is_active);
create index product_images_product_id_sort_idx on public.product_images(product_id, sort_order);

create index orders_created_at_idx on public.orders(created_at desc);
create index orders_payment_status_idx on public.orders(payment_status);
create index orders_order_status_idx on public.orders(order_status);
create index orders_customer_email_idx on public.orders(customer_email);

create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);

create index coupons_active_idx on public.coupons(is_active);
create index coupons_expires_at_idx on public.coupons(expires_at);
create index coupon_usage_coupon_id_idx on public.coupon_usage(coupon_id);

-- Public catalog reads. Mutations remain denied unless a later authenticated
-- admin policy explicitly permits them.
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_usage enable row level security;

create policy "public can read active categories"
on public.categories for select
to anon, authenticated
using (is_active = true);

create policy "public can read active products"
on public.products for select
to anon, authenticated
using (is_active = true);

create policy "public can read active variants"
on public.product_variants for select
to anon, authenticated
using (is_active = true);

create policy "public can read product images"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.is_active = true
  )
);

-- No public order/coupon-usage access is granted here.
-- Coupon validation and all order mutations will be performed server-side.

comment on table public.orders is 'Guest checkout orders; created and mutated through trusted server-side logic.';
comment on table public.order_items is 'Historical product/variant snapshots for each order.';
comment on table public.coupon_usage is 'Tracks coupon application to orders; server-side only.';
