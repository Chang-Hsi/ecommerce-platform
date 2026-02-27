import nodemailer from "nodemailer";

export type SendLoginCodeEmailInput = {
  to: string;
  code: string;
};

function resolveSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    from,
  };
}

export async function sendLoginCodeEmail(input: SendLoginCodeEmailInput) {
  const smtp = resolveSmtpConfig();

  if (!smtp) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured.");
    }

    return {
      delivered: false,
      reason: "smtp_not_configured",
    } as const;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });

  await transporter.sendMail({
    from: smtp.from,
    to: input.to,
    subject: "SwooshLab 登入驗證碼",
    text: `你的驗證碼是 ${input.code}，10 分鐘內有效。`,
    html: `<p>你的驗證碼是 <strong style=\"font-size:20px;letter-spacing:2px\">${input.code}</strong></p><p>10 分鐘內有效。</p>`,
  });

  return {
    delivered: true,
  } as const;
}
