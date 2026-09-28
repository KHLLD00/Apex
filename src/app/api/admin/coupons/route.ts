import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("coupons")
      .select("id,code,discount_type,discount_value,minimum_order_value,maximum_discount,usage_limit,usage_count,expires_at,is_active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ coupons: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to load coupons." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const code = String(body.code ?? "").trim().toUpperCase();
    const discountType = body.discount_type === "fixed" ? "fixed" : "percentage";
    const discountValue = Number(body.discount_value);
    const minimum = Number(body.minimum_order_value ?? 0);
    const maximum = body.maximum_discount === "" || body.maximum_discount == null ? null : Number(body.maximum_discount);
    const usageLimit = body.usage_limit === "" || body.usage_limit == null ? null : Number(body.usage_limit);
    const expiresAt = body.expires_at ? new Date(body.expires_at).toISOString() : null;

    if (!code || !Number.isFinite(discountValue) || discountValue < 0 || !Number.isFinite(minimum) || minimum < 0) {
      return NextResponse.json({ error: "Valid coupon code, discount and minimum order are required." }, { status: 400 });
    }
    if (discountType === "percentage" && discountValue > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100%." }, { status: 400 });
    }

    const { data, error } = await supabase.from("coupons").insert({
      code,
      discount_type: discountType,
      discount_value: discountValue,
      minimum_order_value: minimum,
      maximum_discount: maximum,
      usage_limit: usageLimit,
      expires_at: expiresAt,
      is_active: body.is_active !== false,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ coupon: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create coupon.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!id) return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });

    const updates: Record<string, unknown> = {};
    for (const key of ["code","discount_type","discount_value","minimum_order_value","maximum_discount","usage_limit","expires_at","is_active"]) {
      if (key in body) updates[key] = body[key] === "" && ["maximum_discount","usage_limit","expires_at"].includes(key) ? null : body[key];
    }

    if ("code" in updates) updates.code = String(updates.code).trim().toUpperCase();
    for (const key of ["discount_value","minimum_order_value","maximum_discount","usage_limit"]) {
      if (key in updates && updates[key] !== null) updates[key] = Number(updates[key]);
    }
    if ("expires_at" in updates && updates.expires_at) updates.expires_at = new Date(String(updates.expires_at)).toISOString();

    const { data, error } = await supabase.from("coupons").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ coupon: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update coupon.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
