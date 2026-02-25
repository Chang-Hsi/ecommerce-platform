export function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-12">{children}</main>
    </div>
  );
}
