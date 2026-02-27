"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, useState, type FormEvent } from "react";
import {
  ProfileFloatingInput,
  ProfileFloatingSelect,
  ProfilePasswordInput,
  ProfileSaveButton,
  ProfileSectionTitle,
} from "@/components/profile/ProfileFormControls";
import { signOutMockUser } from "@/lib/auth/mock-auth";
import { useProfileState } from "@/hooks/profile/useProfileState";
import {
  getProfileCityOptions,
  getProfileCountryOptions,
  getProfileDistrictOptions,
  getProfilePostalCode,
  isValidPostalCode,
} from "@/lib/profile/location";
import { clearProfileState, saveProfileAccount } from "@/lib/profile/mock-profile";

type AccountFieldKey = "email" | "birthday" | "country" | "district" | "city" | "postalCode";
type FieldErrors = Partial<Record<AccountFieldKey, string>>;

const allFields: AccountFieldKey[] = ["email", "birthday", "country", "district", "city", "postalCode"];

function validate(form: {
  email: string;
  birthday: string;
  country: string;
  district: string;
  city: string;
  postalCode: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "請輸入有效電子郵件";
  }

  if (form.birthday) {
    const birthday = new Date(form.birthday);
    const today = new Date();
    if (Number.isNaN(birthday.getTime()) || birthday > today) {
      errors.birthday = "生日日期不可晚於今天";
    }
  }

  const hasLocationValue = Boolean(
    form.country.trim() || form.district.trim() || form.city.trim() || form.postalCode.trim(),
  );

  if (hasLocationValue) {
    if (!form.country.trim()) {
      errors.country = "請選擇國家/地區";
    }

    if (!form.city.trim()) {
      errors.city = "請選擇縣市";
    }

    if (!form.district.trim()) {
      errors.district = "請選擇鄉鎮市區";
    }

    if (!isValidPostalCode(form.country, form.postalCode)) {
      errors.postalCode = "請輸入有效郵遞區號";
    }
  }

  return errors;
}

