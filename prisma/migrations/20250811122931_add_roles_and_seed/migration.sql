-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."UserRole" ADD VALUE 'Finance';
ALTER TYPE "public"."UserRole" ADD VALUE 'Registrar';
ALTER TYPE "public"."UserRole" ADD VALUE 'Examination';
ALTER TYPE "public"."UserRole" ADD VALUE 'HR';
ALTER TYPE "public"."UserRole" ADD VALUE 'Graduated';

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "colorClass" TEXT NOT NULL,
    "permissions" TEXT[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");
