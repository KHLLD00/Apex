import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-electric-500/20 blur-[120px]" />
      <div className="container-page relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Technology that
            <br />
            fits your life.
          </h1>
          <p className="mt-5 max-w-md text-base text-white/60 sm:text-lg">
            Smartphones, audio, smart devices and computing gear — sourced for quality, priced fairly, delivered nationwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/shop?deal=true">Explore Deals</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl2 lg:aspect-square">
          <Image
            src="https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=1200"
            alt="Latest smartphone from Apex Gadgets"
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
    { title: "Nationwide Delivery", desc: "We deliver to all 36 states and the FCT." },
    { title: "Secure Checkout", desc: "Your information stays protected, every order." },
    { title: "Quality Products", desc: "Every item is checked before it ships." },
    { title: "Customer Support", desc: "Real people, ready to help by phone or chat." },
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
