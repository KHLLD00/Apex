import { Category } from "@/types";

export interface CategoryMeta {
  slug: Category;
  name: string;
  description: string;
  image: string;
}

export const categories: CategoryMeta[] = [
  { slug: "smartphones", name: "Smartphones", description: "Current iPhone, Galaxy, Pixel, Xiaomi and Redmi phones.", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800" },
  { slug: "phone-accessories", name: "Phone Accessories", description: "Chargers, cables, cases and everyday essentials for your devices.", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=800" },
  { slug: "audio", name: "Audio", description: "Current AirPods, Galaxy Buds and premium headphones.", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800" },
  { slug: "smart-devices", name: "Smart Devices", description: "Apple Watch and Galaxy Watch devices for connected everyday life.", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=800" },
  { slug: "computing", name: "Computing", description: "MacBook, iPad and Galaxy devices for work, study and creativity.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800" },
  { slug: "electronics", name: "Electronics", description: "Power, charging and useful electronics from established brands.", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800" },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);