import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createKnowledgeStore, normalizeKnowledgePath } from "./knowledge-store.mjs";
import { createKnowledgeTools } from "./knowledge-tools.mjs";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "dk-knowledge-repo-"));
  const dataDir = mkdtempSync(join(tmpdir(), "dk-knowledge-data-"));
  mkdirSync(join(root, "Vendors", "Acme"), { recursive: true });
  mkdirSync(join(root, "_shared_sops"), { recursive: true });
  writeFileSync(join(root, "Vendors", "Acme", "Acme - Vendor Info.md"), "# Acme — Vendor Info\n\n## Aliases / sub-brands\n- A Co\n");
  writeFileSync(join(root, "Vendors", "Acme", "Acme - Issue Resolution Notes.md"), "_(to be filled)_\n");
  writeFileSync(join(root, "Vendors", "Acme", "Acme Process Document.md"), "# Acme Process\n");
  writeFileSync(join(root, "Issue resolution.md"), "# Shared claims\n");
  return { root, dataDir, cleanup: () => { rmSync(root, { recursive: true, force: true }); rmSync(dataDir, { recursive: true, force: true }); } };
}

const config = { exceptions: {}, variants: [], canonicalNames: {} };

test("knowledge paths reject traversal, absolute paths, server files, and escaping symlinks", () => {
  const { root, dataDir, cleanup } = fixture();
  try {
    const outside = join(dataDir, "secret.txt");
    writeFileSync(outside, "secret");
    symlinkSync(outside, join(root, "Vendors", "Acme", "escape.md"));
    const store = createKnowledgeStore({ repositoryDir: root, dataDir });
    for (const path of ["../secret", "/etc/passwd", "server/cli.mjs", "Vendors/../secret.txt"]) {
      assert.throws(() => normalizeKnowledgePath(path));
    }
    assert.throws(() => store.read("Vendors/Acme/escape.md"), /escapes/);
  } finally { cleanup(); }
});

test("published versions survive restart and rollback creates an auditable active version", () => {
  const { root, dataDir, cleanup } = fixture();
  try {
    let store = createKnowledgeStore({ repositoryDir: root, dataDir, now: () => "2026-01-01T00:00:00.000Z" });
    const path = "Vendors/Acme/Acme - Vendor Info.md";
    const original = store.read(path);
    store.publishBatch([{ path, content: "# Acme — Vendor Info\nupdated\n", expectedVersion: original.version }], { actor: "admin" });
    store = createKnowledgeStore({ repositoryDir: root, dataDir, now: () => "2026-01-02T00:00:00.000Z" });
    assert.match(store.read(path).content, /updated/);
    const publishedVersion = store.read(path).version;
    store.publishBatch([{ path, content: store.contentAtVersion(path, publishedVersion), expectedVersion: publishedVersion, action: `rollback:${publishedVersion}` }], { actor: "admin" });
    assert.equal(store.history(path).history.length, 2);
    assert.match(store.history(path).history[1].action, /^rollback:/);
  } finally { cleanup(); }
});

test("standard and Administrator toolsets expose only purpose-specific knowledge operations", () => {
  const { root, dataDir, cleanup } = fixture();
  try {
    const store = createKnowledgeStore({ repositoryDir: root, dataDir });
    assert.deepEqual(createKnowledgeTools({ store, role: "standard", actor: "rep", vendorConfig: config }).map(tool => tool.name), ["knowledge_list", "knowledge_read"]);
    assert.deepEqual(createKnowledgeTools({ store, role: "administrator", actor: "admin", vendorConfig: config }).map(tool => tool.name), ["knowledge_list", "knowledge_read", "knowledge_publish", "knowledge_history", "knowledge_rollback"]);
  } finally { cleanup(); }
});

test("Administrator publishing versions the source, regenerates artifacts, and supports rollback", async () => {
  const { root, dataDir, cleanup } = fixture();
  try {
    const store = createKnowledgeStore({ repositoryDir: root, dataDir });
    const path = "Vendors/Acme/Acme - Vendor Info.md";
    const original = store.read(path);
    const tools = createKnowledgeTools({ store, role: "administrator", actor: "admin", vendorConfig: config });
    const publish = tools.find(tool => tool.name === "knowledge_publish");
    const published = await publish.execute("call-1", { path, content: "# Acme — Vendor Info\n- **Can we dropship?** Yes\n", expectedVersion: original.version });
    assert.equal(published.isError, false);
    assert.equal(store.read("Vendor Information.jsonl").source, "published");
    assert.match(store.read("Vendor Information.jsonl").content, /\"Can we dropship\?\":\"Yes\"/);

    const active = store.read(path).version;
    const rollback = tools.find(tool => tool.name === "knowledge_rollback");
    const rolledBack = await rollback.execute("call-2", { path, version: original.version, expectedVersion: active });
    assert.equal(rolledBack.isError, false);
    assert.equal(store.read(path).content, original.content);
    assert.match(store.history(path).history.at(-1).action, /^rollback:/);
  } finally { cleanup(); }
});
