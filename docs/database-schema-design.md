# Database Schema & ER Diagram Design

This document details the relational database design for the **Oxygen Sports Academy Annual Contract Renewal Tracker**, mapped directly from our Firestore structure to satisfy the MySQL/PostgreSQL design requirements specified in **Day 9** of the internship syllabus.

---

## 1. Entity Relationship (ER) Diagram
The following entity relationships exist between the database tables:

```mermaid
erDiagram
    RELATIONSHIP_MANAGERS ||--o{ CONTRACTS : "manages"
    CONTRACTS ||--o{ AUDIT_LOGS : "generates"

    RELATIONSHIP_MANAGERS {
        varchar employee_id PK "Unique Employee Code (e.g. RM001)"
        varchar name "Full Name"
        varchar email "Unique Email Address"
        varchar role "Access Tier (admin | relationship_manager)"
        varchar department "Sports Sales Department"
        varchar avatar "Initials Badge"
        varchar status "Account status (active | inactive)"
        timestamp created_at "Profile creation timestamp"
    }

    CONTRACTS {
        varchar id PK "Contract Code (e.g. OXY-2026-001)"
        varchar academy_name "Academy Partner Name"
        varchar academy_type "Academy Type classification"
        varchar contact_person "Primary Point of Contact"
        varchar phone "Contact Phone Number"
        varchar email "Contact Email Address"
        text address "Street Address"
        varchar city "City"
        varchar state "State"
        date contract_start_date "Effective start date"
        date contract_end_date "Contract expiry date"
        integer duration_months "Active duration in months"
        varchar status "Contract State (Active | Expiring Soon | Renewed | Archived)"
        text equipment_categories "Comma-separated or JSON list of supply types"
        integer quantity "Annual supply quantity"
        varchar supply_frequency "Monthly | Quarterly | Annually"
        varchar relationship_manager_id FK "References RELATIONSHIP_MANAGERS.employee_id"
        varchar relationship_manager_name "RM Name Denormalized for Reports"
        varchar department "Assigned Sales Department"
        numeric contract_value "Contract Valuation in INR"
        numeric price_revision "Price revision adjustment percentage (e.g., 5.0 for +5%)
        text notes "Logistics terms and conditions"
        varchar workflow_stage "Internal state (created | active | reminder_sent | negotiation | renewed)"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last modification timestamp"
    }

    AUDIT_LOGS {
        integer id PK "Auto-incrementing Identifier"
        varchar type "Activity Type (contract_created | price_updated | etc)"
        text description "Audit message details"
        varchar actor "User name who triggered the update"
        varchar contract_id FK "References CONTRACTS.id (on delete cascade)"
        varchar contract_name "Contract Name Denormalized"
        timestamp timestamp "Activity timestamp"
    }
```

---

## 2. Table Definition Specifications (SQL)

### Table 1: `relationship_managers`
Stores user profile information and security credential mapping.
```sql
CREATE TABLE relationship_managers (
    employee_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'relationship_manager')),
    department VARCHAR(100) NOT NULL,
    avatar VARCHAR(5) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Table 2: `contracts`
Stores individual equipment supply renewal contracts.
```sql
CREATE TABLE contracts (
    id VARCHAR(50) PRIMARY KEY,
    academy_name VARCHAR(150) NOT NULL,
    academy_type VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contract_start_date DATE NOT NULL,
    contract_end_date DATE NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expiring Soon', 'Renewed', 'Archived')),
    equipment_categories TEXT NOT NULL, -- Stored as comma-separated values (e.g., 'Cricket Equipment,Sports Apparel')
    quantity INT NOT NULL CHECK (quantity >= 0),
    supply_frequency VARCHAR(50) NOT NULL CHECK (supply_frequency IN ('Monthly', 'Quarterly', 'Annually')),
    relationship_manager_id VARCHAR(50) NOT NULL,
    relationship_manager_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    contract_value NUMERIC(15, 2) NOT NULL CHECK (contract_value >= 0),
    price_revision NUMERIC(5, 2) NOT NULL DEFAULT 0.00, -- e.g. 5.50 for +5.5% or -2.00 for -2%
    notes TEXT,
    workflow_stage VARCHAR(50) NOT NULL DEFAULT 'created' CHECK (workflow_stage IN ('created', 'active', 'reminder_sent', 'negotiation', 'renewed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (relationship_manager_id) REFERENCES relationship_managers(employee_id) ON UPDATE CASCADE
);
```

### Table 3: `audit_logs`
Stores historical actions and logistics timeline remarks for auditing.
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    actor VARCHAR(100) NOT NULL,
    contract_id VARCHAR(50),
    contract_name VARCHAR(150),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);
```

---

## 3. Database Indexes for Query Optimization

To optimize query operations in the SQL database, the following indexes are configured:

1. **Active Expiry Tracker Index**: Optimizes queries searching for expiring active contracts.
   ```sql
   CREATE INDEX idx_contracts_expiry_active 
   ON contracts(contract_end_date) 
   WHERE status != 'Archived';
   ```

2. **Relationship Manager Portfolio Index**: Optimizes row-level authorization lookups for RMs.
   ```sql
   CREATE INDEX idx_contracts_rm_portfolio 
   ON contracts(relationship_manager_id, status);
   ```

3. **Audit History Index**: Optimizes loading history timeline on the detail page.
   ```sql
   CREATE INDEX idx_audit_contract_timeline 
   ON audit_logs(contract_id, timestamp DESC);
   ```
