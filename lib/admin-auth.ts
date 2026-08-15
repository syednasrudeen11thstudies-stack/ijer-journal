import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME =
  "ijer_admin_session";

const issuer = "ijer";
const audience = "ijer-admin";

function getSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured.",
    );
  }

  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  adminId: string;
  email: string;
  name: string;
  role: string;
};

export async function createAdminToken(
  session: AdminSession,
) {
  return new SignJWT({
    adminId: session.adminId,
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime("1h")
    .sign(getSecret());
}

export async function verifyAdminToken(
  token: string,
) {
  const { payload } = await jwtVerify(
    token,
    getSecret(),
    {
      issuer,
      audience,
    },
  );

  return payload;
}