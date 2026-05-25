import {
  recoveryPackets,
  slaRisks,
  storeIncidents
} from "../data/sampleStoreIncidents";

export function summary() {
  return {
    incidents: storeIncidents.length,
    urgentIncidents: storeIncidents.filter((item) => item.severity === "red").length,
    blockedRecoveries: slaRisks.filter((item) => item.readiness !== "green").length,
    fragilePackets: recoveryPackets.filter((item) => item.status !== "green").length,
    recommendation:
      "Clear recovery proof, ETA parity, and staffing-to-demand drift first so store operations posture stays safe before the next guest promise or promo window burns."
  };
}

export function incidentLane() {
  return storeIncidents;
}

export function slaRisksLane() {
  return slaRisks;
}

export function recoveryPosture() {
  return recoveryPackets;
}

export function verification() {
  return [
    "Store incidents map to concrete guest promise, staffing, dispatch, and franchise workflows instead of staying trapped in fragmented ops notes.",
    "SLA blockers surface the exact evidence required before recovery posture becomes unsafe for guests, marketplaces, or store operators.",
    "Recovery posture ties incidents to owner routing, review timing, and reopen-safe decision packets.",
    "The surface is buyer-readable and safe for embedded analytics tie-back across multi-location store operations.",
    "Synthetic data only; no real store, customer, employee, or franchise records are included."
  ];
}

export function payload() {
  return {
    summary: summary(),
    storeIncidents: incidentLane(),
    slaRisks: slaRisksLane(),
    recoveryPackets: recoveryPosture(),
    verification: verification()
  };
}
