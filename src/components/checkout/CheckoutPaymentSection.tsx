import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";
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
  isPlaceOrderDisabled: boolean;
  onUpdateField: <K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) => void;
  onTouchField: <K extends keyof CheckoutFormState>(key: K) => void;
  onSetPaymentMethod: (method: CheckoutPaymentMethod) => void;
  onSetPromoInput: (value: string) => void;
  onApplyPromo: () => void;
  onPlaceOrder: () => void;
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

export function CheckoutPaymentSection({
  form,
  errors,
  paymentMethod,
  promoInput,
  appliedPromo,
  promoMessage,
  isPlaceOrderDisabled,
  onUpdateField,
  onTouchField,
  onSetPaymentMethod,
  onSetPromoInput,
  onApplyPromo,
  onPlaceOrder,
}: Readonly<CheckoutPaymentSectionProps>) {
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
            className="h-14 rounded-full border border-zinc-300 px-8 text-base font-semibold text-zinc-700"
          >
            套用
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
          onClick={() => onSetPaymentMethod("card")}
        >
          <span className="inline-flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" aria-hidden />
            信用卡或金融簽帳卡
          </span>
        </PaymentMethodButton>

        <PaymentMethodButton
          selected={paymentMethod === "paypal"}
          label="PayPal"
          onClick={() => onSetPaymentMethod("paypal")}
        >
          <span className="text-2xl font-bold text-[#003087] sm:text-xl">PayPal</span>
        </PaymentMethodButton>

        <PaymentMethodButton
          selected={paymentMethod === "gpay"}
          label="Google Pay"
          onClick={() => onSetPaymentMethod("gpay")}
        >
          <span className="text-2xl font-semibold text-zinc-800 sm:text-xl">Google Pay</span>
        </PaymentMethodButton>
      </section>

      {paymentMethod === "card" ? (
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
            <div className={`flex h-14 items-center gap-2 rounded border px-4 ${errors.cardNumber ? "border-red-500" : "border-zinc-300"}`}>
              <input
                value={form.cardNumber}
                onChange={(event) => onUpdateField("cardNumber", event.target.value)}
                onBlur={() => onTouchField("cardNumber")}
                placeholder="卡號"
                className="h-full w-full border-0 bg-transparent text-base outline-none"
              />
              <LockClosedIcon className="h-5 w-5 text-zinc-500" aria-hidden />
            </div>
            {errors.cardNumber ? <p className="text-sm text-red-600">{errors.cardNumber}</p> : null}
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">月份/年份 *</span>
              <input
                value={form.cardExpiry}
                onChange={(event) => onUpdateField("cardExpiry", event.target.value)}
                onBlur={() => onTouchField("cardExpiry")}
                placeholder="MM/YY"
                className={`h-14 w-full rounded border px-4 text-base outline-none ${errors.cardExpiry ? "border-red-500" : "border-zinc-300"}`}
              />
              {errors.cardExpiry ? <p className="text-sm text-red-600">{errors.cardExpiry}</p> : null}
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">安全碼 *</span>
              <input
                value={form.cardCvc}
                onChange={(event) => onUpdateField("cardCvc", event.target.value)}
                onBlur={() => onTouchField("cardCvc")}
                placeholder="安全碼"
                className={`h-14 w-full rounded border px-4 text-base outline-none ${errors.cardCvc ? "border-red-500" : "border-zinc-300"}`}
              />
              {errors.cardCvc ? <p className="text-sm text-red-600">{errors.cardCvc}</p> : null}
            </label>
          </div>
        </section>
      ) : (
        <p className="text-base text-zinc-600">M3 階段僅提供付款方式選擇 UI，實際付款流程於後續里程碑串接。</p>
      )}

      <section className="space-y-4 border-t border-zinc-200 pt-6">
        <p className="text-sm leading-6 text-zinc-500">{checkoutContent.placeOrderDisclaimer}</p>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isPlaceOrderDisabled}
          className="h-16 w-full rounded-full bg-zinc-900 text-2xl font-semibold text-white disabled:bg-zinc-300 sm:text-xl"
        >
          {checkoutContent.placeOrderButtonLabel}
        </button>
      </section>
    </section>
  );
}
