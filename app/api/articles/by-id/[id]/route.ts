import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;

    const article = await prisma.article.findUnique({
      where: {
        id,
      },

      include: {
        issue: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error(
      "GET /api/articles/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load article.",
      },
      {
        status: 500,
      },
    );
  }
}

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

    const existing = await prisma.article.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found.",
        },
        {
          status: 404,
        },
      );
    }

    const slug = String(body.slug || "").trim().toLowerCase();
    const title = String(body.title || "").trim();
    const articleType = String(body.articleType || "").trim();
    const subjectArea = String(body.subjectArea || "").trim();

    const authors = String(body.authors || "").trim();
    const affiliations = String(body.affiliations || "").trim();

    const correspondingAuthor = String(
      body.correspondingAuthor || "",
    ).trim();

    const correspondenceEmail = String(
      body.correspondenceEmail || "",
    ).trim();

    const abstractText = String(
      body.abstractText || "",
    ).trim();

    const keywords = String(body.keywords || "").trim();

    const introduction = String(
      body.introduction || "",
    ).trim();

    const methods = String(body.methods || "").trim();
    const results = String(body.results || "").trim();
    const discussion = String(body.discussion || "").trim();
    const conclusion = String(body.conclusion || "").trim();

    const acknowledgements = String(
      body.acknowledgements || "",
    ).trim();

    const conflictOfInterest = String(
      body.conflictOfInterest || "",
    ).trim();

    const fundingStatement = String(
      body.fundingStatement || "",
    ).trim();

    const ethicsStatement = String(
      body.ethicsStatement || "",
    ).trim();

    const referencesText = String(
      body.referencesText || "",
    ).trim();

    const doi = String(body.doi || "").trim();
    const issn = String(body.issn || "").trim();

    const startPage = String(body.startPage || "").trim();
    const endPage = String(body.endPage || "").trim();

    const issueId = String(body.issueId || "").trim();

    const featured = Boolean(body.featured);

    if (
      !slug ||
      !title ||
      !articleType ||
      !authors ||
      !abstractText ||
      !keywords
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    const slugConflict = await prisma.article.findFirst({
      where: {
        slug,
        NOT: {
          id,
        },
      },
    });

    if (slugConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Another article already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    if (doi) {
      const doiConflict = await prisma.article.findFirst({
        where: {
          doi,
          NOT: {
            id,
          },
        },
      });

      if (doiConflict) {
        return NextResponse.json(
          {
            success: false,
            message: "Another article already uses this DOI.",
          },
          {
            status: 409,
          },
        );
      }
    }

    if (issueId) {
      const issue = await prisma.issue.findUnique({
        where: {
          id: issueId,
        },
      });

      if (!issue) {
        return NextResponse.json(
          {
            success: false,
            message: "Selected journal issue was not found.",
          },
          {
            status: 404,
          },
        );
      }
    }

    const article = await prisma.article.update({
      where: {
        id,
      },

      data: {
        slug,
        title,
        articleType,

        subjectArea:
          subjectArea || null,

        authors,

        affiliations:
          affiliations || null,

        correspondingAuthor:
          correspondingAuthor || null,

        correspondenceEmail:
          correspondenceEmail || null,

        abstractText,
        keywords,

        introduction:
          introduction || null,

        methods:
          methods || null,

        results:
          results || null,

        discussion:
          discussion || null,

        conclusion:
          conclusion || null,

        acknowledgements:
          acknowledgements || null,

        conflictOfInterest:
          conflictOfInterest || null,

        fundingStatement:
          fundingStatement || null,

        ethicsStatement:
          ethicsStatement || null,

        referencesText:
          referencesText || null,

        doi:
          doi || null,

        issn:
          issn || null,

        startPage:
          startPage || null,

        endPage:
          endPage || null,

        issueId:
          issueId || null,

        featured,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article updated successfully.",
      article,
    });
  } catch (error) {
    console.error(
      "PATCH /api/articles/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update article.",
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

    const article = await prisma.article.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        manuscriptId: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.article.delete({
        where: {
          id,
        },
      });

      if (article.manuscriptId) {
        await tx.manuscript.update({
          where: {
            id: article.manuscriptId,
          },

          data: {
            status: "ACCEPTED",
            publishedAt: null,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/articles/by-id/[id] failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete article.",
      },
      {
        status: 500,
      },
    );
  }
}