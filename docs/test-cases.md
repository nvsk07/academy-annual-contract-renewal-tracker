# Test Cases (Review 2 Alignment)

This document contains manual test cases to evaluate the security, access control, features, and UX details of the **Academy Annual Contract Renewal Tracker**.

---

## Test Suite: Authentication & Security Guards

### Test Case 1: Admin Login
* **Description:** Verify that an administrator can successfully authenticate and access the full system.
* **Pre-conditions:** Admin account exists in Firebase Auth/Firestore.
* **Test Steps:**
  1. Navigate to `/login`.
  2. Input valid admin credentials: `admin@oxygensports.in` and the seeded password.
  3. Click **Sign In**.
* **Expected Result:** Redirected to `/` (Dashboard). Sidebar displays links to **Dashboard**, **Contracts**, **User Management**, **Alerts**, **Reports**, and **Settings**.

### Test Case 2: Relationship Manager Login
* **Description:** Verify that a Relationship Manager (RM) can log in and access their restricted profile.
* **Pre-conditions:** RM account exists in Firebase Auth/Firestore.
* **Test Steps:**
  1. Navigate to `/login`.
  2. Input valid RM credentials: `priya@oxygensports.in` and the seeded password.
  3. Click **Sign In**.
* **Expected Result:** Redirected to `/` (Dashboard). Sidebar displays links to **Dashboard**, **My Contracts** (or Contracts), **Renewal Tracker**, **Alerts**, and **Reports**. **User Management** and **Settings** are hidden.

### Test Case 3: Invalid Login Credentials
* **Description:** Verify that entering incorrect credentials triggers a user-friendly error message.
* **Test Steps:**
  1. Navigate to `/login`.
  2. Enter an unseeded email or wrong password.
  3. Click **Sign In**.
* **Expected Result:** Authentication fails. UI displays error alert: `"Invalid email or password. Please try again."`

### Test Case 4: Block Inactive User Login
* **Description:** Verify that an employee whose account is marked "inactive" is blocked from logging in.
* **Pre-conditions:** An account exists with `status` set to `"inactive"` in Firestore.
* **Test Steps:**
  1. Navigate to `/login`.
  2. Enter the inactive user credentials.
  3. Click **Sign In**.
* **Expected Result:** Logged out automatically. UI displays error: `"Your account is inactive. Please contact admin."`

### Test Case 5: Block User with Missing Role
* **Description:** Verify that a user document lacking a role is denied access.
* **Pre-conditions:** An account exists in Firebase Auth but has no corresponding Firestore document or is missing the `role` field.
* **Test Steps:**
  1. Navigate to `/login`.
  2. Enter the user credentials.
  3. Click **Sign In**.
* **Expected Result:** Logged out automatically. UI displays error: `"User role not found. Please contact admin."`

### Test Case 6: Unauthorized Route Guard Redirection
* **Description:** Verify that RMs cannot bypass the UI to access the admin user management page via the URL path.
* **Pre-conditions:** Logged in as Relationship Manager (`priya@oxygensports.in`).
* **Test Steps:**
  1. In the browser search bar, manually type and navigate to: `http://localhost:5173/users`.
* **Expected Result:** Access blocked. The browser displays the **Unauthorized** warning page or redirects to the dashboard.

---

## Test Suite: User & Contract Management

### Test Case 7: Create Relationship Manager Account
* **Description:** Verify that an Admin can create a new RM account without logging out of their session.
* **Pre-conditions:** Logged in as Admin.
* **Test Steps:**
  1. Open **User Management** page.
  2. Click **Add User**.
  3. Enter Employee ID, Name, Email, Department, and a Temporary Password.
  4. Click **Create User**.
* **Expected Result:** Dialog closes. A success toast displays. The new user is listed in the user management table.

### Test Case 8: Create and Assign Contract (Admin Flow)
* **Description:** Verify that an Admin can add a contract and assign it to any active Relationship Manager.
* **Pre-conditions:** Logged in as Admin. Active relationship managers exist.
* **Test Steps:**
  1. Open **Contracts > Add Contract** (or click **Add Contract** on Dashboard).
  2. Enter Academy Name, Type, Contact Person, Phone, Email, Start/End Dates, Categories, and Value.
  3. Under the Relationship Manager assignment dropdown, select an active manager (e.g. `Priya Sharma`).
  4. Click **Create Contract**.
