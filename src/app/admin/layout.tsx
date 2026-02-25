export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <p className="text-xs uppercase tracking-widest text-zinc-400">Admin</p>
        <h1 className="text-lg font-semibold">Ecommerce Back Office</h1>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
