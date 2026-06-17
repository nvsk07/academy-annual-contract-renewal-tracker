import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

let adminApp: App;

function initFirebaseAdmin() {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  const serviceAccountFile = path.resolve(process.cwd(), "firebase-service-account.json");

  if (serviceAccountEnv) {
    console.log("Initializing Firebase Admin via FIREBASE_SERVICE_ACCOUNT environment variable...");
    adminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccountEnv)),
    });
  } else if (fs.existsSync(serviceAccountFile)) {
    console.log(`Initializing Firebase Admin via service account file: ${serviceAccountFile}`);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFile, "utf8"));
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.log("No service account credentials found. Attempting fallback initialization with project ID 'oxygen-sports'...");
    adminApp = initializeApp({
      projectId: "oxygen-sports",
    });
  }
}

const mockUsers = [
  {
    email: "admin@oxygensports.in",
    password: "AdminPassword123!",
    employeeId: "ADMIN001",
    name: "Admin User",
    role: "admin",
    department: "Administration",
    avatar: "AD",
    status: "active",
    mustChangePassword: false,
  },
  {
    email: "priya@oxygensports.in",
    password: "RMPassword123!",
    employeeId: "RM001",
    name: "Priya Sharma",
    role: "relationship_manager",
    department: "Cricket Sales",
    avatar: "PS",
    status: "active",
    mustChangePassword: false,
  },
  {
    email: "arjun@oxygensports.in",
    password: "RMPassword123!",
    employeeId: "RM002",
    name: "Arjun Mehta",
    role: "relationship_manager",
    department: "Key Accounts",
    avatar: "AM",
    status: "active",
    mustChangePassword: false,
  },
  {
    email: "sneha@oxygensports.in",
    password: "RMPassword123!",
    employeeId: "RM003",
    name: "Sneha Patel",
    role: "relationship_manager",
    department: "Court Sports",
    avatar: "SP",
    status: "active",
    mustChangePassword: false,
  },
  {
    email: "vikram@oxygensports.in",
    password: "RMPassword123!",
    employeeId: "RM004",
    name: "Vikram Singh",
    role: "relationship_manager",
    department: "Racquet Sports",
    avatar: "VS",
    status: "active",
    mustChangePassword: false,
  },
];

