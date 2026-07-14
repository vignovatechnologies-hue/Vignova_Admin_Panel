"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import { supabase } from "@/lib/supabaseClient";
import { useRole } from "@/lib/RoleContext";
import { Plus, X, Pencil } from "lucide-react";
import "@/components/Dashboard/Dashboard.css";
import "@/components/Employees/Employees.css";

const EMPTY_FORM = { name: "", company: "", email: "", phone: "", status: "Active", notes: "", deadline: "" };

function formatDeadlineCell(deadline) {
  if (!deadline) return <span style={{ color: "var(--color-text-muted)" }}>—</span>;
  const due = new Date(deadline + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((due - today) / 86400000);
  const label = due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let color = "var(--color-text)";
  if (daysLeft < 0) color = "var(--color-red)";
  else if (daysLeft <= 3) color = "var(--color-orange)";

  return <span style={{ color, fontWeight: daysLeft <= 3 ? 700 : 500 }}>{label}</span>;
}

export default function Clients() {
  const { isAdmin } = useRole();
  const [clients, setClients] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else setClients(data || []);
    setLoaded(true);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingId(client.id);
    setForm({ ...client });
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
          .from("clients")
          .update(form)
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        setClients((prev) => prev.map((c) => (c.id === editingId ? data : c)));
      } else {
        const { data, error } = await supabase.from("clients").insert(form).select().single();
        if (error) throw error;
        setClients((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar activeId="clients" />
      <main className="dashboard-main">
        <Topbar title="Clients" subtitle="Your clients, added and managed by Admin." />

        <div className="card employees-card">
          <div className="employees-card__header">
            <h3>Clients</h3>
            {isAdmin ? (
              <button className="btn btn--primary btn--sm" onClick={openAdd}>
                <Plus size={14} /> Add Client
              </button>
            ) : (
              <span className="view-only-note">View only</span>
            )}
          </div>

          {loadError && <p className="login-card__error">{loadError}</p>}

          <div className="table-scroll">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Deadline</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="employees-table__name">{client.name}</td>
                  <td>{client.company}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td><span className="employees-table__status">{client.status}</span></td>
                  <td>{formatDeadlineCell(client.deadline)}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn--ghost btn--sm" onClick={() => openEdit(client)}>
                        <Pencil size={13} /> Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {loaded && clients.length === 0 && !loadError && (
                <tr><td colSpan={isAdmin ? 7 : 6} style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "24px" }}>No clients yet{isAdmin ? " — add your first one above." : "."}</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {modalOpen && isAdmin && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <div>
                  <p className="modal__title">{editingId ? "Edit Client" : "Add Client"}</p>
                  <p className="modal__subtitle">Client records are visible to everyone, editable by Admin only.</p>
                </div>
                <button className="modal__close" onClick={() => setModalOpen(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="field">
                  <label>Client name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ramesh Traders" />
                </div>
                <div className="field">
                  <label>Company</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@example.com" />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 90000 00000" />
                </div>
                <div className="field">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg)", fontSize: "13.5px" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="field">
                  <label>Project deadline</label>
                  <input type="date" value={form.deadline || ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  <p className="field__hint">You'll get a notification as this date approaches.</p>
                </div>
                {formError && <p className="login-card__error">{formError}</p>}
                <div className="modal__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add client"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
