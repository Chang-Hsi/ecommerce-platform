import Link from "next/link";

type ProductsPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

const categories = ["running", "training", "basketball", "lifestyle"];
const sizes = ["7", "8", "9", "10", "11"];
const colors = ["black", "white", "red", "blue"];
const sorts = ["newest", "price_asc", "price_desc"];
const pageSize = 12;

const demoProducts = [
  { slug: "air-zoom-pegasus-41", name: "Air Zoom Pegasus 41", price: 4200 },
  { slug: "metcon-10", name: "Metcon 10", price: 3800 },
  { slug: "dunk-low-retro", name: "Dunk Low Retro", price: 3400 },
  { slug: "vomero-plus", name: "Vomero Plus", price: 4600 },
];

function readQueryValue(
  raw: Record<string, string | string[] | undefined>,
  key: string,
): string | null {
  const value = raw[key];

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }

  return null;
}

function buildQueryString(
  base: URLSearchParams,
  key: string,
  value: string | null,
): string {
  const params = new URLSearchParams(base.toString());

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  if (key !== "page") {
    params.set("page", "1");
  }

  return params.toString();
}

export function ProductsPage({ searchParams }: ProductsPageProps) {
  const selectedCategory = readQueryValue(searchParams, "category");
  const selectedPrice = readQueryValue(searchParams, "price");
  const selectedSize = readQueryValue(searchParams, "size");
  const selectedColor = readQueryValue(searchParams, "color");
  const selectedSort = readQueryValue(searchParams, "sort") ?? "newest";
  const selectedPage = Number(readQueryValue(searchParams, "page") ?? "1");
  const summary = `${pageSize} items/page • sort: ${selectedSort}`;

  const queryBase = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      queryBase.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      queryBase.set(key, value[0]);
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Product Listing Page
        </p>
        <h1 className="text-3xl font-black text-zinc-900">/products</h1>
        <p className="text-sm text-zinc-600">
          URL query is the source of truth for filters and pagination.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-zinc-700">{summary}</p>
          <Link
            href="/products"
            className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-700"
          >
            Clear All
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = item === selectedCategory;
                const query = buildQueryString(queryBase, "category", active ? null : item);
                return (
                  <Link
                    key={item}
                    href={`/products?${query}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                      active ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              sort
            </p>
            <div className="flex flex-wrap gap-2">
              {sorts.map((item) => {
                const active = item === selectedSort;
                const query = buildQueryString(queryBase, "sort", item);
                return (
                  <Link
                    key={item}
                    href={`/products?${query}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                      active ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              size
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((item) => {
                const active = item === selectedSize;
                const query = buildQueryString(queryBase, "size", active ? null : item);
                return (
                  <Link
                    key={item}
                    href={`/products?${query}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                      active ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
              color
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((item) => {
                const active = item === selectedColor;
                const query = buildQueryString(queryBase, "color", active ? null : item);
                return (
                  <Link
                    key={item}
                    href={`/products?${query}`}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                      active ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-zinc-100 p-3 text-xs text-zinc-700">
          Applied query:
          <code className="ml-2 rounded bg-white px-2 py-1 text-[11px] text-zinc-900">
            category={selectedCategory ?? "-"}&price={selectedPrice ?? "-"}&size=
            {selectedSize ?? "-"}&color={selectedColor ?? "-"}&sort={selectedSort}
            &page={selectedPage}
          </code>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {demoProducts.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:shadow-md"
          >
            <div className="aspect-square rounded-xl bg-zinc-200" />
            <h2 className="mt-3 text-sm font-bold text-zinc-900">{product.name}</h2>
            <p className="mt-1 text-sm text-zinc-600">NT$ {product.price.toLocaleString()}</p>
          </Link>
        ))}
      </section>

      <section className="flex items-center gap-2">
        {["1", "2", "3"].map((page) => {
          const query = buildQueryString(queryBase, "page", page);
          const active = page === String(selectedPage);
          return (
            <Link
              key={page}
              href={`/products?${query}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                active ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-700"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </section>
    </div>
  );
}
