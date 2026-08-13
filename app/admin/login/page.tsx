"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-shell">
        <section className="admin-login-info">
          <div className="admin-logo-wrap">
            <Image
              src="/logo.png"
              alt="International Journal of Electro-Homoeopathy & Research"
              width={320}
              height={320}
              priority
              className="admin-logo-image"
            />
          </div>

          <span className="eyebrow">Private Administration</span>

          <h1>Journal Administration</h1>

          <p>
            Secure administrative access for managing reviewed manuscripts,
            published articles, journal issues, editorial-board members, and
            website content.
          </p>

          <div className="admin-feature-list">
            <div>
              <strong>Manuscripts</strong>
              <span>Review and manage received submissions</span>
            </div>

            <div>
              <strong>Articles</strong>
              <span>Upload approved research articles and PDFs</span>
            </div>

            <div>
              <strong>Issues</strong>
              <span>Create volumes, issues, and publication archives</span>
            </div>

            <div>
              <strong>Editorial Board</strong>
              <span>Add, edit, arrange, or deactivate board members</span>
            </div>
          </div>
        </section>

        <section className="admin-login-card">
          <div className="admin-login-heading">
            <span className="eyebrow">Authorized Access</span>

            <h2>Admin Login</h2>

            <p>
              This area is intended only for authorized IJER administrators.
            </p>
          </div>

          {submitted && (
            <div className="admin-demo-message">
              The admin login interface is ready. Real secure authentication
              will be connected when we set up the IJER database.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-field">
              <label htmlFor="adminEmail">Admin Email</label>

              <input
                id="adminEmail"
                name="adminEmail"
                type="email"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="adminPassword">Password</label>

              <input
                id="adminPassword"
                name="adminPassword"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>

            <label className="admin-remember">
              <input type="checkbox" />
              <span>Remember this device</span>
            </label>

            <button type="submit" className="admin-login-button">
              Login to Admin
            </button>
          </form>

          <div className="admin-security-note">
            Public users cannot create administrator accounts. Admin access will
            be created directly in the secure database.
          </div>

          <Link href="/" className="admin-back-link">
            ← Return to Journal Website
          </Link>
        </section>
      </div>

      <style jsx global>{`
        .admin-login-page {
          min-height: 72vh;
          padding: 90px 0 110px;
          background:
            radial-gradient(
              circle at 14% 15%,
              rgba(22, 103, 71, 0.12),
              transparent 31%
            ),
            #f8fcfa;
        }

        .admin-login-shell {
          width: min(1120px, calc(100% - 44px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 90px;
          align-items: center;
        }

        .admin-login-info {
          max-width: 610px;
        }

        .admin-logo-wrap {
          width: 260px;
          height: 260px;
          margin-bottom: 38px;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 34px;
          background: #ffffff;
          box-shadow: 0 18px 50px rgba(31, 78, 60, 0.1);
        }

        .admin-logo-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          object-position: center;
          border-radius: 24px;
        }

        .admin-login-info h1 {
          margin: 0;
          font-size: clamp(46px, 6vw, 68px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .admin-login-info > p {
          max-width: 590px;
          margin: 26px 0 38px;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.85;
        }

        .admin-feature-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .admin-feature-list div {
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.76);
        }

        .admin-feature-list strong,
        .admin-feature-list span {
          display: block;
        }

        .admin-feature-list strong {
          margin-bottom: 4px;
          color: var(--green-dark);
        }

        .admin-feature-list span {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .admin-login-card {
          padding: 42px;
          border: 1px solid var(--border);
          border-radius: 26px;
          background: #ffffff;
          box-shadow: 0 26px 75px rgba(31, 78, 60, 0.11);
        }

        .admin-login-heading {
          margin-bottom: 30px;
        }

        .admin-login-heading h2 {
          margin: 0 0 10px;
          font-size: 34px;
        }

        .admin-login-heading p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .admin-demo-message {
          margin-bottom: 24px;
          padding: 15px;
          border: 1px solid #cfe2d8;
          border-radius: 10px;
          background: var(--green-soft);
          color: var(--green-dark);
          font-size: 14px;
          line-height: 1.6;
        }

        .admin-field {
          margin-bottom: 22px;
        }

        .admin-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 800;
        }

        .admin-field input {
          width: 100%;
          min-height: 52px;
          padding: 12px 14px;
          border: 1px solid #cbdad3;
          border-radius: 11px;
          outline: none;
          color: var(--foreground);
          font: inherit;
        }

        .admin-field input:focus {
          border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(22, 103, 71, 0.1);
        }

        .admin-remember {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          color: var(--muted);
          font-size: 14px;
        }

        .admin-remember input {
          width: 17px;
          height: 17px;
          accent-color: var(--green);
        }

        .admin-login-button {
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

        .admin-login-button:hover {
          background: var(--green-dark);
        }

        .admin-security-note {
          margin-top: 26px;
          padding: 16px;
          border-radius: 11px;
          background: #f7faf8;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.7;
          text-align: center;
        }

        .admin-back-link {
          display: block;
          margin-top: 24px;
          text-align: center;
          color: var(--green);
          font-size: 14px;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .admin-login-shell {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .admin-login-info {
            max-width: none;
          }

          .admin-login-card {
            max-width: 560px;
          }
        }

        @media (max-width: 600px) {
          .admin-login-page {
            padding: 60px 0 80px;
          }

          .admin-login-shell {
            width: min(100% - 28px, 1120px);
          }

          .admin-logo-wrap {
            width: 210px;
            height: 210px;
            border-radius: 28px;
          }

          .admin-logo-image {
            border-radius: 20px;
          }

          .admin-feature-list {
            grid-template-columns: 1fr;
          }

          .admin-login-card {
            padding: 30px 22px;
          }
        }
      `}</style>
    </main>
  );
}