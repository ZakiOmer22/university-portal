/*
  Warnings:

  - The values [admin,teacher,student,parent,employee,Finance,Registrar,Examination,Graduated,CLASS_LEADER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'EMPLOYEE', 'FINANCE', 'REGISTRAR', 'EXAMINATION', 'HR', 'GRADUATED', 'LEADER');
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;
