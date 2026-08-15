"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const designations = [
  "PATRON",
  "HONORARY_PATRON",
  "CHAIRPERSON_EDITORIAL_COUNCIL",
  "EDITOR_IN_CHIEF",
  "EXECUTIVE_EDITOR",
  "MANAGING_EDITOR",
  "DEPUTY_EDITOR",
  "ASSOCIATE_EDITOR",
  "ASSISTANT_EDITOR",
  "SECTION_EDITOR",
  "STATISTICAL_EDITOR",
  "RESEARCH_METHODOLOGY_EDITOR",
  "EDITORIAL_BOARD_MEMBER",
  "INTERNATIONAL_EDITORIAL_BOARD_MEMBER",
  "SCIENTIFIC_ADVISORY_BOARD_MEMBER",
  "ACADEMIC_ADVISORY_BOARD_MEMBER",
  "REVIEWER",
];

type Member = {
  id: string;
  fullName: string;
  qualifications: string | null;
  editorialDesignation: string;
  specialty: string | null;
  professionalDesignation: string | null;
  department: string | null;
  institution: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  email: string | null;
  displayOrder: number;
  status: string;
  showOnWebsite: boolean;
};

export default function AdminEditorialBoardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadMembers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/editorial-members", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load editorial members.",
        );
      }

      setMembers(data.members || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load editorial members.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      qualifications: String(
        formData.get("qualifications") || "",
      ),
      editorialDesignation: String(
        formData.get("editorialDesignation") || "",
      ),
      specialty: String(formData.get("specialty") || ""),
      professionalDesignation: String(
        formData.get("professionalDesignation") || "",
      ),
      department: String(formData.get("department") || ""),
      institution: String(formData.get("institution") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      country: String(formData.get("country") || ""),
      email: String(formData.get("email") || ""),
      displayOrder: Number(
        formData.get("displayOrder") || 0,
      ),
      status: String(formData.get("status") || "ACTIVE"),
      showOnWebsite:
        formData.get("showOnWebsite") === "on",
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        editingId
          ? `/api/editorial-members/${editingId}`
          : "/api/editorial-members",
        {
          method: editingId ? "PATCH" : "POST",
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
            "Unable to save editorial member.",
        );
      }

      setMessage(
        editingId
          ? "Editorial member updated successfully."
          : "Editorial member added successfully.",
      );

      setEditingId(null);
      form.reset();

      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save editorial member.",
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(member: Member) {
    setEditingId(member.id);

    setTimeout(() => {
      const form =
        document.querySelector<HTMLFormElement>(
          "#editorial-member-form",
        );

      if (!form) {
        return;
      }

      const setValue = (
        name: string,
        value: string,
      ) => {
        const element =
          form.elements.namedItem(name) as
            | HTMLInputElement
            | HTMLSelectElement
            | null;

        if (element) {
          element.value = value;
        }
      };

      setValue("fullName", member.fullName);
      setValue(
        "qualifications",
        member.qualifications || "",
      );
      setValue(
        "editorialDesignation",
        member.editorialDesignation,
      );
      setValue(
        "specialty",
        member.specialty || "",
      );
      setValue(
        "professionalDesignation",
        member.professionalDesignation || "",
      );
      setValue(
        "department",
        member.department || "",
      );
      setValue(
        "institution",
        member.institution || "",
      );
      setValue("city", member.city || "");
      setValue("state", member.state || "");
      setValue("country", member.country || "");
      setValue("email", member.email || "");
      setValue(
        "displayOrder",
        String(member.displayOrder),
      );
      setValue("status", member.status);

      const checkbox =
        form.elements.namedItem(
          "showOnWebsite",
        ) as HTMLInputElement | null;

      if (checkbox) {
        checkbox.checked = member.showOnWebsite;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }

  async function deleteMember(
    member: Member,
  ) {
    const confirmed = window.confirm(
      `Delete ${member.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/editorial-members/${member.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete editorial member.",
        );
      }

      setMessage("Editorial member deleted.");
      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete editorial member.",
      );
    }
  }

  return (
    <main className="board-admin-page">
      <div className="board-admin-container">
        <div className="board-topbar">
          <Link href="/admin/dashboard">
            ← Dashboard
          </Link>

          <Link href="/editorial-board" target="_blank">
            View Public Board
          </Link>
        </div>

        <section className="board-admin-hero">
          <span>IJER Administration</span>

          <h1>Editorial Board Management</h1>

          <p>
            Add, edit, activate, deactivate, order and control
            which editorial members appear on the public website.
          </p>
        </section>

        {error && (
          <div className="board-message board-error">
            {error}
          </div>
        )}

        {message && (
          <div className="board-message board-success">
            ✓ {message}
          </div>
        )}

        <section className="board-admin-card">
          <h2>
            {editingId
              ? "Edit Editorial Member"
              : "Add Editorial Member"}
          </h2>

          <form
            id="editorial-member-form"
            className="board-form"
            onSubmit={handleSubmit}
          >
            <Input
              name="fullName"
              label="Full Name"
              required
            />

            <Input
              name="qualifications"
              label="Qualifications"
            />

            <label>
              Editorial Designation *
              <select
                name="editorialDesignation"
                required
              >
                {designations.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <Input
              name="professionalDesignation"
              label="Professional Designation"
            />

            <Input
              name="specialty"
              label="Specialty"
            />

            <Input
              name="department"
              label="Department"
            />

            <Input
              name="institution"
              label="Institution"
            />

            <Input
              name="city"
              label="City"
            />

            <Input
              name="state"
              label="State"
            />

            <Input
              name="country"
              label="Country"
            />

            <Input
              name="email"
              label="Email"
              type="email"
            />

            <Input
              name="displayOrder"
              label="Display Order"
              type="number"
            />

            <label>
              Status
              <select name="status">
                <option value="ACTIVE">
                  Active
                </option>
                <option value="INACTIVE">
                  Inactive
                </option>
              </select>
            </label>

            <label className="board-checkbox">
              <input
                type="checkbox"
                name="showOnWebsite"
                defaultChecked
              />

              Show on public website
            </label>

            <div className="board-form-actions">
              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Member"
                    : "Add Member"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setEditingId(null);

                    const form =
                      document.querySelector<HTMLFormElement>(
                        "#editorial-member-form",
                      );

                    form?.reset();
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="board-admin-card">
          <div className="members-heading">
            <div>
              <span>
                Editorial Database
              </span>

              <h2>
                Members ({members.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={loadMembers}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="board-empty">
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className="board-empty">
              No editorial members have been added yet.
            </div>
          ) : (
            <div className="member-admin-list">
              {members.map((member) => (
                <article
                  className="member-admin-row"
                  key={member.id}
                >
                  <div className="member-admin-main">
                    <strong>
                      {member.fullName}
                    </strong>

                    <span>
                      {member.editorialDesignation.replaceAll(
                        "_",
                        " ",
                      )}
                    </span>

                    <small>
                      Order {member.displayOrder}
                      {" • "}
                      {member.status}
                      {" • "}
                      {member.showOnWebsite
                        ? "Visible"
                        : "Hidden"}
                    </small>
                  </div>

                  <div className="member-admin-actions">
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(member)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        deleteMember(member)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .board-admin-page {
          min-height: 100vh;
          padding: 40px 0 90px;
          background: #f5f9f7;
          color: #17382f;
        }

        .board-admin-container {
          width: min(1100px, calc(100% - 44px));
          margin: 0 auto;
        }

        .board-topbar {
          margin-bottom: 22px;
          display: flex;
          justify-content: space-between;
        }

        .board-topbar a {
          color: #176b4d;
          font-weight: 800;
          text-decoration: none;
        }

        .board-admin-hero {
          padding: 42px;
          border-radius: 22px;
          background: #0e503a;
          color: white;
        }

        .board-admin-hero span {
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .board-admin-hero h1 {
          margin: 8px 0;
          color: white;
          font-size: 45px;
        }

        .board-admin-hero p {
          margin: 0;
          color: #d8ebe3;
        }

        .board-admin-card {
          margin-top: 28px;
          padding: 32px;
          border: 1px solid #dce8e2;
          border-radius: 18px;
          background: white;
        }

        .board-admin-card h2 {
          margin: 0 0 25px;
        }

        .board-form {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .board-form label {
          display: grid;
          gap: 7px;
          font-size: 13px;
          font-weight: 800;
        }

        .board-form input,
        .board-form select {
          min-height: 48px;
          padding: 10px 12px;
          border: 1px solid #cadbd3;
          border-radius: 9px;
          font: inherit;
        }

        .board-checkbox {
          display: flex !important;
          align-items: center;
          gap: 10px;
        }

        .board-checkbox input {
          min-height: auto;
        }

        .board-form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 12px;
        }

        .board-form-actions button {
          min-height: 48px;
          padding: 0 20px;
          border: 0;
          border-radius: 9px;
          background: #176b4d;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .board-form-actions .cancel-button {
          background: #697a72;
        }

        .members-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 22px;
        }

        .members-heading span {
          color: #176b4d;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .members-heading h2 {
          margin: 5px 0 0;
        }

        .members-heading button {
          padding: 9px 14px;
          border: 1px solid #bed1c7;
          border-radius: 8px;
          background: white;
          color: #176b4d;
          font-weight: 800;
          cursor: pointer;
        }

        .member-admin-list {
          display: grid;
          gap: 12px;
        }

        .member-admin-row {
          padding: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border: 1px solid #e2ebe6;
          border-radius: 12px;
        }

        .member-admin-main strong,
        .member-admin-main span,
        .member-admin-main small {
          display: block;
        }

        .member-admin-main span {
          margin-top: 5px;
          color: #176b4d;
          font-size: 12px;
        }

        .member-admin-main small {
          margin-top: 6px;
          color: #82928a;
        }

        .member-admin-actions {
          display: flex;
          gap: 8px;
        }

        .member-admin-actions button {
          padding: 8px 12px;
          border: 0;
          border-radius: 7px;
          background: #176b4d;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .member-admin-actions .delete-button {
          background: #b42318;
        }

        .board-message {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
        }

        .board-error {
          background: #fff2f1;
          color: #a23e38;
        }

        .board-success {
          background: #eaf6ef;
          color: #176b4d;
        }

        .board-empty {
          padding: 50px 20px;
          text-align: center;
          color: #74867e;
        }

        @media (max-width: 700px) {
          .board-form {
            grid-template-columns: 1fr;
          }

          .board-form-actions {
            grid-column: auto;
          }

          .member-admin-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      {label}
      {required ? " *" : ""}

      <input
        name={name}
        type={type}
        required={required}
      />
    </label>
  );
}