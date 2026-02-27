export type ProfileSectionId =
  | "account"
  | "addresses"
  | "preferences"
  | "visibility"
  | "privacy";

export type ProfileAddress = {
  id: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  addressLine1: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProfileAccountState = {
  email: string;
  passwordMask: string;
  birthday: string;
  country: string;
  district: string;
  city: string;
  postalCode: string;
};

export type ProfilePreferencesState = {
  shoeSize: string;
  primaryPreference: "women" | "men";
  otherPreferences: Array<"girls" | "boys" | "women" | "men">;
  measurementUnit: "metric" | "imperial";
};

export type ProfileVisibilityState = {
  displayName: string;
  avatarText: string;
  reviewVisibility: "private" | "community" | "public";
  locationSharing: "friends" | "none";
};

export type ProfilePrivacyState = {
  adsByUsageData: boolean;
  adsByProfileData: boolean;
  useFitnessData: boolean;
};

export type ProfileState = {
  account: ProfileAccountState;
  addresses: ProfileAddress[];
  preferences: ProfilePreferencesState;
  visibility: ProfileVisibilityState;
  privacy: ProfilePrivacyState;
  updatedAt: string;
};

export type ProfileAddressInput = Omit<ProfileAddress, "id" | "createdAt" | "updatedAt">;

export type ProfileNavItem = {
  id: ProfileSectionId;
  label: string;
  href: string;
  icon:
    | "account"
    | "addresses"
    | "preferences"
    | "visibility"
    | "privacy";
};
