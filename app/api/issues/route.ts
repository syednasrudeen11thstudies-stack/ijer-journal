import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
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
    });

    return NextResponse.json({
      success: true,
      issues,
    });
  } catch (error) {
    console.error("GET /api/issues failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load journal issues.",
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

    const volumeNumber = Number(body.volumeNumber);
    const issueNumber = Number(body.issueNumber);
    const year = Number(body.year);

    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();

    const publicationDate = body.publicationDate
      ? new Date(body.publicationDate)
      : null;

    const current = Boolean(body.current);
    const published = Boolean(body.published);

    if (
      !Number.isInteger(volumeNumber) ||
      volumeNumber < 1 ||
      !Number.isInteger(issueNumber) ||
      issueNumber < 1 ||
      !Number.isInteger(year) ||
      year < 2000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid volume number, issue number and year.",
        },
        {
          status: 400,
        },
      );
    }

    const existing = await prisma.issue.findUnique({
      where: {
        volumeNumber_issueNumber_year: {
          volumeNumber,
          issueNumber,
          year,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This volume, issue and year already exist.",
        },
        {
          status: 409,
        },
      );
    }

    if (current) {
      await prisma.issue.updateMany({
        where: {
          current: true,
        },
        data: {
          current: false,
        },
      });
    }

    const issue = await prisma.issue.create({
      data: {
        volumeNumber,
        issueNumber,
        year,

        title: title || null,
        description: description || null,

        publicationDate,

        published,
        current,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Journal issue created successfully.",
        issue,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/issues failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create journal issue.",
      },
      {
        status: 500,
      },
    );
  }
}