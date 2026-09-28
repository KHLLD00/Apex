import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Item = {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items as Item[] : [];

    if (!items.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("create_guest_order", {
      p_customer_name: body.customer?.fullName ?? "",
      p_customer_email: body.customer?.email ?? "",
      p_customer_phone: body.customer?.phone ?? "",
      p_state: body.delivery?.state ?? "",
      p_lga: body.delivery?.lga ?? "",
      p_delivery_address: body.delivery?.address ?? "",
      p_delivery_instructions: body.delivery?.instructions ?? "",
      p_delivery_method: body.delivery?.method ?? "standard",
      p_items: items,
      p_coupon_code: body.couponCode ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ order: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create your order." }, { status: 500 });
  }
}
