import { apiError, apiOk } from "@/lib/server/api-response";
import { uploadProfileAvatarImage } from "@/lib/server/cloudinary-upload";
import { updateProfileAvatarByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return apiError("請選擇要上傳的圖片", 400);
    }

    const avatarUrl = await uploadProfileAvatarImage({
      userId: user.id,
      file,
    });

    const profile = await updateProfileAvatarByUserId(user.id, avatarUrl);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/avatar] POST failed", error);

    if (error instanceof Error && error.message.trim()) {
      return apiError(error.message, 400);
    }

    return apiError("頭像上傳失敗", 500);
  }
}
