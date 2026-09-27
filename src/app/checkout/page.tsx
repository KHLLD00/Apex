import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Overlays";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }, { label: "Checkout" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-900">Checkout</h1>
      <div className="mt-8">
        <CheckoutFlow />
      </div>
    </div>
  );
}
