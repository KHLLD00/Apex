import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/backend/admin";

const statuses = new Set(["pending","processing","shipped","delivered","cancelled"]);
const payments = new Set(["pending","paid","failed","refunded"]);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { supabase } = await requireAdmin();
    const body = await request.json();
    const updates: Record<string, string> = {};

    if (body.order_status && statuses.has(body.order_status)) updates.order_status = body.order_status;
    if (body.payment_status && payments.has(body.payment_status)) updates.payment_status = body.payment_status;

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No valid order status changes supplied." }, { status: 400 });
    }

    const { data, error } = await supabase.from("orders").update(updates).eq("id", params.id).select("id,order_number,payment_status,order_status,updated_at").single();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
