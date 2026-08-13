"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [completed, setCompleted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCompleted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (completed) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-success">
            <div className="auth-success-icon">✓</div>

            <span className="eyebrow">Registration</span>

            <h1>Registration Form Completed</h1>

            <p>
              The registration interface is working correctly. Permanent account
              creation will be enabled when we connect the IJER database and
              authentication system.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => setCompleted(false)}
              style={{
                border: 0,
                cursor: "pointer",
              }}
            >
              Return to Registration
            </button>
          </div>
        </div>

        <AuthStyles />
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card auth-card-wide">
          <div className="auth-heading">
            <span className="eyebrow">IJER Account</span>

            <h1>Create Your Account</h1>

            <p>
              Register to submit manuscripts, track submissions, participate in
              peer review, and manage your IJER profile.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-section">
              <h2>Personal Information</h2>

              <div className="auth-grid">
                <Field label="Title">
                  <select
                    name="title"
                    className="auth-input"
                    defaultValue=""
                  >
                    <option value="">Select title</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                </Field>

                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="fullName"
                    className="auth-input"
                    placeholder="Enter your full name"
                    required
                  />
                </Field>

                <Field label="Qualification(s)" required>
                  <input
                    type="text"
                    name="qualification"
                    className="auth-input"
                    placeholder="Example: Ph.D., M.Sc., MD"
                    required
                  />
                </Field>

                <Field label="Professional Designation">
                  <input
                    type="text"
                    name="designation"
                    className="auth-input"
                    placeholder="Professor / Researcher / Scientist"
                  />
                </Field>

                <Field label="Department">
                  <input
                    type="text"
                    name="department"
                    className="auth-input"
                    placeholder="Department"
                  />
                </Field>

                <Field label="Institution / Organization" required>
                  <input
                    type="text"
                    name="institution"
                    className="auth-input"
                    placeholder="Institution or organization"
                    required
                  />
                </Field>

                <Field label="City" required>
                  <input
                    type="text"
                    name="city"
                    className="auth-input"
                    placeholder="City"
                    required
                  />
                </Field>

                <Field label="Country" required>
                  <input
                    type="text"
                    name="country"
                    className="auth-input"
                    placeholder="Country"
                    required
                  />
                </Field>
              </div>
            </div>

            <div className="auth-section">
              <h2>Contact & Academic Profile</h2>

              <div className="auth-grid">
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    className="auth-input"
                    placeholder="your@email.com"
                    required
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    type="tel"
                    name="phone"
                    className="auth-input"
                    placeholder="Phone number"
                  />
                </Field>

                <Field label="ORCID ID">
                  <input
                    type="text"
                    name="orcid"
                    className="auth-input"
                    placeholder="0000-0000-0000-0000"
                  />
                </Field>

                <Field label="Google Scholar URL">
                  <input
                    type="url"
                    name="googleScholar"
                    className="auth-input"
                    placeholder="Google Scholar profile link"
                  />
                </Field>

                <Field label="ResearchGate URL">
                  <input
                    type="url"
                    name="researchGate"
                    className="auth-input"
                    placeholder="ResearchGate profile link"
                  />
                </Field>

                <Field label="Research Interests">
                  <input
                    type="text"
                    name="researchInterests"
                    className="auth-input"
                    placeholder="Phytochemistry, medicinal plants, microbiology..."
                  />
                </Field>
              </div>
            </div>

            <div className="auth-section">
              <h2>Account Information</h2>

              <div className="auth-grid">
                <Field label="Password" required>
                  <input
                    type="password"
                    name="password"
                    className="auth-input"
                    placeholder="Create a password"
                    required
                    minLength={8}
                  />
                </Field>

                <Field label="Confirm Password" required>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="auth-input"
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                  />
                </Field>
              </div>

              <div className="account-notice">
                New registrations will initially receive an
                <strong> Author</strong> account. Reviewer, Editor and Admin
                permissions will later be assigned by IJER administrators.
              </div>
            </div>

            <label className="auth-checkbox">
              <input type="checkbox" required />

              <span>
                I confirm that the information provided is accurate and I agree
                to follow IJER publication and account policies.
              </span>
            </label>

            <button type="submit" className="auth-submit">
              Create Account
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link href="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <AuthStyles />
    </main>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="auth-label">
        {label}

        {required && (
          <span className="required-mark"> *</span>
        )}
      </label>

      {children}
    </div>
  );
}

