// // import { prisma } from "../src/lib/prisma.js";

// // async function main() {
// //   // Create Departments
// //   const csDept = await prisma.department.upsert({
// //     where: { name: "Computer Science" },
// //     update: {},
// //     create: {
// //       name: "Computer Science",
// //       faculty: "Engineering",
// //     },
// //   });

// //   const mathDept = await prisma.department.upsert({
// //     where: { name: "Mathematics" },
// //     update: {},
// //     create: {
// //       name: "Mathematics",
// //       faculty: "Science",
// //     },
// //   });

// //   // Roles array including Leader
// //   const roles = [
// //     {
// //       name: "admin",
// //       label: "Administrator",
// //       colorClass: "bg-red-100 text-red-800 border border-red-300",
// //       permissions: [
// //         "Manage users",
// //         "Access all dashboards",
// //         "Approve accounts",
// //         "Configure system settings",
// //       ],
// //     },
// //     {
// //       name: "teacher",
// //       label: "Teacher",
// //       colorClass: "bg-blue-100 text-blue-800 border border-blue-300",
// //       permissions: [
// //         "Manage courses",
// //         "Grade students",
// //         "View student submissions",
// //       ],
// //     },
// //     {
// //       name: "student",
// //       label: "Student",
// //       colorClass: "bg-green-100 text-green-800 border border-green-300",
// //       permissions: ["View courses", "Submit assignments", "Check grades"],
// //     },
// //     {
// //       name: "parent",
// //       label: "Parent",
// //       colorClass: "bg-yellow-100 text-yellow-800 border border-yellow-300",
// //       permissions: ["View student progress", "Communicate with teachers"],
// //     },
// //     {
// //       name: "employee",
// //       label: "Employee",
// //       colorClass: "bg-purple-100 text-purple-800 border border-purple-300",
// //       permissions: ["Manage administrative tasks", "Access HR resources"],
// //     },
// //     {
// //       name: "Finance",
// //       label: "Finance",
// //       colorClass: "bg-indigo-100 text-indigo-800 border border-indigo-300",
// //       permissions: ["Manage budgets", "Process payments", "Generate reports"],
// //     },
// //     {
// //       name: "Registrar",
// //       label: "Registrar",
// //       colorClass: "bg-pink-100 text-pink-800 border border-pink-300",
// //       permissions: [
// //         "Manage student records",
// //         "Handle registrations",
// //         "Verify enrollment",
// //       ],
// //     },
// //     {
// //       name: "Examination",
// //       label: "Examination",
// //       colorClass: "bg-cyan-100 text-cyan-800 border border-cyan-300",
// //       permissions: ["Schedule exams", "Manage exam results", "Monitor cheating"],
// //     },
// //     {
// //       name: "HR",
// //       label: "Human Resources",
// //       colorClass: "bg-teal-100 text-teal-800 border border-teal-300",
// //       permissions: ["Manage employee records", "Handle recruitment", "Payroll"],
// //     },
// //     {
// //       name: "Graduated",
// //       label: "Graduated",
// //       colorClass: "bg-gray-100 text-gray-800 border border-gray-300",
// //       permissions: ["Access alumni resources", "Request transcripts"],
// //     },
// //     {
// //       name: "leader", // ✅ Lowercase for DB key
// //       label: "Leader", // Display label
// //       colorClass: "bg-green-100 text-green-800 border border-green-300",
// //       permissions: [
// //         "View own dashboard",
// //         "Access course materials",
// //         "Submit assignments",
// //         "View own grades and attendance",
// //         "Coordinate with teachers on class issues",
// //         "View classmates' attendance summaries",
// //         "View classmates' grade summaries (read-only)",
// //         "Post announcements to class",
// //         "Escalate issues to faculty/administration",
// //         "Assist in managing class discussions",
// //       ],
// //     },
// //   ];

// //   for (const role of roles) {
// //     await prisma.role.upsert({
// //       where: { name: role.name },
// //       update: {},
// //       create: {
// //         name: role.name,
// //         label: role.label,
// //         colorClass: role.colorClass,
// //         permissions: role.permissions,
// //       },
// //     });
// //   }

// //   console.log("✅ Roles seeded");

// //   // -------------------------
// //   // Users (keep exactly as before)
// //   // -------------------------
// //   const adminUser = await prisma.user.upsert({
// //     where: { email: "admin@example.com" },
// //     update: {},
// //     create: {
// //       email: "admin@example.com",
// //       passwordHash: "hashedpassword123",
// //       fullName: "Admin User",
// //       role: "admin",
// //       isApproved: true,
// //     },
// //   });

