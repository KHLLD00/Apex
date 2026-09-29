import Image from "next/image";
import Link from "next/link";

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-electric-500/20 blur-[120px]" />
      <div className="container-page relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-cyan-400">Current devices. Clear choices.</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Shop the tech
            <br />
            you actually want.
          </h1>
          <p className="mt-5 max-w-md text-base text-white/60 sm:text-lg">
            Explore current iPhone, Galaxy, Pixel and other popular devices, plus audio, computing and everyday accessories.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-electric-500 px-7 py-3.5 text-base font-medium text-white shadow-soft transition-all duration-150 hover:bg-electric-600 active:scale-[0.98]"
            >
              Shop Devices
            </Link>
            <Link
              href="/categories/smartphones"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 text-base font-medium text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
            >
              Browse Smartphones
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 lg:aspect-square">
          <Image
            src={imageUrl || "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=1200"}
            alt="Modern smartphone"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const items = [
    { title: "Current Models", desc: "Recognizable devices from major technology brands." },
    { title: "Clear Specifications", desc: "Key storage, display, camera and connectivity details." },
    { title: "Straightforward Shopping", desc: "Compare products before adding them to your cart." },
    { title: "Nigeria-Focused", desc: "Delivery and checkout information designed for local orders." },
  ];
  return (
    <section className="border-y border-navy-900/10 bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="font-display text-sm font-semibold text-navy-900">{item.title}</h3>
            <p className="mt-1.5 text-sm text-navy-900/55">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
