import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id,name,slug,brand,sku,price,sale_price,stock_quantity,is_featured,is_bestseller,is_new,is_active,category_id,categories(id,name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to load products." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const brand = String(body.brand ?? "").trim();
    const slug = String(body.slug ?? "").trim().toLowerCase();
    const sku = String(body.sku ?? "").trim().toUpperCase();
    const description = String(body.description ?? "").trim();
    const price = Number(body.price);
    const salePrice = body.sale_price === "" || body.sale_price == null ? null : Number(body.sale_price);
    const stock = Number(body.stock_quantity);
    const categoryId = body.category_id || null;

    if (!name || !brand || !slug || !sku || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "Name, brand, slug, SKU, price and valid stock are required." }, { status: 400 });
    }
    if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice < 0 || salePrice > price)) {
      return NextResponse.json({ error: "Sale price must be between ₦0 and the regular price." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name, brand, slug, sku, description, price, sale_price: salePrice,
        stock_quantity: stock, category_id: categoryId,
        is_featured: Boolean(body.is_featured),
        is_bestseller: Boolean(body.is_bestseller),
        is_new: Boolean(body.is_new),
        is_active: body.is_active !== false,
      })
      .select("id,name,slug,brand,sku,price,sale_price,stock_quantity,is_featured,is_bestseller,is_new,is_active,category_id")
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const id = String(body.id ?? "");

    if (!id) return NextResponse.json({ error: "Product ID is required." }, { status: 400 });

    const allowed: Record<string, unknown> = {};
    for (const key of ["name","brand","slug","sku","description","category_id","price","sale_price","stock_quantity","is_featured","is_bestseller","is_new","is_active"]) {
      if (key in body) allowed[key] = body[key] === "" && key === "sale_price" ? null : body[key];
    }

    if ("price" in allowed) allowed.price = Number(allowed.price);
    if ("sale_price" in allowed && allowed.sale_price !== null) allowed.sale_price = Number(allowed.sale_price);
    if ("stock_quantity" in allowed) allowed.stock_quantity = Number(allowed.stock_quantity);

    const { data, error } = await supabase
      .from("products")
      .update(allowed)
      .eq("id", id)
      .select("id,name,slug,brand,sku,price,sale_price,stock_quantity,is_featured,is_bestseller,is_new,is_active,category_id")
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
