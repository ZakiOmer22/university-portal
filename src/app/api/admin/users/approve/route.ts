import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // your prisma client import

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    // Use the correct field: isApproved (boolean)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isApproved: true,
      },
    });

    console.log(`Approving user with id: ${id}`);

    return NextResponse.json(
      { message: "User approved successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
