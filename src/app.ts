// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";

import {
  incidentLane,
  payload,
  recoveryPosture,
  slaRisksLane,
  summary,
  verification
} from "./services/storeOpsIncidentBoardService";
import {
  renderDocs,
  renderIncidentLane,
  renderOverview,
  renderRecoveryPosture,
  renderSlaRisks,
  renderVerification
} from "./services/render";

const app = express();
const port = Number(process.env.PORT ?? 5584);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/incident-lane", (_req, res) => res.type("html").send(renderIncidentLane()));
app.get("/sla-risks", (_req, res) => res.type("html").send(renderSlaRisks()));
app.get("/recovery-posture", (_req, res) => res.type("html").send(renderRecoveryPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/incident-lane", (_req, res) => res.json(incidentLane()));
app.get("/api/sla-risks", (_req, res) => res.json(slaRisksLane()));
app.get("/api/recovery-posture", (_req, res) => res.json(recoveryPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`Store Ops Incident Board listening on http://${host}:${port}`);
  });
}

export default app;
