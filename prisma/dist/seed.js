"use strict";
// import { prisma } from "../src/lib/prisma.js";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// async function main() {
//   // Create Departments
//   const csDept = await prisma.department.upsert({
//     where: { name: "Computer Science" },
//     update: {},
//     create: {
//       name: "Computer Science",
//       faculty: "Engineering",
//     },
//   });
//   const mathDept = await prisma.department.upsert({
//     where: { name: "Mathematics" },
//     update: {},
//     create: {
//       name: "Mathematics",
//       faculty: "Science",
//     },
//   });
//   const roles = [
//     {
//       name: "admin",
//       label: "Administrator",
//       colorClass: "bg-red-100 text-red-800 border border-red-300",
//       permissions: [
//         "Manage users",
//         "Access all dashboards",
//         "Approve accounts",
//         "Configure system settings",
//       ],
//     },
//     {
//       name: "teacher",
//       label: "Teacher",
//       colorClass: "bg-blue-100 text-blue-800 border border-blue-300",
//       permissions: [
//         "Manage courses",
//         "Grade students",
//         "View student submissions",
//       ],
//     },
//     {
//       name: "student",
//       label: "Student",
//       colorClass: "bg-green-100 text-green-800 border border-green-300",
//       permissions: ["View courses", "Submit assignments", "Check grades"],
//     },
//     {
//       name: "parent",
//       label: "Parent",
//       colorClass: "bg-yellow-100 text-yellow-800 border border-yellow-300",
//       permissions: ["View student progress", "Communicate with teachers"],
//     },
//     {
//       name: "employee",
//       label: "Employee",
//       colorClass: "bg-purple-100 text-purple-800 border border-purple-300",
//       permissions: ["Manage administrative tasks", "Access HR resources"],
//     },
//     {
//       name: "Finance",
//       label: "Finance",
//       colorClass: "bg-indigo-100 text-indigo-800 border border-indigo-300",
//       permissions: ["Manage budgets", "Process payments", "Generate reports"],
//     },
//     {
//       name: "Registrar",
//       label: "Registrar",
//       colorClass: "bg-pink-100 text-pink-800 border border-pink-300",
//       permissions: [
//         "Manage student records",
//         "Handle registrations",
//         "Verify enrollment",
//       ],
//     },
//     {
//       name: "Examination",
//       label: "Examination",
//       colorClass: "bg-cyan-100 text-cyan-800 border border-cyan-300",
//       permissions: ["Schedule exams", "Manage exam results", "Monitor cheating"],
//     },
//     {
//       name: "HR",
//       label: "Human Resources",
//       colorClass: "bg-teal-100 text-teal-800 border border-teal-300",
//       permissions: ["Manage employee records", "Handle recruitment", "Payroll"],
//     },
//     {
//       name: "Graduated",
//       label: "Graduated",
//       colorClass: "bg-gray-100 text-gray-800 border border-gray-300",
//       permissions: ["Access alumni resources", "Request transcripts"],
//     },
//   ];
//   for (const role of roles) {
//     await prisma.role.upsert({
//       where: { name: role.name },
//       update: {},
//       create: {
//         name: role.name,
//         label: role.label,
//         colorClass: role.colorClass,
//         permissions: role.permissions,
//       },
//     });
//   }
//   console.log("✅ Roles seeded");
//   // Create Users
//   const adminUser = await prisma.user.upsert({
//     where: { email: "admin@example.com" },
//     update: {},
//     create: {
//       email: "admin@example.com",
//       passwordHash: "hashedpassword123",
//       fullName: "Admin User",
//       role: "admin",
//       isApproved: true,
//     },
//   });
//   const parentUser = await prisma.user.upsert({
//     where: { email: "parent1@example.com" },
//     update: {},
//     create: {
//       email: "parent1@example.com",
//       passwordHash: "hashedpassword123",
//       fullName: "John Doe",
//       role: "parent",
//       isApproved: true,
//       parent: { create: {} },
//     },
//   });
//   const teacherUser = await prisma.user.upsert({
//     where: { email: "teacher1@example.com" },
//     update: {},
//     create: {
//       email: "teacher1@example.com",
//       passwordHash: "hashedpassword123",
//       fullName: "Dr. Sara Ahmed",
//       role: "teacher",
//       isApproved: true,
//       teacher: {
//         create: {
//           departmentId: csDept.id,
//           title: "Lecturer",
//         },
//       },
//     },
//   });
//   const employeeUser = await prisma.user.upsert({
//     where: { email: "employee1@example.com" },
//     update: {},
//     create: {
//       email: "employee1@example.com",
//       passwordHash: "hashedpassword123",
//       fullName: "Employee Example",
//       role: "employee",
//       isApproved: true,
//       employee: {
//         create: {
//           position: "Receptionist",
//         },
//       },
//     },
//   });
//   // Create Student User linked to Parent
//   const studentUser = await prisma.user.upsert({
//     where: { email: "student1@example.com" },
//     update: {},
//     create: {
//       email: "student1@example.com",
//       passwordHash: "hashedpassword123",
//       fullName: "Ali Mohamed",
//       role: "student",
//       isApproved: true,
//       student: {
//         create: {
//           universityId: "UNI001",
//           departmentId: csDept.id,
//           enrollmentDate: new Date("2022-09-01"),
//           gpa: 3.7,
//         },
//       },
//     },
//   });
//   // Link parent with student
//   await prisma.parent.update({
//     where: { userId: parentUser.id },
//     data: {
//       students: {
//         connect: { userId: studentUser.id },
//       },
//     },
//   });
//   // Fetch created student entity for IDs
//   const student = await prisma.student.findUnique({
//     where: { userId: studentUser.id },
//   });
//   // Create Courses
//   const course1 = await prisma.course.upsert({
//     where: { code: "CS101" },
//     update: {},
//     create: {
//       code: "CS101",
//       name: "Intro to Programming",
//       credits: 3,
//       semester: "Fall 2025",
//       departmentId: csDept.id,
//     },
//   });
//   const course2 = await prisma.course.upsert({
//     where: { code: "MATH101" },
//     update: {},
//     create: {
//       code: "MATH101",
//       name: "Calculus I",
//       credits: 4,
//       semester: "Fall 2025",
//       departmentId: mathDept.id,
//     },
//   });
//   // Enroll student to courses
//   const enrollment1 = await prisma.enrollment.create({
//     data: {
//       studentId: student!.id,
//       courseId: course1.id,
//       status: "enrolled",
//     },
//   });
//   const enrollment2 = await prisma.enrollment.create({
//     data: {
//       studentId: student!.id,
//       courseId: course2.id,
//       status: "enrolled",
//     },
//   });
//   // Create Projects for courses
//   const project1 = await prisma.project.create({
//     data: {
//       courseId: course1.id,
//       title: "Programming Assignment 1",
//       description: "Build a simple calculator app.",
//       dueDate: new Date("2025-09-30"),
//       maxScore: 100,
//     },
//   });
//   // Student submission for project
//   const submission1 = await prisma.submission.create({
//     data: {
//       projectId: project1.id,
//       studentId: student!.id,
//       submittedAt: new Date("2025-09-28"),
//       fileUrl: "https://example.com/submissions/student1/prog-assignment1.zip",
//       score: 95,
//       feedback: "Great work, well done!",
//     },
//   });
//   // Create Grades (using teacherUser)
//   const teacher = await prisma.teacher.findUnique({
//     where: { userId: teacherUser.id },
//   });
//   await prisma.grade.create({
//     data: {
//       enrollmentId: enrollment1.id,
//       teacherId: teacher!.id,
//       studentId: student!.id,
//       grade: 88,
//       gradePoint: 3.7,
//       semester: "Fall 2025",
//       comments: "Excellent progress",
//     },
//   });
//   await prisma.grade.create({
//     data: {
//       enrollmentId: enrollment2.id,
//       teacherId: teacher!.id,
//       studentId: student!.id,
//       grade: 92,
//       gradePoint: 3.9,
//       semester: "Fall 2025",
//       comments: "Strong performance",
//     },
//   });
//   // Create Attendance Records
//   await prisma.attendance.createMany({
//     data: [
//       {
//         studentId: student!.id,
//         courseId: course1.id,
//         date: new Date("2025-08-01"),
//         status: "Present",
//       },
//       {
//         studentId: student!.id,
//         courseId: course1.id,
//         date: new Date("2025-08-02"),
//         status: "Absent",
//       },
//       {
//         studentId: student!.id,
//         courseId: course2.id,
//         date: new Date("2025-08-01"),
//         status: "Present",
//       },
//     ],
//   });
//   // Create Announcement by teacher
//   await prisma.announcement.create({
//     data: {
//       title: "Welcome Back!",
//       content: "Semester starts on September 1st.",
//       createdBy: teacherUser.id,
//     },
//   });
//   // Create Notification for student
//   await prisma.notification.create({
//     data: {
//       userId: studentUser.id,
//       content: "You have a new grade posted.",
//       isRead: false,
//     },
//   });
//   console.log("🌱 Seed data loaded successfully.");
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error("❌ Seeding failed:", e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
// prisma/seed.ts
// prisma/seed.ts
var client_1 = require("@prisma/client");
// import bcrypt from "bcrypt";
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var csDept, mathDept, roles, _i, roles_1, role;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Seeding database...");
                    return [4 /*yield*/, prisma.department.upsert({
                            where: { name: "Computer Science" },
                            update: {},
                            create: {
                                name: "Computer Science",
                                faculty: "Engineering",
                            },
                        })];
                case 1:
                    csDept = _a.sent();
                    return [4 /*yield*/, prisma.department.upsert({
                            where: { name: "Mathematics" },
                            update: {},
                            create: {
                                name: "Mathematics",
                                faculty: "Science",
                            },
                        })];
                case 2:
                    mathDept = _a.sent();
                    roles = [
                        {
                            name: "admin",
                            label: "Administrator",
                            colorClass: "bg-red-100 text-red-800 border border-red-300",
                            permissions: [
                                "Manage users",
                                "Access all dashboards",
                                "Approve accounts",
                                "Configure system settings",
                            ],
                        },
                        {
                            name: "teacher",
                            label: "Teacher",
                            colorClass: "bg-blue-100 text-blue-800 border border-blue-300",
                            permissions: [
                                "Manage courses",
                                "Grade students",
                                "View student submissions",
                            ],
                        },
                        {
                            name: "student",
                            label: "Student",
                            colorClass: "bg-green-100 text-green-800 border border-green-300",
                            permissions: ["View courses", "Submit assignments", "Check grades"],
                        },
                        {
                            name: "parent",
                            label: "Parent",
                            colorClass: "bg-yellow-100 text-yellow-800 border border-yellow-300",
                            permissions: ["View student progress", "Communicate with teachers"],
                        },
                        {
                            name: "employee",
                            label: "Employee",
                            colorClass: "bg-purple-100 text-purple-800 border border-purple-300",
                            permissions: ["Manage administrative tasks", "Access HR resources"],
                        },
                        {
                            name: "finance",
                            label: "Finance",
                            colorClass: "bg-indigo-100 text-indigo-800 border border-indigo-300",
                            permissions: ["Manage budgets", "Process payments", "Generate reports"],
                        },
                        {
                            name: "registrar",
                            label: "Registrar",
                            colorClass: "bg-pink-100 text-pink-800 border border-pink-300",
                            permissions: [
                                "Manage student records",
                                "Handle registrations",
                                "Verify enrollment",
                            ],
                        },
                        {
                            name: "examination",
                            label: "Examination",
                            colorClass: "bg-cyan-100 text-cyan-800 border border-cyan-300",
                            permissions: [
                                "Schedule exams",
                                "Manage exam results",
                                "Monitor cheating",
                            ],
                        },
                        {
                            name: "hr",
                            label: "Human Resources",
                            colorClass: "bg-teal-100 text-teal-800 border border-teal-300",
                            permissions: ["Manage employee records", "Handle recruitment", "Payroll"],
                        },
                        {
                            name: "graduated",
                            label: "Graduated",
                            colorClass: "bg-gray-100 text-gray-800 border border-gray-300",
                            permissions: ["Access alumni resources", "Request transcripts"],
                        },
                        {
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
                                "Assist in managing class discussions",
                            ],
                        },
                    ];
                    _i = 0, roles_1 = roles;
                    _a.label = 3;
                case 3:
                    if (!(_i < roles_1.length)) return [3 /*break*/, 6];
                    role = roles_1[_i];
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: role.name },
                            update: {},
                            create: {
                                name: role.name,
                                label: role.label,
                                colorClass: role.colorClass,
                                permissions: role.permissions, // ✅ directly pass array of strings
                            },
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log("✅ Roles seeded");
                    console.log("🌱 Seed data loaded successfully.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error("❌ Seeding failed:", e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
