import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
} from "@/lib/admin-auth";

export type CurrentAdmin = {
  adminId: string;
  email: string;
  name: string;
  role: string;
};

export async function getCurrentAdmin():
  Promise<CurrentAdmin | null> {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get(
        ADMIN_COOKIE_NAME,
      )?.value;

    if (!token) {
      return null;
    }

    const payload =
      await verifyAdminToken(token);

    if (
      typeof payload.adminId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}