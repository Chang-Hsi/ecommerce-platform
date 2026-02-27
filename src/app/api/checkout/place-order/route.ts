import { z } from "zod";
import { apiError, apiOk } from "@/lib/server/api-response";
import { placeOrderByUserId } from "@/lib/server/checkout";
import { requireRequestUser } from "@/lib/server/require-auth";

const checkoutFormSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  addressQuery: z.string(),
  phone: z.string(),
  billingSameAsShipping: z.boolean(),
  billingFirstName: z.string(),
  billingLastName: z.string(),
  billingAddress: z.string(),
  billingPhone: z.string(),
  cardName: z.string(),
  cardNumber: z.string(),
  cardExpiry: z.string(),
  cardCvc: z.string(),
  saveCardForFuture: z.boolean(),
  setAsDefaultCard: z.boolean(),
});

const placeOrderSchema = z.object({
  form: checkoutFormSchema,
  paymentMethod: z.enum(["card", "paypal", "gpay"]).default("card"),
});

type PlaceOrderBody = z.infer<typeof placeOrderSchema>;

export async function POST(request: Request) {
  try {
    const auth = await requireRequestUser();
    if (auth.errorResponse) {
      return auth.errorResponse;
    }

    const body = (await request.json()) as PlaceOrderBody;
    const parsed = placeOrderSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("下訂單資料格式錯誤", 400);
    }

    const result = await placeOrderByUserId({
      userId: auth.user.id,
      form: parsed.data.form,
      paymentMethod: parsed.data.paymentMethod,
    });

    return apiOk(result);
  } catch (error) {
    console.error("[api/checkout/place-order] POST failed", error);
    return apiError(error instanceof Error ? error.message : "建立訂單失敗", 400);
  }
}
