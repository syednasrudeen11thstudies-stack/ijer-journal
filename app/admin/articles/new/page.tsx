"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

type Manuscript = {
  id: string;
  referenceNumber: string;
  title: string;
  articleType: string;
  subjectArea: string;
  abstractText: string;
  keywords: string;
  correspondingAuthor: string;
  email: string;
  coAuthors: string | null;
  institution: string | null;
  manuscriptFileUrl: string | null;
  submittedAt: string;
  acceptedAt: string | null;
  status: string;
};

type Issue = {
  id: string;
  volumeNumber: number;
  issueNumber: number;
  year: number;
  title: string | null;
  current: boolean;
  published: boolean;
};

export default function PublishArticlePage() {
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issueId, setIssueId] = useState("");

  const [finalPdf, setFinalPdf] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        setError("");

        const searchParams = new URLSearchParams(
          window.location.search,
        );

        const manuscriptId =
          searchParams.get("manuscript");

        if (!manuscriptId) {
          throw new Error(
            "No manuscript was selected for publication.",
          );
        }

        const [manuscriptResponse, issuesResponse] =
          await Promise.all([
            fetch(`/api/manuscripts/${manuscriptId}`, {
              cache: "no-store",
            }),

            fetch("/api/issues", {
              cache: "no-store",
            }),
          ]);

        const manuscriptData =
          await manuscriptResponse.json();

        const issuesData =
          await issuesResponse.json();

        if (
          !manuscriptResponse.ok ||
          !manuscriptData.success
        ) {
          throw new Error(
            manuscriptData.message ||
              "Unable to load manuscript.",
          );
        }

        if (
          !issuesResponse.ok ||
          !issuesData.success
        ) {
          throw new Error(
            issuesData.message ||
              "Unable to load journal issues.",
          );
        }

        if (
          manuscriptData.manuscript.status !== "ACCEPTED"
        ) {
          throw new Error(
            "Only accepted manuscripts can be published.",
          );
        }

        setManuscript(
          manuscriptData.manuscript,
        );

        setIssues(
          issuesData.issues || [],
        );

        const currentIssue = (
          issuesData.issues || []
        ).find(
          (issue: Issue) => issue.current,
        );

        if (currentIssue) {
          setIssueId(currentIssue.id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to open publication page.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  async function handlePublish(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!manuscript) {
      return;
    }

    if (!finalPdf) {
      setError(
        "Please choose the final published PDF.",
      );
      return;
    }

    if (
      finalPdf.type !== "application/pdf" &&
      !finalPdf.name.toLowerCase().endsWith(".pdf")
    ) {
      setError(
        "Only PDF files are allowed.",
      );
      return;
    }

    if (
      finalPdf.size >
      30 * 1024 * 1024
    ) {
      setError(
        "The final PDF must be 30 MB or smaller.",
      );
      return;
    }

    setPublishing(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const uploadedPdf = await upload(
        `published-articles/${Date.now()}-${finalPdf.name}`,
        finalPdf,
        {
          access: "private",
          handleUploadUrl:
            "/api/articles/upload",
        },
      );

      const payload = {
        manuscriptId:
          manuscript.id,

        issueId: String(
          formData.get("issueId") || "",
        ),

        title: String(
          formData.get("title") || "",
        ).trim(),

        articleType: String(
          formData.get("articleType") || "",
        ).trim(),

        subjectArea: String(
          formData.get("subjectArea") || "",
        ).trim(),

        slug: String(
          formData.get("slug") || "",
        )
          .trim()
          .toLowerCase(),

        authors: String(
          formData.get("authors") || "",
        ).trim(),

        affiliations: String(
          formData.get("affiliations") || "",
        ).trim(),

        correspondingAuthor: String(
          formData.get(
            "correspondingAuthor",
          ) || "",
        ).trim(),

        correspondenceEmail: String(
          formData.get(
            "correspondenceEmail",
          ) || "",
        ).trim(),

        abstractText: String(
          formData.get("abstractText") || "",
        ).trim(),

        keywords: String(
          formData.get("keywords") || "",
        ).trim(),

        startPage: String(
          formData.get("startPage") || "",
        ).trim(),

        endPage: String(
          formData.get("endPage") || "",
        ).trim(),

        doi: String(
          formData.get("doi") || "",
        ).trim(),

        issn: String(
          formData.get("issn") || "",
        ).trim(),

        publishedDate: String(
          formData.get(
            "publishedDate",
          ) || "",
        ),

        pdfUrl:
          uploadedPdf.url,

        featured:
          formData.get("featured") ===
          "on",
      };

      const response = await fetch(
        "/api/articles",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload,
          ),
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
            "Unable to publish article.",
        );
      }

      setSuccess(
        "Article and final PDF published successfully.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to publish article.",
      );
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <main className="publish-page">
        <div className="publish-container">
          <div className="state-card">
            Loading accepted manuscript...
          </div>
        </div>

        <Styles />
      </main>
    );
  }

  if (!manuscript) {
    return (
      <main className="publish-page">
        <div className="publish-container">
          <div className="state-card">
            <h1>
              Unable to prepare article
            </h1>

            <p>
              {error ||
                "Manuscript could not be loaded."}
            </p>

            <Link href="/admin/manuscripts">
              Back to Manuscripts
            </Link>
          </div>
        </div>

        <Styles />
      </main>
    );
  }

  return (
    <main className="publish-page">
      <div className="publish-container">
        <div className="top-links">
          <Link href="/admin/manuscripts">
            ← Manuscripts
          </Link>

          <Link href="/admin/issues">
            Issues &amp; Volumes
          </Link>
        </div>

        <section className="publish-hero">
          <span className="eyebrow">
            IJER Publication
          </span>

          <h1>
            Publish Accepted Article
          </h1>

          <p>
            Upload the final article PDF, assign the manuscript
            to a journal issue and publish it on IJER.
          </p>
        </section>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        {success && (
          <div className="message success">
            ✓ {success}
          </div>
        )}

        <section className="manuscript-summary">
          <span className="eyebrow">
            Accepted Manuscript
          </span>

          <strong>
            {manuscript.referenceNumber}
          </strong>

          <h2>
            {manuscript.title}
          </h2>

          <p>
            {
              manuscript.correspondingAuthor
            }{" "}
            • {manuscript.articleType}
          </p>
        </section>

        <form onSubmit={handlePublish}>
          <Section
            number="01"
            title="Volume & Issue"
          >
            <Field
              label="Journal Issue"
              full
              required
            >
              <select
                name="issueId"
                value={issueId}
                onChange={(event) =>
                  setIssueId(
                    event.target.value,
                  )
                }
                required
              >
                <option value="">
                  Select journal issue
                </option>

                {issues.map(
                  (issue) => (
                    <option
                      key={issue.id}
                      value={issue.id}
                    >
                      Volume{" "}
                      {
                        issue.volumeNumber
                      }
                      , Issue{" "}
                      {issue.issueNumber} (
                      {issue.year})
                      {issue.current
                        ? " — Current"
                        : ""}
                    </option>
                  ),
                )}
              </select>
            </Field>
          </Section>

          <Section
            number="02"
            title="Article Information"
          >
            <Field
              label="Article Title"
              full
              required
            >
              <input
                name="title"
                defaultValue={
                  manuscript.title
                }
                required
              />
            </Field>

            <Field
              label="Article Type"
              required
            >
              <input
                name="articleType"
                defaultValue={
                  manuscript.articleType
                }
                required
              />
            </Field>

            <Field label="Subject Area">
              <input
                name="subjectArea"
                defaultValue={
                  manuscript.subjectArea
                }
              />
            </Field>

            <Field
              label="Article Slug"
              full
              required
            >
              <input
                name="slug"
                defaultValue={createSlug(
                  manuscript.title,
                )}
                required
              />
            </Field>
          </Section>

          <Section
            number="03"
            title="Authors"
          >
            <Field
              label="Authors"
              full
              required
            >
              <textarea
                name="authors"
                defaultValue={buildAuthors(
                  manuscript,
                )}
                required
              />
            </Field>

            <Field
              label="Affiliations"
              full
            >
              <textarea
                name="affiliations"
                defaultValue={
                  manuscript.institution ||
                  ""
                }
              />
            </Field>

            <Field label="Corresponding Author">
              <input
                name="correspondingAuthor"
                defaultValue={
                  manuscript.correspondingAuthor
                }
              />
            </Field>

            <Field label="Correspondence Email">
              <input
                name="correspondenceEmail"
                type="email"
                defaultValue={
                  manuscript.email
                }
              />
            </Field>
          </Section>

          <Section
            number="04"
            title="Abstract & Keywords"
          >
            <Field
              label="Abstract"
              full
              required
            >
              <textarea
                name="abstractText"
                defaultValue={
                  manuscript.abstractText
                }
                required
              />
            </Field>

            <Field
              label="Keywords"
              full
              required
            >
              <input
                name="keywords"
                defaultValue={
                  manuscript.keywords
                }
                required
              />
            </Field>
          </Section>

          <Section
            number="05"
            title="Publication Details"
          >
            <Field label="Start Page">
              <input
                name="startPage"
                placeholder="1"
              />
            </Field>

            <Field label="End Page">
              <input
                name="endPage"
                placeholder="10"
              />
            </Field>

            <Field label="DOI">
              <input
                name="doi"
                placeholder="Leave blank if unavailable"
              />
            </Field>

            <Field label="ISSN">
              <input
                name="issn"
                placeholder="Leave blank if unavailable"
              />
            </Field>

            <Field
              label="Publication Date"
              required
            >
              <input
                name="publishedDate"
                type="date"
                defaultValue={new Date()
                  .toISOString()
                  .slice(0, 10)}
                required
              />
            </Field>
          </Section>

          <Section
            number="06"
            title="Final Published PDF"
          >
            <div className="final-pdf-box">
              <input
                type="file"
                accept=".pdf,application/pdf"
                required
                onChange={(event) => {
                  setFinalPdf(
                    event.target.files?.[0] ||
                      null,
                  );
                }}
              />

              <div>
                <strong>
                  {finalPdf
                    ? finalPdf.name
                    : "Choose Final Article PDF"}
                </strong>

                <span>
                  PDF only • Maximum 30 MB
                </span>
              </div>
            </div>
          </Section>

          <Section
            number="07"
            title="Visibility"
          >
            <label className="featured-box">
              <input
                type="checkbox"
                name="featured"
              />

              <div>
                <strong>
                  Feature this article
                </strong>

                <span>
                  Highlight this article on the journal website.
                </span>
              </div>
            </label>
          </Section>

          <div className="publish-action">
            <div>
              <strong>
                Publish to IJER
              </strong>

              <p>
                The final PDF will be uploaded and the article
                will be added to the selected journal issue.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                publishing ||
                !issueId ||
                !finalPdf
              }
            >
              {publishing
                ? "Uploading & Publishing..."
                : "Publish Article"}
            </button>
          </div>
        </form>
      </div>

      <Styles />
    </main>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="publish-card">
      <div className="section-heading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>

      <div className="publish-grid">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  full = false,
  required = false,
  children,
}: {
  label: string;
  full?: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        full
          ? "publish-field full"
          : "publish-field"
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

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildAuthors(
  manuscript: Manuscript,
) {
  if (
    !manuscript.coAuthors?.trim()
  ) {
    return manuscript.correspondingAuthor;
  }

  return `${manuscript.correspondingAuthor}\n${manuscript.coAuthors}`;
}

function Styles() {
  return (
    <style jsx global>{`
      .publish-page {
        min-height: 100vh;
        padding: 45px 0 90px;
        background: #f5f9f7;
        color: #17382f;
      }

      .publish-container {
        width: min(1100px, calc(100% - 44px));
        margin: 0 auto;
      }

      .top-links {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
      }

      .top-links a {
        color: #176b4d;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .publish-hero {
        padding: 44px;
        border-radius: 24px;
        background: #0e503a;
        color: white;
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

      .publish-hero .eyebrow {
        color: #bce3d3;
      }

      .publish-hero h1 {
        margin: 0;
        color: white;
        font-size: 46px;
      }

      .publish-hero p {
        max-width: 720px;
        margin: 17px 0 0;
        color: #d9ece4;
        line-height: 1.8;
      }

      .message {
        margin-top: 22px;
        padding: 16px 18px;
        border-radius: 11px;
        font-weight: 700;
      }

      .message.error {
        background: #fff2f1;
        color: #a23e38;
      }

      .message.success {
        background: #eaf6ef;
        color: #176b4d;
      }

      .manuscript-summary,
      .publish-card {
        margin-top: 28px;
        padding: 34px;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
      }

      .manuscript-summary > strong {
        color: #176b4d;
      }

      .manuscript-summary h2 {
        margin: 9px 0;
        font-size: 27px;
      }

      .manuscript-summary p {
        margin: 0;
        color: #74867e;
      }

      .section-heading {
        margin-bottom: 28px;
        padding-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid #e2ebe6;
      }

      .section-heading span {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #eaf4ef;
        color: #176b4d;
        font-size: 11px;
        font-weight: 900;
      }

      .section-heading h2 {
        margin: 0;
        font-size: 25px;
      }

      .publish-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 23px;
      }

      .publish-field.full {
        grid-column: 1 / -1;
      }

      .publish-field label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 800;
      }

      .publish-field label span {
        color: #b42318;
      }

      .publish-field input,
      .publish-field textarea,
      .publish-field select {
        width: 100%;
        min-height: 50px;
        padding: 12px 14px;
        border: 1px solid #cadbd3;
        border-radius: 10px;
        background: white;
        color: #17382f;
        font: inherit;
        outline: none;
      }

      .publish-field textarea {
        min-height: 145px;
        resize: vertical;
      }

      .final-pdf-box {
        grid-column: 1 / -1;
        min-height: 130px;
        padding: 28px;
        display: flex;
        align-items: center;
        gap: 25px;
        border: 1px dashed #9dbdaf;
        border-radius: 15px;
        background: #f6faf8;
      }

      .final-pdf-box input {
        max-width: 280px;
      }

      .final-pdf-box strong,
      .final-pdf-box span {
        display: block;
      }

      .final-pdf-box strong {
        color: #176b4d;
        overflow-wrap: anywhere;
      }

      .final-pdf-box span {
        margin-top: 5px;
        color: #74867e;
        font-size: 11px;
      }

      .featured-box {
        grid-column: 1 / -1;
        padding: 19px;
        display: flex;
        gap: 13px;
        border: 1px solid #dce8e2;
        border-radius: 12px;
        background: #f8fbf9;
      }

      .featured-box input {
        width: 18px;
        height: 18px;
        margin-top: 3px;
        accent-color: #176b4d;
      }

      .featured-box strong,
      .featured-box span {
        display: block;
      }

      .featured-box span {
        margin-top: 4px;
        color: #74867e;
        font-size: 12px;
      }

      .publish-action {
        margin-top: 30px;
        padding: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
        border-radius: 20px;
        background: #0e503a;
        color: white;
      }

      .publish-action strong {
        display: block;
        margin-bottom: 5px;
        font-size: 18px;
      }

      .publish-action p {
        margin: 0;
        color: #d7eae2;
      }

      .publish-action button {
        min-width: 210px;
        min-height: 50px;
        border: 0;
        border-radius: 10px;
        background: white;
        color: #0e503a;
        font-weight: 900;
        cursor: pointer;
      }

      .publish-action button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .state-card {
        margin-top: 70px;
        padding: 55px;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
        text-align: center;
      }

      @media (max-width: 700px) {
        .publish-container {
          width: min(100% - 28px, 1100px);
        }

        .publish-grid {
          grid-template-columns: 1fr;
        }

        .publish-field.full {
          grid-column: auto;
        }

        .final-pdf-box {
          flex-direction: column;
          align-items: flex-start;
        }

        .publish-action {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `}</style>
  );
}