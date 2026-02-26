import { QuestionMarkCircleIcon, TagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { formatPrice } from "@/lib/cart/mock-cart";
import type { CheckoutOrderItem, CheckoutSummary } from "@/lib/checkout/types";
import { checkoutContent } from "@/content/checkout";

type CheckoutOrderSummaryProps = {
  summary: CheckoutSummary;
  items: CheckoutOrderItem[];
};

export function CheckoutOrderSummary({ summary, items }: Readonly<CheckoutOrderSummaryProps>) {
  return (
    <aside className="space-y-6 border border-zinc-300 bg-zinc-100 p-6">
      <h2 className="text-4xl font-semibold text-zinc-900 sm:text-3xl">{checkoutContent.orderSummaryTitle}</h2>

      <div className="space-y-2 text-base text-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1">
            小計
            <QuestionMarkCircleIcon className="h-4 w-4 text-zinc-500" aria-hidden />
          </span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>原價</span>
          <span className={summary.originalSubtotal > summary.subtotal ? "line-through" : ""}>
            {formatPrice(summary.originalSubtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>運送資訊</span>
          <span>{summary.shippingFee === 0 ? "免費" : formatPrice(summary.shippingFee)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-base text-zinc-700">{checkoutContent.freeShippingQualifiedLabel}</p>
        <div className="h-2 rounded-full bg-zinc-200">
          <div className="h-full w-full rounded-full bg-emerald-600" />
        </div>
      </div>

      <div className="space-y-2 border-t border-zinc-300 pt-4">
        <div className="flex items-center justify-between gap-3 text-2xl font-semibold text-zinc-900 sm:text-xl">
          <span>{checkoutContent.totalLabel}</span>
          <span>{formatPrice(summary.total)}</span>
        </div>
        {summary.savings > 0 ? (
          <p className="inline-flex items-center gap-1 text-2xl font-semibold text-emerald-700 sm:text-xl">
            <TagIcon className="h-5 w-5" aria-hidden />
            {checkoutContent.savingsLabelPrefix} {formatPrice(summary.savings)}
          </p>
        ) : null}
      </div>

      <div className="space-y-5 border-t border-zinc-300 pt-5">
        <h3 className="text-3xl font-semibold leading-snug text-zinc-900 sm:text-2xl">
          {checkoutContent.orderDeliveryWindowTitle}
        </h3>

        <div className="space-y-5">
          {items.map((item) => (
            <article key={item.id} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
              <div className="relative h-[88px] overflow-hidden bg-zinc-100">
                <Image src={item.imageSrc} alt={item.name} fill sizes="110px" className="object-cover" />
              </div>

              <div className="space-y-0.5 text-base">
                <p className="font-medium text-zinc-900">{item.name}</p>
                <p className="text-zinc-700">數量 {item.qty}</p>
                <p className="text-zinc-700">尺寸 CM {item.sizeLabel}</p>
                <p className="font-medium text-zinc-900">{formatPrice(item.unitPrice * item.qty)}</p>
                {item.compareAtPrice ? (
                  <p className="text-zinc-500 line-through">{formatPrice(item.compareAtPrice * item.qty)}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
