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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
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

    const { id } = await context.params;

    const existing =
      await prisma.admin.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator account not found.",
        },
        {
          status: 404,
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

    const role = String(
      body.role || existing.role,
    );

    const active =
      body.active !== false;

    const password = String(
      body.password || "",
    );

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name and email are required.",
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

    if (
      id === session.adminId &&
      active === false
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot deactivate your own account.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      id === session.adminId &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot remove your own Super Admin role.",
        },
        {
          status: 400,
        },
      );
    }

    const emailConflict =
      await prisma.admin.findFirst({
        where: {
          email,

          NOT: {
            id,
          },
        },
      });

    if (emailConflict) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another administrator already uses this email.",
        },
        {
          status: 409,
        },
      );
    }

    let passwordHash:
      | string
      | undefined;

    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          {
            success: false,
            message:
              "New password must contain at least 8 characters.",
          },
          {
            status: 400,
          },
        );
      }

      passwordHash =
        await bcrypt.hash(
          password,
          12,
        );
    }

    const admin =
      await prisma.admin.update({
        where: {
          id,
        },

        data: {
          name,
          email,

          role:
            role as
              | "SUPER_ADMIN"
              | "ADMIN"
              | "EDITOR",

          active,

          ...(passwordHash
            ? {
                passwordHash,
              }
            : {}),
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Administrator account updated successfully.",
      admin,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/accounts/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update administrator account.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
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

    const { id } = await context.params;

    if (id === session.adminId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot delete your own administrator account.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await prisma.admin.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Administrator account not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.admin.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Administrator account deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/accounts/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete administrator account.",
      },
      {
        status: 500,
      },
    );
  }
}