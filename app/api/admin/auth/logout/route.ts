import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
} from "@/lib/admin-auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set(
      ADMIN_COOKIE_NAME,
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
        maxAge: 0,
      },
    );

    return response;
  } catch (error) {
    console.error(
      "Admin logout failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to logout.",
      },
      {
        status: 500,
      },
    );
  }
}