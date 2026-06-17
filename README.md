# Academy Annual Contract Renewal Tracker

Internal contract management system built for **Oxygen Sports** to streamline, automate, and track the renewal process of annual sports equipment supply contracts with partner academies.

## Company
Oxygen Sports

## Problem Statement
Oxygen Sports needs a system to track academy equipment supply contracts, renewal dates, equipment categories, price revisions, and relationship managers to avoid missing renewals and losing contracts.

---

## Features
* **Firebase Authentication** — Secure user identity sessions
* **Admin Login** — Administrative dashboard and operations
* **Relationship Manager Login** — Restricted portfolio tracking and updates
* **Role-Based Access Control (RBAC)** — Restricts views and writes based on user profiles
* **User Management** — Admins can add, update, and toggle RM status
* **Contract Entry Form** — Intuitive form to record academy details and RM assignment
* **Contract Dashboard** — Real-time overview of active, expiring, and total contracts
* **Contract Detail View** — Complete history and logistics breakdown for a specific contract
* **Expiry Tracking Logic** — Color-coded thresholds based on remaining time
* **Renewal Alerts** — Proactive notification center for upcoming expirations
* **Reports** — Summarized tables of active and expiring supply contracts
* **Firestore Database** — Live database storage and state synchronization
* **Vercel Deployment** — Serverless web hosting configuration

---

## Tech Stack
* **React** (v19)
* **Vite** (v7)
* **Tailwind CSS**
* **Firebase Authentication**
* **Firestore** (Google Cloud)
* **Vercel**

---

## Review 2 Demo Flow
1. **Admin logs in**: Accesses all dashboards, user management, and contracts.
2. **Admin creates Relationship Manager**: Adds RM account with custom department assignments.
3. **Admin creates academy contract**: Submits academy details, duration, value, and categories.
4. **Admin assigns contract to Relationship Manager**: Links the contract to the new RM.
5. **Dashboard updates using Firestore data**: Summary metrics and urgency lists calculate automatically.
6. **Relationship Manager logs in**: Authenticates with RM credentials.
7. **Relationship Manager sees only assigned contracts**: Row-level security blocks all other contracts.
8. **Expiry health and alerts are shown**: Urgency color-codes (Expired, Critical, High Risk, Attention) display correctly.
9. **Contract detail and reports are displayed**: View detailed metrics and export summaries.

---

## Security & Firebase Configuration

### 1. Firestore Security Rules
Firestore security rules restrict access based on authenticated user role and contract assignment.

### 2. Environment Configurations
Create a `.env` file in the root directory and populate it with your Firebase configuration values:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Sample Credentials for Evaluation

### Admin Login
* **Email:** [admin@example.com](mailto:admin@example.com)
* **Password:** `-----` *(Generated dynamically during database seeding)*

### Relationship Manager Login
* **Email:** [rm@example.com](mailto:rm@example.com)
* **Password:** `-----` *(Generated dynamically during database seeding)*

---

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Seeding (Optional)
To populate Firestore collections and Firebase Auth list with initial users, place your Firebase service account key in the root folder as `firebase-service-account.json` and run:
```bash
npm run seed
```
*Note: The generated passwords for all seeded users will be output directly in your console.*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
