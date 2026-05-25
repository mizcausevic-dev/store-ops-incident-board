# Architecture

## Intent

Store Ops Incident Board models the operator layer between store-side incidents and guest-facing restaurant recovery channels. The goal is to show where recovery proof, ETA drift, staffing mismatch, and inventory parity break trust before the next guest promise window burns.

## Control surfaces

- `src/app.ts`
  - Express routes for overview, incident lanes, verification, docs, and JSON APIs
- `src/services/storeOpsIncidentBoardService.ts`
  - summary metrics, incident lane, SLA risk lane, recovery posture, verification payload
- `src/services/render.ts`
  - BERT-style render shell with store-ops operator framing
- `src/data/sampleStoreIncidents.ts`
  - synthetic incident cases, SLA blockers, and recovery packets

## Route model

- `/`
  - overview and operator recommendation
- `/incident-lane`
  - active store incidents tied to region, store, owner, and next action
- `/sla-risks`
  - blocker catalog with required proof and impact area
- `/recovery-posture`
  - reopen-facing packet confidence and review windows
- `/verification`
  - proof statements and KG Embedded fit
- `/docs`
  - route map and control-surface summary

## Packaging

- prerendered static export in `site/`
- custom domain through `CNAME`
- README proof images generated into top-level `screenshots/`
- GitHub Pages deploy workflow on `main`
