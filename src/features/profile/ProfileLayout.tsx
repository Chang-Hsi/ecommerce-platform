"use client";

import { profileContent } from "@/content/profile";
import { ProfileGuard } from "@/components/profile/ProfileGuard";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";

export function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProfileGuard>
      <div className="mx-auto w-full max-w-5xl space-y-4 pb-10 sm:space-y-5 sm:pb-14">
        <h1 className="text-lg font-semibold text-zinc-900">{profileContent.pageTitle}</h1>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <aside>
            <ProfileSidebar />
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </ProfileGuard>
  );
}
