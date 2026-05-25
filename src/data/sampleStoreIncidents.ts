export type RiskState = "red" | "yellow" | "green";

export type StoreIncident = {
  incidentId: string;
  brand: string;
  region: string;
  store: string;
  incidentType: string;
  excerpt: string;
  owner: string;
  nextAction: string;
  severity: RiskState;
};

export type SlaRisk = {
  riskId: string;
  blocker: string;
  source: string;
  impactArea: string;
  requiredEvidence: string;
  owner: string;
  readiness: RiskState;
  note: string;
};

export type RecoveryPacket = {
  packetId: string;
  audience: string;
  confidenceScore: number;
  reviewWindowHours: number;
  blocker: string;
  status: RiskState;
  decisionNote: string;
};

export const storeIncidents: StoreIncident[] = [
  {
    incidentId: "INC-711",
    brand: "North Dock Kitchen",
    region: "Boston",
    store: "Seaport flagship",
    incidentType: "POS outage",
    excerpt:
      "The in-store register cluster recovered, but order handoff reconciliation is still lagging across pickup and third-party dispatch queues.",
    owner: "Store systems lead",
    nextAction:
      "Reconcile POS event logs against pickup and dispatch queues before the dinner spike reopens auto-accept.",
    severity: "red"
  },
  {
    incidentId: "INC-712",
    brand: "Metro Slice Collective",
    region: "Chicago",
    store: "West Loop",
    incidentType: "Staffing shortfall",
    excerpt:
      "A callout and prep backlog pushed the kitchen beyond promised ticket times, and the recovery script has not yet propagated to marketplace ETAs.",
    owner: "Area operations manager",
    nextAction:
      "Apply the staffing recovery plan, throttle demand, and republish ETA posture before late-night promo traffic starts.",
    severity: "red"
  },
  {
    incidentId: "INC-713",
    brand: "Sunset Bento Labs",
    region: "Seattle",
    store: "Capitol Hill",
    incidentType: "Printer and expo sync drift",
    excerpt:
      "Kitchen printers resumed, but expo routing still shows one stale prep station, leaving handoff timing uncertain for bundled orders.",
    owner: "Shift operations captain",
    nextAction:
      "Confirm station routing parity and validate the next fifteen bundled orders against the fallback workflow.",
    severity: "yellow"
  },
  {
    incidentId: "INC-714",
    brand: "Garden Table Express",
    region: "Austin",
    store: "South Congress",
    incidentType: "Inventory mismatch",
    excerpt:
      "Store counts are healthy again, but delivery promise windows still reflect the earlier outage because the recovery packet is waiting on inventory proof.",
    owner: "Franchise support lead",
    nextAction:
      "Attach the corrected inventory snapshot and reopen dispatch promises only after the store and channel windows match.",
    severity: "yellow"
  }
];

export const slaRisks: SlaRisk[] = [
  {
    riskId: "SR-31",
    blocker: "Store recovery has not cleared channel ETA posture",
    source: "Dispatch recovery lane",
    impactArea: "Guest promise reliability",
    requiredEvidence:
      "POS recovery log, dispatch queue reconciliation, and republished promise window confirmation.",
    owner: "Store systems lead",
    readiness: "red",
    note:
      "Do not restore full demand until store-side recovery and customer-facing promise windows agree."
  },
  {
    riskId: "SR-32",
    blocker: "Staffing recovery plan not reflected in demand throttle",
    source: "Labor and capacity lane",
    impactArea: "Marketplace SLA",
    requiredEvidence:
      "Recovery staffing roster, demand throttle snapshot, and ETA republish receipt.",
    owner: "Area operations manager",
    readiness: "red",
    note:
      "Ticket-time pressure becomes unsafe when labor recovery and marketplace pacing remain disconnected."
  },
  {
    riskId: "SR-33",
    blocker: "Expo routing parity still partially stale",
    source: "Kitchen orchestration lane",
    impactArea: "Order handoff confidence",
    requiredEvidence:
      "Updated station map, print-route validation, and bundled-order handoff sample.",
    owner: "Shift operations captain",
    readiness: "yellow",
    note:
      "The workflow is recoverable, but only if routing parity holds through the next bundled-order cycle."
  },
  {
    riskId: "SR-34",
    blocker: "Inventory recovery proof missing from dispatch packet",
    source: "Franchise support lane",
    impactArea: "Delivery window trust",
    requiredEvidence:
      "Corrected inventory snapshot, dispatch-window parity check, and franchise sign-off.",
    owner: "Franchise support lead",
    readiness: "yellow",
    note:
      "Delivery trust erodes when store inventory posture recovers faster than customer-facing promise windows."
  }
];

export const recoveryPackets: RecoveryPacket[] = [
  {
    packetId: "PK-41",
    audience: "Store recovery desk",
    confidenceScore: 54,
    reviewWindowHours: 6,
    blocker: "POS and dispatch parity still red",
    status: "red",
    decisionNote:
      "Hold the recovery packet until store and dispatch evidence align on the same reopen posture."
  },
  {
    packetId: "PK-42",
    audience: "Marketplace launch reviewer",
    confidenceScore: 63,
    reviewWindowHours: 10,
    blocker: "Demand throttle not yet republished",
    status: "yellow",
    decisionNote:
      "Stage the packet, but do not restore promotional demand until ETA and labor posture stabilize together."
  },
  {
    packetId: "PK-43",
    audience: "Kitchen ops leadership",
    confidenceScore: 79,
    reviewWindowHours: 18,
    blocker: "Expo routing verification pending",
    status: "yellow",
    decisionNote:
      "Recovery remains viable if handoff timing stays clean through the next bundled-order sample."
  },
  {
    packetId: "PK-44",
    audience: "Franchise support command",
    confidenceScore: 90,
    reviewWindowHours: 24,
    blocker: "Inventory proof awaiting final attachment",
    status: "green",
    decisionNote:
      "The packet is healthy as long as the corrected inventory evidence stays bundled with dispatch-window parity."
  }
];
