import type { HelpArticle, HelpContactMethod, HelpFaqItem, HelpTopic, HelpTopicSlug } from "@/lib/help/types";

export const helpPageContent = {
  pageTitle: "取得協助",
  searchPlaceholder: "我們能提供你什麼協助？",
  quickHelpTitle: "快速協助",
  quickHelpDescription: "只要輕輕一按，就能找到常見問題的解答。",
  searchResultsTitle: (query: string) => `以下關鍵字的搜尋結果：「${query}」`,
  noSearchResultTitle: "找不到結果",
  noSearchResultContactLabel: "聯絡我們",
  contactSectionTitle: "聯絡我們",
  faqSectionTitle: "常見問題",
} as const;

export const helpTopics: HelpTopic[] = [
  {
    id: "topic-returns",
    slug: "returns",
    title: "退貨",
    description: "SwooshLab 的退貨須知為何？",
    featuredQuestionIds: ["returns-how", "returns-exchange", "returns-after-7-days"],
    keywords: ["退貨", "退款", "瑕疵", "退貨時效", "退貨流程"],
    sortOrder: 1,
  },
  {
    id: "topic-shipping-delivery",
    slug: "shipping-delivery",
    title: "出貨與寄送",
    description: "SwooshLab 提供哪些寄送選項？",
    featuredQuestionIds: ["shipping-options", "shipping-free", "shipping-international"],
    keywords: ["出貨", "寄送", "配送", "免運", "送達時間"],
    sortOrder: 2,
  },
  {
    id: "topic-orders-payment",
    slug: "orders-payment",
    title: "訂單與付款",
    description: "我的 SwooshLab 訂單在哪裡？",
    featuredQuestionIds: ["orders-track", "orders-cancel", "orders-payment-methods"],
    keywords: ["訂單", "付款", "取消訂單", "付款失敗", "發票"],
    sortOrder: 3,
  },
  {
    id: "topic-shopping",
    slug: "shopping",
    title: "購物",
    description: "如何尋找適合的尺寸？",
    featuredQuestionIds: ["shopping-size", "shopping-promotions", "shopping-recommendations"],
    keywords: ["購物", "尺寸", "折扣", "優惠", "推薦"],
    sortOrder: 4,
  },
  {
    id: "topic-membership-app",
    slug: "membership-app",
    title: "SwooshLab 會員計畫與應用程式",
    description: "SwooshLab 會員計畫是什麼？",
    featuredQuestionIds: ["membership-what", "membership-snkrs", "membership-app-news"],
    keywords: ["會員", "SwooshLab App", "SNKRS", "抽籤", "通知"],
    sortOrder: 5,
  },
  {
    id: "topic-company-info",
    slug: "company-info",
    title: "公司資訊",
    description: "SwooshLab 鞋款有保固嗎？",
    featuredQuestionIds: ["company-warranty", "company-mission", "company-investor"],
    keywords: ["公司", "保固", "永續", "投資人", "品牌"],
    sortOrder: 6,
  },
];

