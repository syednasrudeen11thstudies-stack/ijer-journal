"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type JournalSettings = {
  journalName: string;
  abbreviation: string;
  issnPrint: string | null;
  issnOnline: string | null;
  publisherName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  websiteUrl: string | null;
  publicationFrequency: string | null;
  copyrightText: string | null;
};

const fallbackSettings: JournalSettings = {
  journalName:
    "International Journal of Electro-Homoeopathy & Research",
  abbreviation: "IJER",
  issnPrint: null,
  issnOnline: null,
  publisherName: null,
  email: null,
  phone: null,
  address: null,
  city: null,
  state: null,
  country: null,
  postalCode: null,
  websiteUrl: null,
  publicationFrequency: null,
  copyrightText: null,
};

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [settings, setSettings] =
    useState<JournalSettings>(fallbackSettings);

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    async function loadSettings() {
      try {
        const response = await fetch(
          "/api/journal-settings",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (
          response.ok &&
          data.success &&
          data.settings
        ) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error(
          "Unable to load journal settings:",
          error,
        );
      }
    }

    loadSettings();
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  const copyright =
    settings.copyrightText?.trim() ||
    `© 2026 ${settings.journalName} (${settings.abbreviation}). All rights reserved.`;

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <div className="site-container topbar-inner">
            <span>
              Academic • Peer Reviewed • Open Access
            </span>

            <div>
              <Link href="/admin/login">
                Admin Login
              </Link>
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
                alt={`${settings.journalName} logo`}
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
                {settings.journalName}
              </strong>

              <span>
                Research • Evidence • Scholarship
              </span>

              {(settings.issnPrint ||
                settings.issnOnline) && (
                <small
                  style={{
                    display: "block",
                    marginTop: "5px",
                    color: "var(--muted)",
                    fontSize: "11px",
                  }}
                >
                  {settings.issnPrint &&
                    `Print ISSN: ${settings.issnPrint}`}
                  {settings.issnPrint &&
                    settings.issnOnline &&
                    " • "}
                  {settings.issnOnline &&
                    `Online ISSN: ${settings.issnOnline}`}
                </small>
              )}
            </div>
          </Link>

          <Link
            href="/submit-manuscript"
            className="header-submit"
          >
            Submit Manuscript
          </Link>
        </div>

        <nav className="main-nav">
          <div className="site-container nav-inner">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/aims-and-scope">
              Aims &amp; Scope
            </Link>
            <Link href="/current-issue">
              Current Issue
            </Link>
            <Link href="/archives">
              Archives
            </Link>
            <Link href="/editorial-board">
              Editorial Board
            </Link>
            <Link href="/author-guidelines">
              For Authors
            </Link>
            <Link href="/contact">
              Contact
            </Link>
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
                alt={`${settings.journalName} logo`}
                width={500}
                height={500}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            <div>
              <strong>
                {settings.journalName}
              </strong>

              <p>
                An academic platform for scientific research,
                scholarly communication, evidence-focused
                publication and interdisciplinary studies
                related to Electro-Homoeopathy and medicinal
                plant sciences.
              </p>

              {settings.publisherName && (
                <p>
                  <strong>
                    Publisher:
                  </strong>{" "}
                  {settings.publisherName}
                </p>
              )}

              {settings.publicationFrequency && (
                <p>
                  <strong>
                    Publication Frequency:
                  </strong>{" "}
                  {settings.publicationFrequency}
                </p>
              )}
            </div>
          </div>

          <div>
            <h4>Journal</h4>
            <Link href="/about">About</Link>
            <Link href="/aims-and-scope">
              Aims &amp; Scope
            </Link>
            <Link href="/current-issue">
              Current Issue
            </Link>
            <Link href="/archives">
              Archives
            </Link>
            <Link href="/editorial-board">
              Editorial Board
            </Link>
          </div>

          <div>
            <h4>Authors</h4>
            <Link href="/author-guidelines">
              Author Guidelines
            </Link>
            <Link href="/submit-manuscript">
              Submit Manuscript
            </Link>
            <Link href="/peer-review-policy">
              Peer Review
            </Link>
            <Link href="/publication-ethics">
              Publication Ethics
            </Link>
          </div>

          <div>
            <h4>Contact</h4>

            {settings.email && (
              <a href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            )}

            {settings.phone && (
              <a href={`tel:${settings.phone}`}>
                {settings.phone}
              </a>
            )}

            <Link href="/contact">
              Contact Page
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="site-container">
            {copyright}
          </div>
        </div>
      </footer>
    </>
  );
}