import Link from "next/link";

export function SnkrsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--border)] bg-zinc-100 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">SNKRS</p>
        <h1 className="mt-3 text-3xl font-black text-zinc-900">最高可享 7 折優惠</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-700">
          這是 SNKRS 專區占位頁，後續可接發售行事曆、抽籤機制與詳細商品頁。
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-zinc-900">立即選購</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/products?sale=true&page=1"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white"
          >
            選購最新優惠商品
          </Link>
          <Link
            href="/products?group=new-featured&page=1"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700"
          >
            查看新品和精選
          </Link>
        </div>
      </section>
    </div>
  );
}
