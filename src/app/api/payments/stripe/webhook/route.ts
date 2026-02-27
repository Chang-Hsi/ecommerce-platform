import { apiError, apiOk } from "@/lib/server/api-response";
import { processStripeWebhookEvent } from "@/lib/server/payments-stripe";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/server/stripe";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return apiError("缺少 Stripe 簽章", 400);
    }

    const rawBody = await request.text();
    const stripe = getStripeClient();
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, getStripeWebhookSecret());
    } catch (error) {
      console.error("[api/payments/stripe/webhook] signature verification failed", error);
      return apiError("Stripe webhook 簽章驗證失敗", 400);
    }

    const result = await processStripeWebhookEvent(event);
    return apiOk(result);
  } catch (error) {
    console.error("[api/payments/stripe/webhook] POST failed", error);
    return apiError("Stripe webhook 處理失敗", 500);
  }
}
