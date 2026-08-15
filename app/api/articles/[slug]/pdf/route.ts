import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  },
) {
  try {
    const { slug } = await context.params;

    const article = await prisma.article.findUnique({
      where: {
        slug,
      },

      select: {
        slug: true,
        title: true,
        pdfUrl: true,
        status: true,
      },
    });

    if (
      !article ||
      article.status !== "PUBLISHED" ||
      !article.pdfUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Published PDF not found.",
        },
        {
          status: 404,
        },
      );
    }

    const result = await get(
      article.pdfUrl,
      {
        access: "private",
        useCache: true,
      },
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to retrieve published PDF.",
        },
        {
          status: 404,
        },
      );
    }

    const headers = new Headers();

    headers.set(
      "Content-Type",
      result.headers.get("content-type") ||
        "application/pdf",
    );

    const contentLength =
      result.headers.get("content-length");

    if (contentLength) {
      headers.set(
        "Content-Length",
        contentLength,
      );
    }

    headers.set(
      "Content-Disposition",
      `inline; filename="${article.slug}.pdf"`,
    );

    headers.set(
      "Cache-Control",
      "public, max-age=3600",
    );

    return new Response(
      result.stream,
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error(
      "GET published article PDF failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to open published PDF.",
      },
      {
        status: 500,
      },
    );
  }
}