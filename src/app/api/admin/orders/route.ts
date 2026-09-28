import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("id,order_number,created_at,customer_name,customer_email,customer_phone,state,lga,delivery_method,delivery_fee,subtotal,discount,total,coupon_code,payment_status,order_status,order_items(id,product_name,variant_name,quantity,unit_price,total_price)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ orders: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized or unable to load orders." }, { status: 401 });
  }
}
