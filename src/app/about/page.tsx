import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Overlays";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Apex Gadgets — a fictional Nigerian electronics retailer built as a portfolio project.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
            Electronics, chosen with care.
          </h1>
          <p className="mt-5 text-navy-900/70 leading-relaxed">
            Apex Gadgets started with a simple idea: buying electronics online in Nigeria shouldn&rsquo;t mean guessing whether the product is genuine, whether the price is fair, or whether it will actually arrive. We built a store around getting those three things right, every time.
          </p>
          <p className="mt-4 text-navy-900/70 leading-relaxed">
            From smartphones to smart home devices, everything we list is picked for a reason — reliability, value, or both. We work directly with trusted brands and keep our catalog focused rather than flooded, so every product page means something.
          </p>
          <h2 className="mt-8 font-display text-xl font-semibold text-navy-900">What we offer</h2>
          <ul className="mt-3 flex flex-col gap-2 text-navy-900/70">
            <li>Smartphones, audio, smart devices, computing gear and everyday electronics</li>
            <li>Transparent pricing with no hidden charges at checkout</li>
            <li>Delivery to all 36 states and the FCT</li>
          </ul>
          <h2 className="mt-8 font-display text-xl font-semibold text-navy-900">What we stand for</h2>
          <p className="mt-3 text-navy-900/70 leading-relaxed">
            Customers come first — in the products we stock, the support we offer, and how simple we try to make every order. We&rsquo;d rather sell you the right device than the most expensive one.
          </p>
          <p className="mt-8 text-xs text-navy-900/40">
            Apex Gadgets is a fictional brand created for demonstration purposes. No real transactions take place on this site.
          </p>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-xl2">
          <Image
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"
            alt="Electronics on display"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
