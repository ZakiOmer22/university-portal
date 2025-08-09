import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // For demo: simple auth by 'authorization' header with email as token (replace with real auth!)
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token format" });
  }

  const userEmail = token;

  try {
    // Find Parent by user email (join user relation)
    const parentProfile = await prisma.parent.findUnique({
      where: {
        userId:
          (
            await prisma.user.findUnique({
              where: { email: userEmail },
              select: { id: true },
            })
          )?.id || "", // fallback empty string to prevent error, handle better in prod
      },
      include: {
        user: true, // get parent User info (fullName, email, profileImage, etc)
        students: {
          include: {
            user: true, // get student user info (name, email, etc)
          },
        },
      },
    });

    if (!parentProfile) {
      return res.status(404).json({ error: "Parent profile not found" });
    }

    // Format linked students data
    const linkedStudents = parentProfile.students.map((student) => ({
      id: student.id,
      name: student.user.fullName,
      // add more student fields here if you want (e.g., universityId, gpa)
    }));

    return res.status(200).json({
      fullName: parentProfile.user.fullName,
      email: parentProfile.user.email,
      profilePicture: parentProfile.user.profileImage || null,
      linkedStudents,
    });
  } catch (error) {
    console.error("API /profile/parent error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
