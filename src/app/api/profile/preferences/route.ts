import { z } from "zod";
import { apiError, apiOk } from "@/lib/server/api-response";
import { updateProfilePreferencesByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

const preferencesSchema = z.object({
  shoeSize: z.string().trim().optional().default(""),
  primaryPreference: z.enum(["women", "men"]).default("women"),
  otherPreferences: z.array(z.enum(["girls", "boys", "women", "men"])).default([]),
  measurementUnit: z.enum(["metric", "imperial"]).default("metric"),
});

type PreferencesBody = z.infer<typeof preferencesSchema>;

export async function PUT(request: Request) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const body = (await request.json()) as PreferencesBody;
    const parsed = preferencesSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("購物偏好格式錯誤", 400);
    }

    const profile = await updateProfilePreferencesByUserId(user.id, parsed.data);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/preferences] PUT failed", error);
    return apiError("儲存購物偏好失敗", 500);
  }
}
