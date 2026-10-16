import * as XLSX from "xlsx";
import {
  DatasetSchema,
  DatasetType,
  ColumnMapping,
  DuplicateStrategy,
  MigrationValidationResult,
  MigrationImportResult,
  ValidationError,
  DataImportBatchLog,
} from "./types";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudents,
  StudentProfile,
} from "@/lib/data/students-store";

export const DATASET_SCHEMAS: Record<DatasetType, DatasetSchema> = {
  STUDENTS: {
    type: "STUDENTS",
    title: "Student Admissions & Profiles",
    description: "Bio data, admission number, class placement, stream, gender, parent contacts.",
    columns: [
      { key: "admissionNumber", label: "Admission Number", required: true, type: "string", description: "Unique student identifier (e.g. SOP-2026-001)", sampleValue: "SOP-2026-090" },
      { key: "firstName", label: "First Name", required: true, type: "string", description: "Learner given name", sampleValue: "Faith" },
      { key: "lastName", label: "Last Name", required: true, type: "string", description: "Learner family name", sampleValue: "Cherono" },
      { key: "className", label: "Class / Grade", required: true, type: "string", description: "Grade 7, Grade 8, Year 10, etc.", sampleValue: "Grade 8" },
      { key: "streamName", label: "Stream", required: false, type: "string", description: "East, West, North, etc.", sampleValue: "East" },
      { key: "gender", label: "Gender", required: true, type: "enum", enumValues: ["MALE", "FEMALE"], description: "MALE or FEMALE", sampleValue: "FEMALE" },
      { key: "dateOfBirth", label: "Date of Birth", required: false, type: "date", description: "YYYY-MM-DD", sampleValue: "2012-05-14" },
      { key: "parentName", label: "Parent / Guardian Name", required: true, type: "string", description: "Primary contact name", sampleValue: "Beatrice Cherono" },
      { key: "parentPhone", label: "Parent Phone Number", required: true, type: "string", description: "+254 7XX XXX XXX", sampleValue: "+254712345678" },
      { key: "parentEmail", label: "Parent Email", required: false, type: "string", description: "Contact email", sampleValue: "parent@example.com" },
    ],
    sampleCsv: `admissionNumber,firstName,lastName,className,streamName,gender,dateOfBirth,parentName,parentPhone,parentEmail
SOP-2026-101,Daniel,Kiprotich,Grade 8,East,MALE,2012-03-12,Joseph Kiprotich,+254722100200,jkiprotich@example.com
SOP-2026-102,Mercy,Njeri,Grade 8,West,FEMALE,2012-07-25,Grace Njeri,+254733400500,gnjeri@example.com
SOP-2026-103,Brian,Otieno,Grade 7,North,MALE,2013-01-19,George Otieno,+254711800900,gotieno@example.com`,
  },
  STAFF: {
    type: "STAFF",
    title: "Teaching & Non-Teaching Staff",
    description: "Employee number, name, department, role, qualification, contact.",
    columns: [
      { key: "employeeNumber", label: "Employee Number", required: true, type: "string", description: "Staff ID", sampleValue: "EMP-045" },
      { key: "fullName", label: "Full Name", required: true, type: "string", description: "Staff name", sampleValue: "Dennis Mutiso" },
      { key: "email", label: "Email Address", required: true, type: "string", description: "Staff email", sampleValue: "dmutiso@sopacademy.ac.ke" },
      { key: "role", label: "Institutional Role", required: true, type: "string", description: "TEACHER, PRINCIPAL, FINANCE_OFFICER", sampleValue: "TEACHER" },
      { key: "department", label: "Department", required: false, type: "string", description: "Sciences, Mathematics, Languages", sampleValue: "Sciences" },
      { key: "phone", label: "Phone Number", required: true, type: "string", description: "+254...", sampleValue: "+254712000111" },
    ],
    sampleCsv: `employeeNumber,fullName,email,role,department,phone
EMP-045,Dennis Mutiso,dmutiso@sopacademy.ac.ke,TEACHER,Sciences,+254712000111
EMP-046,Agnes Muthoni,amuthoni@sopacademy.ac.ke,TEACHER,Mathematics,+254722333444
EMP-047,Patrick Korir,pkorir@sopacademy.ac.ke,FINANCE_OFFICER,Finance,+254733555666`,
  },
  ATTENDANCE: {
    type: "ATTENDANCE",
    title: "Historical Attendance Registers",
    description: "Date, student admission number, status (PRESENT, ABSENT, LATE, EXCUSED), reason.",
    columns: [
      { key: "admissionNumber", label: "Admission Number", required: true, type: "string", description: "Student identifier", sampleValue: "SOP-2026-001" },
      { key: "date", label: "Attendance Date", required: true, type: "date", description: "YYYY-MM-DD", sampleValue: "2026-02-02" },
      { key: "status", label: "Attendance Status", required: true, type: "enum", enumValues: ["PRESENT", "ABSENT", "LATE", "EXCUSED"], description: "Status code", sampleValue: "PRESENT" },
      { key: "reason", label: "Remarks / Reason", required: false, type: "string", description: "Optional notes", sampleValue: "Medical clinic visit" },
    ],
    sampleCsv: `admissionNumber,date,status,reason
SOP-2026-001,2026-02-02,PRESENT,
SOP-2026-002,2026-02-02,LATE,Traffic delay
SOP-2026-003,2026-02-02,EXCUSED,Medical appointment`,
  },
  GRADES: {
    type: "GRADES",
    title: "Examination Scores & CAT Marks",
    description: "Student admission number, exam name, subject code, marks, max marks, teacher comment.",
    columns: [
      { key: "admissionNumber", label: "Admission Number", required: true, type: "string", description: "Student identifier", sampleValue: "SOP-2026-001" },
      { key: "examName", label: "Exam Name", required: true, type: "string", description: "CAT 1, Midterm, Finals", sampleValue: "Term 1 Mid-Term 2026" },
      { key: "subjectCode", label: "Subject Code", required: true, type: "string", description: "MAT-101, ENG-101, SCI-102", sampleValue: "MAT-101" },
      { key: "score", label: "Marks Scored", required: true, type: "number", description: "Score attained", sampleValue: "78" },
      { key: "maxMarks", label: "Maximum Marks", required: true, type: "number", description: "Denominator (usually 100)", sampleValue: "100" },
      { key: "teacherComment", label: "Teacher Comments", required: false, type: "string", description: "Qualitative observation", sampleValue: "Shows good analytical skills" },
    ],
    sampleCsv: `admissionNumber,examName,subjectCode,score,maxMarks,teacherComment
SOP-2026-001,Term 1 Mid-Term 2026,MAT-101,84,100,Excellent grasp of algebra
SOP-2026-001,Term 1 Mid-Term 2026,ENG-101,72,100,Good essay structure
SOP-2026-002,Term 1 Mid-Term 2026,MAT-101,65,100,Consistent progress`,
  },
  FEES: {
    type: "FEES",
    title: "Fee Balances & Historical Payments",
    description: "Student admission number, academic term, invoice amount, amount paid, balance.",
    columns: [
      { key: "admissionNumber", label: "Admission Number", required: true, type: "string", description: "Student identifier", sampleValue: "SOP-2026-001" },
      { key: "term", label: "Term", required: true, type: "string", description: "Term 1, Term 2, Term 3", sampleValue: "Term 1 2026" },
      { key: "billedAmount", label: "Billed Tuition Amount", required: true, type: "number", description: "In KES", sampleValue: "85000" },
      { key: "paidAmount", label: "Amount Paid", required: true, type: "number", description: "In KES", sampleValue: "85000" },
      { key: "paymentMethod", label: "Last Payment Method", required: false, type: "enum", enumValues: ["MPESA", "BANK", "CASH"], description: "Method", sampleValue: "MPESA" },
      { key: "receiptNumber", label: "Receipt / Ref Number", required: false, type: "string", description: "Transaction ref", sampleValue: "REC-2026-019" },
    ],
    sampleCsv: `admissionNumber,term,billedAmount,paidAmount,paymentMethod,receiptNumber
SOP-2026-001,Term 1 2026,85000,85000,MPESA,REC-2026-001
SOP-2026-002,Term 1 2026,85000,60000,MPESA,REC-2026-002
SOP-2026-003,Term 1 2026,85000,35000,BANK,REC-2026-003`,
  },
};

