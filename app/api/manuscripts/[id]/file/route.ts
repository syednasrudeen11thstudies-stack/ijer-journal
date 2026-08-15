import { get } from "@vercel/blob";
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

    const manuscript =
      await prisma.manuscript.findUnique({
        where: {
          id,
        },

        select: {
          manuscriptFileUrl: true,
          referenceNumber: true,
        },
      });

    if (
      !manuscript ||
      !manuscript.manuscriptFileUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Manuscript file not found.",
        },
        {
          status: 404,
        },
      );
    }

    const result = await get(
      manuscript.manuscriptFileUrl,
      {
        access: "private",
        useCache: false,
      },
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to retrieve manuscript file.",
        },
        {
          status: 404,
        },
      );
    }

    const headers = new Headers();

    const contentType =
      result.headers.get("content-type");

    if (contentType) {
      headers.set(
        "Content-Type",
        contentType,
      );
    }

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
      `inline; filename="${manuscript.referenceNumber}-manuscript"`,
    );

    headers.set(
      "Cache-Control",
      "private, no-store",
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
      "GET manuscript file failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to open manuscript file.",
      },
      {
        status: 500,
      },
    );
  }
}