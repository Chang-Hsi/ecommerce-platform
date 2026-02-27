import type { HomeContent } from "@/content/home";
import { request } from "@/lib/api/request";

export async function fetchHomeContentFromApi() {
  const payload = await request<{
    home: HomeContent;
  }>("/api/home", {
    cache: "no-store",
  });

  return payload.data.home;
}
