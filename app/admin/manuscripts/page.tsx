"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Manuscript = {
  id: string;
  referenceNumber: string;
  title: string;
  articleType: string;
  subjectArea: string;
  correspondingAuthor: string;
  email: string;
  submittedAt: string;
  status: string;
};

export default function AdminManuscriptsPage() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadManuscripts() {
      try {
        const response = await fetch("/api/manuscripts", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load manuscripts.",
          );
        }

        setManuscripts(data.manuscripts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load manuscripts.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadManuscripts();
  }, []);

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return (
    <main className="admin-manuscript-page">
      <div className="admin-manuscript-container">
        <div className="admin-top">
          <div>
            <span className="admin-eyebrow">
              IJER Administration
            </span>

            <h1>Submitted Manuscripts</h1>

            <p>
              Review manuscripts submitted to the International Journal of
              Electro-Homoeopathy &amp; Research.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="dashboard-link"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="summary-grid">
          <SummaryCard
            label="Total Manuscripts"
            value={manuscripts.length}
          />

          <SummaryCard
            label="Received"
            value={
              manuscripts.filter(
                (item) => item.status === "RECEIVED",
              ).length
            }
          />

          <SummaryCard
            label="Under Review"
            value={
              manuscripts.filter(
                (item) => item.status === "UNDER_REVIEW",
              ).length
            }
          />

          <SummaryCard
            label="Accepted"
            value={
              manuscripts.filter(
                (item) => item.status === "ACCEPTED",
              ).length
            }
          />

          <SummaryCard
            label="Rejected"
            value={
              manuscripts.filter(
                (item) => item.status === "REJECTED",
              ).length
            }
          />
        </div>

        <section className="manuscript-panel">
          <div className="panel-heading">
            <div>
              <span className="admin-eyebrow">
                Submission Inbox
              </span>

              <h2>Manuscripts</h2>
            </div>
          </div>

          {loading && (
            <div className="state-box">
              <h3>Loading manuscripts...</h3>
            </div>
          )}

          {!loading && error && (
            <div className="state-box error-box">
              <h3>Unable to load manuscripts</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            manuscripts.length === 0 && (
              <div className="state-box">
                <div className="state-icon">M</div>

                <h3>No manuscripts received yet</h3>

                <p>
                  Manuscripts submitted through the public IJER submission
                  form will automatically appear here.
                </p>

                <Link
                  href="/submit-manuscript"
                  className="submit-test-link"
                >
                  Open Submission Form
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            manuscripts.length > 0 && (
              <div className="table-wrapper">
                <table className="manuscript-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Manuscript</th>
                      <th>Author</th>
                      <th>Type</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {manuscripts.map((manuscript) => (
                      <tr key={manuscript.id}>
                        <td>
                          <strong className="reference">
                            {manuscript.referenceNumber}
                          </strong>
                        </td>

                        <td>
                          <strong className="title">
                            {manuscript.title}
                          </strong>

                          <span className="subject">
                            {manuscript.subjectArea}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {manuscript.correspondingAuthor}
                          </strong>

                          <span className="author-email">
                            {manuscript.email}
                          </span>
                        </td>

                        <td>
                          {manuscript.articleType}
                        </td>

                        <td>
                          {new Date(
                            manuscript.submittedAt,
                          ).toLocaleDateString()}
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${manuscript.status.toLowerCase()}`}
                          >
                            {formatStatus(manuscript.status)}
                          </span>
                        </td>

                        <td>
                          <Link
                            href={`/admin/manuscripts/${manuscript.id}`}
                            className="view-button"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </div>

      <style jsx global>{`
        .admin-manuscript-page {
          min-height: 100vh;
          padding: 55px 0 90px;
          background: #f5f9f7;
          color: #17382f;
        }

        .admin-manuscript-container {
          width: min(1400px, calc(100% - 48px));
          margin: 0 auto;
        }

        .admin-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 35px;
        }

        .admin-eyebrow {
          display: block;
          margin-bottom: 8px;
          color: #176b4d;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .admin-top h1 {
          margin: 0;
          font-size: 44px;
          letter-spacing: -0.035em;
        }

        .admin-top p {
          max-width: 700px;
          margin: 14px 0 0;
          color: #71827a;
        }

        .dashboard-link {
          padding: 12px 18px;
          border: 1px solid #bfd2c8;
          border-radius: 10px;
          background: white;
          color: #176b4d;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 45px;
        }

        .summary-card {
          padding: 22px;
          border: 1px solid #dce8e2;
          border-radius: 16px;
          background: white;
        }

        .summary-card span,
        .summary-card strong {
          display: block;
        }

        .summary-card span {
          color: #71827a;
          font-size: 12px;
          font-weight: 700;
        }

        .summary-card strong {
          margin-top: 10px;
          font-size: 32px;
        }

        .manuscript-panel {
          overflow: hidden;
          border: 1px solid #dce8e2;
          border-radius: 22px;
          background: white;
        }

        .panel-heading {
          padding: 28px 30px;
          border-bottom: 1px solid #e2ebe6;
        }

        .panel-heading h2 {
          margin: 0;
          font-size: 28px;
        }

        .state-box {
          padding: 80px 30px;
          text-align: center;
        }

        .state-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eaf4ef;
          color: #176b4d;
          font-weight: 900;
        }

        .state-box h3 {
          margin: 0 0 10px;
          font-size: 21px;
        }

        .state-box p {
          max-width: 550px;
          margin: 0 auto 24px;
          color: #74867e;
          line-height: 1.7;
        }

        .error-box {
          color: #9d3d37;
        }

        .submit-test-link {
          display: inline-flex;
          padding: 12px 18px;
          border-radius: 9px;
          background: #176b4d;
          color: white;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .manuscript-table {
          width: 100%;
          min-width: 1150px;
          border-collapse: collapse;
        }

        .manuscript-table th {
          padding: 15px 18px;
          background: #f7faf8;
          border-bottom: 1px solid #e2ebe6;
          color: #71827a;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: left;
          text-transform: uppercase;
        }

        .manuscript-table td {
          padding: 20px 18px;
          border-bottom: 1px solid #edf2ef;
          color: #53675e;
          font-size: 12px;
          vertical-align: top;
        }

        .manuscript-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .reference {
          color: #176b4d;
          white-space: nowrap;
        }

        .title {
          display: block;
          max-width: 330px;
          margin-bottom: 5px;
          color: #183c31;
          font-size: 13px;
          line-height: 1.5;
        }

        .subject,
        .author-email {
          display: block;
          margin-top: 4px;
          color: #82928b;
          font-size: 11px;
        }

        .status-badge {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 999px;
          background: #edf5f1;
          color: #176b4d;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .status-rejected {
          background: #fff0ef;
          color: #a23e38;
        }

        .status-accepted {
          background: #e7f5ed;
          color: #157347;
        }

        .status-under_review,
        .status-under-review {
          background: #fff8e8;
          color: #8a6410;
        }

        .view-button {
          display: inline-flex;
          padding: 9px 13px;
          border-radius: 8px;
          background: #176b4d;
          color: white;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-top {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .admin-manuscript-container {
            width: min(100% - 28px, 1400px);
          }

          .admin-top h1 {
            font-size: 36px;
          }

          .summary-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}