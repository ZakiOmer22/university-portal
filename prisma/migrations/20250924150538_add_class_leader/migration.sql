-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'CLASS_LEADER';

-- CreateTable
CREATE TABLE "public"."ClassLeader" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassLeader_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassLeader_studentId_courseId_key" ON "public"."ClassLeader"("studentId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."ClassLeader" ADD CONSTRAINT "ClassLeader_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassLeader" ADD CONSTRAINT "ClassLeader_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassLeader" ADD CONSTRAINT "ClassLeader_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
