"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Issue = {
  id: string;
  volumeNumber: number;
  issueNumber: number;
  year: number;
};

type Article = {
  id: string;
  slug: string;
  title: string;
  articleType: string;
  subjectArea: string | null;
  authors: string;
  affiliations: string | null;
  correspondingAuthor: string | null;
  correspondenceEmail: string | null;
  abstractText: string;
  keywords: string;
  introduction: string | null;
  methods: string | null;
  results: string | null;
  discussion: string | null;
  conclusion: string | null;
  acknowledgements: string | null;
  conflictOfInterest: string | null;
  fundingStatement: string | null;
  ethicsStatement: string | null;
  referencesText: string | null;
  doi: string | null;
  issn: string | null;
  startPage: string | null;
  endPage: string | null;
  featured: boolean;
  issueId: string | null;
};

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();

  const [article, setArticle] = useState<Article | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [articleResponse, issuesResponse] =
          await Promise.all([
            fetch(`/api/articles/by-id/${params.id}`, {
              cache: "no-store",
            }),

            fetch("/api/issues", {
              cache: "no-store",
            }),
          ]);

        const articleData = await articleResponse.json();
        const issuesData = await issuesResponse.json();

        if (!articleResponse.ok || !articleData.success) {
          throw new Error(
            articleData.message || "Unable to load article.",
          );
        }

        setArticle(articleData.article);

        if (issuesResponse.ok && issuesData.success) {
          setIssues(issuesData.issues || []);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load article.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const payload = {
      slug: String(formData.get("slug") || ""),
      title: String(formData.get("title") || ""),
      articleType: String(formData.get("articleType") || ""),
      subjectArea: String(formData.get("subjectArea") || ""),
      authors: String(formData.get("authors") || ""),
      affiliations: String(formData.get("affiliations") || ""),
      correspondingAuthor: String(
        formData.get("correspondingAuthor") || "",
      ),
      correspondenceEmail: String(
        formData.get("correspondenceEmail") || "",
      ),
      abstractText: String(formData.get("abstractText") || ""),
      keywords: String(formData.get("keywords") || ""),
      introduction: String(formData.get("introduction") || ""),
      methods: String(formData.get("methods") || ""),
      results: String(formData.get("results") || ""),
      discussion: String(formData.get("discussion") || ""),
      conclusion: String(formData.get("conclusion") || ""),
      acknowledgements: String(
        formData.get("acknowledgements") || "",
      ),
      conflictOfInterest: String(
        formData.get("conflictOfInterest") || "",
      ),
      fundingStatement: String(
        formData.get("fundingStatement") || "",
      ),
      ethicsStatement: String(
        formData.get("ethicsStatement") || "",
      ),
      referencesText: String(
        formData.get("referencesText") || "",
      ),
      doi: String(formData.get("doi") || ""),
      issn: String(formData.get("issn") || ""),
      startPage: String(formData.get("startPage") || ""),
      endPage: String(formData.get("endPage") || ""),
      issueId: String(formData.get("issueId") || ""),
      featured: formData.get("featured") === "on",
    };

    try {
      const response = await fetch(
        `/api/articles/by-id/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update article.",
        );
      }

      setArticle(data.article);
      setMessage("Article updated successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update article.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main style={{ padding: 50 }}>Loading article...</main>;
  }

  if (!article) {
    return (
      <main style={{ padding: 50 }}>
        <h1>Unable to load article</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="edit-article-page">
      <div className="edit-article-container">
        <div className="edit-top">
          <Link href="/admin/articles">
            ← Published Articles
          </Link>

          <Link
            href={`/articles/${article.slug}`}
            target="_blank"
          >
            View Public Article
          </Link>
        </div>

        <section className="edit-hero">
          <span>IJER Administration</span>
          <h1>Edit Article</h1>
          <p>
            Update publication information and public article content.
          </p>
        </section>

        {error && <div className="edit-error">{error}</div>}
        {message && <div className="edit-success">✓ {message}</div>}

        <form onSubmit={handleSubmit}>
          <EditSection title="Basic Information">
            <Field label="Title" full>
              <input name="title" defaultValue={article.title} required />
            </Field>

            <Field label="Slug" full>
              <input name="slug" defaultValue={article.slug} required />
            </Field>

            <Field label="Article Type">
              <input
                name="articleType"
                defaultValue={article.articleType}
                required
              />
            </Field>

            <Field label="Subject Area">
              <input
                name="subjectArea"
                defaultValue={article.subjectArea || ""}
              />
            </Field>
          </EditSection>

          <EditSection title="Authors">
            <Field label="Authors" full>
              <textarea
                name="authors"
                defaultValue={article.authors}
                required
              />
            </Field>

            <Field label="Affiliations" full>
              <textarea
                name="affiliations"
                defaultValue={article.affiliations || ""}
              />
            </Field>

            <Field label="Corresponding Author">
              <input
                name="correspondingAuthor"
                defaultValue={article.correspondingAuthor || ""}
              />
            </Field>

            <Field label="Correspondence Email">
              <input
                name="correspondenceEmail"
                defaultValue={article.correspondenceEmail || ""}
              />
            </Field>
          </EditSection>

          <EditSection title="Abstract & Keywords">
            <Field label="Abstract" full>
              <textarea
                name="abstractText"
                defaultValue={article.abstractText}
                required
              />
            </Field>

            <Field label="Keywords" full>
              <input
                name="keywords"
                defaultValue={article.keywords}
                required
              />
            </Field>
          </EditSection>

          <EditSection title="Full Article Content">
            <Field label="Introduction" full>
              <textarea
                name="introduction"
                defaultValue={article.introduction || ""}
              />
            </Field>

            <Field label="Materials & Methods" full>
              <textarea
                name="methods"
                defaultValue={article.methods || ""}
              />
            </Field>

            <Field label="Results" full>
              <textarea
                name="results"
                defaultValue={article.results || ""}
              />
            </Field>

            <Field label="Discussion" full>
              <textarea
                name="discussion"
                defaultValue={article.discussion || ""}
              />
            </Field>

            <Field label="Conclusion" full>
              <textarea
                name="conclusion"
                defaultValue={article.conclusion || ""}
              />
            </Field>

            <Field label="References" full>
              <textarea
                name="referencesText"
                defaultValue={article.referencesText || ""}
              />
            </Field>
          </EditSection>

          <EditSection title="Publication Information">
            <Field label="Issue" full>
              <select
                name="issueId"
                defaultValue={article.issueId || ""}
              >
                <option value="">No issue</option>

                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    Volume {issue.volumeNumber}, Issue{" "}
                    {issue.issueNumber} ({issue.year})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Start Page">
              <input
                name="startPage"
                defaultValue={article.startPage || ""}
              />
            </Field>

            <Field label="End Page">
              <input
                name="endPage"
                defaultValue={article.endPage || ""}
              />
            </Field>

            <Field label="DOI">
              <input name="doi" defaultValue={article.doi || ""} />
            </Field>

            <Field label="ISSN">
              <input name="issn" defaultValue={article.issn || ""} />
            </Field>

            <label className="featured-edit">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={article.featured}
              />

              Feature this article
            </label>
          </EditSection>

          <EditSection title="Declarations">
            <Field label="Acknowledgements" full>
              <textarea
                name="acknowledgements"
                defaultValue={article.acknowledgements || ""}
              />
            </Field>

            <Field label="Conflict of Interest" full>
              <textarea
                name="conflictOfInterest"
                defaultValue={article.conflictOfInterest || ""}
              />
            </Field>

            <Field label="Funding Statement" full>
              <textarea
                name="fundingStatement"
                defaultValue={article.fundingStatement || ""}
              />
            </Field>

            <Field label="Ethics Statement" full>
              <textarea
                name="ethicsStatement"
                defaultValue={article.ethicsStatement || ""}
              />
            </Field>
          </EditSection>

          <button
            className="save-article-button"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Article Changes"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .edit-article-page {
          min-height: 100vh;
          padding: 40px 0 90px;
          background: #f5f9f7;
          color: #17382f;
        }

        .edit-article-container {
          width: min(1050px, calc(100% - 44px));
          margin: 0 auto;
        }

        .edit-top {
          margin-bottom: 22px;
          display: flex;
          justify-content: space-between;
        }

        .edit-top a {
          color: #176b4d;
          font-weight: 800;
          text-decoration: none;
        }

        .edit-hero {
          padding: 40px;
          border-radius: 22px;
          background: #0e503a;
          color: white;
        }

        .edit-hero span {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .edit-hero h1 {
          margin: 8px 0;
          color: white;
          font-size: 45px;
        }

        .edit-hero p {
          margin: 0;
          color: #d8ebe3;
        }

        .edit-section {
          margin-top: 25px;
          padding: 32px;
          border: 1px solid #dce8e2;
          border-radius: 18px;
          background: white;
        }

        .edit-section h2 {
          margin: 0 0 25px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e4ece8;
        }

        .edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .edit-field.full {
          grid-column: 1 / -1;
        }

        .edit-field label {
          display: block;
          margin-bottom: 7px;
          font-weight: 800;
        }

        .edit-field input,
        .edit-field textarea,
        .edit-field select {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #cadbd3;
          border-radius: 9px;
          font: inherit;
        }

        .edit-field textarea {
          min-height: 140px;
          resize: vertical;
        }

        .featured-edit {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
          align-items: center;
          font-weight: 800;
        }

        .save-article-button {
          width: 100%;
          min-height: 55px;
          margin-top: 28px;
          border: 0;
          border-radius: 11px;
          background: #176b4d;
          color: white;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .edit-error,
        .edit-success {
          margin-top: 20px;
          padding: 15px;
          border-radius: 10px;
          font-weight: 700;
        }

        .edit-error {
          background: #fff2f1;
          color: #a23e38;
        }

        .edit-success {
          background: #eaf6ef;
          color: #176b4d;
        }

        @media (max-width: 700px) {
          .edit-grid {
            grid-template-columns: 1fr;
          }

          .edit-field.full {
            grid-column: auto;
          }
        }
      `}</style>
    </main>
  );
}

function EditSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="edit-section">
      <h2>{title}</h2>
      <div className="edit-grid">{children}</div>
    </section>
  );
}

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "edit-field full" : "edit-field"}>
      <label>{label}</label>
      {children}
    </div>
  );
}