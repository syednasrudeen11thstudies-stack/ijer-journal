"use client";

export default function CurrentIssueStyles() {
  return (
    <style jsx global>{`
      .issue-header-card {
        padding: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 250px;
        gap: 50px;
        align-items: center;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: #ffffff;
      }

      .issue-header-card h2 {
        margin: 0;
        font-size: 38px;
      }

      .issue-year {
        margin: 8px 0 20px;
        color: var(--green);
        font-size: 18px;
        font-weight: 900;
      }

      .issue-header-card h3 {
        margin: 0 0 12px;
        font-size: 21px;
      }

      .issue-description {
        max-width: 720px;
        margin: 0;
        color: var(--muted);
        line-height: 1.8;
      }

      .issue-meta-box {
        padding: 25px;
        display: grid;
        gap: 7px;
        border-radius: 17px;
        background: var(--green-soft);
      }

      .issue-meta-box span {
        margin-top: 8px;
        color: var(--muted);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .issue-meta-box strong {
        color: var(--green-dark);
        line-height: 1.5;
      }

      .articles-heading {
        margin: 65px 0 25px;
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 30px;
      }

      .articles-heading h2 {
        margin: 0;
        font-size: 32px;
      }

      .articles-heading > a {
        color: var(--green);
        font-size: 13px;
        font-weight: 900;
        text-decoration: none;
      }

      .article-list {
        display: grid;
        gap: 20px;
      }

      .article-card {
        padding: 30px;
        display: grid;
        grid-template-columns: 55px minmax(0, 1fr);
        gap: 25px;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: #ffffff;
      }

      .article-number {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: var(--green-soft);
        color: var(--green);
        font-size: 12px;
        font-weight: 900;
      }

      .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .article-meta span {
        padding: 6px 9px;
        border-radius: 999px;
        background: #f2f7f4;
        color: var(--green-dark);
        font-size: 10px;
        font-weight: 800;
      }

      .article-card h3 {
        margin: 0;
        font-size: 23px;
        line-height: 1.45;
      }

      .article-card h3 a {
        color: inherit;
        text-decoration: none;
      }

      .article-card h3 a:hover {
        color: var(--green);
      }

      .article-authors {
        margin: 10px 0 0;
        color: var(--green);
        font-size: 13px;
        font-weight: 800;
        white-space: pre-line;
      }

      .article-abstract {
        margin: 18px 0 0;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.85;
      }

      .article-footer {
        margin-top: 22px;
        padding-top: 18px;
        display: flex;
        justify-content: space-between;
        gap: 25px;
        border-top: 1px solid var(--border);
      }

      .article-footer > div {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        color: #7c8d85;
        font-size: 11px;
      }

      .read-article {
        flex-shrink: 0;
        color: var(--green);
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .empty-current-issue,
      .empty-articles {
        padding: 65px 30px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: #ffffff;
        text-align: center;
      }

      .empty-current-issue h2 {
        margin: 0 0 10px;
      }

      .empty-current-issue p,
      .empty-articles {
        color: var(--muted);
      }

      @media (max-width: 800px) {
        .issue-header-card {
          grid-template-columns: 1fr;
        }

        .issue-meta-box {
          max-width: 400px;
        }

        .article-footer {
          align-items: flex-start;
          flex-direction: column;
        }
      }

      @media (max-width: 600px) {
        .issue-header-card {
          padding: 28px 22px;
        }

        .article-card {
          padding: 23px 20px;
          grid-template-columns: 1fr;
        }

        .article-number {
          width: 42px;
          height: 42px;
        }

        .articles-heading {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  );
}
