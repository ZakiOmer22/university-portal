import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId");
  const dateStr = req.nextUrl.searchParams.get("date");

  if (!courseId || !dateStr) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const date = new Date(dateStr);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  // Fetch enrollments including student and user, plus attendance filtered by date and courseId
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      student: {
        include: {
          user: true,
          attendance: {
            where: {
              date: {
                gte: date,
                lt: nextDay,
              },
              courseId: courseId, // make sure to filter attendance by the same course
            },
          },
        },
      },
    },
  });

  const studentsAttendance = enrollments.map((enrollment) => {
    // attendance is array, expect max one per date/course per student
    const att = enrollment.student.attendance[0];
    return {
      studentId: enrollment.student.id,
      fullName: enrollment.student.user.fullName,
      attendanceStatus: att ? att.status : "none",
    };
  });

  return NextResponse.json({
    courseId,
    date: dateStr,
    students: studentsAttendance,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courseId, date, records } = body;

  if (!courseId || !date || !records) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const dateObj = new Date(date);

  const prismaCalls = records.map(
    async (rec: { studentId: string; status: string }) => {
      // Upsert attendance per student per date and course
      await prisma.attendance.upsert({
        where: {
          studentId_courseId_date: {
            studentId: rec.studentId,
            courseId,
            date: dateObj,
          },
        },
        update: { status: rec.status },
        create: {
          studentId: rec.studentId,
          courseId,
          date: dateObj,
          status: rec.status,
        },
      });
    }
  );

  await Promise.all(prismaCalls);

  return NextResponse.json({ success: true });
}
