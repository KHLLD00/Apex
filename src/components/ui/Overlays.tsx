"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-navy-950/60" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-md rounded-xl2 bg-white p-6 shadow-soft">
        {title && <h3 className="mb-3 text-lg font-semibold text-navy-900">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-navy-900/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.href ? (
              <Link href={item.href} className="hover:text-electric-500 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-navy-900">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-navy-900/30">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg px-3 py-2 text-sm font-medium text-navy-900 hover:bg-navy-900/5 disabled:opacity-30"
        aria-label="Previous page"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
            p === page ? "bg-electric-500 text-white" : "text-navy-900 hover:bg-navy-900/5"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg px-3 py-2 text-sm font-medium text-navy-900 hover:bg-navy-900/5 disabled:opacity-30"
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

export function QuantitySelector({ quantity, onChange, max = 99 }: { quantity: number; onChange: (q: number) => void; max?: number }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-navy-900/15">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className="flex h-10 w-10 items-center justify-center text-navy-900 hover:bg-navy-900/5 rounded-l-lg transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-navy-900" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="flex h-10 w-10 items-center justify-center text-navy-900 hover:bg-navy-900/5 rounded-r-lg transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
