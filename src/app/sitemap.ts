import { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://apexgadgets.ng";
  const staticPages = [
    "", "/shop", "/about", "/contact", "/delivery", "/returns", "/privacy", "/terms",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  const categoryPages = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: new Date(),
  }));

  const productPages = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.createdAt,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
