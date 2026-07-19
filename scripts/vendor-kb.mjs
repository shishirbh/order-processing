#!/usr/bin/env node

import { createHash, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const COLUMNS = [
  "Vendor",
  "Vendor Contact",
  "Contact Info",
  "Phone Number",
  "Can CS contact vendor directly?",
  "Can Sales contact Vendor?",
  "If not, DK point of contact",
  "Can we dropship?",
  "Ships Under our account",
  "Ships Expedited?",
  "When is a PO submitted?",
  "When do we receive Coming In House Shipments?",
];

const FIELD_MAP = new Map([
  ["Primary contact", "Vendor Contact"],
  ["Email / contact info", "Contact Info"],
  ["Phone", "Phone Number"],
  ["Can CS contact vendor directly?", "Can CS contact vendor directly?"],
  ["Can Sales contact vendor?", "Can Sales contact Vendor?"],
  ["If not, DK point of contact", "If not, DK point of contact"],
  ["Can we dropship?", "Can we dropship?"],
  ["Ships under our account?", "Ships Under our account"],
  ["Ships expedited?", "Ships Expedited?"],
  ["When is a PO submitted?", "When is a PO submitted?"],
  ["When do we receive coming-in-house shipments?", "When do we receive Coming In House Shipments?"],
]);

const GENERATED_PATHS = [
  "Vendor Information.md",
  "Vendor Information.jsonl",
  "INDEX.md",
  "reports/vendor-completeness.json",
];

function normalizeText(value) {
  const cleaned = String(value ?? "")
    .replace(/\s*\(Updated:\s*\d{4}-\d{2}-\d{2}\)\s*$/i, "")
    .trim();
  if (!cleaned || /^_\((?:blank|blank in source|to be filled)\)_$/i.test(cleaned)) return null;
  return cleaned;
}

function titleVendor(content, fallback) {
  const match = content.match(/^#\s+(.+?)\s+[—–-]\s+Vendor Info\s*$/m);
  return match ? match[1].replace(/\*\*/g, "").trim() : fallback;
}

export function parseVendorInfo(content, folder) {
  const values = Object.fromEntries(COLUMNS.map(column => [column, null]));
  values.Vendor = titleVendor(content, folder.replaceAll(" - ", "/"));

  if (/^\|\s*Field\s*\|\s*Value\s*\|/mi.test(content)) {
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*$/);
      if (!match || ["Field", "---"].includes(match[1].trim())) continue;
      const key = match[1].trim();
      const column = key === "Vendor" ? "Vendor" : (FIELD_MAP.get(key) || key);
      if (COLUMNS.includes(column)) values[column] = normalizeText(match[2]);
    }
    return values;
  }

  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^-\s+\*\*([^*]+?)\*\*:?\s*(.*)$/);
    if (!match) continue;
    const column = FIELD_MAP.get(match[1].replace(/:$/, "").trim());
    if (!column) continue;
    const parts = [];
    if (normalizeText(match[2])) parts.push(normalizeText(match[2]));
    for (let next = index + 1; next < lines.length; next++) {
      const nested = lines[next].match(/^\s{2,}-\s+(.+)$/);
      if (!nested) break;
      const value = normalizeText(nested[1].replace(/^\*|\*$/g, ""));
      if (value) parts.push(value);
      index = next;
    }
    values[column] = parts.length ? parts.join(" / ") : null;
  }
  return values;
}

