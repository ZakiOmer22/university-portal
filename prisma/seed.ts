import { prisma } from "../src/lib/prisma.js";

async function main() {
  // Create Departments
  const csDept = await prisma.department.upsert({
    where: { name: "Computer Science" },
    update: {},
    create: {
      name: "Computer Science",
      faculty: "Engineering",
    },
  });

  const mathDept = await prisma.department.upsert({
    where: { name: "Mathematics" },
    update: {},
    create: {
      name: "Mathematics",
      faculty: "Science",
    },
  });

  // Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: "hashedpassword123",
      fullName: "Admin User",
      role: "admin",
      isApproved: true,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent1@example.com" },
    update: {},
    create: {
      email: "parent1@example.com",
      passwordHash: "hashedpassword123",
      fullName: "John Doe",
      role: "parent",
      isApproved: true,
      parent: { create: {} },
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher1@example.com" },
    update: {},
    create: {
      email: "teacher1@example.com",
      passwordHash: "hashedpassword123",
      fullName: "Dr. Sara Ahmed",
      role: "teacher",
      isApproved: true,
      teacher: {
        create: {
          departmentId: csDept.id,
          title: "Lecturer",
        },
      },
    },
  });

  const employeeUser = await prisma.user.upsert({
    where: { email: "employee1@example.com" },
    update: {},
    create: {
      email: "employee1@example.com",
      passwordHash: "hashedpassword123",
      fullName: "Employee Example",
      role: "employee",
      isApproved: true,
      employee: {
        create: {
          position: "Receptionist",
        },
      },
    },
  });

  // Create Student User linked to Parent
  const studentUser = await prisma.user.upsert({
    where: { email: "student1@example.com" },
    update: {},
    create: {
      email: "student1@example.com",
      passwordHash: "hashedpassword123",
      fullName: "Ali Mohamed",
      role: "student",
      isApproved: true,
      student: {
        create: {
          universityId: "UNI001",
          departmentId: csDept.id,
          enrollmentDate: new Date("2022-09-01"),
          gpa: 3.7,
        },
      },
    },
  });

  // Link parent with student
  await prisma.parent.update({
    where: { userId: parentUser.id },
    data: {
      students: {
        connect: { userId: studentUser.id },
      },
    },
  });

  // Fetch created student entity for IDs
  const student = await prisma.student.findUnique({
    where: { userId: studentUser.id },
  });

  // Create Courses
  const course1 = await prisma.course.upsert({
    where: { code: "CS101" },
    update: {},
    create: {
      code: "CS101",
      name: "Intro to Programming",
      credits: 3,
      semester: "Fall 2025",
      departmentId: csDept.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { code: "MATH101" },
    update: {},
    create: {
      code: "MATH101",
      name: "Calculus I",
      credits: 4,
      semester: "Fall 2025",
      departmentId: mathDept.id,
    },
  });

  // Enroll student to courses
  const enrollment1 = await prisma.enrollment.create({
    data: {
      studentId: student!.id,
      courseId: course1.id,
      status: "enrolled",
    },
  });

  const enrollment2 = await prisma.enrollment.create({
    data: {
      studentId: student!.id,
      courseId: course2.id,
      status: "enrolled",
    },
  });

  // Create Projects for courses
  const project1 = await prisma.project.create({
    data: {
      courseId: course1.id,
      title: "Programming Assignment 1",
      description: "Build a simple calculator app.",
      dueDate: new Date("2025-09-30"),
      maxScore: 100,
    },
  });

  // Student submission for project
  const submission1 = await prisma.submission.create({
    data: {
      projectId: project1.id,
      studentId: student!.id,
      submittedAt: new Date("2025-09-28"),
      fileUrl: "https://example.com/submissions/student1/prog-assignment1.zip",
      score: 95,
      feedback: "Great work, well done!",
    },
  });

  // Create Grades (using teacherUser)
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUser.id },
  });

  await prisma.grade.create({
    data: {
      enrollmentId: enrollment1.id,
      teacherId: teacher!.id,
      studentId: student!.id,
      grade: 88,
      gradePoint: 3.7,
      semester: "Fall 2025",
      comments: "Excellent progress",
    },
  });

  await prisma.grade.create({
    data: {
      enrollmentId: enrollment2.id,
      teacherId: teacher!.id,
      studentId: student!.id,
      grade: 92,
      gradePoint: 3.9,
      semester: "Fall 2025",
      comments: "Strong performance",
    },
  });

  // Create Attendance Records
  await prisma.attendance.createMany({
    data: [
      {
        studentId: student!.id,
        courseId: course1.id,
        date: new Date("2025-08-01"),
        status: "Present",
      },
      {
        studentId: student!.id,
        courseId: course1.id,
        date: new Date("2025-08-02"),
        status: "Absent",
      },
      {
        studentId: student!.id,
        courseId: course2.id,
        date: new Date("2025-08-01"),
        status: "Present",
      },
    ],
  });

  // Create Announcement by teacher
  await prisma.announcement.create({
    data: {
      title: "Welcome Back!",
      content: "Semester starts on September 1st.",
      createdBy: teacherUser.id,
    },
  });

  // Create Notification for student
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      content: "You have a new grade posted.",
      isRead: false,
    },
  });

  console.log("🌱 Seed data loaded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
