# SOP International Academy — School Intelligence Platform
> **Next-Generation Multi-Tenant School Management & AI Intelligence Platform for Kenyan Private and International Schools.**

---

## 🏛️ Overview

The **School Intelligence Platform** is a multi-tenant SaaS application designed to streamline daily educational operations, automated fee billing with M-Pesa reconciliations, parent communications, and executive RAG-driven AI intelligence for private and international academies in Kenya (such as British Curriculum, CBC, and Cambridge International institutions).

---

## 🔐 1-Click Demo Accounts (Phase 1)

All demo accounts belong to the demo tenant **`SOP-001` (SOP International Academy)**. You can select them directly with one click on the login screen or sign in with the credentials below:

| Role | Name | Email | Password | Primary Scope & Access |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Dr. Evelyn Mwangi | `superadmin@sopacademy.ac.ke` | `Admin@2026!` | All modules, audit logs, system RBAC |
| **Principal** | Prof. Arthur Ochieng | `principal@sopacademy.ac.ke` | `Principal@2026!` | Institutional academics, faculty, finance overview |
| **Teacher** | Sarah Wanjiku | `teacher.sarah@sopacademy.ac.ke` | `Teacher@2026!` | Grade 8 East, daily attendance, grade entry |
| **Finance Officer** | Peter Kipkorir | `finance.peter@sopacademy.ac.ke` | `Finance@2026!` | Fee billing, M-Pesa reconciliations, arrears |
| **Parent** | David Kimani | `parent.david@sopacademy.ac.ke` | `Parent@2026!` | Child: Kevin Kimani (Grade 8 East), fee balances |
| **Student** | Kevin Kimani | `student.kevin@sopacademy.ac.ke` | `Student@2026!` | Timetable, exam results, attendance record |
| **Receptionist** | Grace Auma | `reception@sopacademy.ac.ke` | `Reception@2026!` | Front desk, student admissions, school calendar |

---

## 🏗️ Technology Stack

* **Framework:** Next.js 15+ (App Router)
* **Language:** TypeScript 5.7+
* **Styling & UI:** Tailwind CSS, custom shadcn/ui components
* **Database & ORM:** PostgreSQL + Prisma ORM 6.19+
* **Authentication:** Secure Jose JWT (`SignJWT`/`jwtVerify`) + HTTP-Only SameSite Cookies + bcryptjs
* **Validation:** Zod schemas + React Hook Form
* **Analytics:** Recharts & TanStack Query
* **Icons:** Lucide React

---

## 📁 Architecture & Folder Structure

```text
school-intelligence-platform/
├── app/
│   ├── (auth)/
│   │   └── login/                 # Institutional sign-in & 1-click role switcher
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Server component layout guarding session
│   │   ├── dashboard/page.tsx     # Role-adaptive executive & classroom dashboard
│   │   ├── students/page.tsx      # Student directory & academic status
│   │   ├── finance/page.tsx       # Billing, M-Pesa reconciliations & arrears
│   │   ├── communication/page.tsx # SMS, WhatsApp & Email broadcast center
│   │   ├── administration/page.tsx# Staff, timetable, transport & policy documents
│   │   ├── intelligence/page.tsx  # Flagship AI School Intelligence engine
│   │   └── settings/page.tsx      # Tenant profile, RBAC matrix & audit logs
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       ├── me/route.ts
│   │       └── switch-demo-role/route.ts
│   ├── globals.css                # Academy theme & CSS variables
│   └── layout.tsx                 # Root layout & font definitions
├── components/
│   ├── ui/                        # Button, Card, Input, Badge, Avatar
│   └── dashboard/
│       ├── dashboard-shell.tsx    # Responsive client shell
│       ├── sidebar.tsx            # Permission-aware navigation sidebar
│       ├── header.tsx             # Header with 1-click role switcher widget
│       └── role-badge.tsx         # Role styling badges
├── lib/
│   ├── auth/
│   │   ├── jwt.ts                 # Jose JWT signing and verification
│   │   ├── password.ts            # Bcrypt hashing & comparisons
│   │   ├── session.ts             # Server session retrieval & enforcement
│   │   └── tenant.ts              # Server-side tenant scoping helpers
│   ├── db/
│   │   └── prisma.ts              # PrismaClient singleton
│   ├── permissions/
│   │   ├── permissions.ts         # Granular permissions codes & definitions
│   │   └── rbac.ts                # Permission verification algorithms
│   ├── validations/
│   │   └── auth.ts                # Zod schemas for login and role switching
│   ├── data/
│   │   └── demo-data.ts           # Realistic Kenya academy data store
│   └── utils.ts                   # KES currency & date formatting
├── prisma/
│   ├── schema.prisma              # Complete multi-tenant relational schema
│   └── seed.ts                    # Production database seeder script
├── middleware.ts                  # Edge session validation & route guard
└── package.json
```

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
# Database URL (PostgreSQL - Neon, Supabase, Docker, or Local PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_intelligence_db?schema=public"

# Session JWT secret
JWT_SECRET="eduintel-kenya-production-jwt-secret-key-super-secure-32-bytes"
```

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Seed PostgreSQL Database (Optional when PostgreSQL is running)
```bash
npm run db:push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛡️ Multi-Tenant Isolation & RBAC Architecture

1. **Tenant Isolation:** Every school-owned record is scoped by `schoolId`. Requests to the database enforce tenant isolation on the server layer and never trust input from the client.
2. **Permissions System:** Permissions (`students.view`, `fees.record_payment`, `ai.use`, etc.) are evaluated directly rather than simple role checks.
3. **Audit Trail:** Critical operations are logged with user context, timestamp, IP address, and changed entity details in compliance with the Kenya Data Protection Act (2019).
