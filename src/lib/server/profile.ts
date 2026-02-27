import {
  LocationSharing,
  MeasurementUnit,
  PrimaryPreference,
  ReviewVisibility,
  type Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  ProfileAccountState,
  ProfileAddress,
  ProfileAddressInput,
  ProfilePreferencesState,
  ProfilePrivacyState,
  ProfileState,
  ProfileVisibilityState,
} from "@/lib/profile/types";

const PASSWORD_MASK = "••••••••••••••••";

function toIsoDate(value: Date | null | undefined) {
  if (!value) {
    return "";
  }

  return value.toISOString().slice(0, 10);
}

function parseBirthday(value: string) {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const parsed = new Date(`${normalized}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function mapPrimaryPreferenceToClient(value: PrimaryPreference | null): ProfilePreferencesState["primaryPreference"] {
  return value === PrimaryPreference.MEN ? "men" : "women";
}

function mapPrimaryPreferenceToDb(value: ProfilePreferencesState["primaryPreference"]) {
  return value === "men" ? PrimaryPreference.MEN : PrimaryPreference.WOMEN;
}

function mapMeasurementToClient(value: MeasurementUnit | null): ProfilePreferencesState["measurementUnit"] {
  return value === MeasurementUnit.IMPERIAL ? "imperial" : "metric";
}

function mapMeasurementToDb(value: ProfilePreferencesState["measurementUnit"]) {
  return value === "imperial" ? MeasurementUnit.IMPERIAL : MeasurementUnit.METRIC;
}

function mapReviewVisibilityToClient(value: ReviewVisibility | null): ProfileVisibilityState["reviewVisibility"] {
  if (value === ReviewVisibility.PRIVATE) {
    return "private";
  }

  if (value === ReviewVisibility.PUBLIC) {
    return "public";
  }

  return "community";
}

function mapReviewVisibilityToDb(value: ProfileVisibilityState["reviewVisibility"]) {
  if (value === "private") {
    return ReviewVisibility.PRIVATE;
  }

  if (value === "public") {
    return ReviewVisibility.PUBLIC;
  }

  return ReviewVisibility.COMMUNITY;
}

function mapLocationSharingToClient(value: LocationSharing | null): ProfileVisibilityState["locationSharing"] {
  return value === LocationSharing.FRIENDS ? "friends" : "none";
}

function mapLocationSharingToDb(value: ProfileVisibilityState["locationSharing"]) {
  return value === "friends" ? LocationSharing.FRIENDS : LocationSharing.NONE;
}

function sanitizeOtherPreferences(input: string[] | undefined) {
  if (!input || input.length === 0) {
    return [];
  }

  return input.filter((item): item is "girls" | "boys" | "women" | "men" =>
    item === "girls" || item === "boys" || item === "women" || item === "men");
}

function mapAddress(address: {
  id: string;
  recipientLastName: string;
  recipientFirstName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  addressLine1: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ProfileAddress {
  return {
    id: address.id,
    recipientLastName: address.recipientLastName,
    recipientFirstName: address.recipientFirstName,
    phone: address.phone,
    country: address.country,
    city: address.city,
    district: address.district,
    addressLine1: address.addressLine1,
    postalCode: address.postalCode,
    isDefault: address.isDefault,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString(),
  };
}

type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    profile: true;
    addresses: {
      orderBy: {
        createdAt: "desc";
      };
    };
  };
}>;

function toProfileState(user: UserWithProfile): ProfileState {
  const profile = user.profile;
  const visibilityName = profile?.displayName || user.name || "個人檔案顯示資訊";

  return {
    account: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email,
      passwordMask: PASSWORD_MASK,
      birthday: toIsoDate(profile?.birthday),
      country: profile?.country ?? "",
      district: profile?.district ?? "",
      city: profile?.city ?? "",
      postalCode: profile?.postalCode ?? "",
    },
    addresses: user.addresses.map(mapAddress),
    preferences: {
      shoeSize: profile?.shoeSize ?? "",
      primaryPreference: mapPrimaryPreferenceToClient(profile?.primaryPreference ?? null),
      otherPreferences: sanitizeOtherPreferences(profile?.otherPreferences),
      measurementUnit: mapMeasurementToClient(profile?.measurementUnit ?? null),
    },
    visibility: {
      displayName: visibilityName,
      avatarText: profile?.avatarText ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
      reviewVisibility: mapReviewVisibilityToClient(profile?.reviewVisibility ?? null),
      locationSharing: mapLocationSharingToClient(profile?.locationSharing ?? null),
    },
    privacy: {
      adsByUsageData: profile?.adsByUsageData ?? true,
      adsByProfileData: profile?.adsByProfileData ?? true,
      useFitnessData: profile?.useFitnessData ?? true,
    },
    updatedAt: (profile?.updatedAt ?? user.updatedAt).toISOString(),
  };
}

async function findUserWithProfile(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      addresses: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

async function ensureProfile(userId: string) {
  return prisma.userProfile.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  });
}

async function readOrThrow(userId: string) {
  const user = await findUserWithProfile(userId);
  if (!user) {
    throw new Error("找不到使用者");
  }

  return user;
}

export async function getProfileStateByUserId(userId: string) {
  const user = await readOrThrow(userId);
  return toProfileState(user);
}

export async function updateProfileAccountByUserId(userId: string, account: ProfileAccountState) {
  const normalizedFirstName = account.firstName.trim();
  const normalizedLastName = account.lastName.trim();
  const normalizedEmail = account.email.trim().toLowerCase();
  const birthday = parseBirthday(account.birthday);
  const normalizedName = `${normalizedLastName}${normalizedFirstName}`.trim();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: normalizedFirstName || null,
        lastName: normalizedLastName || null,
        name: normalizedName || null,
        email: normalizedEmail,
      },
    });

    await tx.userProfile.upsert({
      where: {
        userId,
      },
      update: {
        birthday,
        country: account.country.trim() || null,
        district: account.district.trim() || null,
        city: account.city.trim() || null,
        postalCode: account.postalCode.trim() || null,
      },
      create: {
        userId,
        birthday,
        country: account.country.trim() || null,
        district: account.district.trim() || null,
        city: account.city.trim() || null,
        postalCode: account.postalCode.trim() || null,
      },
    });
  });

  return getProfileStateByUserId(userId);
}

export async function updateProfilePreferencesByUserId(userId: string, preferences: ProfilePreferencesState) {
  await ensureProfile(userId);

  await prisma.userProfile.update({
    where: {
      userId,
    },
    data: {
      shoeSize: preferences.shoeSize.trim() || null,
      primaryPreference: mapPrimaryPreferenceToDb(preferences.primaryPreference),
      otherPreferences: sanitizeOtherPreferences(preferences.otherPreferences),
      measurementUnit: mapMeasurementToDb(preferences.measurementUnit),
    },
  });

  return getProfileStateByUserId(userId);
}

export async function updateProfileVisibilityByUserId(userId: string, visibility: ProfileVisibilityState) {
  await ensureProfile(userId);

  await prisma.userProfile.update({
    where: {
      userId,
    },
    data: {
      displayName: visibility.displayName.trim() || null,
      avatarText: visibility.avatarText.trim() || null,
      avatarUrl: visibility.avatarUrl.trim() || null,
      reviewVisibility: mapReviewVisibilityToDb(visibility.reviewVisibility),
      locationSharing: mapLocationSharingToDb(visibility.locationSharing),
    },
  });

  return getProfileStateByUserId(userId);
}

export async function updateProfilePrivacyByUserId(userId: string, privacy: ProfilePrivacyState) {
  await ensureProfile(userId);

  await prisma.userProfile.update({
    where: {
      userId,
    },
    data: {
      adsByUsageData: privacy.adsByUsageData,
      adsByProfileData: privacy.adsByProfileData,
      useFitnessData: privacy.useFitnessData,
    },
  });

  return getProfileStateByUserId(userId);
}

export async function addProfileAddressByUserId(userId: string, input: ProfileAddressInput) {
  const recipientLastName = input.recipientLastName.trim();
  const recipientFirstName = input.recipientFirstName.trim();
  const phone = input.phone.trim();
  const country = input.country.trim();
  const city = input.city.trim();
  const district = input.district.trim();
  const addressLine1 = input.addressLine1.trim();
  const postalCode = input.postalCode.trim();

  await prisma.$transaction(async (tx) => {
    const currentCount = await tx.userAddress.count({
      where: {
        userId,
      },
    });

    const shouldBeDefault = input.isDefault || currentCount === 0;

    if (shouldBeDefault) {
      await tx.userAddress.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    await tx.userAddress.create({
      data: {
        userId,
        recipientLastName,
        recipientFirstName,
        phone,
        country,
        city,
        district,
        addressLine1,
        postalCode,
        isDefault: shouldBeDefault,
      },
    });
  });

  return getProfileStateByUserId(userId);
}

export async function removeProfileAddressByUserId(userId: string, addressId: string) {
  await prisma.$transaction(async (tx) => {
    const target = await tx.userAddress.findFirst({
      where: {
        id: addressId,
        userId,
      },
      select: {
        id: true,
        isDefault: true,
      },
    });

    if (!target) {
      return;
    }

    await tx.userAddress.delete({
      where: {
        id: target.id,
      },
    });

    if (!target.isDefault) {
      return;
    }

    const nextDefault = await tx.userAddress.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    if (!nextDefault) {
      return;
    }

    await tx.userAddress.update({
      where: {
        id: nextDefault.id,
      },
      data: {
        isDefault: true,
      },
    });
  });

  return getProfileStateByUserId(userId);
}

export async function updateProfileAvatarByUserId(userId: string, avatarUrl: string) {
  await ensureProfile(userId);

  await prisma.userProfile.update({
    where: {
      userId,
    },
    data: {
      avatarUrl,
    },
  });

  return getProfileStateByUserId(userId);
}
