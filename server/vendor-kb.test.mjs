import test from "node:test";
import assert from "node:assert/strict";
import { buildKnowledgeArtifacts, parseVendorInfo } from "../scripts/vendor-kb.mjs";

const columnsExpected = {
  Vendor: "Acme",
  "Vendor Contact": "Sam",
  "Contact Info": null,
  "Phone Number": null,
  "Can CS contact vendor directly?": null,
  "Can Sales contact Vendor?": null,
  "If not, DK point of contact": null,
  "Can we dropship?": "Yes",
  "Ships Under our account": null,
  "Ships Expedited?": null,
  "When is a PO submitted?": null,
  "When do we receive Coming In House Shipments?": null,
};

test("vendor parser supports table and scaffold formats", () => {
  const table = "# Acme — Vendor Info\n\n| Field | Value |\n| --- | --- |\n| Vendor | Acme |\n| Vendor Contact | Sam |\n| Can we dropship? | Yes |\n";
  assert.deepEqual(parseVendorInfo(table, "Acme"), columnsExpected);
  const scaffold = "# Acme — Vendor Info\n- **Primary contact:** Sam\n- **Can we dropship?** Yes (Updated: 2026-05-01)\n";
  assert.deepEqual(parseVendorInfo(scaffold, "Acme"), columnsExpected);
});

test("artifact generation is deterministic and classifies known gaps and issue stubs", () => {
  const documents = new Map([
    ["Vendors/Acme/Acme - Vendor Info.md", "# Acme — Vendor Info\n\n## Aliases / sub-brands\n- A Co\n"],
    ["Vendors/Acme/Acme - Issue Resolution Notes.md", "_(to be filled)_\n"],
    ["Vendors/Acme/Acme Process Document.md", "# Process\n"],
    ["Vendors/Known Gap/Known Gap Process Document.md", "# Process\n"],
  ]);
  const config = { exceptions: { "Known Gap": { classification: "known_incomplete", reason: "Pending source" } }, variants: [], canonicalNames: {} };
  const first = buildKnowledgeArtifacts(documents, config);
  const second = buildKnowledgeArtifacts(documents, config);
  assert.deepEqual([...first], [...second]);
  const report = JSON.parse(first.get("reports/vendor-completeness.json"));
  assert.deepEqual(report.counts, { vendorFolders: 2, vendorInfoFiles: 1, issueResolutionFiles: 1, issueResolutionStubs: 1 });
  assert.equal(report.anomalies.filter(item => item.classification === "known_incomplete").length, 2);
  assert.match(first.get("INDEX.md"), /A Co/);
});
