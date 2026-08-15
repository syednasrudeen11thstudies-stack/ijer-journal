"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Issue = {
  id: string;
  volumeNumber: number;
  issueNumber: number;
  year: number;
  title: string | null;
  description: string | null;
  publicationDate: string | null;
  published: boolean;
  current: boolean;
  createdAt: string;
};

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadIssues() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/issues", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load journal issues.",
        );
      }

      setIssues(data.issues || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load journal issues.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setCreating(true);
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      volumeNumber: Number(formData.get("volumeNumber")),
      issueNumber: Number(formData.get("issueNumber")),
      year: Number(formData.get("year")),

      title: String(formData.get("title") || "").trim(),

      description: String(
        formData.get("description") || "",
      ).trim(),

      publicationDate: String(
        formData.get("publicationDate") || "",
      ).trim(),

      current: formData.get("current") === "on",
      published: formData.get("published") === "on",
    };

    try {
      const response = await fetch("/api/issues", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create journal issue.",
        );
      }

      setMessage("Journal issue created successfully.");

      form.reset();

      await loadIssues();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create journal issue.",
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="issues-page">
      <div className="issues-container">
        <div className="issues-topbar">
          <Link href="/admin/dashboard">
            ← Dashboard
          </Link>

          <Link href="/">
            View Journal
          </Link>
        </div>

        <section className="issues-hero">
          <span className="issues-eyebrow">
            IJER Administration
          </span>

          <h1>Issues &amp; Volumes</h1>

          <p>
            Create journal volumes and issues, select the current issue,
            and prepare accepted articles for publication.
          </p>
        </section>

        {error && (
          <div className="issues-message issues-error">
            {error}
          </div>
        )}

        {message && (
          <div className="issues-message issues-success">
            ✓ {message}
          </div>
        )}

        <div className="issues-layout">
          <section className="issue-form-card">
            <div className="issue-card-heading">
              <span className="issues-eyebrow">
                New Issue
              </span>

              <h2>Create Journal Issue</h2>

              <p>
                Example: Volume 1, Issue 1, 2026.
              </p>
            </div>

            <form onSubmit={handleCreate}>
              <div className="issue-form-grid">
                <Field label="Volume Number" required>
                  <input
                    name="volumeNumber"
                    type="number"
                    min="1"
                    defaultValue="1"
                    required
                  />
                </Field>

                <Field label="Issue Number" required>
                  <input
                    name="issueNumber"
                    type="number"
                    min="1"
                    defaultValue="1"
                    required
                  />
                </Field>

                <Field label="Year" required>
                  <input
                    name="year"
                    type="number"
                    min="2000"
                    defaultValue={new Date().getFullYear()}
                    required
                  />
                </Field>

                <Field label="Publication Date">
                  <input
                    name="publicationDate"
                    type="date"
                  />
                </Field>

                <Field label="Issue Title" full>
                  <input
                    name="title"
                    placeholder="Optional issue title"
                  />
                </Field>

                <Field label="Description" full>
                  <textarea
                    name="description"
                    placeholder="Optional description of this issue"
                  />
                </Field>
              </div>

              <div className="issue-options">
                <label>
                  <input
                    type="checkbox"
                    name="current"
                  />

                  <div>
                    <strong>
                      Set as Current Issue
                    </strong>

                    <span>
                      This issue will be treated as the latest active IJER issue.
                    </span>
                  </div>
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="published"
                  />

                  <div>
                    <strong>
                      Mark Issue as Published
                    </strong>

                    <span>
                      Use this when the issue is ready to appear publicly.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="create-issue-button"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Issue"}
              </button>
            </form>
          </section>

          <section className="issue-list-card">
            <div className="issue-card-heading">
              <span className="issues-eyebrow">
                Journal Archive
              </span>

              <h2>Existing Issues</h2>

              <p>
                Volumes and issues already created in the IJER database.
              </p>
            </div>

            {loading ? (
              <div className="issue-state">
                Loading issues...
              </div>
            ) : issues.length === 0 ? (
              <div className="issue-state">
                <div className="issue-empty-icon">
                  I
                </div>

                <h3>No issues created yet</h3>

                <p>
                  Create Volume 1, Issue 1 using the form on this page.
                </p>
              </div>
            ) : (
              <div className="issue-list">
                {issues.map((issue) => (
                  <article
                    className="issue-item"
                    key={issue.id}
                  >
                    <div className="issue-item-top">
                      <div>
                        <span className="issue-year">
                          {issue.year}
                        </span>

                        <h3>
                          Volume {issue.volumeNumber}, Issue{" "}
                          {issue.issueNumber}
                        </h3>
                      </div>

                      <div className="issue-badges">
                        {issue.current && (
                          <span className="current-badge">
                            Current
                          </span>
                        )}

                        {issue.published ? (
                          <span className="published-badge">
                            Published
                          </span>
                        ) : (
                          <span className="draft-badge">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {issue.title && (
                      <strong className="issue-title">
                        {issue.title}
                      </strong>
                    )}

                    {issue.description && (
                      <p className="issue-description">
                        {issue.description}
                      </p>
                    )}

                    <div className="issue-meta">
                      <span>
                        Publication date:{" "}
                        {issue.publicationDate
                          ? new Date(
                              issue.publicationDate,
                            ).toLocaleDateString()
                          : "Not set"}
                      </span>

                      <span>
                        Created:{" "}
                        {new Date(
                          issue.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <IssuesStyles />
    </main>
  );
}

function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        full
          ? "issue-field issue-field-full"
          : "issue-field"
      }
    >
      <label>
        {label}
        {required && <span> *</span>}
      </label>

      {children}
    </div>
  );
}

function IssuesStyles() {
  return (
    <style jsx global>{`
      .issues-page {
        min-height: 100vh;
        padding: 40px 0 90px;
        background: #f5f9f7;
        color: #17382f;
      }

      .issues-container {
        width: min(1250px, calc(100% - 44px));
        margin: 0 auto;
      }

      .issues-topbar {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
      }

      .issues-topbar a {
        color: #176b4d;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .issues-hero {
        padding: 44px;
        border-radius: 24px;
        background: #0e503a;
        color: white;
      }

      .issues-eyebrow {
        display: block;
        margin-bottom: 10px;
        color: #27805e;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .issues-hero .issues-eyebrow {
        color: #b9dfd0;
      }

      .issues-hero h1 {
        margin: 0;
        color: white;
        font-size: clamp(38px, 5vw, 52px);
        line-height: 1.1;
      }

      .issues-hero p {
        max-width: 760px;
        margin: 18px 0 0;
        color: #d8ebe3;
        line-height: 1.8;
      }

      .issues-message {
        margin-top: 22px;
        padding: 16px 18px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 700;
      }

      .issues-error {
        border: 1px solid #ecc8c5;
        background: #fff5f4;
        color: #a23e38;
      }

      .issues-success {
        border: 1px solid #bedac9;
        background: #edf8f2;
        color: #176b4d;
      }

      .issues-layout {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 420px minmax(0, 1fr);
        gap: 28px;
        align-items: start;
      }

      .issue-form-card,
      .issue-list-card {
        padding: 32px;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
      }

      .issue-card-heading {
        margin-bottom: 26px;
        padding-bottom: 22px;
        border-bottom: 1px solid #e4ece8;
      }

      .issue-card-heading h2 {
        margin: 0 0 7px;
        font-size: 27px;
      }

      .issue-card-heading p {
        margin: 0;
        color: #74867e;
        line-height: 1.7;
      }

      .issue-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
      }

      .issue-field {
        min-width: 0;
      }

      .issue-field-full {
        grid-column: 1 / -1;
      }

      .issue-field > label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 800;
      }

      .issue-field > label span {
        color: #b42318;
      }

      .issue-field input,
      .issue-field textarea {
        width: 100%;
        min-height: 48px;
        padding: 11px 13px;
        border: 1px solid #cadbd3;
        border-radius: 9px;
        outline: none;
        background: white;
        color: #17382f;
        font: inherit;
      }

      .issue-field textarea {
        min-height: 120px;
        resize: vertical;
      }

      .issue-field input:focus,
      .issue-field textarea:focus {
        border-color: #176b4d;
        box-shadow:
          0 0 0 3px rgba(23, 107, 77, 0.08);
      }

      .issue-options {
        margin-top: 24px;
        display: grid;
        gap: 12px;
      }

      .issue-options label {
        display: flex;
        align-items: flex-start;
        gap: 13px;
        padding: 16px;
        border: 1px solid #dce8e2;
        border-radius: 11px;
        background: #f8fbf9;
        cursor: pointer;
      }

      .issue-options input {
        width: 18px;
        height: 18px;
        margin-top: 3px;
        accent-color: #176b4d;
      }

      .issue-options strong,
      .issue-options span {
        display: block;
      }

      .issue-options strong {
        font-size: 13px;
      }

      .issue-options span {
        margin-top: 4px;
        color: #74867e;
        font-size: 11px;
        line-height: 1.6;
      }

      .create-issue-button {
        width: 100%;
        min-height: 50px;
        margin-top: 24px;
        border: 0;
        border-radius: 9px;
        background: #176b4d;
        color: white;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .create-issue-button:disabled {
        opacity: 0.55;
        cursor: wait;
      }

      .issue-state {
        padding: 60px 20px;
        text-align: center;
        color: #74867e;
      }

      .issue-empty-icon {
        width: 56px;
        height: 56px;
        margin: 0 auto 17px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #eaf4ef;
        color: #176b4d;
        font-weight: 900;
      }

      .issue-state h3 {
        margin: 0 0 8px;
        color: #17382f;
      }

      .issue-state p {
        margin: 0;
      }

      .issue-list {
        display: grid;
        gap: 16px;
      }

      .issue-item {
        padding: 22px;
        border: 1px solid #dce8e2;
        border-radius: 14px;
        background: #fbfdfc;
      }

      .issue-item-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
      }

      .issue-year {
        display: block;
        margin-bottom: 5px;
        color: #176b4d;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
      }

      .issue-item h3 {
        margin: 0;
        font-size: 20px;
      }

      .issue-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 6px;
      }

      .issue-badges span {
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .current-badge {
        background: #e8f4ee;
        color: #176b4d;
      }

      .published-badge {
        background: #e7f5ed;
        color: #157347;
      }

      .draft-badge {
        background: #fff7e8;
        color: #886313;
      }

      .issue-title {
        display: block;
        margin-top: 15px;
      }

      .issue-description {
        margin: 8px 0 0;
        color: #74867e;
        font-size: 12px;
        line-height: 1.7;
      }

      .issue-meta {
        margin-top: 18px;
        padding-top: 15px;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        border-top: 1px solid #e5ede9;
        color: #84938c;
        font-size: 10px;
      }

      @media (max-width: 950px) {
        .issues-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 600px) {
        .issues-container {
          width: min(100% - 28px, 1250px);
        }

        .issues-hero {
          padding: 32px 24px;
        }

        .issue-form-card,
        .issue-list-card {
          padding: 25px 20px;
        }

        .issue-form-grid {
          grid-template-columns: 1fr;
        }

        .issue-field-full {
          grid-column: auto;
        }

        .issue-item-top {
          flex-direction: column;
        }

        .issue-badges {
          justify-content: flex-start;
        }
      }
    `}</style>
  );
}