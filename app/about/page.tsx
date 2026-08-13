import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">About the Journal</span>
          <h1>About Electro-Homoeopathy Journal</h1>
          <p>
            A scholarly publication platform focused on research,
            documentation, critical discussion, and scientific investigation
            related to Electro-Homoeopathy, medicinal plants, phytochemistry,
            pharmacognosy, and associated fields.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container content-layout">
          <article className="content-main">
            <h2>Journal Overview</h2>

            <p>
              Electro-Homoeopathy Journal is intended to provide researchers,
              academicians, practitioners, scholars, and students with a
              structured platform for presenting original scientific work and
              scholarly discussion.
            </p>

            <p>
              The journal encourages evidence-focused publication and aims to
              distinguish scientific observation, experimental findings,
              clinical reports, review literature, and theoretical discussion
              clearly within published work.
            </p>

            <h2>What We Publish</h2>

            <div className="info-grid">
              <div className="info-card">
                <h3>Original Research</h3>
                <p>
                  Laboratory, phytochemical, pharmacognostic, microbiological,
                  and other experimental investigations.
                </p>
              </div>

              <div className="info-card">
                <h3>Clinical Research</h3>
                <p>
                  Structured clinical studies and carefully documented
                  observational research.
                </p>
              </div>

              <div className="info-card">
                <h3>Review Articles</h3>
                <p>
                  Evidence-based reviews covering medicinal plants,
                  phytochemistry, Electro-Homoeopathy, and related disciplines.
                </p>
              </div>

              <div className="info-card">
                <h3>Case Reports</h3>
                <p>
                  Educational clinical reports presented with appropriate
                  scientific context and limitations.
                </p>
              </div>
            </div>

            <h2>Academic Principles</h2>

            <p>
              The journal aims to promote transparent methodology, responsible
              reporting, appropriate referencing, ethical publication
              practices, and constructive peer review.
            </p>

            <p>
              Publication in the journal should not be interpreted as automatic
              confirmation that every therapeutic claim discussed in an article
              has been established by high-quality clinical evidence.
            </p>
          </article>

          <aside className="content-sidebar">
            <div className="sidebar-card">
              <span className="eyebrow">Journal Information</span>

              <h3>Quick Links</h3>

              <Link href="/aims-and-scope">Aims & Scope →</Link>
              <Link href="/editorial-board">Editorial Board →</Link>
              <Link href="/peer-review-policy">Peer Review Policy →</Link>
              <Link href="/publication-ethics">Publication Ethics →</Link>
              <Link href="/author-guidelines">Author Guidelines →</Link>
            </div>

            <div className="sidebar-card">
              <span className="eyebrow">Access Model</span>
              <h3>Open Access</h3>
              <p>
                Published content can be made openly accessible according to
                the journal&apos;s final publication policy.
              </p>

              <Link href="/open-access-policy" className="text-link">
                Read Policy →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}