const mockContracts = [
  {
    id: "OXY-2024-001",
    academyName: "Elite Cricket Academy",
    academyType: "Cricket Academy",
    contactPerson: "Rahul Dravid",
    phone: "+91 9876543210",
    email: "info@elitecricket.in",
    address: "123 Stadium Road",
    city: "Bangalore",
    state: "Karnataka",
    contractStartDate: "2024-01-15T00:00:00Z",
    contractEndDate: "2025-01-14T00:00:00Z",
    durationMonths: 12,
    status: "Active",
    equipmentCategories: ["Cricket Equipment", "Sports Apparel", "Training Accessories"],
    quantity: 500,
    supplyFrequency: "Monthly",
    previousContractValue: 1200000,
    currentContractValue: 1450000,
    relationshipManager: "Priya Sharma",
    relationshipManagerId: "RM001",
    department: "Cricket Sales",
    notes: "VIP Client. Needs premium willow bats.",
    createdAt: "2023-12-20T10:00:00Z",
    updatedAt: "2024-06-01T08:30:00Z"
  },
  {
    id: "OXY-2024-002",
    academyName: "Mumbai FC Youth",
    academyType: "Football Academy",
    contactPerson: "Sunil Chhetri",
    phone: "+91 9876543211",
    email: "youth@mumbaifc.com",
    address: "45 Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    contractStartDate: "2024-03-01T00:00:00Z",
    contractEndDate: "2025-02-28T00:00:00Z",
    durationMonths: 12,
    status: "Active",
    equipmentCategories: ["Football Equipment", "Sports Apparel", "Training Accessories"],
    quantity: 800,
    supplyFrequency: "Quarterly",
    previousContractValue: 1500000,
    currentContractValue: 1600000,
    relationshipManager: "Arjun Mehta",
    relationshipManagerId: "RM002",
    department: "Football Sales",
    notes: "Focus on match quality footballs and bibs.",
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-03-01T09:00:00Z"
  },
  {
    id: "OXY-2024-003",
    academyName: "Delhi Smashers",
    academyType: "Badminton Academy",
    contactPerson: "Prakash Padukone",
    phone: "+91 9876543212",
    email: "contact@delhismashers.in",
    address: "78 Siri Fort Road",
    city: "New Delhi",
    state: "Delhi",
    contractStartDate: "2023-08-01T00:00:00Z",
    contractEndDate: "2024-07-31T00:00:00Z",
    durationMonths: 12,
    status: "Expiring Soon",
    equipmentCategories: ["Badminton Equipment", "Sports Apparel"],
    quantity: 300,
    supplyFrequency: "Monthly",
    previousContractValue: 800000,
    currentContractValue: 850000,
    relationshipManager: "Sneha Patel",
    relationshipManagerId: "RM003",
    department: "Racquet Sports",
    notes: "High consumption of shuttlecocks.",
    createdAt: "2023-07-10T14:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z"
  },
  {
    id: "OXY-2024-004",
    academyName: "Chennai Hoops",
    academyType: "Basketball Academy",
    contactPerson: "Anita Singh",
    phone: "+91 9876543213",
    email: "info@chennaihoops.com",
    address: "12 Marina Beach Road",
    city: "Chennai",
    state: "Tamil Nadu",
    contractStartDate: "2023-07-15T00:00:00Z",
    contractEndDate: "2024-07-14T00:00:00Z",
    durationMonths: 12,
    status: "Expiring Soon",
    equipmentCategories: ["Basketball Equipment", "Fitness Equipment"],
    quantity: 200,
    supplyFrequency: "Quarterly",
    previousContractValue: 600000,
    currentContractValue: 650000,
    relationshipManager: "Vikram Singh",
    relationshipManagerId: "RM004",
    department: "Court Sports",
    notes: "Needs durable outdoor basketballs.",
    createdAt: "2023-06-20T09:00:00Z",
    updatedAt: "2024-06-01T11:00:00Z"
  },
];

