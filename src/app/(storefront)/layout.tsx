import { AppLayout } from "@/components/layout/AppLayout";

export default function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppLayout>{children}</AppLayout>;
}
