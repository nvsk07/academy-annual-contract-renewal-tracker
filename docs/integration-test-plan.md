# Integration Test Plan

This document outlines 10 end-to-end integration scenarios for validating the system flow.

---

### Scenario 1: User Account Lifecycle & First Sign-In
* **Goal:** Verify that an administrator can provision a new RM account, and the RM can log in and update their password.
* **Flow:**
  1. Admin logs in -> Navigates to **User Management** -> Clicks **Add User**.
  2. Input Employee ID: `RM005`, Name: `Jane Doe`, Email: `jane@oxygensports.in`, Pwd: `Temp123!`.
  3. Log out Admin -> Log in as Jane Doe with temporary password.
  4. Prompted to change password -> Submits new secure password -> Redirected to Dashboard.

### Scenario 2: Contract Provisioning and Portfolio Assignment
* **Goal:** Verify that a contract created and assigned to an RM is immediately visible to that RM and hidden from others.
* **Flow:**
  1. Admin logs in -> Opens **Contracts > Add Contract**.
  2. Fills details for "Kolkata Knight Riders Academy" and assigns to `RM001` (Priya Sharma).
  3. Admin logs out -> Log in as `RM002` (Arjun Mehta) -> Contracts list should NOT show Kolkata.
  4. Log out -> Log in as Priya Sharma -> Kolkata appears in portfolio.

### Scenario 3: Expiry Tracking & Color-Coding Badge Update
* **Goal:** Verify that editing a contract's expiry date updates its health status color-coding.
* **Flow:**
  1. Priya Sharma logs in -> Opens Kolkata Academy contract -> Currently "Healthy" (End Date: Today + 120 days).
  2. Clicks **Edit** -> Changes End Date to Today + 15 days -> Saves.
  3. Dashboard count for "High Risk" increments; contract list displays Orange Badge.

### Scenario 4: Alert Notification Engine Flow
* **Goal:** Verify that a contract approaching expiration triggers an alert on the Alert Center page.
* **Flow:**
  1. Create a contract expiring in 4 days (Critical).
  2. Click **Alerts** in sidebar.
  3. Confirm the contract is listed in the Critical Alerts panel.
  4. Ensure RM portfolio alerts show only their assigned critical contracts.

### Scenario 5: Price Revision and Audit History Logging
* **Goal:** Verify that updating contract terms and price revisions creates an audit log.
* **Flow:**
  1. RM opens an assigned contract detail page -> Clicks **Edit**.
  2. Modifies price revision to `+8%` and value to `₹15,00,000` -> Saves.
  3. Under **Activity History** on the detail page, verify a new entry is logged: *"Contract details updated by [RM Name]"*.

### Scenario 6: Contract Archiving Workflow
* **Goal:** Verify archiving removes a contract from active displays while preserving it in database filters.
* **Flow:**
  1. RM opens contract detail page -> Clicks **Archive**.
  2. Confirm contract no longer appears in default dashboard totals or urgency indicators.
  3. Set status filter to **Archived** -> Confirm contract appears in list with Archived badge.

### Scenario 7: Reports Date and Status Filter Pipeline
* **Goal:** Verify report aggregation filters function correctly.
* **Flow:**
  1. Admin opens **Reports** page.
  2. Selects status filter **Expiring Soon** -> Table list collapses to show only expiring contracts.
  3. Selects RM filter **Sneha Patel** -> Grid updates to show Sneha's expiring contracts only.

### Scenario 8: CSV Export Data Integrity
* **Goal:** Verify generated CSV contains correct values matching current filters.
* **Flow:**
  1. Admin filters contracts list for "Cricket Academy" types.
  2. Clicks **Export CSV**.
  3. Open downloaded file -> Confirm rows correspond exactly to the filtered table view.

### Scenario 9: Deactivation of RM Account
* **Goal:** Verify that deactivating an RM blocks their login and keeps their contracts safe.
* **Flow:**
  1. Admin opens **User Management** -> Locates Priya Sharma -> Toggles status to **Inactive**.
  2. Attempt to log in as Priya Sharma -> Denied login: *"Your account is inactive."*
  3. Admin logs in -> Confirm Priya's contracts are preserved and can be reassigned to other RMs.

### Scenario 10: Contract Reassignment Flow
* **Goal:** Verify that an Admin can reassign a contract, updating its visibility instantly.
* **Flow:**
  1. Admin opens Kolkata Academy contract detail page (currently assigned to Priya).
  2. Clicks **Edit** -> Changes assigned RM to **Arjun Mehta** -> Saves.
  3. Log in as Arjun Mehta -> Kolkata Academy now appears in Arjun's portfolio list.
