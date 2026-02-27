"use client";

import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { CheckoutPaymentSection } from "@/components/checkout/CheckoutPaymentSection";
import { CheckoutShippingContactSection } from "@/components/checkout/CheckoutShippingContactSection";
import { CheckoutShippingInfoSection } from "@/components/checkout/CheckoutShippingInfoSection";
import { useCheckoutController } from "@/hooks/checkout/useCheckoutController";

export function CheckoutPage() {
  const {
    isAuthReady,
    isAuthenticated,
    form,
    errors,
    paymentMethod,
    promoInput,
    appliedPromo,
    promoMessage,
    submitError,
    summary,
    deliveryWindowLabel,
    orderItems,
    isPreviewLoading,
    previewError,
    isApplyingPromo,
    isPlacingOrder,
    isPlaceOrderDisabled,
    updateField,
    touchField,
    setPaymentMethod,
    setPromoInput,
    onApplyPromo,
    onPlaceOrder,
  } = useCheckoutController();

  if (!isAuthReady || !isAuthenticated) {
    return null;
  }

  if (isPreviewLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-base text-zinc-600">載入結帳資料中...</p>
      </div>
    );
  }

  if (previewError) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-base text-red-700">{previewError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <aside className="order-1 lg:order-2 lg:sticky lg:top-[calc(var(--storefront-header-offset,0px)+16px)] lg:self-start">
          <CheckoutOrderSummary summary={summary} items={orderItems} deliveryWindowLabel={deliveryWindowLabel} />
        </aside>

        <div className="order-2 space-y-10 lg:order-1">
          <CheckoutShippingContactSection
            form={form}
            errors={errors}
            onUpdateField={updateField}
            onTouchField={touchField}
          />
          <CheckoutShippingInfoSection deliveryWindowLabel={deliveryWindowLabel} />
          <CheckoutPaymentSection
            form={form}
            errors={errors}
            paymentMethod={paymentMethod}
            promoInput={promoInput}
            appliedPromo={appliedPromo}
            promoMessage={promoMessage}
            submitError={submitError}
            isApplyingPromo={isApplyingPromo}
            isPlacingOrder={isPlacingOrder}
            isPlaceOrderDisabled={isPlaceOrderDisabled}
            onUpdateField={updateField}
            onTouchField={touchField}
            onSetPaymentMethod={setPaymentMethod}
            onSetPromoInput={setPromoInput}
            onApplyPromo={onApplyPromo}
            onPlaceOrder={onPlaceOrder}
          />
        </div>
      </div>
    </div>
  );
}
