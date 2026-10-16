# SOP School Intelligence Platform — Data Migration & Import Architecture

## 1. Overview
The **Data Migration & Import Center** provides an enterprise-grade 7-step wizard enabling school administrators to safely transition legacy data into the SOP School Intelligence Platform. The migration architecture is completely decoupled from UI presentation, enforcing type integrity, schema validation, and audit trail logging.

---

## 2. 7-Stage Migration Workflow

```
[1. Select Dataset]  -->  [2. Upload CSV]  -->  [3. Map Columns]  -->  [4. Validate Data]
                                                                               |
                                                                               v
[7. Audit & Complete] <-- [6. Execute Batch Commit] <-- [5. Preview Records] <--+
```

1. **Dataset Selection**:
   * **Students**: Bio data, admissions, class placement, stream, gender, parent contacts.
   * **Staff**: Employee number, roles, departmental assignments, contacts.
   * **Attendance**: Historical daily registers (PRESENT, ABSENT, LATE, EXCUSED).
   * **Grades & Exams**: CAT, mid-term, and final examination marks.
   * **Fees & Balances**: Invoiced tuition, payments recorded, opening balances.
2. **Upload Data**:
   * Supports `.csv` (and spreadsheet paste).
   * One-click download of standardized CSV templates.
   * "Load Demo Dataset" feature for quick sandbox verification.
3. **Column Mapping**:
   * Flexible matching between source CSV headers and target SOP relational fields.
   * Automatic header inference with fallback to manual selection.
4. **Data Validation**:
   * Pre-import deterministic verification.
   * Required field checks.
   * Numeric range checks (e.g. marks between $0 - 100$).
   * Enum validation (Gender: `MALE`/`FEMALE`, Attendance: `PRESENT`/`ABSENT`/`LATE`/`EXCUSED`).
   * Phone number format verification (Kenyan `+254` pattern).
   * Generates discrete counts for **Valid Rows**, **Warnings**, and **Errors**.
5. **Preview Records**:
   * Interactive tabular review showing valid vs invalid rows before committing.
6. **Execute Batch Import**:
   * Transactional database batch execution.
   * Isolates data to the authenticated session's tenant (`schoolId`).
7. **Audit & Log**:
   * Persists summary to `DataImportLog` table (total rows, imported count, skipped count, timestamps).
   * Logs a formal compliance audit event in accordance with Kenya Data Protection Act 2019.

---

## 3. Server Endpoints
* `POST /api/migration/validate`: Validates uploaded CSV content against mapped schema.
* `POST /api/migration/import`: Executes batch commit, returns summary ID, and triggers audit log.
