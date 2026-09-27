"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { formatNaira, generateOrderNumber, NIGERIAN_STATES } from "@/lib/utils";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { Order } from "@/types";
import Link from "next/link";

type PaymentState = "idle" | "processing" | "success" | "failed";

export function CheckoutFlow() {
  const router = useRouter();
  const { items, subtotal, discount, appliedCoupon, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const deliveryFee = deliveryMethod === "express" ? 6500 : subtotal >= 50000 ? 0 : 3500;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  if (items.length === 0 && paymentState === "idle") {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a few products before heading to checkout."
        action={<Button asChild><Link href="/shop">Continue shopping</Link></Button>}
      />
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!/^[0-9+\s]{7,15}$/.test(phone)) next.phone = "Enter a valid phone number.";
    if (!state) next.state = "Select your state.";
    if (!lga.trim()) next.lga = "Enter your LGA.";
    if (!address.trim()) next.address = "Enter your delivery address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setPaymentState("processing");

    setTimeout(() => {
      // Simulated outcome: ~85% success rate for a realistic demo
      const success = Math.random() > 0.15;
      if (!success) {
        setPaymentState("failed");
        return;
      }
      const orderNumber = generateOrderNumber();
      const order: Order = {
        orderNumber,
        createdAt: new Date().toISOString(),
        customer: { fullName, email, phone },
        delivery: { state, lga, address, instructions, method: deliveryMethod },
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentStatus: "paid",
        status: "confirmed",
        estimatedDelivery:
          deliveryMethod === "express" ? "Within 24–48 hours" : "2–5 business days",
      };
      try {
        localStorage.setItem(`apex-order-${orderNumber}`, JSON.stringify(order));
      } catch {
        // ignore storage failure; still proceed with in-memory redirect
      }
      setPaymentState("success");
      clearCart();
      setTimeout(() => router.push(`/order-confirmation?order=${orderNumber}`), 600);
    }, 1800);
  };

  if (paymentState === "processing") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-navy-900/15 border-t-electric-500" />
        <p className="text-navy-900/70">Processing your payment…</p>
      </div>
    );
  }

  if (paymentState === "failed") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl2 border border-red-200 bg-red-50 py-16 text-center">
        <h2 className="font-display text-xl font-semibold text-red-700">Payment failed</h2>
        <p className="max-w-sm text-sm text-red-600/80">
          Your simulated payment couldn&rsquo;t be completed. No charge was made — you can try again.
        </p>
        <Button onClick={() => setPaymentState("idle")}>Retry Payment</Button>
      </div>
    );
  }

  if (paymentState === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</div>
        <h2 className="font-display text-xl font-semibold text-navy-900">Payment successful</h2>
        <p className="text-sm text-navy-900/60">Redirecting to your order confirmation…</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-10">
        <section>
          <h2 className="font-display text-lg font-semibold text-navy-900">Customer Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} className="sm:col-span-2" />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-navy-900">Delivery Information</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select
              label="State"
              placeholder="Select state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              error={errors.state}
              options={NIGERIAN_STATES.map((s) => ({ label: s, value: s }))}
            />
            <Input label="LGA" value={lga} onChange={(e) => setLga(e.target.value)} error={errors.lga} />
            <Input label="Full address" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} className="sm:col-span-2" />
            <Input label="Delivery instructions (optional)" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="sm:col-span-2" />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-navy-900">Delivery Method</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {[
              { id: "standard", label: "Standard Delivery", desc: "2–5 business days", price: subtotal >= 50000 ? 0 : 3500 },
              { id: "express", label: "Express Delivery", desc: "24–48 hours (major cities)", price: 6500 },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDeliveryMethod(opt.id as "standard" | "express")}
                className={`flex-1 rounded-xl2 border p-4 text-left transition-colors ${
                  deliveryMethod === opt.id ? "border-electric-500 bg-electric-500/5" : "border-navy-900/15 hover:border-navy-900/30"
                }`}
              >
                <span className="block text-sm font-medium text-navy-900">{opt.label}</span>
                <span className="block text-xs text-navy-900/50">{opt.desc}</span>
                <span className="mt-1.5 block text-sm font-semibold text-navy-900">
                  {opt.price === 0 ? "Free" : formatNaira(opt.price)}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-navy-900">Payment</h2>
          <div className="mt-4 rounded-xl2 border border-navy-900/15 p-4">
            <p className="text-sm text-navy-900/60">
              This is a simulated payment for demonstration purposes only. No real card details are collected or processed.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input label="Card number" placeholder="4242 4242 4242 4242" disabled />
              <Input label="Expiry" placeholder="MM/YY" disabled />
            </div>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-xl2 border border-navy-900/10 p-5">
        <h2 className="font-display text-base font-semibold text-navy-900">Order Summary</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item, idx) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <li key={idx} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-navy-900/5">
                  <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium text-navy-900">{product.name}</p>
                  <p className="text-navy-900/50">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-navy-900">{formatNaira(product.price * item.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex flex-col gap-1.5 border-t border-navy-900/10 pt-4 text-sm">
          <div className="flex justify-between text-navy-900/70"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-700"><span>Discount {appliedCoupon && `(${appliedCoupon.code})`}</span><span>−{formatNaira(discount)}</span></div>
          )}
          <div className="flex justify-between text-navy-900/70"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}</span></div>
          <div className="flex justify-between border-t border-navy-900/10 pt-2 text-base font-semibold text-navy-900"><span>Total</span><span>{formatNaira(total)}</span></div>
        </div>
        <Button size="lg" className="mt-5 w-full" onClick={handlePay}>
          Pay {formatNaira(total)}
        </Button>
      </aside>
    </div>
  );
}
