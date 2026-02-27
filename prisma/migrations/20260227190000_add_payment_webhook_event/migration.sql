CREATE TABLE "PaymentWebhookEvent" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "orderId" TEXT,
  "processedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaymentWebhookEvent_eventId_key" ON "PaymentWebhookEvent"("eventId");
CREATE INDEX "PaymentWebhookEvent_provider_eventType_createdAt_idx" ON "PaymentWebhookEvent"("provider", "eventType", "createdAt" DESC);
CREATE INDEX "PaymentWebhookEvent_orderId_createdAt_idx" ON "PaymentWebhookEvent"("orderId", "createdAt" DESC);
