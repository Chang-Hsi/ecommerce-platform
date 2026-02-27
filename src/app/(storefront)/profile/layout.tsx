import { ProfileLayout } from "@/features/profile/ProfileLayout";

export default function ProfileRouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
