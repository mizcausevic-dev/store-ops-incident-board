import { describe, expect, test } from "vitest";

import {
  renderDocs,
  renderIncidentLane,
  renderOverview,
  renderRecoveryPosture,
  renderSlaRisks,
  renderVerification
} from "./render";
import {
  recoveryPackets,
  slaRisks,
  storeIncidents
} from "../data/sampleStoreIncidents";

const renderers = [
  ["overview", renderOverview],
  ["incident-lane", renderIncidentLane],
  ["sla-risks", renderSlaRisks],
  ["recovery-posture", renderRecoveryPosture],
  ["verification", renderVerification],
  ["docs", renderDocs]
] as const;

describe("render", () => {
  test.each(renderers)("%s produces a full HTML document with nav", (_label, fn) => {
    const html = fn();
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain("</html>");
    expect(html).toContain("Store Ops Incident Board");
    expect(html).toContain('href="/incident-lane"');
    expect(html).toContain('href="/docs"');
  });

  test("incident lane lists every case with a severity tag", () => {
    const html = renderIncidentLane();
    for (const incident of storeIncidents) {
      expect(html).toContain(incident.incidentId);
    }
    expect(html).toContain('class="st needs"');
  });

  test("sla risks list every blocker with readiness tags", () => {
    const html = renderSlaRisks();
    for (const block of slaRisks) {
      expect(html).toContain(block.riskId);
    }
    expect(html).toContain('class="bad"');
    expect(html).toContain("Guest promise reliability");
  });

  test("recovery posture shows packets and confidence scores", () => {
    const html = renderRecoveryPosture();
    for (const packet of recoveryPackets) {
      expect(html).toContain(packet.packetId);
      expect(html).toContain(String(packet.confidenceScore));
    }
  });

  test("verification renders proof statements", () => {
    const html = renderVerification();
    expect(html).toContain("Verification");
  });

  test("docs page enumerates the route surface", () => {
    const html = renderDocs();
    expect(html).toContain("/sla-risks");
    expect(html).toContain("/recovery-posture");
  });
});
