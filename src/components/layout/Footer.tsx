"use client";

"use client";

import Link from "next/link";
import { categories } from "@/data/categories";

export function Footer() {
  return (
    <footer className="border-t border-navy-900/10 bg-navy-950 text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <span className="font-display text-xl font-bold">
            Apex<span className="text-cyan-400">Gadgets</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Technology that fits your life — smartphones, audio, smart devices and more, delivered nationwide.
          </p>
          <form
            
            className="mt-5 flex max-w-xs gap-2"
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-cyan-400"
            />
            <button className="shrink-0 rounded-lg bg-electric-500 px-4 py-2 text-sm font-medium hover:bg-electric-600 transition-colors">
              Join
            </button>
          </form>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90">Shop</h4>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-cyan-400 transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90">Company</h4>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60">
            <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
            <li><Link href="/delivery" className="hover:text-cyan-400 transition-colors">Delivery information</Link></li>
            <li><Link href="/returns" className="hover:text-cyan-400 transition-colors">Returns &amp; refunds</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90">Legal</h4>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60">
            <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms &amp; conditions</Link></li>
          </ul>
          <div className="mt-5 flex gap-3">
            {["Instagram", "X", "Facebook"].map((s) => (
              <a key={s} href="#" aria-label={s} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs hover:bg-cyan-400 hover:text-navy-950 transition-colors">
                {s[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <p className="container-page text-xs text-white/40">
          © {new Date().getFullYear()} Apex Gadgets. A fictional store built for demonstration purposes — not a real business.
        </p>
      </div>
    </footer>
  );
}
