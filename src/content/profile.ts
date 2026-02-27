import type { ProfileNavItem } from "@/lib/profile/types";

export const profileContent = {
  pageTitle: "設定",
  saveLabel: "儲存",
  deleteLabel: "刪除",
  editLabel: "編輯",
} as const;

export const profileNavItems: ProfileNavItem[] = [
  { id: "account", label: "帳號詳細資訊", href: "/profile/account", icon: "account" },
  { id: "addresses", label: "寄送地址", href: "/profile/addresses", icon: "addresses" },
  { id: "preferences", label: "購物偏好", href: "/profile/preferences", icon: "preferences" },
  { id: "visibility", label: "個人檔案能見度", href: "/profile/visibility", icon: "visibility" },
  { id: "privacy", label: "隱私權", href: "/profile/privacy", icon: "privacy" },
];

export const profileShoeSizeOptions = [
  "22",
  "22.5",
  "23",
  "23.5",
  "24",
  "24.5",
  "25",
  "25.5",
  "26",
  "26.5",
  "27",
  "27.5",
  "28",
  "28.5",
  "29",
  "29.5",
  "30",
];
