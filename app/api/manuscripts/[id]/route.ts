import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const manuscript =
      await prisma.manuscript.findUnique({
        where: {
          id,
        },
      });

    if (!manuscript) {
      return NextResponse.json(
        {
          success: false,
          message: "Manuscript not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      manuscript,
    });
  } catch (error) {
    console.error(
      "GET manuscript error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load manuscript.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const allowedStatuses = [
      "RECEIVED",
      "UNDER_REVIEW",
      "REVISION_REQUIRED",
      "ACCEPTED",
      "REJECTED",
      "PUBLISHED",
    ];

    if (
      !allowedStatuses.includes(
        body.status,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid manuscript status.",
        },
        {
          status: 400,
        },
      );
    }

    const existing =
      await prisma.manuscript.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Manuscript not found.",
        },
        {
          status: 404,
        },
      );
    }

    const now = new Date();

    const manuscript =
      await prisma.manuscript.update({
        where: {
          id,
        },

        data: {
          status: body.status,

          adminNotes:
            body.adminNotes?.trim() ||
            null,

          reviewNotes:
            body.reviewNotes?.trim() ||
            null,

          revisionNotes:
            body.revisionNotes?.trim() ||
            null,

          reviewedAt:
            body.status ===
              "UNDER_REVIEW" &&
            !existing.reviewedAt
              ? now
              : existing.reviewedAt,

          acceptedAt:
            body.status === "ACCEPTED"
              ? existing.acceptedAt ??
                now
              : existing.acceptedAt,

          rejectedAt:
            body.status === "REJECTED"
              ? existing.rejectedAt ??
                now
              : existing.rejectedAt,
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "Manuscript updated successfully.",
      manuscript,
    });
  } catch (error) {
    console.error(
      "PATCH manuscript error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update manuscript.",
      },
      {
        status: 500,
      },
    );
  }
}