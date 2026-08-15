import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const members = await prisma.editorialMember.findMany({
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          fullName: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      members,
    });
  } catch (error) {
    console.error(
      "GET /api/editorial-members failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load editorial members.",
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

    const fullName = String(body.fullName || "").trim();
    const qualifications = String(
      body.qualifications || "",
    ).trim();

    const editorialDesignation = String(
      body.editorialDesignation || "",
    ).trim();

    const specialty = String(body.specialty || "").trim();

    const professionalDesignation = String(
      body.professionalDesignation || "",
    ).trim();

    const department = String(body.department || "").trim();
    const institution = String(body.institution || "").trim();

    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const country = String(body.country || "").trim();

    const email = String(body.email || "").trim();

    const orcidUrl = String(body.orcidUrl || "").trim();
    const googleScholarUrl = String(
      body.googleScholarUrl || "",
    ).trim();
    const researchGateUrl = String(
      body.researchGateUrl || "",
    ).trim();

    const biography = String(body.biography || "").trim();
    const researchInterests = String(
      body.researchInterests || "",
    ).trim();

    const photoUrl = String(body.photoUrl || "").trim();

    const displayOrder = Number(body.displayOrder || 0);

    const status = body.status === "INACTIVE"
      ? "INACTIVE"
      : "ACTIVE";

    const showOnWebsite = Boolean(body.showOnWebsite);

    if (!fullName || !editorialDesignation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Full name and editorial designation are required.",
        },
        {
          status: 400,
        },
      );
    }

    const member = await prisma.editorialMember.create({
      data: {
        fullName,
        qualifications:
          qualifications || null,

        editorialDesignation:
          editorialDesignation as any,

        specialty:
          specialty || null,

        professionalDesignation:
          professionalDesignation || null,

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

        email:
          email || null,

        orcidUrl:
          orcidUrl || null,

        googleScholarUrl:
          googleScholarUrl || null,

        researchGateUrl:
          researchGateUrl || null,

        biography:
          biography || null,

        researchInterests:
          researchInterests || null,

        photoUrl:
          photoUrl || null,

        displayOrder:
          Number.isFinite(displayOrder)
            ? displayOrder
            : 0,

        status,

        showOnWebsite,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Editorial member added successfully.",
        member,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/editorial-members failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to add editorial member.",
      },
      {
        status: 500,
      },
    );
  }
}