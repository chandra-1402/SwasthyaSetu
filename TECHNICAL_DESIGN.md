# SwasthyaSetu — Technical Design Document (TDD)

> **Frontline Clinical Decision Support, Offline-First Risk Stratification, and Unified Emergency Hospital Referral Network**  
> *Author:* Chandan & The SwasthyaSetu Team  
> *Version:* 1.0.0  
> *Date:* 2026-10-11  
> *Status:* Implemented & Verified

---

## 1. System Context & Problem Statement

Rural and maternal healthcare delivery across developing regions is disproportionately hampered by the **"Three Delays"** framework (Thaddeus & Maine):

```mermaid
flowchart LR
    D1["Delay 1: Seeking Care\n(Lack of triage, missed red flags)"]
    D2["Delay 2: Reaching Facility\n(Blind referrals, ambulance delays)"]
    D3["Delay 3: Receiving Care\n(Beds unavailable, specialist absent)"]

    D1 --> S1["SwasthyaSetu Frontline CDSS\n(Instant offline algorithmic risk triage)"]
    D2 --> S2["Live Hospital Bed & Facility Tracker\n(Smart geospatial referral routing)"]
    D3 --> S3["Automated Pre-Alerts & 108 Dispatch\n(Prioritized emergency admission token)"]

    style D1 fill:#fee2e2,stroke:#ef4444,stroke-width:1.5px
    style D2 fill:#fee2e2,stroke:#ef4444,stroke-width:1.5px
    style D3 fill:#fee2e2,stroke:#ef4444,stroke-width:1.5px
    style S1 fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style S2 fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style S3 fill:#dcfce7,stroke:#22c55e,stroke-width:2px
```

**SwasthyaSetu** bridges the chasm between the frontline Accredited Social Health Activist (ASHA) in rural villages and tertiary emergency healthcare infrastructure through a progressive, offline-first digital continuum.

---

## 2. High-Level System Architecture

### 2.1 C4 Context Level Diagram

```mermaid
flowchart TD
    subgraph Users ["Primary Stakeholders"]
        ASHA["🩺 ASHA Worker\n(Frontline screening in village sub-centres)"]
        PATIENT["🧑‍🍼 Patient / Family\n(Citizens tracking care & OPD)"]
        STAFF["🏥 Hospital Staff\n(Emergency bed & triage coordinators)"]
    end

    subgraph Platform ["SwasthyaSetu Core Platform"]
        APP["SwasthyaSetu Web Application\n(React 19 + TypeScript + Vite)"]
        TRIAGE["Algorithmic CDSS Engine\n(Offline clinical risk stratification)"]
        SYNC["Offline-First Sync Engine\n(LocalStorage + Mutation Queue)"]
        BEDS["Live Bed & Facility Directory\n(ICU, Maternity, Blood Bank Tracker)"]
    end

    subgraph External ["National & Emergency Infrastructure"]
        AMB["🚑 108/102 Emergency Dispatch\n(Ambulance Fleet Integration)"]
        ABDM["🇮🇳 ABDM / ABHA Health Registry\n(14-digit Ayushman Bharat ID)"]
        SMS["📱 Telecom SMS Gateway\n(Low-connectivity SMS alerts)"]
    end

    ASHA -->|"Patient Intake, CDSS Screening & Referrals"| APP
    PATIENT -->|"Token Tracking, Lab Reports & Bed Discovery"| APP
    STAFF -->|"Bed Availability Updates & Referral Intake"| APP

    APP --- TRIAGE
    APP --- SYNC
    APP --- BEDS

    APP -->|"Automated 108 Emergency Trigger"| AMB
    APP -->|"ABHA ID Verification & Health Locker"| ABDM
    APP -->|"Offline Notification & Referral Slips"| SMS
```

---

### 2.2 C4 Container & Component Architecture

