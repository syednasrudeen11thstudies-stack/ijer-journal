"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "EDITOR";
  active: boolean;
  createdAt: string;
  updatedAt?: string;
};

export default function AdminAccountsPage() {
  const [admins, setAdmins] =
    useState<AdminAccount[]>([]);

  const [currentAdminId, setCurrentAdminId] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function loadAdmins() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/accounts",
        {
          cache: "no-store",
        },
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load administrators.",
        );
      }

      setAdmins(
        data.admins || [],
      );

      setCurrentAdminId(
        data.currentAdminId || "",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load administrators.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const payload = {
      name: String(
        formData.get("name") || "",
      ),

      email: String(
        formData.get("email") || "",
      ),

      password: String(
        formData.get("password") || "",
      ),

      role: String(
        formData.get("role") || "ADMIN",
      ),

      active:
        formData.get("active") === "on",
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await fetch(
          editingId
            ? `/api/admin/accounts/${editingId}`
            : "/api/admin/accounts",
          {
            method: editingId
              ? "PATCH"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to save administrator.",
        );
      }

      setMessage(
        editingId
          ? "Administrator updated successfully."
          : "Administrator created successfully.",
      );

      setEditingId(null);
      form.reset();

      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save administrator.",
      );
    } finally {
      setSaving(false);
    }
  }

  function editAdmin(
    admin: AdminAccount,
  ) {
    setEditingId(admin.id);

    setTimeout(() => {
      const form =
        document.querySelector<HTMLFormElement>(
          "#admin-account-form",
        );

      if (!form) {
        return;
      }

      const name =
        form.elements.namedItem(
          "name",
        ) as HTMLInputElement;

      const email =
        form.elements.namedItem(
          "email",
        ) as HTMLInputElement;

      const role =
        form.elements.namedItem(
          "role",
        ) as HTMLSelectElement;

      const active =
        form.elements.namedItem(
          "active",
        ) as HTMLInputElement;

      const password =
        form.elements.namedItem(
          "password",
        ) as HTMLInputElement;

      name.value = admin.name;
      email.value = admin.email;
      role.value = admin.role;
      active.checked =
        admin.active;
      password.value = "";

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }

  async function deleteAdmin(
    admin: AdminAccount,
  ) {
    if (
      !window.confirm(
        `Delete administrator "${admin.name}"?`,
      )
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/admin/accounts/${admin.id}`,
          {
            method: "DELETE",
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to delete administrator.",
        );
      }

      setMessage(
        "Administrator deleted successfully.",
      );

      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete administrator.",
      );
    }
  }

  return (
    <main className="account-page">
      <div className="account-container">
        <div className="account-top">
          <Link href="/admin/dashboard">
            ← Dashboard
          </Link>
        </div>

        <section className="account-hero">
          <span>
            Super Admin
          </span>

          <h1>
            Administrator Accounts
          </h1>

          <p>
            Create and manage secure IJER
            administrator and editor accounts.
          </p>
        </section>

        {error && (
          <div className="account-message error">
            {error}
          </div>
        )}

        {message && (
          <div className="account-message success">
            ✓ {message}
          </div>
        )}

        <section className="account-card">
          <h2>
            {editingId
              ? "Edit Administrator"
              : "Create Administrator"}
          </h2>

          <form
            id="admin-account-form"
            onSubmit={handleSubmit}
            className="account-form"
          >
            <label>
              Name *
              <input
                name="name"
                required
              />
            </label>

            <label>
              Email *
              <input
                name="email"
                type="email"
                required
              />
            </label>

            <label>
              Role *
              <select
                name="role"
                defaultValue="ADMIN"
              >
                <option value="SUPER_ADMIN">
                  Super Admin
                </option>

                <option value="ADMIN">
                  Admin
                </option>

                <option value="EDITOR">
                  Editor
                </option>
              </select>
            </label>

            <label>
              {editingId
                ? "New Password (optional)"
                : "Password *"}

              <input
                name="password"
                type="password"
                minLength={8}
                required={!editingId}
                autoComplete="new-password"
              />
            </label>

            <label className="account-checkbox">
              <input
                name="active"
                type="checkbox"
                defaultChecked
              />

              Active account
            </label>

            <div className="account-form-actions">
              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Administrator"
                    : "Create Administrator"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingId(null);

                    document
                      .querySelector<HTMLFormElement>(
                        "#admin-account-form",
                      )
                      ?.reset();
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="account-card">
          <div className="account-list-heading">
            <div>
              <span>
                Secure Accounts
              </span>

              <h2>
                Administrators ({admins.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={loadAdmins}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="account-empty">
              Loading administrators...
            </div>
          ) : (
            <div className="account-list">
              {admins.map(
                (admin) => (
                  <article
                    className="account-row"
                    key={admin.id}
                  >
                    <div>
                      <strong>
                        {admin.name}

                        {admin.id ===
                          currentAdminId && (
                          <em>
                            You
                          </em>
                        )}
                      </strong>

                      <span>
                        {admin.email}
                      </span>

                      <small>
                        {admin.role.replaceAll(
                          "_",
                          " ",
                        )}
                        {" • "}
                        {admin.active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </small>
                    </div>

                    <div className="account-actions">
                      <button
                        type="button"
                        onClick={() =>
                          editAdmin(
                            admin,
                          )
                        }
                      >
                        Edit
                      </button>

                      {admin.id !==
                        currentAdminId && (
                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            deleteAdmin(
                              admin,
                            )
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .account-page {
          min-height: 100vh;
          padding: 40px 0 90px;
          background: #f5f9f7;
          color: #17382f;
        }

        .account-container {
          width: min(1050px, calc(100% - 44px));
          margin: 0 auto;
        }

        .account-top {
          margin-bottom: 22px;
        }

        .account-top a {
          color: #176b4d;
          font-weight: 800;
          text-decoration: none;
        }

        .account-hero {
          padding: 42px;
          border-radius: 22px;
          background: #0e503a;
          color: white;
        }

        .account-hero span {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .account-hero h1 {
          margin: 8px 0;
          color: white;
          font-size: 44px;
        }

        .account-hero p {
          margin: 0;
          color: #d8ebe3;
        }

        .account-card {
          margin-top: 28px;
          padding: 32px;
          border: 1px solid #dce8e2;
          border-radius: 18px;
          background: white;
        }

        .account-card h2 {
          margin: 0 0 24px;
        }

        .account-form {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .account-form label {
          display: grid;
          gap: 7px;
          font-size: 13px;
          font-weight: 800;
        }

        .account-form input,
        .account-form select {
          min-height: 48px;
          padding: 10px 12px;
          border: 1px solid #cadbd3;
          border-radius: 9px;
          font: inherit;
        }

        .account-checkbox {
          display: flex !important;
          align-items: center;
          gap: 10px;
        }

        .account-checkbox input {
          min-height: auto;
        }

        .account-form-actions {
          grid-column: 1 / -1;
          display: flex;
          gap: 10px;
        }

        .account-form-actions button {
          min-height: 48px;
          padding: 0 20px;
          border: 0;
          border-radius: 9px;
          background: #176b4d;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .account-form-actions .secondary {
          background: #667a70;
        }

        .account-list-heading {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .account-list-heading span {
          color: #176b4d;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .account-list-heading h2 {
          margin: 5px 0 0;
        }

        .account-list-heading button {
          padding: 9px 14px;
          border: 1px solid #bed1c7;
          border-radius: 8px;
          background: white;
          color: #176b4d;
          font-weight: 800;
          cursor: pointer;
        }

        .account-list {
          display: grid;
          gap: 12px;
        }

        .account-row {
          padding: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border: 1px solid #e2ebe6;
          border-radius: 12px;
        }

        .account-row strong,
        .account-row span,
        .account-row small {
          display: block;
        }

        .account-row strong em {
          margin-left: 8px;
          padding: 4px 7px;
          border-radius: 999px;
          background: #e7f5ed;
          color: #176b4d;
          font-size: 9px;
          font-style: normal;
        }

        .account-row span {
          margin-top: 5px;
          color: #60736a;
        }

        .account-row small {
          margin-top: 6px;
          color: #88968f;
        }

        .account-actions {
          display: flex;
          gap: 8px;
        }

        .account-actions button {
          padding: 8px 12px;
          border: 0;
          border-radius: 7px;
          background: #176b4d;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .account-actions .delete {
          background: #b42318;
        }

        .account-message {
          margin-top: 20px;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
        }

        .account-message.error {
          background: #fff2f1;
          color: #a23e38;
        }

        .account-message.success {
          background: #eaf6ef;
          color: #176b4d;
        }

        .account-empty {
          padding: 40px;
          text-align: center;
          color: #74867e;
        }

        @media (max-width: 700px) {
          .account-form {
            grid-template-columns: 1fr;
          }

          .account-form-actions {
            grid-column: auto;
          }

          .account-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}