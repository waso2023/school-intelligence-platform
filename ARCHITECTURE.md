# SOP School Intelligence Platform — Technical Architecture

## 1. System Vision & Domain
**SOP — School Intelligence Platform** is a multi-tenant SaaS application designed for private and international Kenyan educational institutions. It unifies daily administrative operations with an explainable AI data intelligence layer.

* **Reference Tenant**: SOP International Academy (`school-sop-001`)
* **Target Curricula**: CBC (Competency-Based Curriculum Kenya) and Cambridge International (CAIE)
* **Local Currency**: Kenyan Shilling (KES / KSh)

---

## 2. Technology Stack
* **Framework**: Next.js 15+ (App Router, React Server Components & Client Components)
* **Language**: TypeScript (strict type safety)
* **Styling & UI**: Tailwind CSS, shadcn/ui design primitives, Lucide React icons
* **Data Layer**: Prisma ORM with PostgreSQL database
* **Authentication**: Edge-compatible signed JWT sessions (`jose`), salted passwords (`bcryptjs`)
* **Analytics & Graphs**: Recharts data visualizations
* **Form Validation**: React Hook Form, Zod schemas

---

## 3. Directory Layout

```
school-intelligence-platform/
├── app/
│   ├── (auth)/login/                 # Secure JWT authentication
│   ├── (dashboard)/
│   │   ├── dashboard/                # Macro institutional cockpit
│   │   ├── students/                 # Student directory, admissions & 7-tab profile
│   │   ├── intelligence/             # AI assistant, risk engine & RAG policies
│   │   ├── settings/
│   │   │   ├── academics/            # Assessment weightings & grade boundaries
│   │   │   └── data-import/          # 7-stage legacy data migration wizard
│   │   ├── finance/                  # Tuition billing & fee arrears (Phase 3B)
│   │   ├── communication/            # Parent notifications (Phase 3B)
│   │   └── administration/           # Staff, timetables & documents
│   └── api/
│       ├── auth/                     # Session, login, logout, role switching
│       ├── students/                 # Student CRUD endpoints
│       ├── intelligence/             # Intelligence summary, risk roster, query
│       ├── academics/config/         # Configurable academic rules
│       └── migration/                # CSV validation & batch import
├── components/
│   ├── dashboard/                    # Sidebar, header, role badge, shell
│   ├── students/                     # Admissions dialog, student profile components
│   └── ui/                           # Button, card, badge, avatar, input
├── lib/
│   ├── auth/                         # JWT, password hashing, session, tenant context
│   ├── intelligence/
│   │   ├── metrics/                  # Deterministic Academic, Attendance, Finance calculations
│   │   ├── risk/                     # Multi-factor explainable risk engine
│   │   └── schoolMetricsService.ts   # Central server-side intelligence service
│   ├── ai/
│   │   ├── tools/                    # Tool registry, schemas & dispatcher
│   │   ├── rag/                      # Policy document chunks & semantic search
│   │   └── types.ts                  # Grounded AI schema definitions
│   ├── academics/config.ts           # Academic engine configuration service
│   ├── migration/                    # Data import parser, validation & batch service
│   ├── audit/auditLogger.ts          # Unified KDPA audit logging service
│   ├── finance/interfaces.ts         # Phase 3B contracts & ledger models
│   ├── communication/interfaces.ts   # NotificationProvider abstraction (SMS, WhatsApp, Email)
│   ├── permissions/                  # RBAC matrix & permissions dictionary
│   └── data/                         # In-memory stores & demo datasets
└── prisma/
    └── schema.prisma                 # Multi-tenant schema with 38 models
```

---

## 4. Operational Modules & Future Phase 3B Integration

1. **Student & Academic Core**: Admissions, CBC/Cambridge assessment weightings, attendance registers, exam marks.
2. **Data Intelligence Foundation**: `SchoolMetricsService`, `evaluateStudentRisk`, RAG search over institutional handbooks.
3. **Data Migration Hub**: 7-stage CSV wizard importing Students, Staff, Attendance, Grades, and Fees.
4. **Finance Preparation (Phase 3B)**: Invoice generators, M-Pesa IPN listeners, fee waiver policies.
5. **Communication Abstraction (Phase 3B)**: Multi-channel notifications for SMS, WhatsApp Business, and Email.
