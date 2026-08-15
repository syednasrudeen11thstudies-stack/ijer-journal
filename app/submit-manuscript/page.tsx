"use client";

import { FormEvent, useState } from "react";
import { upload } from "@vercel/blob/client";
import Link from "next/link";

const articleTypes = [
  "Original Research Article",
  "Review Article",
  "Case Report",
  "Short Communication",
  "Experimental Study",
  "Perspective / Scholarly Discussion",
];

const subjectAreas = [
  "Electro-Homoeopathy Research",
  "Medicinal Plants",
  "Phytochemistry",
  "Pharmacognosy",
  "Clinical Research",
  "Experimental Research",
  "Microbiology",
  "Antimicrobial Research",
  "Toxicology & Safety",
  "Public Health",
  "Research Methodology",
  "Medical Education",
  "Other",
];

type SubmissionResult = {
  referenceNumber: string;
};

export default function SubmitManuscriptPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!manuscriptFile) {
      setError("Please select your manuscript file before submitting.");
      return;
    }

    const selectedManuscriptFile: File = manuscriptFile;

    if (selectedManuscriptFile.size > 20 * 1024 * 1024) {
      setError("Manuscript file must be 20 MB or smaller.");
      return;
    }

    setSubmitting(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    let manuscriptFileUrl = "";

    try {
      const uploadedFile = await upload(
        `manuscripts/${Date.now()}-${selectedManuscriptFile.name}`,
        selectedManuscriptFile,
        {
          access: "private",
          handleUploadUrl: "/api/manuscripts/upload",
        },
      );

      manuscriptFileUrl = uploadedFile.url;
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload manuscript file.",
      );

      setSubmitting(false);
      return;
    }

    const payload = {
      manuscriptFileUrl,
      title: String(formData.get("title") || ""),
      articleType: String(formData.get("articleType") || ""),
      subjectArea: String(formData.get("subjectArea") || ""),

      abstractText: String(formData.get("abstractText") || ""),
      keywords: String(formData.get("keywords") || ""),

      correspondingAuthor: String(
        formData.get("correspondingAuthor") || "",
      ),

      qualification: String(
        formData.get("qualification") || "",
      ),

      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),

      department: String(formData.get("department") || ""),
      institution: String(formData.get("institution") || ""),

      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      country: String(formData.get("country") || ""),

      orcid: String(formData.get("orcid") || ""),

      coAuthors: String(formData.get("coAuthors") || ""),

      originalWorkConfirmed:
        formData.get("originalWorkConfirmed") === "on",

      notSubmittedElsewhere:
        formData.get("notSubmittedElsewhere") === "on",

      authorsApproved:
        formData.get("authorsApproved") === "on",

      conflictsDeclared:
        formData.get("conflictsDeclared") === "on",

      ethicsConfirmed:
        formData.get("ethicsConfirmed") === "on",

      journalPoliciesConfirmed:
        formData.get("journalPoliciesConfirmed") === "on",
    };

    try {
      const response = await fetch("/api/manuscripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit manuscript.",
        );
      }

      setResult({
        referenceNumber: data.manuscript.referenceNumber,
      });

      form.reset();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submissionError) {
      console.error(submissionError);

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit manuscript.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main>
        <section className="page-hero">
          <div className="site-container">
            <span className="eyebrow">
              Submission Received
            </span>

            <h1>Manuscript Submitted</h1>

            <p>
              Your manuscript information has been successfully
              submitted to the International Journal of
              Electro-Homoeopathy &amp; Research.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="submission-success-container">
            <div className="submission-success-card">
              <div className="success-icon">
                ✓
              </div>

              <span className="eyebrow">
                IJER Submission
              </span>

              <h2>Submission Successful</h2>

              <p>
                Please keep your manuscript reference number
                for future correspondence with the journal.
              </p>

              <div className="reference-box">
                <span>Manuscript Reference Number</span>

                <strong>
                  {result.referenceNumber}
                </strong>
              </div>

              <div className="success-notice">
                <strong>What happens next?</strong>

                <p>
                  Your submission will appear in the IJER
                  administration system for editorial review.
                  Submission does not automatically mean that
                  the manuscript has been accepted for
                  publication.
                </p>
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={() => setResult(null)}
              >
                Submit Another Manuscript
              </button>

              <Link
                href="/"
                className="success-home-link"
              >
                Return to Journal Website
              </Link>
            </div>
          </div>
        </section>

        <SubmissionStyles />
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero">
        <div className="site-container">
          <span className="eyebrow">
            For Authors
          </span>

          <h1>Submit Manuscript</h1>

          <p>
            Submit your scholarly work for editorial
            consideration by the International Journal of
            Electro-Homoeopathy &amp; Research (IJER).
          </p>
        </div>
      </section>

      <section className="section">
        <div className="submission-container">
          <div className="submission-intro">
            <span className="eyebrow">
              Before Submission
            </span>

            <h2>
              Please review the author requirements
            </h2>

            <p>
              Ensure that all author details, declarations,
              manuscript information, ethical requirements
              and supporting documents are ready before
              submission.
            </p>

            <Link
              href="/author-guidelines"
              className="text-link"
            >
              Read Author Guidelines →
            </Link>
          </div>

          {error && (
            <div className="submission-error">
              <strong>
                Submission could not be completed
              </strong>

              <span>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormSection
              number="01"
              title="Article Information"
              description="Provide the main information about the manuscript."
            >
              <Field
                label="Manuscript Title"
                required
                full
              >
                <input
                  className="submission-input"
                  name="title"
                  type="text"
                  required
                  placeholder="Enter the complete manuscript title"
                />
              </Field>

              <Field
                label="Article Type"
                required
              >
                <select
                  className="submission-input"
                  name="articleType"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select article type
                  </option>

                  {articleTypes.map((type) => (
                    <option
                      value={type}
                      key={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Primary Subject Area"
                required
              >
                <select
                  className="submission-input"
                  name="subjectArea"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select subject area
                  </option>

                  {subjectAreas.map((area) => (
                    <option
                      value={area}
                      key={area}
                    >
                      {area}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Abstract"
                required
                full
              >
                <textarea
                  className="submission-input submission-textarea"
                  name="abstractText"
                  required
                  placeholder="Enter the manuscript abstract"
                />
              </Field>

              <Field
                label="Keywords"
                required
                full
              >
                <input
                  className="submission-input"
                  name="keywords"
                  type="text"
                  required
                  placeholder="Example: Electro-Homoeopathy, phytochemistry, medicinal plants"
                />

                <small>
                  Separate keywords using commas.
                </small>
              </Field>
            </FormSection>

            <FormSection
              number="02"
              title="Corresponding Author"
              description="Enter the details of the author responsible for communication with IJER."
            >
              <Field
                label="Full Name"
                required
              >
                <input
                  className="submission-input"
                  name="correspondingAuthor"
                  type="text"
                  required
                  placeholder="Full name"
                />
              </Field>

              <Field label="Qualification(s)">
                <input
                  className="submission-input"
                  name="qualification"
                  type="text"
                  placeholder="Academic / professional qualifications"
                />
              </Field>

              <Field
                label="Email Address"
                required
              >
                <input
                  className="submission-input"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                />
              </Field>

              <Field label="Phone Number">
                <input
                  className="submission-input"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                />
              </Field>

              <Field label="Department">
                <input
                  className="submission-input"
                  name="department"
                  type="text"
                  placeholder="Department"
                />
              </Field>

              <Field label="Institution / Organization">
                <input
                  className="submission-input"
                  name="institution"
                  type="text"
                  placeholder="Institution or organization"
                />
              </Field>

              <Field label="City">
                <input
                  className="submission-input"
                  name="city"
                  type="text"
                  placeholder="City"
                />
              </Field>

              <Field label="State / Region">
                <input
                  className="submission-input"
                  name="state"
                  type="text"
                  placeholder="State / Region"
                />
              </Field>

              <Field label="Country">
                <input
                  className="submission-input"
                  name="country"
                  type="text"
                  placeholder="Country"
                />
              </Field>

              <Field label="ORCID ID">
                <input
                  className="submission-input"
                  name="orcid"
                  type="text"
                  placeholder="0000-0000-0000-0000"
                />
              </Field>
            </FormSection>

            <FormSection
              number="03"
              title="Co-Authors"
              description="Enter any additional authors associated with this manuscript."
            >
              <Field
                label="Additional Author Details"
                full
              >
                <textarea
                  className="submission-input submission-textarea"
                  name="coAuthors"
                  placeholder={
                    "Enter each co-author on a separate line.\n\nExample:\nDr. Example Name — Qualification — Institution — Country"
                  }
                />
              </Field>
            </FormSection>

            <FormSection
                number="04"
                title="Manuscript File"
                description="Upload the complete manuscript document for editorial review."
              >
                <div className="file-coming-soon">
                  <strong>Upload Manuscript *</strong>

                  <p>
                    Accepted formats: PDF, DOC and DOCX. Maximum file size: 20 MB.
                  </p>

                  <input
                    type="file"
                    name="manuscriptFile"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={(event) => {
                      setManuscriptFile(event.target.files?.[0] || null);
                      setError("");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: "20px",
                      padding: "20px",
                      background: "#ffffff",
                      border: "2px dashed #9dbdaf",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  />

                  {manuscriptFile && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "14px 18px",
                        background: "#eaf6ef",
                        borderRadius: "10px",
                        color: "#0b6245",
                        fontWeight: 700,
                      }}
                    >
                      Selected file: {manuscriptFile.name}
                    </div>
                  )}
                </div>
              </FormSection>

            <FormSection
              number="05"
              title="Publication Declarations"
              description="Confirm the declarations below before submitting."
            >
              <div className="declaration-list">
                <Declaration
                  name="originalWorkConfirmed"
                  text="I confirm that this manuscript represents original scholarly work."
                />

                <Declaration
                  name="notSubmittedElsewhere"
                  text="I confirm that this manuscript is not currently under consideration by another journal."
                />

                <Declaration
                  name="authorsApproved"
                  text="I confirm that all listed authors have approved this submission."
                />

                <Declaration
                  name="conflictsDeclared"
                  text="I confirm that relevant conflicts of interest and funding sources have been disclosed."
                />

                <Declaration
                  name="ethicsConfirmed"
                  text="Where applicable, ethical approval, consent, confidentiality and related requirements have been addressed."
                />

                <Declaration
                  name="journalPoliciesConfirmed"
                  text="I confirm that I have reviewed the applicable IJER author and publication policies."
                />
              </div>
            </FormSection>

            <div className="submit-area">
              <p>
                After submission, your manuscript information
                will be sent directly to the IJER
                administration system for review.
              </p>

              <button
                type="submit"
                className="submit-manuscript-button"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Manuscript"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <SubmissionStyles />
    </main>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="submission-section-card">
      <div className="submission-section-header">
        <span className="submission-number">
          {number}
        </span>

        <div>
          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>
        </div>
      </div>

      <div className="submission-grid">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required = false,
  full = false,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        full
          ? "submission-field submission-field-full"
          : "submission-field"
      }
    >
      <label>
        {label}

        {required && (
          <span className="required-mark">
            {" "}*
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function Declaration({
  name,
  text,
}: {
  name: string;
  text: string;
}) {
  return (
    <label className="declaration-item">
      <input
        type="checkbox"
        name={name}
        required
      />

      <span>
        {text}
      </span>
    </label>
  );
}

function SubmissionStyles() {
  return (
    <style jsx global>{`
      .submission-container {
        width: min(1000px, calc(100% - 44px));
        margin: 0 auto;
      }

      .submission-intro {
        margin-bottom: 42px;
        padding: 32px;
        border: 1px solid #cfe2d8;
        border-radius: 20px;
        background: var(--green-soft);
      }

      .submission-intro h2 {
        margin: 0 0 12px;
        font-size: 28px;
      }

      .submission-intro p {
        max-width: 760px;
        margin: 0 0 18px;
        color: var(--muted);
        line-height: 1.8;
      }

      .submission-error {
        margin-bottom: 30px;
        padding: 18px 20px;
        border: 1px solid #ecc6c2;
        border-radius: 12px;
        background: #fff6f5;
        color: #9c3d36;
      }

      .submission-error strong,
      .submission-error span {
        display: block;
      }

      .submission-error strong {
        margin-bottom: 4px;
      }

      .submission-section-card {
        margin-bottom: 34px;
        padding: 40px;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: #ffffff;
      }

      .submission-section-header {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 32px;
        padding-bottom: 28px;
        border-bottom: 1px solid var(--border);
      }

      .submission-number {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: var(--green-soft);
        color: var(--green);
        font-size: 13px;
        font-weight: 900;
      }

      .submission-section-header h2 {
        margin: 0 0 7px;
        font-size: 27px;
      }

      .submission-section-header p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      .submission-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 25px;
      }

      .submission-field {
        min-width: 0;
      }

      .submission-field-full {
        grid-column: 1 / -1;
      }

      .submission-field label {
        display: block;
        margin-bottom: 9px;
        font-size: 14px;
        font-weight: 800;
      }

      .required-mark {
        color: #b42318;
      }

      .submission-input {
        width: 100%;
        min-height: 51px;
        padding: 12px 14px;
        border: 1px solid #cadbd3;
        border-radius: 10px;
        background: #ffffff;
        color: var(--foreground);
        font: inherit;
        outline: none;
      }

      .submission-input:focus {
        border-color: var(--green);
        box-shadow:
          0 0 0 3px rgba(22, 103, 71, 0.1);
      }

      .submission-textarea {
        min-height: 165px;
        resize: vertical;
      }

      .submission-field small {
        display: block;
        margin-top: 8px;
        color: var(--muted);
      }

      .file-coming-soon {
        grid-column: 1 / -1;
        padding: 28px;
        border: 1px dashed #aac7b8;
        border-radius: 16px;
        background: #f8fcfa;
      }

      .file-coming-soon strong {
        display: block;
        margin-bottom: 8px;
        color: var(--green-dark);
        font-size: 18px;
      }

      .file-coming-soon p {
        max-width: 720px;
        margin: 0;
        color: var(--muted);
        line-height: 1.8;
      }

      .declaration-list {
        grid-column: 1 / -1;
        display: grid;
        gap: 13px;
      }

      .declaration-item {
        display: flex;
        align-items: flex-start;
        gap: 13px;
        padding: 18px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: #fbfdfc;
        cursor: pointer;
      }

      .declaration-item input {
        width: 18px;
        height: 18px;
        margin-top: 4px;
        flex-shrink: 0;
        accent-color: var(--green);
      }

      .declaration-item span {
        color: #4e6259;
        line-height: 1.7;
      }

      .submit-area {
        margin-top: 35px;
        padding: 32px;
        border: 1px solid var(--border);
        border-radius: 20px;
        background: #f7faf8;
      }

      .submit-area p {
        max-width: 700px;
        margin: 0 0 22px;
        color: var(--muted);
        line-height: 1.8;
      }

      .submit-manuscript-button {
        min-width: 220px;
        min-height: 52px;
        padding: 0 24px;
        border: 0;
        border-radius: 10px;
        background: var(--green);
        color: white;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
      }

      .submit-manuscript-button:hover:not(:disabled) {
        background: var(--green-dark);
      }

      .submit-manuscript-button:disabled {
        cursor: wait;
        opacity: 0.65;
      }

      .submission-success-container {
        width: min(820px, calc(100% - 44px));
        margin: 0 auto;
      }

      .submission-success-card {
        padding: 52px;
        border: 1px solid var(--border);
        border-radius: 26px;
        background: white;
        text-align: center;
      }

      .success-icon {
        width: 74px;
        height: 74px;
        margin: 0 auto 24px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: var(--green-soft);
        color: var(--green);
        font-size: 28px;
        font-weight: 900;
      }

      .submission-success-card h2 {
        margin: 0 0 14px;
        font-size: 34px;
      }

      .submission-success-card > p {
        max-width: 620px;
        margin: 0 auto 28px;
        color: var(--muted);
        line-height: 1.8;
      }

      .reference-box {
        margin: 30px 0;
        padding: 28px;
        border-radius: 16px;
        background: #0e503a;
        color: white;
      }

      .reference-box span,
      .reference-box strong {
        display: block;
      }

      .reference-box span {
        margin-bottom: 8px;
        color: #cae5da;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .reference-box strong {
        font-size: 28px;
        letter-spacing: 0.03em;
      }

      .success-notice {
        margin-bottom: 30px;
        padding: 24px;
        border: 1px solid var(--border);
        border-radius: 15px;
        background: #f7faf8;
        text-align: left;
      }

      .success-notice strong {
        display: block;
        margin-bottom: 8px;
      }

      .success-notice p {
        margin: 0;
        color: var(--muted);
        line-height: 1.8;
      }

      .submission-success-card .primary-button {
        border: 0;
        cursor: pointer;
      }

      .success-home-link {
        display: block;
        margin-top: 20px;
        color: var(--green);
        font-weight: 800;
      }

      @media (max-width: 700px) {
        .submission-container,
        .submission-success-container {
          width: min(100% - 28px, 1000px);
        }

        .submission-section-card {
          padding: 27px 20px;
        }

        .submission-grid {
          grid-template-columns: 1fr;
        }

        .submission-field-full {
          grid-column: auto;
        }

        .submission-success-card {
          padding: 38px 22px;
        }

        .reference-box strong {
          font-size: 22px;
        }
      }
    `}</style>
  );
}