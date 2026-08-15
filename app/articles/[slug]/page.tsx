import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleStyles from "./ArticleStyles";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },

    include: {
      issue: true,
    },
  });

  if (!article || article.status !== "PUBLISHED") {
    return {
      title: "Article Not Found",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  const articleUrl =
    `${siteUrl}/articles/${article.slug}`;

  const description =
    article.abstractText.length > 160
      ? `${article.abstractText.slice(0, 157)}...`
      : article.abstractText;

  const keywords = article.keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const authors = article.authors
    .split(/\n|;/)
    .map((author) => author.trim())
    .filter(Boolean);

  return {
    title: article.title,

    description,

    keywords,

    authors: authors.map((name) => ({
      name,
    })),

    alternates: {
      canonical: articleUrl,
    },

    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.title,
      description,

      siteName:
        "International Journal of Electro-Homoeopathy & Research",

      publishedTime:
        article.publishedDate?.toISOString(),

      modifiedTime:
        article.updatedAt.toISOString(),

      authors,
    },

    twitter: {
      card: "summary",
      title: article.title,
      description,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    other: {
      citation_title:
        article.title,

      citation_author:
        authors,

      citation_journal_title:
        "International Journal of Electro-Homoeopathy & Research",

      ...(article.issue
        ? {
            citation_volume:
              String(article.issue.volumeNumber),

            citation_issue:
              String(article.issue.issueNumber),
          }
        : {}),

      ...(article.publishedDate
        ? {
            citation_publication_date:
              article.publishedDate
                .toISOString()
                .split("T")[0],
          }
        : article.issue?.publicationDate
          ? {
              citation_publication_date:
                article.issue.publicationDate
                  .toISOString()
                  .split("T")[0],
            }
          : {}),

      ...(article.startPage
        ? {
            citation_firstpage:
              article.startPage,
          }
        : {}),

      ...(article.endPage
        ? {
            citation_lastpage:
              article.endPage,
          }
        : {}),

      ...(article.doi
        ? {
            citation_doi:
              article.doi,
          }
        : {}),

      ...(article.issn
        ? {
            citation_issn:
              article.issn,
          }
        : {}),

      ...(article.pdfUrl
        ? {
            citation_pdf_url:
              article.pdfUrl,
          }
        : {}),

      citation_abstract:
        article.abstractText,

      citation_keywords:
        article.keywords,
    },
  };
}
export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
    },

    include: {
      issue: true,
    },
  });

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  const keywords = article.keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const pageRange =
    article.startPage && article.endPage
      ? `${article.startPage}-${article.endPage}`
      : article.startPage || article.endPage || null;

  const citation = [
    article.authors.replaceAll("\n", ", "),
    article.title,
    "International Journal of Electro-Homoeopathy & Research",
    article.issue
      ? `${article.issue.year}; Volume ${article.issue.volumeNumber}, Issue ${article.issue.issueNumber}`
      : null,
    pageRange
      ? `Pages ${pageRange}`
      : null,
    article.doi
      ? `DOI: ${article.doi}`
      : null,
  ]
    .filter(Boolean)
    .join(". ");

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  const articleAuthors = article.authors
    .split(/\n|;/)
    .map((author) => author.trim())
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",

    headline: article.title,

    name: article.title,

    description:
      article.abstractText,

    abstract:
      article.abstractText,

    url:
      `${siteUrl}/articles/${article.slug}`,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":
        `${siteUrl}/articles/${article.slug}`,
    },

    author: articleAuthors.map(
      (name) => ({
        "@type": "Person",
        name,
      }),
    ),

    publisher: {
      "@type": "Organization",

      name:
        "International Journal of Electro-Homoeopathy & Research",

      url: siteUrl,
    },

    isPartOf: {
      "@type": "Periodical",

      name:
        "International Journal of Electro-Homoeopathy & Research",

      ...(article.issn
        ? {
            issn: article.issn,
          }
        : {}),
    },

    ...(article.articleType
      ? {
          articleSection:
            article.articleType,
        }
      : {}),

    keywords: article.keywords,

    ...(article.publishedDate
      ? {
          datePublished:
            article.publishedDate.toISOString(),
        }
      : article.issue?.publicationDate
        ? {
            datePublished:
              article.issue.publicationDate.toISOString(),
          }
        : {}),

    dateModified:
      article.updatedAt.toISOString(),

    ...(article.doi
      ? {
          identifier: {
            "@type":
              "PropertyValue",

            propertyID: "DOI",

            value: article.doi,
          },

          sameAs:
            `https://doi.org/${article.doi}`,
        }
      : {}),

    ...(pageRange
      ? {
          pagination:
            pageRange,
        }
      : {}),

    ...(article.issue
      ? {
          volumeNumber:
            String(
              article.issue.volumeNumber,
            ),

          issueNumber:
            String(
              article.issue.issueNumber,
            ),
        }
      : {}),
  };
  return (
    <main className="public-article-page">
      <section className="article-public-hero">
        <div className="article-public-container">
          <div className="article-public-breadcrumb">
            <Link href="/">
              Home
            </Link>

            <span>›</span>

            <Link href="/current-issue">
              Current Issue
            </Link>

            <span>›</span>

            <span>Article</span>
          </div>

          <div className="article-category-row">
            <span>
              {article.articleType}
            </span>

            {article.subjectArea && (
              <span>
                {article.subjectArea}
              </span>
            )}

            {article.issue && (
              <span>
                Volume{" "}
                {article.issue.volumeNumber},
                Issue{" "}
                {article.issue.issueNumber}
              </span>
            )}
          </div>

          <h1>
            {article.title}
          </h1>

          <p className="article-public-authors">
            {article.authors}
          </p>
        </div>
      </section>

      <div className="article-public-container">
        <div className="article-public-layout">
          <div className="article-main-column">
            <section className="article-public-card">
              <span className="section-label">
                Abstract
              </span>

              <h2>
                Abstract
              </h2>

              <p>
                {article.abstractText}
              </p>
            </section>

            <section className="article-public-card">
              <span className="section-label">
                Keywords
              </span>

              <h2>
                Keywords
              </h2>

              <div className="article-keywords">
                {keywords.map((keyword) => (
                  <span key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </section>

            {article.introduction && (
              <ArticleSection
                label="Article"
                title="Introduction"
                content={
                  article.introduction
                }
              />
            )}

            {article.methods && (
              <ArticleSection
                label="Article"
                title="Materials & Methods"
                content={
                  article.methods
                }
              />
            )}

            {article.results && (
              <ArticleSection
                label="Article"
                title="Results"
                content={
                  article.results
                }
              />
            )}

            {article.discussion && (
              <ArticleSection
                label="Article"
                title="Discussion"
                content={
                  article.discussion
                }
              />
            )}

            {article.conclusion && (
              <ArticleSection
                label="Article"
                title="Conclusion"
                content={
                  article.conclusion
                }
              />
            )}

            {article.acknowledgements && (
              <ArticleSection
                label="Declarations"
                title="Acknowledgements"
                content={
                  article.acknowledgements
                }
              />
            )}

            {article.conflictOfInterest && (
              <ArticleSection
                label="Declarations"
                title="Conflict of Interest"
                content={
                  article.conflictOfInterest
                }
              />
            )}

            {article.fundingStatement && (
              <ArticleSection
                label="Declarations"
                title="Funding"
                content={
                  article.fundingStatement
                }
              />
            )}

            {article.ethicsStatement && (
              <ArticleSection
                label="Declarations"
                title="Ethics Statement"
                content={
                  article.ethicsStatement
                }
              />
            )}

            {article.referencesText && (
              <ArticleSection
                label="References"
                title="References"
                content={
                  article.referencesText
                }
              />
            )}
          </div>

          <aside className="article-sidebar">
            <section className="article-info-card">
              <h3>
                Article Information
              </h3>

              <div className="article-info-list">
                <InfoItem
                  label="Article Type"
                  value={
                    article.articleType
                  }
                />

                {article.subjectArea && (
                  <InfoItem
                    label="Subject Area"
                    value={
                      article.subjectArea
                    }
                  />
                )}

                {article.issue && (
                  <InfoItem
                    label="Issue"
                    value={`Volume ${article.issue.volumeNumber}, Issue ${article.issue.issueNumber} (${article.issue.year})`}
                  />
                )}

                {pageRange && (
                  <InfoItem
                    label="Pages"
                    value={pageRange}
                  />
                )}

                {article.receivedDate && (
                  <InfoItem
                    label="Received"
                    value={formatDate(
                      article.receivedDate,
                    )}
                  />
                )}

                {article.acceptedDate && (
                  <InfoItem
                    label="Accepted"
                    value={formatDate(
                      article.acceptedDate,
                    )}
                  />
                )}

                {article.publishedDate && (
                  <InfoItem
                    label="Published"
                    value={formatDate(
                      article.publishedDate,
                    )}
                  />
                )}

                {article.doi && (
                  <InfoItem
                    label="DOI"
                    value={article.doi}
                  />
                )}

                {article.issn && (
                  <InfoItem
                    label="ISSN"
                    value={article.issn}
                  />
                )}

                {article.correspondingAuthor && (
                  <InfoItem
                    label="Corresponding Author"
                    value={
                      article.correspondingAuthor
                    }
                  />
                )}

                {article.correspondenceEmail && (
                  <InfoItem
                    label="Correspondence"
                    value={
                      article.correspondenceEmail
                    }
                  />
                )}

                {article.affiliations && (
                  <InfoItem
                    label="Affiliation"
                    value={
                      article.affiliations
                    }
                  />
                )}
              </div>
            </section>

            {article.pdfUrl && (
              <a
                href={`/api/articles/${article.slug}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="article-pdf-button"
              >
                Open Published PDF
              </a>
            )}

            <section className="article-citation-card">
              <h3>
                How to Cite
              </h3>

              <p>
                {citation}.
              </p>
            </section>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\u003c",
          ),
        }}
      />

      <ArticleStyles />
    </main>
  );
}

function ArticleSection({
  label,
  title,
  content,
}: {
  label: string;
  title: string;
  content: string;
}) {
  return (
    <section className="article-public-card">
      <span className="section-label">
        {label}
      </span>

      <h2>
        {title}
      </h2>

      <p className="article-section-text">
        {content}
      </p>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="article-info-item">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function formatDate(
  date: Date,
) {
  return new Date(
    date,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
}