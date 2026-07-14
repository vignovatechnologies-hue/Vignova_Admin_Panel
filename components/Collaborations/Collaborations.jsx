"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import { supabase } from "@/lib/supabaseClient";
import { useRole } from "@/lib/RoleContext";
import { Plus, X, Pencil, ShieldOff } from "lucide-react";
import "@/components/Dashboard/Dashboard.css";
import "@/components/Employees/Employees.css";

const EMPTY_FORM = { name: "", role: "", status: "Active", since: "", notes: "" };

export default function Collaborations() {
  const { isAdmin } = useRole();
  const [collaborations, setCollaborations] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadCollaborations = async () => {
    const { data, error } = await supabase
      .from("collaborations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else setCollaborations(data || []);
    setLoaded(true);
  };

  useEffect(() => {
    if (isAdmin) loadCollaborations();
    else setLoaded(true);
  }, [isAdmin]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("collaborations")
          .update(form)
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        setCollaborations((prev) => prev.map((c) => (c.id === editingId ? data : c)));
      } else {
        const { data, error } = await supabase.from("collaborations").insert(form).select().single();
        if (error) throw error;
        setCollaborations((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="dashboard-shell">
        <Sidebar activeId="collaborations" />
        <main className="dashboard-main">
          <Topbar title="Collaborations" subtitle="This section is only available to Admin accounts." />
          <div className="card employees-restricted">
            <ShieldOff size={28} color="var(--color-employee)" />
            <p className="employees-restricted__title">No collaborations to show</p>
            <p className="employees-restricted__text">
              Partner and collaboration records are managed by Admin only.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar activeId="collaborations" />
      <main className="dashboard-main">
        <Topbar title="Collaborations" subtitle="Manage Vignova's partners and collaborations." />

        <div className="card employees-card">
          <div className="employees-card__header">
            <h3>Collaborations</h3>
            <button className="btn btn--primary btn--sm" onClick={openAdd}>
              <Plus size={14} /> Add Collaboration
            </button>
          </div>

          {loadError && <p className="login-card__error">{loadError}</p>}

          <div className="table-scroll">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Since</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {collaborations.map((item) => (
                  <tr key={item.id}>
                    <td className="employees-table__name">{item.name}</td>
                    <td>{item.role}</td>
                    <td>
                      <span
                        className="employees-table__status"
                        style={
                          item.status === "Pending"
                            ? { background: "var(--color-orange-bg)", color: "var(--color-orange)" }
                            : undefined
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.since}</td>
                    <td>
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(item)}>
                        <Pencil size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {loaded && collaborations.length === 0 && !loadError && (
                  <tr>
                    <td colSpan={5} style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "24px" }}>
                      No collaborations yet — add your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <div>
                  <p className="modal__title">{editingId ? "Edit Collaboration" : "Add Collaboration"}</p>
                  <p className="modal__subtitle">Partner or collaboration details.</p>
                </div>
                <button className="modal__close" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="field">
                  <label>Partner name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Razorpay" />
                </div>
                <div className="field">
                  <label>Role</label>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Payment Partner" />
                </div>
                <div className="field">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg)", fontSize: "13.5px" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="field">
                  <label>Partner since</label>
                  <input value={form.since} onChange={(e) => setForm({ ...form, since: e.target.value })} placeholder="e.g. May 2024" />
                </div>
                {formError && <p className="login-card__error">{formError}</p>}
                <div className="modal__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add collaboration"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