* **Expected Result:** Contract is created. A success toast displays. Admin is redirected to the contracts list.

### Test Case 9: Verify Real-time Dashboard Count Sync
* **Description:** Verify that the Admin dashboard counters update dynamically when a new contract is created.
* **Pre-conditions:** Logged in as Admin.
* **Test Steps:**
  1. Observe the **Total Contracts** counter on the Dashboard.
  2. Create a new contract following the steps in *Test Case 8*.
  3. Return to the Dashboard and verify the counter.
* **Expected Result:** The count incremented by 1 instantly using live Firestore snapshot streaming.

### Test Case 10: RM Portfolio Restrictions
* **Description:** Verify that an RM can see *only* their assigned contracts.
* **Pre-conditions:** Seeded contracts exist for `RM001` (Priya Sharma) and `RM002` (Arjun Mehta). Logged in as `Priya Sharma`.
* **Test Steps:**
  1. Open the **Contracts** page.
  2. Inspect the contract listings.
* **Expected Result:** Only contracts where `relationshipManagerId === "RM001"` are displayed. Contracts belonging to `RM002` are completely hidden.

### Test Case 11: RM Edit Assigned Contract
* **Description:** Verify that RMs can edit their own contracts (updating workflow stage or logistics notes) but cannot change the manager assignment.
* **Pre-conditions:** Logged in as RM (`priya@oxygensports.in`).
* **Test Steps:**
  1. Open an assigned contract details page.
  2. Click **Edit**.
  3. Modify the **Status** (e.g. change to "Expiring Soon") or edit the **Notes**.
  4. Verify if the Relationship Manager dropdown is disabled/read-only.
  5. Click **Save Changes**.
* **Expected Result:** Changes are saved. RM assignment remains unchanged. Activity timeline logs the update.

### Test Case 12: Delete Contract (Access Control)
* **Description:** Verify that only Admin accounts can delete contracts.
* **Pre-conditions:** Logged in as RM (`priya@oxygensports.in`).
* **Test Steps:**
  1. Open an assigned contract details page.
  2. Look for the **Delete** button.
  3. Attempt to visit the deletion URL (if any) or inspect the DOM.
* **Expected Result:** The **Delete** button is hidden for RMs. Only admins have access to the delete dialog.

---

## Test Suite: Expiry Logic & UI Polish

### Test Case 13: Expiry Health Status Calculation
* **Description:** Verify that the health badges update based on correct expiry date thresholds.
* **Test Steps:**
  1. Create a contract with an end date set to **100 days** from today. Verify badge is `Healthy` (Green).
  2. Create a contract with an end date set to **60 days** from today. Verify badge is `Attention Required` (Yellow).
  3. Create a contract with an end date set to **15 days** from today. Verify badge is `High Risk` (Orange).
  4. Create a contract with an end date set to **5 days** from today. Verify badge is `Critical` (Red).
* **Expected Result:** Badge labels and colors match the configured health thresholds exactly.

### Test Case 14: Expired Contract Visual Identification
* **Description:** Verify that past-due contracts clearly display "Expired" instead of negative day values.
* **Pre-conditions:** Seeded contract has `contractEndDate` in the past.
* **Test Steps:**
  1. Open the Dashboard or Contracts list.
  2. Look at the expired contract row.
* **Expected Result:** Days remaining displays `"Expired"`. The health badge displays `"Expired"` (Slate/Gray). No negative numbers appear in active widgets.

### Test Case 15: Search and Filter Empty States
* **Description:** Verify that searching for non-existent keywords displays the correct empty states.
* **Test Steps:**
  1. Open **Contracts** list.
  2. In the Search input, type a random string of characters (e.g. `xyz123abc`).
* **Expected Result:** The list collapses and displays the search icon with message: `"No Search Results Found"`.
