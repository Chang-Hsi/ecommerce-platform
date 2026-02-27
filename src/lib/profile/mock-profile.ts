import { getMockSession } from "@/lib/auth/mock-auth";
import type {
  ProfileAccountState,
  ProfileAddress,
  ProfileAddressInput,
  ProfilePreferencesState,
  ProfilePrivacyState,
  ProfileState,
  ProfileVisibilityState,
} from "@/lib/profile/types";

const PROFILE_STORAGE_KEY = "swooshlab.mock-profile.settings.v1";

export const MOCK_PROFILE_CHANGED_EVENT = "swooshlab:mock-profile-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function createDefaultState(email?: string): ProfileState {
  const timestamp = nowIso();

  return {
    account: {
      email: email ?? "",
      passwordMask: "••••••••••••••••",
      birthday: "1992-01-26",
      country: "台灣",
      district: "桃園區",
      city: "桃園市",
      postalCode: "330",
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
      avatarText: "長西828228298",
      reviewVisibility: "community",
      locationSharing: "none",
    },
    privacy: {
      adsByUsageData: true,
      adsByProfileData: true,
      useFitnessData: true,
    },
    updatedAt: timestamp,
  };
}

function normalizeAddress(address: ProfileAddress): ProfileAddress {
  return {
    ...address,
    id: String(address.id || "").trim(),
    recipientName: String(address.recipientName || "").trim(),
    phone: String(address.phone || "").trim(),
    country: String(address.country || "").trim(),
    city: String(address.city || "").trim(),
    district: String(address.district || "").trim(),
    addressLine1: String(address.addressLine1 || "").trim(),
    postalCode: String(address.postalCode || "").trim(),
    isDefault: Boolean(address.isDefault),
    createdAt: address.createdAt || nowIso(),
    updatedAt: address.updatedAt || nowIso(),
  };
}

function normalizeAccount(next: Partial<ProfileAccountState>, fallback: ProfileAccountState): ProfileAccountState {
  return {
    email: String(next.email ?? fallback.email ?? "").trim(),
    passwordMask: String(next.passwordMask ?? fallback.passwordMask ?? "••••••••••••••••").trim(),
    birthday: String(next.birthday ?? fallback.birthday ?? "").trim(),
    country: String(next.country ?? fallback.country ?? "").trim(),
    district: String(next.district ?? fallback.district ?? "").trim(),
    city: String(next.city ?? fallback.city ?? "").trim(),
    postalCode: String(next.postalCode ?? fallback.postalCode ?? "").trim(),
  };
}

function normalizePreferences(
  next: Partial<ProfilePreferencesState>,
  fallback: ProfilePreferencesState,
): ProfilePreferencesState {
  const primary = next.primaryPreference ?? fallback.primaryPreference;
  const unit = next.measurementUnit ?? fallback.measurementUnit;

  return {
    shoeSize: String(next.shoeSize ?? fallback.shoeSize ?? "").trim(),
    primaryPreference: primary === "men" ? "men" : "women",
    otherPreferences: Array.isArray(next.otherPreferences)
      ? next.otherPreferences.filter(
          (item): item is ProfilePreferencesState["otherPreferences"][number] =>
            item === "girls" || item === "boys" || item === "women" || item === "men",
        )
      : fallback.otherPreferences,
    measurementUnit: unit === "imperial" ? "imperial" : "metric",
  };
}

function normalizeVisibility(next: Partial<ProfileVisibilityState>, fallback: ProfileVisibilityState): ProfileVisibilityState {
  const reviewVisibility = next.reviewVisibility ?? fallback.reviewVisibility;
  const locationSharing = next.locationSharing ?? fallback.locationSharing;

  return {
    displayName: String(next.displayName ?? fallback.displayName ?? "").trim(),
    avatarText: String(next.avatarText ?? fallback.avatarText ?? "").trim(),
    reviewVisibility:
      reviewVisibility === "private" || reviewVisibility === "public" ? reviewVisibility : "community",
    locationSharing: locationSharing === "friends" ? "friends" : "none",
  };
}

function normalizePrivacy(next: Partial<ProfilePrivacyState>, fallback: ProfilePrivacyState): ProfilePrivacyState {
  return {
    adsByUsageData: typeof next.adsByUsageData === "boolean" ? next.adsByUsageData : fallback.adsByUsageData,
    adsByProfileData: typeof next.adsByProfileData === "boolean" ? next.adsByProfileData : fallback.adsByProfileData,
    useFitnessData: typeof next.useFitnessData === "boolean" ? next.useFitnessData : fallback.useFitnessData,
  };
}

