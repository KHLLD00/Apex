"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { PriceDisplay, DiscountBadge, StockBadge } from "@/components/ui/ProductBadges";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const hasVariants = product.variants && product.variants.length > 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0 || hasVariants) return; // variant products go through product page
    addItem(product.id, 1, {});
    showToast(`${product.name} added to cart`);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl2 bg-navy-900/5">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          <DiscountBadge price={product.price} previousPrice={product.previousPrice} />
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-navy-900/40">{product.brand}</span>
        <h3 className="line-clamp-2 text-sm font-medium text-navy-900 group-hover:text-electric-500 transition-colors">
          {product.name}
        </h3>
        <PriceDisplay price={product.price} previousPrice={product.previousPrice} size="sm" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <StockBadge stock={product.stock} />
          {!hasVariants && product.stock > 0 && (
            <button
              onClick={quickAdd}
              className="rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-electric-500 sm:opacity-100"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
