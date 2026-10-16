import { PrismaClient, UserRole, UserStatus, StudentStatus, AttendanceStatus, PaymentMethod, PaymentStatus, FeeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ALL_PERMISSIONS, ROLE_PERMISSIONS_MAP } from "../lib/permissions/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for SOP International Academy...");

  // 1. Create School Tenant
  const school = await prisma.school.upsert({
    where: { code: "SOP-001" },
    update: {},
    create: {
      code: "SOP-001",
      name: "SOP International Academy",
      slug: "sop-international-academy",
      motto: "Excellence in Knowledge & Character",
      phone: "+254 712 345 678",
      email: "info@sopacademy.ac.ke",
      address: "Dagoretti Road, Karen, Nairobi",
      county: "Nairobi",
      country: "Kenya",
      curriculum: "CBC & Cambridge International",
      currency: "KES",
      academicSystem: "3-Term System",
    },
  });

  console.log(`✅ School tenant created: ${school.name} (${school.id})`);

  // 2. Seed Permissions
  for (const perm of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { name: perm.code },
      update: { description: perm.description, module: perm.module },
      create: {
        name: perm.code,
        description: perm.description,
        module: perm.module,
      },
    });
  }
  console.log(`✅ Seeded ${ALL_PERMISSIONS.length} permissions.`);

  // 3. Seed Roles & RolePermissions
  const rolesToCreate = [
    { code: UserRole.SUPER_ADMIN, name: "Super Administrator", isSystem: true },
    { code: UserRole.SCHOOL_ADMIN, name: "School Administrator", isSystem: true },
    { code: UserRole.PRINCIPAL, name: "Principal", isSystem: true },
    { code: UserRole.TEACHER, name: "Teacher", isSystem: true },
    { code: UserRole.FINANCE_OFFICER, name: "Finance Officer / Bursar", isSystem: true },
    { code: UserRole.RECEPTIONIST, name: "Receptionist", isSystem: true },
    { code: UserRole.PARENT, name: "Parent", isSystem: true },
    { code: UserRole.STUDENT, name: "Student", isSystem: true },
    { code: UserRole.DRIVER, name: "Driver", isSystem: true },
  ];

  for (const r of rolesToCreate) {
    const roleRecord = await prisma.role.upsert({
      where: {
        schoolId_code: {
          schoolId: school.id,
          code: r.code,
        },
      },
      update: {},
      create: {
        schoolId: school.id,
        name: r.name,
        code: r.code,
        isSystem: r.isSystem,
      },
    });

    const rolePermCodes = ROLE_PERMISSIONS_MAP[r.code] || [];
    for (const code of rolePermCodes) {
      const permRecord = await prisma.permission.findUnique({ where: { name: code } });
      if (permRecord) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRecord.id,
              permissionId: permRecord.id,
            },
          },
          update: {},
          create: {
            roleId: roleRecord.id,
            permissionId: permRecord.id,
          },
        });
      }
    }
  }
  console.log("✅ Seeded system roles and permission matrices.");

  // 4. Seed Academic Year & Terms
  const academicYear = await prisma.academicYear.upsert({
    where: {
      schoolId_name: {
        schoolId: school.id,
        name: "2026 Academic Year",
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: "2026 Academic Year",
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-11-20"),
      isCurrent: true,
    },
  });

  const term1 = await prisma.term.create({
    data: {
      academicYearId: academicYear.id,
      name: "Term 1 2026",
      termNumber: 1,
      startDate: new Date("2026-01-05"),
      endDate: new Date("2026-04-10"),
      isCurrent: true,
    },
  });

  // 5. Seed Demo Users
  const defaultPasswordHash = await bcrypt.hash("Admin@2026!", 10);
  const teacherPasswordHash = await bcrypt.hash("Teacher@2026!", 10);
  const financePasswordHash = await bcrypt.hash("Finance@2026!", 10);
  const parentPasswordHash = await bcrypt.hash("Parent@2026!", 10);
  const studentPasswordHash = await bcrypt.hash("Student@2026!", 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: "superadmin@sopacademy.ac.ke" },
    update: {},
    create: {
      schoolId: school.id,
      email: "superadmin@sopacademy.ac.ke",
      name: "Dr. Evelyn Mwangi",
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
      phone: "+254 722 100 001",
    },
  });

  // Principal
  await prisma.user.upsert({
    where: { email: "principal@sopacademy.ac.ke" },
    update: {},
    create: {
      schoolId: school.id,
      email: "principal@sopacademy.ac.ke",
      name: "Prof. Arthur Ochieng",
      passwordHash: defaultPasswordHash,
      role: UserRole.PRINCIPAL,
      phone: "+254 722 200 002",
    },
  });

  // Teacher User & Profile
  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher.sarah@sopacademy.ac.ke" },
    update: {},
    create: {
      schoolId: school.id,
      email: "teacher.sarah@sopacademy.ac.ke",
      name: "Sarah Wanjiku",
      passwordHash: teacherPasswordHash,
      role: UserRole.TEACHER,
      phone: "+254 722 300 003",
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: { employeeId: "TCH-0012" },
    update: {},
    create: {
      schoolId: school.id,
      userId: teacherUser.id,
      employeeId: "TCH-0012",
      firstName: "Sarah",
      lastName: "Wanjiku",
      email: "teacher.sarah@sopacademy.ac.ke",
      phone: "+254 722 300 003",
      qualification: "B.Ed Science (Physics/Math), Kenyatta University",
      specialization: "Sciences & Mathematics",
    },
  });

  // Finance Officer
  await prisma.user.upsert({
    where: { email: "finance.peter@sopacademy.ac.ke" },
    update: {},
    create: {
      schoolId: school.id,
      email: "finance.peter@sopacademy.ac.ke",
      name: "Peter Kipkorir",
      passwordHash: financePasswordHash,
      role: UserRole.FINANCE_OFFICER,
      phone: "+254 722 400 004",
    },
  });

  // Parent
  const parentUser = await prisma.user.upsert({
    where: { email: "parent.david@sopacademy.ac.ke" },
    update: {},
    create: {
      schoolId: school.id,
      email: "parent.david@sopacademy.ac.ke",
      name: "David Kimani",
      passwordHash: parentPasswordHash,
      role: UserRole.PARENT,
      phone: "+254 722 500 005",
    },
  });

  const parent = await prisma.parent.create({
    data: {
      schoolId: school.id,
      userId: parentUser.id,
      fullName: "David Kimani",
      relationship: "Father",
      phone: "+254 722 500 005",
      email: "parent.david@sopacademy.ac.ke",
      occupation: "Civil Engineer",
      address: "Karen Hardy Estate, Nairobi",
    },
  });

  // 6. Classes & Streams
  const grade8 = await prisma.class.create({
    data: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      name: "Grade 8",
      gradeLevel: 8,
      classTeacherId: teacher.id,
    },
  });

  const streamEast = await prisma.stream.create({
    data: {
      classId: grade8.id,
      name: "East",
      capacity: 35,
    },
  });

  // 7. Student Kevin Kimani
  const studentUser = await prisma.user.upsert({
    where: { email: "student.kevin@sopacademy.ac.ke" },
    update: {},
    create: {
      schoolId: school.id,
      email: "student.kevin@sopacademy.ac.ke",
      name: "Kevin Kimani",
      passwordHash: studentPasswordHash,
      role: UserRole.STUDENT,
      phone: "+254 722 600 006",
    },
  });

  const student = await prisma.student.create({
    data: {
      schoolId: school.id,
      admissionNumber: "SOP-2024-0082",
      firstName: "Kevin",
      lastName: "Kimani",
      dateOfBirth: new Date("2012-05-14"),
      gender: "Male",
      classId: grade8.id,
      streamId: streamEast.id,
      parentId: parent.id,
      userId: studentUser.id,
      parentPhone: "+254 722 500 005",
      parentEmail: "parent.david@sopacademy.ac.ke",
      address: "Karen Hardy, Nairobi",
    },
  });

  // Fee Structure & Student Account
  const feeStructure = await prisma.feeStructure.create({
    data: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      termId: term1.id,
      classId: grade8.id,
      name: "Grade 8 Term 1 Standard Fee Structure",
      tuition: 65000,
      transport: 12000,
      meals: 8000,
      totalAmount: 85000,
    },
  });

  const studentFee = await prisma.studentFee.create({
    data: {
      schoolId: school.id,
      studentId: student.id,
      termId: term1.id,
      expectedAmount: 85000,
      paidAmount: 60000,
      balance: 25000,
      status: FeeStatus.PARTIALLY_PAID,
      dueDate: new Date("2026-02-15"),
    },
  });

  const payment = await prisma.payment.create({
    data: {
      schoolId: school.id,
      studentId: student.id,
      studentFeeId: studentFee.id,
      amount: 60000,
      paymentMethod: PaymentMethod.MPESA,
      transactionRef: "QWE89284KL",
      status: PaymentStatus.COMPLETED,
      date: new Date(),
    },
  });

  await prisma.receipt.create({
    data: {
      schoolId: school.id,
      paymentId: payment.id,
      studentId: student.id,
      receiptNumber: "REC-2026-0089",
      amount: 60000,
      previousBalance: 85000,
      currentBalance: 25000,
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
