"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";

type Order = {
  order_number: string;
  created_at: string;
  customer_name: string;
  delivery_address: string;
  lga: string;
  state: string;
  delivery_method: string;
  delivery_fee: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  payment_status: string;
  order_status: string;
  order_items: Array<{
    id: string;
    product_name: string;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
};

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderNumber) { setOrder(null); return; }
    fetch(`/api/orders/lookup?order=${encodeURIComponent(orderNumber)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setOrder(data.order);
      })
      .catch(() => setOrder(null));
  }, [orderNumber]);

  if (order === undefined) return <div className="py-20 text-center text-sm text-navy-900/50">Loading your order…</div>;

  if (!order) {
    return <EmptyState title="Order not found" description="We couldn't find that order. Check the order number and try again." action={<Button asChild><Link href="/shop">Continue shopping</Link></Button>} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">
          {order.payment_status === "paid" ? "Payment successful" : "Order received"}
        </h1>
        <p className="text-navy-900/60">Thanks, {order.customer_name.split(" ")[0]} — your order is {order.order_status}.</p>
      </div>

      <div className="mt-10 rounded-xl2 border border-navy-900/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-900/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-navy-900/40">Order number</p>
            <p className="font-display text-lg font-semibold text-navy-900">{order.order_number}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium capitalize text-emerald-700">{order.order_status}</span>
        </div>

        <ul className="mt-4 flex flex-col gap-3 border-b border-navy-900/10 pb-4">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-navy-900">{item.product_name}</p>
                {item.variant_name && <p className="text-xs text-navy-900/50">{item.variant_name}</p>}
                <p className="text-navy-900/50">Qty {item.quantity}</p>
              </div>
              <span className="font-medium text-navy-900">{formatNaira(Number(item.total_price))}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-navy-900/50">Subtotal</span><span>{formatNaira(Number(order.subtotal))}</span></div>
          {Number(order.discount) > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>-{formatNaira(Number(order.discount))}</span></div>}
          <div className="flex justify-between"><span className="text-navy-900/50">Delivery</span><span>{Number(order.delivery_fee) ? formatNaira(Number(order.delivery_fee)) : "Free"}</span></div>
          <div className="flex justify-between border-t border-navy-900/10 pt-3 text-base font-semibold"><span>Total paid</span><span>{formatNaira(Number(order.total))}</span></div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-navy-900/10 pt-5 sm:grid-cols-2">
          <div><p className="text-xs uppercase tracking-wide text-navy-900/40">Delivery address</p><p className="mt-1 text-sm text-navy-900/80">{order.delivery_address}, {order.lga}, {order.state}</p></div>
          <div><p className="text-xs uppercase tracking-wide text-navy-900/40">Delivery method</p><p className="mt-1 text-sm capitalize text-navy-900/80">{order.delivery_method}</p></div>
        </div>
      </div>

      <div className="mt-8 flex justify-center"><Button variant="outline" asChild><Link href="/shop">Continue Shopping</Link></Button></div>
    </div>
  );
}
