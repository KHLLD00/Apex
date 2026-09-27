"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, CartVariantSelection } from "@/types";
import { PriceDisplay, DiscountBadge, StockBadge, RatingStars } from "@/components/ui/ProductBadges";
import { QuantitySelector } from "@/components/ui/Overlays";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [selectedVariants, setSelectedVariants] = useState<CartVariantSelection>(
    Object.fromEntries((product.variants || []).map((v) => [v.type, v.options[0]]))
  );
  const [quantity, setQuantity] = useState(1);

  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem(product.id, quantity, selectedVariants);
    showToast(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    addItem(product.id, quantity, selectedVariants);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-sm font-medium uppercase tracking-wide text-navy-900/40">{product.brand}</span>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy-900 sm:text-3xl">{product.name}</h1>
        <div className="mt-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PriceDisplay price={product.price} previousPrice={product.previousPrice} size="lg" />
        <DiscountBadge price={product.price} previousPrice={product.previousPrice} />
      </div>

      <StockBadge stock={product.stock} />

      {product.variants?.map((variant) => (
        <div key={variant.type}>
          <span className="text-sm font-medium text-navy-900">{variant.type}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {variant.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.type]: opt }))}
                aria-pressed={selectedVariants[variant.type] === opt}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
                  selectedVariants[variant.type] === opt
                    ? "border-electric-500 bg-electric-500/10 text-electric-600"
                    : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/30"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <span className="text-sm font-medium text-navy-900">Quantity</span>
        <div className="mt-2">
          <QuantitySelector quantity={quantity} onChange={setQuantity} max={Math.max(1, product.stock)} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" variant="outline" className="flex-1" onClick={handleAddToCart} disabled={outOfStock}>
          Add to Cart
        </Button>
        <Button size="lg" className="flex-1" onClick={handleBuyNow} disabled={outOfStock}>
          Buy Now
        </Button>
      </div>
      {outOfStock && <p className="text-sm text-navy-900/50">This item is currently out of stock.</p>}
    </div>
  );
}
