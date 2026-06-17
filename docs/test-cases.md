# Test Cases

This document details 50 test cases covering authentication, role validation, CRUD operations, expiry math, search, and system stability.

---

## 1. Authentication & Role-Based Access Control (15 Cases)

| Test Case ID | Module | Scenario / Description | Input Data | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Auth | Admin login with valid credentials | admin@oxygensports.in / Seeded Pwd | Dashboard loads; all sidebar links visible. |
| TC-02 | Auth | RM login with valid credentials | priya@oxygensports.in / Seeded Pwd | Dashboard loads; RM contracts portfolio visible. |
| TC-03 | Auth | Invalid password error | admin@oxygensports.in / Wrong Pwd | Error: "Invalid email or password." |
| TC-04 | Auth | Invalid email format | admin#oxygensports.in | UI validation error on email field. |
| TC-05 | Auth | Block login for inactive user | inactive@oxygensports.in | Auto-logout; alert: "Account is inactive." |
| TC-06 | Auth | Access blocked for user without role | auth-only-user@example.com | Auto-logout; error: "User role not found." |
| TC-07 | RBAC | RM attempts to visit /users page | Direct URL: /users | Blocked; redirects to dashboard or Unauthorized. |
| TC-08 | RBAC | RM attempts to edit Settings page | Direct URL: /settings | Blocked; Settings link is hidden on sidebar. |
| TC-09 | RBAC | RM queries all contracts | Client-side query mock | Returns only contracts where RM ID matches. |
| TC-10 | RBAC | Admin accesses User Management | Clicks "User Management" on sidebar | Renders RM account table with toggle options. |
| TC-11 | RBAC | Delete button hidden for RM | UI checks on details page | Delete button is omitted for RM role. |
| TC-12 | RBAC | RM attempts API contract delete | contractService.deleteContract() | Firebase security rule throws access error. |
| TC-13 | RBAC | RM creates contract (Auto-assignment) | RM forms submission | RM assigned to contract automatically. |
| TC-14 | Auth | Session persistence on refresh | Reload browser page | Auth session persists; page does not redirect. |
| TC-15 | Auth | Sign out redirection | Click "Logout" | Auth session destroyed; redirected to /login. |

---

## 2. Contract CRUD & Validation (15 Cases)

| Test Case ID | Module | Scenario / Description | Input Data | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-16 | CRUD | Create contract with empty inputs | Empty fields | Submissions blocked; UI shows validation errors. |
| TC-17 | CRUD | Create contract successfully (Admin) | Valid contract details | Saved to Firestore; success toast shown. |
| TC-18 | CRUD | Edit existing contract details | Update phone number | Saved to Firestore; detail screen updates. |
| TC-19 | CRUD | Check minimum phone length | Phone: "9876" | Validation fails: "Valid phone number required." |
| TC-20 | CRUD | Invalid email field | Email: "bademail" | Validation fails: "Invalid email address." |
| TC-21 | CRUD | Zero contract value validation | Value: -100 | Validation fails: "Value must be positive number." |
| TC-22 | CRUD | No equipment category checked | 0 checkboxes checked | Validation fails: "Select at least one category." |
| TC-23 | CRUD | Price revision boundary check | Revision: -150% | Validation fails: "Must be at least -100%." |
| TC-24 | CRUD | Price revision high limit | Revision: 600% | Validation fails: "Must be at most 500%." |
| TC-25 | CRUD | Contract dates logical order | Start: 2026; End: 2025 | Validation fails: "End date must be after start." |
| TC-26 | CRUD | Audit log created on insertion | Save new contract | Activities collection receives new record. |
| TC-27 | CRUD | Audit log created on price edit | Save price edit | Activities logs a "price_updated" event. |
| TC-28 | CRUD | Status update log creation | Change status to "Renewed" | Activities logs "contract_renewed" event. |
| TC-29 | CRUD | Delete contract success (Admin) | Click Delete -> Confirm | Document deleted; redirected to contracts list. |
| TC-30 | CRUD | Archive contract success | Click Archive | Status changes to "Archived"; moved from active. |

---

## 3. Expiry Alert Logic & Urgency Math (10 Cases)

| Test Case ID | Module | Scenario / Description | Input Data | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-31 | Expiry | Expiry in 100 days (Healthy) | Date: Today + 100 days | Health shows "Healthy" (Green Badge). |
| TC-32 | Expiry | Expiry in 60 days (Attention) | Date: Today + 60 days | Health shows "Attention Required" (Yellow). |
| TC-33 | Expiry | Expiry in 15 days (High Risk) | Date: Today + 15 days | Health shows "High Risk" (Orange Badge). |
| TC-34 | Expiry | Expiry in 5 days (Critical) | Date: Today + 5 days | Health shows "Critical" (Red Badge). |
| TC-35 | Expiry | End date is in the past (Expired) | Date: Today - 5 days | Health shows "Expired" (Slate Badge). |
| TC-36 | Expiry | Expired contract day count display | Date: Today - 10 days | Displays "Expired" text instead of "-10 days". |
| TC-37 | Expiry | Expiry date boundary (0 days) | Date: Today 23:59:00 | Urgency is categorized as "Critical". |
| TC-38 | Expiry | Expiry check for leap years | Date: 2028-02-29 | Calculations evaluate remaining days correctly. |
| TC-39 | Expiry | Dashboard alert badge sync | Create critical contract | Critical count on dashboard increases by 1. |
| TC-40 | Expiry | Alert list filter accuracy | Open Alerts page | Displays only Critical and High Risk records. |

---

## 4. Filters, Search & Stability (10 Cases)

| Test Case ID | Module | Scenario / Description | Input Data | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| TC-41 | Search | Search with exact match | Query: "Elite Cricket" | Returns contract for Elite Cricket Academy. |
| TC-42 | Search | Search case insensitivity | Query: "mumbai fc" | Returns contract for Mumbai FC Youth. |
| TC-43 | Search | Search for nonexistent query | Query: "xyz999" | Shows empty state: "No Search Results Found". |
| TC-44 | Filter | Filter by Health status | Select: "critical" | Displays only critical contracts. |
| TC-45 | Filter | Filter by status | Select: "Archived" | Displays only archived contracts. |
| TC-46 | Reports | RM filtering on Admin Reports | Filter: "Arjun Mehta" | Returns only Arjun's contracts in report table. |
| TC-47 | Stable | Empty database report view | Zero contracts loaded | Shows empty state: "No Reports Available". |
| TC-48 | Stable | Empty alert list view | Zero critical items | Shows empty state: "No Alerts Available". |
| TC-49 | Stable | User management empty state | Zero active RMs | Shows empty state: "No Relationship Managers Found". |
| TC-50 | Stable | Malformed JSON database load | Injected bad field data | Client handles properties safely without crashing. |
