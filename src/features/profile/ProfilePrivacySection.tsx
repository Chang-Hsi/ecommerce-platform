"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ProfileSaveButton, ProfileSectionTitle } from "@/components/profile/ProfileFormControls";
import { useProfileState } from "@/hooks/profile/useProfileState";
import type { ProfilePrivacyState } from "@/lib/profile/types";

export function ProfilePrivacySection() {
  const { state, savePrivacy } = useProfileState();
  const [draft, setDraft] = useState<Partial<ProfilePrivacyState>>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const form = useMemo(() => ({ ...state.privacy, ...draft }), [state.privacy, draft]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(state.privacy), [form, state.privacy]);

  function updateField<K extends keyof ProfilePrivacyState>(key: K, value: ProfilePrivacyState[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError(null);
    try {
      await savePrivacy(form);
      setDraft({});
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "儲存隱私設定失敗，請稍後再試。");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfileSectionTitle
        title="隱私權"
        description="我們使用你的資料向你提供相關廣告並衡量其成效。你可以透過下方的隱私權設定管理資料用於廣告的方式。"
      />

      <div className="space-y-3 text-base text-zinc-800">
        <p>
          這些資料包含 SwooshLab 和我們的第三方合作夥伴會追蹤、也包含了我們收集的其他資料，例如你的電子郵件或電話號碼。
        </p>
        <p>
          如需瞭解更多資訊，請查看我們的隱私權政策。
        </p>
        <a href="#" className="inline-flex underline">
          SwooshLab 隱私權政策
        </a>
      </div>

      <div className="space-y-4 border-t border-zinc-200 pt-4">
        <label className="block space-y-2 border-b border-zinc-200 pb-4">
          <span className="inline-flex items-start gap-2 text-base font-medium text-zinc-900">
            <input
              type="checkbox"
              checked={form.adsByUsageData}
              onChange={(event) => updateField("adsByUsageData", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900"
            />
            根據使用資料提供的個人化廣告
          </span>
          <span className="block pl-6 text-base text-zinc-600">
            允許我們與廣告合作夥伴分享網站和應用程式的使用資料。此資料是用於提供廣告，以及提升整體使用體驗。
          </span>
        </label>

        <label className="block space-y-2 border-b border-zinc-200 pb-4">
          <span className="inline-flex items-start gap-2 text-base font-medium text-zinc-900">
            <input
              type="checkbox"
              checked={form.adsByProfileData}
              onChange={(event) => updateField("adsByProfileData", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900"
            />
            根據個人檔案提供的個人化廣告
          </span>
          <span className="block pl-6 text-base text-zinc-600">
            允許我們與廣告合作夥伴分享你的電子郵件地址和電話號碼，以利根據你的興趣提供廣告。
          </span>
        </label>

        <label className="block space-y-2 border-b border-zinc-200 pb-4">
          <span className="inline-flex items-start gap-2 text-base font-medium text-zinc-900">
            <input
              type="checkbox"
              checked={form.useFitnessData}
              onChange={(event) => updateField("useFitnessData", event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900"
            />
            使用健身資料
          </span>
          <span className="block pl-6 text-base text-zinc-600">
            使用我的健身資料，為我提供適合的訓練計畫、專屬產品推薦或特別活動邀請。
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <ProfileSaveButton disabled={!isDirty} />
      </div>

      {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}
    </form>
  );
}