// //   const parentUser = await prisma.user.upsert({
// //     where: { email: "parent1@example.com" },
// //     update: {},
// //     create: {
// //       email: "parent1@example.com",
// //       passwordHash: "hashedpassword123",
// //       fullName: "John Doe",
// //       role: "parent",
// //       isApproved: true,
// //       parent: { create: {} },
// //     },
// //   });

// //   const teacherUser = await prisma.user.upsert({
// //     where: { email: "teacher1@example.com" },
// //     update: {},
// //     create: {
// //       email: "teacher1@example.com",
// //       passwordHash: "hashedpassword123",
// //       fullName: "Dr. Sara Ahmed",
// //       role: "teacher",
// //       isApproved: true,
// //       teacher: {
// //         create: {
// //           departmentId: csDept.id,
// //           title: "Lecturer",
// //         },
// //       },
// //     },
// //   });

// //   const employeeUser = await prisma.user.upsert({
// //     where: { email: "employee1@example.com" },
// //     update: {},
// //     create: {
// //       email: "employee1@example.com",
// //       passwordHash: "hashedpassword123",
// //       fullName: "Employee Example",
// //       role: "employee",
// //       isApproved: true,
// //       employee: {
// //         create: {
// //           position: "Receptionist",
// //         },
// //       },
// //     },
// //   });

// //   const studentUser = await prisma.user.upsert({
// //     where: { email: "student1@example.com" },
// //     update: {},
// //     create: {
// //       email: "student1@example.com",
// //       passwordHash: "hashedpassword123",
// //       fullName: "Ali Mohamed",
// //       role: "student",
// //       isApproved: true,
// //       student: {
// //         create: {
// //           universityId: "UNI001",
// //           departmentId: csDept.id,
// //           enrollmentDate: new Date("2022-09-01"),
// //           gpa: 3.7,
// //         },
// //       },
// //     },
// //   });

// //   // Link parent with student
// //   await prisma.parent.update({
// //     where: { userId: parentUser.id },
// //     data: {
// //       students: { connect: { userId: studentUser.id } },
// //     },
// //   });

// //   // Fetch created student entity for IDs
// //   const student = await prisma.student.findUnique({
// //     where: { userId: studentUser.id },
// //   });

// //   // Create Courses
// //   const course1 = await prisma.course.upsert({
// //     where: { code: "CS101" },
// //     update: {},
// //     create: {
// //       code: "CS101",
// //       name: "Intro to Programming",
// //       credits: 3,
// //       semester: "Fall 2025",
// //       departmentId: csDept.id,
// //     },
// //   });

// //   const course2 = await prisma.course.upsert({
// //     where: { code: "MATH101" },
// //     update: {},
// //     create: {
// //       code: "MATH101",
// //       name: "Calculus I",
// //       credits: 4,
// //       semester: "Fall 2025",
// //       departmentId: mathDept.id,
// //     },
// //   });

// //   // Enroll student to courses
// //   await prisma.enrollment.create({
// //     data: { studentId: student!.id, courseId: course1.id, status: "enrolled" },
// //   });

// //   await prisma.enrollment.create({
// //     data: { studentId: student!.id, courseId: course2.id, status: "enrolled" },
// //   });

// //   // Projects, submissions, grades, attendance, announcements, notifications
// //   const project1 = await prisma.project.create({
// //     data: {
// //       courseId: course1.id,
// //       title: "Programming Assignment 1",
// //       description: "Build a simple calculator app.",
// //       dueDate: new Date("2025-09-30"),
// //       maxScore: 100,
// //     },
// //   });

// //   await prisma.submission.create({
// //     data: {
// //       projectId: project1.id,
// //       studentId: student!.id,
// //       submittedAt: new Date("2025-09-28"),
// //       fileUrl: "https://example.com/submissions/student1/prog-assignment1.zip",
// //       score: 95,
// //       feedback: "Great work, well done!",
// //     },
// //   });

// //   const teacher = await prisma.teacher.findUnique({
// //     where: { userId: teacherUser.id },
// //   });

