"use client";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";

type FloatingSelectFieldProps = {
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

export function FloatingSelectField({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  onBlur,
  error,
  disabled,
}: Readonly<FloatingSelectFieldProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const ignoreNextTriggerClickRef = useRef(false);

  const selectedLabel = useMemo(() => options.find((option) => option === value) ?? "", [options, value]);

  useEffect(() => {
    function closeByOutside(event: MouseEvent) {
      if (!rootRef.current) {
        return;
      }

      if (!isOpen) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", closeByOutside);
    return () => {
      document.removeEventListener("mousedown", closeByOutside);
    };
  }, [isOpen, onBlur]);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || !isOpen) {
        return;
      }

      setIsOpen(false);
      onBlur?.();
    }

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, onBlur]);

  function closeDropdown(shouldBlur = true) {
    setIsOpen(false);
    if (shouldBlur) {
      onBlur?.();
    }
  }

  return (
    <label className="block space-y-1" htmlFor={id}>
      <div ref={rootRef} className="relative">
        <span className={`absolute -top-2 left-3 z-10 bg-[var(--background)] px-1 text-xs ${error ? "text-red-600" : "text-zinc-500"}`}>
          {label}
        </span>

        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (ignoreNextTriggerClickRef.current) {
              ignoreNextTriggerClickRef.current = false;
              return;
            }

            if (!disabled) {
              setIsOpen((current) => {
                const next = !current;
                if (current && !next) {
                  onBlur?.();
                }
                return next;
              });
            }
          }}
          className={`flex h-12 w-full items-center justify-between rounded-md border bg-transparent px-3 text-left text-base outline-none transition-colors ${
            error ? "border-red-600" : "border-zinc-300 focus:border-blue-600"
          } ${disabled ? "cursor-not-allowed opacity-65" : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={selectedLabel ? "text-zinc-900" : "text-zinc-500"}>{selectedLabel || placeholder}</span>
          <ChevronDownIcon className={`h-4 w-4 text-zinc-700 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
        </button>

        {isOpen ? (
          <div className="fade-down-in absolute left-0 right-0 z-40 mt-1 max-h-56 overflow-auto rounded-md border border-zinc-300 bg-white p-1 shadow-lg">
            <ul role="listbox" className="space-y-1">
              {options.map((option) => {
                const isActive = option === value;

                return (
                  <li key={option}>
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        ignoreNextTriggerClickRef.current = true;
                        onChange(option);
                        closeDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-base ${
                        isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{option}</span>
                      {isActive ? <CheckIcon className="h-4 w-4" aria-hidden /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>

      {error ? <p className="px-1 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
