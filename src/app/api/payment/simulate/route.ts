import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { orderId, success = true } = await request.json();
    if (!orderId) return NextResponse.json({ error: "Order ID is required." }, { status: 400 });

    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("simulate_order_payment", {
      p_order_id: orderId,
      p_success: Boolean(success),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ order: data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unable to process simulated payment." }, { status: 500 });
  }
}
