import {
  NextRequest,
  NextResponse,
} from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME =
  "ijer_admin_session";

type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "EDITOR";

function getSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(
    secret,
  );
}


function hasValidBackupSecret(
  request: NextRequest,
) {
  const expected =
    process.env.BACKUP_SYNC_SECRET;

  const provided =
    request.headers.get(
      "x-ijer-backup-secret",
    );

  return Boolean(
    expected &&
    provided &&
    provided === expected,
  );
}
function isPublicRoute(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  const method =
    request.method.toUpperCase();

  if (
    pathname === "/admin/login" ||
    pathname.startsWith(
      "/api/admin/auth/",
    )
  ) {
    return true;
  }

  // Public manuscript submission
  if (
    pathname === "/api/manuscripts" &&
    method === "POST"
  ) {
    return true;
  }

  if (
    pathname ===
      "/api/manuscripts/upload" &&
    method === "POST"
  ) {
    return true;
  }

  // Public article PDFs
  if (
    pathname.startsWith(
      "/api/articles/",
    ) &&
    pathname.endsWith("/pdf") &&
    method === "GET"
  ) {
    return true;
  }

  // Public journal settings read
  if (
    pathname ===
      "/api/journal-settings" &&
    method === "GET"
  ) {
    return true;
  }

  return false;
}

function requiresAdminAuthentication(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return true;
  }

  if (
    pathname.startsWith("/api/admin/")
  ) {
    return true;
  }

  if (
    pathname === "/api/articles" ||
    pathname.startsWith(
      "/api/articles/",
    )
  ) {
    return true;
  }

  if (
    pathname === "/api/issues" ||
    pathname.startsWith(
      "/api/issues/",
    )
  ) {
    return true;
  }

  if (
    pathname ===
      "/api/editorial-members" ||
    pathname.startsWith(
      "/api/editorial-members/",
    )
  ) {
    return true;
  }

  if (
    pathname ===
    "/api/journal-settings"
  ) {
    return true;
  }

  if (
    pathname === "/api/manuscripts" ||
    pathname.startsWith(
      "/api/manuscripts/",
    )
  ) {
    return true;
  }

  return false;
}

function hasPermission(
  role: AdminRole,
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  const method =
    request.method.toUpperCase();

  // ======================================
  // SUPER ADMIN
  // ======================================

  if (role === "SUPER_ADMIN") {
    return true;
  }

  // ======================================
  // ADMIN
  // ======================================

  if (role === "ADMIN") {
    // Admin cannot manage administrator accounts
    if (
      pathname === "/admin/accounts" ||
      pathname.startsWith(
        "/admin/accounts/"
      ) ||
      pathname ===
        "/api/admin/accounts" ||
      pathname.startsWith(
        "/api/admin/accounts/"
      )
    ) {
      return false;
    }

    // Journal Settings restricted to Super Admin
    if (
      pathname === "/admin/settings" ||
      pathname.startsWith(
        "/admin/settings/"
      ) ||
      pathname ===
        "/api/journal-settings"
    ) {
      return false;
    }

    return true;
  }

  // ======================================
  // EDITOR
  // ======================================

  if (role === "EDITOR") {
    // Dashboard
    if (
      pathname ===
      "/admin/dashboard"
    ) {
      return true;
    }

    // Manuscript review pages
    if (
      pathname ===
        "/admin/manuscripts" ||
      pathname.startsWith(
        "/admin/manuscripts/"
      )
    ) {
      return true;
    }

    // Article management pages
    if (
      pathname ===
        "/admin/articles" ||
      pathname.startsWith(
        "/admin/articles/"
      )
    ) {
      return true;
    }

    // Manuscript APIs
    if (
      pathname ===
        "/api/manuscripts" ||
      pathname.startsWith(
        "/api/manuscripts/"
      )
    ) {
      return true;
    }

    // Article APIs
    if (
      pathname ===
        "/api/articles" ||
      pathname.startsWith(
        "/api/articles/"
      )
    ) {
      return true;
    }

    // Editor needs to read issues when
    // publishing or editing an article.
    if (
      (
        pathname === "/api/issues" ||
        pathname.startsWith(
          "/api/issues/"
        )
      ) &&
      method === "GET"
    ) {
      return true;
    }

    // Dashboard statistics
    if (
      pathname ===
      "/api/admin/dashboard-stats"
    ) {
      return true;
    }

    return false;
  }

  return false;
}

function loginRedirect(
  request: NextRequest,
) {
  const loginUrl =
    new URL(
      "/admin/login",
      request.url,
    );

  loginUrl.searchParams.set(
    "next",
    request.nextUrl.pathname,
  );

  return NextResponse.redirect(
    loginUrl,
  );
}

function permissionDenied(
  request: NextRequest,
) {
  if (
    request.nextUrl.pathname.startsWith(
      "/api/",
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "You do not have permission to perform this action.",
      },
      {
        status: 403,
      },
    );
  }

  const dashboardUrl =
    new URL(
      "/admin/dashboard",
      request.url,
    );

  dashboardUrl.searchParams.set(
    "access",
    "denied",
  );

  return NextResponse.redirect(
    dashboardUrl,
  );
}

export async function proxy(
  request: NextRequest,
) {
  if (
    request.nextUrl.pathname ===
      "/api/admin/backup" &&
    hasValidBackupSecret(request)
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  if (
    !requiresAdminAuthentication(
      request,
    )
  ) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      COOKIE_NAME,
    )?.value;

  const secret =
    getSecret();

  if (!token || !secret) {
    return loginRedirect(
      request,
    );
  }

  try {
    const { payload } =
      await jwtVerify(
        token,
        secret,
        {
          issuer: "ijer",
          audience: "ijer-admin",
        },
      );

    const role =
      payload.role as
        | AdminRole
        | undefined;

    if (
      !role ||
      ![
        "SUPER_ADMIN",
        "ADMIN",
        "EDITOR",
      ].includes(role)
    ) {
      return loginRedirect(
        request,
      );
    }

    if (
      !hasPermission(
        role,
        request,
      )
    ) {
      return permissionDenied(
        request,
      );
    }

    return NextResponse.next();
  } catch {
    return loginRedirect(
      request,
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};