// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isApproved: true,
      },
      orderBy: { fullName: "asc" },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      status: user.isApproved ? "active" : "pending",
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, role } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { error: "fullName, email and role are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const placeholderHash = crypto.randomBytes(32).toString("hex");

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        role,
        isApproved: false,
        passwordHash: placeholderHash,
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: "pending",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, fullName, email, role, isApproved } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (isApproved !== undefined) updateData.isApproved = isApproved;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        id: updatedUser.id,
        name: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.isApproved ? "active" : "pending",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
