import { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";

export const metadata: Metadata = { title: "Delivery Information" };

export default function DeliveryPage() {
  return (
    <ContentPage
      title="Delivery Information"
      intro="Clear delivery expectations for customers ordering electronics in Nigeria."
      sections={[
        { heading: "Delivery coverage", body: "Delivery availability depends on the destination entered during checkout. We show the applicable delivery method and fee before an order is confirmed." },
        { heading: "Delivery timing", body: "Estimated delivery times can vary by destination, courier availability and the item ordered. Your order confirmation contains the latest estimate for your order." },
        { heading: "Order updates", body: "Keep your order number available when contacting support about delivery. Status updates are shown through the order flow where available." },
        { heading: "Before accepting delivery", body: "Check the package for obvious external damage before accepting it. If an item arrives damaged, contact support as soon as possible and keep the packaging." },
        { heading: "Important note", body: "Delivery estimates are not guarantees and may change during weekends, public holidays or periods of unusually high demand." },
      ]}
    />
  );
}