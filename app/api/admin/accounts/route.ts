import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin";

export const runtime = "nodejs";

const allowedRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
] as const;

export async function GET() {
  try {
    const session = await getCurrentAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    if (session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only a Super Admin can manage administrator accounts.",
        },
        {
          status: 403,
        },
      );
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: [
        {
          active: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      currentAdminId: session.adminId,
      admins,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/accounts failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load administrator accounts.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const session = await getCurrentAdmin();

    if (
      !session ||
      session.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super Admin permission required.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const name = String(
      body.name || "",
    ).trim();

    const email = String(
      body.email || "",
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password || "",
    );

    const role = String(
      body.role || "ADMIN",
    );

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !email ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid administrator email.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !allowedRoles.includes(
        role as typeof allowedRoles[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid administrator role.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await prisma.admin.findUnique({
        where: {
          email,
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An administrator with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );

    const admin =
      await prisma.admin.create({
        data: {
          name,
          email,
          passwordHash,
          role:
            role as
              | "SUPER_ADMIN"
              | "ADMIN"
              | "EDITOR",
          active: true,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Administrator account created successfully.",
        admin,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/accounts failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create administrator account.",
      },
      {
        status: 500,
      },
    );
  }
}