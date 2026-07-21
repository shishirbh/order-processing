import { createHash, randomBytes } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const ROOT_DOCUMENTS = new Set([
  "CLAUDE.md",
  "INDEX.md",
  "Issue resolution.md",
  "Order processing prompt.md",
  "SOP-Refresh-Changelog.md",
  "Vendor Information.md",
  "Vendor Information.jsonl",
  "general_flow.md",
  "reports/vendor-completeness.json",
]);
const MANAGED_PREFIXES = ["Vendors/", "_shared_sops/"];
const GENERATED_DOCUMENTS = new Set(["INDEX.md", "Vendor Information.md", "Vendor Information.jsonl", "reports/vendor-completeness.json"]);
const PUBLISHABLE_ROOT_DOCUMENTS = new Set(["Issue resolution.md", "Order processing prompt.md", "SOP-Refresh-Changelog.md", "general_flow.md"]);

function digest(content) {
  return createHash("sha256").update(content).digest("hex");
}

function atomicWrite(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  writeFileSync(temporary, content, { mode: 0o600 });
  renameSync(temporary, path);
}

export function normalizeKnowledgePath(input) {
  if (typeof input !== "string" || !input.trim() || input.includes("\0") || isAbsolute(input)) throw new Error("Knowledge path must be relative");
  const path = input.replaceAll("\\", "/").replace(/^\.\//, "");
  const parts = path.split("/");
  if (parts.some(part => !part || part === "." || part === "..")) throw new Error("Invalid knowledge path");
  if (!ROOT_DOCUMENTS.has(path) && !MANAGED_PREFIXES.some(prefix => path.startsWith(prefix))) throw new Error("Path is outside the knowledge allowlist");
  if (!(path.endsWith(".md") || path.endsWith(".jsonl") || path === "reports/vendor-completeness.json")) throw new Error("Unsupported knowledge document type");
  return path;
}

function normalizeKnowledgeDirectory(input) {
  if (input === "" || input === undefined) return "";
  if (typeof input !== "string" || input.includes("\0") || isAbsolute(input)) throw new Error("Knowledge directory must be relative");
  const path = input.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "");
  if (path.split("/").some(part => !part || part === "." || part === "..")) throw new Error("Invalid knowledge directory");
  if (path !== "Vendors" && path !== "_shared_sops" && !MANAGED_PREFIXES.some(prefix => `${path}/`.startsWith(prefix))) {
    throw new Error("Directory is outside the knowledge allowlist");
  }
  return path;
}

export function isPublishableKnowledgePath(input) {
  const path = normalizeKnowledgePath(input);
  return !GENERATED_DOCUMENTS.has(path) && (PUBLISHABLE_ROOT_DOCUMENTS.has(path) || MANAGED_PREFIXES.some(prefix => path.startsWith(prefix)));
}

function safeRepositoryFile(repositoryDir, path) {
  const candidate = resolve(repositoryDir, path);
  const root = realpathSync(repositoryDir);
  if (!candidate.startsWith(`${root}${sep}`)) throw new Error("Path is outside the repository");
  if (!existsSync(candidate)) return null;
  const actual = realpathSync(candidate);
  if (!actual.startsWith(`${root}${sep}`)) throw new Error("Knowledge document symlink escapes the repository");
  if (!lstatSync(actual).isFile()) return null;
  return actual;
}

function walkAllowedRepository(repositoryDir) {
  const paths = new Set([...ROOT_DOCUMENTS].filter(path => existsSync(join(repositoryDir, path))));
  for (const prefix of MANAGED_PREFIXES) {
    const base = join(repositoryDir, prefix);
    if (!existsSync(base)) continue;
    const visit = directory => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const full = join(directory, entry.name);
        if (entry.isDirectory()) visit(full);
        else if (entry.isFile()) {
          const path = relative(repositoryDir, full).split(sep).join("/");
          try { normalizeKnowledgePath(path); paths.add(path); } catch {}
        }
      }
    };
    visit(base);
  }
  return paths;
}

