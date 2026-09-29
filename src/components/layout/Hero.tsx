import Image from "next/image";
import Link from "next/link";

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  const background = imageUrl || "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=1800";

  return (
    <section className="relative isolate min-h-[620px] overflow-hidden bg-navy-950">
      <Image
        src={background}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/10" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-electric-500/20 blur-[120px]" />

      <div className="container-page relative flex min-h-[620px] items-center py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300 backdrop-blur-sm">
            New arrivals
          </span>

          <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Upgrade Your Everyday
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-white/70 sm:text-lg">
            Premium tech. Real value. Delivered across Nigeria.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-lg bg-electric-500 px-7 py-3.5 text-base font-medium text-white shadow-soft transition-all duration-150 hover:bg-electric-600 active:scale-[0.98]"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/shop?sort=sale"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
            >
              Explore Deals
            </Link>
          </div>

          <p className="mt-6 text-xs font-medium tracking-wide text-white/50">
            Fast delivery <span className="mx-2">•</span> Secure checkout <span className="mx-2">•</span> ₦ pricing
          </p>
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