async function seed() {
  try {
    initFirebaseAdmin();
    
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    console.log("\nStarting database seed...");

    // 1. Seed Users
    console.log("\nSeeding Users...");
    for (const u of mockUsers) {
      let uid = "";
      try {
        const userRecord = await auth.getUserByEmail(u.email);
        uid = userRecord.uid;
        console.log(`- User already exists in Auth: ${u.email} (UID: ${uid})`);
      } catch (err: any) {
        if (err.code === "auth/user-not-found") {
          const userRecord = await auth.createUser({
            email: u.email,
            password: u.password,
            displayName: u.name,
          });
          uid = userRecord.uid;
          console.log(`- Created Auth user: ${u.email} (UID: ${uid})`);
        } else {
          throw err;
        }
      }

      // Write profile to Firestore users collection
      const userRef = db.collection("users").doc(uid);
      await userRef.set({
        employeeId: u.employeeId,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        avatar: u.avatar,
        status: u.status,
        mustChangePassword: u.mustChangePassword,
        createdAt: Timestamp.now(),
      });
      console.log(`  Profile written to /users/${uid}`);
    }

    const shiftYear = (dateStr: string): string => {
      if (!dateStr) return "";
      const parts = dateStr.split("-");
      const year = parseInt(parts[0], 10);
      if (isNaN(year)) return dateStr;
      const newYear = year + 2; // Shift by 2 years to keep data fresh/active
      return [newYear, ...parts.slice(1)].join("-");
    };

    // 2. Seed Contracts
    console.log("\nSeeding Contracts...");
    const contractsCol = db.collection("contracts");
    
    const existingContracts = await contractsCol.get();
    if (!existingContracts.empty) {
      console.log(`- Clearing ${existingContracts.size} existing contracts...`);
      const batch = db.batch();
      existingContracts.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    for (const c of mockContracts) {
      const sDate = shiftYear(c.contractStartDate);
      const eDate = shiftYear(c.contractEndDate);
      const crDate = shiftYear(c.createdAt);
      const upDate = shiftYear(c.updatedAt);

      const contractData = {
        academyName: c.academyName,
        academyType: c.academyType,
        contactPerson: c.contactPerson,
        phone: c.phone,
        email: c.email,
        address: c.address,
        city: c.city,
        state: c.state,
        contractStartDate: sDate.split("T")[0],
        contractEndDate: eDate.split("T")[0],
        durationMonths: c.durationMonths,
        status: c.status,
        equipmentCategories: c.equipmentCategories,
        quantity: c.quantity,
        supplyFrequency: c.supplyFrequency,
        relationshipManagerId: c.relationshipManagerId,
        relationshipManagerName: c.relationshipManager,
        department: c.department,
        notes: c.notes,
        workflowStage: c.status === "Active" ? "active" : "negotiation",
        contractValue: c.currentContractValue,
        // snake_case aliases for Firestore compatibility
        academy_name: c.academyName,
        academy_type: c.academyType,
        contact_person: c.contactPerson,
        contact_number: c.phone,
        location: `${c.address}, ${c.city}, ${c.state}`,
        contract_start_date: sDate.split("T")[0],
        contract_end_date: eDate.split("T")[0],
        equipment_category: c.equipmentCategories,
        contract_value: c.currentContractValue,
        relationship_manager_id: c.relationshipManagerId,
        relationship_manager_name: c.relationshipManager,
        contract_status: c.status,
        contractExpiryDate: eDate.split("T")[0],
        relationshipManager: c.relationshipManager,
        createdAt: Timestamp.fromDate(new Date(crDate)),
        updatedAt: Timestamp.fromDate(new Date(upDate)),
        created_at: Timestamp.fromDate(new Date(crDate)),
        updated_at: Timestamp.fromDate(new Date(upDate)),
      };

      await contractsCol.doc(c.id).set(contractData);
      console.log(`- Seeded contract: ${c.id} (${c.academyName})`);
    }

    // 3. Seed Activities
    console.log("\nSeeding Activities...");
    const activitiesCol = db.collection("activities");
    
    const existingActivities = await activitiesCol.get();
    if (!existingActivities.empty) {
      console.log(`- Clearing ${existingActivities.size} existing activities...`);
      const batch = db.batch();
      existingActivities.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    const mockActivities = [
      {
        type: "contract_created",
        description: "Contract for Elite Cricket Academy created by Priya Sharma.",
        actor: "Priya Sharma",
        contractId: "OXY-2024-001",
        contractName: "Elite Cricket Academy",
        timestamp: Timestamp.fromDate(new Date(shiftYear("2024-06-01T08:30:00Z"))),
      },
      {
        type: "status_changed",
        description: "Contract status updated to Active by Arjun Mehta.",
        actor: "Arjun Mehta",
        contractId: "OXY-2024-002",
        contractName: "Mumbai FC Youth",
        timestamp: Timestamp.fromDate(new Date(shiftYear("2024-03-01T09:00:00Z"))),
      },
    ];

    for (const act of mockActivities) {
      await activitiesCol.add(act);
    }
    console.log("- Seeded initial activities.");

    console.log("\nDatabase seed completed successfully! 🎉");
    console.log("\nCredentials to sign in:");
    console.log("-----------------------------------------");
    for (const u of mockUsers) {
      console.log(`Role: ${u.role.padEnd(20)} | Email: ${u.email.padEnd(25)} | Password: ${u.password}`);
    }
    console.log("-----------------------------------------\n");

  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seed();
