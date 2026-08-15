import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  const staticPages = [
    "",
    "/about",
    "/aims-and-scope",
    "/current-issue",
    "/archives",
    "/editorial-board",
    "/author-guidelines",
    "/submit-manuscript",
    "/peer-review-policy",
    "/publication-ethics",
    "/open-access-policy",
    "/copyright-policy",
    "/contact",
  ];

  const staticEntries: MetadataRoute.Sitemap =
    staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency:
        path === "" || path === "/current-issue"
          ? "weekly"
          : "monthly",
      priority:
        path === ""
          ? 1
          : path === "/current-issue"
            ? 0.9
            : 0.7,
    }));

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const articleEntries: MetadataRoute.Sitemap =
    articles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    ...staticEntries,
    ...articleEntries,
  ];
}