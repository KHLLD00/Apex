"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { products } from "@/data/products";
import { formatNaira } from "@/lib/utils";
import { QuantitySelector } from "@/components/ui/Overlays";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const { items, removeItem, updateQuantity, subtotal, discount, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("apex:open-cart", handler);
    return () => window.removeEventListener("apex:open-cart", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    showToast(result.message, result.success ? "success" : "error");
    if (result.success) setCouponInput("");
  };

  const deliveryEstimate = subtotal > 0 && subtotal < 50000 ? 3500 : subtotal > 0 ? 0 : 0;
  const total = Math.max(0, subtotal - discount + deliveryEstimate);

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-navy-950/50 animate-fade-in" onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="animate-drawer-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-navy-900/10 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-navy-900">Your Cart</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-navy-900/5 text-navy-900">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              title="Your cart is empty"
              description="Browse the shop and add something you'll love."
              action={<Button onClick={() => setOpen(false)} asChild><Link href="/shop">Continue shopping</Link></Button>}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-5">
                {items.map((item, idx) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <li key={idx} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-navy-900/5">
                        <Image src={product.images[0]} alt={product.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <Link href={`/products/${product.slug}`} onClick={() => setOpen(false)} className="text-sm font-medium text-navy-900 hover:text-electric-500 line-clamp-1">
                          {product.name}
                        </Link>
                        {Object.keys(item.selectedVariants).length > 0 && (
                          <p className="text-xs text-navy-900/50">
                            {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <QuantitySelector
                            quantity={item.quantity}
                            onChange={(q) => updateQuantity(item.productId, item.selectedVariants, q)}
                          />
                          <span className="text-sm font-semibold text-navy-900">{formatNaira(product.price * item.quantity)}</span>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(item.productId, item.selectedVariants);
                            showToast(`${product.name} removed from cart`, "info");
                          }}
                          className="mt-1 self-start text-xs text-navy-900/50 hover:text-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-navy-900/10 px-5 py-4">
              {appliedCoupon ? (
                <div className="mb-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm">
                  <span className="text-emerald-800 font-medium">Coupon &ldquo;{appliedCoupon.code}&rdquo; applied</span>
                  <button onClick={removeCoupon} className="text-emerald-700 hover:underline text-xs">Remove</button>
                </div>
              ) : (
                <div className="mb-3 flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-navy-900/70">
                  <span>Subtotal</span><span>{formatNaira(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span><span>−{formatNaira(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-navy-900/70">
                  <span>Delivery</span><span>{deliveryEstimate === 0 ? "Free" : formatNaira(deliveryEstimate)}</span>
                </div>
                <div className="flex justify-between border-t border-navy-900/10 pt-2 text-base font-semibold text-navy-900">
                  <span>Total</span><span>{formatNaira(total)}</span>
                </div>
              </div>

              <Button className="mt-4 w-full" size="lg" asChild onClick={() => setOpen(false)}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
