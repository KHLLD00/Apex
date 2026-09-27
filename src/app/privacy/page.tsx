import { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      intro="An overview of how information is handled on this demo site."
      sections={[
        { heading: "Information we collect", body: "In a live version of this site, checkout would collect name, email, phone number and delivery address to process and deliver orders. This demo does not transmit or store that information beyond your own browser." },
        { heading: "How information is used", body: "Information submitted through this demo (such as the contact form or checkout) is used only to simulate the shopping experience in your browser and is never sent to a server." },
        { heading: "Cookies and local storage", body: "This site uses browser local storage to remember your cart and simulated orders between visits. No tracking cookies are used." },
        { heading: "Third parties", body: "This demo does not share data with third parties, since no real payment or shipping processors are integrated." },
        { heading: "Your choices", body: "You can clear your cart and simulated order history at any time by clearing your browser's local storage for this site." },
      ]}
    />
  );
}
