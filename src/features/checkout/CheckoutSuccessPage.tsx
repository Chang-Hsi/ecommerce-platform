import Link from "next/link";

export function CheckoutSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 ">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Order Confirmed</p>
        <h1 className="text-4xl font-semibold text-zinc-900 sm:text-3xl">訂單已建立</h1>
        <p className="text-base text-zinc-600">
          你的訂單已成功送出。若你使用信用卡，付款完成後系統會透過 Stripe webhook 自動更新訂單狀態。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/products?page=1"
          className="inline-flex h-11 items-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white"
        >
          繼續選購
        </Link>
        <Link
          href="/cart"
          className="inline-flex h-11 items-center rounded-full border border-zinc-300 px-5 text-sm font-semibold text-zinc-800"
        >
          回購物車
        </Link>
      </div>
    </div>
  );
}
