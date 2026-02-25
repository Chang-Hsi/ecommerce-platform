import Link from "next/link";
import { formatPrice } from "@/lib/cart/mock-cart";
import type { CartSummary } from "@/lib/cart/types";

type CartSummaryPanelProps = {
  summary: CartSummary;
};

export function CartSummaryPanel({ summary }: Readonly<CartSummaryPanelProps>) {
  return (
    <aside className="space-y-4 lg:pt-1">
      <h2 className="text-2xl font-semibold text-zinc-900">摘要</h2>

      <div className="space-y-3 border-b border-zinc-200 pb-4 text-2xl text-zinc-800">
        <div className="flex items-center justify-between gap-3 text-base">
          <span>小計</span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-base">
          <span>預估運費與手續費</span>
          <span>{summary.shippingFee + summary.serviceFee === 0 ? "免費" : formatPrice(summary.shippingFee + summary.serviceFee)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 text-base font-medium text-zinc-900">
        <span>總計</span>
        <span>{formatPrice(summary.total)}</span>
      </div>

      <div className="space-y-3 pt-4">
        <Link
          href="/checkout"
          className="flex h-14 w-full items-center justify-center rounded-full bg-zinc-950 text-base font-semibold text-white"
        >
          會員結帳
        </Link>
        <button
          type="button"
          className="flex h-14 w-full items-center justify-center rounded-full border border-zinc-300 bg-zinc-100 text-base font-semibold text-[#0070ba]"
        >
          PayPal
        </button>
      </div>
    </aside>
  );
}
