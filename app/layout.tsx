import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "International Journal of Electro-Homoeopathy & Research",
    template: "%s | International Journal of Electro-Homoeopathy & Research",
  },

  description:
    "International Journal of Electro-Homoeopathy & Research (IJER) is an academic journal dedicated to Electro-Homoeopathy research, medicinal plants, phytochemistry, pharmacognosy, clinical research, and experimental studies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="topbar">
            <div className="site-container topbar-inner">
              <span>Academic • Peer Reviewed • Open Access</span>

              <div>
                <Link href="/admin/login">Admin Login</Link>
              </div>
            </div>
          </div>

          <div className="site-container brand-row">
            <Link
              href="/"
              className="brand"
              style={{
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "18px",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="International Journal of Electro-Homoeopathy & Research logo"
                  width={500}
                  height={500}
                  priority
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>

              <div>
                <strong>
                  International Journal of Electro-Homoeopathy &amp; Research
                </strong>

                <span>Research • Evidence • Scholarship</span>
              </div>
            </Link>

            <Link href="/submit-manuscript" className="header-submit">
              Submit Manuscript
            </Link>
          </div>

          <nav className="main-nav">
            <div className="site-container nav-inner">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/aims-and-scope">Aims &amp; Scope</Link>
              <Link href="/current-issue">Current Issue</Link>
              <Link href="/archives">Archives</Link>
              <Link href="/editorial-board">Editorial Board</Link>
              <Link href="/author-guidelines">For Authors</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </nav>
        </header>

        {children}

        <footer className="site-footer">
          <div className="site-container footer-grid">
            <div
              className="footer-brand"
              style={{
                alignItems: "flex-start",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: "16px",
                  background: "#ffffff",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="International Journal of Electro-Homoeopathy & Research logo"
                  width={500}
                  height={500}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>

              <div>
                <strong>
                  International Journal of Electro-Homoeopathy &amp; Research
                </strong>

                <p>
                  An academic platform for scientific research, scholarly
                  communication, evidence-focused publication, and
                  interdisciplinary studies related to Electro-Homoeopathy and
                  medicinal plant sciences.
                </p>
              </div>
            </div>

            <div>
              <h4>Journal</h4>
              <Link href="/about">About</Link>
              <Link href="/aims-and-scope">Aims &amp; Scope</Link>
              <Link href="/current-issue">Current Issue</Link>
              <Link href="/archives">Archives</Link>
              <Link href="/editorial-board">Editorial Board</Link>
            </div>

            <div>
              <h4>Authors</h4>
              <Link href="/author-guidelines">Author Guidelines</Link>
              <Link href="/submit-manuscript">Submit Manuscript</Link>
              <Link href="/peer-review-policy">Peer Review</Link>
              <Link href="/publication-ethics">Publication Ethics</Link>
            </div>

            <div>
              <h4>Policies</h4>
              <Link href="/open-access-policy">Open Access</Link>
              <Link href="/copyright-policy">Copyright</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="site-container">
              © 2026 International Journal of Electro-Homoeopathy &amp;
              Research (IJER). All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}