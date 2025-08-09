import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const exam = await prisma.exam.create({
      data: {
        title: body.title,
        date: new Date(body.date),
        courseId: body.courseId,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
