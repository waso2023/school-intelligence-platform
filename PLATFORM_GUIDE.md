# SOP SCHOOL INTELLIGENCE PLATFORM
## Comprehensive System Capabilities & Architectural Guide

**Product Name:** SOP Enterprise School Management & AI Intelligence Platform  
**Target Market:** Kenyan Private & International Schools  
**Supported Curricula:** Kenya Competency-Based Curriculum (CBC) & Cambridge International (CAIE)  
**Reference Institution:** SOP International Academy (Karen Campus, Nairobi — Tenant `school-sop-001`)  
**Live Preview URL:** [http://localhost:3001](http://localhost:3001)  
**Date:** October 2026  

---

## 1. What This Platform Is & The Problem It Solves

Most school management systems in Kenya are outdated digital filing cabinets paired with basic accounting modules. They suffer from several critical shortcomings:
- **Zero Predictive Insight:** School heads only discover that a student is failing or skipping school weeks after the fact, when it is too late to intervene.
- **Curriculum Rigidity:** Systems cannot cleanly handle schools that run both Kenya CBC (Junior Secondary EE, ME, AE, BE rubric) and Cambridge IGCSE (percentage assessment weightings and letter grades $A^*$ to $U$).
- **Manual Financial Hassles:** Bursars spend days manually matching Safaricom M-Pesa messages with paper bank slips and spreadsheet ledgers.
- **Generic "One-Size-Fits-All" Screens:** Teachers, bursars, receptionists, parents, and principals all see variations of the same cluttered dashboard.

The **SOP School Intelligence Platform** is built from the ground up as a modern, multi-role SaaS platform. It combines **daily school operations** with **deterministic, explainable AI intelligence** and **Kenyan financial and communication integrations**.

---

## 2. Who Uses It & What Each Person Sees

When a user logs in (or when an evaluator uses the 1-click **Persona Switcher** in the top navigation bar), the platform transforms the navigation sidebar, dashboard metric cards, operational registers, and available action buttons to match that person's job:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ROLE-ADAPTIVE USER EXPERIENCES                                   │
├────────────────────┬────────────────────┬────────────────────┬─────────────────┬─────────────────┤
│    SUPER ADMIN     │      TEACHER       │    RECEPTIONIST    │     FINANCE     │     PARENT      │
├────────────────────┼────────────────────┼────────────────────┼─────────────────┼─────────────────┤
│ • Macro KPIs       │ • Custom Classes   │ • Visitor Badges   │ • Fee Billings  │ • Child Dossier │
│ • Capacity Bars    │ • Roll Call Pills  │ • Late Slips       │ • M-Pesa IPN    │ • Term Balance  │
│ • Arrears Tracking │ • Active Timetable │ • Medication Drops │ • Aging Ledgers │ • Exam Marks    │
│ • Audit Trails     │ • Class Risk Flags │ • Intercom Ext     │ • STK Push      │ • Attendance %  │
└────────────────────┴────────────────────┴────────────────────┴─────────────────┴─────────────────┘
```

### 2.1 The Super Admin & Principal Perspective
* **Executive Institutional Cockpit:** Real-time visibility into overall enrollment (312 students), daily attendance rate (94.6%), collected fees (KSh 19.5M), and active fee arrears (KSh 5.39M).
* **Faculty Attendance & Academic Delivery Monitor (NEW):**
  * **Daily Arrival & Clock-in Ledger:** Tracks every educator's morning arrival time (e.g., Sarah Wanjiku at `07:38 AM`, James Mutua at `07:44 AM`, Brian Odhiambo at `07:32 AM`), flagging late arrivals (Grace Kilonzo at `08:12 AM` with traffic notes) and excused medical absences.
  * **Daily Teaching Periods Gauge:** Shows live periods scheduled vs. periods taught today (e.g. 3 of 4 periods completed, with interactive visual completion bars).
  * **Syllabus Coverage & Pacing Engine:** Tracks Term 1 syllabus completion percentage against curriculum benchmarks (e.g., Week 7 target: 70%). Instantly highlights teachers ahead of schedule (Esther Chebet at 81%, James Mutua at 78%) versus teachers requiring pacing intervention (Grace Kilonzo at 64%).
  * **Schemes of Work & Formative Gradebook Compliance:** Displays Deputy Principal approval status for weekly schemes of work and formative assessment gradebook entry rates (CAT 1 & practical marks entered).
  * **Supervisory Directives & Commendations:** 1-click modal to dispatch official notices via staff portal & SMS (Executive Commendations, Punctuality Reminders, Lesson Plan Pacing Queries, and Principal Executive Briefings).
* **Grade Capacity Utilization:** Visual capacity bars tracking seat occupancy from Grade 7 through Year 11, with color-coded alerts when classes cross 90% capacity.
* **School-Wide Risk Alerts:** Instant banners highlighting students with sharp academic declines or chronic attendance drops.
* **Institutional Governance:** School profile management, 9-role permission matrix, and full Kenya Data Protection Act 2019 (KDPA) audit trails.

### 2.2 The Personalized Teacher Workspaces
Teachers do not share a generic interface. Each teacher gets an isolated classroom workspace mapped to their assigned homeroom, subjects, and timetable:
* **Sarah Wanjiku (`teacher.sarah@sopacademy.ac.ke`)**:
  * Homeroom: **Grade 8 East** (32 students) and Grade 8 West.
  * Subjects: Integrated Science and Mathematics.
  * Active schedule: Highlights Morning Roll Call & Science Laboratory periods.
  * Intervention Alerts: Directly flags students in her class (e.g. *Zawadi Muthoni* at 87.4% attendance).
* **James Mutua (`teacher.james@sopacademy.ac.ke`)**:
  * Homeroom: **Grade 7 North** (28 students) and Grade 7 South.
  * Subjects: Integrated Science in Science Lab 1.
* **Brian Odhiambo (`teacher.brian@sopacademy.ac.ke`)**:
  * Homeroom: **Year 10 Alpha** (23 students).
  * Subjects: Cambridge IGCSE Physics in Senior Physics Lab.
* **1-Click Class Roll Call Register:** Teachers take attendance directly with single-click status pills (`Present`, `Late`, `Absent`, `Excused`) updating live class counters in real time.

### 2.3 The Front Desk & Receptionist Portal
Located at [`/dashboard`](http://localhost:3001/dashboard) when logged in as Receptionist (`reception@sopacademy.ac.ke`):
* **Gate Visitors & Badge Management:** Tracks active visitors on campus with issued badge IDs (`#V-101`), host staff members, purpose of visit, and 1-click checkouts.
* **Gate Late Arrival Slips:** Automatically issues traceable late slips (e.g. `GATE-2026-042`) for students arriving past the 08:00 AM homeroom bell, recording guardian reasons.
* **Medication & Item Drop-Off Tracker:** Secure custody ledger for student medicines (e.g. asthma inhalers) and forgotten PE gear, with a "Mark Handed Over" toggle.
* **Staff Intercom Directory:** Instant extension lookup for Principal (Ext 101), Bursar (Ext 104), Infirmary (Ext 108), Transport (Ext 112), and Gate Security (Ext 100).

### 2.4 The Finance Officer / Bursar Perspective
Located at [`/finance`](http://localhost:3001/finance):
* **Fee Billing & Itemized Invoicing:** Generates student invoices with specific line items (Tuition, Science Labs, Lunch Catering, Boarding).
* **Payment Entry & Official Receipts:** Records M-Pesa, Bank, and Cash payments, instantly recalculates balances, and issues sequential vouchers (`REC-2026-XXXX`).
* **Arrears Aging Reports:** Categorizes unpaid balances into aging buckets (`0–30 days`, `31–60 days`, `61–90 days`, `90+ days`).
* **1-Click Broadcast Reminders:** Dispatches fee balance alerts to parents via SMS.

### 2.5 The Parent Perspective
Located at [`/students/std-001`](http://localhost:3001/students/std-001):
* **Strict Relationship Scoping:** Parents (e.g. David Kimani) can **only** access their own linked child (Kevin Kimani).
* **Child Dossier:** Live term balance (KSh 25,000), payment receipts (`REC-2026-0089`), attendance record (96.8%), continuous assessment test (CAT) marks, and teacher remarks.

### 2.6 The Student Perspective
* Clean, uncluttered academic cockpit showing daily lesson schedule, laboratory rooms, continuous assessment marks, and homework deadlines.

### 2.7 The Institutional Data Migration & Import Center (SUPER ADMIN ONLY)
Located at [`/settings/data-import`](http://localhost:3001/settings/data-import):
* **Strict Super Admin Exclusivity:** Due to the sensitivity of bulk student persistence, schema mapping, and database rollbacks, this utility is **strictly accessible only to the Super Administrator (`SUPER_ADMIN`)**. All other roles (Principals, School Admins, Teachers, Finance Officers, Receptionists, Parents, and Students) are rejected at the UI route with a dedicated security warning card, excluded from the sidebar navigation, and blocked with HTTP `403 Forbidden` across all migration API endpoints (`/api/migration/validate` and `/api/migration/import`).
* **Dual Spreadsheet Engine (.xlsx & CSV):** Natively parses Microsoft Excel workbooks and RFC 4180 CSVs, completely resolving column displacement caused by commas in addresses or parent names.
* **Interactive Drag-and-Drop Dropzone:** Administrators drag and drop real school spreadsheets directly into the browser with live file size, type, and sheet detection.
* **Configurable Duplicate Resolution Policy:**
  * 🛡️ *Skip Existing:* Enrolls only newly identified learners while preserving existing student profiles.
  * 🔄 *Update Existing (Upsert):* Refreshes class placements and guardian phone contacts.
  * 🛑 *Strict Reject:* Enforces strict unique constraints across student admission numbers.
* **Kenyan Phone Normalization:** Automatically standardizes local phone inputs (`07XX...` / `01XX...` / `254...`) to international E.164 (`+254...`).
* **Real Entity Persistence:** Persists enrolled learners directly into the active school directory with CBC and Cambridge curriculum mapping.
* **Historical Batches Ledger & 1-Click Rollback:** Audits all executed import jobs with batch IDs, records committed, and timestamps, allowing Super Administrators to safely revert/rollback an import batch with a single click.

---

## 3. How AI Works Inside the System (School Intelligence)

A key architectural design principle is **anti-hallucination and explainability**. Rather than letting an AI model generate unconstrained SQL or guess facts, the platform uses a **three-part deterministic architecture**:

```
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                      User Query / Analytical Inquiry                      │
 └─────────────────────────────────────┬─────────────────────────────────────┘
                                       │
                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                  AI Tool Dispatcher & Intent Classifier                   │
 └─────────┬───────────────────────────┬───────────────────────────┬─────────┘
           │                           │                           │
           ▼                           ▼                           ▼
 ┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
 │ Relational Tools  │       │ 4-Vector Risk     │       │ Vector RAG        │
 │ • getSchoolSummary│       │ Diagnostic Engine │       │ Policy Search     │
 │ • getClassMetrics │       │ (0 - 100 Score)   │       │ (School Handbook) │
 │ • getFeeArrears   │       │                   │       │                   │
 └─────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       │
                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                        Structured 4-Tier Response                         │
 │  1. Observed Data (Hard Numbers)      3. Policy Interpretation (Handbook) │
 │  2. Correlated Analysis (Trends)      4. Recommended Interventions (Staff)│
 └───────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Explainable 4-Vector Student Risk Engine
Every student is evaluated against 4 objective vectors to compute an explainable risk score ($0 - 100$):
1. **Academic Trajectory:** Term-over-term grade drop $\ge 10\%$ adds $+20$ to $+35$ penalty points; overall average $<60\%$ adds $+25$ points.
2. **Attendance Reliability:** Cumulative attendance $<90\%$ adds $+15$ to $+30$ points; $\ge 2$ consecutive unexcused absences adds $+10$ points.
3. **Fee Arrears:** Outstanding balance $\ge \text{KSh } 25,000$ past due date adds $+15$ points.
4. **Discipline Incident Log:** Documented behavioral infractions add $+10$ to $+20$ points.

**Result:** Categorized into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL` with **human-readable reasons** and **prescriptive remedial actions** (e.g. *Schedule remedial mathematics tutoring*, *Convene pastoral conference with guardian*).

### 3.2 AI Tool Dispatcher
Authorizes and executes specific relational query tools:
* `getSchoolSummary`: Macro pass rates, median scores, collection efficiency.
* `getAtRiskStudents`: Cohorts flagged by the risk engine.
* `getClassPerformance`: Grade-by-grade academic averages and attendance.
* `getFeeArrearsSummary`: Classes and accounts with highest unpaid debt.
* `getAttendanceSummary`: Chronic truancy and lateness tallies.

### 3.3 Vector RAG School Policy Assistant
Pre-indexed verified institutional documents:
* Academic Assessment & Promotion Policy (2026)
* Attendance & Truancy Enforcement Guidelines
* Tuition Fees & Arrears Collection Policy
* Student Code of Conduct & Disciplinary Procedures

The AI cites exact policy sections (e.g. *Section 4.2: Truancy Thresholds*) when answering questions about rules or penalties.

---

## 4. Financial & Safaricom Daraja M-Pesa Engine

* **Phone Number Formatting:** Cleans and formats Kenyan mobile numbers into international standard (`2547XXXXXXXX` or `2541XXXXXXXX`).
* **Express STK Push Initiation:** Dispatches immediate payment prompts directly to parents' mobile phones.
* **Idempotent Webhook Listener (`/api/finance/mpesa/callback`):**
  * Safaricom IPN callbacks are processed with **idempotency checks**.
  * If network retries deliver the exact same `MpesaReceiptNumber` multiple times, the system acknowledges the callback without creating duplicate payments or ledger credits.
* **Financial Ledger & Receipts:** Automatically marks invoices as `PAID` or `PARTIAL`, recalculates student balance, and issues sequence receipts (`REC-2026-XXXX`).

---

## 5. Communication & Automated Alerts

* **Multi-Channel Delivery:** Provider abstraction supporting Africa's Talking SMS, WhatsApp Cloud API, and Email with safe local Mock fallback.
* **Dynamic Variable Templates:** Replaces variables like `{student_name}`, `{parent_name}`, `{balance}`, and `{due_date}` automatically.
* **Duplicate Send Protection:** 5-minute deduplication hashing window prevents accidental double-sends if a user clicks "Broadcast" multiple times.
* **Automated Notification Triggers:**
  * Low attendance alert sent to parent when a child is marked absent.
  * Fee balance reminder SMS sent with Paybill and child admission number.
  * Immediate admission confirmation message upon student enrollment.

---

## 6. Administration & Conflict-Free Scheduling

* **Collision-Proof Timetable Engine:**
  * Checks for **Teacher double-booking**: Throws `TIMETABLE_TEACHER_CONFLICT` if a teacher is already assigned elsewhere during that period.
  * Checks for **Room double-booking**: Throws `TIMETABLE_ROOM_CONFLICT` if a classroom or science lab is already occupied.
* **Transport Fleet & Routes:**
  * Route management (Kilimani, Karen, Westlands) with Isuzu bus registration numbers, driver contacts, pickup stops, and passenger counts.
* **Pastoral Care & Disciplinary Incident Tracking:**
  * Incident logging with severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), reporting staff member, and resolution statuses (`OPEN`, `INVESTIGATING`, `COUNSELING`, `RESOLVED`).

---

## 7. Dual-Curriculum Academic Engine (CBC & Cambridge)

* **Kenyan CBC Track (Junior Secondary):**
  * Rubric evaluation: Exceeding Expectations (EE, 80–100%), Meeting Expectations (ME, 65–79%), Approaching Expectations (AE, 50–64%), Below Expectations (BE, 0–49%).
* **Cambridge International Track (CAIE / IGCSE):**
  * Weighted assessments: Continuous Assessment Tests (30%) + Mid-Term (30%) + Finals (40%) = 100%.
  * Letter grades: $A^*$ (90–100%), $A$ (80–89%), $B$ (70–79%), $C$ (60–69%), $D$ (50–59%), $E$ (40–49%), $U$ (<40%).
* **Visual Exam Analytics:** Interactive Recharts line charts (multi-term progression) and bar charts (departmental subject averages).

---

## 8. Security & Legal Compliance (KDPA 2019)

* **Multi-Tenant Relational Isolation:** Every database entity is strictly partitioned by `schoolId`. Requests for other schools are rejected at the edge middleware and service layers.
* **Parent-Child Privacy:** Parents can only see their own children. Calling `/api/students/std-002` while logged in as Kevin's parent throws `SECURITY_VIOLATION: Parent access restricted to linked child only`.
* **Student Self-Access Only:** Students can only see their own marks and timetable.
* **Tamper-Proof Sessions:** Signed with 256-bit WebCrypto JWTs in HTTP-Only, Secure, SameSite cookies.
* **Automated Testing Harness:** 49 automated unit and security tests run on every commit, verifying 100% test pass rates across all 10 core modules.

---

## 9. Quick Verification & Demo Credentials

The system is running live on **[http://localhost:3001](http://localhost:3001)**. Evaluators can use the 1-click header switcher or log in directly with these accounts:

| Role | Account Email | Password | Primary Feature View |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@sopacademy.ac.ke` | `Admin@2026!` | Macro KPIs, executive alerts, governance settings |
| **Teacher (Grade 8)** | `teacher.sarah@sopacademy.ac.ke` | `Teacher@2026!` | Grade 8 East register, math timetable, class flags |
| **Teacher (Grade 7)** | `teacher.james@sopacademy.ac.ke` | `Teacher@2026!` | Grade 7 North register, science timetable, class flags |
| **Teacher (Year 10)** | `teacher.brian@sopacademy.ac.ke` | `Teacher@2026!` | Year 10 Alpha Cambridge physics register, timetable |
| **Receptionist** | `reception@sopacademy.ac.ke` | `Reception@2026!` | Visitor badges, gate late slips, drop-offs, intercom |
| **Finance Officer** | `finance.peter@sopacademy.ac.ke` | `Finance@2026!` | Fee billing, M-Pesa ledger, aging brackets |
| **Parent** | `parent.david@sopacademy.ac.ke` | `Parent@2026!` | Child dossier (Kevin Kimani), fees, attendance |
| **Student** | `student.kevin@sopacademy.ac.ke` | `Student@2026!` | Daily timetable, lab locations, CAT grades |

---

## 10. Real-Time Zero-Data-Loss Persistent Database Engine & PostgreSQL Synchronization

To ensure immediate, reliable operations without depending on an external server being pre-installed or running, the platform features a **Dual-Layer Real-Time Persistent Storage Engine**:

### 10.1 Dual-Layer Storage Architecture
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SOP PERSISTENT STORAGE ENGINE                             │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│          LAYER 1: INSTANT DISK ACID       │        LAYER 2: ENTERPRISE POSTGRESQL      │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Zero configuration required             │ • High concurrency & multi-tenant scaling │
│ • Atomic disk writes (temp file + rename) │ • Relational foreign key constraints       │
│ • Persisted immediately under             │ • Connected via Prisma ORM                 │
│   `data/database/*.json`                  │ • 1-Command CLI push: `npm run db:setup`   │
│ • Zero data loss across server restarts   │ • Full Docker and Native installer support │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

1. **Layer 1: Resilient Atomic Disk Persistence (`data/database/*.json`):**
   * Every addition, update, or deletion is committed atomically to durable disk storage.
   * Survives server reboots, hot reloads, and browser refreshes with zero data loss.
   * Dynamic server-only isolation ensures client bundles stay lightweight without Webpack `fs` bundling issues.

2. **Layer 2: Relational PostgreSQL Server via Prisma ORM:**
   * Enterprise-grade PostgreSQL engine with strict relational models for multi-tenant isolation.
   * Automatically synchronizable using the custom migration script:
     ```bash
     npm run db:setup
     ```

### 10.2 Live Verified Interactive Data Entities
You can add, edit, and query records across the following real-time modules:

1. **Students & Guardian Admissions:**
   * **Route:** [`/students`](http://localhost:3001/students) → Click **"Admit New Student"**
   * **Storage File:** `data/database/students.json`
   * **Attributes:** Full name, admission number, grade/stream, curriculum track (CBC/Cambridge), guardian details, emergency contacts, medical notes, fee balances.
2. **Staff & Faculty Profiles:**
   * **Route:** [`/administration?tab=staff`](http://localhost:3001/administration) → Click **"Add Staff Member"**
   * **Storage File:** `data/database/staff.json`
   * **Attributes:** Staff ID, name, role/department, email, phone, teaching workload.
3. **Fee Invoicing & Payment Records:**
   * **Route:** [`/finance`](http://localhost:3001/finance) → Click **"Record Payment"**
   * **Storage Files:** `data/database/invoices.json` & `data/database/payments.json`
   * **Attributes:** Student ID, amount, payment method (M-Pesa / Bank Slip / Cash), transaction reference, receipt generation (`REC-2026-XXXX`).
4. **Daily Attendance Registers:**
   * **Route:** [`/students/attendance`](http://localhost:3001/students/attendance) → Select Class → Click **"Save Daily Register"**
   * **Storage File:** `data/database/attendance.json`
   * **Attributes:** Class, date, student IDs with statuses (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`), notes, real-time rate updates.
5. **School Announcements & Direct Messages:**
   * **Route:** [`/communication`](http://localhost:3001/communication) → Click **"New Broadcast"**
   * **Storage Files:** `data/database/announcements.json` & `data/database/messages.json`
   * **Attributes:** Audience, title, body content, channels (SMS, Email, Portal), publish timestamps.
6. **Timetable & Scheduling:**
   * **Storage File:** `data/database/timetable.json`
   * **Conflict Guard:** Automatically prevents teacher double-booking and room collisions.
7. **Transport Fleet & Routes:**
   * **Storage File:** `data/database/transport.json`
   * **Attributes:** Route names, bus registrations, capacity, driver contacts, passenger rosters.
8. **Disciplinary & Pastoral Incidents:**
   * **Storage File:** `data/database/discipline.json`
   * **Attributes:** Student ID, severity, incident summary, corrective actions, resolution status.

### 10.3 Quickstart: Connecting Local PostgreSQL
If you wish to spin up a local PostgreSQL instance:

**Option A — 1-Command Docker Setup:**
```bash
docker run --name sop-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=school_intelligence_db -p 5432:5432 -d postgres:16-alpine
```

**Option B — Native Windows Installer:**
Install PostgreSQL 16 from [postgresql.org](https://www.postgresql.org/download/windows/) and set the superuser password to `postgres`.

Once running on port 5432, run:
```bash
npm run db:setup
```
The automated setup script will verify port 5432 connectivity, push the Prisma relational schema, and seed tenant credentials.
