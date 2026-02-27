import { z } from "zod";
import { apiError, apiOk } from "@/lib/server/api-response";
import { updateProfileVisibilityByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

const visibilitySchema = z.object({
  displayName: z.string().trim().optional().default(""),
  avatarText: z.string().trim().optional().default(""),
  avatarUrl: z.string().trim().optional().default(""),
  reviewVisibility: z.enum(["private", "community", "public"]).default("community"),
  locationSharing: z.enum(["friends", "none"]).default("none"),
});

type VisibilityBody = z.infer<typeof visibilitySchema>;

export async function PUT(request: Request) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const body = (await request.json()) as VisibilityBody;
    const parsed = visibilitySchema.safeParse(body);

    if (!parsed.success) {
      return apiError("個人檔案能見度格式錯誤", 400);
    }

    const profile = await updateProfileVisibilityByUserId(user.id, parsed.data);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/visibility] PUT failed", error);
    return apiError("儲存個人檔案能見度失敗", 500);
  }
}
