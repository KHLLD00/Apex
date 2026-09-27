import { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <ContentPage
      title="Returns & Refunds"
      intro="Review the condition and eligibility requirements before requesting a return."
      sections={[
        { heading: "Return eligibility", body: "Return eligibility depends on the item, its condition and the reason for the request. Products should be returned with their original packaging, accessories and documentation where applicable." },
        { heading: "Device condition", body: "Keep devices unused and undamaged where a change-of-mind return is permitted. Do not remove serial-number labels or alter the product before contacting support." },
        { heading: "Faulty or damaged items", body: "If a product arrives damaged or develops a fault, contact support with your order details and clear photos or video where useful. We will advise on the next step." },
        { heading: "Refunds", body: "Approved refunds are processed after the returned item has been received and assessed. The final timing can depend on the original payment method and financial institution." },
        { heading: "Manufacturer warranty", body: "Where a product carries a manufacturer warranty, warranty terms are determined by the manufacturer and may differ from Apex Gadgets' return process." },
      ]}
    />
  );
}