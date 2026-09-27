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
    showToast("Thanks — your message has been received.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">Talk to Apex Gadgets</h1>
      <p className="mt-2 max-w-xl text-navy-900/60">Need help choosing a device, checking an order or understanding a specification? Send us a message.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-sm font-semibold text-navy-900">Product questions</h3>
            <p className="mt-1 text-sm text-navy-900/60">Ask about compatibility, storage options, accessories or device specifications.</p>
          </div>
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-sm font-semibold text-navy-900">Order support</h3>
            <p className="mt-1 text-sm text-navy-900/60">Include your order details when contacting us about an existing purchase.</p>
          </div>
          <div className="rounded-xl2 border border-navy-900/10 p-5">
            <h3 className="font-display text-sm font-semibold text-navy-900">Service area</h3>
            <p className="mt-1 text-sm text-navy-900/60">Online support for customers shopping across Nigeria.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl2 border border-navy-900/10 p-6">
          <Input label="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-navy-900">Message</label>
            <textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-lg border border-navy-900/15 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-electric-500" />
          </div>
          <Button type="submit" size="lg">Send Message</Button>
          {submitted && <p className="text-sm text-emerald-700">Thanks — your message has been received.</p>}
        </form>
      </div>
    </div>
  );
}