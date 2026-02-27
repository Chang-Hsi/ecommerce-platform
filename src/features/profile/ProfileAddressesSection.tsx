"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ProfileFloatingInput, ProfileFloatingSelect, ProfileSectionTitle } from "@/components/profile/ProfileFormControls";
import {
  getProfileCityOptions,
  getProfileCountryOptions,
  getProfileDistrictOptions,
  getProfilePostalCode,
  isValidPostalCode,
} from "@/lib/profile/location";
import { addProfileAddress, removeProfileAddress } from "@/lib/profile/mock-profile";
import { useProfileState } from "@/hooks/profile/useProfileState";

type AddressFormState = {
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  addressLine1: string;
  postalCode: string;
  isDefault: boolean;
};

type AddressFieldKey = keyof Omit<AddressFormState, "isDefault">;
type AddressFormErrors = Partial<Record<AddressFieldKey, string>>;

const emptyAddressForm: AddressFormState = {
  recipientName: "",
  phone: "",
  country: "台灣",
  city: "",
  district: "",
  addressLine1: "",
  postalCode: "",
  isDefault: false,
};

const addressFields: AddressFieldKey[] = [
  "recipientName",
  "phone",
  "country",
  "city",
  "district",
  "addressLine1",
  "postalCode",
];

function isValidName(value: string) {
  return /^[A-Za-z\u4e00-\u9fff\s'’-]{1,30}$/.test(value.trim());
}

function validateAddress(form: AddressFormState): AddressFormErrors {
  const errors: AddressFormErrors = {};

  if (!form.recipientName.trim()) {
    errors.recipientName = "請輸入收件人姓名";
  } else if (!isValidName(form.recipientName)) {
    errors.recipientName = "你輸入的字元無效。";
  }

  if (!/^\+?\d[\d\s-]{7,14}$/.test(form.phone.trim())) {
    errors.phone = "請輸入有效電話號碼";
  }

  if (!form.country.trim()) {
    errors.country = "請選擇國家/地區";
  }

  if (!form.city.trim()) {
    errors.city = "請選擇縣市";
  }

  if (!form.district.trim()) {
    errors.district = "請選擇鄉鎮市區";
  }

  if (!form.addressLine1.trim()) {
    errors.addressLine1 = "請輸入街道地址";
  } else if (/郵政信箱|P\.?O\.?\s*Box|post office box/i.test(form.addressLine1)) {
    errors.addressLine1 = "我們無法送貨至郵政信箱";
  }

  if (!isValidPostalCode(form.country, form.postalCode)) {
    errors.postalCode = "請輸入有效郵遞區號";
  }

  return errors;
}

export function ProfileAddressesSection() {
  const { state } = useProfileState();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AddressFormState>(emptyAddressForm);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<AddressFieldKey, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const hasAddresses = state.addresses.length > 0;
  const countryOptions = useMemo(() => getProfileCountryOptions(), []);
  const cityOptions = useMemo(() => getProfileCityOptions(form.country), [form.country]);
  const districtOptions = useMemo(() => getProfileDistrictOptions(form.country, form.city), [form.country, form.city]);

  const sortedAddresses = useMemo(
    () => [...state.addresses].sort((left, right) => Number(right.isDefault) - Number(left.isDefault)),
    [state.addresses],
  );

  function updateField<K extends keyof AddressFormState>(key: K, value: AddressFormState[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (submitAttempted || touched[key as AddressFieldKey]) {
        setErrors(validateAddress(next));
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
      setErrors(validateAddress(next));
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
      setErrors(validateAddress(next));
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
      setErrors(validateAddress(next));
    }
  }

  function markTouched(field: AddressFieldKey) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateAddress(form));
  }

  function getError(field: AddressFieldKey) {
    if (!submitAttempted && !touched[field]) {
      return undefined;
    }

    return errors[field];
  }

  function openModal() {
    setForm(emptyAddressForm);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
  }

  function handleSubmitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAddress(form);
    setSubmitAttempted(true);
    setTouched(
      addressFields.reduce<Partial<Record<AddressFieldKey, boolean>>>((accumulator, field) => {
        accumulator[field] = true;
        return accumulator;
      }, {}),
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    addProfileAddress(form);
    closeModal();
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <ProfileSectionTitle
            title="已儲存的寄送地址"
            description={
              hasAddresses
                ? "管理你的常用寄送地址，結帳時可快速帶入。"
                : "你目前尚未儲存任何寄送地址。在此新增地址，以利自動填寫來加快結帳速度。"
            }
          />

          <button
            type="button"
            onClick={openModal}
            className="inline-flex h-10 w-fit items-center rounded-full bg-zinc-900 px-5 text-base font-medium text-white"
          >
            新增地址
          </button>
        </div>

        {hasAddresses ? (
          <div className="space-y-3">
            {sortedAddresses.map((address) => (
              <article key={address.id} className="">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-5 border-b border-zinc-300">
                  <div className="space-y-2 text-base text-zinc-800 ">
                    <p className="font-medium text-zinc-900">
                      {address.recipientName}
                      {address.isDefault ? <span className="ml-2 text-sm text-zinc-500">預設</span> : null}
                    </p>
                    <p>{address.phone}</p>
                    <p>
                      {address.country} {address.city} {address.district}
                    </p>
                    <p>
                      {address.addressLine1} {address.postalCode}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeProfileAddress(address.id)}
                    className="inline-flex h-9 w-fit items-center rounded-full border border-zinc-300 px-4 text-base text-zinc-900"
                  >
                    刪除
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 px-4 sm:items-center" onClick={closeModal}>
          <div
            role="dialog"
            aria-modal="true"
            className="fade-up-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 sm:rounded-2xl sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-zinc-900">新增地址</h3>

            <form onSubmit={handleSubmitAddress} className="mt-4 space-y-4">
              <ProfileFloatingInput
                id="address-recipient"
                label="收件人姓名*"
                value={form.recipientName}
                onChange={(value) => updateField("recipientName", value)}
                onBlur={() => markTouched("recipientName")}
                error={getError("recipientName")}
              />
              <ProfileFloatingInput
                id="address-phone"
                label="電話號碼*"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
                onBlur={() => markTouched("phone")}
                error={getError("phone")}
              />
              <ProfileFloatingSelect
                id="address-country"
                label="國家/地區*"
                value={form.country}
                options={countryOptions}
                placeholder="請選擇國家/地區"
                onChange={handleCountryChange}
                onBlur={() => markTouched("country")}
                error={getError("country")}
              />
              <ProfileFloatingSelect
                id="address-city"
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
                id="address-district"
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
                id="address-line1"
                label="街道地址*"
                value={form.addressLine1}
                onChange={(value) => updateField("addressLine1", value)}
                onBlur={() => markTouched("addressLine1")}
                error={getError("addressLine1")}
              />
              <ProfileFloatingInput
                id="address-postal"
                label="郵遞區號*"
                value={form.postalCode}
                onChange={(value) => updateField("postalCode", value)}
                onBlur={() => markTouched("postalCode")}
                error={getError("postalCode")}
              />

              <label className="inline-flex items-center gap-2 text-base text-zinc-900">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) => updateField("isDefault", event.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
                />
                設為預設地址
              </label>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-full items-center justify-center rounded-full border border-zinc-300 px-4 text-base text-zinc-900 sm:w-auto"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 w-full items-center justify-center rounded-full bg-zinc-900 px-4 text-base text-white sm:w-auto"
                >
                  儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