export function createKnowledgeStore({ repositoryDir, dataDir, now = () => new Date().toISOString() }) {
  const root = resolve(repositoryDir);
  const storeDir = join(resolve(dataDir), "knowledge");
  const manifestPath = join(storeDir, "manifest.json");
  const versionsDir = join(storeDir, "versions");
  const auditPath = join(storeDir, "audit.jsonl");
  mkdirSync(versionsDir, { recursive: true });
  let manifest = { schemaVersion: 1, documents: {} };
  if (existsSync(manifestPath)) {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (parsed.schemaVersion !== 1 || typeof parsed.documents !== "object") throw new Error("Unsupported knowledge manifest");
    manifest = parsed;
  }

  const repositoryContent = path => {
    const file = safeRepositoryFile(root, path);
    return file ? readFileSync(file, "utf8") : null;
  };
  const versionContent = version => {
    if (!/^sha256:[a-f0-9]{64}$/.test(version)) throw new Error("Invalid document version");
    const file = join(versionsDir, `${version.slice(7)}.content`);
    if (!existsSync(file)) throw new Error("Document version is unavailable");
    return readFileSync(file, "utf8");
  };
  const preserveRepositoryBaseline = (path, entry) => {
    if (entry.baselineVersion || entry.history?.some(item => item.action === "baseline")) return false;
    const content = repositoryContent(path);
    if (content === null) return false;
    const version = `sha256:${digest(content)}`;
    const blobPath = join(versionsDir, `${version.slice(7)}.content`);
    if (!existsSync(blobPath)) atomicWrite(blobPath, content);
    entry.baselineVersion = version;
    entry.history = [{ version, timestamp: null, actor: "repository", action: "baseline" }, ...(entry.history || [])];
    return true;
  };
  let migratedBaseline = false;
  for (const [path, entry] of Object.entries(manifest.documents)) {
    if (preserveRepositoryBaseline(path, entry)) migratedBaseline = true;
  }
  if (migratedBaseline) atomicWrite(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const read = input => {
    const path = normalizeKnowledgePath(input);
    const activeVersion = manifest.documents[path]?.activeVersion;
    if (activeVersion) return { path, content: versionContent(activeVersion), version: activeVersion, source: "published" };
    const content = repositoryContent(path);
    if (content === null) throw new Error("Knowledge document not found");
    return { path, content, version: `repository:${digest(content)}`, source: "repository" };
  };
  const documentPaths = () => {
    const paths = walkAllowedRepository(root);
    for (const path of Object.keys(manifest.documents)) paths.add(path);
    return [...paths].sort((a, b) => a.localeCompare(b));
  };
  const documents = () => new Map(documentPaths().map(path => [path, read(path).content]));

  function commitBatch(changes, { actor, action = "publish" }) {
    if (!actor) throw new Error("Publishing actor is required");
    if (!Array.isArray(changes) || changes.length === 0) throw new Error("At least one document change is required");
    const timestamp = now();
    const next = structuredClone(manifest);
    const events = [];
    for (const change of changes) {
      const path = normalizeKnowledgePath(change.path);
      if (typeof change.content !== "string") throw new Error(`Content for ${path} must be text`);
      if (change.expectedVersion === "new") {
        try { read(path); throw new Error(`Knowledge document already exists: ${path}`); }
        catch (error) { if (!/not found/.test(error.message)) throw error; }
      } else if (change.expectedVersion && read(path).version !== change.expectedVersion) {
        throw new Error(`Document changed since it was read: ${path}`);
      }
      const version = `sha256:${digest(change.content)}`;
      const blobPath = join(versionsDir, `${version.slice(7)}.content`);
      if (!existsSync(blobPath)) atomicWrite(blobPath, change.content);
      const entry = next.documents[path] || { activeVersion: null, history: [] };
      preserveRepositoryBaseline(path, entry);
      entry.activeVersion = version;
      entry.history.push({ version, timestamp, actor, action: change.action || action });
      next.documents[path] = entry;
      events.push({ timestamp, actor, action: change.action || action, path, version });
    }
    atomicWrite(manifestPath, `${JSON.stringify(next, null, 2)}\n`);
    for (const event of events) writeFileSync(auditPath, `${JSON.stringify(event)}\n`, { flag: "a", mode: 0o600 });
    manifest = next;
    return events;
  }

  return {
    read,
    documents,
    list(input = "") {
      const directory = normalizeKnowledgeDirectory(input);
      const prefix = directory ? `${directory}/` : "";
      return documentPaths().filter(path => path.startsWith(prefix));
    },
    history(input) {
      const path = normalizeKnowledgePath(input);
      const current = read(path);
      return { path, activeVersion: current.version, source: current.source, history: manifest.documents[path]?.history || [] };
    },
    contentAtVersion(input, version) {
      const path = normalizeKnowledgePath(input);
      if (version.startsWith("repository:")) {
        const content = repositoryContent(path);
        if (content === null || `repository:${digest(content)}` !== version) throw new Error("Repository version is unavailable");
        return content;
      }
      return versionContent(version);
    },
    publishBatch: commitBatch,
    isPublishable: isPublishableKnowledgePath,
  };
}
