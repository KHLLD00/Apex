import { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";

export const metadata: Metadata = { title: "Delivery Information" };

export default function DeliveryPage() {
  return (
    <ContentPage
      title="Delivery Information"
      intro="How orders move from checkout to your door, wherever you are in Nigeria."
      sections={[
        { heading: "Delivery coverage", body: "We deliver to all 36 states and the FCT. Delivery timelines vary by location — major cities generally see faster delivery windows than more remote areas." },
        { heading: "Standard delivery", body: "Standard delivery typically arrives within 2–5 business days from when your order is confirmed. This option is free on orders above ₦50,000." },
        { heading: "Express delivery", body: "Express delivery is available in Lagos, Abuja and Port Harcourt, with orders typically arriving within 24–48 hours for a flat fee." },
        { heading: "Order tracking", body: "You'll receive updates on your order status as it moves from processing to delivery. Your order confirmation page is the fastest way to check current status." },
        { heading: "Delivery issues", body: "If a delivery is delayed or an item arrives damaged, contact support with your order number and we'll help sort it out." },
      ]}
    />
  );
}
