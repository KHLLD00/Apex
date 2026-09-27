import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Overlays";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { categories, getCategory } from "@/data/categories";
import { products } from "@/data/products";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategory(params.slug);
  if (!category) return {};
  return { title: category.name, description: category.description };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.category === category.slug);

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{category.name}</h1>
      <p className="mt-2 max-w-xl text-navy-900/60">{category.description}</p>
      <p className="mt-1 text-sm text-navy-900/40">{categoryProducts.length} products</p>
      <div className="mt-8">
        <ProductExplorer products={categoryProducts} hideCategoryFilter />
      </div>
    </div>
  );
}
