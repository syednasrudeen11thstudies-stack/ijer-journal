import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const manuscripts = await prisma.manuscript.findMany({
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      manuscripts,
    });
  } catch (error) {
    console.error("GET /api/manuscripts failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load manuscripts.",
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

    const title = String(body.title || "").trim();
    const articleType = String(body.articleType || "").trim();
    const subjectArea = String(body.subjectArea || "").trim();

    const abstractText = String(body.abstractText || "").trim();
    const keywords = String(body.keywords || "").trim();

    const correspondingAuthor = String(
      body.correspondingAuthor || "",
    ).trim();

    const qualification = String(
      body.qualification || "",
    ).trim();

    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();

    const department = String(
      body.department || "",
    ).trim();

    const institution = String(
      body.institution || "",
    ).trim();

    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const country = String(body.country || "").trim();

    const orcid = String(body.orcid || "").trim();
    const coAuthors = String(body.coAuthors || "").trim();

    const manuscriptFileUrl = String(
      body.manuscriptFileUrl || "",
    ).trim();

    if (
      !title ||
      !articleType ||
      !subjectArea ||
      !abstractText ||
      !keywords ||
      !correspondingAuthor ||
      !email ||
      !manuscriptFileUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields and upload the manuscript file.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !body.originalWorkConfirmed ||
      !body.notSubmittedElsewhere ||
      !body.authorsApproved ||
      !body.conflictsDeclared ||
      !body.ethicsConfirmed ||
      !body.journalPoliciesConfirmed
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please confirm all required publication declarations.",
        },
        {
          status: 400,
        },
      );
    }

    const year = new Date().getFullYear();

    const yearStart = new Date(
      Date.UTC(year, 0, 1, 0, 0, 0),
    );

    const nextYearStart = new Date(
      Date.UTC(year + 1, 0, 1, 0, 0, 0),
    );

    const count = await prisma.manuscript.count({
      where: {
        submittedAt: {
          gte: yearStart,
          lt: nextYearStart,
        },
      },
    });

    let sequence = count + 1;
    let manuscript = null;

    while (!manuscript) {
      const referenceNumber = `IJER-${year}-${String(
        sequence,
      ).padStart(4, "0")}`;

      const existing = await prisma.manuscript.findUnique({
        where: {
          referenceNumber,
        },
      });

      if (existing) {
        sequence += 1;
        continue;
      }

      manuscript = await prisma.manuscript.create({
        data: {
          referenceNumber,

          title,
          articleType,
          subjectArea,

          abstractText,
          keywords,

          correspondingAuthor,

          qualification:
            qualification || null,

          email,

          phone:
            phone || null,

          department:
            department || null,

          institution:
            institution || null,

          city:
            city || null,

          state:
            state || null,

          country:
            country || null,

          orcid:
            orcid || null,

          coAuthors:
            coAuthors || null,

          manuscriptFileUrl,

          originalWorkConfirmed: true,

          notSubmittedElsewhere: true,

          authorsApproved: true,

          conflictsDeclared: true,

          ethicsConfirmed: true,

          journalPoliciesConfirmed: true,

          status: "RECEIVED",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Manuscript submitted successfully.",

        manuscript: {
          id: manuscript.id,
          referenceNumber:
            manuscript.referenceNumber,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/manuscripts failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to submit manuscript.",
      },
      {
        status: 500,
      },
    );
  }
}