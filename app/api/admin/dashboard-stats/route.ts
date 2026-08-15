import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [
      receivedManuscripts,
      publishedArticles,
      journalIssues,
      editorialMembers,
    ] = await Promise.all([
      prisma.manuscript.count({
        where: {
          status: "RECEIVED",
        },
      }),

      prisma.article.count({
        where: {
          status: "PUBLISHED",
        },
      }),

      prisma.issue.count({
        where: {
          published: true,
        },
      }),

      prisma.editorialMember.count({
        where: {
          status: "ACTIVE",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,

      stats: {
        receivedManuscripts,
        publishedArticles,
        journalIssues,
        editorialMembers,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard statistics error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load dashboard statistics.",
      },
      {
        status: 500,
      },
    );
  }
}