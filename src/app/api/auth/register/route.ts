import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

const prisma = new PrismaClient();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads/profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Handle POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    // Convert NextRequest → Node stream for formidable
    const bodyBuffer = Buffer.from(await request.arrayBuffer());
    const reqForFormidable = new Readable({
      read() {
        this.push(bodyBuffer);
        this.push(null);
      },
    }) as any;

    reqForFormidable.headers = Object.fromEntries(request.headers.entries());
    reqForFormidable.method = request.method;

    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    // Parse multipart form
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(reqForFormidable, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Extract fields safely
    const fullName = (
      Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName
    )?.trim();

    const email = (Array.isArray(fields.email) ? fields.email[0] : fields.email)
      ?.trim()
      .toLowerCase();

    const password = Array.isArray(fields.password)
      ? fields.password[0]
      : fields.password;

    const roleRaw = Array.isArray(fields.role) ? fields.role[0] : fields.role;
    const role = roleRaw?.toUpperCase();

    console.log("📥 FIELDS RECEIVED:", { fullName, email, password, role });
    console.log("📌 ALLOWED ROLES:", Object.values(UserRole));

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role as UserRole)) {
      console.log("❌ Invalid role:", role);
      return NextResponse.json(
        { message: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Handle profile image (optional)
    let profileImageUrl: string | null = null;
    if (files.profileImage) {
      const profileFile = Array.isArray(files.profileImage)
        ? files.profileImage[0]
        : files.profileImage;

      const filePath =
        (profileFile as any).filepath || (profileFile as any).path;
      profileImageUrl = `/uploads/profiles/${path.basename(filePath)}`;
    }

    // Create user in DB
    await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        role: role as UserRole,
        profileImage: profileImageUrl,
        isApproved: false,
      },
    });

    return NextResponse.json(
      { message: "✅ Registration successful, awaiting admin approval" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔥 Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
