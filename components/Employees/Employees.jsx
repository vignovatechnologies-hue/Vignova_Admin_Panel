"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Plus, X, KeyRound, Mail, Pencil, ShieldOff, Trash2 } from "lucide-react";
import "@/components/Dashboard/Dashboard.css";
import "./Employees.css";

const EMPTY_FORM = { name: "", email: "", phone: "", role: "", employeeCode: "" };

export default function Employees() {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newlyCreated, setNewlyCreated] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [editFor, setEditFor] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [resetFor, setResetFor] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [deleteFor, setDeleteFor] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadEmployees = async () => {
    const { data, error } = await supabase.from("employees").select("*").order("joined_at", { ascending: false });
    if (error) {
      setLoadError(error.message);
    } else {
      setEmployees(data || []);
    }
    setLoaded(true);
  };

  if (isAdmin && !loaded) {
    loadEmployees();
  }

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setNewlyCreated(null);
    setFormError("");
    setAddOpen(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/employees/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create employee.");
      setEmployees((prev) => [data.employee, ...prev]);
      setNewlyCreated({ ...data.employee, password: data.password });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (emp) => {
    setEditFor(emp);
    setEditForm({ name: emp.name, phone: emp.phone, role: emp.role || "", status: emp.status });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/employees/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editFor.id, ...editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update employee.");
      setEmployees((prev) => prev.map((e) => (e.id === editFor.id ? data.employee : e)));
      setEditFor(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openReset = (emp) => {
    setResetFor(emp);
    setNewPassword("");
    setFormError("");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/employees/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authUserId: resetFor.auth_user_id, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password.");
      setResetFor(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (emp) => {
    setDeleteFor(emp);
    setDeleteError("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/employees/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteFor.id, authUserId: deleteFor.auth_user_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete employee.");
      setEmployees((prev) => prev.filter((e) => e.id !== deleteFor.id));
      setDeleteFor(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="dashboard-shell">
        <Sidebar activeId="employees" />
        <main className="dashboard-main">
          <Topbar title="Employees" subtitle="This section is only available to Admin accounts." />
          <div className="card employees-restricted">
            <ShieldOff size={28} color="var(--color-employee)" />
            <p className="employees-restricted__title">Admin access required</p>
            <p className="employees-restricted__text">
              Employee records and login access are managed by Admin only.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar activeId="employees" />
      <main className="dashboard-main">
        <Topbar title="Employees" subtitle="Add employees and manage their login access to the panel." />

        <div className="card employees-card">
          <div className="employees-card__header">
            <h3>Team members</h3>
            <button className="btn btn--primary btn--sm" onClick={openAddModal}>
              <Plus size={14} /> Add Employee
            </button>
          </div>

          {loadError && <p className="login-card__error">{loadError}</p>}

          <div className="table-scroll">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email (login)</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="employees-table__name">{emp.employee_code}</td>
                  <td className="employees-table__name">{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className="employees-table__status">{emp.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(emp)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn btn--ghost btn--sm" onClick={() => openReset(emp)}>
                        <KeyRound size={13} /> New password
                      </button>
                      <button className="btn btn--ghost btn--sm" style={{ color: "var(--color-red)" }} onClick={() => openDelete(emp)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loaded && employees.length === 0 && (
                <tr><td colSpan={7} style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "24px" }}>No employees yet. Add your first one above.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {addOpen && (
          <div className="modal-overlay" onClick={() => setAddOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              {!newlyCreated ? (
                <>
                  <div className="modal__header">
                    <div>
                      <p className="modal__title">Add Employee</p>
                      <p className="modal__subtitle">Creates a real login with view-only access.</p>
                    </div>
                    <button className="modal__close" onClick={() => setAddOpen(false)}><X size={18} /></button>
                  </div>
                  <form onSubmit={handleAdd}>
                    <div className="field">
                      <label>Full name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" />
                    </div>
                    <div className="field">
                      <label>Employee ID</label>
                      <input required value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} placeholder="e.g. VGN001" />
                      <p className="field__hint">Used in their initial password: first 3 letters of name + @ + this ID.</p>
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="priya.sharma@vignova.in" />
                    </div>
                    <div className="field">
                      <label>Phone number</label>
                      <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                    </div>
                    <div className="field">
                      <label>Role / designation</label>
                      <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Support Executive" />
                    </div>
                    {formError && <p className="login-card__error">{formError}</p>}
                    <div className="modal__actions">
                      <button type="button" className="btn btn--ghost" onClick={() => setAddOpen(false)}>Cancel</button>
                      <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? "Creating..." : "Create login access"}</button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="modal__header">
                    <div>
                      <p className="modal__title">Login access created</p>
                      <p className="modal__subtitle">Share these credentials with {newlyCreated.name}.</p>
                    </div>
                    <button className="modal__close" onClick={() => setAddOpen(false)}><X size={18} /></button>
                  </div>
                  <div className="employees-credentials">
                    <div className="employees-credentials__row"><Mail size={14} /><span>{newlyCreated.email}</span></div>
                    <div className="employees-credentials__row"><KeyRound size={14} /><span className="employees-credentials__password">{newlyCreated.password}</span></div>
                  </div>
                  {newlyCreated.emailSent ? (
                    <p style={{ fontSize: 12.5, color: "var(--color-green)", marginTop: 4 }}>
                      Credentials email sent to {newlyCreated.email}.
                    </p>
                  ) : (
                    <p style={{ fontSize: 12.5, color: "var(--color-red)", marginTop: 4 }}>
                      Couldn't send the email automatically{newlyCreated.emailError ? ` (${newlyCreated.emailError})` : ""}. Please share the credentials above manually.
                    </p>
                  )}
                  <div className="modal__actions">
                    <button className="btn btn--primary" onClick={() => setAddOpen(false)}>Done</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {editFor && (
          <div className="modal-overlay" onClick={() => setEditFor(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <div>
                  <p className="modal__title">Edit Employee</p>
                  <p className="modal__subtitle">{editFor.email}</p>
                </div>
                <button className="modal__close" onClick={() => setEditFor(null)}><X size={18} /></button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="field">
                  <label>Full name</label>
                  <input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div className="field">
                  <label>Phone number</label>
                  <input required value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div className="field">
                  <label>Role / designation</label>
                  <input value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} />
                </div>
                <div className="field">
                  <label>Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg)", fontSize: "13.5px" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                {formError && <p className="login-card__error">{formError}</p>}
                <div className="modal__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setEditFor(null)}>Cancel</button>
                  <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {resetFor && (
          <div className="modal-overlay" onClick={() => setResetFor(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <div>
                  <p className="modal__title">Create new password</p>
                  <p className="modal__subtitle">For {resetFor.name} ({resetFor.email})</p>
                </div>
                <button className="modal__close" onClick={() => setResetFor(null)}><X size={18} /></button>
              </div>
              <form onSubmit={handleReset}>
                <div className="field">
                  <label>New password</label>
                  <input required type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter a new password" />
                </div>
                {formError && <p className="login-card__error">{formError}</p>}
                <div className="modal__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setResetFor(null)}>Cancel</button>
                  <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? "Updating..." : "Update password"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteFor && (
          <div className="modal-overlay" onClick={() => setDeleteFor(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <div>
                  <p className="modal__title">Delete employee</p>
                  <p className="modal__subtitle">This removes {deleteFor.name} ({deleteFor.email}) and their login access permanently.</p>
                </div>
                <button className="modal__close" onClick={() => setDeleteFor(null)}><X size={18} /></button>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--color-text-muted)" }}>
                They will no longer be able to sign in, and their email will be free to use again for a new employee. This can't be undone.
              </p>
              {deleteError && <p className="login-card__error">{deleteError}</p>}
              <div className="modal__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setDeleteFor(null)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ background: "var(--color-red)" }}
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting..." : "Delete employee"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
