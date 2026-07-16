import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const COOKIE_NAME = "dk_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function atomicWrite(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  writeFileSync(temporary, JSON.stringify(value, null, 2), { mode: 0o600 });
  renameSync(temporary, path);
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, encoded) {
  const [algorithm, salt, expected] = String(encoded).split(":");
  if (algorithm !== "scrypt" || !salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

function publicAccount(account) {
  return {
    id: account.id,
    username: account.username,
    role: account.role,
    enabled: account.enabled,
    createdAt: account.createdAt,
  };
}

export function createAuthStore({ dataDir, bootstrapUsername, bootstrapPassword, sessionSecret, secureCookies = false }) {
  const accountsPath = join(dataDir, "accounts.json");
  const secretPath = join(dataDir, "auth-secret");
  let accounts = [];

  if (existsSync(accountsPath)) {
    const parsed = JSON.parse(readFileSync(accountsPath, "utf8"));
    accounts = Array.isArray(parsed) ? parsed : parsed.accounts || [];
  } else if (bootstrapPassword) {
    accounts = [{
      id: randomBytes(12).toString("hex"),
      username: bootstrapUsername || "dk",
      passwordHash: hashPassword(bootstrapPassword),
      role: "administrator",
      enabled: true,
      authVersion: 1,
      createdAt: new Date().toISOString(),
    }];
    atomicWrite(accountsPath, { accounts });
  }

  let secret = sessionSecret;
  if (!secret && existsSync(secretPath)) secret = readFileSync(secretPath, "utf8").trim();
  if (!secret) {
    secret = randomBytes(32).toString("hex");
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(secretPath, secret, { mode: 0o600 });
  }

  const save = () => atomicWrite(accountsPath, { accounts });
  const normalizeUsername = (value) => String(value || "").trim().toLowerCase();
  const sign = (payload) => createHmac("sha256", secret).update(payload).digest("base64url");

  function makeToken(account) {
    const payload = `${account.id}.${account.authVersion}.${Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS}`;
    return `${payload}.${sign(payload)}`;
  }

  function accountFromRequest(req) {
    const cookies = Object.fromEntries(String(req.headers.cookie || "").split(";").map(part => {
      const separator = part.indexOf("=");
      return separator < 0 ? ["", ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
    }));
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    const pieces = token.split(".");
    if (pieces.length !== 4) return null;
    const [id, version, expires, signature] = pieces;
    const payload = `${id}.${version}.${expires}`;
    const actual = Buffer.from(signature);
    const expected = Buffer.from(sign(payload));
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    if (Number(expires) <= Math.floor(Date.now() / 1000)) return null;
    return accounts.find(a => a.id === id && a.enabled && String(a.authVersion) === version) || null;
  }

  function cookie(token, maxAge = SESSION_TTL_SECONDS) {
    return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secureCookies ? "; Secure" : ""}`;
  }

  return {
    needsBootstrap: () => accounts.length === 0,
    initialAdministrator: () => accounts.find(a => a.role === "administrator"),
    authenticate(username, password) {
      const account = accounts.find(a => normalizeUsername(a.username) === normalizeUsername(username));
      if (!account || !account.enabled || !verifyPassword(String(password || ""), account.passwordHash)) return null;
      return account;
    },
    accountFromRequest,
    loginCookie: account => cookie(makeToken(account)),
    logoutCookie: () => cookie("", 0),
    publicAccount,
    list: () => accounts.map(publicAccount),
    create({ username, password, role }) {
      const normalized = normalizeUsername(username);
      if (!/^[a-z0-9._-]{2,64}$/.test(normalized)) throw new Error("Username must be 2–64 letters, numbers, dots, underscores, or hyphens");
      if (String(password || "").length < 12) throw new Error("Password must be at least 12 characters");
      if (!new Set(["administrator", "standard"]).has(role)) throw new Error("Invalid role");
      if (accounts.some(a => normalizeUsername(a.username) === normalized)) throw new Error("Username already exists");
      const account = { id: randomBytes(12).toString("hex"), username: normalized, passwordHash: hashPassword(password), role, enabled: true, authVersion: 1, createdAt: new Date().toISOString() };
      accounts.push(account);
      save();
      return publicAccount(account);
    },
    update(id, changes) {
      const account = accounts.find(a => a.id === id);
      if (!account) throw new Error("Account not found");
      if (changes.role !== undefined) {
        if (!new Set(["administrator", "standard"]).has(changes.role)) throw new Error("Invalid role");
        const enabledAdmins = accounts.filter(a => a.enabled && a.role === "administrator");
        if (account.role === "administrator" && changes.role !== "administrator" && enabledAdmins.length === 1) throw new Error("Cannot remove the last enabled Administrator");
        account.role = changes.role;
      }
      if (changes.enabled !== undefined) {
        const enabledAdmins = accounts.filter(a => a.enabled && a.role === "administrator");
        if (account.enabled && account.role === "administrator" && !changes.enabled && enabledAdmins.length === 1) throw new Error("Cannot disable the last enabled Administrator");
        account.enabled = Boolean(changes.enabled);
      }
      if (changes.password !== undefined) {
        if (String(changes.password).length < 12) throw new Error("Password must be at least 12 characters");
        account.passwordHash = hashPassword(changes.password);
      }
      account.authVersion += 1;
      save();
      return publicAccount(account);
    },
  };
}
