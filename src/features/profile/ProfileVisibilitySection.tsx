"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useMemo, useState, type FormEvent } from "react";
import { ProfileSaveButton, ProfileSectionTitle } from "@/components/profile/ProfileFormControls";
import { saveProfileVisibility } from "@/lib/profile/mock-profile";
import { useProfileState } from "@/hooks/profile/useProfileState";
import type { ProfileVisibilityState } from "@/lib/profile/types";

export function ProfileVisibilitySection() {
  const { state } = useProfileState();
  const [form, setForm] = useState(state.visibility);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(state.visibility), [form, state.visibility]);

  function updateField<K extends keyof ProfileVisibilityState>(key: K, value: ProfileVisibilityState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProfileVisibility(form);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfileSectionTitle
        title="個人檔案能見度"
        description="在產品評價和 SwooshLab 一系列應用程式中，你的 SwooshLab 個人檔案即代表你。"
      />

      <section className="flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-6">
        <div className="relative">
          <UserCircleIcon className="h-20 w-20 text-zinc-300" aria-hidden />
        </div>

        <div className="space-y-2">
          <p className="text-base font-medium text-zinc-900">{form.displayName}</p>
          <p className="text-base text-zinc-600">{form.avatarText}</p>
          <button
            type="button"
            onClick={() => window.alert("M3 先以 mock 流程處理頭像編輯")}
            className="inline-flex h-9 items-center rounded-full border border-zinc-300 px-4 text-base text-zinc-900"
          >
            編輯
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium text-zinc-900">產品評價能見度</h3>
        <p className="text-base text-zinc-700">
          請選擇你的個人檔案在 SwooshLab 產品評價中的顯示方式。瞭解更多資訊
        </p>

        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="review-visibility"
            checked={form.reviewVisibility === "private"}
            onChange={() => updateField("reviewVisibility", "private")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          私人：個人檔案僅限自己檢視
        </label>
        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="review-visibility"
            checked={form.reviewVisibility === "community"}
            onChange={() => updateField("reviewVisibility", "community")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          社群：個人檔案僅限朋友檢視
        </label>
        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="review-visibility"
            checked={form.reviewVisibility === "public"}
            onChange={() => updateField("reviewVisibility", "public")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          公開：任何人都可檢視個人檔案
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium text-zinc-900">位置分享</h3>

        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="location-sharing"
            checked={form.locationSharing === "friends"}
            onChange={() => updateField("locationSharing", "friends")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          僅與朋友分享我的位置資訊
        </label>
        <label className="flex items-center gap-2 text-base text-zinc-900">
          <input
            type="radio"
            name="location-sharing"
            checked={form.locationSharing === "none"}
            onChange={() => updateField("locationSharing", "none")}
            className="h-4 w-4 border-zinc-300 text-zinc-900"
          />
          不要分享我的位置資訊
        </label>
      </section>

      <div className="flex justify-end">
        <ProfileSaveButton disabled={!isDirty} />
      </div>
    </form>
  );
}
