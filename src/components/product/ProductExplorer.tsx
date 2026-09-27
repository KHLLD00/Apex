"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types";
import { ProductGrid } from "./ProductCard";
import { Pagination } from "@/components/ui/Overlays";
import { EmptyState } from "@/components/ui/States";
import { Select, Input } from "@/components/ui/Input";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 8;

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "popular";

export function ProductExplorer({ products, hideCategoryFilter = false }: { products: Product[]; hideCategoryFilter?: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [page, setPage] = useState(1);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const categoryOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !`${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (inStockOnly && p.stock === 0) return false;
      return true;
    });

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, search, category, brand, maxPrice, inStockOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setSearch(""); setCategory(""); setBrand(""); setMaxPrice(""); setInStockOnly(false); setSort("featured"); setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-5">
        <Input
          label="Search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        {!hideCategoryFilter && (
          <Select
            label="Category"
            placeholder="All categories"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            options={categoryOptions.map((c) => ({ label: c.replace("-", " "), value: c }))}
          />
        )}
        <Select
          label="Brand"
          placeholder="All brands"
          value={brand}
          onChange={(e) => { setBrand(e.target.value); setPage(1); }}
          options={brands.map((b) => ({ label: b, value: b }))}
        />
        <Input
          label="Max price"
          type="number"
          placeholder="Any price"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
        />
        <label className="flex items-center gap-2 text-sm text-navy-900">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
            className="h-4 w-4 rounded border-navy-900/30 text-electric-500 focus:ring-electric-500"
          />
          In stock only
        </label>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="self-start">
          Clear filters
        </Button>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-navy-900/60">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          <Select
            aria-label="Sort by"
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
            options={[
              { label: "Sort: Featured", value: "featured" },
              { label: "Sort: Newest", value: "newest" },
              { label: "Sort: Price — Low to High", value: "price-asc" },
              { label: "Sort: Price — High to Low", value: "price-desc" },
              { label: "Sort: Most Popular", value: "popular" },
            ]}
          />
        </div>

        {pageItems.length === 0 ? (
          <EmptyState
            title="No products match your filters"
            description="Try widening your search or clearing a filter."
            action={<Button variant="outline" onClick={resetFilters}>Clear filters</Button>}
          />
        ) : (
          <>
            <ProductGrid products={pageItems} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
        {maxPrice && (
          <p className="mt-3 text-xs text-navy-900/40">Showing products up to {formatNaira(Number(maxPrice))}</p>
        )}
      </div>
    </div>
  );
}