```mermaid
graph TD
    subgraph Client Application [React 19 + TypeScript + Tailwind CSS]
        Router["React Router v7 Dynamic Navigation"]
        
        subgraph Portals ["Dual Operational Interfaces"]
            AshaPortal["ASHA Frontline Portal (/asha/*)\n- Patient Intake & Screening\n- 4-Stage Clinical Triage\n- Real-Time Referral Dispatch\n- Offline Synchronization Manager"]
            PatientPortal["HospiTrack Patient Portal (/patient/*)\n- Active Emergency Referral Tracker\n- Geospatial Hospital Radar Map\n- NABL Lab Report Viewer\n- Digital OPD Tokens & ABHA Card"]
        end

        subgraph Core Engines
            CDSS["Algorithmic CDSS Engine (triageEngine.ts)\n- Vitals Sanitization\n- Danger Sign Parser\n- Maternal & Pediatric Scoring\n- Facility Routing Logic"]
            StateSync["Reactive State & Sync Orchestrator\n- LocalStorage Reactive Buffer\n- Network Online/Offline Sentinel\n- FIFO Referral Transaction Queue"]
        end
    end

    subgraph Persistence Layer
        BrowserCache["Browser IndexedDB / LocalStorage\n- Offline Patients\n- Pending Synced Referrals\n- Hospital Bed Cache"]
    end

    subgraph Backend & Integration Services
        ViteDev["Vite Dev / Reverse Proxy (Port 7000)"]
        APIServices["Mock & Live REST Endpoints\n- /api/referrals\n- /api/hospitals\n- /api/patients"]
    end

    Router --> AshaPortal
    Router --> PatientPortal
    AshaPortal --> CDSS
    AshaPortal --> StateSync
    PatientPortal --> StateSync
    StateSync --> BrowserCache
    StateSync -. Sync over HTTP .-> APIServices
    ClientApplication --> ViteDev
```

---

## 3. Clinical Decision Support (CDSS) Specification

### 3.1 Vitals Sanitization & Bounding

Frontline data entry is prone to typographical errors under emergency field conditions. The CDSS normalizes inputs before evaluation:

| Vital Sign | Normal Range | Minimum Bound | Maximum Bound | Fallback Value |
| :--- | :--- | :--- | :--- | :--- |
| **SpO2 (%)** | 95% – 100% | 40% | 100% | 98% |
| **Systolic BP (mmHg)** | 110 – 130 | 30 | 260 | 120 |
| **Diastolic BP (mmHg)** | 70 – 85 | 20 | 160 | 80 |
| **Heart Rate (bpm)** | 60 – 100 | 20 | 240 | 76 |
| **Temperature (°F)** | 97.5°F – 99.0°F | 80°F | 108°F | 98.6°F |
| **Respiratory Rate (rpm)** | 12 – 20 | 5 | 60 | 16 |

---

### 3.2 Scoring Formula & Urgency Tiers

The baseline score is set at **10 points**. Risk points accumulate cumulatively based on physiological deviations and red flags:

$$\text{Final Score} = \min\left(99, \, \max\left(12, \, 10 + \sum S_{\text{vitals}} + \sum S_{\text{symptoms}} + S_{\text{maternal}}\right)\right)$$

