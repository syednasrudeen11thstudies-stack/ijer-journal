import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentAdmin();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: session.adminId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    });

    if (!admin || !admin.active) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message:
            "Administrator account is unavailable.",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      admin,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/auth/me failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        message:
          "Unable to verify administrator session.",
      },
      {
        status: 500,
      },
    );
  }
}