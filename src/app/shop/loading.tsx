import { ProductGridSkeleton } from "@/components/ui/States";

export default function Loading() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="skeleton mb-6 h-8 w-64 rounded" />
      <ProductGridSkeleton />
    </div>
  );
}
