import { Metadata } from "next";
import { ProductExplorer } from "@/components/product/ProductExplorer";
import { Breadcrumb } from "@/components/ui/Overlays";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full Apex Gadgets catalog — smartphones, audio, smart devices, computing and electronics.",
};

export default function ShopPage({ searchParams }: { searchParams: { deal?: string } }) {
  const list = searchParams.deal === "true" ? products.filter((p) => p.deal) : products;
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: searchParams.deal === "true" ? "Deals" : "Shop" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
        {searchParams.deal === "true" ? "Deals" : "Shop All Products"}
      </h1>
      <p className="mt-2 max-w-xl text-navy-900/60">
        {searchParams.deal === "true"
          ? "Limited-time price drops across the catalog."
          : "Find the right device with search, filters and sorting built for real decisions."}
      </p>
      <div className="mt-8">
        <ProductExplorer products={list} />
      </div>
    </div>
  );
}
