import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h1 className="text-2xl font-black text-zinc-900">{title}</h1>
      <p className="text-sm text-zinc-700">{description}</p>
      <Link
        href="/"
        className="inline-flex rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700"
      >
        回到首頁
      </Link>
    </section>
  );
}
