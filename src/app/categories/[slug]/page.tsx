import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Overlays";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { getCatalogCategories, getCatalogProductsByCategory } from "@/lib/backend/catalog";
import type { Category } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const categories = await getCatalogCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return {};
  return { title: category.name, description: category.description ?? undefined };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categories = await getCatalogCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const categoryProducts = await getCatalogProductsByCategory(params.slug as Category);

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">{category.name}</h1>
      <p className="mt-2 max-w-xl text-navy-900/60">{category.description}</p>
      <p className="mt-1 text-sm text-navy-900/40">{categoryProducts.length} products</p>
      <div className="mt-8"><ProductExplorer products={categoryProducts} hideCategoryFilter /></div>
    </div>
  );
}
