import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CurrentIssueStyles from "./CurrentIssueStyles";

export const dynamic = "force-dynamic";

export default async function CurrentIssuePage() {
  const currentIssue = await prisma.issue.findFirst({
    where: {
      current: true,
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

  if (!currentIssue) {
    return (
      <main>
        <section className="page-hero">
          <div className="site-container">
            <span className="eyebrow">
              Current Publication
            </span>

            <h1>Current Issue</h1>

            <p>
              The latest published issue of the International Journal of
              Electro-Homoeopathy &amp; Research will appear here.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="site-container">
            <div className="empty-current-issue">
              <span className="eyebrow">
                IJER
              </span>

              <h2>
                No published issue available
              </h2>

              <p>
                The current journal issue has not yet been published.
              </p>
            </div>
          </div>
        </section>

        <CurrentIssueStyles />
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            Current Publication
          </span>

          <h1>Current Issue</h1>

          <p>
            Browse the latest published research from the International
            Journal of Electro-Homoeopathy &amp; Research.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="issue-header-card">
            <div>
              <span className="eyebrow">
                IJER Journal Issue
              </span>

              <h2>
                Volume {currentIssue.volumeNumber}, Issue{" "}
                {currentIssue.issueNumber}
              </h2>

              <p className="issue-year">
                {currentIssue.year}
              </p>

              {currentIssue.title && (
                <h3>
                  {currentIssue.title}
                </h3>
              )}

              {currentIssue.description && (
                <p className="issue-description">
                  {currentIssue.description}
                </p>
              )}
            </div>

            <div className="issue-meta-box">
              <span>
                Published
              </span>

              <strong>
                {currentIssue.publicationDate
                  ? new Date(
                      currentIssue.publicationDate,
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : "Publication date not set"}
              </strong>

              <span>
                Articles
              </span>

              <strong>
                {currentIssue.articles.length}
              </strong>
            </div>
          </div>

          <div className="articles-heading">
            <div>
              <span className="eyebrow">
                Published Articles
              </span>

              <h2>
                Articles in this Issue
              </h2>
            </div>

            <Link href="/archives">
              View Archives →
            </Link>
          </div>

          {currentIssue.articles.length === 0 ? (
            <div className="empty-articles">
              No published articles are currently assigned to this issue.
            </div>
          ) : (
            <div className="article-list">
              {currentIssue.articles.map(
                (article, index) => (
                  <article
                    className="article-card"
                    key={article.id}
                  >
                    <div className="article-number">
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </div>

                    <div className="article-content">
                      <div className="article-meta">
                        <span>
                          {article.articleType}
                        </span>

                        {article.subjectArea && (
                          <span>
                            {article.subjectArea}
                          </span>
                        )}
                      </div>

                      <h3>
                        <Link
                          href={`/articles/${article.slug}`}
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <p className="article-authors">
                        {article.authors}
                      </p>

                      <p className="article-abstract">
                        {article.abstractText}
                      </p>

                      <div className="article-footer">
                        <div>
                          {article.startPage &&
                            article.endPage && (
                              <span>
                                Pages{" "}
                                {article.startPage}-
                                {article.endPage}
                              </span>
                            )}

                          {article.doi && (
                            <span>
                              DOI: {article.doi}
                            </span>
                          )}

                          {article.publishedDate && (
                            <span>
                              Published{" "}
                              {new Date(
                                article.publishedDate,
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/articles/${article.slug}`}
                          className="read-article"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      <CurrentIssueStyles />
    </main>
  );
}
