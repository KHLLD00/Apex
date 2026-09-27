import Image from "next/image";
import Link from "next/link";
import { CategoryMeta } from "@/data/categories";

export function CategoryCard({ category }: { category: CategoryMeta }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl2 bg-navy-900"
    >
      <Image
        src={category.image}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, 33vw"
        className="object-cover opacity-70 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
      <div className="relative p-5">
        <h3 className="font-display text-lg font-semibold text-white">{category.name}</h3>
        <span className="mt-1 inline-block text-sm text-white/70 group-hover:text-cyan-400 transition-colors">
          Shop now
        </span>
      </div>
    </Link>
  );
}