```mermaid
flowchart TD
    Start(["Intake Patient Vitals & Symptoms"]) --> Clean["Sanitize & Bound Vitals"]
    Clean --> CheckO2{"SpO2 Level?"}
    
    CheckO2 -- "< 88%" --> Add55["+55 Score\nCritical Hypoxemia"]
    CheckO2 -- "88 - 92%" --> Add35["+35 Score\nSignificant Hypoxemia"]
    CheckO2 -- ">= 93%" --> NextBP["Evaluate Blood Pressure"]
    
    Add55 --> NextBP
    Add35 --> NextBP

    NextBP --> CheckBP{"BP Range?"}
    CheckBP -- "Systolic >= 170 or Diastolic >= 110" --> BP45["+45 Score (Crisis)"]
    CheckBP -- "Systolic < 85" --> BP40["+40 Score (Hypovolemic Shock)"]
    CheckBP -- "Systolic >= 145 or Diastolic >= 95" --> BP25["+25 Score (Hypertension)"]
    CheckBP -- "Normal" --> MaternalCheck["Maternal Alert Check"]
    
    BP45 --> MaternalCheck
    BP40 --> MaternalCheck
    BP25 --> MaternalCheck

    MaternalCheck --> Preg{"Is Pregnant?"}
    Preg -- "Yes" --> MatAlert{"Hypertension + Headache / Blurry Vision?"}
    MatAlert -- "Yes" --> MatHigh["+40 Score (Pre-Eclampsia Risk)"]
    MatAlert -- "No Bleed?" --> CheckBleed{"Vaginal Bleeding?"}
    CheckBleed -- "Yes" --> Antepartum["+50 Score (Antepartum Hemorrhage)"]
    CheckBleed -- "No" --> EmergKeywords["Emergency Symptoms Checklist"]
    MatHigh --> EmergKeywords
    Antepartum --> EmergKeywords
    Preg -- "No" --> EmergKeywords

    EmergKeywords --> FinalTally["Compute Final Score (12 - 99)"]

    FinalTally --> ScoreEval{"Score Threshold"}
    ScoreEval -- "Score >= 90 or SpO2 < 85" --> Emergency["EMERGENCY (Code Red)\nImmediate 108 transport to Tertiary Trauma Hospital"]
    ScoreEval -- "Score >= 80 or Danger Sign" --> High["HIGH RISK (Immediate)\nUrgent referral (<2h) to District Hospital / FRU"]
    ScoreEval -- "Score 45 - 79" --> Moderate["MODERATE RISK (Priority)\nEvaluate at CHC within 24h"]
    ScoreEval -- "Score < 45" --> Low["LOW RISK (Routine)\nSub-Centre / Home monitoring & red-flag precautions"]

    style Emergency fill:#fecaca,stroke:#dc2626,stroke-width:2px
    style High fill:#fed7aa,stroke:#ea580c,stroke-width:2px
    style Moderate fill:#fef08a,stroke:#ca8a04,stroke-width:2px
    style Low fill:#bbf7d0,stroke:#16a34a,stroke-width:2px
```

---

## 4. Emergency Referral Lifecycle & Hospital Dispatch

When an ASHA worker confirms a referral for an escalated patient, a unique cryptographic-like reference token is minted (e.g., `REF-2026-JH-8842`), synchronizing the frontline, the ambulance, and the receiving hospital.

```mermaid
sequenceDiagram
    autonumber
    actor ASHA as ASHA Frontline Worker
    participant App as SwasthyaSetu Engine
    participant Cache as Local Storage & Queue
    participant Hospital as District Hospital Triage
    participant Fleet as 108 Ambulance Dispatch
    actor Patient as Patient / Family

    ASHA->>App: Submits screening data on patient (Sita Devi)
    App->>App: Executes evaluateClinicalTriage()
    Note over App: Triage Result: HIGH RISK (Score: 84)<br/>Suspected Pre-Eclampsia
    ASHA->>App: Selects District Hospital Hazaribagh & Dispatches Referral
    App->>Cache: Persists referral record locally (Immediate offline safety)
    App->>Hospital: Transmits referral payload & patient vitals
    App->>Fleet: Sends automatic 108 Ambulance dispatch notification
    Hospital-->>App: Acknowledges case ("Hospital Accepted" & Bed Reserved)
    App->>Patient: Displays Active Referral Banner on Patient Portal
    Patient->>App: Tracks real-time status and ambulance ETA
```

---

## 5. Offline-First Synchronization Architecture

Rural healthcare settings experience frequent network drops. SwasthyaSetu implements an **Optimistic Local-First Architecture**:

