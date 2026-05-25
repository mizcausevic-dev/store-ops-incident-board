import fs from "node:fs";
import path from "node:path";

import {
  incidentLane,
  payload,
  recoveryPosture,
  slaRisksLane,
  summary,
  verification
} from "../src/services/storeOpsIncidentBoardService";
import {
  renderDocs,
  renderIncidentLane,
  renderOverview,
  renderRecoveryPosture,
  renderSlaRisks,
  renderVerification
} from "../src/services/render";

const outputDir = path.resolve(__dirname, "..", "site");
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(path.join(outputDir, "api"), { recursive: true });
fs.copyFileSync(path.resolve(__dirname, "..", "CNAME"), path.join(outputDir, "CNAME"));

const pages: Record<string, string> = {
  "index.html": renderOverview(),
  "incident-lane.html": renderIncidentLane(),
  "sla-risks.html": renderSlaRisks(),
  "recovery-posture.html": renderRecoveryPosture(),
  "verification.html": renderVerification(),
  "docs.html": renderDocs()
};

const rewrites: Array<[string, string]> = [
  ['href="/incident-lane"', 'href="incident-lane.html"'],
  ['href="/sla-risks"', 'href="sla-risks.html"'],
  ['href="/recovery-posture"', 'href="recovery-posture.html"'],
  ['href="/verification"', 'href="verification.html"'],
  ['href="/docs"', 'href="docs.html"']
];

for (const [filename, html] of Object.entries(pages)) {
  let content = html;
  for (const [from, to] of rewrites) {
    content = content.replaceAll(from, to);
  }
  fs.writeFileSync(path.join(outputDir, filename), content, "utf8");
}

const apiPayloads: Record<string, unknown> = {
  "api/dashboard/summary.json": summary(),
  "api/incident-lane.json": incidentLane(),
  "api/sla-risks.json": slaRisksLane(),
  "api/recovery-posture.json": recoveryPosture(),
  "api/verification.json": verification(),
  "api/sample.json": payload()
};

for (const [filename, data] of Object.entries(apiPayloads)) {
  fs.mkdirSync(path.dirname(path.join(outputDir, filename)), { recursive: true });
  fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(data, null, 2), "utf8");
}
