import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const member =
      await prisma.editorialMember.findUnique({
        where: {
          id,
        },
      });

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Editorial member not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updated =
      await prisma.editorialMember.update({
        where: {
          id,
        },

        data: {
          fullName: String(
            body.fullName || "",
          ).trim(),

          qualifications:
            String(
              body.qualifications || "",
            ).trim() || null,

          editorialDesignation:
            String(
              body.editorialDesignation || "",
            ).trim() as any,

          specialty:
            String(
              body.specialty || "",
            ).trim() || null,

          professionalDesignation:
            String(
              body.professionalDesignation || "",
            ).trim() || null,

          department:
            String(
              body.department || "",
            ).trim() || null,

          institution:
            String(
              body.institution || "",
            ).trim() || null,

          city:
            String(
              body.city || "",
            ).trim() || null,

          state:
            String(
              body.state || "",
            ).trim() || null,

          country:
            String(
              body.country || "",
            ).trim() || null,

          email:
            String(
              body.email || "",
            ).trim() || null,

          displayOrder:
            Number(
              body.displayOrder || 0,
            ),

          status:
            body.status === "INACTIVE"
              ? "INACTIVE"
              : "ACTIVE",

          showOnWebsite:
            Boolean(
              body.showOnWebsite,
            ),
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Editorial member updated successfully.",
      member: updated,
    });
  } catch (error) {
    console.error(
      "PATCH editorial member failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update editorial member.",
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
    const { id } = await context.params;

    await prisma.editorialMember.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Editorial member deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE editorial member failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete editorial member.",
      },
      {
        status: 500,
      },
    );
  }
}