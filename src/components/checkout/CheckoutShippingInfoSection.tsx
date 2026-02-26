import { checkoutContent } from "@/content/checkout";

export function CheckoutShippingInfoSection() {
  return (
    <section className="space-y-4 border-t border-zinc-200 pt-8">
      <h2 className="text-4xl font-semibold text-zinc-900 sm:text-3xl">{checkoutContent.shippingInfoTitle}</h2>
      <p className="text-3xl font-medium text-zinc-700 sm:text-2xl">{checkoutContent.shippingInfoFeeLabel}</p>
      <div className="space-y-1">
        <p className="text-3xl font-medium text-zinc-800 sm:text-2xl">{checkoutContent.shippingInfoDeliveryLabel}</p>
        <p className="text-3xl text-zinc-700 sm:text-2xl">{checkoutContent.shippingInfoDeliveryWindow}</p>
      </div>
    </section>
  );
}
