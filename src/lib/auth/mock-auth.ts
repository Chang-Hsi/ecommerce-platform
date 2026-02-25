export type MockAuthAccount = {
  email: string;
  name: string;
  createdAt: string;
};

export type MockAuthSession = {
  email: string;
  name: string;
};

type MockVerificationRecord = {
  email: string;
  code: string;
  expiresAt: number;
  createdAt: number;
};

const ACCOUNTS_STORAGE_KEY = "swooshlab.mock-auth.accounts.v1";
const SESSION_STORAGE_KEY = "swooshlab.mock-auth.session.v1";
const VERIFY_STORAGE_KEY = "swooshlab.mock-auth.verify.v1";

export const MOCK_AUTH_CHANGED_EVENT = "swooshlab:mock-auth-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function readAccountsMap(): Record<string, MockAuthAccount> {
  if (!isBrowser()) {
    return {};
  }

  return safeJsonParse<Record<string, MockAuthAccount>>(localStorage.getItem(ACCOUNTS_STORAGE_KEY), {});
}

function writeAccountsMap(next: Record<string, MockAuthAccount>) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(next));
}

function readVerificationMap(): Record<string, MockVerificationRecord> {
  if (!isBrowser()) {
    return {};
  }

  return safeJsonParse<Record<string, MockVerificationRecord>>(localStorage.getItem(VERIFY_STORAGE_KEY), {});
}

function writeVerificationMap(next: Record<string, MockVerificationRecord>) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(VERIFY_STORAGE_KEY, JSON.stringify(next));
}

function emitAuthChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(MOCK_AUTH_CHANGED_EVENT));
}

function createVerificationCode() {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const digits = new Uint8Array(8);
    crypto.getRandomValues(digits);
    return Array.from(digits, (digit) => String(digit % 10)).join("");
  }

  return String(Math.floor(10000000 + Math.random() * 90000000));
}

export function normalizeEmail(rawEmail: string) {
  return rawEmail.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function deriveDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? "";
  const normalized = localPart.replace(/[._-]+/g, " ").trim();

  if (!normalized) {
    return "Member";
  }

  return normalized.slice(0, 1).toUpperCase() + normalized.slice(1);
}

export function resolveSafeRedirect(rawRedirect: string | null | undefined) {
  if (!rawRedirect) {
    return "/";
  }

  if (!rawRedirect.startsWith("/")) {
    return "/";
  }

  if (rawRedirect.startsWith("//")) {
    return "/";
  }

  return rawRedirect;
}

export function getMockAccountByEmail(rawEmail: string) {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    return null;
  }

  return readAccountsMap()[email] ?? null;
}

export function hasMockAccount(rawEmail: string) {
  return Boolean(getMockAccountByEmail(rawEmail));
}

export function upsertMockAccount(rawEmail: string, name?: string) {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    return null;
  }

  const accounts = readAccountsMap();
  const previous = accounts[email];
  const account: MockAuthAccount = {
    email,
    name: name?.trim() || previous?.name || deriveDisplayName(email),
    createdAt: previous?.createdAt || new Date().toISOString(),
  };

  accounts[email] = account;
  writeAccountsMap(accounts);
  return account;
}

export function getMockSession() {
  if (!isBrowser()) {
    return null;
  }

  const parsed = safeJsonParse<MockAuthSession | null>(localStorage.getItem(SESSION_STORAGE_KEY), null);
  if (!parsed || !parsed.email || !parsed.name) {
    return null;
  }

  return parsed;
}

export function signInMockUser(rawEmail: string) {
  const account = getMockAccountByEmail(rawEmail);
  if (!account || !isBrowser()) {
    return null;
  }

  const session: MockAuthSession = {
    email: account.email,
    name: account.name,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  emitAuthChanged();
  return session;
}

export function registerAndSignInMockUser(rawEmail: string) {
  const account = upsertMockAccount(rawEmail);
  if (!account || !isBrowser()) {
    return null;
  }

  const session: MockAuthSession = {
    email: account.email,
    name: account.name,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  emitAuthChanged();
  return session;
}

export function signOutMockUser() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
  emitAuthChanged();
}

export function startMockEmailVerification(rawEmail: string) {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    return null;
  }

  const nextRecord: MockVerificationRecord = {
    email,
    code: createVerificationCode(),
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  const records = readVerificationMap();
  records[email] = nextRecord;
  writeVerificationMap(records);

  return nextRecord;
}

export function getMockEmailVerification(rawEmail: string) {
  const email = normalizeEmail(rawEmail);
  if (!email) {
    return null;
  }

  const record = readVerificationMap()[email] ?? null;
  if (!record) {
    return null;
  }

  if (record.expiresAt < Date.now()) {
    const records = readVerificationMap();
    delete records[email];
    writeVerificationMap(records);
    return null;
  }

  return record;
}

export function resendMockEmailVerification(rawEmail: string) {
  return startMockEmailVerification(rawEmail);
}

export function verifyMockEmailCode(rawEmail: string, rawCode: string) {
  const email = normalizeEmail(rawEmail);
  const code = rawCode.trim();
  if (!email || !code) {
    return false;
  }

  const record = getMockEmailVerification(email);
  if (!record) {
    return false;
  }

  if (record.code !== code && code !== "12345678") {
    return false;
  }

  const records = readVerificationMap();
  delete records[email];
  writeVerificationMap(records);
  return true;
}
