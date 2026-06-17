# Existing System Analysis

This document outlines the current workflow constraints at Oxygen Sports and analyzes why transition to a digital dashboard is critical.

---

## 1. Description of the Current Manual Process
Oxygen Sports coordinates hundreds of annual supply contracts with sports academies for bats, balls, jerseys, and field markers. At present, these contracts are coordinated through:
1. **Paper Registers & Folders:** Signed contracts are stored in physical file cabinets.
2. **Spreadsheets (Google Sheets / Excel):** RMs write contract metadata (value, date, RM) into standalone files.
3. **WhatsApp / Phone Follow-ups:** Expiration dates are checked manually, and communication about renewals is handled on a personal basis by individual RMs.

---

## 2. Technical Limitations & Security Gaps

### Google Sheets / Excel Limitations:
* **No Access Control (RBAC):** Spreadsheets are typically shared via link. Any employee can view or modify all rows. An RM can see other departments' contracts, violating data confidentiality.
* **Data Mutation Errors:** Columns are easily deleted or modified by mistake, leading to corrupt records. Dates are written in inconsistent text formats.
* **No Alerts:** Spreadsheets cannot send real-time browser alerts when a contract enters critical margins. Employees must actively check the spreadsheet.
* **No Audit Trail:** There is no logging mechanism to track who modified a price revision, created a contract, or changed a contract's status.

### Manual Business Consequences:
* **Contract Leakage:** High-value academy contracts expire without notification. Competitors step in, causing loss of high-value business.
* **Price Revision Delays:** Renegotiating equipment supply pricing without tracking past revision percentages leads to inconsistent profit margins.

---

## 3. Why Oxygen Sports Needs the Tracker Platform

| Feature | Manual Process | Proposed Digital Platform |
| :--- | :--- | :--- |
| **Security (RBAC)** | None (Public spreadsheet link) | Secure login (Admin vs restricted RM view) |
| **Urgency Visibility** | Manual date math | Color-coded health badges and countdowns |
| **Audit Compliance** | None (Untracked edits) | Read-only timeline of updates (Audit Logs) |
| **Data Validity** | Free-form text inputs | Strictly validated form schema (Zod schema) |
| **Alert Engine** | Handled manually | Automated Alert Center displaying critical flags |
