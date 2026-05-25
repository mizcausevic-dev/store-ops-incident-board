import { payload, summary } from "../src/services/storeOpsIncidentBoardService";

console.log("store-ops-incident-board demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(JSON.stringify(payload().slaRisks, null, 2));
