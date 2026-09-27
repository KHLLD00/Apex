import Link from "next/link";
import { Hero, TrustSection } from "@/components/layout/Hero";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ProductGrid } from "@/components/product/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const deals = products.filter((p) => p.deal).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <>
      <Hero />

      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Featured Products</h2>
          <Link href="/shop" className="text-sm font-medium text-electric-500 hover:text-electric-600">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="bg-navy-950 py-14 sm:py-20">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Deals</h2>
              <p className="mt-1.5 text-sm text-white/50">Limited-time price drops on select gear.</p>
            </div>
            <Link href="/shop?deal=true" className="text-sm font-medium text-cyan-400 hover:text-cyan-300">
              See all deals →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {deals.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group rounded-xl2 bg-navy-900 p-4 transition-colors hover:bg-navy-800">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-navy-950">
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <p className="mt-3 line-clamp-1 text-sm font-medium text-white">{p.name}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display font-semibold text-cyan-400">₦{p.price.toLocaleString()}</span>
                  {p.previousPrice && <span className="text-xs text-white/40 line-through">₦{p.previousPrice.toLocaleString()}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Best Sellers</h2>
        </div>
        <ProductGrid products={bestSellers} />
      </section>

      <TrustSection />
    </>
  );
}
