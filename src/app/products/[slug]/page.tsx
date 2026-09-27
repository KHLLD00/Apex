import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductGrid } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/ui/Overlays";
import { getProduct, getRelated, products } from "@/data/products";
import { getCategory } from "@/data/categories";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const related = getRelated(product);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page py-8 sm:py-12">
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-display text-xl font-semibold text-navy-900">Description</h2>
          <p className="mt-3 text-navy-900/70 leading-relaxed">{product.description}</p>

          <h2 className="mt-10 font-display text-xl font-semibold text-navy-900">Specifications</h2>
          <dl className="mt-3 divide-y divide-navy-900/10 border-y border-navy-900/10">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-4 py-3 text-sm">
                <dt className="text-navy-900/50">{spec.label}</dt>
                <dd className="text-navy-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="flex flex-col gap-6">
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-base font-semibold text-navy-900">Delivery Information</h3>
            <p className="mt-2 text-sm text-navy-900/60">
              Standard delivery in 2–5 business days nationwide. Express delivery available in Lagos, Abuja and Port Harcourt within 24–48 hours.
            </p>
          </div>
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-base font-semibold text-navy-900">Warranty Information</h3>
            <p className="mt-2 text-sm text-navy-900/60">
              Covered by a 12-month limited warranty against manufacturing defects. Accessories carry a 6-month warranty.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl font-semibold text-navy-900">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
