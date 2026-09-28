import Link from "next/link";
import { Hero, TrustSection } from "@/components/layout/Hero";
import { CategoryCard } from "@/components/product/CategoryCard";
import { ProductGrid } from "@/components/product/ProductCard";
import { getCatalogCategories, getCatalogProducts } from "@/lib/backend/catalog";

export default async function HomePage() {
  const [catalogCategories, products] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(),
  ]);

  const categories = catalogCategories.map((category) => ({
    slug: category.slug as any,
    name: category.name,
    description: category.description ?? "",
    image: category.image_url ?? "",
  }));

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);

  return (
    <>
      <Hero />

      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Featured Products</h2>
          <Link href="/shop" className="text-sm font-medium text-electric-500 hover:text-electric-600">View all →</Link>
        </div>
        <ProductGrid products={featured} />
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
