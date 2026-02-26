import { MagnifyingGlassIcon, TruckIcon } from "@heroicons/react/24/outline";
import type { CheckoutFormErrors, CheckoutFormState } from "@/lib/checkout/types";
import { checkoutContent } from "@/content/checkout";

type CheckoutShippingContactSectionProps = {
  form: CheckoutFormState;
  errors: CheckoutFormErrors;
  onUpdateField: <K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) => void;
  onTouchField: <K extends keyof CheckoutFormState>(key: K) => void;
};

type TextFieldProps = {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  error?: string;
  fieldKey: keyof CheckoutFormState;
  onChange: (value: string) => void;
  onBlur: (fieldKey: keyof CheckoutFormState) => void;
};

function TextField({
  label,
  required,
  value,
  placeholder,
  error,
  fieldKey,
  onChange,
  onBlur,
}: Readonly<TextFieldProps>) {
  return (
    <label className="block">
      <div className="relative">
        <span
          className={`absolute -top-2 left-3 z-10 bg-[var(--background)] px-1 text-xs font-medium ${
            error ? "text-red-600" : "text-zinc-500"
          }`}
        >
          {label}
          {required ? " *" : ""}
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={() => onBlur(fieldKey)}
          placeholder={placeholder}
          className={`h-14 w-full rounded-md border bg-transparent px-4 pt-2 text-base outline-none transition-colors focus:border-blue-600 ${
            error ? "border-red-600" : "border-zinc-300"
          }`}
        />
      </div>
      {error ? <p className="mt-1 px-3 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

function AddressField({
  value,
  error,
  onChange,
  onBlur,
}: Readonly<{
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}>) {
  return (
    <label className="block">
      <div className="relative">
        <span
          className={`absolute -top-2 left-3 z-10 bg-[var(--background)] px-1 text-xs font-medium ${
            error ? "text-red-600" : "text-zinc-500"
          }`}
        >
          地址 *
        </span>
        <div
          className={`flex h-14 items-center gap-2 rounded-md border bg-transparent px-4 transition-colors focus-within:border-blue-600 ${
            error ? "border-red-600" : "border-zinc-300"
          }`}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-zinc-500" aria-hidden />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            placeholder="開始輸入街道地址或郵遞區號"
            className="h-full w-full border-0 bg-transparent pt-2 text-base outline-none"
          />
        </div>
      </div>
      {error ? <p className="mt-1 px-3 text-sm text-red-600">{error}</p> : null}
      <p className="mt-1 text-sm text-zinc-500">{checkoutContent.addressHint}</p>
    </label>
  );
}

export function CheckoutShippingContactSection({
  form,
  errors,
  onUpdateField,
  onTouchField,
}: Readonly<CheckoutShippingContactSectionProps>) {
  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold text-zinc-900 sm:text-3xl">{checkoutContent.shippingTitle}</h1>
        <div className="inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-zinc-900 bg-white px-6 text-xl font-semibold text-zinc-900 sm:text-lg">
          <TruckIcon className="h-5 w-5" aria-hidden />
          {checkoutContent.shippingOnlyLabel}
        </div>
      </header>

      <div className="space-y-2">
        <TextField
          fieldKey="email"
          label="電子郵件"
          required
          value={form.email}
          placeholder="電子郵件"
          error={errors.email}
          onChange={(value) => onUpdateField("email", value)}
          onBlur={onTouchField}
        />
        <p className="text-sm text-zinc-500">{checkoutContent.emailHint}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-zinc-900 sm:text-xl">輸入你的姓名和地址：</h2>

        <TextField
          fieldKey="firstName"
          label="名字"
          required
          value={form.firstName}
          placeholder="名字"
          error={errors.firstName}
          onChange={(value) => onUpdateField("firstName", value)}
          onBlur={onTouchField}
        />

        <TextField
          fieldKey="lastName"
          label="姓氏"
          required
          value={form.lastName}
          placeholder="姓氏"
          error={errors.lastName}
          onChange={(value) => onUpdateField("lastName", value)}
          onBlur={onTouchField}
        />

        <AddressField
          value={form.addressQuery}
          error={errors.addressQuery}
          onChange={(value) => onUpdateField("addressQuery", value)}
          onBlur={() => onTouchField("addressQuery")}
        />

        <button type="button" className="text-base font-medium text-zinc-800 underline">
          手動輸入地址
        </button>

        <TextField
          fieldKey="phone"
          label="電話號碼"
          required
          value={form.phone}
          placeholder="電話號碼"
          error={errors.phone}
          onChange={(value) => onUpdateField("phone", value)}
          onBlur={onTouchField}
        />
        <p className="text-sm text-zinc-500">{checkoutContent.phoneHint}</p>

        <label className="inline-flex items-center gap-3 text-base text-zinc-900">
          <input
            type="checkbox"
            checked={form.billingSameAsShipping}
            onChange={(event) => onUpdateField("billingSameAsShipping", event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
          />
          帳單地址同送貨地址
        </label>

        {!form.billingSameAsShipping ? (
          <section className="space-y-4 rounded border border-zinc-200 bg-white p-4">
            <h3 className="text-xl font-semibold text-zinc-900">帳單地址</h3>
            <TextField
              fieldKey="billingFirstName"
              label="帳單名字"
              required
              value={form.billingFirstName}
              placeholder="帳單名字"
              error={errors.billingFirstName}
              onChange={(value) => onUpdateField("billingFirstName", value)}
              onBlur={onTouchField}
            />
            <TextField
              fieldKey="billingLastName"
              label="帳單姓氏"
              required
              value={form.billingLastName}
              placeholder="帳單姓氏"
              error={errors.billingLastName}
              onChange={(value) => onUpdateField("billingLastName", value)}
              onBlur={onTouchField}
            />
            <TextField
              fieldKey="billingAddress"
              label="帳單地址"
              required
              value={form.billingAddress}
              placeholder="帳單地址"
              error={errors.billingAddress}
              onChange={(value) => onUpdateField("billingAddress", value)}
              onBlur={onTouchField}
            />
            <TextField
              fieldKey="billingPhone"
              label="帳單電話"
              required
              value={form.billingPhone}
              placeholder="帳單電話"
              error={errors.billingPhone}
              onChange={(value) => onUpdateField("billingPhone", value)}
              onBlur={onTouchField}
            />
          </section>
        ) : null}
      </section>
    </section>
  );
}
