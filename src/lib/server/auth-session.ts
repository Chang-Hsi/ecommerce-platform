import { createHash, randomBytes } from "node:crypto";
import { User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const AUTH_ACCESS_COOKIE_NAME = "swooshlab_access_token";
export const AUTH_REFRESH_COOKIE_NAME = "swooshlab_refresh_token";

const ACCESS_TOKEN_TTL_SECONDS = Math.max(300, Number(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS ?? 60 * 15));
const REFRESH_TOKEN_TTL_SECONDS = Math.max(
  60 * 60 * 24,
  Number(process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 30),
);

function getEnvValue(name: string, developmentFallback: string) {
  const value = process.env[name]?.trim();
  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} is required in production.`);
  }

  return developmentFallback;
}

function getAccessSecret() {
  return new TextEncoder().encode(getEnvValue("AUTH_ACCESS_SECRET", "dev-access-secret-change-me"));
}

function getRefreshSecret() {
  return new TextEncoder().encode(getEnvValue("AUTH_REFRESH_SECRET", "dev-refresh-secret-change-me"));
}

type AccessJwtPayload = {
  sub: string;
  email: string;
  name: string;
  typ: "access";
};

type RefreshJwtPayload = {
  sub: string;
  st: string;
  typ: "refresh";
};

type SessionUser = Pick<User, "id" | "email" | "name">;

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export function hashPassword(rawPassword: string) {
  return createHash("sha256").update(`swooshlab-password:${rawPassword}`).digest("hex");
}

export function generateSystemPassword(length = 16) {
  const source = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const bytes = randomBytes(length);
  let output = "";

  for (let index = 0; index < length; index += 1) {
    output += source[bytes[index] % source.length];
  }

  return output;
}

function buildJwtIssuer() {
  return process.env.AUTH_JWT_ISSUER?.trim() || "swooshlab";
}

function buildJwtAudience() {
  return process.env.AUTH_JWT_AUDIENCE?.trim() || "swooshlab-storefront";
}

async function signAccessToken(user: SessionUser) {
  return new SignJWT({
    email: user.email,
    name: resolveDisplayName(user.name, user.email),
    typ: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(buildJwtIssuer())
    .setAudience(buildJwtAudience())
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(getAccessSecret());
}

async function signRefreshToken(payload: RefreshJwtPayload) {
  return new SignJWT({
    st: payload.st,
    typ: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(buildJwtIssuer())
    .setAudience(buildJwtAudience())
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL_SECONDS}s`)
    .sign(getRefreshSecret());
}

async function verifyAccessToken(token: string) {
  try {
    const verified = await jwtVerify(token, getAccessSecret(), {
      issuer: buildJwtIssuer(),
      audience: buildJwtAudience(),
    });

    const payload = verified.payload as Partial<AccessJwtPayload>;

    if (payload.typ !== "access") {
      return null;
    }

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : resolveDisplayName(null, payload.email),
    };
  } catch {
    return null;
  }
}

async function verifyRefreshToken(token: string) {
  try {
    const verified = await jwtVerify(token, getRefreshSecret(), {
      issuer: buildJwtIssuer(),
      audience: buildJwtAudience(),
    });

    const payload = verified.payload as Partial<RefreshJwtPayload>;

    if (payload.typ !== "refresh") {
      return null;
    }

    if (typeof payload.sub !== "string" || typeof payload.st !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      st: payload.st,
    };
  } catch {
    return null;
  }
}

export function resolveDisplayName(name: string | null | undefined, email: string) {
  if (name && name.trim()) {
    return name;
  }

  const localPart = email.split("@")[0] ?? "";
  const normalized = localPart.replace(/[._-]+/g, " ").trim();
  if (!normalized) {
    return "Member";
  }

  return normalized.slice(0, 1).toUpperCase() + normalized.slice(1);
}

export function buildAccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  };
}

export function buildRefreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  };
}

export function hashVerificationCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function createRefreshSessionToken() {
  return randomBytes(32).toString("hex");
}

async function createRefreshSessionRecord(userId: string) {
  const sessionToken = createRefreshSessionToken();
  const tokenHash = hashToken(sessionToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  const session = await prisma.authSession.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    session,
    sessionToken,
  };
}

async function revokeSessionById(sessionId: string) {
  await prisma.authSession.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

async function revokeSessionBySessionToken(sessionToken: string) {
  await prisma.authSession.updateMany({
    where: {
      tokenHash: hashToken(sessionToken),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

async function issueAuthTokensForUser(user: SessionUser) {
  const refreshRecord = await createRefreshSessionRecord(user.id);
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(user),
    signRefreshToken({
      sub: user.id,
      st: refreshRecord.sessionToken,
      typ: "refresh",
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}

async function findSessionByRefreshPayload(payload: { sub: string; st: string }) {
  return prisma.authSession.findFirst({
    where: {
      userId: payload.sub,
      tokenHash: hashToken(payload.st),
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function resolveRequestSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_COOKIE_NAME)?.value;

  if (!accessToken) {
    return null;
  }

  const verifiedPayload = await verifyAccessToken(accessToken);

  if (!verifiedPayload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: verifiedPayload.sub,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    user,
  };
}

export async function tryRefreshSessionFromCookies() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return null;
  }

  const verifiedPayload = await verifyRefreshToken(refreshToken);
  if (!verifiedPayload) {
    return null;
  }

  const session = await findSessionByRefreshPayload(verifiedPayload);
  if (!session) {
    return null;
  }

  await revokeSessionById(session.id);

  const nextTokens = await issueAuthTokensForUser(session.user);

  return {
    user: session.user,
    accessToken: nextTokens.accessToken,
    refreshToken: nextTokens.refreshToken,
  };
}

export async function createLoginSessionTokens(user: SessionUser) {
  return issueAuthTokensForUser(user);
}

export async function revokeSessionByRefreshCookie() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return;
  }

  const verifiedPayload = await verifyRefreshToken(refreshToken);

  if (!verifiedPayload) {
    return;
  }

  await revokeSessionBySessionToken(verifiedPayload.st);
}

export function getAuthUserDto(user: SessionUser) {
  return {
    email: user.email,
    name: resolveDisplayName(user.name, user.email),
  };
}
