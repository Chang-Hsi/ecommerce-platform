import type { CheckoutOrderItem, CheckoutSummary } from "@/lib/checkout/types";

export function buildCheckoutSummary(items: CheckoutOrderItem[], promoDiscount: number): CheckoutSummary {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const originalSubtotal = items.reduce((sum, item) => {
    const base = item.compareAtPrice ?? item.unitPrice;
    return sum + base * item.qty;
  }, 0);

  const shippingFee = 0;
  const safePromoDiscount = Math.max(0, Math.floor(promoDiscount));
  const total = Math.max(0, subtotal + shippingFee - safePromoDiscount);
  const savings = Math.max(0, originalSubtotal - subtotal + safePromoDiscount);

  return {
    subtotal,
    originalSubtotal,
    shippingFee,
    promoDiscount: safePromoDiscount,
    total,
    savings,
  };
}
