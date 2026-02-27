import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  Stripe,
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
  StripeElements,
} from "@stripe/stripe-js";
import { useState } from "react";
import type {
  CheckoutFormErrors,
  CheckoutFormState,
  CheckoutPaymentMethod,
  CheckoutPromo,
} from "@/lib/checkout/types";
import { checkoutContent } from "@/content/checkout";

type CheckoutPaymentSectionProps = {
  form: CheckoutFormState;
  errors: CheckoutFormErrors;
  paymentMethod: CheckoutPaymentMethod;
  promoInput: string;
  appliedPromo: CheckoutPromo | null;
  promoMessage: string | null;
  submitError: string | null;
  isApplyingPromo: boolean;
  isPlacingOrder: boolean;
  isPlaceOrderDisabled: boolean;
  onUpdateField: <K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) => void;
  onTouchField: <K extends keyof CheckoutFormState>(key: K) => void;
  onSetPaymentMethod: (method: CheckoutPaymentMethod) => void;
  onSetPromoInput: (value: string) => void;
  onApplyPromo: () => void;
  onPlaceOrder: (input?: { stripe: Stripe | null; elements: StripeElements | null }) => Promise<void>;
};

function PaymentMethodButton({
  selected,
  label,
  children,
  onClick,
}: Readonly<{ selected: boolean; label: string; children?: React.ReactNode; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 w-full items-center rounded-2xl border px-4 text-base font-semibold ${
        selected ? "border-2 border-zinc-900 bg-white text-zinc-900" : "border-zinc-300 bg-white text-zinc-700"
      }`}
      aria-pressed={selected}
      aria-label={label}
    >
      {children ?? label}
    </button>
  );
}

const stripeElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#18181b",
      "::placeholder": {
        color: "#a1a1aa",
      },
    },
    invalid: {
      color: "#dc2626",
    },
  },
};

export function CheckoutPaymentSection({
  form,
  errors,
  paymentMethod,
  promoInput,
  appliedPromo,
  promoMessage,
  submitError,
  isApplyingPromo,
  isPlacingOrder,
  isPlaceOrderDisabled,
  onUpdateField,
  onTouchField,
  onSetPaymentMethod,
  onSetPromoInput,
  onApplyPromo,
  onPlaceOrder,
}: Readonly<CheckoutPaymentSectionProps>) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
  const [cardCvcError, setCardCvcError] = useState<string | null>(null);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [cardFormError, setCardFormError] = useState<string | null>(null);

  const isCardPayment = paymentMethod === "card";

  async function handlePlaceOrder() {
    if (!isCardPayment) {
      await onPlaceOrder();
      return;
    }

    if (!stripe || !elements) {
      setCardFormError("付款元件載入中，請稍後再試。");
      return;
    }

    if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
      setCardFormError("請完整填寫卡號、有效期限與安全碼。");
      return;
    }

    setCardFormError(null);
    await onPlaceOrder({ stripe, elements });
  }

  function onCardNumberChange(event: StripeCardNumberElementChangeEvent) {
    setCardNumberComplete(event.complete);
    setCardNumberError(event.error?.message ?? null);
    if (cardFormError) {
      setCardFormError(null);
    }
  }

  function onCardExpiryChange(event: StripeCardExpiryElementChangeEvent) {
    setCardExpiryComplete(event.complete);
    setCardExpiryError(event.error?.message ?? null);
    if (cardFormError) {
      setCardFormError(null);
    }
  }

  function onCardCvcChange(event: StripeCardCvcElementChangeEvent) {
    setCardCvcComplete(event.complete);
    setCardCvcError(event.error?.message ?? null);
    if (cardFormError) {
      setCardFormError(null);
    }
  }

  return (
    <section className="space-y-6 border-t border-zinc-200 pt-8">
      <h2 className="text-4xl font-semibold text-zinc-900 sm:text-3xl">{checkoutContent.paymentTitle}</h2>

      <section className="space-y-3">
        <h3 className="text-2xl font-semibold text-zinc-900 sm:text-xl">{checkoutContent.promoTitle}</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={promoInput}
            onChange={(event) => onSetPromoInput(event.target.value)}
            placeholder="促銷"
            className="h-14 flex-1 rounded-2xl border border-zinc-300 px-4 text-base outline-none"
          />
          <button
            type="button"
            onClick={onApplyPromo}
            disabled={isApplyingPromo}
            className="h-14 rounded-full border border-zinc-300 px-8 text-base font-semibold text-zinc-700"
          >
            {isApplyingPromo ? "套用中..." : "套用"}
          </button>
        </div>
        <p className="text-sm text-zinc-500">{checkoutContent.promoHint}</p>
        {promoMessage ? (
          <p className={`text-sm ${appliedPromo ? "text-emerald-700" : "text-red-600"}`}>{promoMessage}</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <PaymentMethodButton
          selected={paymentMethod === "card"}
          label="信用卡或金融簽帳卡"
          onClick={() => {
            setCardFormError(null);
            onSetPaymentMethod("card");
          }}
        >
          <span className="inline-flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" aria-hidden />
            信用卡或金融簽帳卡
          </span>
        </PaymentMethodButton>

        <PaymentMethodButton
          selected={paymentMethod === "paypal"}
          label="Stripe"
          onClick={() => {
            setCardFormError(null);
            onSetPaymentMethod("paypal");
          }}
        >
          <span className="text-2xl font-bold text-[#635BFF] sm:text-xl">Stripe</span>
        </PaymentMethodButton>

        <PaymentMethodButton
          selected={paymentMethod === "gpay"}
          label="Google Pay"
          onClick={() => {
            setCardFormError(null);
            onSetPaymentMethod("gpay");
          }}
        >
          <span className="text-2xl font-semibold text-zinc-800 sm:text-xl">Google Pay</span>
        </PaymentMethodButton>
      </section>

      {isCardPayment ? (
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-zinc-900 sm:text-xl">請輸入你的詳細付款資訊：</h3>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-zinc-700">信用卡持有人姓名 *</span>
            <input
              value={form.cardName}
              onChange={(event) => onUpdateField("cardName", event.target.value)}
              onBlur={() => onTouchField("cardName")}
              placeholder="信用卡持有人姓名"
              className={`h-14 w-full rounded border px-4 text-base outline-none ${errors.cardName ? "border-red-500" : "border-zinc-300"}`}
            />
            {errors.cardName ? <p className="text-sm text-red-600">{errors.cardName}</p> : null}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-zinc-700">卡號 *</span>
            <div className={`flex h-14 items-center gap-2 rounded border px-4 ${cardNumberError ? "border-red-500" : "border-zinc-300"}`}>
              <div className="w-full">
                <CardNumberElement options={stripeElementOptions} onChange={onCardNumberChange} />
              </div>
              <LockClosedIcon className="h-5 w-5 text-zinc-500" aria-hidden />
            </div>
            {cardNumberError ? <p className="text-sm text-red-600">{cardNumberError}</p> : null}
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">月份/年份 *</span>
              <div className={`flex h-14 items-center rounded border px-4 ${cardExpiryError ? "border-red-500" : "border-zinc-300"}`}>
                <div className="w-full">
                  <CardExpiryElement options={stripeElementOptions} onChange={onCardExpiryChange} />
                </div>
              </div>
              {cardExpiryError ? <p className="text-sm text-red-600">{cardExpiryError}</p> : null}
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">安全碼 *</span>
              <div className={`flex h-14 items-center rounded border px-4 ${cardCvcError ? "border-red-500" : "border-zinc-300"}`}>
                <div className="w-full">
                  <CardCvcElement options={stripeElementOptions} onChange={onCardCvcChange} />
                </div>
              </div>
              {cardCvcError ? <p className="text-sm text-red-600">{cardCvcError}</p> : null}
            </label>
          </div>
        </section>
      ) : paymentMethod === "paypal" ? (
        <section className="rounded-2xl border border-zinc-300 bg-zinc-50 p-4">
          <p className="text-base font-semibold text-zinc-900">你將在下一步前往 Stripe 測試結帳頁完成付款。</p>
        </section>
      ) : (
        <p className="text-base text-zinc-600">Google Pay 目前仍為 UI 預留，尚未啟用實際金流。</p>
      )}

      <section className="space-y-4 border-t border-zinc-200 pt-6">
        <p className="text-sm leading-6 text-zinc-500">{checkoutContent.placeOrderDisclaimer}</p>
        {cardFormError ? <p className="text-sm text-red-600">{cardFormError}</p> : null}
        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlaceOrderDisabled}
          className="h-16 w-full rounded-full bg-zinc-900 text-2xl font-semibold text-white disabled:bg-zinc-300 sm:text-xl"
        >
          {isPlacingOrder ? "處理中..." : checkoutContent.placeOrderButtonLabel}
        </button>
      </section>
    </section>
  );
}
