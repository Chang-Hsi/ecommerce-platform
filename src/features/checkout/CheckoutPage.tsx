const checkoutSteps = [
  "Contact Information",
  "Shipping Address",
  "Delivery Method",
  "Payment (Stripe Test Mode in M7)",
  "Review & Place Order",
];

export function CheckoutPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Checkout IA
        </p>
        <h1 className="text-3xl font-black text-zinc-900">/checkout</h1>
        <p className="text-sm text-zinc-600">
          M2 先完成資訊架構，實際表單與金流邏輯在後續里程碑落地。
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <ol className="space-y-3">
          {checkoutSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-zinc-800">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