export const helpFaqItems: HelpFaqItem[] = [
  {
    id: "returns-how",
    topicSlug: "returns",
    question: "如何將 SwooshLab 訂單退貨？",
    answer:
      "登入帳戶後前往訂單頁，選擇要退貨的品項並依指示建立退貨申請。系統會提供後續打包與交寄說明，送回後將依流程進行退款。",
    keywords: ["退貨", "退貨申請", "退款流程", "訂單退貨"],
    sortOrder: 1,
  },
  {
    id: "returns-exchange",
    topicSlug: "returns",
    question: "我可以退換 SwooshLab 訂單嗎？",
    answer:
      "M3 階段不提供直接換貨，請先完成退貨再重新下單。建議重新下單前先確認尺寸與庫存，避免熱門款缺貨。",
    keywords: ["換貨", "退換", "重新下單"],
    sortOrder: 2,
  },
  {
    id: "returns-after-7-days",
    topicSlug: "returns",
    question: "我可以在 7 天後退貨嗎？",
    answer:
      "一般商品需於到貨後 7 天內申請退貨（部分商品除外）。超過退貨時效後，系統將無法建立退貨單。",
    keywords: ["7天", "退貨時效", "逾期退貨"],
    sortOrder: 3,
  },
  {
    id: "returns-defect",
    topicSlug: "returns",
    question: "如何退回有瑕疵或缺陷的產品？",
    answer:
      "若商品有明顯瑕疵，請提供照片與訂單編號給客服。客服會協助進行個案檢核與後續補償或退貨安排。",
    keywords: ["瑕疵", "缺陷", "品質問題", "客服"],
    sortOrder: 4,
  },
  {
    id: "shipping-options",
    topicSlug: "shipping-delivery",
    question: "SwooshLab 提供哪些寄送選項？",
    answer:
      "M3 階段提供標準配送，後續版本可擴充宅配時段、門市取貨或特定活動配送方案。可用選項以結帳頁顯示為準。",
    keywords: ["寄送選項", "配送方式", "標準配送"],
    sortOrder: 1,
  },
  {
    id: "shipping-free",
    topicSlug: "shipping-delivery",
    question: "如何才能享有 SwooshLab 訂單免費寄送服務？",
    answer:
      "符合活動門檻或特定會員資格時即可免運。若訂單摘要顯示已符合免運資格，即不會加收運費。",
    keywords: ["免運", "運費", "運送資格"],
    sortOrder: 2,
  },
  {
    id: "shipping-international",
    topicSlug: "shipping-delivery",
    question: "SwooshLab 是否提供國際運送服務？",
    answer: "目前僅支援本地配送。跨境與國際物流將於後續里程碑再評估與規劃。",
    keywords: ["國際運送", "海外配送", "跨境"],
    sortOrder: 3,
  },
  {
    id: "shipping-delay",
    topicSlug: "shipping-delivery",
    question: "若配送延遲，我該如何處理？",
    answer:
      "可先到訂單頁查看最新物流狀態。若超過預估送達區間仍未更新，請聯絡客服協助追蹤配送。",
    keywords: ["配送延遲", "物流", "未到貨"],
    sortOrder: 4,
  },
  {
    id: "orders-track",
    topicSlug: "orders-payment",
    question: "我的 SwooshLab 訂單在哪裡？",
    answer: "登入後到會員中心的訂單頁即可查看訂單狀態、明細與配送進度。",
    keywords: ["查訂單", "訂單狀態", "配送進度"],
    sortOrder: 1,
  },
  {
    id: "orders-cancel",
    topicSlug: "orders-payment",
    question: "我可以取消或變更 SwooshLab 的訂單嗎？",
    answer:
      "訂單在出貨前可嘗試取消。已進入出貨流程的訂單無法修改，請在收貨後透過退貨流程處理。",
    keywords: ["取消訂單", "修改訂單", "變更"],
    sortOrder: 2,
  },
  {
    id: "orders-payment-methods",
    topicSlug: "orders-payment",
    question: "SwooshLab 提供哪些付款選項？",
    answer:
      "M3 提供信用卡、PayPal、Google Pay 的可選 UI。實際金流串接與交易驗證於後續里程碑完成。",
    keywords: ["付款方式", "信用卡", "PayPal", "Google Pay"],
    sortOrder: 3,
  },
  {
    id: "orders-payment-failed",
    topicSlug: "orders-payment",
    question: "付款失敗怎麼辦？",
    answer:
      "請先確認卡片資料與有效期限，並檢查銀行風控或交易上限。若仍失敗，可改用其他付款方式或聯絡客服。",
    keywords: ["付款失敗", "刷卡失敗", "交易失敗"],
    sortOrder: 4,
  },
  {
    id: "shopping-size",
    topicSlug: "shopping",
    question: "如何尋找適合的尺寸？",
    answer:
      "可參考商品頁尺寸表與版型建議，並以平常穿著尺碼作為基準。若介於兩碼，建議先看該鞋款評價。",
    keywords: ["尺寸", "尺碼", "版型", "size"],
    sortOrder: 1,
  },
  {
    id: "shopping-promotions",
    topicSlug: "shopping",
    question: "如何獲得 SwooshLab 的超值優惠？",
    answer:
      "可關注特惠商品、首頁活動橫幅與會員通知。活動期間通常會有折扣碼、限時折扣或免運條件。",
    keywords: ["優惠", "折扣", "促銷", "折扣碼"],
    sortOrder: 2,
  },
  {
    id: "shopping-recommendations",
    topicSlug: "shopping",
    question: "SwooshLab 是否會提供產品建議？",
    answer: "會。系統可依瀏覽、收藏與購物車行為推薦相關商品，提升挑選效率。",
    keywords: ["推薦", "個人化", "產品建議"],
    sortOrder: 3,
  },
  {
    id: "shopping-restock",
    topicSlug: "shopping",
    question: "缺貨商品何時會補貨？",
    answer: "補貨時間依商品與供應狀況而異。建議將商品加入最愛並開啟通知，以便第一時間掌握上架。",
    keywords: ["補貨", "缺貨", "上架通知"],
    sortOrder: 4,
  },
  {
    id: "membership-what",
    topicSlug: "membership-app",
    question: "SwooshLab 會員計畫是什麼？",
    answer:
      "SwooshLab 會員可獲得專屬內容、發售資訊與部分會員限定優惠，並可更完整管理訂單與偏好設定。",
    keywords: ["會員", "會員方案", "member"],
    sortOrder: 1,
  },
  {
    id: "membership-snkrs",
    topicSlug: "membership-app",
    question: "我要如何才能參加 SwooshLab SNKRS 抽籤？",
    answer:
      "請先登入會員並完成個人資料。活動開始後依頁面規則參加，抽籤結果將透過站內流程顯示。",
    keywords: ["SNKRS", "抽籤", "發售"],
    sortOrder: 2,
  },
  {
    id: "membership-app-news",
    topicSlug: "membership-app",
    question: "如何取得 SwooshLab 最新款運動鞋的發表資訊？",
    answer: "可追蹤 SNKRS 區與會員通知，掌握新品預告、即將推出與現貨動態。",
    keywords: ["新品", "發表", "通知", "發售資訊"],
    sortOrder: 3,
  },
  {
    id: "membership-delete-account",
    topicSlug: "membership-app",
    question: "如何刪除 SwooshLab 帳號？",
    answer:
      "你可以在會員設定中提出帳號刪除申請。送出後將依平台規則進行資料刪除與保留處理。",
    keywords: ["刪除帳號", "隱私", "帳號設定"],
    sortOrder: 4,
  },
  {
    id: "company-warranty",
    topicSlug: "company-info",
    question: "SwooshLab 鞋款有保固嗎？",
    answer: "若商品有製造瑕疵可聯絡客服評估，平台會依政策提供對應處理方式。",
    keywords: ["保固", "瑕疵", "售後"],
    sortOrder: 1,
  },
  {
    id: "company-mission",
    topicSlug: "company-info",
    question: "SwooshLab 的使命為何？",
    answer: "透過創新與運動精神，啟發每一位運動員，讓運動更普及、更具影響力。",
    keywords: ["使命", "品牌", "理念"],
    sortOrder: 2,
  },
  {
    id: "company-investor",
    topicSlug: "company-info",
    question: "我可以在哪裡找到更多 SwooshLab, Inc. 的相關資訊？",
    answer: "可至 SwooshLab 官方公司資訊與投資人關係頁面，查看品牌公告、財務資訊與公開文件。",
    keywords: ["投資人", "公司資訊", "公告"],
    sortOrder: 3,
  },
  {
    id: "company-sustainability",
    topicSlug: "company-info",
    question: "SwooshLab 是否有永續發展計畫？",
    answer: "SwooshLab 持續推動永續策略，包含材質創新、減碳目標與供應鏈改善等方向。",
    keywords: ["永續", "環境", "減碳", "ESG"],
    sortOrder: 4,
  },
];

