import { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <ContentPage
      title="Returns & Refunds"
      intro="What to expect if a product isn't right for you."
      sections={[
        { heading: "Return window", body: "Most items can be returned within 7 days of delivery, provided they're unused, in their original packaging, and include all accessories." },
        { heading: "Non-returnable items", body: "For hygiene and security reasons, opened earbuds/headphones and items with removed security seals are not eligible for return." },
        { heading: "How refunds work", body: "Once a returned item is received and inspected, refunds are processed to the original payment method within 5–7 business days." },
        { heading: "Faulty or damaged items", body: "If an item arrives faulty or damaged, contact support with photos and your order number — we'll arrange a replacement or refund at no extra cost." },
        { heading: "Warranty claims", body: "Manufacturer warranty claims are handled separately from returns — see the warranty information on each product page for coverage details." },
      ]}
    />
  );
}
