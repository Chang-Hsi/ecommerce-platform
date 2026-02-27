"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { checkoutContent } from "@/content/checkout";
import {
  applyCheckoutPromoCodeToApi,
  fetchCheckoutPreviewFromApi,
  placeCheckoutOrderToApi,
  type CheckoutPreviewDto,
} from "@/lib/api/checkout";
import { resolveSafeRedirect } from "@/lib/auth/mock-auth";
import type {
  CheckoutFormErrors,
  CheckoutFormState,
  CheckoutOrderItem,
  CheckoutPaymentMethod,
  CheckoutPromo,
  CheckoutSummary,
} from "@/lib/checkout/types";
import { buildCheckoutSummary } from "@/lib/checkout/pricing";
import { validateCheckoutForm } from "@/lib/checkout/validation";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";

function createEmptyFormState(): CheckoutFormState {
  return {
    email: "",
    firstName: "",
    lastName: "",
    addressQuery: "",
    phone: "",
    billingSameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingPhone: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    saveCardForFuture: false,
    setAsDefaultCard: false,
  };
}

function createEmptySummary(): CheckoutSummary {
  return buildCheckoutSummary([], 0);
}

export function useCheckoutController() {
  const router = useRouter();
  const { isReady: isAuthReady, isAuthenticated } = useMockAuthSession();
  const [orderItems, setOrderItems] = useState<CheckoutOrderItem[]>([]);
  const [form, setForm] = useState<CheckoutFormState>(() => createEmptyFormState());
  const [summary, setSummary] = useState<CheckoutSummary>(() => createEmptySummary());
  const [deliveryWindowLabel, setDeliveryWindowLabel] = useState(checkoutContent.orderDeliveryWindowTitle);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("card");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<CheckoutPromo | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof CheckoutFormState, boolean>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  function syncCheckoutPayload(
    checkout: CheckoutPreviewDto,
    options?: {
      preserveForm?: boolean;
      preservePromoInput?: boolean;
    },
  ) {
    if (!options?.preserveForm) {
      setForm(checkout.form);
    }
    setOrderItems(checkout.items);
    setSummary(checkout.summary);
    setAppliedPromo(checkout.appliedPromo);
    if (!options?.preservePromoInput) {
      setPromoInput(checkout.appliedPromo?.code ?? "");
    }
    setDeliveryWindowLabel(checkout.deliveryWindowLabel || checkoutContent.orderDeliveryWindowTitle);
    setPreviewError(null);
  }

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!isAuthenticated) {
      const redirect = resolveSafeRedirect("/checkout");
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
      setIsPreviewLoading(false);
      return;
    }

    let isMounted = true;
    setIsPreviewLoading(true);
    setPreviewError(null);
    setPromoMessage(null);
    setSubmitError(null);

    void fetchCheckoutPreviewFromApi()
      .then((payload) => {
        if (!isMounted) {
          return;
        }
        syncCheckoutPayload(payload);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        setPreviewError(error instanceof Error ? error.message : "讀取結帳資料失敗");
      })
      .finally(() => {
        if (isMounted) {
          setIsPreviewLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthReady, isAuthenticated, router]);

  const allErrors = useMemo(() => validateCheckoutForm(form, paymentMethod), [form, paymentMethod]);

  const errors = useMemo<CheckoutFormErrors>(() => {
    if (isSubmitted) {
      return allErrors;
    }

    const nextErrors: CheckoutFormErrors = {};
    for (const fieldName of Object.keys(touchedFields) as Array<keyof CheckoutFormState>) {
      if (!touchedFields[fieldName]) {
        continue;
      }
      const fieldError = allErrors[fieldName];
      if (fieldError) {
        nextErrors[fieldName] = fieldError;
      }
    }
    return nextErrors;
  }, [allErrors, isSubmitted, touchedFields]);

  const isPlaceOrderDisabled = useMemo(() => {
    return isPreviewLoading || isPlacingOrder || orderItems.length === 0 || Object.keys(allErrors).length > 0;
  }, [allErrors, isPlacingOrder, isPreviewLoading, orderItems]);

  function updateField<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function touchField<K extends keyof CheckoutFormState>(key: K) {
    setTouchedFields((current) => {
      if (current[key]) {
        return current;
      }
      return { ...current, [key]: true };
    });
  }

  async function onApplyPromo() {
    if (!isAuthenticated) {
      return;
    }

    setIsApplyingPromo(true);
    setPromoMessage(null);

    try {
      const checkout = await applyCheckoutPromoCodeToApi(promoInput);
      syncCheckoutPayload(checkout, {
        preserveForm: true,
      });

      if (checkout.appliedPromo) {
        setPromoMessage(`已套用促銷碼 ${checkout.appliedPromo.code}`);
      } else {
        setPromoMessage(null);
      }
    } catch (error) {
      setPromoMessage(error instanceof Error ? error.message : "套用促銷碼失敗");
    } finally {
      setIsApplyingPromo(false);
    }
  }

  async function onPlaceOrder() {
    setIsSubmitted(true);
    setSubmitError(null);
    setTouchedFields((current) => {
      const next = { ...current };
      for (const key of Object.keys(form) as Array<keyof CheckoutFormState>) {
        next[key] = true;
      }
      return next;
    });

    if (Object.keys(allErrors).length > 0 || orderItems.length === 0) {
      return;
    }

    setIsPlacingOrder(true);

    try {
      const result = await placeCheckoutOrderToApi({
        form,
        paymentMethod,
      });

      router.push(result.redirectUrl || "/checkout/success");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "建立訂單失敗");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  return {
    checkoutContent,
    isAuthReady,
    isAuthenticated,
    form,
    paymentMethod,
    promoInput,
    appliedPromo,
    errors,
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
  };
}
