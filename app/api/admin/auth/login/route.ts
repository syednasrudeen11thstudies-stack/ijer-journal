import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function getClientIp(request: Request) {
  const forwarded =
    request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded
      .split(",")[0]
      ?.trim()
      .slice(0, 100) || null;
  }

  const realIp =
    request.headers.get("x-real-ip");

  return realIp?.trim().slice(0, 100) || null;
}

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const email = String(
      body.email || "",
    )
      .trim()
      .toLowerCase()
      .slice(0, 254);

    const password = String(
      body.password || "",
    );

    const ipAddress =
      getClientIp(request);

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        {
          status: 400,
        },
      );
    }

    const windowStart = new Date(
      Date.now() -
        WINDOW_MINUTES *
          60 *
          1000,
    );

    const failedByEmail =
      await prisma.adminLoginAttempt.count({
        where: {
          identifier: email,
          successful: false,

          createdAt: {
            gte: windowStart,
          },
        },
      });

    const failedByIp =
      ipAddress
        ? await prisma.adminLoginAttempt.count({
            where: {
              ipAddress,
              successful: false,

              createdAt: {
                gte: windowStart,
              },
            },
          })
        : 0;

    if (
      failedByEmail >=
        MAX_FAILED_ATTEMPTS ||
      failedByIp >=
        MAX_FAILED_ATTEMPTS
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many failed login attempts. Please try again later.",
        },
        {
          status: 429,

          headers: {
            "Retry-After":
              String(
                WINDOW_MINUTES * 60,
              ),
          },
        },
      );
    }

    const admin =
      await prisma.admin.findUnique({
        where: {
          email,
        },
      });

    let validPassword = false;

    if (
      admin &&
      admin.active
    ) {
      validPassword =
        await bcrypt.compare(
          password,
          admin.passwordHash,
        );
    }

    if (
      !admin ||
      !admin.active ||
      !validPassword
    ) {
      await prisma.adminLoginAttempt.create({
        data: {
          identifier: email,
          ipAddress,
          successful: false,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * Successful login:
     * clear recent failed attempts for
     * this account so legitimate users
     * start with a clean window.
     */
    await prisma.adminLoginAttempt.deleteMany({
      where: {
        identifier: email,
        successful: false,
      },
    });

    await prisma.adminLoginAttempt.create({
      data: {
        identifier: email,
        ipAddress,
        successful: true,
      },
    });

    const token =
      await createAdminToken({
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });

    const response =
      NextResponse.json({
        success: true,

        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });

    response.cookies.set(
      ADMIN_COOKIE_NAME,
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge: 60 * 60,
      },
    );

    return response;
  } catch (error) {
    console.error(
      "Admin login failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to complete admin login.",
      },
      {
        status: 500,
      },
    );
  }
}