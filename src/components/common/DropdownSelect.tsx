"use client";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useRef, useState } from "react";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownSelectProps = {
  triggerLabel: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  align?: "left" | "right";
  className?: string;
  openOnHover?: boolean;
  highlightSelected?: boolean;
  showCheckIcon?: boolean;
  showChevron?: boolean;
  triggerButtonClassName?: string;
  panelClassName?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DropdownSelect({
  triggerLabel,
  value,
  options,
  onChange,
  align = "right",
  className,
  openOnHover = false,
  highlightSelected = true,
  showCheckIcon = true,
  showChevron = true,
  triggerButtonClassName,
  panelClassName,
}: Readonly<DropdownSelectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeOption = useMemo(
    () => options.find((option) => option.value === value) ?? (highlightSelected ? options[0] : null),
    [highlightSelected, options, value],
  );

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hoverCloseTimerRef.current) {
        clearTimeout(hoverCloseTimerRef.current);
      }
    };
  }, []);

  function clearHoverCloseTimer() {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }

  function handleHoverEnter() {
    clearHoverCloseTimer();
    setIsOpen(true);
  }

  function handleHoverLeave() {
    clearHoverCloseTimer();
    hoverCloseTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      hoverCloseTimerRef.current = null;
    }, 120);
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onMouseEnter={openOnHover ? handleHoverEnter : undefined}
      onMouseLeave={openOnHover ? handleHoverLeave : undefined}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => (openOnHover ? true : !open))}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900",
          triggerButtonClassName,
        )}
        aria-expanded={isOpen}
      >
        <span>{triggerLabel}</span>
        {showChevron ? (
          <ChevronDownIcon className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
        ) : null}
      </button>

      {isOpen ? (
        <div
          className={cn(
            "fade-down-in absolute z-50 min-w-[220px] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg",
            openOnHover ? "top-full mt-1" : "top-[calc(100%+8px)]",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          <ul className="space-y-1">
            {options.map((option) => {
              const isActive = option.value === activeOption?.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm",
                      highlightSelected && isActive
                        ? "bg-zinc-100 font-semibold text-zinc-900"
                        : "text-zinc-700 hover:bg-zinc-50",
                    )}
                  >
                    <span>{option.label}</span>
                    {showCheckIcon && highlightSelected && isActive ? <CheckIcon className="h-4 w-4" aria-hidden /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
