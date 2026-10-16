# SCHOOL INTELLIGENCE PLATFORM
## Technical Whitepaper & Architectural Write-Up
**Product:** Multi-Tenant School Management & AI Intelligence SaaS Platform  
**Target Market:** Private & International Schools in Kenya (CBC & Cambridge / British Curriculum)  
**Reference Institution:** SOP International Academy (Karen Campus, Nairobi — Tenant `SOP-001`)  
**Development Milestones Completed:** Phase 1 (Core SaaS & RBAC) & Phase 2 (Student & Academic Management)  
**Local Preview URL:** [http://localhost:3001](http://localhost:3001)  
**Date:** October 2026

---

## 1. Executive Summary

Traditional school management systems in Kenya are typically isolated record databases with basic accounting plugins. They lack predictive capabilities, fail to support dual-track curricula (CBC and Cambridge International), and force administrators to manually analyze spreadsheets to uncover falling grades, fee arrears, or attendance anomalies.

The **School Intelligence Platform** is built from the ground up as a modern, multi-role SaaS application that merges:
1. **Core Institutional Operations:** Students, admissions, classes, streams, attendance, grading, fee billing, and staff.
2. **Kenyan Financial Integrations:** M-Pesa Daraja payment recording, automated reconciliations, and balance receipts.
3. **Multi-Channel Parent Engagement:** Automated SMS (Africa's Talking), WhatsApp Business API abstraction, and email notifications.
4. **AI School Intelligence Layer:** Natural language querying across authorized relational database tables and vector document search (RAG) for school policies.

---

## 2. System Architecture & Multi-Tenant Design

### 2.1 Multi-Tenant Isolation
The application operates on a shared-database, tenant-isolated relational model. Every school represents a discrete tenant identified by a unique `schoolId` (e.g., `school-sop-001`).

```
                    ┌──────────────────────────────────────────────┐
                    │          Client Browser Request              │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         Next.js Edge Middleware              │
                    │   • Validates Jose JWT Session Cookie        │
                    │   • Extracts Verified { userId, schoolId }   │
                    │   • Injects Request Headers                  │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      Server Component / API Route Handler    │
                    │   • Evaluates Required Permissions           │
                    │   • Attaches Tenant Scope: { schoolId }      │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       PostgreSQL Relational Database         │
                    │   • Filtered strictly by schoolId            │
                    │   • Indexed foreign keys and cascades        │
                    └──────────────────────────────────────────────┘
```

* **Server-Side Enforcement:** `schoolId` is strictly resolved on the server from the cryptographically verified JWT token. The client can never supply or modify the tenant ID.
* **Database Cascades:** Foreign keys across all 36 relational models ensure that deleting or archiving a tenant cleanly handles child records without orphaned data.

### 2.2 Authentication & Session Flow
* **JWT Engine:** Utilizes the WebCrypto-compliant `jose` library (`SignJWT` and `jwtVerify`). It is fully edge-compatible with zero node-runtime peer dependency friction in Next.js 15.
* **Credentials Security:** Plaintext passwords are encrypted using `bcryptjs` with salt rounds of 10.
* **Cookie Strategy:** Session tokens are delivered via HTTP-Only, SameSite (`lax`), Secure cookies (`sop_school_session`) with a 7-day expiration.
* **Edge Middleware (`middleware.ts`):** Automatically intercepts requests to `/dashboard`, `/students`, `/finance`, `/communication`, `/administration`, `/intelligence`, and `/settings`, redirecting unauthenticated traffic to `/login` with callback preservation.

### 2.3 Role-Based Access Control (RBAC) Matrix
Permissions are decoupled from static role names, allowing flexible policy enforcement:

* **Available Roles:** `SUPER_ADMIN`, `SCHOOL_ADMIN`, `PRINCIPAL`, `TEACHER`, `FINANCE_OFFICER`, `RECEPTIONIST`, `PARENT`, `STUDENT`, `DRIVER`.
* **Granular Permissions Catalog:**
  * **Students:** `students.view`, `students.create`, `students.edit`, `students.delete`
  * **Academics:** `academics.view`, `academics.manage`, `academics.grades.enter`
  * **Attendance:** `attendance.view`, `attendance.mark`
  * **Finance:** `fees.view`, `fees.manage`, `fees.record_payment`, `fees.reports`
  * **Communication:** `communication.view`, `communication.send`, `communication.announcements`
  * **Administration:** `staff.view`, `staff.manage`, `timetable.manage`, `events.manage`, `transport.view`, `discipline.view`, `documents.view`, `documents.manage`
  * **AI Intelligence:** `ai.use`, `ai.chat`, `ai.reports`, `ai.insights`
  * **Governance:** `settings.manage`, `audit.view`, `reports.view`, `reports.generate`

---

## 3. Implemented Modules (Phase 1 & Phase 2)

### 3.1 Module 1: Institutional Dashboard & Role Adaptation (Phase 1)
* **Adaptive Perspectives:** A single underlying codebase serves tailored interfaces based on authenticated roles:
  * **Executive (Super Admin / Principal):** Aggregated metrics (312 enrolled, 94.6% attendance, KSh 19.5M collected, KSh 5.39M arrears), live AI intelligence alert feed, and grade capacity distribution.
  * **Educator (Teacher):** Direct access to assigned classes (Grade 8 East), today's attendance checklist, and subject grade averages.
  * **Bursar (Finance Officer):** Billing totals, reconciled collections, pending balances, and recent M-Pesa receipts.
  * **Guardian (Parent):** Dossier for Kevin Kimani (Grade 8), term fee balance, attendance percentage, and recent exam marks.
  * **Learner (Student):** Daily lesson schedule, laboratory rooms, and CAT test results.
* **Quick Demo Role Switcher:** A 1-click header widget enabling evaluators to instantly switch between all 6 core personas without manual logout/login cycles.

### 3.2 Module 2: Full Student Profile Dossier (Phase 2)
Accessible at [`/students/[id]`](http://localhost:3001/students/std-001), the student profile features a 7-tab interface:
1. **Overview:** Biographical data, curriculum track (CBC / Cambridge), parent contacts (David Kimani, Senior Structural Engineer), and medical profile (blood group `O+`, allergies, emergency doctor, and hotline).
2. **Academic & Results:** Multi-term progression history, current subject evaluations (CAT 30%, Midterm 30%, Final 40%), letter grades (A through E), teacher remarks, and class ranking (#6 of 38).
3. **Attendance:** 96.8% attendance rate, total school days, absences, lateness, threshold check, and date-by-date daily register logs.
4. **Fees & Receipts:** Billed fees (KSh 85,000), total payments (KSh 60,000), balance (KSh 25,000), verified M-Pesa transaction reference (`QWE89284KL`), and printable receipts (`REC-2026-0089`).
5. **Discipline:** Pastoral care incident logs (type, date, severity `LOW/MEDIUM/HIGH/CRITICAL`, restorative actions taken, reporting teacher).
6. **Documents:** Digital repository of birth certificates, transfer clearance letters, and past term report cards.
7. **Communication:** Audit log of all SMS, WhatsApp, and email notifications dispatched to the guardian.

### 3.3 Module 3: Student Admission Flow (Phase 2)
Accessible via the **"Admit New Student"** modal on [`/students`](http://localhost:3001/students):
* Validated with **React Hook Form** and **Zod** (`StudentAdmissionSchema`).
* Form fields:
  * Personal Information (Auto-generated Admission Number `SOP-2026-XXXX`, Name, DOB, Gender, Status).
  * Academic Placement (Class, Stream, Curriculum track, Admission Date).
  * Guardian Information (Parent Name, Relationship, Kenyan Phone, Email, Residential Address).
  * Medical & Emergency (Blood Group, Allergies, Emergency Doctor & Phone).
* Live API integration with `POST /api/students` and automated SMS admission notice dispatch.

### 3.4 Module 4: Classes & Streams Capacity Tracking (Phase 2)
Accessible at [`/students/classes`](http://localhost:3001/students/classes):
* Hierarchy from Grade 7 through Year 11 (IGCSE), bound to Academic Year 2026 and Term 1.
* Visual capacity bars tracking seat occupancy (e.g., 32/35 enrolled in Grade 8 East, 23/25 in Year 10 Alpha) with color-coded warning indicators when approaching capacity limits (>90%).
* Mapping of dedicated Class Teachers and Stream Teachers for every grade.

### 3.5 Module 5: Subjects & Dual-Curriculum Tracking (Phase 2)
Accessible at [`/students/subjects`](http://localhost:3001/students/subjects):
* Dual-track curriculum tracking supporting both **CBC** and **Cambridge International** (IGCSE).
* Subject catalog (`MAT-101`, `ENG-101`, `SCI-102`, `KIS-104`, `SST-103`, `CAM-PHY`, `CAM-CHM`).
* Departmental classification (Mathematics, Languages, Sciences, Humanities), weekly lesson allocations, and syllabus strand outlines.

### 3.6 Module 6: Interactive Daily Attendance Register (Phase 2)
Accessible at [`/students/attendance`](http://localhost:3001/students/attendance):
* Classroom attendance register allowing teachers to record students as `Present`, `Absent`, `Late`, or `Excused` with custom remarks.
* Features "Mark All Present" batch controls and real-time attendance metric counters.
* **Automated Low-Attendance Heuristics:** Automatically flags students whose cumulative attendance drops below the 90% benchmark (e.g., *Zawadi Muthoni at 87.4%* triggers an alert banner with an action link to dispatch parent SMS notifications).

### 3.7 Module 7: Exams, Grading & Visual Performance Analytics (Phase 2)
Accessible at [`/students/exams`](http://localhost:3001/students/exams):
* Automated gradebook calculating raw marks, percentages, CBC letter grades, and official position rankings (1st, 2nd, 3rd...).
* **Recharts Visualizations:**
  * **Line Chart:** Multi-term progression comparison tracking Grade 7, Grade 8, and Year 10 term averages over time.
  * **Bar Chart:** Departmental subject averages benchmarked against the school target (75%).
* **Academic Decline Detection:** Identifies students experiencing severe term-over-term grade drops (e.g., *Zawadi Muthoni dropping from 74% to 59% [-15% decline]* triggers an AI intervention flag).

---

## 4. Technology Stack Summary

| Technology | Purpose in Platform |
| :--- | :--- |
| **Next.js 15+ (App Router)** | Primary full-stack framework with Server & Client Component separation |
| **TypeScript 5.7+** | Type safety across database schemas, APIs, and components |
| **Tailwind CSS** | Styling with an institutional color palette (Emerald, Navy, Gold) |
| **Prisma ORM 6.19+** | Database client generation, relational modeling, and seed migrations |
| **PostgreSQL** | Relational multi-tenant database engine |
| **Jose (JWT)** | Edge-compatible session tokens with cryptographic verification |
| **bcryptjs** | Password hashing for local institutional accounts |
| **React Hook Form + Zod** | Client- and server-side schema validation |
| **Recharts** | Interactive SVG visualizations for performance trends |
| **Lucide React** | Consistent UI iconography |

---

## 5. Security & Regulatory Compliance

* **Kenya Data Protection Act (2019):**
  * Student personal data and health records are restricted to authorized personnel.
  * Audit logs record user IDs, action names, timestamps, affected entities, and client IP addresses.
* **Password Standards:** Cryptographically salted and hashed using bcrypt.
* **Tamper-Proof Sessions:** JWT tokens signed with a 256-bit secret, stored in HTTP-Only cookies to mitigate XSS attacks.
* **Input Sanitization:** Every API endpoint validates payloads using Zod schemas before database processing.

---

## 6. Demo Accounts & Verification

The platform is running live at **`http://localhost:3001`**. Evaluators can log in using 1-click buttons or with the following credentials:

| Role | Name | Email | Password | Primary Perspective |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Dr. Evelyn Mwangi | `superadmin@sopacademy.ac.ke` | `Admin@2026!` | Full system governance, settings, audit logs |
| **Principal** | Prof. Arthur Ochieng | `principal@sopacademy.ac.ke` | `Principal@2026!` | Macro academic oversight, faculty workloads |
| **Teacher** | Sarah Wanjiku | `teacher.sarah@sopacademy.ac.ke` | `Teacher@2026!` | Grade 8 East class register, attendance, grading |
| **Finance Officer** | Peter Kipkorir | `finance.peter@sopacademy.ac.ke` | `Finance@2026!` | Fee billing, M-Pesa reconciliations, arrears |
| **Parent** | David Kimani | `parent.david@sopacademy.ac.ke` | `Parent@2026!` | Child dossier (Kevin Kimani), fees, attendance |
| **Student** | Kevin Kimani | `student.kevin@sopacademy.ac.ke` | `Student@2026!` | Timetable, grades, homework schedules |

---

## 7. Roadmap: Next Phases

* **Phase 3 — Fees & Finance Engine:** Dynamic fee structure builder by grade, M-Pesa Daraja C2B/STK Push integration layer, automated invoice generation, official PDF receipt downloads, and automated SMS balance reminders.
* **Phase 4 — Parent Communication & Portals:** Multi-channel broadcast center (SMS gateway via Africa's Talking, WhatsApp Business API abstraction, transactional email), template engine, and AI Parent Assistant.
* **Phase 5 — School Administration:** Staff management, weekly timetable calendar, school transport fleet tracking (buses, routes, pickup stops), discipline management, and policy document repository.
* **Phase 6 & 7 — AI School Intelligence & RAG:** Natural language database queries (`getStudentPerformance()`, `getFeeBalances()`), multi-factor student risk scoring, and vector document embeddings for school policy search.