export function ProfileAccountSection() {
  const { state } = useProfileState();
  const [form, setForm] = useState(state.account);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<AccountFieldKey, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);

  const countryOptions = useMemo(() => getProfileCountryOptions(), []);
  const cityOptions = useMemo(() => getProfileCityOptions(form.country), [form.country]);
  const districtOptions = useMemo(() => getProfileDistrictOptions(form.country, form.city), [form.country, form.city]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(state.account), [form, state.account]);

  function markTouched(field: AccountFieldKey) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(form));
  }

  function getError(field: AccountFieldKey) {
    if (!submitAttempted && !touched[field]) {
      return undefined;
    }

    return errors[field];
  }

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (submitAttempted || touched[key as AccountFieldKey]) {
        setErrors(validate(next));
      }
      return next;
    });
  }

  function handleCountryChange(country: string) {
    const next = {
      ...form,
      country,
      city: "",
      district: "",
      postalCode: "",
    };

    setForm(next);
    if (submitAttempted || touched.country || touched.city || touched.district || touched.postalCode) {
      setErrors(validate(next));
    }
  }

  function handleCityChange(city: string) {
    const next = {
      ...form,
      city,
      district: "",
      postalCode: "",
    };

    setForm(next);
    if (submitAttempted || touched.city || touched.district || touched.postalCode) {
      setErrors(validate(next));
    }
  }

  function handleDistrictChange(district: string) {
    const next = {
      ...form,
      district,
      postalCode: getProfilePostalCode(form.country, form.city, district),
    };

    setForm(next);
    if (submitAttempted || touched.district || touched.postalCode) {
      setErrors(validate(next));
    }
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setSubmitAttempted(true);
    setTouched(
      allFields.reduce<Partial<Record<AccountFieldKey, boolean>>>((accumulator, field) => {
        accumulator[field] = true;
        return accumulator;
      }, {}),
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    saveProfileAccount(form);
  }

  function openDeleteModal() {
    setDeleteChecked(false);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteChecked(false);
    setDeleteModalOpen(false);
  }

  function confirmDeleteAccount() {
    if (!deleteChecked) {
      return;
    }

    clearProfileState();
    signOutMockUser();
    window.location.href = "/";
  }

  function updatePassword() {
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      window.alert("新密碼至少需要 8 碼");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      window.alert("兩次輸入的新密碼不一致");
      return;
    }

    setPasswordModalOpen(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    window.alert("M3 已模擬密碼更新");
  }

  return (
    <>
      <form onSubmit={handleSave} className="space-y-6">
        <ProfileSectionTitle title="帳號詳細資訊" />

        <ProfileFloatingInput
          id="profile-email"
          label="電子郵件*"
          type="email"
          value={form.email}
          onChange={(value) => updateField("email", value)}
          onBlur={() => markTouched("email")}
          error={getError("email")}
        />

        <div className="space-y-2">
          <p className="text-base font-medium text-zinc-900">密碼</p>
          <div className="flex flex-col gap-3 border-b border-zinc-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-zinc-800">{form.passwordMask}</p>
            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="w-fit text-base font-medium text-zinc-900 underline"
            >
              編輯
            </button>
          </div>
        </div>

        <ProfileFloatingInput
          id="profile-birthday"
          label="出生日期*"
          type="date"
          value={form.birthday}
          onChange={(value) => updateField("birthday", value)}
          onBlur={() => markTouched("birthday")}
          error={getError("birthday")}
        />

        <section className="space-y-4">
          <h3 className="text-base font-medium text-zinc-900">地點</h3>

          <ProfileFloatingSelect
            id="profile-country"
            label="國家/地區*"
            value={form.country}
            options={countryOptions}
            placeholder="請選擇國家/地區"
            onChange={handleCountryChange}
            onBlur={() => markTouched("country")}
            error={getError("country")}
          />

          <ProfileFloatingSelect
            id="profile-city"
            label="縣市*"
            value={form.city}
            options={cityOptions}
            placeholder={form.country ? "請選擇縣市" : "請先選擇國家/地區"}
            onChange={handleCityChange}
            onBlur={() => markTouched("city")}
            error={getError("city")}
            disabled={!form.country}
          />

          <ProfileFloatingSelect
            id="profile-district"
            label="鄉鎮市區*"
            value={form.district}
            options={districtOptions}
            placeholder={form.city ? "請選擇鄉鎮市區" : "請先選擇縣市"}
            onChange={handleDistrictChange}
            onBlur={() => markTouched("district")}
            error={getError("district")}
            disabled={!form.city}
          />

          <ProfileFloatingInput
            id="profile-postal"
            label="郵遞區號"
            value={form.postalCode}
            onChange={(value) => updateField("postalCode", value)}
            onBlur={() => markTouched("postalCode")}
            error={getError("postalCode")}
          />
        </section>

        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-zinc-900">刪除帳號</p>
          <button
            type="button"
            onClick={openDeleteModal}
            className="inline-flex h-9 w-fit items-center rounded-full border border-zinc-300 px-4 text-base text-zinc-900"
          >
            刪除
          </button>
        </div>

        <div className="flex justify-end">
          <ProfileSaveButton disabled={!isDirty} />
        </div>
      </form>

      {passwordModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 px-4 sm:items-center" onClick={() => setPasswordModalOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="fade-up-in w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-zinc-900">更新密碼</h3>
            <div className="mt-4 space-y-3">
              <ProfilePasswordInput
                id="current-password"
                label="目前密碼"
                value={passwordForm.currentPassword}
                onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))}
                autoComplete="current-password"
              />
              <ProfilePasswordInput
                id="new-password"
                label="新密碼"
                value={passwordForm.newPassword}
                onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))}
                autoComplete="new-password"
              />
              <ProfilePasswordInput
                id="confirm-password"
                label="確認新密碼"
                value={passwordForm.confirmPassword}
                onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))}
                autoComplete="new-password"
              />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="inline-flex h-9 w-full items-center justify-center rounded-full border border-zinc-300 px-4 text-base text-zinc-900 sm:w-auto"
              >
                取消
              </button>
              <button
                type="button"
                onClick={updatePassword}
                className="inline-flex h-9 w-full items-center justify-center rounded-full bg-zinc-900 px-4 text-base text-white sm:w-auto"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 px-4 sm:items-center" onClick={closeDeleteModal}>
          <div
            role="dialog"
            aria-modal="true"
            className="fade-up-in max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-zinc-900">確定要刪除你的 SwooshLab 會員個人檔案嗎？</h3>
              <button type="button" onClick={closeDeleteModal} className="rounded-full p-1 text-zinc-600" aria-label="關閉">
                <XMarkIcon className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-base text-zinc-800">
              <div className="space-y-2">
                <p className="font-medium">身為 SwooshLab 會員，你目前可享受的福利如下：</p>
                <ul className="list-disc space-y-1 pl-5 text-base">
                  <li>所有訂購商品均可辦理免費退貨</li>
                  <li>購物時享受快速結帳服務</li>
                  <li>利用個人願望清單儲存欲購品項</li>
                  <li>輕鬆追蹤訂單狀態</li>
                  <li>透過 SwooshLab 會員計畫追蹤活動</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-medium">刪除你的個人檔案後：</p>
                <ul className="list-disc space-y-1 pl-5 text-base">
                  <li>你再也無法存取你的 SwooshLab.com 或 SwooshLab 會員個人檔案。</li>
                  <li>如需訂單相關資料，請聯絡消費者服務部門。</li>
                  <li>在登出或解除安裝應用程式之前，你仍可以存取自己的行動應用程式資料。</li>
                </ul>
              </div>

              <p>你在 SwooshLab.com 之外的社群網站或平台上所分享的資訊將不受影響。</p>
            </div>

            <label className="mt-5 inline-flex items-center gap-2 text-base text-zinc-900">
              <input
                type="checkbox"
                checked={deleteChecked}
                onChange={(event) => setDeleteChecked(event.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
              />
              是，我要刪除我的 SwooshLab 帳號。此動作無法還原。
            </label>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={confirmDeleteAccount}
                disabled={!deleteChecked}
                className={`inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-base sm:w-auto ${
                  deleteChecked
                    ? "border border-zinc-900 bg-zinc-900 text-white"
                    : "cursor-not-allowed border border-zinc-300 bg-white text-zinc-400"
                }`}
              >
                刪除你的帳號
              </button>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-zinc-900 px-4 text-base text-white sm:w-auto"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
