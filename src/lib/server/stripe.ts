import Stripe from "stripe";

let cachedStripeClient: Stripe | null = null;

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function isStripeConfigured() {
  return Boolean(readEnv("STRIPE_SECRET_KEY"));
}

export function getStripeClient() {
  const secretKey = readEnv("STRIPE_SECRET_KEY");

  if (!secretKey) {
    throw new Error("Stripe 尚未設定（缺少 STRIPE_SECRET_KEY）");
  }

  if (cachedStripeClient) {
    return cachedStripeClient;
  }

  cachedStripeClient = new Stripe(secretKey);
  return cachedStripeClient;
}

export function getStripeWebhookSecret() {
  const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    throw new Error("Stripe webhook 尚未設定（缺少 STRIPE_WEBHOOK_SECRET）");
  }

  return webhookSecret;
}

function resolveBaseUrl() {
  const fromAppBase = readEnv("APP_BASE_URL");
  if (fromAppBase) {
    return fromAppBase;
  }

  const fromNextPublic = readEnv("NEXT_PUBLIC_APP_URL");
  if (fromNextPublic) {
    return fromNextPublic;
  }

  return "http://localhost:3000";
}

function appendQuery(rawUrl: string, query: Record<string, string>) {
  const url = new URL(rawUrl);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function buildStripeSuccessUrl(orderId: string) {
  const configured = readEnv("STRIPE_SUCCESS_URL");
  const fallback = `${resolveBaseUrl()}/checkout/success`;
  return appendQuery(configured || fallback, {
    orderId,
    session_id: "{CHECKOUT_SESSION_ID}",
  });
}

export function buildStripeCancelUrl(orderId: string) {
  const configured = readEnv("STRIPE_CANCEL_URL");
  const fallback = `${resolveBaseUrl()}/checkout`;
  return appendQuery(configured || fallback, { orderId });
}
