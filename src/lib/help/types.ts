export type HelpTopicSlug =
  | "returns"
  | "shipping-delivery"
  | "orders-payment"
  | "shopping"
  | "membership-app"
  | "company-info";

export type HelpFaqItem = {
  id: string;
  topicSlug: HelpTopicSlug;
  question: string;
  answer: string;
  keywords: string[];
  sortOrder: number;
};

export type HelpTopic = {
  id: string;
  slug: HelpTopicSlug;
  title: string;
  description: string;
  featuredQuestionIds: string[];
  keywords: string[];
  sortOrder: number;
};

export type HelpArticle = {
  id: string;
  slug: HelpTopicSlug;
  title: string;
  summary: string;
  introParagraphs: string[];
  highlightParagraphs: string[];
  faqIds: string[];
  keywords: string[];
  sortOrder: number;
  updatedAt: string;
};

export type HelpContactMethod = {
  id: string;
  title: string;
  line1: string;
  line2: string;
  line3: string;
  kind: "chat" | "phone";
};

export type HelpSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "faq" | "article";
};
