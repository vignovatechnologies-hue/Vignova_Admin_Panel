"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRole } from "@/lib/RoleContext";
import "./ProductCards.css";

const STATUS_CLASS = {
  "In Progress": "product-card__status--progress",
  Development: "product-card__status--dev",
  Testing: "product-card__status--testing",
  Planning: "product-card__status--planning",
  Live: "product-card__status--live",
};

const STATUS_OPTIONS = ["Planning", "Development", "Testing", "In Progress", "Live"];
const EMPTY_FORM = {
  display_name: "",
  code: "",
  name: "",
  status: "Planning",
  version: "",
  target_launch: "",
  progress: 0,
  installs: "0",
  active_users: "0",
  tone: "purple",
};

export default function ProductCards() {
  const { isAdmin } = useRole();
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      setLoadError(error.message);
    } else {
      setProducts(data || []);
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setForm({ ...product });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("products")
          .update({
            display_name: form.display_name,
            code: form.code,
            name: form.name,
            status: form.status,
            progress: form.progress,
            target_launch: form.target_launch,
          })
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        setProducts((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        const slug = form.display_name.toLowerCase().replace(/\s+/g, "-") || `product-${Date.now()}`;
        const { data, error } = await supabase
          .from("products")
          .insert({ ...form, slug })
          .select()
          .single();
        if (error) throw error;
        setProducts((prev) => [...prev, data]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="product-cards card">
      <div className="product-cards__header">
        <h3 className="product-cards__title">All Products</h3>
        {isAdmin ? (
          <button className="btn btn--primary btn--sm" onClick={openAddModal}>
            <Plus size={14} /> Add Product
          </button>
        ) : (
          <span className="view-only-note">View only</span>
        )}
      </div>

      {loadError && <p className="login-card__error">{loadError}</p>}
      {!loaded && <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>Loading products...</p>}

      <div className="product-cards__grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card__top">
              <span className={`product-card__badge product-card__badge--${product.tone}`}>
                {product.code}
              </span>
              <div className="product-card__top-right">
                <span className={`product-card__status ${STATUS_CLASS[product.status] || ""}`}>
                  {product.status}
                </span>
                {isAdmin && (
                  <button
                    className="product-card__edit"
                    onClick={() => openEditModal(product)}
                    aria-label={`Edit ${product.display_name}`}
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </div>
            </div>

            <Link href={`/products/${product.slug}`} className="product-card__name">
              {product.display_name || product.code}
            </Link>
            <p className="product-card__desc">{product.name}</p>

            <div className="product-card__stats">
              <div>
                <p className="product-card__stat-label">Installs</p>
                <p className="product-card__stat-value">{product.installs}</p>
              </div>
              <div>
                <p className="product-card__stat-label">Active Users</p>
                <p className="product-card__stat-value">{product.active_users}</p>
              </div>
              <div>
                <p className="product-card__stat-label">Progress</p>
                <p className="product-card__stat-value">{product.progress}%</p>
              </div>
            </div>

            <div className="product-card__progress-track">
              <div className="product-card__progress-fill" style={{ width: `${product.progress}%` }} />
            </div>

            <div className="product-card__meta">
              <span>Version: {product.version}</span>
              <span>Target Launch: {product.target_launch}</span>
            </div>

            <Link href={`/products/${product.slug}`} className="product-card__cta">
              View Details
            </Link>
          </div>
        ))}

        {loaded && products.length === 0 && !loadError && (
          <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
            No products yet. {isAdmin ? "Add your first one above." : ""}
          </p>
        )}
      </div>

      {modalOpen && isAdmin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <p className="modal__title">{editingId ? "Edit Product" : "Add Product"}</p>
                <p className="modal__subtitle">
                  {editingId ? "Update this product's details." : "Add a new product to the roadmap."}
                </p>
              </div>
              <button className="modal__close" onClick={closeModal} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="field">
                <label>Product name</label>
                <input
                  required
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  placeholder="e.g. V_Stay"
                />
              </div>
              <div className="field">
                <label>Code</label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. VS"
                />
              </div>
              <div className="field">
                <label>Description</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Short description"
                />
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                    fontSize: "13.5px",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label>Target launch</label>
                <input
                  value={form.target_launch}
                  onChange={(e) => setForm({ ...form, target_launch: e.target.value })}
                  placeholder="e.g. Aug 2026"
                />
              </div>

              {formError && <p className="login-card__error">{formError}</p>}

              <div className="modal__actions">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
