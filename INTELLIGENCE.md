# SOP School Intelligence Platform — AI & Intelligence Layer Architecture

## 1. Overview
The **SOP School Intelligence Platform** features a deterministic, explainable data intelligence and risk detection foundation tailored for modern private and international schools in Kenya. Rather than providing unvetted, hallucination-prone Large Language Models direct database access, the platform implements an **intermediary intelligence service layer** that enforces strict multi-tenant authorization, deterministic mathematical formulas, and verified citations.

---

## 2. Architectural Pillars

```
+-------------------------------------------------------------+
|                      Client UI                              |
|   (/intelligence, /students/[id], /settings/academics)      |
+-------------------------------------------------------------+
                              |
                              v  (REST / Next.js Route Handlers)
+-------------------------------------------------------------+
|             Authorization & Tenant Boundary                 |
|             (JWT Session • assertTenantOwnership)           |
+-------------------------------------------------------------+
                              |
               +--------------+--------------+
               |                             |
               v                             v
+-------------------------------+ +----------------------------+
|  Deterministic Metrics Layer  | |  RAG & Document Retrieval  |
|  - AcademicMetrics            | |  - DocumentChunk           |
|  - AttendanceMetrics          | |  - Semantic/Keyword Search |
|  - FinanceMetrics             | |  - Institutional Policies  |
|  - Multi-Factor RiskEngine    | +----------------------------+
+-------------------------------+
               |
               v
+-------------------------------------------------------------+
|               Multi-Tenant Relational Database              |
|                      (PostgreSQL / Prisma)                  |
+-------------------------------------------------------------+
```

---

## 3. Deterministic Metrics & Formulas

### A. Academic Metrics (`lib/intelligence/metrics/academicMetrics.ts`)
* **Weighted Aggregate Score**:
  $$\text{Term Mark} = (W_{\text{CAT}} \times \text{CAT}) + (W_{\text{MID}} \times \text{MID}) + (W_{\text{FIN}} \times \text{FIN})$$
  Default weights: CAT 30%, Mid-Term 30%, Finals 40%.
* **Mean & Median Scores**: Real arithmetic mean and median computed across cohorts.
* **Pass Rate**: Percentage of students achieving $\ge$ configurable pass benchmark (default 50%).
* **Performance Bands**:
  * **CBC**: Exceeding Expectations (EE: 80-100%), Meeting Expectations (ME: 60-79%), Approaching Expectations (AE: 40-59%), Below Expectations (BE: 0-39%).
  * **Cambridge CAIE**: $A^*$ (90-100%), $A$ (80-89%), $B$ (70-79%), $C$ (60-69%), $D$ (50-59%), $E$ (40-49%), $U$ (0-39%).

### B. Attendance Metrics (`lib/intelligence/metrics/attendanceMetrics.ts`)
* **Attendance Percentage**:
  $$\text{Rate} = \left(\frac{\text{Present} + \text{Excused}}{\text{Total School Days}}\right) \times 100$$
* **Chronic Truancy Alert**: Triggered whenever an individual or class falls below the configurable 90% institutional attendance threshold.

### C. Financial Metrics (`lib/intelligence/metrics/financeMetrics.ts`)
* **Collection Efficiency**:
  $$\text{Collection Rate} = \left(\frac{\text{Total Collected KES}}{\text{Total Billed KES}}\right) \times 100$$
* **Arrears Identification**: Automated tracking of accounts exceeding KSh 25,000 post mid-term.

---

## 4. Multi-Factor Student Risk Engine (`lib/intelligence/risk/riskEngine.ts`)

The risk engine generates explainable scores ($0 - 100$) mapped to 4 categorical levels:
* **LOW** ($0 - 29$ pts): Compliant standing, standard academic progression.
* **MEDIUM** ($30 - 49$ pts): Emerging concerns, subject-level monitoring recommended.
* **HIGH** ($50 - 74$ pts): Marked academic drop or chronic attendance deficit. Action plan required.
* **CRITICAL** ($\ge 75$ pts): Multiple combined severe factors (e.g. $>15\%$ drop + $<85\%$ attendance + heavy arrears). Mandatory principal intervention.

### Evaluated Risk Dimensions
1. **Academic Decline**: Term-over-term drop $\ge 10\%$ triggers $+20$ to $+35$ penalty points. Overall average $<60\%$ triggers $+25$ points.
2. **Attendance Truancy**: Attendance $<90\%$ triggers $+15$ to $+30$ points. Consecutive absences $\ge 2$ days trigger $+20$ points.
3. **Fee Arrears**: Balances $> \text{KSh } 25,000$ trigger $+15$ points ($> \text{KSh } 50,000$ trigger $+25$ points).
4. **Disciplinary Flags**: Formal incident logs add $+15$ points per infraction.

Every risk assessment returns **explicit reasons** and **concrete recommended interventions** (e.g. "Assign remedial tutoring in Mathematics", "Schedule parent-teacher diagnostic conference").

---

## 5. AI Tool Layer & Grounded Response Format (`lib/ai/`)

The platform equips conversational AI with structured, permission-gated tools:
* `getSchoolSummary`
* `getAtRiskStudents`
* `getClassPerformance`
* `getSubjectPerformance`
* `getFeeArrearsSummary`
* `getAttendanceSummary`
* `searchSchoolPolicies`

### Structured Grounded Response Standard
All responses adhere to a 4-part structure to eliminate hallucination:
1. **Observed Data**: Quantified metrics and tabular excerpts extracted from the database.
2. **Analysis**: Correlated patterns (e.g. linking attendance drop to math exam decline).
3. **Interpretation**: Institutional policy implications.
4. **Recommended Action**: Actionable, administrative, and pedagogical steps.

---

## 6. Document RAG Architecture (`lib/ai/rag/`)
Institutional documents (Student Code of Conduct, Academic Policies, Fee Guidelines) are pre-chunked with rich metadata:
* `schoolId`: Enforces tenant confidentiality.
* `category`: Categorizes into Academics, Attendance, Finance, Discipline, or Administration.
* `section`: Identifies specific policy articles.
* `keywords`: Facilitates rapid keyword and semantic similarity retrieval.
