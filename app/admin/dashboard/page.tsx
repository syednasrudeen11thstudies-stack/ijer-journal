"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";


type CurrentAdmin = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  active: boolean;
};
const management = [
  {
    title: "Manuscripts",
    description:
      "View manuscripts received from authors, review their details and manage their status.",
    href: "/admin/manuscripts",
    action: "Manage Manuscripts",
    icon: "M", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  },
  {
    title: "Articles",
    description:
      "Add approved research articles, authors, abstracts, keywords, references and PDF files.",
    href: "/admin/articles",
    action: "Manage Articles",
    icon: "A", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  },
  {
    title: "Issues & Volumes",
    description:
      "Create journal volumes and issues and assign approved articles for publication.",
    href: "/admin/issues",
    action: "Manage Issues",
    icon: "I", roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Editorial Board",
    description:
      "Add editors and advisory members, assign designations and control their display order.",
    href: "/admin/editorial-board",
    action: "Manage Board",
    icon: "E", roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    title: "Journal Settings",
    description:
      "Manage journal information, contact details, ISSN information and publication settings.",
    href: "/admin/settings",
    action: "Open Settings",
    icon: "S", roles: ["SUPER_ADMIN"],
  },
  {
    title: "Website",
    description:
      "Return to the public IJER website and review published journal content.",
    href: "/",
    action: "View Website",
    icon: "W", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  },
];

