import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/server/api-response";
import { updateProfileAccountByUserId } from "@/lib/server/profile";
import { requireRequestUser } from "@/lib/server/require-auth";

const NAME_PATTERN = /^[A-Za-z\u4e00-\u9fff\s'’-]{1,30}$/;

const accountSchema = z.object({
  firstName: z.string().trim().optional().default(""),
  lastName: z.string().trim().optional().default(""),
  email: z.string().trim().email(),
  passwordMask: z.string().trim().min(1).optional(),
  birthday: z.string().trim().optional().default(""),
  country: z.string().trim().optional().default(""),
  district: z.string().trim().optional().default(""),
  city: z.string().trim().optional().default(""),
  postalCode: z.string().trim().optional().default(""),
});

type AccountBody = z.infer<typeof accountSchema>;

export async function PUT(request: Request) {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    const body = (await request.json()) as AccountBody;
    const parsed = accountSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("帳號資料格式錯誤", 400);
    }

    if (parsed.data.firstName && !NAME_PATTERN.test(parsed.data.firstName)) {
      return apiError("名字格式錯誤", 400);
    }

    if (parsed.data.lastName && !NAME_PATTERN.test(parsed.data.lastName)) {
      return apiError("姓氏格式錯誤", 400);
    }

    const profile = await updateProfileAccountByUserId(user.id, {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      passwordMask: parsed.data.passwordMask || "••••••••••••••••",
      birthday: parsed.data.birthday,
      country: parsed.data.country,
      district: parsed.data.district,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
    });

    return apiOk({ profile });
  } catch (error) {
    if (
      typeof error === "object"
      && error
      && "code" in error
      && (error as { code?: string }).code === "P2002"
    ) {
      return apiError("此電子郵件已被使用", 409, 409);
    }

    console.error("[api/profile/account] PUT failed", error);
    return apiError("儲存帳號資料失敗", 500);
  }
}

export async function DELETE() {
  try {
    const { user, errorResponse } = await requireRequestUser();
    if (!user) {
      return errorResponse;
    }

    await prisma.$transaction(async (tx) => {
      const orders = await tx.order.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      const orderIds = orders.map((item) => item.id);

      if (orderIds.length > 0) {
        await tx.paymentAttempt.deleteMany({
          where: {
            orderId: {
              in: orderIds,
            },
          },
        });

        await tx.orderItem.deleteMany({
          where: {
            orderId: {
              in: orderIds,
            },
          },
        });

        await tx.order.deleteMany({
          where: {
            id: {
              in: orderIds,
            },
          },
        });
      }

      const carts = await tx.cart.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      const cartIds = carts.map((item) => item.id);
      if (cartIds.length > 0) {
        await tx.cartItem.deleteMany({
          where: {
            cartId: {
              in: cartIds,
            },
          },
        });

        await tx.cart.deleteMany({
          where: {
            id: {
              in: cartIds,
            },
          },
        });
      }

      await tx.favorite.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.authSession.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.verificationToken.deleteMany({
        where: {
          OR: [
            {
              userId: user.id,
            },
            {
              email: user.email,
            },
          ],
        },
      });

      await tx.userAddress.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.userProfile.deleteMany({
        where: {
          userId: user.id,
        },
      });

      await tx.user.delete({
        where: {
          id: user.id,
        },
      });
    });

    return apiOk({ success: true });
  } catch (error) {
    console.error("[api/profile/account] DELETE failed", error);
    return apiError("刪除帳號失敗", 500);
  }
}
