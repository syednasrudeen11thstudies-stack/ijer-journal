import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
} from "@/lib/admin-auth";

export async function GET() {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        ADMIN_COOKIE_NAME,
      )?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    const session =
      await verifyAdminToken(token);

    return NextResponse.json({
      authenticated: true,

      admin: {
        id: session.adminId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
    });
  }
}