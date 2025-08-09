import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const { studentId } = params;

  try {
    const fees = await prisma.fee.findMany({
      where: { studentId },
      include: { student: true }, // optional: remove if you don’t need full student data
    });

    if (!fees.length) {
      return NextResponse.json(
        { message: "No fees found for this student." },
        { status: 404 }
      );
    }

    return NextResponse.json(fees);
  } catch (error) {
    console.error("API Error in /dashboard/parent/fees/[studentId]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
