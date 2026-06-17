# Database Design

This document details the database architecture of the **Oxygen Sports Academy Annual Contract Renewal Tracker** using Cloud Firestore.

---

## 1. Cloud Firestore Collection Schemas

### Collection 1: `/users/{uid}`
Stores employee accounts and security roles.
```typescript
interface UserProfile {
  employeeId: string;       // Unique Employee ID (e.g. RM001, ADMIN001)
  name: string;             // Full name of the user
  email: string;            // Corporate email address
  role: "admin" | "relationship_manager";
  department: string;       // Cricket Sales, Football Sales, Court Sports, etc.
  avatar: string;           // Initials for avatar rendering (e.g. "PS")
  status: "active" | "inactive";
  mustChangePassword: boolean;
  createdAt: Timestamp;     // Firestore Server Timestamp
}
```

### Collection 2: `/contracts/{contractId}`
Stores annual supply contracts for sport academies.
```typescript
interface Contract {
  academyName: string;
  academyType: "Cricket Academy" | "Football Academy" | "Badminton Academy" | "Basketball Academy" | "Multi Sports Academy";
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  contractStartDate: string; // YYYY-MM-DD format
  contractEndDate: string;   // YYYY-MM-DD format
  durationMonths: number;
  status: "Active" | "Expiring Soon" | "Renewed" | "Archived";
  equipmentCategories: string[]; // e.g. ["Cricket Equipment", "Sports Apparel"]
  quantity: number;
  supplyFrequency: "Monthly" | "Quarterly" | "Annually";
  relationshipManagerId: string; // References /users/{uid}.employeeId
  relationshipManagerName: string;
  department: string;
  contractValue: number;    // Stored in INR
  priceRevision: number;    // Percentage value (e.g. 5 for +5%)
  notes: string;            // Logistics and special terms
  workflowStage: "created" | "active" | "reminder_sent" | "negotiation" | "renewed";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection 3: `/activities/{activityId}`
Stores audit logs for contract events.
```typescript
interface ActivityLog {
  type: "contract_created" | "price_updated" | "contract_renewed" | "status_changed" | "reminder_generated";
  description: string;      // Human readable description of the action
  actor: string;            // User name who performed the action
  contractId: string;       // Associated Contract ID reference
  contractName: string;     // Denormalized name of the academy for quick rendering
  timestamp: Timestamp;
}
```

---

## 2. Cloud Firestore Index Configuration
We configure the following indexes in Firestore:
1. **Collection:** `contracts`
   * Fields: `relationshipManagerId` (Ascending), `status` (Ascending) -> Used for filtering portfolios by status.
   * Fields: `status` (Ascending), `contractEndDate` (Ascending) -> Used for expiry checks.
2. **Collection:** `activities`
   * Fields: `contractId` (Ascending), `timestamp` (Descending) -> Used to build chronological timelines in detail pages.

---

## 3. Security Validation Rules
Implemented inside `firestore.rules`:
* **Admin Privilege:** Admins can read and write to all collections.
* **RM Row Restrictions:** RMs can read and write documents in the `contracts` collection only if `resource.data.relationshipManagerId == request.auth.token.employeeId`.
* **User Collection Restriction:** Only administrators can read and list the entire `users` collection.
