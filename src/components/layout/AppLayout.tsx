import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="bg-black px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">
        NIKE STYLE DEMO: FILTER-FIRST, MOBILE-FIRST NAVIGATION IA
      </div>

      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
