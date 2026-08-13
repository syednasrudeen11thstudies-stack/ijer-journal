import Link from "next/link";

const articles = [
  {
    type: "Original Research",
    title:
      "Phytochemical Profiling of Selected Medicinal Plants Used in Electro-Homoeopathy",
    authors: "A. Researcher, B. Scholar, C. Investigator",
    pages: "01–10",
    abstract:
      "A laboratory-based investigation examining selected phytochemical constituents present in medicinal plants associated with Electro-Homoeopathic preparations.",
  },
  {
    type: "Review Article",
    title:
      "Current Perspectives on Plant-Derived Bioactive Compounds in Electro-Homoeopathy",
    authors: "D. Author, E. Scientist",
    pages: "11–20",
    abstract:
      "A scholarly review of published evidence concerning selected plant-derived compounds, their biological properties, and areas requiring further research.",
  },
  {
    type: "Experimental Study",
    title:
      "In-Vitro Evaluation of Selected Botanical Extracts Against Microbial Pathogens",
    authors: "F. Researcher, G. Scholar",
    pages: "21–30",
    abstract:
      "An experimental evaluation of botanical extracts using laboratory methods to investigate possible antimicrobial activity.",
  },
  {
    type: "Case Report",
    title:
      "Documentation and Scientific Reporting of Clinical Observations in Electro-Homoeopathy",
    authors: "H. Author, I. Researcher",
    pages: "31–37",
    abstract:
      "A structured case-report format illustrating the importance of documentation, follow-up, limitations, and responsible interpretation of clinical observations.",
  },
];

export default function CurrentIssuePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">Latest Publication</span>

          <h1>Current Issue</h1>

          <p>
            Read the latest scholarly articles published in the International
            Journal of Electro-Homoeopathy &amp; Research.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="grid gap-12 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside>
              <div className="sticky top-8 rounded-[24px] border border-[#dce8e2] bg-white p-8">
                <span className="eyebrow">Current Issue</span>

                <h2 className="mb-3 text-3xl font-bold text-[#15372f]">
                  Volume 1, Issue 1
                </h2>

                <p className="mb-8 text-[#61736c]">2026</p>

                <div className="mb-8 border-y border-[#dce8e2] py-6">
                  <div className="mb-5">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#61736c]">
                      Journal
                    </span>

                    <strong className="mt-1 block text-[#15372f]">
                      International Journal of Electro-Homoeopathy &amp;
                      Research
                    </strong>
                  </div>

                  <div className="mb-5">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#61736c]">
                      Abbreviation
                    </span>

                    <strong className="mt-1 block text-[#15372f]">IJER</strong>
                  </div>

                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#61736c]">
                      Access
                    </span>

                    <strong className="mt-1 block text-[#166747]">
                      Open Access
                    </strong>
                  </div>
                </div>

                <Link
                  href="/archives"
                  className="block rounded-xl border border-[#b7cec3] px-5 py-3 text-center font-bold text-[#0c4f37] transition hover:bg-[#edf6f1]"
                >
                  View All Issues
                </Link>
              </div>
            </aside>

            <div>
              <div className="mb-10">
                <span className="eyebrow">Volume 1 • Issue 1 • 2026</span>

                <h2 className="m-0 text-4xl font-bold tracking-tight text-[#15372f] md:text-5xl">
                  Articles in This Issue
                </h2>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#61736c]">
                  Browse original research, reviews, experimental studies, and
                  scholarly clinical documentation included in the current
                  issue.
                </p>
              </div>

              <div className="grid gap-6">
                {articles.map((article, index) => (
                  <article
                    key={article.title}
                    className="rounded-[22px] border border-[#dce8e2] bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg md:p-9"
                  >
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                      <span className="rounded-full bg-[#edf6f1] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#166747]">
                        {article.type}
                      </span>

                      <span className="text-sm text-[#61736c]">
                        Pages {article.pages}
                      </span>
                    </div>

                    <h3 className="max-w-4xl text-2xl font-bold leading-snug text-[#15372f]">
                      {article.title}
                    </h3>

                    <p className="mt-3 font-medium text-[#385247]">
                      {article.authors}
                    </p>

                    <p className="mt-5 max-w-4xl leading-8 text-[#61736c]">
                      {article.abstract}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3 border-t border-[#dce8e2] pt-6">
                      <Link
                        href={`/articles/article-${index + 1}`}
                        className="rounded-lg bg-[#166747] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0c4f37]"
                      >
                        View Article
                      </Link>

                      <Link
                        href={`/articles/article-${index + 1}`}
                        className="rounded-lg border border-[#b7cec3] px-5 py-3 text-sm font-bold text-[#0c4f37] transition hover:bg-[#edf6f1]"
                      >
                        Abstract
                      </Link>

                      <span className="rounded-lg bg-[#f7faf8] px-5 py-3 text-sm font-semibold text-[#61736c]">
                        PDF coming soon
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}