import Link from "next/link";

const articleTypes = [
  {
    title: "Original Research Article",
    description:
      "Reports original experimental, laboratory, clinical, observational, botanical, phytochemical, pharmacognostic, microbiological, or related research.",
  },
  {
    title: "Review Article",
    description:
      "Provides a structured and critical review of published scientific literature relevant to Electro-Homoeopathy and related research areas.",
  },
  {
    title: "Case Report",
    description:
      "Presents a carefully documented clinical observation with appropriate background, follow-up, limitations, and discussion.",
  },
  {
    title: "Short Communication",
    description:
      "Reports concise research findings, preliminary observations, methodological developments, or focused scientific findings.",
  },
  {
    title: "Experimental Study",
    description:
      "Describes laboratory or experimental investigations involving medicinal plants, extracts, phytochemicals, microorganisms, or related scientific subjects.",
  },
  {
    title: "Perspective / Scholarly Discussion",
    description:
      "Discusses research directions, scientific concepts, historical developments, methodology, or academic issues relevant to the journal.",
  },
];

const manuscriptSections = [
  "Title Page",
  "Abstract",
  "Keywords",
  "Introduction",
  "Materials and Methods / Methodology",
  "Results",
  "Discussion",
  "Conclusion",
  "Acknowledgements, if applicable",
  "Conflict of Interest Statement",
  "Funding Statement",
  "References",
];

