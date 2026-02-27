import { z } from "zod";
import { apiError, apiOk } from "@/lib/server/api-response";
import { addProfileAddressByUserId, getProfileStateByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

const addressSchema = z.object({
  recipientLastName: z.string().trim().min(1).regex(/^[A-Za-z\u4e00-\u9fff\s'’-]{1,30}$/),
  recipientFirstName: z.string().trim().min(1).regex(/^[A-Za-z\u4e00-\u9fff\s'’-]{1,30}$/),
  phone: z.string().trim().min(1),
  country: z.string().trim().min(1),
  city: z.string().trim().min(1),
  district: z.string().trim().min(1),
  addressLine1: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  isDefault: z.boolean().default(false),
});

type AddressBody = z.infer<typeof addressSchema>;

export async function GET() {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const profile = await getProfileStateByUserId(user.id);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/addresses] GET failed", error);
    return apiError("讀取地址失敗", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const body = (await request.json()) as AddressBody;
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("地址資料格式錯誤", 400);
    }

    const profile = await addProfileAddressByUserId(user.id, parsed.data);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/addresses] POST failed", error);
    return apiError("新增地址失敗", 500);
  }
}
