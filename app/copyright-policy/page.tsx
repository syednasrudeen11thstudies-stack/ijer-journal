import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CopyrightPolicyPage() {
  const settings =
    await prisma.journalSettings.findFirst();

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">Journal Policy</span>
          <h1>Copyright Policy</h1>

          <p>
            Copyright, attribution and permitted use of material published
            by the International Journal of Electro-Homoeopathy &amp; Research.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="site-container narrow-content">
          <section className="content-section">
            <h2>Published Material</h2>

            <p>
              Copyright and reuse conditions for individual articles should
              be interpreted according to the copyright notice or licence
              associated with that publication.
            </p>
          </section>

          <section className="content-section">
            <h2>Attribution</h2>

            <p>
              Published research should be properly cited when reproduced,
              discussed, reviewed or incorporated into other scholarly work.
            </p>
          </section>

          <section className="content-section">
            <h2>Permissions</h2>

            <p>
              Uses outside the applicable publication licence may require
              permission from the relevant copyright holder or publisher.
            </p>
          </section>

          {settings?.copyrightText && (
            <section className="content-section highlight-box">
              <span className="eyebrow">
                Journal Copyright Notice
              </span>

              <h2>IJER Copyright</h2>

              <p>
                {settings.copyrightText}
              </p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}