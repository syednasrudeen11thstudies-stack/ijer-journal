import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        issue: true,
        manuscript: true,
      },
      orderBy: {
        publishedDate: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.error("GET /api/articles failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load articles.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const manuscriptId = String(
      body.manuscriptId || "",
    ).trim();

    const issueId = String(
      body.issueId || "",
    ).trim();

    const slug = String(
      body.slug || "",
    )
      .trim()
      .toLowerCase();

    const title = String(
      body.title || "",
    ).trim();

    const articleType = String(
      body.articleType || "",
    ).trim();

    const subjectArea = String(
      body.subjectArea || "",
    ).trim();

    const authors = String(
      body.authors || "",
    ).trim();

    const affiliations = String(
      body.affiliations || "",
    ).trim();

    const correspondingAuthor = String(
      body.correspondingAuthor || "",
    ).trim();

    const correspondenceEmail = String(
      body.correspondenceEmail || "",
    ).trim();

    const abstractText = String(
      body.abstractText || "",
    ).trim();

    const keywords = String(
      body.keywords || "",
    ).trim();

    const doi = String(
      body.doi || "",
    ).trim();

    const issn = String(
      body.issn || "",
    ).trim();

    const startPage = String(
      body.startPage || "",
    ).trim();

    const endPage = String(
      body.endPage || "",
    ).trim();

    const pdfUrl = String(
      body.pdfUrl || "",
    ).trim();

    const featured = Boolean(
      body.featured,
    );

    const publishedDate = body.publishedDate
      ? new Date(body.publishedDate)
      : new Date();

    if (
      !manuscriptId ||
      !issueId ||
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
          message:
            "Please complete all required publication fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      Number.isNaN(
        publishedDate.getTime(),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Publication date is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    const manuscript =
      await prisma.manuscript.findUnique({
        where: {
          id: manuscriptId,
        },
        include: {
          article: true,
        },
      });

    if (!manuscript) {
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

    if (
      manuscript.status !==
      "ACCEPTED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only accepted manuscripts can be published.",
        },
        {
          status: 400,
        },
      );
    }

    if (manuscript.article) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This manuscript has already been converted into an article.",
        },
        {
          status: 409,
        },
      );
    }

    const issue =
      await prisma.issue.findUnique({
        where: {
          id: issueId,
        },
      });

    if (!issue) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Journal issue not found.",
        },
        {
          status: 404,
        },
      );
    }

    const existingSlug =
      await prisma.article.findUnique({
        where: {
          slug,
        },
      });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An article with this URL slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

    if (doi) {
      const existingDoi =
        await prisma.article.findUnique({
          where: {
            doi,
          },
        });

      if (existingDoi) {
        return NextResponse.json(
          {
            success: false,
            message:
              "An article with this DOI already exists.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const article =
      await prisma.$transaction(
        async (tx) => {
          const createdArticle =
            await tx.article.create({
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
                  correspondingAuthor ||
                  null,

                correspondenceEmail:
                  correspondenceEmail ||
                  null,

                abstractText,
                keywords,

                doi:
                  doi || null,

                issn:
                  issn || null,

                startPage:
                  startPage || null,

                endPage:
                  endPage || null,

                receivedDate:
                  manuscript.submittedAt,

                acceptedDate:
                  manuscript.acceptedAt ||
                  new Date(),

                publishedDate,

                pdfUrl:
                  pdfUrl ||
                  manuscript.manuscriptFileUrl ||
                  null,

                status:
                  "PUBLISHED",

                featured,

                manuscriptId,
                issueId,
              },
            });

          await tx.manuscript.update({
            where: {
              id: manuscriptId,
            },

            data: {
              status:
                "PUBLISHED",

              publishedAt:
                publishedDate,
            },
          });

          await tx.issue.update({
            where: {
              id: issueId,
            },

            data: {
              published: true,

              publicationDate:
                issue.publicationDate ||
                publishedDate,
            },
          });

          return createdArticle;
        },
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Article published successfully.",

        article,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/articles failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to publish article.",
      },
      {
        status: 500,
      },
    );
  }
}
