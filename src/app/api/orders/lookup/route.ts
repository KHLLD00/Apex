import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const orderNumber = new URL(request.url).searchParams.get("order");
  if (!orderNumber) return NextResponse.json({ error: "Order number is required." }, { status: 400 });

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id,order_number,created_at,customer_name,customer_email,customer_phone,state,lga,delivery_address,delivery_instructions,delivery_method,delivery_fee,subtotal,discount,total,coupon_code,payment_status,order_status,order_items(id,product_id,variant_id,product_name,variant_name,quantity,unit_price,total_price)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Unable to load order." }, { status: 500 });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}
