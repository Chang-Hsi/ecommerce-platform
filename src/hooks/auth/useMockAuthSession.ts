"use client";

import { useEffect, useState } from "react";
import {
  getMockSession,
  MOCK_AUTH_CHANGED_EVENT,
  signOutMockUser,
  type MockAuthSession,
} from "@/lib/auth/mock-auth";

export function useMockAuthSession() {
  const [session, setSession] = useState<MockAuthSession | null>(null);

  useEffect(() => {
    function syncSession() {
      setSession(getMockSession());
    }

    syncSession();

    window.addEventListener("storage", syncSession);
    window.addEventListener(MOCK_AUTH_CHANGED_EVENT, syncSession as EventListener);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(MOCK_AUTH_CHANGED_EVENT, syncSession as EventListener);
    };
  }, []);

  return {
    session,
    isAuthenticated: Boolean(session),
    signOut: signOutMockUser,
  };
}
