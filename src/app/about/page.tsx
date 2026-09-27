import { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Overlays";

export const metadata: Metadata = {
  title: "About Apex Gadgets",
  description: "Learn about Apex Gadgets and the products we feature across smartphones, audio, computing and everyday electronics.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy-900 sm:text-4xl">A smarter way to shop for tech.</h1>
          <p className="mt-5 text-navy-900/70 leading-relaxed">
            Apex Gadgets is built around a simple idea: make it easier to compare genuine, current devices without having to dig through a dozen product pages to understand what you are buying.
          </p>
          <p className="mt-4 text-navy-900/70 leading-relaxed">
            Our catalogue focuses on recognizable brands and current models across phones, audio, computing and smart devices. Product specifications are presented in plain language so you can make a more informed choice.
          </p>
          <h2 className="mt-8 font-display text-xl font-semibold text-navy-900">What you will find</h2>
          <ul className="mt-3 flex flex-col gap-2 text-navy-900/70">
            <li>Current Apple, Samsung, Google, Xiaomi, Redmi and other major-brand devices</li>
            <li>Clear product specifications, storage options and colour variants</li>
            <li>Delivery information designed for customers across Nigeria</li>
          </ul>
          <h2 className="mt-8 font-display text-xl font-semibold text-navy-900">Our approach</h2>
          <p className="mt-3 text-navy-900/70 leading-relaxed">
            We keep the catalogue focused on products people can actually identify, compare and understand. Prices and availability can change, so the product page is the best place to confirm the latest listing before checkout.
          </p>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-xl2">
          <Image src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000" alt="Modern consumer electronics" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    </div>
  );
}