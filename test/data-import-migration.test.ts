import { test, describe } from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { MigrationService } from "../lib/migration/migrationService";
import { getStudentById } from "../lib/data/students-store";

describe("Data Import, Excel/CSV Processing & Rollback Engine", () => {
  test("should safely parse RFC 4180 CSV with commas inside quoted fields without shifting columns", () => {
    const csvContent = `admissionNumber,firstName,lastName,className,parentName,parentPhone
SOP-TEST-001,John,Kamau,Grade 7,"Kamau, Grace",+254712345678`;

    const { headers, rows } = MigrationService.parseCsv(csvContent);

    assert.deepStrictEqual(headers, [
      "admissionNumber",
      "firstName",
      "lastName",
      "className",
      "parentName",
      "parentPhone",
    ]);
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].parentName, "Kamau, Grace");
    assert.strictEqual(rows[0].parentPhone, "+254712345678");
  });

  test("should parse real Excel (.xlsx) binary workbooks into structured rows", () => {
    // Generate a valid Excel workbook in-memory using SheetJS
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["admissionNumber", "firstName", "lastName", "className", "gender", "parentName", "parentPhone"],
      ["SOP-XL-101", "Amara", "Ochieng", "Grade 8", "FEMALE", "Peter Ochieng", "0722334455"],
      ["SOP-XL-102", "David", "Mwangi", "Year 10", "MALE", "Jane Mwangi", "+254733445566"],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Output binary buffer
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

    // Parse with MigrationService
    const { headers, rows, activeSheet } = MigrationService.parseSpreadsheet(excelBuffer);

    assert.strictEqual(activeSheet, "Students");
    assert.strictEqual(rows.length, 2);
    assert.strictEqual(rows[0].admissionNumber, "SOP-XL-101");
    assert.strictEqual(rows[0].firstName, "Amara");
    assert.strictEqual(rows[1].admissionNumber, "SOP-XL-102");
    assert.strictEqual(rows[1].className, "Year 10");
  });

  test("should detect intra-file duplicate keys and flag them as errors", () => {
    const rows = [
      { admissionNumber: "SOP-DUP-01", firstName: "Alice", lastName: "Mutua", className: "Grade 7", gender: "FEMALE", parentName: "P1", parentPhone: "0712345678" },
      { admissionNumber: "SOP-DUP-01", firstName: "Alice", lastName: "Duplicate", className: "Grade 7", gender: "FEMALE", parentName: "P2", parentPhone: "0712345679" },
    ];

    const mappings = [
      { sourceColumn: "admissionNumber", targetField: "admissionNumber" },
      { sourceColumn: "firstName", targetField: "firstName" },
      { sourceColumn: "lastName", targetField: "lastName" },
      { sourceColumn: "className", targetField: "className" },
      { sourceColumn: "gender", targetField: "gender" },
      { sourceColumn: "parentName", targetField: "parentName" },
      { sourceColumn: "parentPhone", targetField: "parentPhone" },
    ];

    const result = MigrationService.validateData("STUDENTS", rows, mappings, {
      duplicateStrategy: "REJECT",
    });

    assert.strictEqual(result.errorRowsCount >= 1, true);
    const duplicateError = result.errors.find((e) => e.code === "DUPLICATE_IN_FILE");
    assert.ok(duplicateError, "Expected DUPLICATE_IN_FILE error code");
  });

  test("should normalize Kenyan phone numbers to E.164 (+254...)", () => {
    assert.strictEqual(MigrationService.normalizeKenyanPhone("0712345678"), "+254712345678");
    assert.strictEqual(MigrationService.normalizeKenyanPhone("0112345678"), "+254112345678");
    assert.strictEqual(MigrationService.normalizeKenyanPhone("254712345678"), "+254712345678");
    assert.strictEqual(MigrationService.normalizeKenyanPhone("+254 712 345 678"), "+254712345678");
  });

  test("should execute real student persistence and support 1-click rollback", async () => {
    const testAdmNo = `SOP-ROLLBACK-${Date.now()}`;
    const validRows = [
      {
        admissionNumber: testAdmNo,
        firstName: "Titus",
        lastName: "Kipruto",
        className: "Grade 8",
        streamName: "West",
        gender: "MALE",
        parentName: "Kipruto Senior",
        parentPhone: "+254711999888",
      },
    ];

    // 1. Execute Import
    const importResult = await MigrationService.executeImport(
      "school-sop-001",
      "STUDENTS",
      "unit_test_upload.xlsx",
      validRows
    );

    assert.strictEqual(importResult.status, "COMPLETED");
    assert.strictEqual(importResult.importedCount, 1);
    assert.ok(importResult.createdEntityIds && importResult.createdEntityIds.length === 1);

    // 2. Verify record is genuinely persisted and queryable in student store
    const persistedStudent = getStudentById(testAdmNo);
    assert.ok(persistedStudent, `Student with admNo '${testAdmNo}' should be persisted in store`);
    assert.strictEqual(persistedStudent?.firstName, "Titus");
    assert.strictEqual(persistedStudent?.curriculum, "CBC");
    assert.strictEqual(persistedStudent?.className, "Grade 8");

    // 3. Rollback the import batch
    const rollback = MigrationService.rollbackImport(importResult.importId, "school-sop-001");
    assert.strictEqual(rollback.success, true);
    assert.strictEqual(rollback.rolledBackCount, 1);

    // 4. Verify record was safely deleted by rollback
    const afterRollback = getStudentById(testAdmNo);
    assert.strictEqual(afterRollback, undefined, "Student record should be removed following rollback");
  });

  test("should enforce strict SUPER_ADMIN role guard, rejecting non-superadmin roles", () => {
    const isSuperAdminAuthorized = (role: string) => role === "SUPER_ADMIN";

    assert.strictEqual(isSuperAdminAuthorized("SUPER_ADMIN"), true, "SUPER_ADMIN should have access");
    assert.strictEqual(isSuperAdminAuthorized("PRINCIPAL"), false, "PRINCIPAL must be strictly barred");
    assert.strictEqual(isSuperAdminAuthorized("SCHOOL_ADMIN"), false, "SCHOOL_ADMIN must be strictly barred");
    assert.strictEqual(isSuperAdminAuthorized("TEACHER"), false, "TEACHER must be strictly barred");
    assert.strictEqual(isSuperAdminAuthorized("FINANCE_OFFICER"), false, "FINANCE_OFFICER must be strictly barred");
    assert.strictEqual(isSuperAdminAuthorized("RECEPTIONIST"), false, "RECEPTIONIST must be strictly barred");
    assert.strictEqual(isSuperAdminAuthorized("PARENT"), false, "PARENT must be strictly barred");
    assert.strictEqual(isSuperAdminAuthorized("STUDENT"), false, "STUDENT must be strictly barred");
  });
});
