import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createAuthStore } from "./auth.mjs";

function temporaryStore() {
  const dataDir = mkdtempSync(join(tmpdir(), "dk-auth-"));
  const store = createAuthStore({ dataDir, bootstrapUsername: "admin", bootstrapPassword: "admin-password-123", sessionSecret: "test-secret" });
  return { store, cleanup: () => rmSync(dataDir, { recursive: true, force: true }) };
}

test("bootstraps one Administrator and authenticates passwords", () => {
  const { store, cleanup } = temporaryStore();
  try {
    assert.equal(store.list().length, 1);
    assert.equal(store.list()[0].role, "administrator");
    assert.equal(store.authenticate("ADMIN", "admin-password-123").username, "admin");
    assert.equal(store.authenticate("admin", "wrong"), null);
  } finally { cleanup(); }
});

test("creates Standard Users and invalidates their old cookie after a password reset", () => {
  const { store, cleanup } = temporaryStore();
  try {
    const employee = store.create({ username: "elina", password: "temporary-pass-123", role: "standard" });
    const account = store.authenticate("elina", "temporary-pass-123");
    const cookie = store.loginCookie(account).split(";")[0];
    assert.equal(store.accountFromRequest({ headers: { cookie } }).id, employee.id);
    store.update(employee.id, { password: "replacement-pass-456" });
    assert.equal(store.accountFromRequest({ headers: { cookie } }), null);
    assert.equal(store.authenticate("elina", "replacement-pass-456").id, employee.id);
  } finally { cleanup(); }
});

test("never disables or demotes the last enabled Administrator", () => {
  const { store, cleanup } = temporaryStore();
  try {
    const admin = store.list()[0];
    assert.throws(() => store.update(admin.id, { enabled: false }), /last enabled Administrator/);
    assert.throws(() => store.update(admin.id, { role: "standard" }), /last enabled Administrator/);
  } finally { cleanup(); }
});
