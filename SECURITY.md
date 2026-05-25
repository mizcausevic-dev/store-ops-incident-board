# Security

## Reporting

Report security issues through GitHub Security Advisories or by opening a private report with the maintainer.

## Scope

This repository contains synthetic data only. It models store incidents, SLA blockers, and recovery posture using fake restaurant-operations scenarios. No real store, customer, employee, or franchise records are included.

## Embedded posture

If this primitive is extended into a production product:

- keep operational evidence read-safe by default
- separate analytics views from direct mutation paths
- review dispatch authenticity, recoverability workflows, and reopen controls
- ensure tenant and environment boundaries are explicit before exposing store or guest-promise posture in-product
