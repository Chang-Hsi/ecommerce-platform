import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import type Stripe from "stripe";
import type { CheckoutOrderItem } from "@/lib/checkout/types";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/server/stripe";

function toMinorAmount(value: number) {
  const minor = Math.round(value * 100);
  if (!Number.isFinite(minor) || minor <= 0) {
    throw new Error("Stripe 付款金額無效");
  }
  return minor;
}

function toStripeCurrency(currency: string) {
  return currency.toLowerCase();
}

export async function createStripeCheckoutSessionForOrder(input: {
  orderId: string;
  userId: string;
  email: string;
  currency: string;
  items: CheckoutOrderItem[];
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripeClient();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = input.items.map((item) => ({
    quantity: item.qty,
    price_data: {
      currency: toStripeCurrency(input.currency),
      unit_amount: toMinorAmount(item.unitPrice),
      product_data: {
        name: item.name,
        description: item.subtitle,
        images: item.imageSrc ? [item.imageSrc] : undefined,
        metadata: {
          sizeLabel: item.sizeLabel,
        },
      },
    },
  }));

  if (lineItems.length === 0) {
    throw new Error("購物車是空的，無法建立 Stripe Checkout Session");
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: input.orderId,
      customer_email: input.email,
      line_items: lineItems,
      metadata: {
        orderId: input.orderId,
        userId: input.userId,
      },
      payment_intent_data: {
        metadata: {
          orderId: input.orderId,
          userId: input.userId,
        },
      },
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    },
    {
      idempotencyKey: `checkout_order_${input.orderId}`,
    },
  );

  if (!session.url) {
    throw new Error("Stripe Checkout Session 建立失敗（缺少 URL）");
  }

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
}

export async function createStripePaymentIntentForOrder(input: {
  orderId: string;
  userId: string;
  email: string;
  amount: number;
  currency: string;
}) {
  const stripe = getStripeClient();

  const intent = await stripe.paymentIntents.create(
    {
      amount: toMinorAmount(input.amount),
      currency: toStripeCurrency(input.currency),
      receipt_email: input.email,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: input.orderId,
        userId: input.userId,
      },
    },
    {
      idempotencyKey: `payment_intent_order_${input.orderId}`,
    },
  );

  if (!intent.client_secret) {
    throw new Error("Stripe PaymentIntent 建立失敗（缺少 client_secret）");
  }

  return {
    paymentIntentId: intent.id,
    clientSecret: intent.client_secret,
  };
}

async function resolveOrderIdFromCheckoutSession(session: Stripe.Checkout.Session) {
  const metadataOrderId = session.metadata?.orderId?.trim();
  if (metadataOrderId) {
    return metadataOrderId;
  }

  const byAttempt = await prisma.order.findFirst({
    where: {
      paymentAttempts: {
        some: {
          providerRef: session.id,
          provider: PaymentMethod.CARD,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return byAttempt?.id ?? null;
}

async function markOrderAsPaid(orderId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: {
        id: orderId,
        paymentStatus: {
          not: PaymentStatus.CAPTURED,
        },
      },
      data: {
        status: OrderStatus.PAID,
        paymentStatus: PaymentStatus.CAPTURED,
      },
    });

    await tx.paymentAttempt.updateMany({
      where: {
        orderId,
        provider: PaymentMethod.CARD,
      },
      data: {
        status: PaymentStatus.CAPTURED,
        errorCode: null,
      },
    });
  });
}

async function markOrderAsFailed(orderId: string, errorCode: string) {
  await prisma.$transaction(async (tx) => {
    await tx.order.updateMany({
      where: {
        id: orderId,
        paymentStatus: {
          not: PaymentStatus.CAPTURED,
        },
      },
      data: {
        status: OrderStatus.FAILED,
        paymentStatus: PaymentStatus.FAILED,
      },
    });

    await tx.paymentAttempt.updateMany({
      where: {
        orderId,
        provider: PaymentMethod.CARD,
      },
      data: {
        status: PaymentStatus.FAILED,
        errorCode,
      },
    });
  });
}

async function applyStripeEventToOrder(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = await resolveOrderIdFromCheckoutSession(session);
    if (!orderId) {
      return null;
    }
    await markOrderAsPaid(orderId);
    return orderId;
  }

  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = await resolveOrderIdFromCheckoutSession(session);
    if (!orderId) {
      return null;
    }
    await markOrderAsFailed(orderId, event.type);
    return orderId;
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId?.trim();
    if (!orderId) {
      return null;
    }
    await markOrderAsPaid(orderId);
    return orderId;
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId?.trim();
    if (!orderId) {
      return null;
    }
    const errorCode = intent.last_payment_error?.code || event.type;
    await markOrderAsFailed(orderId, errorCode);
    return orderId;
  }

  return null;
}

export async function processStripeWebhookEvent(event: Stripe.Event) {
  const found = await prisma.paymentWebhookEvent.findUnique({
    where: {
      eventId: event.id,
    },
    select: {
      id: true,
      processedAt: true,
    },
  });

  if (found?.processedAt) {
    return {
      received: true,
      idempotent: true,
      eventId: event.id,
    };
  }

  if (!found) {
    try {
      await prisma.paymentWebhookEvent.create({
        data: {
          provider: "stripe",
          eventId: event.id,
          eventType: event.type,
        },
      });
    } catch (error) {
      if (
        typeof error === "object"
        && error
        && "code" in error
        && (error as { code?: string }).code === "P2002"
      ) {
        return {
          received: true,
          idempotent: true,
          eventId: event.id,
        };
      }
      throw error;
    }
  } else {
    await prisma.paymentWebhookEvent.update({
      where: {
        eventId: event.id,
      },
      data: {
        eventType: event.type,
        lastError: null,
      },
    });
  }

  try {
    const orderId = await applyStripeEventToOrder(event);

    await prisma.paymentWebhookEvent.update({
      where: {
        eventId: event.id,
      },
      data: {
        orderId,
        processedAt: new Date(),
      },
    });

    return {
      received: true,
      idempotent: false,
      eventId: event.id,
      orderId,
    };
  } catch (error) {
    await prisma.paymentWebhookEvent.update({
      where: {
        eventId: event.id,
      },
      data: {
        lastError: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}
