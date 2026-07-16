import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function waitForHealth(port) {
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error("Server did not become healthy");
}

async function request(port, path, { method = "GET", cookie, body } = {}) {
  const headers = {};
  if (cookie) headers.Cookie = cookie;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  return fetch(`http://127.0.0.1:${port}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
}

async function login(port, username, password) {
  const response = await request(port, "/api/auth/login", { method: "POST", body: { username, password } });
  assert.equal(response.status, 200);
  return response.headers.get("set-cookie").split(";")[0];
}

test("accounts are authorized and conversations are private", async () => {
  const dataDir = mkdtempSync(join(tmpdir(), "dk-server-"));
  const port = await freePort();
  const child = spawn(process.execPath, ["server/cli.mjs", "--dev"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1", DATA_DIR: dataDir, ADMIN_USERNAME: "admin", ADMIN_PASSWORD: "admin-password-123", SESSION_SECRET: "integration-test-secret", NO_GIT_SYNC: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", chunk => { stderr += chunk; });
  try {
    await waitForHealth(port);
    assert.equal((await request(port, "/api/sessions")).status, 401);

    const adminCookie = await login(port, "admin", "admin-password-123");
    const createdAccount = await request(port, "/api/accounts", { method: "POST", cookie: adminCookie, body: { username: "employee", password: "employee-pass-123", role: "standard" } });
    assert.equal(createdAccount.status, 201);

    const createdConversation = await request(port, "/api/sessions", { method: "POST", cookie: adminCookie });
    assert.equal(createdConversation.status, 200);
    const conversation = await createdConversation.json();
    assert.equal((await request(port, "/api/sessions", { cookie: adminCookie }).then(r => r.json())).length, 1);

    const employeeCookie = await login(port, "employee", "employee-pass-123");
    assert.deepEqual(await request(port, "/api/sessions", { cookie: employeeCookie }).then(r => r.json()), []);
    assert.equal((await request(port, "/api/accounts", { cookie: employeeCookie })).status, 403);
    assert.equal((await request(port, `/api/sessions/${conversation.id}/messages`, { cookie: employeeCookie })).status, 404);
  } finally {
    child.kill("SIGTERM");
    await new Promise(resolve => child.once("exit", resolve));
    rmSync(dataDir, { recursive: true, force: true });
  }
  assert.equal(stderr, "");
});
