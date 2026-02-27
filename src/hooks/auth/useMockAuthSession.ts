"use client";

import { useEffect, useState } from "react";
import { fetchAuthSessionFromApi, logoutFromApi } from "@/lib/api/auth";
import {
  getMockSession,
  MOCK_AUTH_CHANGED_EVENT,
  setMockSession,
  type MockAuthSession,
} from "@/lib/auth/mock-auth";

export function useMockAuthSession() {
  const [session, setSession] = useState<MockAuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    function syncSession() {
      setSession(getMockSession());
    }

    syncSession();

    async function syncSessionFromServer() {
      try {
        const remoteSession = await fetchAuthSessionFromApi();

        if (!isMounted) {
          return;
        }

        setMockSession(
          remoteSession
            ? {
                email: remoteSession.email,
                name: remoteSession.name,
              }
            : null,
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setMockSession(null);
      } finally {
        if (isMounted) {
          setIsReady(true);
        }
      }
    }

    void syncSessionFromServer();

    window.addEventListener("storage", syncSession);
    window.addEventListener(MOCK_AUTH_CHANGED_EVENT, syncSession as EventListener);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(MOCK_AUTH_CHANGED_EVENT, syncSession as EventListener);
    };
  }, []);

  function signOut() {
    setMockSession(null);
    void logoutFromApi();
  }

  return {
    session,
    isReady,
    isAuthenticated: Boolean(session),
    signOut,
  };
}
