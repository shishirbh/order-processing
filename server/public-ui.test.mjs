import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Function not found: ${name}`);
  const brace = source.indexOf("{", start);
  let depth = 0;
  for (let index = brace; index < source.length; index++) {
    if (source[index] === "{") depth++;
    else if (source[index] === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Unclosed function: ${name}`);
}

test("responsive changelog becomes a drawer below the topbar before it can cover account controls", () => {
  const html = readFileSync(new URL("./public/index.html", import.meta.url), "utf8");
  assert.match(html, /@media \(max-width: 1600px\) \{\s*\.changelog-panel \{\s*position: fixed;\s*top: 52px;\s*right: 0;\s*bottom: 0;/);
});

test("renaming a Conversation sends the new name after replacing the label with an input", async () => {
  const html = readFileSync(new URL("./public/index.html", import.meta.url), "utf8");
  const source = extractFunction(html, "startRename");
  const requests = [];
  let createdInput;
  const parent = {
    replaceChild(next, previous) {
      if (previous) previous.parentNode = null;
      next.parentNode = this;
    },
  };
  const nameElement = { textContent: "New conversation", parentNode: parent };
  const document = {
    createElement() {
      const listeners = {};
      createdInput = {
        parentNode: null,
        addEventListener(type, handler) { listeners[type] = handler; },
        focus() {},
        select() {},
        dispatch(type, event) { return listeners[type]?.(event); },
      };
      return createdInput;
    },
    getElementById() { return { textContent: "" }; },
  };
  const context = {
    document,
    API: "/api",
    activeSessionId: null,
    fetchJSON: async (url, options) => { requests.push({ url, options }); },
    loadSessions: async () => {},
    showToast: () => {},
    encodeURIComponent,
  };
  vm.runInNewContext(`${source}; globalThis.startRename = startRename;`, context);
  context.startRename("conversation-1", nameElement);
  createdInput.value = "Business UAT";
  await createdInput.dispatch("keydown", { key: "Enter", stopPropagation() {}, preventDefault() {} });
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "/api/sessions/conversation-1");
  assert.deepEqual(JSON.parse(requests[0].options.body), { name: "Business UAT" });
});
