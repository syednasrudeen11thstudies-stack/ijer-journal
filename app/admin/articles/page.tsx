"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  doi: string | null;
  startPage: string | null;
  endPage: string | null;
  publishedDate: string | null;
  status: string;
  featured: boolean;
  pdfUrl: string | null;
  issue: Issue | null;
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadArticles() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/articles", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load articles.",
        );
      }

      setArticles(data.articles || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load articles.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function deleteArticle(
    id: string,
    title: string,
  ) {
    const confirmed = window.confirm(
      `Delete "${title}"?

This will remove the published article. The linked manuscript will return to ACCEPTED status.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `/api/articles/by-id/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete article.",
        );
      }

      setArticles((current) =>
        current.filter(
          (article) => article.id !== id,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete article.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="articles-admin-page">
      <div className="articles-admin-container">
        <div className="articles-admin-topbar">
          <Link href="/admin/dashboard">
            ← Dashboard
          </Link>

          <Link
            href="/admin/manuscripts"
            className="topbar-secondary"
          >
            Manuscripts
          </Link>
        </div>

        <section className="articles-admin-hero">
          <div>
            <span className="articles-admin-eyebrow">
              IJER Administration
            </span>

            <h1>Published Articles</h1>

            <p>
              View all articles published in the International
              Journal of Electro-Homoeopathy &amp; Research.
            </p>
          </div>

          <Link
            href="/admin/manuscripts"
            className="publish-new-button"
          >
            + Publish Accepted Manuscript
          </Link>
        </section>

        <div className="articles-admin-stats">
          <StatCard
            label="Total Articles"
            value={articles.length}
          />

          <StatCard
            label="Published"
            value={
              articles.filter(
                (article) =>
                  article.status === "PUBLISHED",
              ).length
            }
          />

          <StatCard
            label="Featured"
            value={
              articles.filter(
                (article) => article.featured,
              ).length
            }
          />

          <StatCard
            label="With PDF"
            value={
              articles.filter(
                (article) => article.pdfUrl,
              ).length
            }
          />
        </div>

        <section className="articles-admin-panel">
          <div className="articles-panel-heading">
            <div>
              <span className="articles-admin-eyebrow">
                Publication Database
              </span>

              <h2>Articles</h2>
            </div>

            <button
              type="button"
              onClick={loadArticles}
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="articles-state">
              Loading articles...
            </div>
          )}

          {!loading && error && (
            <div className="articles-state articles-error">
              <strong>
                Unable to load articles
              </strong>

              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            articles.length === 0 && (
              <div className="articles-state">
                <h3>
                  No published articles yet
                </h3>

                <p>
                  Accepted manuscripts can be published from the
                  manuscript administration area.
                </p>

                <Link href="/admin/manuscripts">
                  Open Manuscripts
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            articles.length > 0 && (
              <div className="articles-table-wrapper">
                <table className="articles-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Authors</th>
                      <th>Issue</th>
                      <th>Pages</th>
                      <th>Published</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {articles.map((article) => {
                      const pages =
                        article.startPage &&
                        article.endPage
                          ? `${article.startPage}-${article.endPage}`
                          : "-";

                      return (
                        <tr key={article.id}>
                          <td>
                            <strong className="article-title">
                              {article.title}
                            </strong>

                            <span className="article-meta">
                              {article.articleType}
                              {article.subjectArea
                                ? ` • ${article.subjectArea}`
                                : ""}
                            </span>

                            {article.doi && (
                              <span className="article-doi">
                                DOI: {article.doi}
                              </span>
                            )}
                          </td>

                          <td>
                            <span className="authors-text">
                              {article.authors}
                            </span>
                          </td>

                          <td>
                            {article.issue ? (
                              <span>
                                Vol.{" "}
                                {
                                  article.issue
                                    .volumeNumber
                                }
                                , Issue{" "}
                                {
                                  article.issue
                                    .issueNumber
                                }
                                <br />
                                {article.issue.year}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>{pages}</td>

                          <td>
                            {article.publishedDate
                              ? new Date(
                                  article.publishedDate,
                                ).toLocaleDateString(
                                  "en-IN",
                                )
                              : "-"}
                          </td>

                          <td>
                            <span className="article-status-badge">
                              {article.status}
                            </span>

                            {article.featured && (
                              <span className="featured-badge">
                                Featured
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="article-actions">
                              <Link
                                href={`/admin/articles/${article.id}/edit`}
                              >
                                Edit
                              </Link>

                              <Link
                                href={`/articles/${article.slug}`}
                                target="_blank"
                              >
                                View
                              </Link>

                              {article.pdfUrl && (
                                <Link
                                  href={`/api/articles/${article.slug}/pdf`}
                                  target="_blank"
                                >
                                  PDF
                                </Link>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  deleteArticle(
                                    article.id,
                                    article.title,
                                  )
                                }
                                disabled={
                                  deletingId === article.id
                                }
                                className="delete-article-button"
                              >
                                {deletingId === article.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>

      <ArticlesAdminStyles />
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="articles-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ArticlesAdminStyles() {
  return (
    <style jsx global>{`
      .articles-admin-page {
        min-height: 100vh;
        padding: 42px 0 90px;
        background: #f5f9f7;
        color: #17382f;
      }

      .articles-admin-container {
        width: min(1400px, calc(100% - 48px));
        margin: 0 auto;
      }

      .articles-admin-topbar {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
      }

      .articles-admin-topbar a {
        color: #176b4d;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .articles-admin-hero {
        padding: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 35px;
        border-radius: 24px;
        background: #0e503a;
        color: white;
      }

      .articles-admin-eyebrow {
        display: block;
        margin-bottom: 10px;
        color: #27805e;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .articles-admin-hero .articles-admin-eyebrow {
        color: #b9dfd0;
      }

      .articles-admin-hero h1 {
        margin: 0;
        color: white;
        font-size: clamp(38px, 5vw, 50px);
      }

      .articles-admin-hero p {
        max-width: 700px;
        margin: 16px 0 0;
        color: #d8ebe3;
        line-height: 1.8;
      }

      .publish-new-button {
        flex-shrink: 0;
        padding: 14px 18px;
        border-radius: 10px;
        background: white;
        color: #0e503a;
        font-size: 13px;
        font-weight: 900;
        text-decoration: none;
      }

      .articles-admin-stats {
        margin-top: 26px;
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .articles-stat-card {
        padding: 22px;
        border: 1px solid #dce8e2;
        border-radius: 16px;
        background: white;
      }

      .articles-stat-card span,
      .articles-stat-card strong {
        display: block;
      }

      .articles-stat-card span {
        color: #74867e;
        font-size: 12px;
        font-weight: 700;
      }

      .articles-stat-card strong {
        margin-top: 10px;
        font-size: 32px;
      }

      .articles-admin-panel {
        margin-top: 35px;
        overflow: hidden;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
      }

      .articles-panel-heading {
        padding: 27px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 25px;
        border-bottom: 1px solid #e2ebe6;
      }

      .articles-panel-heading h2 {
        margin: 0;
        font-size: 27px;
      }

      .articles-panel-heading button {
        padding: 10px 16px;
        border: 1px solid #bed1c7;
        border-radius: 9px;
        background: white;
        color: #176b4d;
        font-weight: 800;
        cursor: pointer;
      }

      .articles-state {
        padding: 70px 30px;
        text-align: center;
        color: #74867e;
      }

      .articles-state h3,
      .articles-state strong {
        color: #17382f;
      }

      .articles-state a {
        display: inline-block;
        margin-top: 16px;
        color: #176b4d;
        font-weight: 900;
      }

      .articles-error {
        color: #a23e38;
      }

      .articles-table-wrapper {
        overflow-x: auto;
      }

      .articles-table {
        width: 100%;
        min-width: 1150px;
        border-collapse: collapse;
      }

      .articles-table th {
        padding: 15px 18px;
        background: #f7faf8;
        border-bottom: 1px solid #e2ebe6;
        color: #71827a;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-align: left;
        text-transform: uppercase;
      }

      .articles-table td {
        padding: 20px 18px;
        border-bottom: 1px solid #edf2ef;
        color: #53675e;
        font-size: 12px;
        vertical-align: top;
      }

      .article-title {
        display: block;
        max-width: 340px;
        margin-bottom: 6px;
        color: #17382f;
        font-size: 13px;
        line-height: 1.55;
      }

      .article-meta,
      .article-doi {
        display: block;
        margin-top: 4px;
        color: #819088;
        font-size: 10px;
      }

      .authors-text {
        display: block;
        max-width: 260px;
        white-space: pre-line;
        line-height: 1.6;
      }

      .article-status-badge,
      .featured-badge {
        display: inline-flex;
        margin: 0 5px 5px 0;
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .article-status-badge {
        background: #e7f5ed;
        color: #157347;
      }

      .featured-badge {
        background: #fff7e8;
        color: #89630e;
      }

      .article-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .article-actions a,
      .delete-article-button {
        padding: 8px 11px;
        border: 0;
        border-radius: 7px;
        background: #176b4d;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
        cursor: pointer;
      }

      .delete-article-button {
        background: #b42318;
      }

      .delete-article-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      @media (max-width: 900px) {
        .articles-admin-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .articles-admin-hero {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      @media (max-width: 600px) {
        .articles-admin-container {
          width: min(100% - 28px, 1400px);
        }

        .articles-admin-hero {
          padding: 30px 23px;
        }

        .articles-admin-stats {
          grid-template-columns: 1fr 1fr;
        }
      }
    `}</style>
  );
}