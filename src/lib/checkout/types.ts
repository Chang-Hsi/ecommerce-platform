import type { MockCartItem } from "@/lib/cart/types";

export type CheckoutPaymentMethod = "card" | "paypal" | "gpay";

export type CheckoutPromo = {
  code: string;
  discountAmount: number;
};

export type CheckoutSummary = {
  subtotal: number;
  originalSubtotal: number;
  shippingFee: number;
  promoDiscount: number;
  total: number;
  savings: number;
};

export type CheckoutFormState = {
  email: string;
  firstName: string;
  lastName: string;
  addressQuery: string;
  phone: string;
  billingSameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingPhone: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  saveCardForFuture: boolean;
  setAsDefaultCard: boolean;
};

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormState | "promoCode", string>>;

export type CheckoutOrderItem = {
  id: string;
  name: string;
  subtitle: string;
  imageSrc: string;
  qty: number;
  sizeLabel: string;
  unitPrice: number;
  compareAtPrice?: number;
};

export function mapCartItemToOrderItem(item: MockCartItem): CheckoutOrderItem {
  return {
    id: item.id,
    name: item.name,
    subtitle: item.subtitle,
    imageSrc: item.imageSrc,
    qty: item.qty,
    sizeLabel: item.sizeLabel,
    unitPrice: item.unitPrice,
    compareAtPrice: item.compareAtPrice,
  };
}
