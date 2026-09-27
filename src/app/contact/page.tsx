"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/ui/Overlays";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent — we'll reply within 1 business day.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">Contact Us</h1>
      <p className="mt-2 max-w-xl text-navy-900/60">Have a question about an order or a product? Reach us any of these ways.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-sm font-semibold text-navy-900">Phone</h3>
            <p className="mt-1 text-sm text-navy-900/60">+234 800 123 4567</p>
          </div>
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-sm font-semibold text-navy-900">Email</h3>
            <p className="mt-1 text-sm text-navy-900/60">support@apexgadgets.ng</p>
          </div>
          <a
            href="https://wa.me/2348001234567"
            className="flex items-center justify-between rounded-xl2 bg-emerald-500 p-5 text-white transition-colors hover:bg-emerald-600"
          >
            <div>
              <h3 className="font-display text-sm font-semibold">Chat on WhatsApp</h3>
              <p className="mt-1 text-sm text-white/80">Usually replies within minutes</p>
            </div>
            <span aria-hidden>→</span>
          </a>
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-sm font-semibold text-navy-900">Business Hours</h3>
            <p className="mt-1 text-sm text-navy-900/60">Mon–Sat: 8am – 7pm<br />Sunday: Closed</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl2 border border-navy-900/10 p-6">
          <Input label="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-navy-900">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="rounded-lg border border-navy-900/15 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-electric-500"
            />
          </div>
          <Button type="submit" size="lg">Send Message</Button>
          {submitted && <p className="text-sm text-emerald-700">Thanks — this is a simulated submission for demo purposes.</p>}
        </form>
      </div>
    </div>
  );
}
