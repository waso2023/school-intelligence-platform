import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assertTenantOwnership, assertStudentAccess, filterStudentsForUser, TenantContext, StudentLikeRecord } from "../lib/auth/tenant";

describe("Tenant Security & Relationship Access Control", () => {
  const sopTenantContext: TenantContext = {
    schoolId: "school-sop-001",
    tenantId: "school-sop-001",
    schoolName: "SOP International Academy",
    userId: "usr-admin-01",
    userRole: "SUPER_ADMIN",
    permissions: ["students.view", "students.create"],
    user: {
      id: "usr-admin-01",
      name: "Dr. Evelyn Mwangi",
      email: "superadmin@sopacademy.ac.ke",
      role: "SUPER_ADMIN",
      permissions: ["students.view", "students.create"],
    },
  };

  const parentDavidContext: TenantContext = {
    schoolId: "school-sop-001",
    tenantId: "school-sop-001",
    schoolName: "SOP International Academy",
    userId: "usr-parent-david",
    userRole: "PARENT",
    permissions: ["students.view", "fees.view"],
    user: {
      id: "usr-parent-david",
      name: "David Kimani",
      email: "parent.david@sopacademy.ac.ke",
      role: "PARENT",
      permissions: ["students.view", "fees.view"],
    },
  };

  const kevinStudent: StudentLikeRecord = {
    id: "std-001",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0082",
    parent: {
      id: "usr-parent-david",
      email: "parent.david@sopacademy.ac.ke",
      phone: "+254 722 400 001",
    },
    userId: "usr-student-kevin",
  };

  const zawadiStudent: StudentLikeRecord = {
    id: "std-003",
    schoolId: "school-sop-001",
    admissionNumber: "SOP-2024-0084",
    parent: {
      id: "usr-parent-lucy",
      email: "lucy.muthoni@gmail.com",
      phone: "+254 722 555 123",
    },
    userId: "usr-student-zawadi",
  };

  const otherSchoolStudent: StudentLikeRecord = {
    id: "std-999",
    schoolId: "school-other-academy-002",
    admissionNumber: "OTH-2024-0001",
    parent: {
      id: "usr-parent-david",
      email: "parent.david@sopacademy.ac.ke",
    },
  };

  it("should permit access when tenant matches the authorized school", async () => {
    await assertTenantOwnership("school-sop-001", sopTenantContext);
    assert.ok(true, "Tenant ownership confirmed");
  });

  it("should strictly reject cross-tenant data access", async () => {
    await assert.rejects(
      async () => {
        await assertTenantOwnership("school-other-academy-002", sopTenantContext);
      },
      /SECURITY_VIOLATION: Cross-tenant access denied/
    );
  });

  it("should reject cross-tenant student access even if parent matches", async () => {
    await assert.rejects(
      async () => {
        await assertStudentAccess(otherSchoolStudent, parentDavidContext);
      },
      /SECURITY_VIOLATION: Cross-tenant student access denied/
    );
  });

  it("should permit parent to access their own linked child", async () => {
    await assertStudentAccess(kevinStudent, parentDavidContext);
    assert.ok(true, "Parent access to linked child authorized");
  });

  it("should reject parent attempting to access an unrelated student", async () => {
    await assert.rejects(
      async () => {
        await assertStudentAccess(zawadiStudent, parentDavidContext);
      },
      /SECURITY_VIOLATION: Parent access restricted to linked child only/
    );
  });

  it("should filter student directory to only linked children for Parent role", () => {
    const list = [kevinStudent, zawadiStudent, otherSchoolStudent];
    const filtered = filterStudentsForUser(list, parentDavidContext);

    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, "std-001");
  });

  it("should permit admin to see all students in their tenant while excluding other tenants", () => {
    const list = [kevinStudent, zawadiStudent, otherSchoolStudent];
    const filtered = filterStudentsForUser(list, sopTenantContext);

    assert.equal(filtered.length, 2);
    assert.ok(filtered.every((s) => s.schoolId === "school-sop-001"));
  });
});
