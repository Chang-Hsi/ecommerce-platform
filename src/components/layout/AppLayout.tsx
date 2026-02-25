import { Suspense } from "react";
import { MiniCartPanel } from "@/components/cart/MiniCartPanel";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Suspense fallback={<div className="h-[149px] border-b border-[var(--border)] bg-[var(--surface)]" />}>
        <Header />
      </Suspense>

      <main className="mx-auto w-full  px-4 py-8 sm:px-6">{children}</main>

      <MiniCartPanel />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
