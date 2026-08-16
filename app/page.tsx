import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categories = [
  {
    name: "Electro-Homoeopathy Research",
    href: "/categories/electro-homoeopathy-research",
  },
  {
    name: "Phytochemistry",
    href: "/categories/phytochemistry",
  },
  {
    name: "Medicinal Plants",
    href: "/categories/medicinal-plants",
  },
  {
    name: "Pharmacognosy",
    href: "/categories/pharmacognosy",
  },
  {
    name: "Clinical Research",
    href: "/categories/clinical-research",
  },
  {
    name: "Experimental Studies",
    href: "/categories/experimental-studies",
  },
];

export default async function Home() {
  const latestArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: [
      {
        publishedDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      articleType: true,
      authors: true,
    },
  });
  return (
    <main>
      <section className="hero-section">
        <div className="site-container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">Open Access Academic Journal</span>

            <h1>
              Advancing Scientific Research in
              <span> Electro-Homoeopathy</span>
            </h1>

            <p>
              A scholarly platform dedicated to publishing research,
              experimental studies, clinical observations, phytochemical
              investigations, reviews, and scientific discussions related to
              Electro-Homoeopathy and medicinal plants.
            </p>

            <div className="hero-actions">
              <Link href="/current-issue" className="primary-button">
                Explore Current Issue
              </Link>

              <Link href="/submit-manuscript" className="secondary-button">
                Submit Manuscript
              </Link>
            </div>
          </div>

          <div className="hero-panel">
            <span className="panel-label">Current Issue</span>

            <h2>Volume 1 &bull; Issue 1</h2>

            <p>
              Explore peer-reviewed research articles, reviews, case reports,
              and experimental studies.
            </p>

            <div className="issue-meta">
              <div>
                <strong>2026</strong>
                <span>Publication Year</span>
              </div>

              <div>
                <strong>Open Access</strong>
                <span>Full-text articles</span>
              </div>
            </div>

            <Link href="/current-issue" className="text-link">
              View Current Issue &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Research Areas</span>
              <h2>Explore Journal Categories</h2>
            </div>

            <p>
              Discover research across scientific disciplines connected with
              Electro-Homoeopathy, medicinal plants, and experimental
              investigation.
            </p>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                href={category.href}
                key={category.name}
                className="category-card"
              >
                <span>{category.name}</span>
                <span className="arrow">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Latest Publications</span>
              <h2>Recently Published Articles</h2>
            </div>

            <Link href="/archives" className="text-link">
              Browse all articles &rarr;
            </Link>
          </div>

          <div className="articles-list">
            {latestArticles.map((article) => (
              <article key={article.title} className="article-card">
                <div>
                  <span className="article-type">{article.articleType}</span>

                  <h3>{article.title}</h3>

                  <p>{article.authors}</p>
                </div>

                <Link href="/current-issue" className="article-link">
                  Read Article &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="site-container two-column-section">
          <div>
            <span className="eyebrow">For Authors</span>

            <h2>Publish Your Research With Us</h2>

            <p className="large-copy">
              Authors can submit original research, review articles,
              experimental studies, case reports, short communications, and
              scholarly discussions for editorial consideration.
            </p>

            <Link href="/author-guidelines" className="primary-button">
              View Author Guidelines
            </Link>
          </div>

          <div className="resource-panel">
            <Link href="/submit-manuscript">
              <span>01</span>
              Submit Manuscript
            </Link>

            <Link href="/peer-review-policy">
              <span>02</span>
              Peer Review Process
            </Link>

            <Link href="/publication-ethics">
              <span>03</span>
              Publication Ethics
            </Link>

            <Link href="/open-access-policy">
              <span>04</span>
              Open Access Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
