import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Variant } from "@/types";

type CategoryRow = {
  id: string;
  name: string;
  slug: Category;
  description: string | null;
  image_url: string | null;
};

type ProductRow = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number | string;
  sale_price: number | string | null;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  created_at: string;
  categories: CategoryRow | CategoryRow[] | null;
  product_images: Array<{ image_url: string; alt_text: string; sort_order: number }> | null;
  product_variants: Array<{
    id: string;
    name: string;
    price: number | string;
    sale_price: number | string | null;
    stock_quantity: number;
    attributes: Record<string, string[]>;
  }> | null;
};

const asNumber = (value: number | string | null | undefined) =>
  value == null ? 0 : Number(value);

function singleCategory(value: CategoryRow | CategoryRow[] | null): CategoryRow | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function mapVariants(rows: ProductRow["product_variants"]): Variant[] | undefined {
  const optionMap = new Map<string, string[]>();

  for (const row of rows ?? []) {
    for (const [type, options] of Object.entries(row.attributes ?? {})) {
      const key = type === "Color" || type === "Storage" || type === "Size" ? type : type;
      const current = optionMap.get(key) ?? [];
      for (const option of options) {
        if (!current.includes(option)) current.push(option);
      }
      optionMap.set(key, current);
    }
  }

  const variants = Array.from(optionMap.entries()).map(([type, options]) => ({
    type: type as Variant["type"],
    options,
  }));

  return variants.length ? variants : undefined;
}

function mapProduct(row: ProductRow): Product {
  const category = singleCategory(row.categories);
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.image_url);

  const variantRows = row.product_variants ?? [];
  const firstVariant = variantRows[0];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: category?.slug ?? "electronics",
    price: asNumber(firstVariant?.sale_price ?? firstVariant?.price ?? row.sale_price ?? row.price),
    previousPrice: row.sale_price ? asNumber(row.price) : undefined,
    images: images.length ? images : [category?.image_url ?? "/placeholder-product.svg"],
    rating: 0,
    reviewCount: 0,
    stock: firstVariant ? firstVariant.stock_quantity : row.stock_quantity,
    featured: row.is_featured,
    bestSeller: row.is_bestseller,
    description: row.description,
    specs: [],
    variants: mapVariants(variantRows),
    createdAt: row.created_at,
  };
}

const productSelect = `
  id,
  category_id,
  name,
  slug,
  brand,
  description,
  price,
  sale_price,
  sku,
  stock_quantity,
  is_featured,
  is_bestseller,
  is_new,
  created_at,
  categories!inner(id,name,slug,description,image_url),
  product_images(image_url,alt_text,sort_order),
  product_variants(id,name,price,sale_price,stock_quantity,attributes)
`;

export async function getCatalogProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Unable to load catalog: ${error.message}`);
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function getCatalogCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description,image_url")
    .eq("is_active", true)
    .order("name");

  if (error) throw new Error(`Unable to load categories: ${error.message}`);
  return (data ?? []) as CategoryRow[];
}

export async function getCatalogProduct(slug: string): Promise<Product | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Unable to load product: ${error.message}`);
  return data ? mapProduct(data as ProductRow) : undefined;
}

export async function getCatalogProductsByCategory(slug: Category): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .eq("categories.slug", slug)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Unable to load category products: ${error.message}`);
  return (data ?? []).map((row) => mapProduct(row as ProductRow));
}

export async function getRelatedCatalogProducts(product: Product): Promise<Product[]> {
  const products = await getCatalogProductsByCategory(product.category);
  return products.filter((item) => item.id !== product.id).slice(0, 4);
}
