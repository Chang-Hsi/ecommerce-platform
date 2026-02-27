"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { HelpFaqItem } from "@/lib/help/types";

type HelpFaqAccordionProps = {
  title: string;
  items: HelpFaqItem[];
};

export function HelpFaqAccordion({ title, items }: Readonly<HelpFaqAccordionProps>) {
  const [openId, setOpenId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const hash = window.location.hash.replace("#", "").trim();
    if (!hash) {
      return null;
    }

    const matched = items.find((item) => item.id === hash);
    return matched?.id ?? null;
  });

  useEffect(() => {
    if (openId) {
      document.getElementById(openId)?.scrollIntoView({ block: "start" });
    }
  }, [openId]);

  return (
    <section className="space-y-4">
      <h2 className="text-5xl font-semibold text-zinc-900 sm:text-4xl">{title}</h2>

      <ul className="divide-y divide-zinc-200 border-y border-zinc-200">
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <li key={item.id} id={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-lg font-medium text-zinc-900">{item.question}</span>
                <ChevronDownIcon className={`h-5 w-5 text-zinc-700 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
              </button>

              <div className={`motion-collapse ${isOpen ? "motion-collapse-open" : "motion-collapse-closed"}`}>
                <div className="overflow-hidden">
                  <p className="pb-5 text-base leading-7 text-zinc-700">{item.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
