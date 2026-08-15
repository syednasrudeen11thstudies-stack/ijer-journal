import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    let settings = await prisma.journalSettings.findFirst();

    if (!settings) {
      settings = await prisma.journalSettings.create({
        data: {},
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "GET /api/journal-settings failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load journal settings.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    let settings = await prisma.journalSettings.findFirst();

    if (!settings) {
      settings = await prisma.journalSettings.create({
        data: {},
      });
    }

    const updated =
      await prisma.journalSettings.update({
        where: {
          id: settings.id,
        },

        data: {
          journalName:
            String(body.journalName || "").trim() ||
            "International Journal of Electro-Homoeopathy & Research",

          abbreviation:
            String(body.abbreviation || "").trim() ||
            "IJER",

          issnPrint:
            String(body.issnPrint || "").trim() || null,

          issnOnline:
            String(body.issnOnline || "").trim() || null,

          publisherName:
            String(body.publisherName || "").trim() || null,

          email:
            String(body.email || "").trim() || null,

          phone:
            String(body.phone || "").trim() || null,

          address:
            String(body.address || "").trim() || null,

          city:
            String(body.city || "").trim() || null,

          state:
            String(body.state || "").trim() || null,

          country:
            String(body.country || "").trim() || null,

          postalCode:
            String(body.postalCode || "").trim() || null,

          websiteUrl:
            String(body.websiteUrl || "").trim() || null,

          publicationFrequency:
            String(
              body.publicationFrequency || "",
            ).trim() || null,

          aimsAndScope:
            String(body.aimsAndScope || "").trim() || null,

          copyrightText:
            String(body.copyrightText || "").trim() || null,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Journal settings updated successfully.",
      settings: updated,
    });
  } catch (error) {
    console.error(
      "PATCH /api/journal-settings failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update journal settings.",
      },
      {
        status: 500,
      },
    );
  }
}