"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMockSession,
  MOCK_AUTH_CHANGED_EVENT,
} from "@/lib/auth/mock-auth";
import {
  addProfileAddressToApi,
  deleteProfileAccountFromApi,
  fetchProfileStateFromApi,
  removeProfileAddressFromApi,
  saveProfileAccountToApi,
  saveProfilePreferencesToApi,
  saveProfilePrivacyToApi,
  saveProfileVisibilityToApi,
  uploadProfileAvatarToApi,
} from "@/lib/api/profile";
import type {
  ProfileAccountState,
  ProfileAddressInput,
  ProfilePreferencesState,
  ProfilePrivacyState,
  ProfileState,
  ProfileVisibilityState,
} from "@/lib/profile/types";

const emptyProfileState: ProfileState = {
  account: {
    firstName: "",
    lastName: "",
    email: "",
    passwordMask: "••••••••••••••••",
    birthday: "",
    country: "",
    district: "",
    city: "",
    postalCode: "",
  },
  addresses: [],
  preferences: {
    shoeSize: "",
    primaryPreference: "women",
    otherPreferences: [],
    measurementUnit: "metric",
  },
  visibility: {
    displayName: "個人檔案顯示資訊",
    avatarText: "",
    avatarUrl: "",
    reviewVisibility: "community",
    locationSharing: "none",
  },
  privacy: {
    adsByUsageData: true,
    adsByProfileData: true,
    useFitnessData: true,
  },
  updatedAt: new Date(0).toISOString(),
};

let sharedProfileState: ProfileState = emptyProfileState;
let hasLoadedSharedState = false;
let inflightPromise: Promise<ProfileState> | null = null;

const listeners = new Set<(state: ProfileState) => void>();

function emit(next: ProfileState) {
  sharedProfileState = next;
  hasLoadedSharedState = true;
  for (const listener of listeners) {
    listener(next);
  }
}

async function fetchProfileState() {
  if (inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = fetchProfileStateFromApi()
    .then((profile) => {
      emit(profile);
      return profile;
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

export function useProfileState() {
  const [state, setState] = useState<ProfileState>(sharedProfileState);
  const [isReady, setIsReady] = useState(hasLoadedSharedState);
  const [isLoading, setIsLoading] = useState(!hasLoadedSharedState);

  useEffect(() => {
    function handle(next: ProfileState) {
      setState(next);
      setIsReady(true);
      setIsLoading(false);
    }

    listeners.add(handle);

    if (hasLoadedSharedState) {
      handle(sharedProfileState);
    } else {
      void fetchProfileState().catch((error) => {
        console.error("[useProfileState] bootstrap failed", error);
        setIsReady(true);
        setIsLoading(false);
      });
    }

    return () => {
      listeners.delete(handle);
    };
  }, []);

  useEffect(() => {
    async function handleAuthChanged() {
      if (getMockSession()) {
        try {
          await fetchProfileState();
        } catch (error) {
          console.error("[useProfileState] auth sync failed", error);
        }
        return;
      }

      emit(emptyProfileState);
    }

    window.addEventListener(MOCK_AUTH_CHANGED_EVENT, handleAuthChanged as EventListener);
    return () => {
      window.removeEventListener(MOCK_AUTH_CHANGED_EVENT, handleAuthChanged as EventListener);
    };
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      return await fetchProfileState();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actions = useMemo(
    () => ({
      saveAccount: async (account: ProfileAccountState) => {
        const next = await saveProfileAccountToApi(account);
        emit(next);
        return next;
      },
      deleteAccount: async () => {
        await deleteProfileAccountFromApi();
        emit(emptyProfileState);
      },
      savePreferences: async (preferences: ProfilePreferencesState) => {
        const next = await saveProfilePreferencesToApi(preferences);
        emit(next);
        return next;
      },
      saveVisibility: async (visibility: ProfileVisibilityState) => {
        const next = await saveProfileVisibilityToApi(visibility);
        emit(next);
        return next;
      },
      savePrivacy: async (privacy: ProfilePrivacyState) => {
        const next = await saveProfilePrivacyToApi(privacy);
        emit(next);
        return next;
      },
      addAddress: async (input: ProfileAddressInput) => {
        const next = await addProfileAddressToApi(input);
        emit(next);
        return next;
      },
      removeAddress: async (addressId: string) => {
        const next = await removeProfileAddressFromApi(addressId);
        emit(next);
        return next;
      },
      uploadAvatar: async (file: File) => {
        const next = await uploadProfileAvatarToApi(file);
        emit(next);
        return next;
      },
    }),
    [],
  );

  return {
    state,
    isReady,
    isLoading,
    refresh,
    ...actions,
  };
}
