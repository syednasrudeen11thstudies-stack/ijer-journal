import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const topics = [
  "Electro-Homoeopathy research",
  "Medicinal plant research",
  "Phytochemistry",
  "Pharmacognosy",
  "Botanical extract studies",
  "Experimental pharmacology",
  "Microbiology and antimicrobial studies",
  "Clinical and observational research",
  "Case reports",
  "Toxicology and safety studies",
  "Public health research",
  "Medical education",
  "Research methodology",
  "Historical and scholarly analysis",
];

export default async function AimsAndScopePage() {
  const settings = await prisma.journalSettings.findFirst();

  const aimsAndScope =
    settings?.aimsAndScope?.trim() ||
    `The journal aims to encourage systematic scientific investigation and scholarly communication concerning Electro-Homoeopathy and related medicinal plant sciences.

It provides a platform for original research, critical reviews, experimental studies, clinical observations, and interdisciplinary work that can contribute to a clearer scientific understanding of the subject.`;

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            Journal Information
          </span>

          <h1>Aims &amp; Scope</h1>

          <p>
            Defining the academic subjects, research disciplines,
            and types of scholarly work considered by the journal.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container narrow-content">
          <section className="content-section">
            <h2>Aim of the Journal</h2>

            {aimsAndScope
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
          </section>

          <section className="content-section">
            <h2>Scope</h2>

            <p>
              Manuscripts may address Electro-Homoeopathy directly
              or study related botanical, chemical,
              pharmacological, microbiological, clinical,
              educational, or historical questions.
            </p>

            <div className="scope-grid">
              {topics.map((topic) => (
                <div
                  className="scope-item"
                  key={topic}
                >
                  <span>✓</span>
                  <strong>{topic}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="content-section highlight-box">
            <span className="eyebrow">
              Important
            </span>

            <h2>
              Evidence-Focused Publication
            </h2>

            <p>
              Authors should accurately describe the strength and
              limitations of their evidence. Experimental,
              observational, theoretical, and clinical findings
              should not be presented as equivalent forms of
              evidence.
            </p>

            <p>
              Claims concerning safety or therapeutic effectiveness
              should be supported by appropriate scientific evidence
              and clearly qualified when evidence remains preliminary.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}