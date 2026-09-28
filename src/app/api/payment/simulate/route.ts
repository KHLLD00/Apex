import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { orderId, success = true } = await request.json();
    if (!orderId) return NextResponse.json({ error: "Order ID is required." }, { status: 400 });

    const supabase = createAdminClient();
    const status = Boolean(success);
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        payment_status: status ? "paid" : "failed",
        order_status: status ? "processing" : "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("payment_status", "pending")
      .select("id,order_number,payment_status,order_status,total")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ order }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to process simulated payment." }, { status: 500 });
  }
}
