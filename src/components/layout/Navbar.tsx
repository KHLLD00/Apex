"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Deals", href: "/shop?deal=true" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, hasHydrated } = useCart();

  const openCart = () => window.dispatchEvent(new CustomEvent("apex:open-cart"));

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:bg-navy-900/5"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-navy-900" />
              <span className="h-0.5 w-5 bg-navy-900" />
              <span className="h-0.5 w-5 bg-navy-900" />
            </div>
          </button>
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-navy-900">
            Apex<span className="text-electric-500">Gadgets</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-navy-900/70 hover:text-electric-500 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={openCart}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-navy-900/5"
          aria-label={`Cart, ${itemCount} items`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-navy-900">
            <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="21" r="1.4" />
            <circle cx="17" cy="21" r="1.4" />
          </svg>
          {hasHydrated && itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-electric-500 px-1 text-[10px] font-semibold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-navy-900/10 bg-paper animate-fade-in">
          <nav className="container-page flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-navy-900 hover:bg-navy-900/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-navy-900/10 pt-2">
              <span className="px-2 text-xs font-medium uppercase tracking-wide text-navy-900/40">Categories</span>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={cn("block rounded-lg px-2 py-2 text-sm text-navy-900/80 hover:bg-navy-900/5")}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
