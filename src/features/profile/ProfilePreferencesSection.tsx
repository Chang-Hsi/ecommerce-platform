"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ProfileFloatingSelect, ProfileSaveButton, ProfileSectionTitle } from "@/components/profile/ProfileFormControls";
import { profileShoeSizeOptions } from "@/content/profile";
import { saveProfilePreferences } from "@/lib/profile/mock-profile";
import { useProfileState } from "@/hooks/profile/useProfileState";
import type { ProfilePreferencesState } from "@/lib/profile/types";

const otherPreferenceOptions: Array<{ value: ProfilePreferencesState["otherPreferences"][number]; label: string }> = [
  { value: "girls", label: "女童款" },
  { value: "boys", label: "男童款" },
  { value: "women", label: "女款" },
  { value: "men", label: "男款" },
];

export function ProfilePreferencesSection() {
  const { state } = useProfileState();
  const [form, setForm] = useState(state.preferences);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(state.preferences), [form, state.preferences]);

  function updateField<K extends keyof ProfilePreferencesState>(key: K, value: ProfilePreferencesState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleOtherPreference(value: ProfilePreferencesState["otherPreferences"][number]) {
    setForm((current) => {
      const exists = current.otherPreferences.includes(value);
      return {
        ...current,
        otherPreferences: exists
          ? current.otherPreferences.filter((item) => item !== value)
          : [...current.otherPreferences, value],
      };
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProfilePreferences(form);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfileSectionTitle title="購物偏好" />

      <section className="space-y-3">
        <ProfileFloatingSelect
          id="profile-shoe-size"
          label="鞋款尺寸"
          value={form.shoeSize}
          options={profileShoeSizeOptions}
          placeholder="鞋款尺寸"
          onChange={(value) => updateField("shoeSize", value)}
        />
        <p className="text-sm text-zinc-500">提供你的鞋款尺寸，以便系統在你選購鞋款時預先挑選好尺寸。</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium text-zinc-900">購物偏好設定</h3>
        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="primary-preference"
            checked={form.primaryPreference === "women"}
            onChange={() => updateField("primaryPreference", "women")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          女款
        </label>
        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="primary-preference"
            checked={form.primaryPreference === "men"}
            onChange={() => updateField("primaryPreference", "men")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          男款
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium text-zinc-900">其他偏好</h3>

        {otherPreferenceOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-base text-zinc-900">
            <input
              type="checkbox"
              checked={form.otherPreferences.includes(option.value)}
              onChange={() => toggleOtherPreference(option.value)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
            />
            {option.label}
          </label>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium text-zinc-900">測量單位</h3>

        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="measurement-unit"
            checked={form.measurementUnit === "metric"}
            onChange={() => updateField("measurementUnit", "metric")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          公制
        </label>
        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="measurement-unit"
            checked={form.measurementUnit === "imperial"}
            onChange={() => updateField("measurementUnit", "imperial")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          英制
        </label>
      </section>

      <div className="flex justify-end">
        <ProfileSaveButton disabled={!isDirty} />
      </div>
    </form>
  );
}