function mergeWithDefaults(input: Partial<ProfileState>, defaults: ProfileState): ProfileState {
  const merged: ProfileState = {
    account: normalizeAccount(input.account ?? {}, defaults.account),
    addresses: Array.isArray(input.addresses)
      ? input.addresses
          .map((address) => normalizeAddress(address))
          .filter((address) => Boolean(address.id && address.recipientName))
      : defaults.addresses,
    preferences: normalizePreferences(input.preferences ?? {}, defaults.preferences),
    visibility: normalizeVisibility(input.visibility ?? {}, defaults.visibility),
    privacy: normalizePrivacy(input.privacy ?? {}, defaults.privacy),
    updatedAt: input.updatedAt || defaults.updatedAt,
  };

  if (merged.addresses.length > 0 && !merged.addresses.some((address) => address.isDefault)) {
    merged.addresses = merged.addresses.map((address, index) => ({
      ...address,
      isDefault: index === 0,
    }));
  }

  return merged;
}

function readProfileStateRaw(): ProfileState | null {
  if (!isBrowser()) {
    return null;
  }

  const parsed = safeJsonParse<Partial<ProfileState> | null>(localStorage.getItem(PROFILE_STORAGE_KEY), null);
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const session = getMockSession();
  const defaults = createDefaultState(session?.email);
  return mergeWithDefaults(parsed, defaults);
}

function emitProfileChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(MOCK_PROFILE_CHANGED_EVENT));
}

function writeProfileState(next: ProfileState) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
}

function nextAddressId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `addr-${Date.now()}`;
}

export function getProfileState() {
  if (!isBrowser()) {
    return createDefaultState();
  }

  const existing = readProfileStateRaw();
  if (existing) {
    return existing;
  }

  const session = getMockSession();
  const defaults = createDefaultState(session?.email);
  writeProfileState(defaults);
  return defaults;
}

function updateProfileState(updater: (current: ProfileState) => ProfileState) {
  const current = getProfileState();
  const next = updater(current);
  const normalized = mergeWithDefaults(next, createDefaultState(current.account.email));
  const withUpdatedAt: ProfileState = {
    ...normalized,
    updatedAt: nowIso(),
  };

  writeProfileState(withUpdatedAt);
  emitProfileChanged();
  return withUpdatedAt;
}

export function saveProfileAccount(account: ProfileAccountState) {
  return updateProfileState((current) => ({
    ...current,
    account: normalizeAccount(account, current.account),
  }));
}

export function saveProfilePreferences(preferences: ProfilePreferencesState) {
  return updateProfileState((current) => ({
    ...current,
    preferences: normalizePreferences(preferences, current.preferences),
  }));
}

export function saveProfileVisibility(visibility: ProfileVisibilityState) {
  return updateProfileState((current) => ({
    ...current,
    visibility: normalizeVisibility(visibility, current.visibility),
  }));
}

export function saveProfilePrivacy(privacy: ProfilePrivacyState) {
  return updateProfileState((current) => ({
    ...current,
    privacy: normalizePrivacy(privacy, current.privacy),
  }));
}

export function addProfileAddress(input: ProfileAddressInput) {
  const timestamp = nowIso();

  return updateProfileState((current) => {
    const nextAddress: ProfileAddress = {
      id: nextAddressId(),
      recipientName: input.recipientName.trim(),
      phone: input.phone.trim(),
      country: input.country.trim(),
      city: input.city.trim(),
      district: input.district.trim(),
      addressLine1: input.addressLine1.trim(),
      postalCode: input.postalCode.trim(),
      isDefault: input.isDefault || current.addresses.length === 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const baseAddresses = nextAddress.isDefault
      ? current.addresses.map((address) => ({ ...address, isDefault: false, updatedAt: timestamp }))
      : current.addresses;

    return {
      ...current,
      addresses: [nextAddress, ...baseAddresses],
    };
  });
}

export function removeProfileAddress(addressId: string) {
  const timestamp = nowIso();

  return updateProfileState((current) => {
    const next = current.addresses.filter((address) => address.id !== addressId);

    if (next.length > 0 && !next.some((address) => address.isDefault)) {
      next[0] = { ...next[0], isDefault: true, updatedAt: timestamp };
    }

    return {
      ...current,
      addresses: next,
    };
  });
}

export function clearProfileState() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(PROFILE_STORAGE_KEY);
  emitProfileChanged();
}
