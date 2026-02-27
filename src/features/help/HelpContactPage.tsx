import Link from "next/link";
import { helpContactMethods, helpPageContent } from "@/content/help";
import { HelpContactSection } from "@/components/help/HelpContactSection";

export function HelpContactPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 mb-[5rem]">
      <header className="space-y-2">
        <h1 className="text-5xl font-semibold text-zinc-900 sm:text-4xl">{helpPageContent.contactSectionTitle}</h1>
        <p className="text-base text-zinc-600">如果你在搜尋中找不到答案，歡迎透過以下方式聯絡我們。</p>
      </header>

      <HelpContactSection title={helpPageContent.contactSectionTitle} methods={helpContactMethods} />

      <Link href="/help" className="inline-flex text-base font-medium text-zinc-900 underline">
        返回協助首頁
      </Link>
    </div>
  );
}
