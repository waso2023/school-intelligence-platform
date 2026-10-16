# SOP School Intelligence Platform — Security, Multi-Tenancy & Compliance

## 1. Multi-Tenant Isolation Model

### Invariant: Server-Side Tenant Scoping
* Under no circumstances is `schoolId` trusted from client-side URL parameters, headers, or request payloads.
* Every authenticated request derives the active tenant via `getTenantContext()` in `lib/auth/tenant.ts`, which inspects the cryptographically signed JWT session cookie (`sop_session`).
* Database queries enforce composite index query filtering:
  ```ts
  where: {
    schoolId: tenantContext.tenantId,
    // ...
  }
  ```

---

## 2. Role-Based Access Control (RBAC)

The platform distinguishes 9 explicit organizational roles:
* `SUPER_ADMIN`
* `SCHOOL_ADMIN`
* `PRINCIPAL`
* `TEACHER`
* `FINANCE_OFFICER`
* `RECEPTIONIST`
* `PARENT`
* `STUDENT`
* `DRIVER`

Permissions are evaluated through granular capabilities (`students.view`, `fees.record_payment`, `ai.use`, `academics.manage`, `settings.manage`) rather than crude role name checks.

---

## 3. Kenya Data Protection Act 2019 (KDPA) Compliance

1. **Lawful Basis & Purpose Limitation**: Educational data, student health notes, and parent financial balances are isolated strictly to legitimate school administration.
2. **Audit Logging (`lib/audit/auditLogger.ts`)**: Sensitive operations (recording payments, marking registers, user logins, data migrations) are recorded with user ID, actor name, timestamp, entity affected, and IP address.
3. **Data Minimization in AI Layer**: AI queries receive only the necessary structured fields required to answer analytical questions, eliminating exposure of sensitive medical notes or personal identifiable identifiers unnecessarily.

---

## 4. AI Guardrails & Anti-Hallucination Controls

* **Zero Unrestricted SQL Access**: AI models do not generate or execute arbitrary database queries.
* **Controlled Tool Calling**: AI interacts only with pre-built server functions (`SchoolMetricsService`, `evaluateStudentRisk`, `RAGDocumentService`).
* **Explainability Guarantee**: AI analysis responses follow a strict 4-tier schema (`Observed Data`, `Analysis`, `Interpretation`, `Recommended Action`).
