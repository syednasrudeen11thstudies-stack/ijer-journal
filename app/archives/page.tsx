import Link from "next/link";

const issues = [
  {
    volume: "Volume 1",
    issue: "Issue 1",
    year: "2026",
    articles: 4,
    status: "Current Issue",
  },
];

export default function ArchivesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">Journal Archive</span>

          <h1>Issues &amp; Archives</h1>

          <p>
            Browse published volumes and issues of the International Journal of
            Electro-Homoeopathy &amp; Research.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Browse Publications</span>

              <h2 className="m-0 text-4xl font-bold tracking-tight text-[#15372f] md:text-5xl">
                Journal Archive
              </h2>
            </div>

            <p className="max-w-xl text-[#61736c]">
              New issues will automatically appear here as they are published,
              creating a permanent scholarly archive of IJER publications.
            </p>
          </div>

          <div className="mb-10 flex items-center gap-4 border-b border-[#dce8e2] pb-5">
            <span className="text-sm font-extrabold uppercase tracking-widest text-[#166747]">
              2026
            </span>

            <div className="h-px flex-1 bg-[#dce8e2]" />
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            {issues.map((item) => (
              <article
                key={`${item.volume}-${item.issue}`}
                className="rounded-[24px] border border-[#dce8e2] bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg md:p-10"
              >
                <div className="mb-7 flex items-start justify-between gap-5">
                  <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[#0c4f37] text-center text-sm font-bold leading-tight text-white">
                    IJER
                  </div>

                  <span className="rounded-full bg-[#edf6f1] px-4 py-2 text-xs font-bold text-[#166747]">
                    {item.status}
                  </span>
                </div>

                <span className="text-sm font-bold uppercase tracking-wider text-[#166747]">
                  {item.year}
                </span>

                <h2 className="mt-3 text-3xl font-bold text-[#15372f]">
                  {item.volume}, {item.issue}
                </h2>

                <p className="mt-4 text-[#61736c]">
                  {item.articles} published articles
                </p>

                <div className="mt-8 border-t border-[#dce8e2] pt-6">
                  <Link
                    href="/current-issue"
                    className="font-extrabold text-[#166747]"
                  >
                    View Issue →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-[24px] border border-[#dce8e2] bg-[#f7faf8] p-8 md:p-10">
            <span className="eyebrow">Archive Growth</span>

            <h2 className="m-0 text-3xl font-bold text-[#15372f]">
              Future Volumes &amp; Issues
            </h2>

            <p className="mt-4 max-w-3xl leading-8 text-[#61736c]">
              As IJER publishes additional issues, each volume will remain
              permanently available through this archive with its articles,
              authors, abstracts, publication details, and downloadable files.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}