import Image from "next/image";
import Link from "next/link";

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  const background = imageUrl || "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=1800";

  return (
    <section className="relative isolate min-h-[600px] overflow-hidden bg-navy-950 sm:min-h-[620px]">
      <Image
        src={background}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-950/65 to-navy-950/90 sm:bg-gradient-to-r sm:from-navy-950 sm:via-navy-950/85 sm:to-navy-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-navy-950/20" />
      <div className="pointer-events-none absolute -right-48 -top-20 h-[420px] w-[420px] rounded-full bg-electric-500/15 blur-[100px] sm:-right-40 sm:top-0 sm:h-[520px] sm:w-[520px]" />

      <div className="container-page relative flex min-h-[600px] items-center py-14 sm:min-h-[620px] sm:py-20 lg:py-24">
        <div className="w-full max-w-2xl">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300 backdrop-blur-sm sm:px-3.5 sm:text-xs sm:tracking-[0.16em]">
            New arrivals
          </span>

          <h1 className="mt-4 max-w-[340px] font-display text-[2.65rem] font-semibold leading-[0.98] tracking-tight text-white sm:mt-5 sm:max-w-xl sm:text-6xl sm:leading-[1.02] lg:text-7xl">
            Upgrade Your Everyday
          </h1>

          <p className="mt-4 max-w-[330px] text-sm leading-6 text-white/70 sm:mt-5 sm:max-w-lg sm:text-lg sm:leading-7">
            Premium tech. Real value. Delivered across Nigeria.
          </p>

          <div className="mt-6 grid max-w-[330px] grid-cols-1 gap-2.5 sm:mt-8 sm:flex sm:max-w-none sm:flex-wrap sm:gap-3">
            <Link
              href="/shop"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-electric-500 px-6 py-3 text-sm font-medium text-white shadow-soft transition-all duration-150 hover:bg-electric-600 active:scale-[0.98] sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/shop?sort=sale"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/10 active:scale-[0.98] sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
            >
              Explore Deals
            </Link>
          </div>

          <p className="mt-5 text-[11px] font-medium tracking-wide text-white/50 sm:mt-6 sm:text-xs">
            Fast delivery <span className="mx-1.5 sm:mx-2">•</span> Secure checkout <span className="mx-1.5 sm:mx-2">•</span> ₦ pricing
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