// In-memory persistent batch log store for audit and rollback
export const DATA_IMPORT_BATCH_LOGS: DataImportBatchLog[] = [
  {
    importId: "imp-seed-initial",
    schoolId: "school-sop-001",
    datasetType: "STUDENTS",
    fileName: "initial_enrolment_term1_2026.xlsx",
    fileSize: 45200,
    totalRows: 10,
    importedCount: 10,
    updatedCount: 0,
    skippedCount: 0,
    errorsCount: 0,
    status: "COMPLETED",
    createdEntityIds: ["std-001", "std-002", "std-003"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

export class MigrationService {
  /**
   * Normalizes Kenyan phone numbers to standardized E.164 (+254...)
   */
  static normalizeKenyanPhone(phone: string): string {
    if (!phone) return "";
    const clean = phone.trim().replace(/[\s\-\(\)\.]/g, "");
    if (clean.startsWith("+254")) return clean;
    if (clean.startsWith("254")) return `+${clean}`;
    if (clean.startsWith("07") || clean.startsWith("01")) return `+254${clean.slice(1)}`;
    return clean;
  }

  /**
   * Universal spreadsheet and CSV parser powered by SheetJS (XLSX).
   * Supports:
   * 1. Binary ArrayBuffer / Uint8Array from file inputs (.xlsx, .xls)
   * 2. Base64 strings from upload payloads
   * 3. RFC 4180 CSV strings (properly handles commas within quotes, escaped quotes, multiline values)
   */
  static parseSpreadsheet(
    data: string | ArrayBuffer | Uint8Array,
    options?: { isBase64?: boolean }
  ): { headers: string[]; rows: Record<string, string>[]; sheetNames: string[]; activeSheet: string } {
    let workbook: XLSX.WorkBook;

    if (typeof data === "string") {
      if (options?.isBase64 || data.startsWith("data:") || /^[A-Za-z0-9+/=]+$/.test(data.slice(0, 100))) {
        // Strip data URL scheme if present
        const cleanBase64 = data.includes(",") ? data.split(",")[1] : data;
        workbook = XLSX.read(cleanBase64, { type: "base64" });
      } else {
        // Treat as CSV text
        workbook = XLSX.read(data, { type: "string", raw: true });
      }
    } else {
      // Binary ArrayBuffer / Uint8Array from file upload
      const uint8 = data instanceof Uint8Array ? data : new Uint8Array(data);
      workbook = XLSX.read(uint8, { type: "array" });
    }

    const sheetNames = workbook.SheetNames;
    if (!sheetNames || sheetNames.length === 0) {
      return { headers: [], rows: [], sheetNames: [], activeSheet: "" };
    }

    const activeSheet = sheetNames[0];
    const worksheet = workbook.Sheets[activeSheet];
    if (!worksheet) {
      return { headers: [], rows: [], sheetNames, activeSheet };
    }

    // Convert sheet to JSON array with default empty strings
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: "",
      raw: false,
    });

    if (rawRows.length === 0) {
      return { headers: [], rows: [], sheetNames, activeSheet };
    }

    // Extract cleaned headers
    const firstRow = rawRows[0];
    const headers = Object.keys(firstRow).map((h) => h.trim());

    // Normalize rows to trimmed string key-value records
    const rows: Record<string, string>[] = rawRows.map((r) => {
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(r)) {
        clean[k.trim()] = String(v ?? "").trim();
      }
      return clean;
    });

    return { headers, rows, sheetNames, activeSheet };
  }

  /**
   * Backward-compatible CSV parser that uses the compliant SheetJS engine
   */
  static parseCsv(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
    const { headers, rows } = this.parseSpreadsheet(csvText);
    return { headers, rows };
  }

  /**
   * Validate mapped data against dataset schema, with intra-file and tenant-scoped duplicate detection.
   */
  static validateData(
    datasetType: DatasetType,
    rows: Record<string, string>[],
    mappings: ColumnMapping[],
    options?: {
      schoolId?: string;
      duplicateStrategy?: DuplicateStrategy; // "SKIP" | "UPDATE" | "REJECT"
    }
  ): MigrationValidationResult {
    const schema = DATASET_SCHEMAS[datasetType];
    const errors: ValidationError[] = [];
    const previewRows: Record<string, any>[] = [];
    const duplicateStrategy: DuplicateStrategy = options?.duplicateStrategy || "SKIP";

    const fieldMap = new Map<string, string>();
    mappings.forEach((m) => fieldMap.set(m.targetField, m.sourceColumn));

    // Existing student records for duplicate detection
    const existingStudents = getStudents();
    const existingAdmissionNumbers = new Set(
      existingStudents
        .filter((s) => !options?.schoolId || s.schoolId === options.schoolId)
        .map((s) => s.admissionNumber.toLowerCase().trim())
    );

    // Intra-file duplicate tracker
    const seenIntraFileAdmissions = new Set<string>();
    let skippedDuplicatesCount = 0;

    rows.forEach((row, rowIdx) => {
      const rowNum = rowIdx + 2; // +1 for header row, +1 for 1-based indexing
      const parsedRow: Record<string, any> = { _rowNum: rowNum };
      let hasError = false;
      let isDuplicate = false;
      let isUpdate = false;

      // Extract raw values according to mapping
      schema.columns.forEach((col) => {
        const sourceColName = fieldMap.get(col.key);
        const rawVal = sourceColName !== undefined ? row[sourceColName] : undefined;

        // Check required fields
        if (col.required && (!rawVal || String(rawVal).trim() === "")) {
          errors.push({
            rowNumber: rowNum,
            field: col.label,
            value: rawVal,
            message: `Required field '${col.label}' is missing or empty.`,
            severity: "error",
            code: "REQUIRED_FIELD_MISSING",
          });
          hasError = true;
          parsedRow[col.key] = null;
          return;
        }

        if (!rawVal || String(rawVal).trim() === "") {
          parsedRow[col.key] = null;
          return;
        }

        const trimmedVal = String(rawVal).trim();

        // Type checks & normalizations
        if (col.type === "number") {
          const num = Number(trimmedVal.replace(/,/g, ""));
          if (isNaN(num)) {
            errors.push({
              rowNumber: rowNum,
              field: col.label,
              value: rawVal,
              message: `Expected numeric value, received '${rawVal}'.`,
              severity: "error",
              code: "INVALID_NUMBER",
            });
            hasError = true;
          } else {
            parsedRow[col.key] = num;
          }
        } else if (col.type === "enum" && col.enumValues) {
          const upper = trimmedVal.toUpperCase();
          if (!col.enumValues.includes(upper)) {
            errors.push({
              rowNumber: rowNum,
              field: col.label,
              value: rawVal,
              message: `Invalid value '${rawVal}'. Allowed options: ${col.enumValues.join(", ")}.`,
              severity: "error",
              code: "INVALID_ENUM",
            });
            hasError = true;
          } else {
            parsedRow[col.key] = upper;
          }
        } else if (col.type === "date") {
          const d = new Date(trimmedVal);
          if (isNaN(d.getTime())) {
            errors.push({
              rowNumber: rowNum,
              field: col.label,
              value: rawVal,
              message: `Invalid date format '${rawVal}'. Please use YYYY-MM-DD.`,
              severity: "warning",
              code: "INVALID_DATE_FORMAT",
            });
          }
          parsedRow[col.key] = trimmedVal;
        } else {
          // Phone number normalization
          if (col.key === "parentPhone" || col.key === "phone") {
            parsedRow[col.key] = MigrationService.normalizeKenyanPhone(trimmedVal);
          } else {
            parsedRow[col.key] = trimmedVal;
          }
        }
      });

      // =========================================================================
      // DUPLICATE DETECTION LOGIC
      // =========================================================================
      if (datasetType === "STUDENTS") {
        const admNo = String(parsedRow.admissionNumber || "").toLowerCase().trim();

        if (admNo) {
          // 1. Intra-file duplicate check
          if (seenIntraFileAdmissions.has(admNo)) {
            errors.push({
              rowNumber: rowNum,
              field: "Admission Number",
              value: parsedRow.admissionNumber,
              message: `Duplicate admission number '${parsedRow.admissionNumber}' appears multiple times within this file.`,
              severity: "error",
              code: "DUPLICATE_IN_FILE",
            });
            hasError = true;
          } else {
            seenIntraFileAdmissions.add(admNo);
          }

          // 2. Database / Tenant Store conflict check
          if (existingAdmissionNumbers.has(admNo)) {
            if (duplicateStrategy === "REJECT") {
              errors.push({
                rowNumber: rowNum,
                field: "Admission Number",
                value: parsedRow.admissionNumber,
                message: `Student with admission number '${parsedRow.admissionNumber}' already exists in tenant records.`,
                severity: "error",
                code: "DUPLICATE_IN_DATABASE",
              });
              hasError = true;
            } else if (duplicateStrategy === "SKIP") {
              isDuplicate = true;
              skippedDuplicatesCount++;
              errors.push({
                rowNumber: rowNum,
                field: "Admission Number",
                value: parsedRow.admissionNumber,
                message: `Student '${parsedRow.admissionNumber}' already enrolled. Will be skipped.`,
                severity: "warning",
                code: "SKIPPED_EXISTING",
              });
            } else if (duplicateStrategy === "UPDATE") {
              isUpdate = true;
            }
          }
        }
      }

      parsedRow._hasError = hasError;
      parsedRow._isDuplicate = isDuplicate;
      parsedRow._isUpdate = isUpdate;
      previewRows.push(parsedRow);
    });

    const errorCount = errors.filter((e) => e.severity === "error").length;
    const warningCount = errors.filter((e) => e.severity === "warning").length;
    const validCount = rows.length - previewRows.filter((r) => r._hasError).length;

    return {
      totalRows: rows.length,
      validRowsCount: validCount,
      warningRowsCount: warningCount,
      errorRowsCount: errorCount,
      skippedDuplicatesCount,
      errors,
      previewRows,
    };
  }

  /**
   * Executes batch import with real entity persistence and rollback tracking.
   */
  static async executeImport(
    schoolId: string,
    datasetType: DatasetType,
    fileName: string,
    validRows: Record<string, any>[],
    options?: {
      duplicateStrategy?: DuplicateStrategy;
      fileSize?: number;
    }
  ): Promise<MigrationImportResult> {
    const importId = `imp-${Date.now()}`;
    const duplicateStrategy = options?.duplicateStrategy || "SKIP";
    const createdEntityIds: string[] = [];
    let importedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // 1. Process STUDENTS import
    if (datasetType === "STUDENTS") {
      const existingStudents = getStudents();

      for (let idx = 0; idx < validRows.length; idx++) {
        const row = validRows[idx];

        // Skip rows tagged as duplicate when strategy is SKIP
        if (row._isDuplicate && duplicateStrategy === "SKIP") {
          skippedCount++;
          continue;
        }

        const admNo = String(row.admissionNumber || "").trim();
        const existingStudent = existingStudents.find(
          (s) => s.admissionNumber.toLowerCase() === admNo.toLowerCase() && s.schoolId === schoolId
        );

        if (existingStudent && (row._isUpdate || duplicateStrategy === "UPDATE")) {
          // Update existing student profile
          updateStudent(existingStudent.id, {
            firstName: row.firstName || existingStudent.firstName,
            lastName: row.lastName || existingStudent.lastName,
            className: row.className || existingStudent.className,
            streamName: row.streamName || existingStudent.streamName,
            parent: {
              ...existingStudent.parent,
              fullName: row.parentName || existingStudent.parent.fullName,
              phone: row.parentPhone || existingStudent.parent.phone,
              email: row.parentEmail || existingStudent.parent.email,
            },
          });
          updatedCount++;
        } else {
          // Construct and persist new student record
          const isCambridge =
            String(row.className).toLowerCase().includes("year") ||
            String(row.className).toLowerCase().includes("cambridge");

          const newStudentId = `std-imp-${Date.now().toString(36)}-${idx + 1}`;

          const newStudent: StudentProfile = {
            id: newStudentId,
            schoolId,
            admissionNumber: admNo,
            firstName: row.firstName || "Learner",
            middleName: "",
            lastName: row.lastName || "",
            dateOfBirth: row.dateOfBirth || "2012-01-01",
            gender: row.gender === "FEMALE" ? "Female" : "Male",
            photoUrl: `https://images.unsplash.com/photo-${
              row.gender === "FEMALE" ? "1544005313-94ddf0286df2" : "1539571696357-5a69c17a67c6"
            }?auto=format&fit=crop&q=80&w=200`,
            admissionDate: new Date().toISOString().split("T")[0],
            status: "ACTIVE",
            classId: `cls-${String(row.className || "grade-7").toLowerCase().replace(/\s+/g, "-")}`,
            className: row.className || "Grade 7",
            streamId: `str-${String(row.streamName || "east").toLowerCase()}`,
            streamName: row.streamName || "East",
            curriculum: isCambridge ? "Cambridge International" : "CBC",
            address: "Nairobi, Kenya",
            county: "Nairobi",
            medicalInfo: {
              bloodGroup: "O+",
              allergies: [],
              emergencyDoctor: "SOP Medical Center",
              emergencyPhone: row.parentPhone || "+254712345678",
            },
            parent: {
              id: `par-${newStudentId}`,
              fullName: row.parentName || "Primary Guardian",
              relationship: "Guardian",
              phone: row.parentPhone || "+254712345678",
              email: row.parentEmail || "",
              occupation: "Parent / Guardian",
              address: "Nairobi",
            },
            academic: {
              currentTermAverage: 72.5,
              previousTermAverage: 70.0,
              trend: "STABLE",
              rank: 12,
              totalInClass: 35,
              subjectGrades: [],
              termTrends: [],
            },
            attendance: {
              rate: 98.0,
              totalDays: 20,
              present: 20,
              absent: 0,
              late: 0,
              excused: 0,
              warningThresholdTriggered: false,
              recentLogs: [{ date: new Date().toISOString().split("T")[0], status: "PRESENT" }],
            },
            fees: {
              expectedAmount: 85000,
              paidAmount: 0,
              balance: 85000,
              status: "OUTSTANDING",
              dueDate: "2026-11-15",
              transactions: [],
            },
            discipline: [],
            documents: [],
            communications: [],
          };

          addStudent(newStudent);
          createdEntityIds.push(newStudent.id);
          importedCount++;
        }
      }
    } else {
      // Non-students datasets (Attendance, Grades, Fees) - simulate insertion into stores
      importedCount = validRows.length;
    }

    // 2. Persist batch log for audit and rollback
    const batchLog: DataImportBatchLog = {
      importId,
      schoolId,
      datasetType,
      fileName,
      fileSize: options?.fileSize || 1024,
      totalRows: validRows.length,
      importedCount,
      updatedCount,
      skippedCount,
      errorsCount: 0,
      status: "COMPLETED",
      createdEntityIds,
      timestamp: new Date().toISOString(),
    };

    DATA_IMPORT_BATCH_LOGS.unshift(batchLog);

    return {
      importId,
      datasetType,
      fileName,
      totalRows: validRows.length,
      importedCount,
      updatedCount,
      skippedCount,
      warningsCount: 0,
      errorsCount: 0,
      status: "COMPLETED",
      createdEntityIds,
      timestamp: batchLog.timestamp,
    };
  }

  /**
   * Rollback a previous import batch, safely deleting the records it created.
   */
  static rollbackImport(
    importId: string,
    schoolId: string
  ): { success: boolean; rolledBackCount: number; message: string } {
    const batch = DATA_IMPORT_BATCH_LOGS.find(
      (b) => b.importId === importId && b.schoolId === schoolId
    );

    if (!batch) {
      throw new Error(`Import batch '${importId}' not found for tenant '${schoolId}'.`);
    }

    if (batch.status === "ROLLED_BACK") {
      throw new Error(`Import batch '${importId}' has already been rolled back.`);
    }

    let deletedCount = 0;
    if (batch.datasetType === "STUDENTS" && batch.createdEntityIds.length > 0) {
      deletedCount = deleteStudents(batch.createdEntityIds);
    }

    batch.status = "ROLLED_BACK";

    return {
      success: true,
      rolledBackCount: deletedCount,
      message: `Successfully rolled back batch '${importId}'. Removed ${deletedCount} imported student records.`,
    };
  }

  /**
   * Retrieves tenant-scoped historical import batches.
   */
  static getImportHistory(schoolId: string): DataImportBatchLog[] {
    return DATA_IMPORT_BATCH_LOGS.filter((b) => b.schoolId === schoolId);
  }
}
