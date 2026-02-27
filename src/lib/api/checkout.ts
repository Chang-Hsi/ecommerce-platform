import { request } from "@/lib/api/request";
import type { CheckoutFormState, CheckoutOrderItem, CheckoutPaymentMethod, CheckoutPromo, CheckoutSummary } from "@/lib/checkout/types";

export type CheckoutPreviewDto = {
  form: CheckoutFormState;
  items: CheckoutOrderItem[];
  summary: CheckoutSummary;
  appliedPromo: CheckoutPromo | null;
  deliveryWindowLabel: string;
};

type CheckoutPreviewEnvelope = {
  checkout: CheckoutPreviewDto;
};

export type PlaceOrderResultDto = {
  order: {
    id: string;
    status: string;
    paymentStatus: string;
    total: number;
    currency: string;
  };
  redirectUrl: string;
  paymentPreparation: {
    provider: "stripe";
    mode: "M7_PENDING" | "STRIPE_CHECKOUT" | "STRIPE_EMBEDDED";
    clientSecret: string | null;
  };
};

export async function fetchCheckoutPreviewFromApi() {
  const payload = await request<CheckoutPreviewEnvelope>("/api/checkout", {
    cache: "no-store",
  });

  return payload.data.checkout;
}

export async function applyCheckoutPromoCodeToApi(code: string) {
  const payload = await request<CheckoutPreviewEnvelope>("/api/checkout/promo", {
    method: "POST",
    body: {
      code,
    },
  });

  return payload.data.checkout;
}

export async function placeCheckoutOrderToApi(input: {
  form: CheckoutFormState;
  paymentMethod: CheckoutPaymentMethod;
}) {
  const payload = await request<PlaceOrderResultDto>("/api/checkout/place-order", {
    method: "POST",
    body: input,
  });

  return payload.data;
}
