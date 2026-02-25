"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type FilterGroupProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FilterGroup({ title, defaultOpen = false, children }: Readonly<FilterGroupProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="border-t border-zinc-300 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between text-left text-base font-semibold text-zinc-900"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDownIcon className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")} aria-hidden />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity,margin-top] duration-300",
          isOpen ? "mt-3 max-h-[1200px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div>{children}</div>
      </div>
    </section>
  );
}
