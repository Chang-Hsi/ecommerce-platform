"use client";

import { useEffect, useState } from "react";
import { getProfileState, MOCK_PROFILE_CHANGED_EVENT } from "@/lib/profile/mock-profile";
import type { ProfileState } from "@/lib/profile/types";

export function useProfileState() {
  const [state, setState] = useState<ProfileState>(() => getProfileState());

  useEffect(() => {
    function sync() {
      setState(getProfileState());
    }

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener(MOCK_PROFILE_CHANGED_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(MOCK_PROFILE_CHANGED_EVENT, sync as EventListener);
    };
  }, []);

  return {
    state,
    setState,
  };
}
