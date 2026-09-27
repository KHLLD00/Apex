import { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms & Conditions"
      intro="The terms governing use of this demonstration website."
      sections={[
        { heading: "About this site", body: "Apex Gadgets is a fictional storefront built to demonstrate a complete e-commerce shopping experience. It is not a real business, and no real products are sold." },
        { heading: "Simulated transactions", body: "All payments on this site are simulated. No real card or payment details are collected, and no real charges are made." },
        { heading: "Product information", body: "Products, pricing, stock levels and reviews shown on this site are mock data created for demonstration purposes and do not reflect real inventory." },
        { heading: "Use of the site", body: "This site is provided for demonstration and portfolio purposes. It should not be used to attempt real purchases or to submit real payment information." },
        { heading: "Changes to these terms", body: "As a demo project, these terms may be updated at any time without notice." },
      ]}
    />
  );
}