```mermaid
stateDiagram-v2
    [*] --> OnlineState

    OnlineState --> NetworkDrop: Device loses cellular / Wi-Fi
    NetworkDrop --> OfflineState: Online indicator toggles to RED

    state OfflineState {
        [*] --> LocalDrafting
        LocalDrafting --> BufferQueue: User saves Patient / Referral
        BufferQueue --> PendingSyncBadge: Increments pending badge counter
    }

    OfflineState --> NetworkRestored: Connection regained
    NetworkRestored --> SyncExecution: User clicks "Sync Now" or auto-poll triggers

    state SyncExecution {
        FetchQueue --> ProcessBatch: FIFO extraction
        ProcessBatch --> ServerReplication: Push to remote API
        ServerReplication --> ConflictResolution: Verify server timestamps
        ConflictResolution --> PurgeLocalBuffer: Clear synced items
    }

    SyncExecution --> OnlineState: All records replicated (Online GREEN)
```

### 5.1 Storage Schema & Sync Payload

Pending offline transactions are queued in LocalStorage under `swasthya_setu_pending_sync`:

```json
[
  {
    "id": "SYNC-TXN-17181045",
    "entityType": "REFERRAL",
    "action": "CREATE",
    "timestamp": "2026-10-11T10:20:00Z",
    "payload": {
      "referralId": "REF-2026-JH-8842",
      "patientId": "P-JH-101",
      "patientName": "Sita Devi",
      "targetHospitalId": "HOSP-01",
      "priority": "HIGH",
      "triageScore": 84
    },
    "retryCount": 0
  }
]
```

---

## 6. Entity Relationship & Data Model

```mermaid
erDiagram
    PATIENT ||--o{ TRIAGE_ASSESSMENT : undergoes
    PATIENT ||--o{ REFERRAL : receives
    PATIENT ||--o{ APPOINTMENT : books
    PATIENT ||--o{ LAB_REPORT : has
    HOSPITAL ||--o{ REFERRAL : receives_incoming
    HOSPITAL ||--o{ APPOINTMENT : hosts
    HOSPITAL ||--|| BED_CAPACITY : maintains

    PATIENT {
        string id PK
        string name
        int age
        string gender
        boolean isPregnant
        int pregnancyWeeks
        string village
        string abhaId
        string emergencyContactPhone
    }

    TRIAGE_ASSESSMENT {
        string id PK
        string patientId FK
        datetime evaluatedAt
        string riskLevel
        int riskScore
        string urgencyLevel
        string requiredFacilityType
        json clinicalRationale
    }

    REFERRAL {
        string id PK
        string patientId FK
        string hospitalId FK
        string status "Draft | Sent | Accepted | Completed"
        string priority "Routine | Priority | Emergency"
        datetime timestamp
        string ambulanceStatus "En Route | Dispatched | Arrived"
    }

    HOSPITAL {
        string id PK
        string name
        string category "District Hospital | CHC | Sub-Centre"
        string address
        float distanceKm
        string contactPhone
    }

    BED_CAPACITY {
        string hospitalId FK
        int icuTotal
        int icuAvailable
        int maternityTotal
        int maternityAvailable
        int oxygenTotal
        int oxygenAvailable
        datetime lastUpdated
    }
```

---

## 7. Security, Privacy & Medical Safety Safeguards

1. **Role-Based Access Control (RBAC):**
   - Frontline ASHA workers operate isolated patient intake routes.
   - Citizen users access individualized health lockers and referral tracking via authenticated sessions.
2. **Ayushman Bharat Digital Mission (ABDM) Alignment:**
   - 14-digit ABHA IDs (`XX-XXXX-XXXX-XXXX`) form the basis of longitudinal patient identity without exposing plaintext Aadhaar numbers.
3. **Medical Safety Language & Disclaimers:**
   - The CDSS algorithm provides **Clinical Decision Support**, not automated diagnosis.
   - Every referral and assessment explicitly renders a medical advisory that the scoring model does not replace a physical examination by a registered medical practitioner (RMP).

---

## 8. Verification & Test Suite

The project includes an automated test harness covering realistic clinical cases:

```bash
npm test
```

- **`tests/triage.test.mjs`:** Tests pre-eclampsia detection, hypoxemic respiratory emergency scoring, antepartum hemorrhage classification, pediatric dehydration prioritization, and vitals sanitization edge cases.
- **`sample-data/clinical-cases.json`:** Comprehensive test vectors designed with actual rural public health clinical benchmarks.
