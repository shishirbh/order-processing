import { buildKnowledgeArtifacts } from "../scripts/vendor-kb.mjs";

const objectSchema = (properties, required = []) => ({ type: "object", properties, required, additionalProperties: false });
const stringProperty = description => ({ type: "string", description });

function result(value, isError = false) {
  return {
    content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
    details: {},
    isError,
  };
}

function tool(definition) {
  return {
    ...definition,
    execute: async (_toolCallId, parameters) => {
      try { return await definition.run(parameters); }
      catch (error) { return result({ error: error.message }, true); }
    },
  };
}

function generatedChanges(documents, vendorConfig) {
  return [...buildKnowledgeArtifacts(documents, vendorConfig)].map(([path, content]) => ({ path, content, action: "regenerate" }));
}

export function createKnowledgeTools({ store, role, actor, vendorConfig }) {
  const tools = [
    tool({
      name: "knowledge_list",
      label: "List knowledge documents",
      description: "List allowlisted Knowledge Documents. The optional directory may be Vendors, a vendor folder, or _shared_sops. Cannot inspect server, account, credential, environment, or operating-system files.",
      parameters: objectSchema({ directory: { ...stringProperty("Allowlisted directory; omit for all Knowledge Documents"), default: "" } }),
      async run({ directory = "" }) { return result({ documents: store.list(directory) }); },
    }),
    tool({
      name: "knowledge_read",
      label: "Read knowledge document",
      description: "Read an allowlisted Knowledge Document and return its active version for citation. Paths are confined to governed vendor and SOP content.",
      parameters: objectSchema({
        path: stringProperty("Relative Knowledge Document path"),
        offset: { type: "integer", minimum: 1, default: 1, description: "First line to return, 1-indexed" },
        limit: { type: "integer", minimum: 1, maximum: 1000, default: 300, description: "Maximum lines to return" },
      }, ["path"]),
      async run({ path, offset = 1, limit = 300 }) {
        const document = store.read(path);
        const lines = document.content.split(/\r?\n/);
        return result({ path: document.path, version: document.version, source: document.source, offset, totalLines: lines.length, content: lines.slice(offset - 1, offset - 1 + limit).join("\n") });
      },
    }),
  ];

  if (role !== "administrator") return tools;

  tools.push(
    tool({
      name: "knowledge_publish",
      label: "Publish knowledge document",
      description: "Publish a new immutable version of an allowlisted source Knowledge Document. Generated vendor rollups, index, and completeness report are rebuilt and published atomically. General filesystem writes are impossible.",
      parameters: objectSchema({
        path: stringProperty("Relative source Knowledge Document path"),
        content: stringProperty("Complete new document content"),
        expectedVersion: stringProperty("Version returned by knowledge_read; use 'new' only when creating a document"),
      }, ["path", "content", "expectedVersion"]),
      async run({ path, content, expectedVersion }) {
        if (!store.isPublishable(path)) throw new Error("This document is generated or not publishable");
        const proposed = store.documents();
        proposed.set(path, content);
        const generated = generatedChanges(proposed, vendorConfig);
        const events = store.publishBatch([{ path, content, expectedVersion, action: "publish" }, ...generated], { actor, action: "publish" });
        const report = JSON.parse(generated.find(change => change.path === "reports/vendor-completeness.json").content);
        return result({ published: path, version: events[0].version, regenerated: generated.map(change => change.path), validation: report.counts, anomalies: report.anomalies });
      },
    }),
    tool({
      name: "knowledge_history",
      label: "Knowledge document history",
      description: "List immutable published versions of an allowlisted Knowledge Document.",
      parameters: objectSchema({ path: stringProperty("Relative Knowledge Document path") }, ["path"]),
      async run({ path }) { return result(store.history(path)); },
    }),
    tool({
      name: "knowledge_rollback",
      label: "Roll back knowledge document",
      description: "Publish a rollback using content from an earlier immutable version. Generated vendor rollups, index, and completeness report are rebuilt atomically.",
      parameters: objectSchema({
        path: stringProperty("Relative source Knowledge Document path"),
        version: stringProperty("Historical version to restore"),
        expectedVersion: stringProperty("Currently active version; prevents overwriting concurrent changes"),
      }, ["path", "version", "expectedVersion"]),
      async run({ path, version, expectedVersion }) {
        if (!store.isPublishable(path)) throw new Error("This document is generated or not publishable");
        const content = store.contentAtVersion(path, version);
        const proposed = store.documents();
        proposed.set(path, content);
        const generated = generatedChanges(proposed, vendorConfig);
        const events = store.publishBatch([{ path, content, expectedVersion, action: `rollback:${version}` }, ...generated], { actor, action: "rollback" });
        return result({ rolledBack: path, restoredFrom: version, activeVersion: events[0].version, regenerated: generated.map(change => change.path) });
      },
    }),
  );
  return tools;
}
