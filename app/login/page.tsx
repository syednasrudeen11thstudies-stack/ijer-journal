"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-info">
          <span className="login-badge">IJER</span>

          <span className="eyebrow">
            Journal Management System
          </span>

          <h1>
            Welcome Back
          </h1>

          <p>
            Sign in to manage manuscripts, track editorial decisions, complete
            peer reviews, and access your International Journal of
            Electro-Homoeopathy &amp; Research account.
          </p>

          <div className="login-features">
            <div>
              <strong>Authors</strong>
              <span>Submit and track manuscripts</span>
            </div>

            <div>
              <strong>Reviewers</strong>
              <span>Access assigned peer reviews</span>
            </div>

            <div>
              <strong>Editors</strong>
              <span>Manage editorial workflows</span>
            </div>
          </div>
        </section>

        <section className="login-form-card">
          <div className="login-form-heading">
            <span className="eyebrow">
              Secure Access
            </span>

            <h2>
              Login to IJER
            </h2>

            <p>
              Enter your registered email address and password.
            </p>
          </div>

          {submitted && (
            <div className="login-demo-message">
              Login interface is working. Real authentication will be connected
              during the database stage.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="login-field">
              <div className="password-label">
                <label htmlFor="password">
                  Password
                </label>

                <Link href="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <label className="remember-login">
              <input type="checkbox" />
              <span>Remember me on this device</span>
            </label>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="login-divider">
            <span>New to IJER?</span>
          </div>

          <Link href="/register" className="register-button">
            Create Author Account
          </Link>

          <p className="login-note">
            Reviewer, Editor and Administrator privileges will be assigned by
            authorized IJER administrators.
          </p>
        </section>
      </div>

      <style jsx global>{`
        .login-page {
          min-height: 72vh;
          padding: 90px 0 110px;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(22, 103, 71, 0.11),
              transparent 30%
            ),
            #f8fcfa;
        }

        .login-shell {
          width: min(1120px, calc(100% - 44px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 90px;
          align-items: center;
        }

        .login-info {
          max-width: 600px;
        }

        .login-badge {
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          margin-bottom: 32px;
          border-radius: 20px;
          background: var(--green);
          color: #ffffff;
          font-size: 19px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .login-info h1 {
          margin: 0;
          font-size: clamp(46px, 6vw, 68px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .login-info > p {
          max-width: 590px;
          margin: 26px 0 38px;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.85;
        }

        .login-features {
          display: grid;
          gap: 15px;
        }

        .login-features div {
          padding: 20px 22px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.72);
        }

        .login-features strong,
        .login-features span {
          display: block;
        }

        .login-features strong {
          margin-bottom: 3px;
          color: var(--green-dark);
        }

        .login-features span {
          color: var(--muted);
          font-size: 14px;
        }

        .login-form-card {
          padding: 42px;
          border: 1px solid var(--border);
          border-radius: 26px;
          background: #ffffff;
          box-shadow: 0 26px 75px rgba(31, 78, 60, 0.1);
        }

        .login-form-heading {
          margin-bottom: 32px;
        }

        .login-form-heading h2 {
          margin: 0 0 10px;
          font-size: 34px;
        }

        .login-form-heading p {
          margin: 0;
          color: var(--muted);
        }

        .login-demo-message {
          margin-bottom: 24px;
          padding: 15px;
          border: 1px solid #cfe2d8;
          border-radius: 10px;
          background: var(--green-soft);
          color: var(--green-dark);
          font-size: 14px;
          line-height: 1.6;
        }

        .login-field {
          margin-bottom: 22px;
        }

        .login-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 800;
        }

        .login-field input {
          width: 100%;
          min-height: 52px;
          padding: 12px 14px;
          border: 1px solid #cbdad3;
          border-radius: 11px;
          outline: none;
          color: var(--foreground);
          font: inherit;
        }

        .login-field input:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(22, 103, 71, 0.1);
        }

        .password-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .password-label a {
          margin-bottom: 8px;
          color: var(--green);
          font-size: 13px;
          font-weight: 700;
        }

        .remember-login {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          color: var(--muted);
          font-size: 14px;
        }

        .remember-login input {
          width: 17px;
          height: 17px;
          accent-color: var(--green);
        }

        .login-button {
          width: 100%;
          min-height: 52px;
          border: 0;
          border-radius: 11px;
          background: var(--green);
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .login-button:hover {
          background: var(--green-dark);
        }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 30px 0;
          color: var(--muted);
          font-size: 13px;
        }

        .login-divider::before,
        .login-divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: var(--border);
        }

        .register-button {
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #b8cec3;
          border-radius: 11px;
          color: var(--green-dark);
          font-weight: 800;
        }

        .register-button:hover {
          background: var(--green-soft);
        }

        .login-note {
          margin: 24px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.65;
          text-align: center;
        }

        @media (max-width: 900px) {
          .login-shell {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .login-info {
            max-width: none;
          }

          .login-form-card {
            max-width: 560px;
          }
        }

        @media (max-width: 600px) {
          .login-page {
            padding: 60px 0 80px;
          }

          .login-shell {
            width: min(100% - 28px, 1120px);
          }

          .login-form-card {
            padding: 30px 22px;
          }
        }
      `}</style>
    </main>
  );
}