export const helpArticles: HelpArticle[] = [
  {
    id: "article-returns",
    slug: "returns",
    title: "SwooshLab 的退貨須知說明",
    summary: "說明退貨時效、商品狀態、瑕疵品處理與退款節點。",
    introParagraphs: [
      "於 SwooshLab.com 及 SwooshLab 應用程式購買的產品，均可在七天內退貨（部分商品除外）。退貨產品必須保持原始狀態、乾淨無污損、未曾穿過、未經洗滌、所有零配件完整，並保留原包裝與標籤。",
      "若商品有瑕疵或缺件，建議先拍照並聯絡客服，能加速後續審核與處理。",
      "專屬訂製商品與特殊聯名商品，會有額外規則，請以商品頁與訂單頁顯示為準。",
    ],
    highlightParagraphs: ["提醒你，退貨不必支付運費。", "退款將依支付通路與銀行作業時間入帳。"],
    faqIds: ["returns-how", "returns-exchange", "returns-after-7-days", "returns-defect"],
    keywords: ["退貨", "退款", "瑕疵", "時效"],
    sortOrder: 1,
    updatedAt: "2026-02-26",
  },
  {
    id: "article-shipping-delivery",
    slug: "shipping-delivery",
    title: "出貨與寄送說明",
    summary: "說明出貨時程、免運條件、配送延遲與跨境限制。",
    introParagraphs: [
      "下單後可於訂單頁查看配送進度與預估送達時間。配送時程會因地區、庫存與活動期間而有所不同。",
      "若遇到節慶檔期或大促活動，物流處理可能延後，建議以訂單頁最新狀態為準。",
    ],
    highlightParagraphs: ["若需要協助，請透過聯絡我們與客服聯繫。"],
    faqIds: ["shipping-options", "shipping-free", "shipping-international", "shipping-delay"],
    keywords: ["出貨", "寄送", "免運", "配送"],
    sortOrder: 2,
    updatedAt: "2026-02-26",
  },
  {
    id: "article-orders-payment",
    slug: "orders-payment",
    title: "訂單與付款說明",
    summary: "說明查詢訂單、取消規則、付款方式與付款失敗排查。",
    introParagraphs: [
      "訂單建立後可在會員中心查詢狀態，若有取消需求請盡快處理，以免進入出貨流程。",
      "付款成功後，你可在訂單摘要查看金額、折扣與配送資訊。",
    ],
    highlightParagraphs: ["M3 階段部分支付通路為 UI 示意，後續版本會接正式金流。"],
    faqIds: ["orders-track", "orders-cancel", "orders-payment-methods", "orders-payment-failed"],
    keywords: ["訂單", "付款", "取消", "支付"],
    sortOrder: 3,
    updatedAt: "2026-02-26",
  },
  {
    id: "article-shopping",
    slug: "shopping",
    title: "購物指南",
    summary: "整合尺寸、優惠、推薦與補貨相關資訊。",
    introParagraphs: [
      "從尺寸挑選到促銷活動，這裡整理了購物過程最常遇到的問題。",
      "如果你偏好快速下單，建議先完成收藏清單與尺寸偏好設定。",
    ],
    highlightParagraphs: ["若仍不確定，建議先參考商品頁尺寸建議與材質說明。"],
    faqIds: ["shopping-size", "shopping-promotions", "shopping-recommendations", "shopping-restock"],
    keywords: ["購物", "尺寸", "促銷", "補貨"],
    sortOrder: 4,
    updatedAt: "2026-02-26",
  },
  {
    id: "article-membership-app",
    slug: "membership-app",
    title: "SwooshLab 會員計畫與應用程式",
    summary: "說明會員權益、SNKRS 活動與帳號管理。",
    introParagraphs: [
      "加入會員後可取得發售資訊、收藏同步與部分會員專屬活動資格。",
      "建議開啟通知以掌握 SNKRS 即時發售與活動提醒。",
    ],
    highlightParagraphs: ["帳號與通知設定可在會員中心集中管理。"],
    faqIds: ["membership-what", "membership-snkrs", "membership-app-news", "membership-delete-account"],
    keywords: ["會員", "SNKRS", "SwooshLab App", "帳號"],
    sortOrder: 5,
    updatedAt: "2026-02-26",
  },
  {
    id: "article-company-info",
    slug: "company-info",
    title: "公司資訊",
    summary: "彙整品牌使命、保固與公司公開資訊。",
    introParagraphs: [
      "本區整理 SwooshLab 常見公司資訊與政策入口，方便你快速查找官方資料。",
      "若你需要商務或媒體合作資訊，建議依官方公開聯絡窗口進一步洽詢。",
    ],
    highlightParagraphs: ["投資人與公司公告請以官方公開資訊為準。"],
    faqIds: ["company-warranty", "company-mission", "company-investor", "company-sustainability"],
    keywords: ["公司", "保固", "投資人", "永續"],
    sortOrder: 6,
    updatedAt: "2026-02-26",
  },
];

