import { homeContent } from "@/content/home";
import { apiOk } from "@/lib/server/api-response";

export async function GET() {
  return apiOk({
    home: homeContent,
  });
}
