# API Documentation

This document describes the data-service APIs constructed for client-side execution. The React frontend interacts directly with Firestore through these methods.

---

## 1. Authentication APIs (`authService.ts`)

### `loginUser(email, password)`
* **Method:** Client SDK Auth
* **Request:** `email (string)`, `password (string)`
* **Response:** `Promise<AuthUser>`
* **Description:** Authenticates user and loads user profile document from Firestore `/users`.

### `logoutUser()`
* **Method:** Client SDK Auth
* **Response:** `Promise<void>`
* **Description:** Ends current login session.

---

## 2. Contracts APIs (`contractService.ts`)

### `createContract(payload, creator)`
* **Method:** Firestore Document Create
* **Collection:** `/contracts`
* **Request:** Contract payload schema and creator user profile.
* **Response:** `Promise<ContractWithHealth>`
* **Description:** Inserts a contract and writes a `contract_created` record to activities.

### `updateContract(id, updates, modifier)`
* **Method:** Firestore Document Update
* **Collection:** `/contracts/{id}`
* **Request:** `id (string)`, partial updates payload, modifier user profile.
* **Response:** `Promise<void>`
* **Description:** Updates contract attributes. If status is modified, logs a `status_changed` event; otherwise logs a `price_updated` event.

### `getVisibleContracts(user)`
* **Method:** Firestore Query
* **Collection:** `/contracts`
* **Request:** User profile.
* **Response:** `Promise<ContractWithHealth[]>`
* **Description:** Fetches all contracts for Admin, or filters by `relationshipManagerId == employeeId` for RMs.

### `deleteContract(id, actor)`
* **Method:** Firestore Delete
* **Collection:** `/contracts/{id}`
* **Request:** `id (string)`, actor user profile.
* **Response:** `Promise<void>`
* **Description:** Deletes a contract (Admin-only).

---

## 3. Activities / Audit Logs APIs

### `getContractActivities(contractId)`
* **Method:** Firestore Query
* **Collection:** `/activities`
* **Request:** `contractId (string)`
* **Response:** `Promise<Activity[]>`
* **Description:** Retrieves audit history logs for the given contract, ordered by timestamp DESC.
