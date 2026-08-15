import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings =
    await prisma.journalSettings.findFirst();

  const address = [
    settings?.address,
    settings?.city,
    settings?.state,
    settings?.postalCode,
    settings?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            Journal Contact
          </span>

          <h1>Contact IJER</h1>

          <p>
            Contact the editorial office of the International
            Journal of Electro-Homoeopathy &amp; Research.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container narrow-content">
          <section className="content-section">
            <h2>Editorial Office</h2>

            {settings?.publisherName && (
              <p>
                <strong>Publisher:</strong>{" "}
                {settings.publisherName}
              </p>
            )}

            {settings?.email && (
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </p>
            )}

            {settings?.phone && (
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${settings.phone}`}>
                  {settings.phone}
                </a>
              </p>
            )}

            {address && (
              <p>
                <strong>Address:</strong>{" "}
                {address}
              </p>
            )}

            {settings?.websiteUrl && (
              <p>
                <strong>Website:</strong>{" "}
                {settings.websiteUrl}
              </p>
            )}
          </section>

          <section className="content-section highlight-box">
            <span className="eyebrow">
              Correspondence
            </span>

            <h2>
              Manuscript & Editorial Enquiries
            </h2>

            <p>
              Authors should include their manuscript reference
              number when contacting the editorial office about
              an existing submission.
            </p>

            <p>
              General journal, publication, editorial-board and
              policy enquiries may also be directed to the
              journal contact email listed above.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}