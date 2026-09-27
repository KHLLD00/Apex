import { Category } from "@/types";

export interface CategoryMeta {
  slug: Category;
  name: string;
  description: string;
  image: string;
}

export const categories: CategoryMeta[] = [
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "Flagship and budget phones from the brands Nigerians trust most.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
  },
  {
    slug: "phone-accessories",
    name: "Phone Accessories",
    description: "Cases, chargers, cables and screen protection for every device.",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=800",
  },
  {
    slug: "audio",
    name: "Audio",
    description: "Earbuds, headphones and speakers built for how you actually listen.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800",
  },
  {
    slug: "smart-devices",
    name: "Smart Devices",
    description: "Smartwatches, trackers and home devices that keep you connected.",
    image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=800",
  },
  {
    slug: "computing",
    name: "Computing",
    description: "Laptops, accessories and peripherals for work and play.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800",
  },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Power banks, TVs and everyday electronics for the home.",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800",
  },
];

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);
