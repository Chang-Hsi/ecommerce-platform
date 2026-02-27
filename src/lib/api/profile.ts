import { request } from "@/lib/api/request";
import type {
  ProfileAccountState,
  ProfileAddressInput,
  ProfilePreferencesState,
  ProfilePrivacyState,
  ProfileState,
  ProfileVisibilityState,
} from "@/lib/profile/types";

type ProfileEnvelope = {
  profile: ProfileState;
};

export async function fetchProfileStateFromApi() {
  const payload = await request<ProfileEnvelope>("/api/profile", {
    cache: "no-store",
  });

  return payload.data.profile;
}

export async function saveProfileAccountToApi(account: ProfileAccountState) {
  const payload = await request<ProfileEnvelope>("/api/profile/account", {
    method: "PUT",
    body: account,
  });

  return payload.data.profile;
}

export async function deleteProfileAccountFromApi() {
  await request<{ success: boolean }>("/api/profile/account", {
    method: "DELETE",
  });
}

export async function saveProfilePreferencesToApi(preferences: ProfilePreferencesState) {
  const payload = await request<ProfileEnvelope>("/api/profile/preferences", {
    method: "PUT",
    body: preferences,
  });

  return payload.data.profile;
}

export async function saveProfileVisibilityToApi(visibility: ProfileVisibilityState) {
  const payload = await request<ProfileEnvelope>("/api/profile/visibility", {
    method: "PUT",
    body: visibility,
  });

  return payload.data.profile;
}

export async function saveProfilePrivacyToApi(privacy: ProfilePrivacyState) {
  const payload = await request<ProfileEnvelope>("/api/profile/privacy", {
    method: "PUT",
    body: privacy,
  });

  return payload.data.profile;
}

export async function addProfileAddressToApi(input: ProfileAddressInput) {
  const payload = await request<ProfileEnvelope>("/api/profile/addresses", {
    method: "POST",
    body: input,
  });

  return payload.data.profile;
}

export async function removeProfileAddressFromApi(addressId: string) {
  const payload = await request<ProfileEnvelope>(`/api/profile/addresses/${encodeURIComponent(addressId)}`, {
    method: "DELETE",
  });

  return payload.data.profile;
}

export async function uploadProfileAvatarToApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const payload = await request<ProfileEnvelope>("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });

  return payload.data.profile;
}
