import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isBackupSecretValid(request: Request) {
  const expected =
    process.env.BACKUP_SYNC_SECRET;

  if (!expected) {
    return false;
  }

  const provided =
    request.headers.get("x-ijer-backup-secret");

  return Boolean(
    provided &&
      provided.length === expected.length &&
      provided === expected,
  );
}

export async function GET(request: Request) {
  try {
    const secretAccess =
      isBackupSecretValid(request);

    let currentAdmin = null;

    if (!secretAccess) {
      currentAdmin =
        await getCurrentAdmin();

      if (
        !currentAdmin ||
        currentAdmin.role !== "SUPER_ADMIN"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Backup authentication required.",
          },
          {
            status: 403,
          },
        );
      }
    }

    const [
      manuscripts,
      issues,
      articles,
      editorialMembers,
      journalSettings,
    ] = await Promise.all([
      prisma.manuscript.findMany({
        orderBy: {
          submittedAt: "desc",
        },
      }),

      prisma.issue.findMany({
        orderBy: [
          {
            year: "desc",
          },
          {
            volumeNumber: "desc",
          },
          {
            issueNumber: "desc",
          },
        ],
      }),

      prisma.article.findMany({
        orderBy: {
          publishedDate: "desc",
        },
      }),

      prisma.editorialMember.findMany({
        orderBy: {
          displayOrder: "asc",
        },
      }),

      prisma.journalSettings.findFirst(),
    ]);

    return NextResponse.json({
      success: true,

      generatedAt:
        new Date().toISOString(),

      generatedBy:
        secretAccess
          ? {
              type: "LOCAL_BACKUP_SYNC",
            }
          : {
              type: "SUPER_ADMIN",
              id: currentAdmin?.adminId,
              name: currentAdmin?.name,
              email: currentAdmin?.email,
            },

      counts: {
        manuscripts:
          manuscripts.length,

        issues:
          issues.length,

        articles:
          articles.length,

        editorialMembers:
          editorialMembers.length,
      },

      data: {
        manuscripts,
        issues,
        articles,
        editorialMembers,
        journalSettings,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/admin/backup failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create journal backup.",
      },
      {
        status: 500,
      },
    );
  }
}