"use client";

export default function ArticleStyles() {
  return (
    <style jsx global>{`
      .public-article-page {
        background: #f7faf8;
        min-height: 100vh;
      }

      .article-public-container {
        width: min(1100px, calc(100% - 44px));
        margin: 0 auto;
      }

      .article-public-hero {
        padding: 70px 0 55px;
        background: #0e503a;
        color: white;
      }

      .article-public-breadcrumb {
        margin-bottom: 28px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        color: #cce5da;
        font-size: 12px;
      }

      .article-public-breadcrumb a {
        color: #cce5da;
        text-decoration: none;
        font-weight: 700;
      }

      .article-public-breadcrumb a:hover {
        color: white;
      }

      .article-category-row {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-bottom: 20px;
      }

      .article-category-row span {
        padding: 7px 11px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: #e6f3ed;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .article-public-hero h1 {
        max-width: 950px;
        margin: 0;
        color: white;
        font-size: clamp(38px, 5vw, 60px);
        line-height: 1.12;
        letter-spacing: -0.035em;
      }

      .article-public-authors {
        margin: 25px 0 0;
        color: #d8ebe3;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.8;
        white-space: pre-line;
      }

      .article-public-layout {
        padding: 45px 0 85px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 300px;
        gap: 32px;
        align-items: start;
      }

      .article-main-column {
        display: grid;
        gap: 25px;
      }

      .article-public-card {
        padding: 38px;
        border: 1px solid #dce8e2;
        border-radius: 20px;
        background: white;
      }

      .article-public-card .section-label {
        display: block;
        margin-bottom: 10px;
        color: #176b4d;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .article-public-card h2 {
        margin: 0 0 20px;
        color: #17382f;
        font-size: 29px;
      }

      .article-public-card p {
        margin: 0;
        color: #53675e;
        font-size: 14px;
        line-height: 1.95;
      }

      .article-keywords {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
      }

      .article-keywords span {
        padding: 8px 11px;
        border-radius: 999px;
        background: #edf5f1;
        color: #176b4d;
        font-size: 11px;
        font-weight: 800;
      }

      .article-section-text {
        white-space: pre-line;
      }

      .article-sidebar {
        display: grid;
        gap: 20px;
        position: sticky;
        top: 25px;
      }

      .article-info-card {
        padding: 27px;
        border: 1px solid #dce8e2;
        border-radius: 18px;
        background: white;
      }

      .article-info-card h3 {
        margin: 0 0 20px;
        font-size: 20px;
      }

      .article-info-list {
        display: grid;
        gap: 17px;
      }

      .article-info-item {
        padding-bottom: 15px;
        border-bottom: 1px solid #e7eeea;
      }

      .article-info-item:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }

      .article-info-item span,
      .article-info-item strong {
        display: block;
      }

      .article-info-item span {
        margin-bottom: 5px;
        color: #82928a;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .article-info-item strong {
        color: #17382f;
        font-size: 12px;
        line-height: 1.6;
        overflow-wrap: anywhere;
      }

      .article-pdf-button {
        min-height: 49px;
        padding: 0 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background: #176b4d;
        color: white;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
        text-align: center;
      }

      .article-pdf-button:hover {
        background: #0e503a;
      }

      .article-citation-card {
        padding: 27px;
        border-radius: 18px;
        background: #0e503a;
        color: white;
      }

      .article-citation-card h3 {
        margin: 0 0 13px;
        color: white;
      }

      .article-citation-card p {
        margin: 0;
        color: #d9ebe4;
        font-size: 12px;
        line-height: 1.8;
      }

      @media (max-width: 900px) {
        .article-public-layout {
          grid-template-columns: 1fr;
        }

        .article-sidebar {
          position: static;
        }
      }

      @media (max-width: 600px) {
        .article-public-container {
          width: min(100% - 28px, 1100px);
        }

        .article-public-hero {
          padding: 45px 0;
        }

        .article-public-card {
          padding: 27px 21px;
        }

        .article-info-card,
        .article-citation-card {
          padding: 23px 20px;
        }
      }
    `}</style>
  );
}