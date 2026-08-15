"use client";

export default function ArchiveStyles() {
  return (
    <style jsx global>{`
      .archive-container {
        width: min(1150px, calc(100% - 44px));
        margin: 0 auto;
      }

      .archive-heading {
        margin-bottom: 35px;
      }

      .archive-heading h2 {
        margin: 0 0 10px;
        font-size: 34px;
      }

      .archive-heading p {
        margin: 0;
        color: var(--muted);
        line-height: 1.8;
      }

      .archive-list {
        display: grid;
        gap: 25px;
      }

      .archive-issue {
        padding: 34px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: white;
      }

      .archive-issue-top {
        display: flex;
        justify-content: space-between;
        gap: 30px;
        align-items: flex-start;
      }

      .archive-year {
        display: block;
        margin-bottom: 8px;
        color: var(--green);
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.08em;
      }

      .archive-issue h2 {
        margin: 0;
        font-size: 29px;
      }

      .archive-title {
        margin: 10px 0 0;
        color: var(--green-dark);
        font-weight: 800;
      }

      .archive-description {
        max-width: 750px;
        margin: 10px 0 0;
        color: var(--muted);
        line-height: 1.8;
      }

      .archive-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .archive-badges span {
        padding: 7px 10px;
        border-radius: 999px;
        background: var(--green-soft);
        color: var(--green);
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .archive-articles {
        margin-top: 27px;
        padding-top: 25px;
        display: grid;
        gap: 14px;
        border-top: 1px solid var(--border);
      }

      .archive-article {
        padding: 18px 20px;
        display: flex;
        justify-content: space-between;
        gap: 25px;
        align-items: center;
        border-radius: 12px;
        background: #f7faf8;
      }

      .archive-article h3 {
        margin: 0 0 6px;
        font-size: 17px;
        line-height: 1.45;
      }

      .archive-article h3 a {
        color: var(--green-dark);
        text-decoration: none;
      }

      .archive-article p {
        margin: 0;
        color: var(--muted);
        font-size: 12px;
        white-space: pre-line;
      }

      .archive-read {
        flex-shrink: 0;
        color: var(--green);
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .archive-empty {
        padding: 70px 30px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: white;
        text-align: center;
        color: var(--muted);
      }

      @media (max-width: 700px) {
        .archive-container {
          width: min(100% - 28px, 1150px);
        }

        .archive-issue {
          padding: 27px 21px;
        }

        .archive-issue-top,
        .archive-article {
          flex-direction: column;
        }

        .archive-article {
          align-items: flex-start;
        }
      }
    `}</style>
  );
}