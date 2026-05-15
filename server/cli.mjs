#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, statSync, appendFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

import {
  createAgentSession,
  SessionManager,
  DefaultResourceLoader,
  getAgentDir,
} from "@mariozechner/pi-coding-agent";

// ── Config ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");            // repo root = knowledge base
const SESSIONS_DIR = join(homedir(), ".dk-order-processing", "sessions");
const PI_SESSIONS_ROOT = join(homedir(), ".dk-order-processing", "pi-sessions");
const FEEDBACK_FILE = join(homedir(), ".dk-order-processing", "feedback.jsonl");
const PUBLIC_DIR = join(__dirname, "public");
const PORT = 0; // auto-assign

// ── Pull latest knowledge base ─────────────────────────────────────
console.log("\n🔄 Pulling latest knowledge base...");
try {
  execSync("git pull --rebase", { cwd: REPO_DIR, stdio: "inherit" });
  console.log("   (up to date)\n");
} catch {
  console.log("   (pull skipped — offline or no remote)\n");
}

console.log(`   Knowledge base: ${REPO_DIR}`);
console.log(`   Skills: ${join(REPO_DIR, "plugin", "skills")}\n`);

// ── Vendor list (rebuilt at launch from per-vendor files = source of truth) ──
// The root Vendor Information.jsonl is a generated rollup that drifts; scan the
// per-vendor Vendor Info.md title lines instead. Cache in memory.
function loadVendorNames() {
  const vendorsDir = join(REPO_DIR, "Vendors");
  if (!existsSync(vendorsDir)) return [];
  const names = [];
  for (const e of readdirSync(vendorsDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    let canonical = e.name;
    try {
      const folder = join(vendorsDir, e.name);
      const infoFile = readdirSync(folder).find(f => f.endsWith(" - Vendor Info.md"));
      if (infoFile) {
        const head = readFileSync(join(folder, infoFile), "utf-8").split("\n", 5).join("\n");
        // Match the title: "# <Canonical Name> — Vendor Info" (em-dash or hyphen)
        const m = head.match(/^#\s+(.+?)\s+[—–-]\s+Vendor Info\s*$/m);
        if (m) canonical = m[1].trim();
      }
    } catch {}
    names.push(canonical);
  }
  return names.sort((a, b) => a.localeCompare(b));
}

let VENDOR_NAMES = [];
function refreshVendorNames() {
  VENDOR_NAMES = loadVendorNames();
  console.log(`📋 Vendor list: ${VENDOR_NAMES.length} vendors loaded from Vendors/\n`);
}
refreshVendorNames();

// Ensure sessions directory
if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR, { recursive: true });

// ── Helpers ─────────────────────────────────────────────────────────
function json(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// Extract human-readable text from agent content (which may be an array of content blocks)
function extractText(content) {
  if (typeof content === "string") {
    // Handle already-stringified content blocks (e.g. from stored sessions)
    if (content.startsWith("[{")) {
      try {
        const blocks = JSON.parse(content);
        if (Array.isArray(blocks)) return extractText(blocks);
      } catch {}
    }
    return content;
  }
  if (!Array.isArray(content)) return String(content);
  return content
    .filter(block => block.type === "text" && block.text)
    .map(block => block.text)
    .join("\n");
}

// Extract thinking/reasoning blocks from content
function extractThinking(content) {
  if (typeof content === "string") {
    if (content.startsWith("[{")) {
      try {
        const blocks = JSON.parse(content);
        if (Array.isArray(blocks)) return extractThinking(blocks);
      } catch {}
    }
    return "";
  }
  if (!Array.isArray(content)) return "";
  return content
    .filter(block => block.type === "thinking" && block.thinking)
    .map(block => block.thinking)
    .join("\n");
}

// Short, human-readable summary of a tool call's args (file path, command, pattern, …)
function summarizeToolArgs(toolName, args) {
  if (!args || typeof args !== "object") return "";
  const a = args;
  if (a.file_path) return a.file_path;
  if (a.path && a.pattern) return `${a.pattern} in ${a.path}`;
  if (a.pattern) return a.pattern;
  if (a.command) return a.command.length > 80 ? a.command.slice(0, 80) + "…" : a.command;
  if (a.url) return a.url;
  if (a.query) return a.query;
  if (a.skill) return a.skill;
  // Fallback: first string value, capped
  for (const v of Object.values(a)) {
    if (typeof v === "string" && v.length) return v.length > 80 ? v.slice(0, 80) + "…" : v;
  }
  return "";
}

// Extract tool calls from an assistant message's content blocks (for persistence + replay)
function extractTools(content) {
  if (typeof content === "string") {
    if (content.startsWith("[{")) {
      try {
        const blocks = JSON.parse(content);
        if (Array.isArray(blocks)) return extractTools(blocks);
      } catch {}
    }
    return [];
  }
  if (!Array.isArray(content)) return [];
  return content
    .filter(block => block.type === "tool_use" && block.name)
    .map(block => ({ name: block.name, summary: summarizeToolArgs(block.name, block.input) }));
}

// Get only the LAST text block (the final answer), not intermediate narration.
function extractFinalText(content) {
  if (typeof content === "string") {
    if (content.startsWith("[{")) {
      try {
        const blocks = JSON.parse(content);
        if (Array.isArray(blocks)) return extractFinalText(blocks);
      } catch {}
    }
    return content;
  }
  if (!Array.isArray(content)) return String(content);
  const texts = content.filter(b => b.type === "text" && b.text);
  return texts.length ? texts[texts.length - 1].text : "";
}

// Get intermediate text blocks (everything except the final one) as "notes"
function extractNoteTexts(content) {
  if (typeof content === "string") return [];
  if (!Array.isArray(content)) return [];
  const texts = content.filter(b => b.type === "text" && b.text).map(b => b.text);
  return texts.slice(0, -1);
}

/**
 * Collapse pi's raw session.messages (multiple assistant turns + toolResults)
 * into the flat user/assistant pairs the chat UI wants. Each user message gets
 * exactly one assistant reply containing: thinking from ALL assistant turns,
 * tool_use blocks from all turns, intermediate text blocks as "notes", and
 * only the FINAL text block as the visible answer.
 */
function collapseSessionMessages(rawMessages) {
  const out = [];
  let pending = null; // accumulator for assistant turns following a user message
  const flushPending = () => {
    if (pending) { out.push(pending); pending = null; }
  };
  for (const m of rawMessages) {
    if (m.role === "user") {
      flushPending();
      out.push({ role: "user", content: extractText(m.content), thinking: "", tools: [], notes: [] });
      pending = { role: "assistant", content: "", thinking: "", tools: [], notes: [] };
    } else if (m.role === "assistant") {
      if (!pending) pending = { role: "assistant", content: "", thinking: "", tools: [], notes: [] };
      const thinking = extractThinking(m.content);
      if (thinking) pending.thinking = pending.thinking ? `${pending.thinking}\n${thinking}` : thinking;
      pending.tools.push(...extractTools(m.content));
      pending.notes.push(...extractNoteTexts(m.content));
      const finalText = extractFinalText(m.content);
      // The most recent assistant turn's last text block is the running answer.
      if (finalText) pending.content = finalText;
    }
    // toolResult messages are dropped — their content is implied by the tool list.
  }
  flushPending();
  return out;
}

// Render a session as Markdown for export (user-readable, suitable for review).
function renderSessionMarkdown(session) {
  const lines = [];
  lines.push(`# ${session.name || session.id}`);
  lines.push("");
  for (const m of session.messages || []) {
    const role = m.role === "user" ? "You" : (m.role === "assistant" ? "DK Assistant" : m.role);
    if (m.role === "toolResult") continue; // never user-facing
    const body = typeof m.content === "string" ? m.content : extractText(m.content);
    if (!body || !body.trim()) continue;
    lines.push(`## ${role}`);
    lines.push("");
    lines.push(body.trim());
    if (m.role === "assistant" && Array.isArray(m.tools) && m.tools.length) {
      lines.push("");
      lines.push(`<sub>🔧 Activity: ${m.tools.map(t => t.summary ? `${t.name}(${t.summary})` : t.name).join(", ")}</sub>`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// Get just the first line of user-visible text from content (for session naming)
function extractShortText(content, maxLen = 50) {
  const text = extractText(content);
  const firstLine = text.split("\n")[0].trim();
  return firstLine.slice(0, maxLen);
}

function serveStatic(res, path) {
  try {
    const file = readFileSync(path);
    const ext = path.split(".").pop();
    const types = { html: "text/html", css: "text/css", js: "application/javascript", png: "image/png", svg: "image/svg+xml" };
    res.writeHead(200, { "Content-Type": types[ext] || "text/plain" });
    res.end(file);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

// ── Session file I/O ────────────────────────────────────────────────
function safeId(id) {
  return id.replace(/[<>:"/\\|?*]/g, "_");
}

function sessionFile(id) {
  return join(SESSIONS_DIR, `${safeId(id)}.json`);
}

// Each chat gets its own dir of pi JSONL files. pi's continueRecent() opens the
// most recent file in the dir, so a chat resumed after server restart still has
// the agent's full message history — not just our display-layer collapse.
function piSessionDir(id) {
  return join(PI_SESSIONS_ROOT, safeId(id));
}

function saveSession(id, messages, name) {
  writeFileSync(sessionFile(id), JSON.stringify({ name: name || "New conversation", messages }));
}

function loadSession(id) {
  const f = sessionFile(id);
  if (!existsSync(f)) return [];
  try {
    const data = JSON.parse(readFileSync(f, "utf-8"));
    // Backward-compat: old format was just an array of messages
    if (Array.isArray(data)) return data;
    return data.messages || [];
  } catch { return []; }
}

function loadSessionName(id) {
  const f = sessionFile(id);
  if (!existsSync(f)) return id.replace(/_/g, " ");
  try {
    const data = JSON.parse(readFileSync(f, "utf-8"));
    if (Array.isArray(data)) return id.replace(/_/g, " ");
    return data.name || id.replace(/_/g, " ");
  } catch { return id.replace(/_/g, " "); }
}

function deleteSessionFile(id) {
  const f = sessionFile(id);
  if (existsSync(f)) unlinkSync(f);
  const piDir = piSessionDir(id);
  if (existsSync(piDir)) {
    try { rmSync(piDir, { recursive: true, force: true }); } catch {}
  }
}

function listSessionFiles() {
  try {
    return readdirSync(SESSIONS_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const id = f.replace(".json", "");
        return {
          id,
          name: loadSessionName(id).slice(0, 40),
          path: id,
        };
      });
  } catch {
    return [];
  }
}

// ── Skills loader ───────────────────────────────────────────────────
const SKILLS_DIR = join(REPO_DIR, "plugin", "skills");

function loadSkillsFromDir() {
  if (!existsSync(SKILLS_DIR)) return [];
  try {
    return readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => {
        const mdPath = join(SKILLS_DIR, d.name, "SKILL.md");
        if (!existsSync(mdPath)) return null;
        const content = readFileSync(mdPath, "utf-8");
        const fm = content.match(/^---\n([\s\S]*?)\n---/);
        if (!fm) return null;
        return {
          name: fm[1].match(/name:\s*(.+)/)?.[1]?.trim() || d.name,
          description: fm[1].match(/description:\s*(.+)/)?.[1]?.trim() || "",
          filePath: mdPath,
          baseDir: join(SKILLS_DIR, d.name),
          source: "project",
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ── Create agent session ────────────────────────────────────────────
// Map<chatId, { session }> — one pi agent per chat, kept alive across turns
// so the agent retains its message history. Previously this was recreated on
// every /prompt request with SessionManager.inMemory(), which wiped context.
const activeSessions = new Map();

async function createAgent(chatId) {
  const customSkills = loadSkillsFromDir();

  const loader = new DefaultResourceLoader({
    cwd: REPO_DIR,
    agentDir: getAgentDir(),
    skillsOverride: (current) => ({
      skills: [...current.skills, ...customSkills],
      diagnostics: current.diagnostics,
    }),
  });
  await loader.reload();

  // pi's continueRecent() opens the most recent JSONL in the chat's dedicated
  // dir, or starts a new pi session if none exists. This is what gives us
  // restart-durable agent context: after a server restart, the next prompt on
  // an existing chat resumes the same pi session and the agent still knows
  // what was said before.
  const sessionManager = SessionManager.continueRecent(REPO_DIR, piSessionDir(chatId));

  const { session } = await createAgentSession({
    cwd: REPO_DIR,
    sessionManager,
    resourceLoader: loader,
    // Full file-editing toolset so bulk-change skills (sop-refresh,
    // update-vendor-info, add-new-vendor, regenerate-vendor-rollup) can
    // actually apply edits, not just plan them. Git tracks every change so
    // anything wrong is recoverable. pi's real tool names are read/edit/
    // write/bash — "grep"/"find"/"ls" aren't valid pi tools and were being
    // silently dropped, which is why the agent was de-facto read-only.
    tools: ["read", "edit", "write", "bash"],
  });
  return session;
}

async function getOrCreateAgent(chatId) {
  const cached = activeSessions.get(chatId);
  if (cached) return cached.session;
  const session = await createAgent(chatId);
  activeSessions.set(chatId, { session });
  return session;
}

// ── Server ──────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  // Static
  if (req.method === "GET" && path === "/") return serveStatic(res, join(PUBLIC_DIR, "index.html"));
  if (req.method === "GET" && /^\/[\w.\-]+\.(svg|png|jpg|jpeg|gif|ico|css|js|webp)$/i.test(path)) {
    return serveStatic(res, join(PUBLIC_DIR, path.slice(1)));
  }

  // List sessions
  if (req.method === "GET" && path === "/api/sessions") return json(res, listSessionFiles());

  // Create session
  if (req.method === "POST" && path === "/api/sessions") {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    saveSession(id, []);
    return json(res, { id, name: "New conversation" });
  }

  // Get messages
  if (req.method === "GET" && path.startsWith("/api/sessions/") && path.endsWith("/messages")) {
    const id = decodeURIComponent(path.split("/api/sessions/")[1].replace("/messages", ""));
    const name = loadSessionName(id);
    let msgs;
    if (activeSessions.has(id)) {
      msgs = collapseSessionMessages(activeSessions.get(id).session.messages);
    } else {
      msgs = (loadSession(id) || []).map((m) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : extractText(m.content),
        thinking: m.thinking || "",
        tools: m.tools || [],
        notes: m.notes || [],
      }));
    }
    return json(res, { name, messages: msgs });
  }

  // Delete session
  if (req.method === "DELETE" && path.startsWith("/api/sessions/")) {
    const id = decodeURIComponent(path.split("/api/sessions/")[1]);
    deleteSessionFile(id);
    if (activeSessions.has(id)) activeSessions.delete(id);
    return json(res, { ok: true });
  }

  // Rename session
  if (req.method === "PATCH" && path.startsWith("/api/sessions/")) {
    const id = decodeURIComponent(path.split("/api/sessions/")[1]);
    let body = "";
    for await (const chunk of req) body += chunk;
    let name;
    try { name = JSON.parse(body).name; } catch { return json(res, { error: "Invalid JSON" }, 400); }
    if (typeof name !== "string" || !name.trim()) return json(res, { error: "Missing name" }, 400);
    const f = sessionFile(id);
    if (!existsSync(f)) return json(res, { error: "Not found" }, 404);
    try {
      const data = JSON.parse(readFileSync(f, "utf-8"));
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      saveSession(id, msgs, name.trim().slice(0, 80));
      return json(res, { ok: true, name: name.trim().slice(0, 80) });
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  // List vendor names (for @-autocomplete). Cached at startup from per-vendor
  // folders; pass ?refresh=1 to rescan without restarting the server.
  if (req.method === "GET" && path === "/api/vendors") {
    if (url.searchParams.get("refresh") === "1") refreshVendorNames();
    return json(res, VENDOR_NAMES);
  }

  // ── Feedback ──────────────────────────────────────────────────────
  // Append a single feedback row to feedback.jsonl
  if (req.method === "POST" && path === "/api/feedback") {
    let body = "";
    for await (const chunk of req) body += chunk;
    let payload;
    try { payload = JSON.parse(body); } catch { return json(res, { error: "Invalid JSON" }, 400); }
    if (!payload || (payload.rating !== "up" && payload.rating !== "down")) {
      return json(res, { error: "rating must be 'up' or 'down'" }, 400);
    }
    const row = {
      timestamp: new Date().toISOString(),
      sessionId: typeof payload.sessionId === "string" ? payload.sessionId : null,
      sessionName: typeof payload.sessionName === "string" ? payload.sessionName.slice(0, 120) : null,
      messageIndex: Number.isInteger(payload.messageIndex) ? payload.messageIndex : null,
      rating: payload.rating,
      note: typeof payload.note === "string" ? payload.note.slice(0, 1000) : "",
      question: typeof payload.question === "string" ? payload.question.slice(0, 1000) : "",
      answer: typeof payload.answer === "string" ? payload.answer.slice(0, 4000) : "",
    };
    try {
      mkdirSync(dirname(FEEDBACK_FILE), { recursive: true });
      appendFileSync(FEEDBACK_FILE, JSON.stringify(row) + "\n");
      return json(res, { ok: true });
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  // ── Export ────────────────────────────────────────────────────────
  // Bulk export of all chats. ?format=md (default) for human review, ?format=json for analysis.
  if (req.method === "GET" && path === "/api/sessions/export/all") {
    const format = (url.searchParams.get("format") || "md").toLowerCase();
    const stamp = new Date().toISOString().slice(0, 10);
    const sessions = listSessionFiles().map(s => ({
      id: s.id,
      name: s.name,
      messages: loadSession(s.id) || [],
    }));
    if (format === "json") {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="dk-chats-${stamp}.json"`,
      });
      return res.end(JSON.stringify({ exportedAt: new Date().toISOString(), count: sessions.length, sessions }, null, 2));
    }
    // markdown bundle
    const parts = [`# DK Order Processing — Chat Export\n\n_Exported: ${new Date().toISOString()} · ${sessions.length} conversations_\n`];
    for (const s of sessions) parts.push(renderSessionMarkdown(s));
    res.writeHead(200, {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="dk-chats-${stamp}.md"`,
    });
    return res.end(parts.join("\n---\n\n"));
  }

  // Single chat export
  if (req.method === "GET" && path.startsWith("/api/sessions/") && path.endsWith("/export")) {
    const id = decodeURIComponent(path.split("/api/sessions/")[1].replace("/export", ""));
    const f = sessionFile(id);
    if (!existsSync(f)) return json(res, { error: "Not found" }, 404);
    const name = loadSessionName(id);
    const messages = loadSession(id) || [];
    const md = renderSessionMarkdown({ id, name, messages });
    const safeName = name.replace(/[^a-z0-9\-_ ]/gi, "_").slice(0, 60).trim() || id;
    res.writeHead(200, {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeName}.md"`,
    });
    return res.end(md);
  }

  // Send prompt (SSE stream)
  if (req.method === "POST" && path.startsWith("/api/sessions/") && path.endsWith("/prompt")) {
    const sessionId = decodeURIComponent(path.split("/api/sessions/")[1].replace("/prompt", ""));

    let body = "";
    for await (const chunk of req) body += chunk;
    let prompt;
    try { prompt = JSON.parse(body).prompt; } catch { return json(res, { error: "Invalid JSON" }, 400); }
    if (!prompt) return json(res, { error: "Missing prompt" }, 400);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    try {
      const session = await getOrCreateAgent(sessionId);

      let thinkingDone = false;
      const unsub = session.subscribe((event) => {
        if (event.type === "message_update") {
          const me = event.assistantMessageEvent;
          if (me.type === "text_delta") {
            if (!thinkingDone) {
              res.write(`data: ${JSON.stringify({ type: "thinking_done" })}\n\n`);
              thinkingDone = true;
            }
            res.write(`data: ${JSON.stringify({ type: "text", delta: me.delta })}\n\n`);
          } else if (me.type === "thinking_delta") {
            res.write(`data: ${JSON.stringify({ type: "thinking", delta: me.delta })}\n\n`);
          }
        } else if (event.type === "tool_execution_start") {
          res.write(`data: ${JSON.stringify({
            type: "tool_start",
            tool: event.toolName,
            summary: summarizeToolArgs(event.toolName, event.args),
          })}\n\n`);
        } else if (event.type === "tool_execution_end") {
          res.write(`data: ${JSON.stringify({ type: "tool_end", tool: event.toolName, isError: !!event.isError })}\n\n`);
        } else if (event.type === "agent_end") {
          const msgs = collapseSessionMessages(session.messages);
          // Auto-name from first user message if not already named
          const firstName = loadSessionName(sessionId);
          const firstUserMsg = msgs.find(m => m.role === "user");
          const autoName = (firstUserMsg && firstName === "New conversation")
            ? extractShortText(firstUserMsg.content, 45)
            : firstName;
          saveSession(sessionId, msgs, autoName);
          res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
        }
      });

      await session.prompt(prompt);
      unsub();
    } catch (e) {
      console.error("Prompt error:", e.message);
      res.write(`data: ${JSON.stringify({ type: "error", error: e.message })}\n\n`);
    }
    res.end();
    return;
  }

  // ── File browser ──────────────────────────────────────────────────
  const EXCLUDE_ROOT = new Set([
    "node_modules", "_source_docx", "orignal files", "server",
    "package.json", "package-lock.json", ".git", ".gitignore",
  ]);

  // List directory
  if (req.method === "GET" && path === "/api/files") {
    const dir = url.searchParams.get("path") || "";
    const fullPath = join(REPO_DIR, dir);
    if (!fullPath.startsWith(REPO_DIR)) return json(res, { error: "Invalid path" }, 403);
    if (!existsSync(fullPath)) return json(res, { error: "Not found" }, 404);
    try {
      const entries = readdirSync(fullPath, { withFileTypes: true });
      const result = entries
        .filter(e => {
          if (e.name.startsWith(".")) return false;
          if (dir === "" && EXCLUDE_ROOT.has(e.name)) return false;
          return true;
        })
        .map(e => ({
          name: e.name,
          type: e.isDirectory() ? "dir" : "file",
          path: dir ? `${dir}/${e.name}` : e.name,
        }))
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      return json(res, result);
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  // Read file
  if (req.method === "GET" && path === "/api/file") {
    const filePath = url.searchParams.get("path") || "";
    const fullPath = join(REPO_DIR, filePath);
    if (!fullPath.startsWith(REPO_DIR)) return json(res, { error: "Invalid path" }, 403);
    if (!existsSync(fullPath)) return json(res, { error: "Not found" }, 404);
    const st = statSync(fullPath);
    if (st.isDirectory()) return json(res, { error: "Path is a directory" }, 400);
    try {
      const content = readFileSync(fullPath, "utf-8");
      const ext = filePath.split(".").pop().toLowerCase();
      return json(res, { path: filePath, content, type: ext });
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  const addr = server.address();
  const actualPort = addr.port;
  const url = `http://localhost:${actualPort}`;
  console.log(`\n🚀 DK Hardware Order Processing ready!`);
  console.log(`   ===> Open ${url} in your browser <===\n`);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    process.exit(1);
  }
  throw e;
});