// //   await prisma.grade.create({
// //     data: {
// //       enrollmentId: course1.id,
// //       teacherId: teacher!.id,
// //       studentId: student!.id,
// //       grade: 88,
// //       gradePoint: 3.7,
// //       semester: "Fall 2025",
// //       comments: "Excellent progress",
// //     },
// //   });

// //   await prisma.grade.create({
// //     data: {
// //       enrollmentId: course2.id,
// //       teacherId: teacher!.id,
// //       studentId: student!.id,
// //       grade: 92,
// //       gradePoint: 3.9,
// //       semester: "Fall 2025",
// //       comments: "Strong performance",
// //     },
// //   });

// //   await prisma.attendance.createMany({
// //     data: [
// //       { studentId: student!.id, courseId: course1.id, date: new Date("2025-08-01"), status: "Present" },
// //       { studentId: student!.id, courseId: course1.id, date: new Date("2025-08-02"), status: "Absent" },
// //       { studentId: student!.id, courseId: course2.id, date: new Date("2025-08-01"), status: "Present" },
// //     ],
// //   });

// //   await prisma.announcement.create({
// //     data: {
// //       title: "Welcome Back!",
// //       content: "Semester starts on September 1st.",
// //       createdBy: teacherUser.id,
// //     },
// //   });

// //   await prisma.notification.create({
// //     data: {
// //       userId: studentUser.id,
// //       content: "You have a new grade posted.",
// //       isRead: false,
// //     },
// //   });

// //   console.log("🌱 Seed data loaded successfully.");
// // }

// // main()
// //   .then(async () => { await prisma.$disconnect(); })
// //   .catch(async (e) => {
// //     console.error("❌ Seeding failed:", e);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });


// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // --- Roles with permissions ---
//   const roles = [
//     {
//       name: "Admin",
//       permissions: [
//         "Manage users",
//         "Access all dashboards",
//         "Approve accounts",
//         "Configure system settings",
//       ],
//     },
//     {
//       name: "Teacher",
//       permissions: [
//         "View assigned classes",
//         "Upload grades",
//         "Track attendance",
//         "Access teaching materials",
//       ],
//     },
//     {
//       name: "Student Leader",
//       permissions: [
//         "View own dashboard",
//         "Access course materials",
//         "Submit assignments",
//         "View own grades and attendance",
//         "Coordinate with teachers on class issues",
//         "View classmates' attendance summaries",
//         "View classmates' grade summaries (read-only)",
//         "Post announcements to class",
//         "Escalate issues to faculty/administration",
//         "Assist in managing class discussions",
//       ],
//     },
//     {
//       name: "Student",
//       permissions: [
//         "View own dashboard",
//         "Access course materials",
//         "Submit assignments",
//         "View own grades and attendance",
//       ],
//     },
//     {
//       name: "Alumni",
//       permissions: [
//         "Access alumni resources",
//         "Request transcripts",
//       ],
//     },
//   ];

//   // --- Seed Roles and Permissions ---
//   for (const role of roles) {
//     const createdRole = await prisma.role.upsert({
//       where: { name: role.name },
//       update: {},
//       create: {
//         name: role.name,
//       },
//     });

//     for (const perm of role.permissions) {
//       const createdPerm = await prisma.permission.upsert({
//         where: { name: perm },
//         update: {},
//         create: { name: perm },
//       });

//       await prisma.rolePermission.upsert({
//         where: {
//           roleId_permissionId: {
//             roleId: createdRole.id,
//             permissionId: createdPerm.id,
//           },
//         },
//         update: {},
//         create: {
//           roleId: createdRole.id,
//           permissionId: createdPerm.id,
//         },
//       });
//     }
//   }

//   console.log("✅ Seeding completed!");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error("❌ Error during seeding:", e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });



// prisma/seed.mjs
import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("hashedpassword123", 10);

  // Example: create role
  await prisma.role.upsert({
    where: { name: "leader" },
    update: {},
    create: {
      name: "leader",
      label: "Leader",
      colorClass: "bg-green-100 text-green-800 border border-green-300",
      permissions: [
        "View own dashboard",
        "Access course materials",
        "Submit assignments",
        "View own grades and attendance",
        "Coordinate with teachers on class issues",
        "View classmates' attendance summaries",
        "View classmates' grade summaries (read-only)",
        "Post announcements to class",
        "Escalate issues to faculty/administration",
        "Assist in managing class discussions"
      ]
    }
  });

  // ... rest of your seed (users, departments, courses)
  console.log("✅ Seed completed (JS).");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
