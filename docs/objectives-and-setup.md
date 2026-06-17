# Project Objectives & Local Environment Setup

This document compiles the team objectives (role-by-role) and development environment setup instructions to satisfy the requirements for **Day 3** of the internship syllabus.

---

## 1. Project Objectives (Role-by-Role)

### Student 1: Frontend Developer (User Interface & Experience)
1. **Academy Entry Form**: Build a responsive contract entry form capturing all required parameters (equipment categories, price revision, RM assignment, contract values, and dates) with interactive client-side validations.
2. **Real-time Tracker Dashboard**: Implement a unified contracts dashboard featuring live status summary metrics, search capability, and multi-tier filters (by health status, contract status, academy type, and assigned manager).
3. **Valuation & Details View**: Design an advanced detail worksheet displaying full contract valuation details, supply parameters, and an action history timeline.
4. **Exportable Reports Dashboard**: Build a reports panel featuring aggregate status distributions and custom date/status filtered datasets with fully functional CSV reports download.
5. **Business Design Polish**: Polish the UI using modern fonts, consistent spacing guidelines, visual loader indicators for all operations, and distinct styled empty states.

### Student 2: Backend Developer (Database, Calculations & Access Control)
1. **Firestore Schema Architecture**: Construct secure collections for `/users` (profiles), `/contracts` (equipment contracts), and `/activities` (audit timeline) with cross-entity mapping references.
2. **Access Control & Row Security**: Write Cloud Firestore rules enforcing strict role-based access control, ensuring relationship managers can only query documents assigned to their employee ID.
3. **Expiry Alert Engine**: Build a dynamic calculation utility converting contract end dates to remaining days, categorizing them into one of five color-coded tiers (Healthy, Attention, High Risk, Critical, Expired).
4. **System Audit Logs**: Implement automated logging services that write audit records to the activities collection for every contract creation, status transition, price update, or archive operation.
5. **Database Seeding Engine**: Write an automated database seed script in Node.js that sets up the auth database and populates collections with realistic test users, contracts, and activities.

### Student 3: QA Tester & Release Engineer (Testing & Deployment)
1. **Standardized Test Suite**: Formulate 15+ manual test scenarios covering authorization guards, input validation, role boundaries, CRUD workflows, and calculation accuracy.
2. **Boundary & Expiry Testing**: Validate the alert engine calculations, ensuring that contracts past their expiry dates display `"Expired"` (Slate Badge) instead of negative values.
3. **Security Audits & Error Checking**: Perform security audits on environment files, verify exception handling (try-catch safety blocks), and test error states.
4. **Local Repository & Branch Workflow**: Organize the team's GitHub repository structure, manage feature branches, resolve merge conflicts, and review code quality.
5. **Vercel Production Deployment**: Deploy the React single-page application to a public live URL on Vercel, mapping all production environment configurations and Firestore security rules.

---

## 2. Local Development Environment Setup

To run the Academy Annual Contract Renewal Tracker application locally, follow these steps:

### Prerequisites
* **Node.js**: Ensure Node.js (v18 or higher) is installed.
* **Firebase Project**: Create a project in the Google Firebase console.
* **Firestore**: Enable Cloud Firestore and set up database.

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nvsk07/academy-annual-contract-renewal-tracker.git
   cd academy-annual-contract-renewal-tracker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the project and populate it with your client-side Firebase credentials (see `.env.example` as a template):
   ```ini
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Seed the Firestore Database**:
   Place a Firebase Admin SDK private key JSON file in the root directory named `firebase-service-account.json`. Then populate the database and create auth users by running:
   ```bash
   npm run seed
   ```
   *Note: Credentials and randomly generated passwords for all testing accounts will print to the console.*

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173`.
