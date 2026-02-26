"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { checkoutContent } from "@/content/checkout";
import { getMockSession } from "@/lib/auth/mock-auth";
import { getCartItems, MOCK_CART_CHANGED_EVENT } from "@/lib/cart/mock-cart";
import { buildCheckoutSummary } from "@/lib/checkout/pricing";
import type {
  CheckoutFormErrors,
  CheckoutFormState,
  CheckoutOrderItem,
  CheckoutPaymentMethod,
  CheckoutPromo,
} from "@/lib/checkout/types";
import { mapCartItemToOrderItem } from "@/lib/checkout/types";
import { tryApplyPromoCode, validateCheckoutForm } from "@/lib/checkout/validation";

function createInitialFormState(): CheckoutFormState {
  const initialSession = getMockSession();

  return {
    email: initialSession?.email ?? "",
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

export function useCheckoutController() {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<CheckoutOrderItem[]>([]);
  const [form, setForm] = useState<CheckoutFormState>(() => createInitialFormState());
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("card");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<CheckoutPromo | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof CheckoutFormState, boolean>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    function syncItems() {
      setOrderItems(getCartItems().map((item) => mapCartItemToOrderItem(item)));
    }

    syncItems();
    window.addEventListener("storage", syncItems);
    window.addEventListener(MOCK_CART_CHANGED_EVENT, syncItems as EventListener);

    return () => {
      window.removeEventListener("storage", syncItems);
      window.removeEventListener(MOCK_CART_CHANGED_EVENT, syncItems as EventListener);
    };
  }, []);

  const summary = useMemo(
    () => buildCheckoutSummary(orderItems, appliedPromo?.discountAmount ?? 0),
    [orderItems, appliedPromo],
  );

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
    return orderItems.length === 0 || Object.keys(allErrors).length > 0;
  }, [allErrors, orderItems]);

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

  function onApplyPromo() {
    const nextPromo = tryApplyPromoCode(
      promoInput,
      checkoutContent.promoSuccessCode,
      checkoutContent.promoDiscountAmount,
    );

    if (!nextPromo) {
      setAppliedPromo(null);
      setPromoMessage("促銷碼無效，請重新輸入。");
      return;
    }

    setAppliedPromo(nextPromo);
    setPromoMessage(`已套用促銷碼 ${nextPromo.code}`);
  }

  function onPlaceOrder() {
    setIsSubmitted(true);
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

    router.push("/checkout/success");
  }

  return {
    checkoutContent,
    form,
    paymentMethod,
    promoInput,
    appliedPromo,
    errors,
    promoMessage,
    summary,
    orderItems,
    isPlaceOrderDisabled,
    updateField,
    touchField,
    setPaymentMethod,
    setPromoInput,
    onApplyPromo,
    onPlaceOrder,
  };
}
