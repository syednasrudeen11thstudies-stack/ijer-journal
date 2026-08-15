import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ArchiveStyles from "./ArchiveStyles";

export const dynamic = "force-dynamic";

export default async function ArchivesPage() {
  const issues = await prisma.issue.findMany({
    where: {
      published: true,
    },

    include: {
      articles: {
        where: {
          status: "PUBLISHED",
        },

        orderBy: {
          publishedDate: "asc",
        },
      },
    },

    orderBy: [
      {
        year: "desc",
      },
      {
        volumeNumber: "desc",
      },
      {
        issueNumber: "desc",
      },
    ],
  });

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            Journal Archive
          </span>

          <h1>Archives</h1>

          <p>
            Browse published volumes, issues and research articles from the
            International Journal of Electro-Homoeopathy &amp; Research.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="archive-container">
          <div className="archive-heading">
            <span className="eyebrow">
              Published Issues
            </span>

            <h2>IJER Journal Archive</h2>

            <p>
              Published issues are arranged by year, volume and issue number.
            </p>
          </div>

          {issues.length === 0 ? (
            <div className="archive-empty">
              No published journal issues are available yet.
            </div>
          ) : (
            <div className="archive-list">
              {issues.map((issue) => (
                <section
                  className="archive-issue"
                  key={issue.id}
                >
                  <div className="archive-issue-top">
                    <div>
                      <span className="archive-year">
                        {issue.year}
                      </span>

                      <h2>
                        Volume {issue.volumeNumber}, Issue{" "}
                        {issue.issueNumber}
                      </h2>

                      {issue.title && (
                        <p className="archive-title">
                          {issue.title}
                        </p>
                      )}

                      {issue.description && (
                        <p className="archive-description">
                          {issue.description}
                        </p>
                      )}
                    </div>

                    <div className="archive-badges">
                      {issue.current && (
                        <span>Current</span>
                      )}

                      <span>
                        {issue.articles.length}{" "}
                        {issue.articles.length === 1
                          ? "Article"
                          : "Articles"}
                      </span>
                    </div>
                  </div>

                  <div className="archive-articles">
                    {issue.articles.length === 0 ? (
                      <p>
                        No articles are assigned to this issue.
                      </p>
                    ) : (
                      issue.articles.map((article) => (
                        <article
                          className="archive-article"
                          key={article.id}
                        >
                          <div>
                            <h3>
                              <Link
                                href={`/articles/${article.slug}`}
                              >
                                {article.title}
                              </Link>
                            </h3>

                            <p>
                              {article.authors}
                            </p>
                          </div>

                          <Link
                            href={`/articles/${article.slug}`}
                            className="archive-read"
                          >
                            Read Article →
                          </Link>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      <ArchiveStyles />
    </main>
  );
}