import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between text-xs text-zinc-500">
        <p>2026 SwooshLab Demo Storefront</p>
        <Link href="/admin" className="font-semibold text-zinc-700 hover:text-black">
          Admin
        </Link>
      </div>
    </footer>
  );
}