export const helpContactMethods: HelpContactMethod[] = [
  {
    id: "contact-chat",
    title: "產品與訂單",
    line1: "線上對談時段",
    line2: "上午 9:00 至下午 6:00",
    line3: "週一至週五",
    kind: "chat",
  },
  {
    id: "contact-phone",
    title: "產品與訂單",
    line1: "0800-886-453",
    line2: "上午 9:00 至晚上 6:00",
    line3: "週一至週五",
    kind: "phone",
  },
];

export const helpTopicsBySlug = Object.fromEntries(helpTopics.map((topic) => [topic.slug, topic])) as Record<
  HelpTopicSlug,
  HelpTopic
>;

export const helpFaqById = Object.fromEntries(helpFaqItems.map((faq) => [faq.id, faq])) as Record<string, HelpFaqItem>;

export const helpFaqIdsByTopic = helpFaqItems.reduce<Record<HelpTopicSlug, string[]>>(
  (accumulator, faq) => {
    accumulator[faq.topicSlug].push(faq.id);
    return accumulator;
  },
  {
    returns: [],
    "shipping-delivery": [],
    "orders-payment": [],
    shopping: [],
    "membership-app": [],
    "company-info": [],
  },
);

export const helpArticlesBySlug = Object.fromEntries(
  helpArticles.map((article) => [article.slug, article]),
) as Record<HelpTopicSlug, HelpArticle>;

export const helpDatasetMeta = {
  version: "m3-help-static-v2",
  locale: "zh-TW",
  updatedAt: "2026-02-26",
  owner: "storefront-help",
} as const;

export const helpStaticDataset = {
  meta: helpDatasetMeta,
  topics: helpTopics,
  faqs: helpFaqItems,
  articles: helpArticles,
  contacts: helpContactMethods,
} as const;
