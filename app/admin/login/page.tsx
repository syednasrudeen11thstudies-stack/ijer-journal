"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="admin-login-page">
          <div className="admin-login-loading">
            Loading administrator login...
          </div>
        </main>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
function AdminLoginContent() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const [loading, setLoading] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const response =
          await fetch(
            "/api/admin/auth/session",
            {
              cache: "no-store",
            },
          );

        const data =
          await response.json();

        if (
          data.authenticated
        ) {
          router.replace(
            "/admin/dashboard",
          );
          return;
        }
      } catch {
        // Continue to login form.
      }

      setChecking(false);
    }

    checkSession();
  }, [router]);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData =
      new FormData(
        event.currentTarget,
      );

    try {
      const response =
        await fetch(
          "/api/admin/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email: String(
                formData.get(
                  "adminEmail",
                ) || "",
              ),

              password: String(
                formData.get(
                  "adminPassword",
                ) || "",
              ),
            }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to login.",
        );
      }

      const destination =
        searchParams.get("next") ||
        "/admin/dashboard";

      router.replace(
        destination,
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-loading">
          Checking administrator session...
        </div>

        <Styles />
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-shell">
        <section className="admin-login-info">
          <div className="admin-logo-wrap">
            <Image
              src="/logo.png"
              alt="IJER"
              width={280}
              height={280}
              priority
            />
          </div>

          <span className="login-eyebrow">
            Private Administration
          </span>

          <h1>
            Journal Administration
          </h1>

          <p>
            Secure administrative access
            for managing IJER manuscripts,
            articles, issues and journal
            information.
          </p>
        </section>

        <section className="admin-login-card">
          <span className="login-eyebrow">
            Authorized Access
          </span>

          <h2>Admin Login</h2>

          <p>
            Sign in using your authorized
            IJER administrator account.
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            <label>
              Admin Email

              <input
                name="adminEmail"
                type="email"
                required
                autoComplete="username"
              />
            </label>

            <label>
              Password

              <input
                name="adminPassword"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Login to Admin"}
            </button>
          </form>

          <Link
            href="/"
            className="back-link"
          >
            ← Return to Journal
          </Link>
        </section>
      </div>

      <Styles />
    </main>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      .admin-login-page {
        min-height: 100vh;
        padding: 60px 25px;
        display: grid;
        place-items: center;
        background: #f4f8f6;
        color: #17382f;
      }

      .admin-login-shell {
        width: min(1050px, 100%);
        display: grid;
        grid-template-columns:
          minmax(0, 1fr)
          minmax(360px, 430px);
        overflow: hidden;
        border: 1px solid #dce8e2;
        border-radius: 26px;
        background: white;
        box-shadow:
          0 25px 70px
          rgba(20, 70, 52, 0.08);
      }

      .admin-login-info {
        padding: 55px;
        background: #0e503a;
        color: white;
      }

      .admin-logo-wrap {
        width: 125px;
        height: 125px;
        margin-bottom: 30px;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: 20px;
        background: white;
      }

      .admin-logo-wrap img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .login-eyebrow {
        display: block;
        margin-bottom: 10px;
        color: #85c7ae;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .admin-login-info h1 {
        margin: 0;
        color: white;
        font-size: 45px;
        line-height: 1.1;
      }

      .admin-login-info p {
        margin-top: 20px;
        color: #d8ebe3;
        line-height: 1.8;
      }

      .admin-login-card {
        padding: 55px 45px;
      }

      .admin-login-card h2 {
        margin: 0 0 10px;
        font-size: 32px;
      }

      .admin-login-card > p {
        margin: 0 0 28px;
        color: #74867e;
        line-height: 1.7;
      }

      .admin-login-card form {
        display: grid;
        gap: 20px;
      }

      .admin-login-card label {
        display: grid;
        gap: 8px;
        font-size: 13px;
        font-weight: 800;
      }

      .admin-login-card input {
        width: 100%;
        min-height: 50px;
        padding: 12px 14px;
        border: 1px solid #cadbd3;
        border-radius: 9px;
        font: inherit;
      }

      .admin-login-card button {
        min-height: 51px;
        border: 0;
        border-radius: 9px;
        background: #176b4d;
        color: white;
        font-weight: 900;
        cursor: pointer;
      }

      .admin-login-card button:disabled {
        opacity: 0.6;
      }

      .login-error {
        margin-bottom: 20px;
        padding: 13px;
        border-radius: 9px;
        background: #fff0ef;
        color: #a23e38;
        font-weight: 700;
      }

      .back-link {
        display: inline-block;
        margin-top: 25px;
        color: #176b4d;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .admin-login-loading {
        padding: 40px;
        border-radius: 16px;
        background: white;
        color: #176b4d;
        font-weight: 800;
      }

      @media (max-width: 800px) {
        .admin-login-shell {
          grid-template-columns: 1fr;
        }

        .admin-login-info,
        .admin-login-card {
          padding: 35px 28px;
        }
      }
    `}</style>
  );
}