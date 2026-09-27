"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { CartItem, CartVariantSelection, Coupon } from "@/types";
import { products } from "@/data/products";
import { coupons } from "@/data/coupons";

const CART_KEY = "apex-gadgets-cart";
const COUPON_KEY = "apex-gadgets-coupon";

interface CartContextValue {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addItem: (productId: string, quantity: number, selectedVariants: CartVariantSelection) => void;
  removeItem: (productId: string, selectedVariants: CartVariantSelection) => void;
  updateQuantity: (productId: string, selectedVariants: CartVariantSelection, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  itemCount: number;
  hasHydrated: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function sameVariants(a: CartVariantSelection, b: CartVariantSelection) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => a[k] === b[k]);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      if (rawCart) setItems(JSON.parse(rawCart));
      const rawCoupon = localStorage.getItem(COUPON_KEY);
      if (rawCoupon) setAppliedCoupon(JSON.parse(rawCoupon));
    } catch {
      // ignore corrupted storage
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — cart still works in-memory for this session
    }
  }, [items, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      if (appliedCoupon) localStorage.setItem(COUPON_KEY, JSON.stringify(appliedCoupon));
      else localStorage.removeItem(COUPON_KEY);
    } catch {
      // ignore
    }
  }, [appliedCoupon, hasHydrated]);

  const addItem = useCallback(
    (productId: string, quantity: number, selectedVariants: CartVariantSelection) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === productId && sameVariants(i.selectedVariants, selectedVariants)
        );
        if (existing) {
          return prev.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { productId, quantity, selectedVariants }];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, selectedVariants: CartVariantSelection) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && sameVariants(i.selectedVariants, selectedVariants))
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, selectedVariants: CartVariantSelection, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (i) => !(i.productId === productId && sameVariants(i.selectedVariants, selectedVariants))
          );
        }
        return prev.map((i) =>
          i.productId === productId && sameVariants(i.selectedVariants, selectedVariants)
            ? { ...i, quantity }
            : i
        );
      });
    },
    []
  );

  const applyCoupon = useCallback(
    (code: string): { success: boolean; message: string } => {
      const normalized = code.trim().toUpperCase();
      const found = coupons.find((c) => c.code === normalized);
      if (!found) {
        return { success: false, message: "That coupon code isn't valid. Check for typos and try again." };
      }
      const currentSubtotal = items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
      if (found.minSubtotal && currentSubtotal < found.minSubtotal) {
        return {
          success: false,
          message: `Add more to your cart — this code needs a subtotal of at least ${new Intl.NumberFormat(
            "en-NG",
            { style: "currency", currency: "NGN", maximumFractionDigits: 0 }
          ).format(found.minSubtotal)}.`,
        };
      }
      setAppliedCoupon(found);
      return { success: true, message: "Coupon applied." };
    },
    [items]
  );

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.code === "FREESHIP") return 0; // discount applied to delivery, not subtotal
    if (appliedCoupon.type === "percent") return Math.round((subtotal * appliedCoupon.value) / 100);
    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        subtotal,
        discount,
        itemCount,
        hasHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
