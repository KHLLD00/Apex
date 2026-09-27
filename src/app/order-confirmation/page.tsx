import { Suspense } from "react";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata = { title: "Order Confirmation" };

export default function OrderConfirmationPage() {
  return (
    <div className="container-page py-8 sm:py-16">
      <Suspense fallback={null}>
        <OrderConfirmation />
      </Suspense>
    </div>
  );
}
