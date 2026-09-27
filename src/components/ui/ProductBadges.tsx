import { formatNaira, discountPercent } from "@/lib/utils";

export function PriceDisplay({ price, previousPrice, size = "md" }: { price: number; previousPrice?: number; size?: "sm" | "md" | "lg" }) {
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-lg";
  const prevSize = size === "lg" ? "text-lg" : "text-xs";
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`font-display font-semibold text-navy-900 ${textSize}`}>{formatNaira(price)}</span>
      {previousPrice && previousPrice > price && (
        <span className={`text-navy-900/40 line-through ${prevSize}`}>{formatNaira(previousPrice)}</span>
      )}
    </div>
  );
}

export function DiscountBadge({ price, previousPrice }: { price: number; previousPrice?: number }) {
  const pct = discountPercent(price, previousPrice);
  if (!pct) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-cyan-500 px-2 py-1 text-xs font-semibold text-navy-950">
      -{pct}%
    </span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center rounded-md bg-navy-900/10 px-2 py-1 text-xs font-medium text-navy-900/60">
        Out of stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        Only {stock} left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
      In stock
    </span>
  );
}

export function RatingStars({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className="flex items-center gap-0.5 text-cyan-500" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < Math.round(rating) ? "currentColor" : "#E2E8F0"}>
            <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
          </svg>
        ))}
      </div>
      <span className="text-navy-900/60">{rating.toFixed(1)}{reviewCount !== undefined && ` (${reviewCount})`}</span>
    </div>
  );
}
