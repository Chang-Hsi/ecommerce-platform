"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { FloatingSelectField } from "@/components/common/FloatingSelectField";

type ProfileFloatingInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: "text" | "email" | "password" | "date";
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
};

export function ProfileFloatingInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  disabled,
  autoComplete,
}: Readonly<ProfileFloatingInputProps>) {
  return (
    <label className="block space-y-1">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder=" "
          disabled={disabled}
          className={`peer h-12 w-full rounded-md border bg-transparent px-3 pt-3 text-base text-zinc-900 outline-none transition-colors ${
            error ? "border-red-600" : "border-zinc-300 focus:border-blue-600"
          } ${disabled ? "cursor-not-allowed opacity-65" : ""}`}
        />
        <span
          className={`pointer-events-none absolute -top-2 left-3 bg-[var(--background)] px-1 text-xs transition-all ${
            error ? "text-red-600" : "text-zinc-500"
          } peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs`}
        >
          {label}
        </span>
      </div>

      {error ? <p className="px-1 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

type ProfilePasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
};

export function ProfilePasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
}: Readonly<ProfilePasswordInputProps>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block space-y-1">
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder=" "
          className={`peer h-12 w-full rounded-md border bg-transparent px-3 pb-1 pt-3 pr-11 text-base text-zinc-900 outline-none transition-colors ${
            error ? "border-red-600" : "border-zinc-400 focus:border-blue-600"
          }`}
        />
        <span
          className={`pointer-events-none absolute -top-2 left-3 bg-[var(--background)] px-1 text-xs transition-all ${
            error ? "text-red-600" : "text-zinc-500"
          } peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs`}
        >
          {label}
        </span>

        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600"
          aria-label={isVisible ? "隱藏密碼" : "顯示密碼"}
        >
          {isVisible ? <EyeSlashIcon className="h-5 w-5" aria-hidden /> : <EyeIcon className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {error ? <p className="px-1 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

type ProfileFloatingSelectProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
};

export function ProfileFloatingSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  onBlur,
  error,
  disabled,
}: Readonly<ProfileFloatingSelectProps>) {
  return (
    <FloatingSelectField
      id={id}
      label={label}
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      disabled={disabled}
    />
  );
}

export function ProfileSectionTitle({ title, description }: Readonly<{ title: string; description?: string }>) {
  return (
    <header className="space-y-2">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      {description ? <p className="text-base text-zinc-700">{description}</p> : null}
    </header>
  );
}

export function ProfileSaveButton({
  disabled,
  label = "儲存",
}: Readonly<{
  disabled: boolean;
  label?: string;
}>) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`inline-flex h-10 w-full min-w-[72px] items-center justify-center rounded-full px-5 text-base font-medium transition-colors sm:w-auto ${
        disabled ? "cursor-not-allowed bg-zinc-200 text-zinc-400" : "bg-zinc-900 text-white"
      }`}
    >
      {label}
    </button>
  );
}
