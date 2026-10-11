# SwasthyaSetu (स्वास्थ्य सेतु)

> **"From the last mile to the right care."**  
> *Unified frontline clinical decision support (CDSS), offline-first risk triage, and real-time hospital emergency referral network.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19.2.8-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178c6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646cff.svg)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38bdf8.svg)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Tests-10%20Passing-success.svg)](./tests/triage.test.mjs)

---

## 🌟 Executive Summary

**SwasthyaSetu** is designed to eliminate the **Three Delays** in rural and maternal healthcare:
1. **Delay in seeking care:** ASHA frontline health workers equipped with offline-first algorithmic risk stratification identify pre-eclampsia, respiratory distress, and sepsis in rural homes before emergencies escalate.
2. **Delay in reaching the right facility:** Real-time capacity awareness across nearby hospitals (ICU beds, maternal labor wards, on-duty specialists) prevents blind transfers.
3. **Delay in receiving care:** Automated emergency referrals (e.g. `REF-2026-JH-8842`) pre-alert hospital admission and triage teams while the 108 ambulance is en route.

Detailed architecture, C4 diagrams, and algorithmic models are documented in the [Technical Design Document (TECHNICAL_DESIGN.md)](./TECHNICAL_DESIGN.md).

---

## 🚀 Two Operational Portals

The application features **two separate, purpose-built interfaces**:

| Feature / Dimension | 🩺 ASHA Worker Portal (`/asha/...`) | 🏥 HospiTrack Patient Portal (`/patient/...`) |
| :--- | :--- | :--- |
| **Audience** | Frontline health workers (ASHAs / ANMs) | Patients, families, and rural citizens |
| **UX Philosophy** | Low-literacy friendly, larger tap targets, minimal jargon | Polished modern consumer healthcare experience |
| **Core Functions** | Offline patient screening, vital sign entry, clinical AI triage, emergency referral dispatch | Hospital discovery, live bed tracking, OPD token booking, NABL lab reports, referral timeline |
| **Connectivity** | Persistent Online/Offline indicator & local sync buffer | Real-time cloud discovery & tele-consultation |

---

## 🛠️ Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on `v24.14.1`)
- **npm**: `v9.0.0` or higher

---

## ⚙️ Setup & Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/chandra-1402/SwasthyaSetu.git
cd SwasthyaSetu
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration

Create a `.env` file by copying the provided `.env.example`:
```bash
cp .env.example .env
```

#### Environment Variables Reference

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_APP_NAME` | `"SwasthyaSetu"` | Application display name |
| `VITE_APP_VERSION` | `"1.0.0"` | Build version |
| `VITE_PORT` | `7000` | Port for local development server |
| `VITE_ENABLE_MOCK_DATA` | `true` | Enables offline simulation & sample clinical data |
| `VITE_API_BASE_URL` | `http://localhost:7000/api` | Base URL for remote backend services |
| `VITE_API_TIMEOUT_MS` | `10000` | Timeout threshold for network requests |
| `VITE_EMERGENCY_HOTLINE` | `"108"` | State emergency ambulance dispatch hotline |
| `VITE_MATERNAL_HOTLINE` | `"102"` | Maternal / infant transport helpline |
| `VITE_SMS_GATEWAY_URL` | `http://localhost:7000/api/sms` | Offline SMS notification webhook |
| `VITE_MAP_PROVIDER` | `"mock"` | Map provider (`"mock"` or `"mapbox"`) |
| `VITE_MAPS_API_KEY` | `""` | Optional API key for third-party map tiles |
| `VITE_ABHA_CLIENT_ID` | `"demo-abha-client"` | ABDM Sandbox Client ID for ABHA Health ID generation |
| `VITE_ABHA_SANDBOX_URL` | `https://healthidsbx.abdm.gov.in` | Ayushman Bharat Digital Mission API endpoint |
| `VITE_WEBRTC_SIGNALING_URL` | `wss://localhost:7000/ws` | WebRTC signaling endpoint for tele-consultations |

---

## 🏃 Running the Application

