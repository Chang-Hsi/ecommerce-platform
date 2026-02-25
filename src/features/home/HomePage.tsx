import Link from "next/link";

const highlightLinks = [
  {
    title: "Product Listing",
    description: "Nike-style filter flow with URL query state.",
    href: "/products?category=running&sort=newest&page=1",
    cta: "Open /products",
  },
  {
    title: "Product Detail",
    description: "Variant-ready detail page with purchase funnel entry.",
    href: "/products/air-zoom-pegasus-41",
    cta: "Open /products/[slug]",
  },
  {
    title: "Checkout Funnel",
    description: "Cart to checkout IA path for later API integration.",
    href: "/cart",
    cta: "Open /cart",
  },
];

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-zinc-900 to-zinc-700 p-7 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">
          M2 Information Architecture
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
          Build the storefront first, connect data later.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-zinc-200 sm:text-base">
          這個階段先把前台路由與行動端導覽結構固定，確保後續 UI 企劃與 API
          串接有一致骨架可依附。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products?category=running&size=10&color=black&sort=newest&page=1"
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900"
          >
            Browse Running
          </Link>
          <Link
            href="/checkout"
            className="rounded-full border border-white/60 px-5 py-2 text-sm font-bold text-white"
          >
            Preview Checkout IA
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlightLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-zinc-900">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-900">
              {item.cta}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
