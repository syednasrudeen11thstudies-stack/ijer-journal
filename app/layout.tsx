import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "International Journal of Electro-Homoeopathy & Research | IJER",
    template:
      "%s | IJER",
  },

  description:
    "International Journal of Electro-Homoeopathy & Research (IJER) is an academic journal for scholarly research related to Electro-Homoeopathy, medicinal plants, phytochemistry, pharmacognosy, microbiology, clinical research, experimental studies and allied sciences.",

  applicationName:
    "International Journal of Electro-Homoeopathy & Research",

  keywords: [
    "International Journal of Electro-Homoeopathy and Research",
    "IJER",
    "Electro-Homoeopathy",
    "Electro-Homoeopathy research",
    "medicinal plants",
    "phytochemistry",
    "pharmacognosy",
    "microbiology",
    "antimicrobial research",
    "clinical research",
    "experimental research",
    "botanical research",
    "medical research journal",
  ],

  authors: [
    {
      name:
        "International Journal of Electro-Homoeopathy & Research",
    },
  ],

  creator:
    "International Journal of Electro-Homoeopathy & Research",

  publisher:
    "International Journal of Electro-Homoeopathy & Research",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",

    siteName:
      "International Journal of Electro-Homoeopathy & Research",

    title:
      "International Journal of Electro-Homoeopathy & Research | IJER",

    description:
      "Academic and scholarly research in Electro-Homoeopathy, medicinal plants, phytochemistry, pharmacognosy, microbiology, clinical research and allied sciences.",

    url: "/",
  },

  twitter: {
    card: "summary",

    title:
      "International Journal of Electro-Homoeopathy & Research | IJER",

    description:
      "Academic and scholarly research in Electro-Homoeopathy, medicinal plants, phytochemistry, pharmacognosy, microbiology and allied sciences.",
  },

  category: "Academic Journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}