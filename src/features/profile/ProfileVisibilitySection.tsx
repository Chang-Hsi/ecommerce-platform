"use client";

import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ProfileSaveButton, ProfileSectionTitle } from "@/components/profile/ProfileFormControls";
import { useProfileState } from "@/hooks/profile/useProfileState";
import type { ProfileVisibilityState } from "@/lib/profile/types";

export function ProfileVisibilitySection() {
  const { state, saveVisibility, uploadAvatar } = useProfileState();
  const [draft, setDraft] = useState<Partial<ProfileVisibilityState>>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useMemo(() => ({ ...state.visibility, ...draft }), [state.visibility, draft]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(state.visibility), [form, state.visibility]);

  function updateField<K extends keyof ProfileVisibilityState>(key: K, value: ProfileVisibilityState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    try {
      await saveVisibility(form);
      setDraft({});
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "儲存個人檔案能見度失敗，請稍後再試。");
    }
  }

  async function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    setRequestError(null);
    setIsUploading(true);

    try {
      await uploadAvatar(file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "頭像上傳失敗，請稍後再試。");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfileSectionTitle
        title="個人檔案能見度"
        description="在產品評價和 SwooshLab 一系列應用程式中，你的 SwooshLab 個人檔案即代表你。"
      />

      <section className="flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-6">
        <div className="relative">
          {form.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.avatarUrl}
              alt="個人頭像"
              className="h-20 w-20 rounded-full border border-zinc-200 object-cover"
            />
          ) : (
            <UserCircleIcon className="h-20 w-20 text-zinc-300" aria-hidden />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-base font-medium text-zinc-900">{form.displayName}</p>
          <p className="text-base text-zinc-600">{form.avatarText}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              void onFileSelected(event);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex h-9 items-center rounded-full border border-zinc-300 px-4 text-base text-zinc-900 disabled:opacity-50"
          >
            {isUploading ? "上傳中..." : "編輯"}
          </button>
          {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
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

      {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}
    </form>
  );
}
