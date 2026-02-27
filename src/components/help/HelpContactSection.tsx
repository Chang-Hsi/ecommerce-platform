import { ChatBubbleLeftRightIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import type { HelpContactMethod } from "@/lib/help/types";

type HelpContactSectionProps = {
  title: string;
  methods: HelpContactMethod[];
};

export function HelpContactSection({ title, methods }: Readonly<HelpContactSectionProps>) {
  return (
    <section className="space-y-5 border-t border-zinc-300 pt-8">
      <h2 className="text-3xl font-semibold text-zinc-900 sm:text-2xl">{title}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {methods.map((method) => (
          <article key={method.id} className="space-y-3">
            {method.kind === "chat" ? (
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-zinc-900" aria-hidden />
            ) : (
              <DevicePhoneMobileIcon className="h-8 w-8 text-zinc-900" aria-hidden />
            )}

            <div className="space-y-1.5 text-base text-zinc-800">
              <p className="font-semibold text-zinc-900">{method.title}</p>
              <p>{method.line1}</p>
              <p>{method.line2}</p>
              <p>{method.line3}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