export default function AuthorGuidelinesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">For Authors</span>

          <h1>Author Guidelines</h1>

          <p>
            Guidance for preparing and submitting manuscripts to the
            International Journal of Electro-Homoeopathy &amp; Research (IJER).
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container content-layout">
          <article className="content-main">
            <section className="content-section">
              <span className="eyebrow">Before Submission</span>

              <h2>General Requirements</h2>

              <p>
                Manuscripts submitted to IJER should be original scholarly work
                and should fall within the journal&apos;s aims and scope.
              </p>

              <p>
                Authors are responsible for the accuracy of the information,
                references, data, interpretations, ethical declarations, and
                authorship details provided in their submission.
              </p>

              <p>
                Manuscripts should not be simultaneously submitted to another
                journal while under editorial consideration by IJER.
              </p>
            </section>

            <section className="content-section">
              <span className="eyebrow">Manuscript Categories</span>

              <h2>Types of Articles Accepted</h2>

              <div className="info-grid">
                {articleTypes.map((item) => (
                  <div className="info-card" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="content-section">
              <span className="eyebrow">Preparation</span>

              <h2>Manuscript Structure</h2>

              <p>
                The exact structure may vary according to the type of article,
                but original research manuscripts should generally include:
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "28px",
                }}
              >
                {manuscriptSections.map((section, index) => (
                  <div
                    key={section}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      minHeight: "62px",
                      padding: "14px 18px",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      background: "#ffffff",
                    }}
                  >
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        background: "var(--green-soft)",
                        color: "var(--green)",
                        fontSize: "12px",
                        fontWeight: 900,
                      }}
                    >
                      {index + 1}
                    </span>

                    <strong>{section}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="content-section">
              <span className="eyebrow">Formatting</span>

              <h2>Basic Formatting Requirements</h2>

              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  marginTop: "28px",
                }}
              >
                <Guideline
                  title="Language"
                  text="Manuscripts should be written in clear academic English."
                />

                <Guideline
                  title="File Format"
                  text="Manuscripts should preferably be submitted as Microsoft Word (.doc or .docx) files."
                />

                <Guideline
                  title="Title"
                  text="The title should be concise, informative, and accurately represent the study."
                />

                <Guideline
                  title="Abstract"
                  text="Provide a structured or unstructured abstract appropriate to the article type, clearly summarizing the objective, methods, major findings, and conclusion."
                />

                <Guideline
                  title="Keywords"
                  text="Provide approximately 3 to 8 relevant keywords that describe the main subjects of the manuscript."
                />

                <Guideline
                  title="Tables and Figures"
                  text="Tables and figures should be clearly numbered, titled, and referred to in the manuscript text."
                />
              </div>
            </section>

            <section className="content-section">
              <span className="eyebrow">Authorship</span>

              <h2>Author Information</h2>

              <p>
                Each author should provide their full name, qualifications,
                institutional affiliation, city, state or region, country, and
                email address where appropriate.
              </p>

              <p>
                One author should be identified as the corresponding author.
                ORCID identifiers may also be provided.
              </p>

              <p>
                All listed authors should have made a meaningful scholarly
                contribution to the submitted work.
              </p>
            </section>

            <section className="content-section">
              <span className="eyebrow">Research Ethics</span>

              <h2>Ethical Requirements</h2>

              <p>
                Research involving human participants, identifiable patient
                information, biological materials, animals, or other regulated
                research activities should include appropriate ethical
                approvals, permissions, or consent statements where applicable.
              </p>

              <p>
                Authors should not present unsupported therapeutic claims as
                established facts. The strength of conclusions should reflect
                the design and quality of the evidence presented.
              </p>
            </section>

            <section className="content-section">
              <span className="eyebrow">Clinical Material</span>

              <h2>Case Reports and Patient Information</h2>

              <p>
                Case reports should protect patient confidentiality. Personally
                identifying information should not be included unless necessary
                for scientific purposes and appropriately consented.
              </p>

              <p>
                Clinical observations should clearly describe the context,
                intervention, follow-up, outcome assessment, and limitations.
              </p>
            </section>

            <section className="content-section">
              <span className="eyebrow">References</span>

              <h2>Reference Style</h2>

              <p>
                Authors should use a consistent scientific reference format
                throughout the manuscript. References should correspond
                accurately to citations within the text.
              </p>

              <p>
                Journal articles should include relevant details such as author
                names, article title, journal title, year, volume, issue, pages,
                and DOI where available.
              </p>
            </section>

            <section className="content-section">
              <span className="eyebrow">Transparency</span>

              <h2>Conflict of Interest &amp; Funding</h2>

              <p>
                Authors should disclose financial, professional, institutional,
                or other relationships that could reasonably be perceived as
                influencing the submitted work.
              </p>

              <p>
                The source of funding or research support should also be
                declared. If no specific funding was received, this may be
                stated explicitly.
              </p>
            </section>

            <section className="content-section">
              <span className="eyebrow">Originality</span>

              <h2>Plagiarism &amp; Research Integrity</h2>

              <p>
                Manuscripts should represent the authors&apos; own scholarly
                work. Plagiarism, fabricated or falsified data, inappropriate
                manipulation of results, duplicate publication, and misleading
                authorship practices are not acceptable.
              </p>

              <p>
                Submitted manuscripts may be screened for text similarity and
                other publication-integrity concerns.
              </p>
            </section>

            <section className="content-section highlight-box">
              <span className="eyebrow">Ready to Submit?</span>

              <h2>Submit Your Manuscript to IJER</h2>

              <p>
                Before submission, authors should ensure that all required
                manuscript information, declarations, author details, and
                supporting files are ready.
              </p>

              <Link
                href="/submit-manuscript"
                className="primary-button"
                style={{
                  marginTop: "18px",
                }}
              >
                Submit Manuscript
              </Link>
            </section>
          </article>

          <aside className="content-sidebar">
            <div className="sidebar-card">
              <span className="eyebrow">Author Resources</span>

              <h3>Quick Links</h3>

              <Link href="/submit-manuscript">
                Submit Manuscript →
              </Link>

              <Link href="/aims-and-scope">
                Aims &amp; Scope →
              </Link>

              <Link href="/peer-review-policy">
                Peer Review Policy →
              </Link>

              <Link href="/publication-ethics">
                Publication Ethics →
              </Link>

              <Link href="/copyright-policy">
                Copyright Policy →
              </Link>
            </div>

            <div className="sidebar-card">
              <span className="eyebrow">Journal</span>

              <h3>IJER</h3>

              <p>
                International Journal of Electro-Homoeopathy &amp; Research
              </p>
            </div>

            <div className="sidebar-card">
              <span className="eyebrow">Important</span>

              <h3>Scientific Reporting</h3>

              <p>
                Conclusions should remain consistent with the strength and type
                of evidence presented in the manuscript.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Guideline({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: "24px",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        background: "#ffffff",
      }}
    >
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "18px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "var(--muted)",
          lineHeight: 1.8,
        }}
      >
        {text}
      </p>
    </div>
  );
}