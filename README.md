# Academy Annual Contract Renewal Tracker

Internal contract management system built for **Oxygen Sports Pvt. Ltd.** to streamline, automate, and track the renewal process of annual sports equipment supply contracts with partner academies.

## Problem Statement

Oxygen Sports manages hundreds of annual contracts with various sports academies across the country, providing sports apparel, training gear, and equipment. Previously, tracking contract expiration dates, assigning relationship managers, sending reminders, and initiating renegotiations were handled manually through spreadsheets. This caused operational inefficiencies, missed deadlines, and delayed renewals. 

The **Academy Annual Contract Renewal Tracker** provides a centralized, secure database that tracks contracts, monitors expiry dates, triggers real-time visual alerts, and assigns relationship managers to coordinate renegotiations before contracts expire.

## Features

- **Dynamic KPI Dashboard**: Real-time insights into total, active, and expiring contracts, plus categorized breakdown of contract health status (Critical, High Risk, Attention, Healthy).
- **Secure Authentication**: Integration with Firebase Authentication using session persistence.
- **Strict Role-Based Access Control (RBAC)**:
  - **Administrators**: Complete system access. View all metrics, manage relationship managers (create accounts, activate/deactivate, trigger password resets), add/edit/delete all contracts, view reports, and analyze revenue metrics.
  - **Relationship Managers**: View only their own portfolio of assigned contracts. Create contracts (automatically assigned to themselves), log client activities, track and advance contracts through stages, and receive expiry warnings.
- **Real-Time Database Sync**: Integration with Google Cloud Firestore, providing real-time data updates across dashboards and alerts.
- **Expiry Notifications & Alerts**: Automatically calculates days remaining and classifies contracts by urgency so RMs can act proactively before the 30/60/90-day margins.
- **Audit Trails**: Real-time activity logs documenting status changes, edits, and comments.

## Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite, TailwindCSS (for custom utility styles)
- **Routing**: Wouter (lightweight client router)
- **Form Validation**: React Hook Form, Zod
- **Icons & Visuals**: Lucide React, Radix UI primitives
- **Database & Identity**: Google Firebase (Authentication, Cloud Firestore)
- **Deployment**: Vercel

## Folder Structure

```text
├── public/                     # Static assets (favicons, logos)
├── scripts/
│   └── seed.ts                 # Database seeding script (Firebase Admin SDK)
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Buttons, Cards, Dialogs)
│   │   ├── HealthBadge.tsx     # Custom color-coded urgency status component
│   │   ├── ProtectedRoute.tsx  # Authentication & Role route guards
│   │   ├── RoleGuard.tsx       # Inline conditional rendering based on role
│   │   └── Sidebar.tsx         # Responsive dark-theme navigation sidebar
│   ├── constants/              # Centralized application and schema constants
│   ├── context/
│   │   └── AuthContext.tsx     # Context provider for session, login, and logout state
│   ├── data/                   # TS Type definitions for database schema models
│   ├── hooks/                  # Custom React hooks (useAuth, useContracts)
│   ├── layouts/
│   │   └── AppLayout.tsx       # Standard sidebar/header layout wrapper
│   ├── pages/                  # Application routing views (Dashboard, Contracts, UserManagement, etc.)
│   ├── services/               # Firestore service functions (queries, mutations)
│   ├── utils/                  # Utility functions (date calculations, class merging)
│   ├── App.tsx                 # Core React entry point
│   ├── index.css               # Global Tailwind CSS definitions
│   └── main.tsx                # Client DOM mount entry point
├── .env.example                # Environment variables template
├── components.json             # Component compilation guidelines
├── firestore.rules             # Security rules for Cloud Firestore
├── package.json                # Project dependencies and script runner configurations
├── tsconfig.json               # TypeScript compiler options
├── vercel.json                 # Vercel deployment routing configuration
└── vite.config.ts              # Vite compiler configuration
```

## Firebase Setup

This project requires a Firebase project with **Authentication** (Email/Password provider enabled) and **Cloud Firestore** database.

### 1. Firestore Security Rules
Deploy the rules defined in `firestore.rules` to secure your database:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /contracts/{contractId} {
      allow read, write: if request.auth != null;
    }
    match /activities/{activityId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Environment Configurations
Create a `.env` file in the root of the project and populate it with your Firebase configuration values:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Seeding (Optional)
To populate your Firebase Authentication list and Firestore collection with default relationship managers, admin accounts, and sample contracts, place your service account JSON in the root as `firebase-service-account.json` and run:
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment Steps (Vercel)

1. Push the repository to GitHub.
2. Link the repository to your project dashboard on Vercel.
3. Configure the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add all environment variables from `.env.example` in Vercel settings (**Settings > Environment Variables**).
5. Deploy the application.

## Role-Based Access Explanation

| Feature | Administrator | Relationship Manager |
|---|:---:|:---:|
| **Dashboard Overview** | All contracts metrics / Active RMs count | Assigned contracts only |
| **Contracts Listing** | View, edit, archive, or delete all | View, edit, or archive assigned contracts |
| **Create Contract** | Create and assign to any active RM | Create (assigned to self only) |
| **User Management** | Create accounts, deactivate, reset passwords | Access Denied (Redirects to 401) |
| **Analytics & Settings**| View revenue metrics and logs | Access Denied (Redirects to 401) |
| **Alerts & Reports** | View all notifications / export reports | Portfolio notifications / reports |
