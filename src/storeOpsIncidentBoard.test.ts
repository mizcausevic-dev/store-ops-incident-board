import { describe, expect, test } from "vitest";

import {
  incidentLane,
  recoveryPosture,
  slaRisksLane,
  summary,
  verification
} from "./services/storeOpsIncidentBoardService";

describe("store-ops-incident-board", () => {
  test("returns a store-recovery recommendation", () => {
    expect(summary().recommendation).toMatch(/recovery|eta|staffing|store|promo/i);
  });

  test("maps incident cases and sla blockers", () => {
    expect(incidentLane().length).toBeGreaterThan(2);
    expect(slaRisksLane().some((risk) => risk.readiness === "red")).toBe(true);
  });

  test("recovery posture stays buyer-readable", () => {
    expect(recoveryPosture().every((packet) => packet.audience.length > 0)).toBe(true);
    expect(verification().some((item) => item.toLowerCase().includes("synthetic"))).toBe(true);
  });
});
