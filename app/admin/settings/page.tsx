"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

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
  aimsAndScope: string | null;
  copyrightText: string | null;
};

export default function JournalSettingsPage() {
  const [settings, setSettings] =
    useState<JournalSettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(
          "/api/journal-settings",
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load journal settings.",
          );
        }

        setSettings(data.settings);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load journal settings.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const formData =
      new FormData(event.currentTarget);

    const payload = {
      journalName:
        String(formData.get("journalName") || ""),
      abbreviation:
        String(formData.get("abbreviation") || ""),
      issnPrint:
        String(formData.get("issnPrint") || ""),
      issnOnline:
        String(formData.get("issnOnline") || ""),
      publisherName:
        String(formData.get("publisherName") || ""),
      email:
        String(formData.get("email") || ""),
      phone:
        String(formData.get("phone") || ""),
      address:
        String(formData.get("address") || ""),
      city:
        String(formData.get("city") || ""),
      state:
        String(formData.get("state") || ""),
      country:
        String(formData.get("country") || ""),
      postalCode:
        String(formData.get("postalCode") || ""),
      websiteUrl:
        String(formData.get("websiteUrl") || ""),
      publicationFrequency:
        String(
          formData.get("publicationFrequency") || "",
        ),
      aimsAndScope:
        String(formData.get("aimsAndScope") || ""),
      copyrightText:
        String(
          formData.get("copyrightText") || "",
        ),
    };

    try {
      const response = await fetch(
        "/api/journal-settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to save journal settings.",
        );
      }

      setSettings(data.settings);
      setMessage("Journal settings saved successfully.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save journal settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 50 }}>
        Loading journal settings...
      </main>
    );
  }

  if (!settings) {
    return (
      <main style={{ padding: 50 }}>
        {error || "Unable to load settings."}
      </main>
    );
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        <div className="settings-top">
          <Link href="/admin/dashboard">
            ← Dashboard
          </Link>
        </div>

        <section className="settings-hero">
          <span>IJER Administration</span>
          <h1>Journal Settings</h1>
          <p>
            Manage journal identity, ISSN, publisher,
            contact information and publication details.
          </p>
        </section>

        {error && (
          <div className="settings-message settings-error">
            {error}
          </div>
        )}

        {message && (
          <div className="settings-message settings-success">
            ✓ {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Section title="Journal Identity">
            <Field label="Journal Name" full>
              <input
                name="journalName"
                defaultValue={settings.journalName}
                required
              />
            </Field>

            <Field label="Abbreviation">
              <input
                name="abbreviation"
                defaultValue={settings.abbreviation}
                required
              />
            </Field>

            <Field label="Publisher Name">
              <input
                name="publisherName"
                defaultValue={
                  settings.publisherName || ""
                }
              />
            </Field>

            <Field label="Print ISSN">
              <input
                name="issnPrint"
                defaultValue={
                  settings.issnPrint || ""
                }
              />
            </Field>

            <Field label="Online ISSN">
              <input
                name="issnOnline"
                defaultValue={
                  settings.issnOnline || ""
                }
              />
            </Field>

            <Field label="Publication Frequency">
              <input
                name="publicationFrequency"
                placeholder="Quarterly / Biannual / Annual"
                defaultValue={
                  settings.publicationFrequency || ""
                }
              />
            </Field>

            <Field label="Website URL">
              <input
                name="websiteUrl"
                defaultValue={
                  settings.websiteUrl || ""
                }
              />
            </Field>
          </Section>

          <Section title="Contact Information">
            <Field label="Email">
              <input
                name="email"
                type="email"
                defaultValue={settings.email || ""}
              />
            </Field>

            <Field label="Phone">
              <input
                name="phone"
                defaultValue={settings.phone || ""}
              />
            </Field>

            <Field label="Address" full>
              <textarea
                name="address"
                defaultValue={settings.address || ""}
              />
            </Field>

            <Field label="City">
              <input
                name="city"
                defaultValue={settings.city || ""}
              />
            </Field>

            <Field label="State">
              <input
                name="state"
                defaultValue={settings.state || ""}
              />
            </Field>

            <Field label="Country">
              <input
                name="country"
                defaultValue={settings.country || ""}
              />
            </Field>

            <Field label="Postal Code">
              <input
                name="postalCode"
                defaultValue={
                  settings.postalCode || ""
                }
              />
            </Field>
          </Section>

          <Section title="Journal Content">
            <Field label="Aims & Scope" full>
              <textarea
                name="aimsAndScope"
                defaultValue={
                  settings.aimsAndScope || ""
                }
              />
            </Field>

            <Field label="Copyright Text" full>
              <textarea
                name="copyrightText"
                defaultValue={
                  settings.copyrightText || ""
                }
              />
            </Field>
          </Section>

          <button
            type="submit"
            className="save-settings-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Journal Settings"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .settings-page {
          min-height: 100vh;
          padding: 40px 0 90px;
          background: #f5f9f7;
          color: #17382f;
        }

        .settings-container {
          width: min(1050px, calc(100% - 44px));
          margin: 0 auto;
        }

        .settings-top {
          margin-bottom: 22px;
        }

        .settings-top a {
          color: #176b4d;
          font-weight: 800;
          text-decoration: none;
        }

        .settings-hero {
          padding: 42px;
          border-radius: 22px;
          background: #0e503a;
          color: white;
        }

        .settings-hero span {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .settings-hero h1 {
          margin: 8px 0;
          color: white;
          font-size: 45px;
        }

        .settings-hero p {
          margin: 0;
          color: #d8ebe3;
        }

        .settings-card {
          margin-top: 28px;
          padding: 32px;
          border: 1px solid #dce8e2;
          border-radius: 18px;
          background: white;
        }

        .settings-card h2 {
          margin: 0 0 25px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e4ece8;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .settings-field.full {
          grid-column: 1 / -1;
        }

        .settings-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
          font-weight: 800;
        }

        .settings-field input,
        .settings-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #cadbd3;
          border-radius: 9px;
          font: inherit;
        }

        .settings-field textarea {
          min-height: 140px;
          resize: vertical;
        }

        .save-settings-button {
          width: 100%;
          min-height: 55px;
          margin-top: 28px;
          border: 0;
          border-radius: 10px;
          background: #176b4d;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .settings-message {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
        }

        .settings-error {
          background: #fff2f1;
          color: #a23e38;
        }

        .settings-success {
          background: #eaf6ef;
          color: #176b4d;
        }

        @media (max-width: 700px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-field.full {
            grid-column: auto;
          }
        }
      `}</style>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-card">
      <h2>{title}</h2>
      <div className="settings-grid">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  full = false,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        full
          ? "settings-field full"
          : "settings-field"
      }
    >
      <label>{label}</label>
      {children}
    </div>
  );
}