import { apiError, apiOk } from "@/lib/server/api-response";
import { removeProfileAddressByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

type AddressRouteContext = {
  params: Promise<{
    addressId: string;
  }>;
};

export async function DELETE(_: Request, context: AddressRouteContext) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const { addressId } = await context.params;

    const profile = await removeProfileAddressByUserId(user.id, addressId);
    return apiOk({ profile });
  } catch (error) {
    console.error("[api/profile/addresses/:addressId] DELETE failed", error);
    return apiError("刪除地址失敗", 500);
  }
}
