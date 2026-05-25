# Changelog

## v1.0.0-prod — 2026-05-25

- Platform/SRE hardening pass (Claude Code lane): deploy-time SEO assets (robots.txt + sitemap.xml + OG/Twitter/meta injection), static `/api/health.json` operability endpoint, and Contributor Covenant code of conduct.
- Verified production gates: Node 20/22 CI matrix (lint, typecheck, coverage, build, demo, smoke, `npm audit`), coverage gate on `src/services`, AGPL-3.0-or-later, Dependabot, SECURITY.md.
- Deployed to GitHub Pages at `stores.kineticgain.com` (TLS).

## v0.1-shipped

- ship Store Ops Incident Board as a Food / Restaurant Tech operator surface
- model store incidents, SLA blockers, and recovery posture for restaurant operations and reopen timing
- add BERT-style operator shell, verification lane, prerender pipeline, and GitHub Pages packaging
- include KG Embedded tie-back docs, screenshots, CI, coverage, and release-ready repo scaffolding
