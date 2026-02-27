"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMockSession, resolveSafeRedirect } from "@/lib/auth/mock-auth";
import { useMockAuthSession } from "@/hooks/auth/useMockAuthSession";

export function ProfileGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useMockAuthSession();

  useEffect(() => {
    if (!isAuthenticated) {
      const liveSession = getMockSession();
      if (liveSession) {
        return;
      }

      const returnPath = pathname;
      const redirect = resolveSafeRedirect(returnPath);
      router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