function aliasesFrom(content) {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex(line => /^##\s+Aliases \/ sub-brands\s*$/i.test(line));
  if (start < 0) return [];
  const aliases = [];
  for (const line of lines.slice(start + 1)) {
    if (/^(?:##\s|---)/.test(line)) break;
    const value = line.match(/^\s*-\s+(.+?)\s*$/)?.[1]?.trim();
    if (value && !/^_\(/.test(value)) aliases.push(value);
  }
  return aliases;
}

function markdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", "<br>");
}

function renderMarkdown(vendors) {
  const lines = [
    "# Vendor Information", "", "<!--", "  ⚠️  GENERATED FILE — DO NOT EDIT BY HAND.", "",
    "  Source of truth is each Vendors/<Vendor>/<Vendor> - Vendor Info.md.",
    "  Run `npm run kb:generate`, review the diff, then run `npm run kb:check`.", "-->", "",
    "## Sheet: Main Sheet", "", `| ${COLUMNS.join(" | ")} |`, `| ${COLUMNS.map(() => "---").join(" | ")} |`,
  ];
  for (const vendor of vendors) lines.push(`| ${COLUMNS.map(column => markdownCell(vendor[column])).join(" | ")} |`);
  return `${lines.join("\n")}\n`;
}

function renderJsonl(vendors) {
  const banner = { _comment: "GENERATED FILE — DO NOT EDIT BY HAND. Edit the per-vendor Vendor Info.md, run npm run kb:generate, validate the diff, then run npm run kb:check." };
  return `${[banner, ...vendors].map(record => JSON.stringify(record)).join("\n")}\n`;
}

function renderIndex(folders, aliases, config) {
  const lines = [
    "# Vendor Alias INDEX", "", "<!--", "  ⚠️  GENERATED FILE — DO NOT EDIT BY HAND.",
    "  Edit per-vendor aliases or config/vendor-exceptions.json, then run `npm run kb:generate`.", "-->", "",
    "Lookup keys are case-insensitive. Alias entries take precedence over canonical names.", "", "## Canonical names", "",
    "| Lookup key | Vendor folder |", "|---|---|",
  ];
  for (const folder of folders) lines.push(`| ${markdownCell(config.canonicalNames?.[folder] || folder)} | ${markdownCell(folder)} |`);
  lines.push("", "## Sub-brand aliases", "", "| Lookup key | Resolves to folder | Source |", "|---|---|---|");
  for (const item of aliases) lines.push(`| ${markdownCell(item.alias)} | ${markdownCell(item.folder)} | Vendor Info |`);
  lines.push("", "## Common name variants", "", "| Lookup key | Resolves to folder | Reason |", "|---|---|---|");
  for (const item of [...(config.variants || [])].sort((a, b) => a.key.localeCompare(b.key))) {
    lines.push(`| ${markdownCell(item.key)} | ${markdownCell(item.folder)} | ${markdownCell(item.reason)} |`);
  }
  lines.push("", "## Exceptions", "", "| Vendor folder | Classification | Details |", "|---|---|---|");
  for (const [folder, exception] of Object.entries(config.exceptions || {}).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`| ${markdownCell(folder)} | ${markdownCell(exception.classification)} | ${markdownCell(exception.reason)} |`);
  }
  return `${lines.join("\n")}\n`;
}

function issueIsStub(content) {
  return /^_\(to be filled\)_$/m.test(content);
}

export function buildKnowledgeArtifacts(documents, config = {}) {
  const folders = [...new Set([...documents.keys()]
    .map(path => path.match(/^Vendors\/([^/]+)\//)?.[1])
    .filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const vendors = [];
  const aliases = [];
  const anomalies = [];
  const issueResolutionStubs = [];

  for (const folder of folders) {
    const paths = [...documents.keys()].filter(path => path.startsWith(`Vendors/${folder}/`));
    const infoPath = paths.find(path => path.endsWith(" - Vendor Info.md"));
    const issuePath = paths.find(path => path.endsWith(" - Issue Resolution Notes.md"));
    const processPath = paths.find(path => path.endsWith(" Process Document.md"));
    const exception = config.exceptions?.[folder];
    for (const [kind, found] of [["vendor_info", infoPath], ["issue_resolution", issuePath], ["process_document", processPath]]) {
      if (!found) anomalies.push({ folder, kind, classification: exception?.classification || "unexpected_missing_file", reason: exception?.reason || "Required vendor document is missing" });
    }
    if (issuePath && issueIsStub(documents.get(issuePath))) issueResolutionStubs.push(issuePath);
    if (!infoPath) continue;
    const content = documents.get(infoPath);
    vendors.push(parseVendorInfo(content, folder));
    for (const alias of aliasesFrom(content)) aliases.push({ alias, folder });
  }

  for (const folder of Object.keys(config.exceptions || {})) {
    if (!folders.includes(folder)) anomalies.push({ folder, classification: "unknown_exception", reason: "Exception does not match a vendor folder" });
    else if (!anomalies.some(item => item.folder === folder)) anomalies.push({ folder, classification: "stale_exception", reason: "All required files now exist; remove this exception" });
  }

  vendors.sort((a, b) => a.Vendor.localeCompare(b.Vendor));
  aliases.sort((a, b) => a.alias.localeCompare(b.alias) || a.folder.localeCompare(b.folder));
  const duplicateCanonicalNames = vendors
    .map(vendor => vendor.Vendor.toLowerCase())
    .filter((name, index, all) => all.indexOf(name) !== index);
  for (const name of duplicateCanonicalNames) anomalies.push({ classification: "duplicate_canonical_name", vendor: name });
  const aliasesByKey = new Map();
  for (const item of aliases) {
    const foldersForAlias = aliasesByKey.get(item.alias.toLowerCase()) || new Set();
    foldersForAlias.add(item.folder);
    aliasesByKey.set(item.alias.toLowerCase(), foldersForAlias);
  }
  for (const [alias, foldersForAlias] of aliasesByKey) {
    if (foldersForAlias.size > 1) anomalies.push({ classification: "alias_collision", alias, folders: [...foldersForAlias].sort() });
  }

  const completeness = {
    schemaVersion: 1,
    counts: {
      vendorFolders: folders.length,
      vendorInfoFiles: vendors.length,
      issueResolutionFiles: folders.length - anomalies.filter(item => item.kind === "issue_resolution").length,
      issueResolutionStubs: issueResolutionStubs.length,
    },
    classifications: {
      issueResolutionStub: "fallback_to_root_issue_playbook",
      knownIncomplete: "listed in config/vendor-exceptions.json",
      unexpectedMissingFile: "fails kb:check",
      duplicateCanonicalName: "fails kb:check",
      aliasCollision: "fails kb:check",
      staleOrUnknownException: "fails kb:check",
    },
    issueResolutionStubs,
    anomalies,
  };

  return new Map([
    ["Vendor Information.md", renderMarkdown(vendors)],
    ["Vendor Information.jsonl", renderJsonl(vendors)],
    ["INDEX.md", renderIndex(folders, aliases, config)],
    ["reports/vendor-completeness.json", `${JSON.stringify(completeness, null, 2)}\n`],
  ]);
}

export function collectKnowledgeDocuments(rootDir) {
  const documents = new Map();
  const includeRoot = ["CLAUDE.md", "Issue resolution.md", "Order processing prompt.md", "general_flow.md", "SOP-Refresh-Changelog.md"];
  for (const path of includeRoot) if (existsSync(join(rootDir, path))) documents.set(path, readFileSync(join(rootDir, path), "utf8"));
  for (const prefix of ["Vendors", "_shared_sops"]) {
    const base = join(rootDir, prefix);
    if (!existsSync(base)) continue;
    const visit = directory => {
      for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const full = join(directory, entry.name);
        if (entry.isDirectory()) visit(full);
        else if (entry.isFile() && [".md", ".jsonl"].some(extension => entry.name.endsWith(extension))) {
          documents.set(relative(rootDir, full).split(sep).join("/"), readFileSync(full, "utf8"));
        }
      }
    };
    visit(base);
  }
  return documents;
}

function atomicWrite(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  writeFileSync(temporary, content);
  renameSync(temporary, path);
}

export function readVendorConfig(rootDir) {
  return JSON.parse(readFileSync(join(rootDir, "config", "vendor-exceptions.json"), "utf8"));
}

export function generate(rootDir) {
  const artifacts = buildKnowledgeArtifacts(collectKnowledgeDocuments(rootDir), readVendorConfig(rootDir));
  for (const [path, content] of artifacts) atomicWrite(join(rootDir, path), content);
  return artifacts;
}

export function check(rootDir) {
  const expected = buildKnowledgeArtifacts(collectKnowledgeDocuments(rootDir), readVendorConfig(rootDir));
  const mismatches = [];
  for (const path of GENERATED_PATHS) {
    const actual = existsSync(join(rootDir, path)) ? readFileSync(join(rootDir, path), "utf8") : null;
    if (actual !== expected.get(path)) mismatches.push(path);
  }
  const report = JSON.parse(expected.get("reports/vendor-completeness.json"));
  const unexpected = report.anomalies.filter(item => ["unexpected_missing_file", "duplicate_canonical_name", "alias_collision", "stale_exception", "unknown_exception"].includes(item.classification));
  return { ok: mismatches.length === 0 && unexpected.length === 0, mismatches, unexpected, report };
}

function usage() {
  console.error("Usage: node scripts/vendor-kb.mjs <generate|check> [--root PATH]");
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const rootIndex = args.indexOf("--root");
  const rootDir = resolve(rootIndex >= 0 ? args[rootIndex + 1] : join(dirname(fileURLToPath(import.meta.url)), ".."));
  if (command === "generate") {
    const artifacts = generate(rootDir);
    console.log(`Generated ${[...artifacts.keys()].join(", ")}`);
    return;
  }
  if (command === "check") {
    const result = check(rootDir);
    console.log(JSON.stringify({ ok: result.ok, counts: result.report.counts, mismatches: result.mismatches, unexpected: result.unexpected }, null, 2));
    if (!result.ok) process.exitCode = 1;
    return;
  }
  usage();
  process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
