import Link from "next/link";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = {
    type: "Original Research",
    title:
      "Phytochemical Profiling of Selected Medicinal Plants Used in Electro-Homoeopathy",
    authors: [
      "A. Researcher",
      "B. Scholar",
      "C. Investigator",
    ],
    affiliations: [
      "Department of Medicinal Plant Research",
      "International Journal of Electro-Homoeopathy & Research",
    ],
    volume: "Volume 1",
    issue: "Issue 1",
    year: "2026",
    pages: "01–10",
    doi: "To be assigned",
    received: "To be updated",
    accepted: "To be updated",
    published: "To be updated",
    abstract:
      "This study presents a structured phytochemical evaluation of selected medicinal plants associated with Electro-Homoeopathic research. The work focuses on documenting relevant plant constituents using appropriate laboratory methods and presenting the findings in a clear scientific format. The study is intended to support further experimental investigation and does not treat preliminary laboratory findings as equivalent to established clinical evidence.",
    keywords: [
      "Electro-Homoeopathy",
      "Phytochemistry",
      "Medicinal Plants",
      "Pharmacognosy",
      "Plant Extracts",
      "Research",
    ],
  };

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            {article.type}
          </span>

          <h1
            style={{
              maxWidth: "980px",
              fontSize: "clamp(38px, 5vw, 58px)",
            }}
          >
            {article.title}
          </h1>

          <p>
            Published in the International Journal of
            Electro-Homoeopathy &amp; Research
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 320px",
              gap: "80px",
              alignItems: "start",
            }}
          >
            <article>
              <section
                style={{
                  paddingBottom: "34px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Authors
                </span>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "6px",
                  }}
                >
                  {article.authors.map((author) => (
                    <span
                      key={author}
                      style={{
                        padding: "9px 14px",
                        borderRadius: "999px",
                        background: "var(--green-soft)",
                        color: "var(--green-dark)",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      {author}
                    </span>
                  ))}
                </div>
              </section>

              <section
                style={{
                  padding: "34px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Affiliations
                </span>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    marginTop: "8px",
                    color: "var(--muted)",
                  }}
                >
                  {article.affiliations.map((item) => (
                    <p
                      key={item}
                      style={{
                        margin: 0,
                        fontSize: "16px",
                      }}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section
                style={{
                  padding: "48px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Abstract
                </span>

                <h2
                  style={{
                    margin: "0 0 22px",
                    fontSize: "34px",
                  }}
                >
                  Abstract
                </h2>

                <p
                  style={{
                    margin: 0,
                    maxWidth: "840px",
                    fontSize: "17px",
                    lineHeight: 1.95,
                    color: "var(--muted)",
                  }}
                >
                  {article.abstract}
                </p>
              </section>

              <section
                style={{
                  padding: "48px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Keywords
                </span>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  {article.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      style={{
                        padding: "10px 14px",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        background: "#ffffff",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--green-dark)",
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>

              <section
                style={{
                  padding: "48px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Article Information
                </span>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "18px",
                    marginTop: "12px",
                  }}
                >
                  <InfoBox
                    label="Volume"
                    value={article.volume}
                  />

                  <InfoBox
                    label="Issue"
                    value={article.issue}
                  />

                  <InfoBox
                    label="Year"
                    value={article.year}
                  />

                  <InfoBox
                    label="Pages"
                    value={article.pages}
                  />

                  <InfoBox
                    label="DOI"
                    value={article.doi}
                  />

                  <InfoBox
                    label="Article ID"
                    value={slug}
                  />
                </div>
              </section>

              <section
                style={{
                  padding: "48px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Publication History
                </span>

                <div
                  style={{
                    display: "grid",
                    gap: "18px",
                    marginTop: "12px",
                  }}
                >
                  <InfoRow
                    label="Received"
                    value={article.received}
                  />

                  <InfoRow
                    label="Accepted"
                    value={article.accepted}
                  />

                  <InfoRow
                    label="Published"
                    value={article.published}
                  />
                </div>
              </section>

              <section
                style={{
                  padding: "48px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span className="eyebrow">
                  Citation
                </span>

                <div
                  style={{
                    marginTop: "12px",
                    padding: "26px",
                    borderRadius: "18px",
                    background: "#f7faf8",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.85,
                      color: "var(--muted)",
                    }}
                  >
                    Researcher A, Scholar B, Investigator C.
                    Phytochemical Profiling of Selected
                    Medicinal Plants Used in
                    Electro-Homoeopathy. International Journal
                    of Electro-Homoeopathy &amp; Research.
                    2026; 1(1): 01–10.
                  </p>
                </div>
              </section>

              <section
                style={{
                  padding: "48px 0 0",
                }}
              >
                <span className="eyebrow">
                  References
                </span>

                <h2
                  style={{
                    margin: "0 0 22px",
                    fontSize: "34px",
                  }}
                >
                  References
                </h2>

                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.9,
                  }}
                >
                  References will appear here when the final
                  manuscript is uploaded and published.
                </p>
              </section>
            </article>

            <aside
              style={{
                position: "sticky",
                top: "28px",
                display: "grid",
                gap: "22px",
              }}
            >
              <div className="sidebar-card">
                <span className="eyebrow">
                  Article Access
                </span>

                <h3>
                  Full Text
                </h3>

                <p>
                  The final published PDF will be available here
                  after publication.
                </p>

                <button
                  type="button"
                  disabled
                  style={{
                    width: "100%",
                    minHeight: "48px",
                    border: 0,
                    borderRadius: "10px",
                    background: "#dfe9e4",
                    color: "#6b7c75",
                    fontWeight: 700,
                    cursor: "not-allowed",
                  }}
                >
                  PDF Coming Soon
                </button>
              </div>

              <div className="sidebar-card">
                <span className="eyebrow">
                  Issue
                </span>

                <h3>
                  Volume 1, Issue 1
                </h3>

                <p>
                  Browse the complete current issue of IJER.
                </p>

                <Link
                  href="/current-issue"
                  className="text-link"
                >
                  View Current Issue →
                </Link>
              </div>

              <div className="sidebar-card">
                <span className="eyebrow">
                  Journal
                </span>

                <h3>
                  IJER
                </h3>

                <p>
                  International Journal of
                  Electro-Homoeopathy &amp; Research
                </p>

                <Link
                  href="/about"
                  className="text-link"
                >
                  About the Journal →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "22px",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        background: "#ffffff",
      }}
    >
      <span
        style={{
          display: "block",
          marginBottom: "6px",
          color: "var(--muted)",
          fontSize: "12px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "30px",
        paddingBottom: "16px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <strong>
        {label}
      </strong>

      <span
        style={{
          color: "var(--muted)",
        }}
      >
        {value}
      </span>
    </div>
  );
}