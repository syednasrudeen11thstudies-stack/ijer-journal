import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/current-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const currentAdmin =
      await getCurrentAdmin();

    if (
      !currentAdmin ||
      currentAdmin.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super Admin access required.",
        },
        {
          status: 403,
        },
      );
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

        select: {
          id: true,
          referenceNumber: true,

          title: true,
          articleType: true,
          subjectArea: true,

          abstractText: true,
          keywords: true,

          correspondingAuthor: true,
          qualification: true,

          email: true,
          phone: true,

          department: true,
          institution: true,

          city: true,
          state: true,
          country: true,

          orcid: true,
          coAuthors: true,

          manuscriptFileUrl: true,
          supportingFileUrl: true,
          coverLetterUrl: true,

          originalWorkConfirmed: true,
          notSubmittedElsewhere: true,
          authorsApproved: true,
          conflictsDeclared: true,
          ethicsConfirmed: true,
          journalPoliciesConfirmed: true,

          status: true,

          adminNotes: true,
          reviewNotes: true,
          revisionNotes: true,

          submittedAt: true,
          reviewedAt: true,
          acceptedAt: true,
          rejectedAt: true,
          publishedAt: true,

          createdAt: true,
          updatedAt: true,
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

        select: {
          id: true,
          volumeNumber: true,
          issueNumber: true,
          year: true,

          title: true,
          description: true,

          publicationDate: true,
          coverImageUrl: true,

          published: true,
          current: true,

          createdAt: true,
          updatedAt: true,
        },
      }),

      prisma.article.findMany({
        orderBy: {
          publishedDate: "desc",
        },

        select: {
          id: true,
          slug: true,

          title: true,
          articleType: true,
          subjectArea: true,

          authors: true,
          affiliations: true,

          correspondingAuthor: true,
          correspondenceEmail: true,

          abstractText: true,
          keywords: true,

          introduction: true,
          methods: true,
          results: true,
          discussion: true,
          conclusion: true,

          acknowledgements: true,

          conflictOfInterest: true,
          fundingStatement: true,
          ethicsStatement: true,

          referencesText: true,

          doi: true,
          issn: true,

          startPage: true,
          endPage: true,

          receivedDate: true,
          acceptedDate: true,
          publishedDate: true,

          pdfUrl: true,

          status: true,
          featured: true,

          manuscriptId: true,
          issueId: true,

          createdAt: true,
          updatedAt: true,
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

      generatedBy: {
        id: currentAdmin.adminId,
        name: currentAdmin.name,
        email: currentAdmin.email,
        role: currentAdmin.role,
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