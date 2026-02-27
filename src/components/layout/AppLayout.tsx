import { Suspense } from "react";
import { MiniCartPanel } from "@/components/cart/MiniCartPanel";
import { FavoriteConfirmPanel } from "@/components/favorites/FavoriteConfirmPanel";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-[149px] border-b border-[var(--border)] bg-[var(--surface)]" />}>
        <Header />
      </Suspense>

      <main className="mx-auto w-full flex-1 px-4 pt-8 sm:px-6">{children}</main>

      <MiniCartPanel />
      <FavoriteConfirmPanel />
      <Footer />
    </div>
  );
}
