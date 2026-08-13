"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import { supabase } from "@/lib/supabaseClient";
import { useRole } from "@/lib/RoleContext";
import { Plus, X, Pencil, Trash2, Lightbulb } from "lucide-react";
import "@/components/Dashboard/Dashboard.css";
import "./IdeaLab.css";

const STATUS_OPTIONS = ["Planning", "Exploring", "Shelved"];
const EMPTY_FORM = { title: "", description: "", status: "Planning" };

export default function IdeaLab() {
  const { isAdmin } = useRole();
  const [ideas, setIdeas] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteFor, setDeleteFor] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadIdeas = async () => {
    const { data, error } = await supabase
      .from("idea_lab")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else setIdeas(data || []);
    setLoaded(true);
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (idea) => {
    setEditingId(idea.id);
    setForm({ title: idea.title, description: idea.description || "", status: idea.status });
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
          .from("idea_lab")
          .update(form)
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        setIdeas((prev) => prev.map((i) => (i.id === editingId ? data : i)));
      } else {
        const { data, error } = await supabase.from("idea_lab").insert(form).select().single();
        if (error) throw error;
        setIdeas((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from("idea_lab").delete().eq("id", deleteFor.id);
      if (error) throw error;
      setIdeas((prev) => prev.filter((i) => i.id !== deleteFor.id));
      setDeleteFor(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <Sidebar activeId="idea-lab" />
      <main className="dashboard-main">
        <Topbar title="Future Idea Lab" subtitle="Early-stage product ideas, before they get a roadmap of their own." />

        <section className="card idea-lab">
          <div className="idea-lab__header">
            <div className="idea-lab__heading">
              <Lightbulb size={18} />
              <h3>Future Idea Lab</h3>
            </div>
            {isAdmin ? (
              <button className="btn btn--primary btn--sm" onClick={openAdd}>
                <Plus size={14} /> Add Idea
              </button>
            ) : (
              <span className="view-only-note">View only</span>
            )}
          </div>

          {loadError && <p className="login-card__error">{loadError}</p>}

          <div className="idea-lab__grid">
            {ideas.map((idea) => (
              <div className="idea-lab__card" key={idea.id}>
                <div className="idea-lab__card-top">
                  <span className={`idea-lab__status idea-lab__status--${idea.status.toLowerCase()}`}>
                    {idea.status}
                  </span>
                  {isAdmin && (
                    <div className="idea-lab__card-actions">
                      <button className="idea-lab__icon-btn" onClick={() => openEdit(idea)} aria-label="Edit idea">
                        <Pencil size={13} />
                      </button>
                      <button className="idea-lab__icon-btn idea-lab__icon-btn--danger" onClick={() => setDeleteFor(idea)} aria-label="Delete idea">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="idea-lab__title">{idea.title}</p>
                {idea.description && <p className="idea-lab__desc">{idea.description}</p>}
              </div>
            ))}

            {loaded && ideas.length === 0 && !loadError && (
              <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
                No ideas yet. {isAdmin ? "Add your first one above." : ""}
              </p>
            )}
          </div>

          {modalOpen && isAdmin && (
            <div className="modal-overlay" onClick={() => setModalOpen(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                  <div>
                    <p className="modal__title">{editingId ? "Edit Idea" : "Add Idea"}</p>
                    <p className="modal__subtitle">Capture a new product idea for the lab.</p>
                  </div>
                  <button className="modal__close" onClick={() => setModalOpen(false)}><X size={18} /></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="field">
                    <label>Idea title</label>
                    <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AI Resume Builder" />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's the idea?" />
                  </div>
                  <div className="field">
                    <label>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-bg)", fontSize: "13.5px" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {formError && <p className="login-card__error">{formError}</p>}
                  <div className="modal__actions">
                    <button type="button" className="btn btn--ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add idea"}</button>
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
                    <p className="modal__title">Delete idea</p>
                    <p className="modal__subtitle">This removes "{deleteFor.title}" permanently.</p>
                  </div>
                  <button className="modal__close" onClick={() => setDeleteFor(null)}><X size={18} /></button>
                </div>
                <div className="modal__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setDeleteFor(null)}>Cancel</button>
                  <button type="button" className="btn btn--primary" style={{ background: "var(--color-red)" }} disabled={deleting} onClick={handleDelete}>
                    {deleting ? "Deleting..." : "Delete idea"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
