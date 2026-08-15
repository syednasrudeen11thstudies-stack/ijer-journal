import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pharmacognosy",
  description:
    "Research involving the identification, characterization, standardization, quality assessment, and scientific investigation of medicines and bioactive substances obtained from natural sources.",
};

export default function CategoryPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            Research Area
          </span>

          <h1>Pharmacognosy</h1>

          <p>
            Research involving the identification, characterization, standardization, quality assessment, and scientific investigation of medicines and bioactive substances obtained from natural sources.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container content-layout">
          <article className="content-main">
            <span className="eyebrow">
              IJER Research Category
            </span>

            <h2>About This Research Area</h2>

            <p>
              Research involving the identification, characterization, standardization, quality assessment, and scientific investigation of medicines and bioactive substances obtained from natural sources.
            </p>

            <p>
              International Journal of
              Electro-Homoeopathy &amp; Research
              welcomes scholarly manuscripts
              relevant to this research area that
              follow the journal's author
              guidelines, editorial requirements,
              and peer-review process.
            </p>

            <div className="hero-actions">
              <Link
                href="/current-issue"
                className="primary-button"
              >
                Explore Current Issue
              </Link>

              <Link
                href="/submit-manuscript"
                className="secondary-button"
              >
                Submit Manuscript
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}