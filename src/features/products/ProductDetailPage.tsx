import Link from "next/link";

type ProductDetailPageProps = {
  slug: string;
};

function toTitle(slug: string) {
  return slug
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const productName = toTitle(slug);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <div className="aspect-square rounded-3xl bg-zinc-200" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }, (_, idx) => (
            <div key={idx} className="aspect-square rounded-xl bg-zinc-300" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Product Detail Page
          </p>
          <h1 className="mt-2 text-3xl font-black text-zinc-900">{productName}</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Slug route: <code className="font-mono">{slug}</code>
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm font-semibold text-zinc-900">Select size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["7", "8", "9", "10", "11"].map((size) => (
              <button
                key={size}
                type="button"
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-semibold text-zinc-700"
              >
                {size}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-bold text-zinc-900">NT$ 4,200</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/cart"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Add to Cart
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700"
          >
            Back to Products
          </Link>
        </div>
      </section>
    </div>
  );
}