function AuthStyles() {
  return (
    <style jsx global>{`
      .auth-page {
        min-height: 70vh;
        padding: 80px 0 100px;
        background:
          radial-gradient(
            circle at 85% 10%,
            rgba(22, 103, 71, 0.08),
            transparent 30%
          ),
          #f8fcfa;
      }

      .auth-container {
        width: min(980px, calc(100% - 40px));
        margin: 0 auto;
      }

      .auth-card {
        border: 1px solid var(--border);
        border-radius: 26px;
        background: #ffffff;
        box-shadow: 0 24px 70px rgba(31, 78, 60, 0.08);
      }

      .auth-card-wide {
        padding: 52px;
      }

      .auth-heading {
        max-width: 700px;
        margin-bottom: 48px;
      }

      .auth-heading h1 {
        margin: 0;
        font-size: clamp(38px, 5vw, 54px);
        line-height: 1.1;
        letter-spacing: -0.04em;
      }

      .auth-heading p {
        margin: 20px 0 0;
        color: var(--muted);
        font-size: 17px;
        line-height: 1.8;
      }

      .auth-section {
        margin-bottom: 44px;
        padding-bottom: 42px;
        border-bottom: 1px solid var(--border);
      }

      .auth-section h2 {
        margin: 0 0 26px;
        font-size: 24px;
        color: var(--foreground);
      }

      .auth-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px;
      }

      .auth-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 800;
        color: var(--foreground);
      }

      .auth-input {
        width: 100%;
        min-height: 52px;
        padding: 12px 14px;
        border: 1px solid #cadbd3;
        border-radius: 11px;
        background: #ffffff;
        color: var(--foreground);
        font: inherit;
        outline: none;
      }

      .auth-input:focus {
        border-color: var(--green);
        box-shadow: 0 0 0 3px rgba(22, 103, 71, 0.1);
      }

      .required-mark {
        color: #b42318;
      }

      .account-notice {
        margin-top: 24px;
        padding: 18px;
        border-radius: 12px;
        background: var(--green-soft);
        color: #42574f;
        line-height: 1.7;
      }

      .auth-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 13px;
        margin-bottom: 28px;
        cursor: pointer;
      }

      .auth-checkbox input {
        width: 18px;
        height: 18px;
        margin-top: 4px;
        flex-shrink: 0;
        accent-color: var(--green);
      }

      .auth-checkbox span {
        color: var(--muted);
        line-height: 1.7;
      }

      .auth-submit {
        width: 100%;
        min-height: 54px;
        border: 0;
        border-radius: 11px;
        background: var(--green);
        color: white;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
      }

      .auth-submit:hover {
        background: var(--green-dark);
      }

      .auth-switch {
        margin: 26px 0 0;
        text-align: center;
        color: var(--muted);
      }

      .auth-switch a {
        color: var(--green);
        font-weight: 800;
      }

      .auth-success {
        padding: 60px;
        border: 1px solid var(--border);
        border-radius: 26px;
        background: white;
        text-align: center;
      }

      .auth-success-icon {
        width: 76px;
        height: 76px;
        display: grid;
        place-items: center;
        margin: 0 auto 24px;
        border-radius: 50%;
        background: var(--green-soft);
        color: var(--green);
        font-size: 30px;
        font-weight: 900;
      }

      .auth-success h1 {
        margin: 0 0 16px;
        font-size: 38px;
      }

      .auth-success p {
        max-width: 650px;
        margin: 0 auto 30px;
        color: var(--muted);
        line-height: 1.8;
      }

      @media (max-width: 700px) {
        .auth-page {
          padding: 55px 0 70px;
        }

        .auth-card-wide {
          padding: 30px 22px;
        }

        .auth-grid {
          grid-template-columns: 1fr;
        }

        .auth-success {
          padding: 38px 24px;
        }
      }
    `}</style>
  );
}