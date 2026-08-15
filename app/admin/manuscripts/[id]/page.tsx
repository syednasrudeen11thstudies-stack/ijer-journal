"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

type Manuscript = {
  id: string;
  referenceNumber: string;

  title: string;
  articleType: string;
  subjectArea: string;

  abstractText: string;
  keywords: string;

  correspondingAuthor: string;
  qualification: string | null;

  email: string;
  phone: string | null;

  department: string | null;
  institution: string | null;

  city: string | null;
  state: string | null;
  country: string | null;

  orcid: string | null;
  coAuthors: string | null;

  manuscriptFileUrl: string | null;
  supportingFileUrl: string | null;
  coverLetterUrl: string | null;

  originalWorkConfirmed: boolean;
  notSubmittedElsewhere: boolean;
  authorsApproved: boolean;
  conflictsDeclared: boolean;
  ethicsConfirmed: boolean;
  journalPoliciesConfirmed: boolean;

  status:
    | "RECEIVED"
    | "UNDER_REVIEW"
    | "REVISION_REQUIRED"
    | "ACCEPTED"
    | "REJECTED"
    | "PUBLISHED";

  adminNotes: string | null;
  reviewNotes: string | null;
  revisionNotes: string | null;

  submittedAt: string;
  reviewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  publishedAt: string | null;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statuses = [
  {
    value: "RECEIVED",
    label: "Received",
  },
  {
    value: "UNDER_REVIEW",
    label: "Under Review",
  },
  {
    value: "REVISION_REQUIRED",
    label: "Revision Required",
  },
  {
    value: "ACCEPTED",
    label: "Accepted",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
] as const;

export default function ManuscriptDetailsPage({
  params,
}: PageProps) {
  const { id } = use(params);

  const [manuscript, setManuscript] =
    useState<Manuscript | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] =
    useState<Manuscript["status"]>("RECEIVED");

  const [adminNotes, setAdminNotes] =
    useState("");

  const [reviewNotes, setReviewNotes] =
    useState("");

  const [revisionNotes, setRevisionNotes] =
    useState("");

  useEffect(() => {
    async function loadManuscript() {
      try {
        const response = await fetch(
          `/api/manuscripts/${id}`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load manuscript.",
          );
        }

        const loaded: Manuscript =
          data.manuscript;

        setManuscript(loaded);
        setStatus(loaded.status);
        setAdminNotes(
          loaded.adminNotes || "",
        );
        setReviewNotes(
          loaded.reviewNotes || "",
        );
        setRevisionNotes(
          loaded.revisionNotes || "",
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load manuscript.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadManuscript();
  }, [id]);

  async function saveReview() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/manuscripts/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
            adminNotes,
            reviewNotes,
            revisionNotes,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update manuscript.",
        );
      }

      setManuscript(data.manuscript);

      setMessage(
        "Manuscript review updated successfully.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update manuscript.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="review-page">
        <div className="review-container">
          <div className="loading-card">
            Loading manuscript...
          </div>
        </div>

        <Styles />
      </main>
    );
  }

  if (error && !manuscript) {
    return (
      <main className="review-page">
        <div className="review-container">
          <div className="error-card">
            <h1>Unable to open manuscript</h1>

            <p>{error}</p>

            <Link href="/admin/manuscripts">
              ← Return to Manuscripts
            </Link>
          </div>
        </div>

        <Styles />
      </main>
    );
  }

  if (!manuscript) {
    return null;
  }

  return (
    <main className="review-page">
      <div className="review-container">
        <div className="back-row">
          <Link href="/admin/manuscripts">
            ← Back to Manuscripts
          </Link>

          <Link href="/admin/dashboard">
            Dashboard
          </Link>
        </div>

        <section className="review-hero">
          <div>
            <span className="eyebrow">
              {manuscript.referenceNumber}
            </span>

            <h1>{manuscript.title}</h1>

            <p>
              Submitted by{" "}
              <strong>
                {
                  manuscript.correspondingAuthor
                }
              </strong>{" "}
              on{" "}
              {new Date(
                manuscript.submittedAt,
              ).toLocaleDateString()}
            </p>
          </div>

          <div
            className={`current-status status-${manuscript.status.toLowerCase()}`}
          >
            {formatStatus(
              manuscript.status,
            )}
          </div>
        </section>

        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}

        {error && manuscript && (
          <div className="inline-error">
            {error}
          </div>
        )}

        <div className="review-layout">
          <div className="review-main">
            <Section
              eyebrow="Manuscript"
              title="Article Information"
            >
              <InfoGrid>
                <Info
                  label="Reference Number"
                  value={
                    manuscript.referenceNumber
                  }
                />

                <Info
                  label="Article Type"
                  value={
                    manuscript.articleType
                  }
                />

                <Info
                  label="Subject Area"
                  value={
                    manuscript.subjectArea
                  }
                />

                <Info
                  label="Submitted"
                  value={new Date(
                    manuscript.submittedAt,
                  ).toLocaleString()}
                />
              </InfoGrid>
            </Section>

            <Section
              eyebrow="Research Summary"
              title="Abstract"
            >
              <p className="long-text">
                {manuscript.abstractText}
              </p>

              <div className="keywords-box">
                <strong>Keywords</strong>

                <p>
                  {manuscript.keywords}
                </p>
              </div>
            </Section>

            <Section
              eyebrow="Author"
              title="Corresponding Author"
            >
              <InfoGrid>
                <Info
                  label="Full Name"
                  value={
                    manuscript.correspondingAuthor
                  }
                />

                <Info
                  label="Qualification"
                  value={
                    manuscript.qualification
                  }
                />

                <Info
                  label="Email"
                  value={manuscript.email}
                />

                <Info
                  label="Phone"
                  value={manuscript.phone}
                />

                <Info
                  label="Department"
                  value={
                    manuscript.department
                  }
                />

                <Info
                  label="Institution"
                  value={
                    manuscript.institution
                  }
                />

                <Info
                  label="City"
                  value={manuscript.city}
                />

                <Info
                  label="State / Region"
                  value={manuscript.state}
                />

                <Info
                  label="Country"
                  value={manuscript.country}
                />

                <Info
                  label="ORCID"
                  value={manuscript.orcid}
                />
              </InfoGrid>
            </Section>

            <Section
              eyebrow="Authorship"
              title="Co-Authors"
            >
              <p className="long-text preserve-lines">
                {manuscript.coAuthors ||
                  "No co-authors were provided."}
              </p>
            </Section>

            <Section
              eyebrow="Submission"
              title="Author Declarations"
            >
              <div className="declarations">
                <Declaration
                  checked={
                    manuscript.originalWorkConfirmed
                  }
                  text="Original work confirmed"
                />

                <Declaration
                  checked={
                    manuscript.notSubmittedElsewhere
                  }
                  text="Not submitted elsewhere"
                />

                <Declaration
                  checked={
                    manuscript.authorsApproved
                  }
                  text="All authors approved the submission"
                />

                <Declaration
                  checked={
                    manuscript.conflictsDeclared
                  }
                  text="Conflicts and funding declaration confirmed"
                />

                <Declaration
                  checked={
                    manuscript.ethicsConfirmed
                  }
                  text="Ethical requirements confirmed"
                />

                <Declaration
                  checked={
                    manuscript.journalPoliciesConfirmed
                  }
                  text="Journal policies confirmed"
                />
              </div>
            </Section>

            <Section
              eyebrow="Documents"
              title="Submitted Files"
            >
              {manuscript.manuscriptFileUrl ? (
                <a
                  className="document-button"
                  href={`/api/manuscripts/${manuscript.id}/file`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Manuscript
                </a>
              ) : (
                <div className="no-document">
                  <strong>
                    No manuscript file uploaded
                  </strong>

                  <p>
                    We have not connected the
                    document-upload system yet.
                    The manuscript information
                    itself has been successfully
                    stored in the database.
                  </p>
                </div>
              )}
            </Section>
          </div>

          <aside className="review-sidebar">
            <div className="review-control-card">
              <span className="eyebrow">
                Editorial Decision
              </span>

              <h2>Review Manuscript</h2>

              <label className="control-label">
                Manuscript Status
              </label>

              <select
                className="control-input"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as Manuscript["status"],
                  )
                }
              >
                {statuses.map(
                  (statusOption) => (
                    <option
                      key={
                        statusOption.value
                      }
                      value={
                        statusOption.value
                      }
                    >
                      {
                        statusOption.label
                      }
                    </option>
                  ),
                )}
              </select>

              <label className="control-label">
                Private Admin Notes
              </label>

              <textarea
                className="control-input control-textarea"
                value={adminNotes}
                onChange={(event) =>
                  setAdminNotes(
                    event.target.value,
                  )
                }
                placeholder="Internal notes for journal administration..."
              />

              <label className="control-label">
                Review Notes
              </label>

              <textarea
                className="control-input control-textarea"
                value={reviewNotes}
                onChange={(event) =>
                  setReviewNotes(
                    event.target.value,
                  )
                }
                placeholder="Enter editorial or reviewer observations..."
              />

              <label className="control-label">
                Revision Instructions
              </label>

              <textarea
                className="control-input control-textarea"
                value={revisionNotes}
                onChange={(event) =>
                  setRevisionNotes(
                    event.target.value,
                  )
                }
                placeholder="Enter corrections required from the author..."
              />

              <button
                type="button"
                className="save-button"
                disabled={saving}
                onClick={saveReview}
              >
                {saving
                  ? "Saving..."
                  : "Save Review"}
              </button>

              {status === "ACCEPTED" && (
                <Link
                  href={`/admin/articles/new?manuscript=${manuscript.id}`}
                  className="publish-button"
                >
                  Continue to Publication →
                </Link>
              )}
            </div>

            <div className="timeline-card">
              <span className="eyebrow">
                Manuscript History
              </span>

              <h3>Timeline</h3>

              <Timeline
                label="Submitted"
                date={
                  manuscript.submittedAt
                }
              />

              {manuscript.reviewedAt && (
                <Timeline
                  label="Reviewed"
                  date={
                    manuscript.reviewedAt
                  }
                />
              )}

              {manuscript.acceptedAt && (
                <Timeline
                  label="Accepted"
                  date={
                    manuscript.acceptedAt
                  }
                />
              )}

              {manuscript.rejectedAt && (
                <Timeline
                  label="Rejected"
                  date={
                    manuscript.rejectedAt
                  }
                />
              )}

              {manuscript.publishedAt && (
                <Timeline
                  label="Published"
                  date={
                    manuscript.publishedAt
                  }
                />
              )}
            </div>
          </aside>
        </div>
      </div>

      <Styles />
    </main>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="content-card">
      <span className="eyebrow">
        {eyebrow}
      </span>

      <h2>{title}</h2>

      <div className="content-body">
        {children}
      </div>
    </section>
  );
}

function InfoGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="info-grid">
      {children}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="info-item">
      <span>{label}</span>

      <strong>
        {value || "Not provided"}
      </strong>
    </div>
  );
}

function Declaration({
  checked,
  text,
}: {
  checked: boolean;
  text: string;
}) {
  return (
    <div className="declaration">
      <span
        className={
          checked
            ? "declaration-check yes"
            : "declaration-check no"
        }
      >
        {checked ? "✓" : "×"}
      </span>

      <p>{text}</p>
    </div>
  );
}

function Timeline({
  label,
  date,
}: {
  label: string;
  date: string;
}) {
  return (
    <div className="timeline-item">
      <span className="timeline-dot" />

      <div>
        <strong>{label}</strong>

        <span>
          {new Date(
            date,
          ).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function Styles() {
  return (
    <style jsx global>{`
      .review-page {
        min-height: 100vh;
        padding: 45px 0 90px;
        background: #f5f9f7;
        color: #17382f;
      }

      .review-container {
        width: min(1400px, calc(100% - 48px));
        margin: 0 auto;
      }

      .back-row {
        margin-bottom: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .back-row a {
        color: #176b4d;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .review-hero {
        min-height: 220px;
        padding: 42px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 40px;
        border-radius: 24px;
        background: #0e503a;
        color: white;
      }

      .review-hero > div:first-child {
        max-width: 900px;
      }

      .eyebrow {
        display: block;
        margin-bottom: 10px;
        color: #27805e;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .review-hero .eyebrow {
        color: #bce3d3;
      }

      .review-hero h1 {
        margin: 0;
        color: white;
        font-size: clamp(30px, 4vw, 45px);
        line-height: 1.2;
        letter-spacing: -0.03em;
      }

      .review-hero p {
        margin: 18px 0 0;
        color: #d7ebe3;
        line-height: 1.7;
      }

      .current-status {
        flex-shrink: 0;
        padding: 12px 18px;
        border-radius: 999px;
        background: white;
        color: #176b4d;
        font-size: 12px;
        font-weight: 900;
      }

      .success-message,
      .inline-error {
        margin-top: 22px;
        padding: 15px 18px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 700;
      }

      .success-message {
        border: 1px solid #bddbc9;
        background: #edf8f2;
        color: #176b4d;
      }

      .inline-error {
        border: 1px solid #edcbc8;
        background: #fff5f4;
        color: #a23e38;
      }

      .review-layout {
        margin-top: 35px;
        display: grid;
        grid-template-columns:
          minmax(0, 1fr) 390px;
        align-items: start;
        gap: 30px;
      }

      .review-main {
        display: grid;
        gap: 25px;
      }

      .content-card,
      .review-control-card,
      .timeline-card {
        padding: 32px;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
      }

      .content-card h2,
      .review-control-card h2 {
        margin: 0;
        font-size: 25px;
      }

      .content-body {
        margin-top: 27px;
      }

      .info-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .info-item {
        padding: 18px;
        border-radius: 12px;
        background: #f7faf8;
      }

      .info-item span,
      .info-item strong {
        display: block;
      }

      .info-item span {
        margin-bottom: 7px;
        color: #7b8d84;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .info-item strong {
        overflow-wrap: anywhere;
        font-size: 13px;
        line-height: 1.6;
      }

      .long-text {
        margin: 0;
        color: #52665d;
        font-size: 14px;
        line-height: 1.9;
      }

      .preserve-lines {
        white-space: pre-line;
      }

      .keywords-box {
        margin-top: 25px;
        padding: 20px;
        border-radius: 12px;
        background: #f3f8f5;
      }

      .keywords-box strong {
        display: block;
        margin-bottom: 7px;
        font-size: 12px;
      }

      .keywords-box p {
        margin: 0;
        color: #5e7168;
        line-height: 1.7;
      }

      .declarations {
        display: grid;
        gap: 11px;
      }

      .declaration {
        padding: 15px 17px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px solid #e0eae5;
        border-radius: 11px;
      }

      .declaration-check {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        border-radius: 50%;
        font-weight: 900;
      }

      .declaration-check.yes {
        background: #e6f4ed;
        color: #176b4d;
      }

      .declaration-check.no {
        background: #fff0ef;
        color: #a23e38;
      }

      .declaration p {
        margin: 0;
        color: #53675e;
        font-size: 13px;
      }

      .no-document {
        padding: 23px;
        border: 1px dashed #b8cec3;
        border-radius: 13px;
        background: #f8fbf9;
      }

      .no-document strong {
        display: block;
        margin-bottom: 7px;
      }

      .no-document p {
        margin: 0;
        color: #74867e;
        font-size: 13px;
        line-height: 1.7;
      }

      .document-button {
        display: inline-flex;
        padding: 12px 18px;
        border-radius: 9px;
        background: #176b4d;
        color: white;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .review-sidebar {
        position: sticky;
        top: 25px;
        display: grid;
        gap: 22px;
      }

      .control-label {
        display: block;
        margin: 23px 0 8px;
        font-size: 12px;
        font-weight: 800;
      }

      .control-input {
        width: 100%;
        min-height: 46px;
        padding: 11px 12px;
        border: 1px solid #cadbd3;
        border-radius: 9px;
        background: white;
        color: #17382f;
        font: inherit;
        font-size: 13px;
        outline: none;
      }

      .control-input:focus {
        border-color: #176b4d;
        box-shadow:
          0 0 0 3px rgba(23, 107, 77, 0.08);
      }

      .control-textarea {
        min-height: 115px;
        resize: vertical;
      }

      .save-button {
        width: 100%;
        min-height: 48px;
        margin-top: 25px;
        border: 0;
        border-radius: 9px;
        background: #176b4d;
        color: white;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .save-button:disabled {
        cursor: wait;
        opacity: 0.65;
      }

      .publish-button {
        margin-top: 11px;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #176b4d;
        border-radius: 9px;
        color: #176b4d;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .timeline-card h3 {
        margin: 0 0 25px;
        font-size: 20px;
      }

      .timeline-item {
        position: relative;
        padding: 0 0 24px 27px;
        border-left: 1px solid #d4e2db;
      }

      .timeline-item:last-child {
        padding-bottom: 0;
        border-left-color: transparent;
      }

      .timeline-dot {
        position: absolute;
        top: 2px;
        left: -6px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #176b4d;
      }

      .timeline-item strong,
      .timeline-item div > span {
        display: block;
      }

      .timeline-item strong {
        margin-bottom: 4px;
        font-size: 12px;
      }

      .timeline-item div > span {
        color: #819188;
        font-size: 10px;
      }

      .loading-card,
      .error-card {
        margin-top: 80px;
        padding: 60px;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
        text-align: center;
      }

      .error-card a {
        display: inline-block;
        margin-top: 20px;
        color: #176b4d;
        font-weight: 800;
      }

      @media (max-width: 1050px) {
        .review-layout {
          grid-template-columns: 1fr;
        }

        .review-sidebar {
          position: static;
        }
      }

      @media (max-width: 700px) {
        .review-container {
          width: min(100% - 28px, 1400px);
        }

        .review-hero {
          padding: 30px 24px;
          align-items: flex-start;
          flex-direction: column;
        }

        .content-card,
        .review-control-card,
        .timeline-card {
          padding: 24px 20px;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}