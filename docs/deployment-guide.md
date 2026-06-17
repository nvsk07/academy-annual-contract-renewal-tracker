# Deployment Guide

This guide details how to deploy the application to Vercel and set up Cloud Firestore.

---

## 1. Firebase Project Setup
1. Open the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Enable **Firestore Database** in production mode. Choose a server location closest to your users.
3. Enable **Firebase Authentication** and turn on the **Email/Password** sign-in provider.

---

## 2. Firestore Security Rules
Go to the **Rules** tab in Firestore and deploy the following:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper check
    function isSignedIn() {
      return request.auth != null;
    }
    
    // User profile doc check
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && getUserData().role == 'admin';
    }

    match /contracts/{contractId} {
      allow read: if isSignedIn() && (
        getUserData().role == 'admin' || 
        resource.data.relationshipManagerId == getUserData().employeeId
      );
      allow write: if isSignedIn() && (
        getUserData().role == 'admin' || 
        (resource == null && request.resource.data.relationshipManagerId == getUserData().employeeId) ||
        (resource.data.relationshipManagerId == getUserData().employeeId)
      );
    }

    match /activities/{activityId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
    }
  }
}
```

---

## 3. Deploying to Vercel
1. Push your code to your GitHub repository.
2. Open the [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
3. Import your repository.
4. Set the **Root Directory** to `academy-annual-contract-renewal-tracker`.
5. Under **Environment Variables**, add all configurations from your local `.env` file:
   * `VITE_FIREBASE_API_KEY`
   * `VITE_FIREBASE_AUTH_DOMAIN`
   * `VITE_FIREBASE_PROJECT_ID`
   * `VITE_FIREBASE_STORAGE_BUCKET`
   * `VITE_FIREBASE_MESSAGING_SENDER_ID`
   * `VITE_FIREBASE_APP_ID`
6. Click **Deploy**. Vercel will build the React application and host it on a public URL.
