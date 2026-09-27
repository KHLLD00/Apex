"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types";
import { products } from "@/data/products";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";

export function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderNumber) {
      setOrder(null);
      return;
    }
    try {
      const raw = localStorage.getItem(`apex-order-${orderNumber}`);
      setOrder(raw ? JSON.parse(raw) : null);
    } catch {
      setOrder(null);
    }
  }, [orderNumber]);

  if (order === undefined) return null;

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="We couldn't find that order on this device. Confirmations are only available in the browser where the order was placed."
        action={<Button asChild><Link href="/shop">Continue shopping</Link></Button>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Payment successful</h1>
        <p className="text-navy-900/60">Thanks, {order.customer.fullName.split(" ")[0]} — your order is confirmed.</p>
      </div>

      <div className="mt-10 rounded-xl2 border border-navy-900/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-900/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-navy-900/40">Order number</p>
            <p className="font-display text-lg font-semibold text-navy-900">{order.orderNumber}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {order.status === "confirmed" ? "Confirmed" : "Processing"}
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-3 border-b border-navy-900/10 pb-4">
          {order.items.map((item, idx) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <li key={idx} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-navy-900/5">
                  <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-navy-900">{product.name}</p>
                  <p className="text-navy-900/50">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-navy-900">{formatNaira(product.price * item.quantity)}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex justify-between border-b border-navy-900/10 pb-4 text-base font-semibold text-navy-900">
          <span>Total paid</span><span>{formatNaira(order.total)}</span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-navy-900/40">Delivery address</p>
            <p className="mt-1 text-sm text-navy-900/80">
              {order.delivery.address}, {order.delivery.lga}, {order.delivery.state}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-navy-900/40">Estimated delivery</p>
            <p className="mt-1 text-sm text-navy-900/80">{order.estimatedDelivery}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" asChild><Link href="/shop">Continue Shopping</Link></Button>
        <Button asChild><Link href={`/order-confirmation?order=${order.orderNumber}`}>View Order</Link></Button>
      </div>
    </div>
  );
}
