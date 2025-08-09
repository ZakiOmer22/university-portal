/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "public"."Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_courseId_date_key" ON "public"."Attendance"("studentId", "courseId", "date");

-- AddForeignKey
ALTER TABLE "public"."Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
