import { z } from "zod";
import { apiError, apiOk } from "@/lib/server/api-response";
import { updateProfilePrivacyByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

const privacySchema = z.object({
  adsByUsageData: z.boolean(),
  adsByProfileData: z.boolean(),
  useFitnessData: z.boolean(),
});

type PrivacyBody = z.infer<typeof privacySchema>;

export async function PUT(request: Request) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const body = (await request.json()) as PrivacyBody;
    const parsed = privacySchema.safeParse(body);

    if (!parsed.success) {
      return apiError("隱私設定格式錯誤", 400);
    }

    const profile = await updateProfilePrivacyByUserId(user.id, parsed.data);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/privacy] PUT failed", error);
    return apiError("儲存隱私設定失敗", 500);
  }
}
