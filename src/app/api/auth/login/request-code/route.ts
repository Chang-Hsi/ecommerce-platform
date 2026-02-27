import { VerificationPurpose } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/lib/server/api-response";
import { hashVerificationCode } from "@/lib/server/auth-session";
import { sendLoginCodeEmail } from "@/lib/server/mailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestCodeBody = {
  email?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function createVerificationCode() {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestCodeBody;
    const normalizedEmail = normalizeEmail(body.email ?? "");

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return apiError("請輸入有效的電子郵件", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    const recentToken = await prisma.verificationToken.findFirst({
      where: {
        email: normalizedEmail,
        purpose: VerificationPurpose.LOGIN,
        createdAt: {
          gt: new Date(Date.now() - 20 * 1000),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    if (recentToken) {
      return apiError("請稍候再重新發送驗證碼", 429, 429);
    }

    const code = createVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        userId: user?.id ?? null,
        email: normalizedEmail,
        purpose: VerificationPurpose.LOGIN,
        codeHash: hashVerificationCode(code),
        expiresAt,
      },
    });

    let mailResult: { delivered: boolean };

    try {
      mailResult = await sendLoginCodeEmail({
        to: normalizedEmail,
        code,
      });
    } catch (mailError) {
      const isDevelopment = process.env.NODE_ENV !== "production";
      console.error("[api/auth/login/request-code] send mail failed", mailError);

      if (!isDevelopment) {
        return apiError("發送驗證信失敗，請稍後再試", 502);
      }

      mailResult = { delivered: false };
    }

    return apiOk({
      email: normalizedEmail,
      hasAccount: Boolean(user),
      expiresAt: expiresAt.toISOString(),
      debugCode: process.env.NODE_ENV === "production" || mailResult.delivered ? undefined : code,
      emailDelivered: mailResult.delivered,
    });
  } catch (error) {
    console.error("[api/auth/login/request-code] POST failed", error);
    return apiError("發送驗證碼失敗", 500);
  }
}
