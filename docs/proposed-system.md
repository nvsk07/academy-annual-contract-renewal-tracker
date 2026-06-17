# Proposed System

This document outlines the design structure, modules, actors, and workflows of the **Oxygen Sports Academy Annual Contract Renewal Tracker**.

---

## 1. System Overview
The tracker is a secure single-page web application linked directly to a Google Firestore cloud database. It automates contract expiry calculation, tracks equipment categories and price revisions, restricts portfolio access by RM, and records edit histories.

---

## 2. Key Modules
1. **Authentication Module:** Manages secure login sessions and determines user role (Admin vs RM).
2. **Dashboard Module:** Displays high-level counters (Total Contracts, Expiring, Active) and lists items requiring immediate attention.
3. **Contract CRUD Module:** Handles creating, editing, and archiving contracts. Admin can edit all; RMs can only create and edit their assigned contracts.
4. **Alerts Center Module:** Aggregates time-sensitive records based on urgency thresholds:
   * **Healthy:** 90+ days remaining (Green)
   * **Attention:** 30-90 days remaining (Yellow)
   * **High Risk:** 7-30 days remaining (Orange)
   * **Critical:** Less than 7 days remaining (Red)
   * **Expired:** Past contract end date (Slate)
5. **Reports Module:** Displays data tables mapped by status and relationship manager, and supports live CSV downloads.
6. **User Management Module (Admin-Only):** Admin can create, modify, and activate/deactivate RM accounts.
7. **Audit Log Module:** Automatically records activities to timeline widgets for transparency.

---

## 3. User Roles (Actors)
* **Administrator:** Complete access to system metrics, users, rules, and all contracts. Can delete contracts.
* **Relationship Manager (RM):** Can only view, create, edit, and manage status logs on contracts assigned to their specific employee ID. Accessing admin-only modules is blocked.

---

## 4. Expected System Workflow

```
[User Login] ──> [Role Check]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
     [Admin]                  [RM]
  • View All Contracts     • View Assigned Contracts Only
  • Add/Toggle RMs         • Update Own Contract Status
  • Full CRUD Actions      • Log Logistics Notes
  • Download All CSVs      • Export Portfolio CSV
```