export default function AdminDashboardPage() {
  const [currentAdmin, setCurrentAdmin] =
    useState<CurrentAdmin | null>(null);

  const [stats, setStats] = useState([
    {
      value: "0",
      label: "Received Manuscripts",
      detail: "Awaiting your review",
    },
    {
      value: "0",
      label: "Published Articles",
      detail: "Across all issues",
    },
    {
      value: "0",
      label: "Journal Issues",
      detail: "Published volumes & issues",
    },
    {
      value: "0",
      label: "Editorial Members",
      detail: "Active board members",
    },
  ]);


  useEffect(() => {
    async function loadCurrentAdmin() {
      try {
        const response = await fetch(
          "/api/admin/auth/me",
          {
            cache: "no-store",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.admin
        ) {
          window.location.replace(
            "/admin/login",
          );

          return;
        }

        setCurrentAdmin(data.admin);
      } catch (error) {
        console.error(
          "Unable to load administrator:",
          error,
        );

        window.location.replace(
          "/admin/login",
        );
      }
    }

    loadCurrentAdmin();
  }, []);
  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch(
          "/api/admin/dashboard-stats",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          return;
        }

        setStats([
          {
            value: String(data.stats.receivedManuscripts ?? 0),
            label: "Received Manuscripts",
            detail: "Awaiting your review",
          },
          {
            value: String(data.stats.publishedArticles ?? 0),
            label: "Published Articles",
            detail: "Across all issues",
          },
          {
            value: String(data.stats.journalIssues ?? 0),
            label: "Journal Issues",
            detail: "Published volumes & issues",
          },
          {
            value: String(data.stats.editorialMembers ?? 0),
            label: "Editorial Members",
            detail: "Active board members",
          },
        ]);
      } catch (error) {
        console.error(
          "Unable to load dashboard statistics:",
          error,
        );
      }
    }

    loadStats();
  }, []);


  const visibleManagement =
    currentAdmin
      ? management.filter((item) =>
          item.roles.includes(
            currentAdmin.role,
          ),
        )
      : [];
  async function handleLogout() {
    try {
      const response = await fetch(
        "/api/admin/auth/logout",
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to logout.",
        );
      }

      window.location.replace(
        "/admin/login",
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );

      window.location.replace(
        "/admin/login",
      );
    }
  }
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-container dashboard-header-inner">
          <Link href="/admin/dashboard" className="dashboard-brand">
            <div className="dashboard-logo">
              <Image
                src="/logo.png"
                alt="IJER"
                width={90}
                height={90}
                priority
              />
            </div>

            <div>
              <strong>IJER Administration</strong>
              <span>Journal Management System</span>
            </div>
          </Link>

          <div className="dashboard-header-actions">
            <Link href="/" className="dashboard-website-link">
              View Journal
            </Link>

            <button
              type="button"
              className="dashboard-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="sidebar-title">Administration</div>

          <nav>
            <Link href="/admin/dashboard" className="active">
              Dashboard
            </Link>

            <Link href="/admin/manuscripts">
              Manuscripts
            </Link>

            <Link href="/admin/articles">
              Articles
            </Link>

            <Link href="/admin/issues">
              Issues &amp; Volumes
            </Link>

            <Link href="/admin/editorial-board">
              Editorial Board
            </Link>

            <Link href="/admin/settings">
              Journal Settings
            </Link>
          </nav>

          <div className="sidebar-bottom">
            <span>International Journal of</span>

            <strong>
              Electro-Homoeopathy &amp; Research
            </strong>
          </div>
        </aside>

        <section className="dashboard-content">
          <div className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">
                IJER Administration
              </span>

              <h1>Journal Dashboard</h1>

              <p>
                Manage manuscripts, approved publications, journal issues,
                editorial members and IJER website information from one place.
              </p>
            </div>

            <Link
              href="/admin/articles/new"
              className="dashboard-primary-button"
            >
              + Add Article
            </Link>
          </div>

          <section className="stats-grid">
            {stats.map((item) => (
              <article className="stat-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </article>
            ))}
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="dashboard-eyebrow">
                  Journal Management
                </span>

                <h2>Manage IJER</h2>
              </div>

              <p>Select an area below to manage journal content.</p>
            </div>

            <div className="management-grid">
              {visibleManagement.map((item) => (
                <article className="management-card" key={item.title}>
                  <div className="management-icon">
                    {item.icon}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <Link href={item.href}>
                    {item.action} →
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="dashboard-eyebrow">
                  Publication Workflow
                </span>

                <h2>Your Journal Process</h2>
              </div>
            </div>

            <div className="workflow">
              <WorkflowItem
                number="01"
                title="Receive"
                text="Author submits the manuscript to IJER."
              />

              <WorkflowArrow />

              <WorkflowItem
                number="02"
                title="Review"
                text="You examine the manuscript before accepting it."
              />

              <WorkflowArrow />

              <WorkflowItem
                number="03"
                title="Approve"
                text="Only approved manuscripts proceed to publication."
              />

              <WorkflowArrow />

              <WorkflowItem
                number="04"
                title="Publish"
                text="Upload the article and PDF into the appropriate journal issue."
              />
            </div>
          </section>

          <section className="dashboard-section">
            <div className="recent-panel">
              <div className="recent-header">
                <div>
                  <span className="dashboard-eyebrow">
                    Recent Activity
                  </span>

                  <h2>Latest Manuscripts</h2>
                </div>

                <Link href="/admin/manuscripts">
                  View All
                </Link>
              </div>

              <div className="empty-state">
                <div className="empty-icon">M</div>

                <h3>No manuscripts yet</h3>

                <p>
                  Manuscripts received through the journal submission system
                  will appear here for your review.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>

      <style jsx global>{`
        .dashboard-page {
          min-height: 100vh;
          background: #f5f9f7;
          color: #17382f;
        }

        .dashboard-container {
          width: min(1440px, calc(100% - 48px));
          margin: 0 auto;
        }

        .dashboard-header {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #ffffff;
          border-bottom: 1px solid #dce8e2;
        }

        .dashboard-header-inner {
          min-height: 94px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .dashboard-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          color: inherit;
          text-decoration: none;
        }

        .dashboard-logo {
          width: 68px;
          height: 68px;
          padding: 5px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #e0ebe5;
        }

        .dashboard-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .dashboard-brand strong,
        .dashboard-brand span {
          display: block;
        }

        .dashboard-brand strong {
          margin-bottom: 3px;
          font-size: 18px;
        }

        .dashboard-brand span {
          color: #72847c;
          font-size: 12px;
        }

        .dashboard-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dashboard-website-link,
        .dashboard-logout {
          padding: 11px 17px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        .dashboard-website-link {
          border: 1px solid #bed1c7;
          color: #176b4d;
          background: #ffffff;
        }

        .dashboard-logout {
          background: #176b4d;
          color: #ffffff;
        }

        .dashboard-layout {
          display: grid;
          grid-template-columns: 245px minmax(0, 1fr);
          gap: 50px;
          padding-top: 44px;
          padding-bottom: 90px;
        }

        .dashboard-sidebar {
          position: sticky;
          top: 138px;
          height: calc(100vh - 175px);
          padding: 26px 18px;
          display: flex;
          flex-direction: column;
          border: 1px solid #dce8e2;
          border-radius: 20px;
          background: #ffffff;
        }

        .sidebar-title {
          padding: 0 12px 16px;
          color: #8a9993;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .dashboard-sidebar nav {
          display: grid;
          gap: 5px;
        }

        .dashboard-sidebar nav a {
          padding: 13px 14px;
          border-radius: 9px;
          color: #50645b;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .dashboard-sidebar nav a:hover {
          background: #f1f7f4;
          color: #176b4d;
        }

        .dashboard-sidebar nav a.active {
          background: #e9f4ef;
          color: #176b4d;
        }

        .sidebar-bottom {
          margin-top: auto;
          padding: 18px 12px 4px;
          border-top: 1px solid #e5ede9;
        }

        .sidebar-bottom span,
        .sidebar-bottom strong {
          display: block;
        }

        .sidebar-bottom span {
          margin-bottom: 4px;
          color: #899991;
          font-size: 10px;
        }

        .sidebar-bottom strong {
          font-size: 11px;
          line-height: 1.5;
        }

        .dashboard-content {
          min-width: 0;
        }

        .dashboard-welcome {
          min-height: 210px;
          padding: 42px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(255, 255, 255, 0.2),
              transparent 35%
            ),
            #0e503a;
          color: #ffffff;
        }

        .dashboard-welcome > div {
          max-width: 720px;
        }

        .dashboard-eyebrow {
          display: block;
          margin-bottom: 10px;
          color: #27805e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dashboard-welcome .dashboard-eyebrow {
          color: #b8dfcf;
        }

        .dashboard-welcome h1 {
          margin: 0;
          color: #ffffff;
          font-size: clamp(36px, 5vw, 50px);
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .dashboard-welcome p {
          max-width: 680px;
          margin: 18px 0 0;
          color: #d9ebe4;
          font-size: 15px;
          line-height: 1.8;
        }

        .dashboard-primary-button {
          flex-shrink: 0;
          padding: 14px 20px;
          border-radius: 10px;
          background: #ffffff;
          color: #0e503a;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
        }

        .stats-grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .stat-card {
          padding: 24px;
          border: 1px solid #dce8e2;
          border-radius: 17px;
          background: #ffffff;
        }

        .stat-card span,
        .stat-card strong,
        .stat-card small {
          display: block;
        }

        .stat-card span {
          min-height: 38px;
          color: #65786f;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }

        .stat-card strong {
          margin: 10px 0 8px;
          font-size: 34px;
          color: #153c30;
        }

        .stat-card small {
          color: #91a098;
          font-size: 11px;
        }

        .dashboard-section {
          margin-top: 62px;
        }

        .section-heading {
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 30px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 30px;
          letter-spacing: -0.025em;
        }

        .section-heading > p {
          margin: 0;
          color: #74867e;
          font-size: 13px;
        }

        .management-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .management-card {
          min-height: 265px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          border: 1px solid #dce8e2;
          border-radius: 19px;
          background: #ffffff;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .management-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 45px rgba(31, 78, 60, 0.08);
        }

        .management-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 24px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #e9f4ef;
          color: #176b4d;
          font-weight: 900;
        }

        .management-card h3 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .management-card p {
          margin: 0 0 22px;
          color: #71827a;
          font-size: 13px;
          line-height: 1.75;
        }

        .management-card a {
          margin-top: auto;
          color: #176b4d;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .workflow {
          padding: 30px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 34px minmax(0, 1fr) 34px
            minmax(0, 1fr) 34px minmax(0, 1fr);
          align-items: center;
          border: 1px solid #dce8e2;
          border-radius: 20px;
          background: #ffffff;
        }

        .workflow-item {
          min-height: 145px;
          padding: 20px;
          border-radius: 14px;
          background: #f7faf8;
        }

        .workflow-number {
          display: block;
          margin-bottom: 15px;
          color: #25805e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .workflow-item h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .workflow-item p {
          margin: 0;
          color: #73857c;
          font-size: 12px;
          line-height: 1.65;
        }

        .workflow-arrow {
          text-align: center;
          color: #91aaa0;
          font-size: 18px;
          font-weight: 900;
        }

        .recent-panel {
          overflow: hidden;
          border: 1px solid #dce8e2;
          border-radius: 20px;
          background: #ffffff;
        }

        .recent-header {
          padding: 25px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          border-bottom: 1px solid #e2ebe6;
        }

        .recent-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .recent-header a {
          color: #176b4d;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .empty-state {
          padding: 65px 30px;
          text-align: center;
        }

        .empty-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 18px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #edf5f1;
          color: #176b4d;
          font-weight: 900;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .empty-state p {
          max-width: 480px;
          margin: 0 auto;
          color: #7a8b83;
          font-size: 13px;
          line-height: 1.7;
        }

        @media (max-width: 1150px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .management-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .workflow {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .workflow-arrow {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            position: static;
            height: auto;
          }

          .dashboard-sidebar nav {
            grid-template-columns: repeat(3, 1fr);
          }

          .sidebar-bottom {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .dashboard-container {
            width: min(100% - 28px, 1440px);
          }

          .dashboard-header-inner {
            min-height: 82px;
          }

          .dashboard-logo {
            width: 55px;
            height: 55px;
          }

          .dashboard-brand span {
            display: none;
          }

          .dashboard-header-actions {
            gap: 6px;
          }

          .dashboard-website-link {
            display: none;
          }

          .dashboard-layout {
            padding-top: 25px;
            gap: 25px;
          }

          .dashboard-sidebar nav {
            grid-template-columns: 1fr 1fr;
          }

          .dashboard-welcome {
            padding: 32px 25px;
            align-items: flex-start;
            flex-direction: column;
          }

          .stats-grid,
          .management-grid,
          .workflow {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

function WorkflowItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {


    return (
    <div className="workflow-item">
      <span className="workflow-number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function WorkflowArrow() {
  return <div className="workflow-arrow">→</div>;
}