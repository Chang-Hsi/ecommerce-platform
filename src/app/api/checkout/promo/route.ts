import { z } from "zod";
import { apiError, apiOk } from "@/lib/server/api-response";
import { applyPromoCodeByUserId } from "@/lib/server/checkout";
import { requireRequestUser } from "@/lib/server/require-auth";

const promoSchema = z.object({
  code: z.string().optional().default(""),
});

type PromoBody = z.infer<typeof promoSchema>;

export async function POST(request: Request) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const body = (await request.json()) as PromoBody;
    const parsed = promoSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("促銷碼格式錯誤", 400);
    }

    const checkout = await applyPromoCodeByUserId(auth.user.id, parsed.data.code);
    return apiOk({ checkout });
  } catch (error) {
    console.error("[api/checkout/promo] POST failed", error);
    return apiError(error instanceof Error ? error.message : "套用促銷碼失敗", 400);
  }
}