### Development Server
Starts the Vite dev server configured on **Port 7000**:
```bash
npm run dev
```
Open **[http://localhost:7000/](http://localhost:7000/)** in your browser.

### Run Automated Tests
Executes the clinical decision support triage test suite verifying clinical cases and edge cases:
```bash
npm test
```

### Production Build & Preview
```bash
# Typecheck and bundle for production
npm run build

# Preview production build locally
npm run preview
```

### Linting
```bash
npm run lint
```

---

## 🧪 Sample Data & Test Scenarios

The project includes realistic clinical test cases located in [`sample-data/clinical-cases.json`](./sample-data/clinical-cases.json):

1. **`CASE-MATERNAL-01` (Sita Devi - 26y, 32w pregnancy):** Severe frontal headache, blurred vision, BP 165/105 mmHg $\rightarrow$ **HIGH RISK** (Suspected Pre-Eclampsia / Imminent Eclampsia).
2. **`CASE-RESP-02` (Ramesh Mahto - 62y):** Severe acute respiratory distress, SpO2 82%, RR 34 $\rightarrow$ **EMERGENCY (Code Red)** (Acute Hypoxemic Respiratory Failure).
3. **`CASE-OBSTETRIC-03` (Pooja Kumari - 22y, 28w pregnancy):** Antepartum vaginal bleeding, tachycardia $\rightarrow$ **EMERGENCY (Code Red)** (Obstetric hemorrhage).
4. **`CASE-PEDIATRIC-04` (Aarav Kumar - 4y child):** Pyrexia (102.2°F), persistent vomiting, dehydration $\rightarrow$ **MODERATE RISK** (CHC referral within 24 hours).
5. **`CASE-ROUTINE-05` (Anita Devi - 24y, 16w pregnancy):** Normal physiological vitals, routine checkup $\rightarrow$ **LOW RISK** (Sub-centre home monitoring).

---

## 🧭 Navigation & Routes Sitemap

### Public
- `/` — Unified Landing Page with continuum workflow, dual-card portal selector, and hackathon banner
- `/how-it-works` — Clinical workflow and 6-stage triage-to-admission architecture
- `/about` — System vision, mission, and medical safety standards

### ASHA Worker Portal (`/asha/...`)
- `/asha/login` — Frontline authentication with offline indicator & 1-click Demo credentials
- `/asha/dashboard` — Daily metrics (12 Patients Today, 3 High Risk, 2 Referrals) & recent triage cases
- `/asha/register-patient` — Simple patient intake with pregnancy/child flags (1-click autofill for "Sita Devi")
- `/asha/triage` — **Core Innovation:** 4-stage realistic clinical animation, symptom/vitals scoring, HIGH-RISK result card, and referral trigger
- `/asha/referrals` — Real-time referral lifecycle tracking with "Simulate Hospital Acceptance" button
- `/asha/hospitals` — Hospital directory with live ICU/maternity bed readiness and direct referral dispatch
- `/asha/patients` — Community patient registry with offline status flags
- `/asha/sync` — Offline sync manager with pending local storage queue and sync animation
- `/asha/profile` — ASHA Worker credentials (Sunita Devi, ID: `ASHA-JH-10234`, Sub-Centre Salga)

### HospiTrack Patient Portal (`/patient/...`)
- `/patient/login` — Consumer authentication with mobile/OTP and 1-click Demo login
- `/patient/dashboard` — Consumer health dashboard with **Active Emergency Referral Banner**
- `/patient/hospitals` — Hospital discovery with interactive Radar Map UI and live bed badges
- `/patient/appointments` — OPD specialist booking with priority digital token passes
- `/patient/reports` — Diagnostic lab slips (CBC, Ultrasound, Urine Routine) with interactive viewer modal & download
- `/patient/referrals` — "My Referrals" showing the exact referral generated by ASHA Worker with live status timeline
- `/patient/health-records` — Longitudinal vitals history, blood group, allergies, and ABHA QR card
- `/patient/profile` — Citizen profile and designated emergency contact

---

## ⚡ 3-Minute Hackathon Demo Walkthrough

Judges can click the **"⚡ 3-Min Demo Guide"** button in the header at any time, or execute the following 14-step cycle:

1. **Open Landing Page (`/`):** View the mission, continuum diagram, and the two portal cards.
2. **Enter ASHA Portal (`/asha/login`):** Click *"Use Demo ASHA Account"* to log in as Sunita Devi.
3. **Inspect ASHA Dashboard (`/asha/dashboard`):** Notice the 12 daily cases, 3 high-risk cases, and offline connectivity badge.
4. **Register Patient (`/asha/register-patient`):** Click *"Autofill Sita Devi (Demo)"* (26 yrs, 32w pregnancy) and press *"Continue to Assessment"*.
5. **Screen Vitals & Symptoms (`/asha/triage`):** High-risk maternal symptoms (headache, vision blur) and vitals (BP: 165/105 mmHg, SpO2: 96%, HR: 104 bpm) are populated.
6. **Execute AI-Assisted Triage:** Click *"Run AI-Assisted Triage"*. Observe the 4-stage clinical simulation:
   - Stage 1: Analyzing symptoms...
   - Stage 2: Applying clinical decision rules...
   - Stage 3: Assessing risk stratification...
   - Stage 4: Generating referral recommendation...
7. **Review Result:** High Risk (🔴 HIGH RISK, Score: 84/100, Pre-Eclampsia risk) with strict medical disclaimer.
8. **Find Suitable Hospital:** Click *"Find Suitable Hospital"*. The system compares nearby facilities by distance, ICU beds, and emergency readiness.
9. **Dispatch Referral:** Select *"District Hospital Hazaribagh"* and click *"Create Emergency Referral"*. Instant ID `REF-2026-JH-XXXX` is generated.
10. **Track Referral (`/asha/referrals`):** View the timeline. Click *"Simulate Hospital Acceptance (Demo)"* to observe the live status change to **"Hospital Accepted"** and 108 ambulance dispatch!
11. **Switch to Patient Portal (`/patient/dashboard`):** Click *"Switch to Patient View"*.
12. **Verify Active Referral Banner:** The Patient Dashboard immediately displays the high-risk emergency referral banner for Sita Devi!
13. **Open "My Referrals" (`/patient/referrals`):** Verify that the patient sees the identical referral ID and accepted timeline.
14. **Test Offline Sync (`/asha/sync`):** Toggle offline mode in the navbar, observe the offline buffer, and click *"Sync Now"* to trigger local-to-cloud replication.

---

## 🛡️ Medical Safety & Compliance

- **Decision Support Language:** The application strictly uses *"AI-assisted triage"*, *"clinical decision support"*, and *"risk classification"*. It explicitly avoids terms like *"AI diagnosis"* or *"AI doctor"*.
- **Clinical Safety Disclaimer:** Every triage card and report viewer embeds an explicit notice that all final evaluations must be performed by licensed healthcare practitioners.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
