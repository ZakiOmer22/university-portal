// lib/rbac.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get user by ID (with student relation if needed)
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { student: true }, // student is a relation
  });
}

// Permission check
export async function hasPermission(userId: string, permission: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;

  // Since user.role is an enum string, we map it to Role model
  const roleRow = await prisma.role.findUnique({
    where: { name: user.role }, // role is enum, matches Role.name
  });

  if (!roleRow) return false;

  return (roleRow.permissions || []).includes(permission);
}

// Scoped check
export async function isClassLeaderForCourse(userId: string, courseId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
  });
  if (!student) return false;

  const cl = await prisma.classLeader.findFirst({
    where: {
      studentId: student.id,
      courseId,
    },
  });

  return !!cl;
}
