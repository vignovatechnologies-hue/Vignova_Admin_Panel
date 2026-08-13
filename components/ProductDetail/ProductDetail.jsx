"use client";

import { useEffect, useState, useMemo } from "react";
import { getVConnectStats, getVConnectCategorySubmissions } from "@/lib/vconnectStats.js";
import { supabase } from "@/lib/supabaseClient";

import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Users,
    UserRound,
    TrendingUp,
    Check,
    RefreshCw,
    Search,
    X,
    Eye,
    UserCheck,
    Code,
    Building2,
    FolderKanban,
    ShoppingBag,
    Sparkles,
    Briefcase,
    Layers,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import {
    products as mockProducts,
    computeRoadmapSteps,
    upcomingMilestones,
} from "@/data/mockData";
import "./ProductDetail.css";

const CATEGORY_ICONS = {
    "user-check": UserCheck,
    "code": Code,
    "building-2": Building2,
    "folder-kanban": FolderKanban,
    "shopping-bag": ShoppingBag,
    "sparkles": Sparkles,
    "briefcase": Briefcase,
    "users": Users,
};

const STATUS_CLASS = {
    "In Progress": "product-detail__status--progress",
    Development: "product-detail__status--dev",
    Testing: "product-detail__status--testing",
    Planning: "product-detail__status--planning",
    Live: "product-detail__status--live",
};

const STEPS = ["idea", "design", "development", "testing", "launch"];

function StepDot({ state }) {
    if (state === true) {
        return (
            <span className="product-detail__step product-detail__step--done">
                <Check size={11} strokeWidth={3} />
            </span>
        );
    }
    if (state === "current") {
        return <span className="product-detail__step product-detail__step--current" />;
    }
    return <span className="product-detail__step product-detail__step--pending" />;
}

export default function ProductDetail({ slug }) {
    const [product, setProduct] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [liveStats, setLiveStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    // Modal state for viewing detailed category submissions
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRowDetail, setSelectedRowDetail] = useState(null);

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const stats = await getVConnectStats();
            setLiveStats(stats);
        } catch (err) {
            console.error("Failed to load live VConnect stats:", err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single()
            .then(({ data }) => {
                if (!mounted) return;
                const found = data || mockProducts.find(p => p.slug === slug);
                setProduct(found || null);
                setLoaded(true);
            })
            .catch(() => {
                if (!mounted) return;
                const found = mockProducts.find(p => p.slug === slug);
                setProduct(found || null);
                setLoaded(true);
            });
        return () => { mounted = false; };
    }, [slug]);

    useEffect(() => {
        if (product?.slug === "vconnect") {
            fetchStats();
        }
    }, [product?.slug]);

    const handleCategoryClick = async (item) => {
        setSelectedCategory(item);
        setSearchQuery("");
        setSelectedRowDetail(null);
        setLoadingSubmissions(true);
        try {
            const data = await getVConnectCategorySubmissions(item.tableName);
            setSubmissions(data);
        } catch (err) {
            console.error(`Error opening category modal for ${item.tableName}:`, err);
            setSubmissions([]);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setSubmissions([]);
        setSearchQuery("");
        setSelectedRowDetail(null);
    };

    // Filter submissions based on search input
    const filteredSubmissions = useMemo(() => {
        if (!searchQuery.trim()) return submissions;
        const q = searchQuery.toLowerCase();
        return submissions.filter((row) =>
            Object.values(row).some((val) =>
                String(val || "").toLowerCase().includes(q)
            )
        );
    }, [submissions, searchQuery]);

    if (!loaded) {
        return (
            <div className="dashboard-shell">
                <Sidebar />
                <main className="dashboard-main">
                    <Topbar title="Loading..." subtitle="" />
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="dashboard-shell">
                <Sidebar />
                <main className="dashboard-main">
                    <Topbar title="Product not found" subtitle="We couldn't find that product." />
                    <div className="card product-detail__empty">
                        <p>This product doesn&apos;t exist yet.</p>
                        <Link href="/products" className="product-detail__back">
                            <ArrowLeft size={14} /> Back to All Products
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const displayName = product.display_name || product.displayName || product.code;
    const roadmap = { steps: computeRoadmapSteps(product) };
    const milestones = upcomingMilestones.filter((m) =>
        m.title.toLowerCase().includes(`(${displayName.toLowerCase()})`)
    );

    // Compute metrics specifically for VConnect vs standard products
    const isVConnect = product.slug === "vconnect";
    const totalSubmissions = liveStats ? liveStats.total : 1;
    const clientProjectsItem = liveStats?.breakdown?.find(b => b.tableName === "vconnect_client_projects");
    const clientProjectsCount = clientProjectsItem ? clientProjectsItem.count : 1;

    return (
        <div className="dashboard-shell">
            <Sidebar />

            <main className="dashboard-main">
                <Topbar
                    title={displayName}
                    subtitle={product.name}
                />

                <Link href="/products" className="product-detail__back">
                    <ArrowLeft size={14} /> All Products
                </Link>

                <div className="card product-detail__hero">
                    <div className="product-detail__hero-top">
                        <div className="product-detail__identity">
                            <span className={`product-detail__badge product-detail__badge--${product.tone}`}>
                                {product.code}
                            </span>
                            <div>
                                <div className="product-detail__name-row">
                                    <h2>{displayName}</h2>
                                    <span className={`product-detail__status ${STATUS_CLASS[product.status] || ""}`}>
                                        {product.status}
                                    </span>
                                </div>
                                <p className="product-detail__subtitle">{product.name}</p>
                            </div>
                        </div>
                    </div>

                    <p className="product-detail__desc">
                        {isVConnect
                            ? "Professional networking & talent platform connecting candidates, freelancers, founders, client projects, AI buyers, and creators."
                            : product.description}
                    </p>

                    <div className="product-detail__stats">
                        {isVConnect ? (
                            <>
                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--green">
                                        <Layers size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Form Categories</p>
                                        <p className="product-detail__stat-value">8 Forms</p>
                                    </div>
                                </div>

                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--blue">
                                        <Briefcase size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Client Projects</p>
                                        <p className="product-detail__stat-value">{clientProjectsCount} {clientProjectsCount === 1 ? "Project" : "Projects"}</p>
                                    </div>
                                </div>

                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--orange">
                                        <UserRound size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Total Submissions</p>
                                        <p className="product-detail__stat-value">{totalSubmissions}</p>
                                    </div>
                                </div>

                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--purple">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Progress</p>
                                        <p className="product-detail__stat-value">100%</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--green">
                                        <Download size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Installs</p>
                                        <p className="product-detail__stat-value">{product.installs}</p>
                                    </div>
                                </div>

                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--blue">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Active Users</p>
                                        <p className="product-detail__stat-value">{product.active_users}</p>
                                    </div>
                                </div>

                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--orange">
                                        <UserRound size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Total Users</p>
                                        <p className="product-detail__stat-value">{product.total_users}</p>
                                    </div>
                                </div>

                                <div className="product-detail__stat">
                                    <div className="product-detail__stat-icon product-detail__stat-icon--purple">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <p className="product-detail__stat-label">Progress</p>
                                        <p className="product-detail__stat-value">{product.progress}%</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="product-detail__progress-track">
                        <div
                            className="product-detail__progress-fill"
                            style={{ width: `${isVConnect ? 100 : product.progress}%` }}
                        />
                    </div>

                    <div className="product-detail__meta">
                        <span>Version: {product.version || "1.0.0 (Live)"}</span>
                        <span>Target Launch: {product.target_launch || "Live"}</span>
                    </div>
                </div>

                {isVConnect && (
                    <div className="card product-detail__signups">
                        <div className="product-detail__signups-header">
                            <div>
                                <h3>VConnect Form Submissions & Live Counts</h3>
                                <p className="product-detail__signups-subtext">
                                    Click any category card to view full member registration details from Supabase.
                                </p>
                            </div>

                            <div className="product-detail__signups-actions">
                                {liveStats && (
                                    <span className="product-detail__signups-total">
                                        {liveStats.total} Total Submissions
                                    </span>
                                )}
                                <button
                                    className="product-detail__refresh-btn"
                                    onClick={fetchStats}
                                    disabled={loadingStats}
                                    title="Refresh live counts from Supabase"
                                >
                                    <RefreshCw size={14} className={loadingStats ? "spin" : ""} />
                                    {loadingStats ? "Refreshing..." : "Refresh Counts"}
                                </button>
                            </div>
                        </div>

                        {loadingStats && !liveStats && (
                            <p className="product-detail__empty-text">Loading live data from Supabase...</p>
                        )}

                        {liveStats && (
                            <div className="product-detail__signups-grid">
                                {liveStats.breakdown.map((item) => {
                                    const IconComponent = CATEGORY_ICONS[item.icon] || Users;
                                    return (
                                        <div
                                            className="product-detail__signup-card"
                                            key={item.key}
                                            onClick={() => handleCategoryClick(item)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === "Enter" && handleCategoryClick(item)}
                                        >
                                            <div className="product-detail__signup-card-top">
                                                <div className="product-detail__signup-icon-box">
                                                    <IconComponent size={18} />
                                                </div>
                                                <span className="product-detail__signup-count-badge">
                                                    {item.count} {item.count === 1 ? "entry" : "entries"}
                                                </span>
                                            </div>

                                            <div className="product-detail__signup-card-body">
                                                <h4>{item.label}</h4>
                                                <p>{item.description}</p>
                                            </div>

                                            <div className="product-detail__signup-card-footer">
                                                <span>View Member Details</span>
                                                <Eye size={14} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Submissions Detail Modal */}
                {selectedCategory && (
                    <div className="vconnect-modal-backdrop" onClick={closeModal}>
                        <div className="vconnect-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="vconnect-modal-header">
                                <div>
                                    <h3>{selectedCategory.label} Submissions</h3>
                                    <p className="vconnect-modal-subtitle">
                                        Supabase Table: <code>{selectedCategory.tableName}</code> &bull; Total: {submissions.length} {submissions.length === 1 ? "entry" : "entries"}
                                    </p>
                                </div>
                                <button className="vconnect-modal-close" onClick={closeModal}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="vconnect-modal-toolbar">
                                <div className="vconnect-modal-search">
                                    <Search size={15} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone, skills, role..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button className="vconnect-modal-clear-search" onClick={() => setSearchQuery("")}>
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="vconnect-modal-body">
                                {loadingSubmissions ? (
                                    <div className="vconnect-modal-loading">
                                        <RefreshCw size={24} className="spin" />
                                        <p>Fetching records from Supabase...</p>
                                    </div>
                                ) : filteredSubmissions.length === 0 ? (
                                    <div className="vconnect-modal-empty">
                                        <Users size={32} />
                                        <p>
                                            {submissions.length === 0
                                                ? `No members have filled out the form for ${selectedCategory.label} yet.`
                                                : "No matching records found for your search query."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="vconnect-table-container">
                                        <table className="vconnect-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Contact / Name</th>
                                                    <th>Email</th>
                                                    <th>Phone / Category</th>
                                                    <th>Title / Role / Skills</th>
                                                    <th>Submitted At</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredSubmissions.map((row, idx) => {
                                                    const name = row.name || row.contact_name || row.full_name || row.company_name || row.first_name || "N/A";
                                                    const email = row.email || "N/A";
                                                    const phone = row.phone || row.phone_number || row.category || "N/A";
                                                    const details = row.project_title || row.role || row.skills || row.title || row.description || "N/A";
                                                    const dateVal = row.submitted_at || row.created_at || row.date;
                                                    const formattedDate = dateVal ? new Date(dateVal).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }) : "N/A";

                                                    return (
                                                        <tr key={row.id || idx}>
                                                            <td>{idx + 1}</td>
                                                            <td className="vconnect-td-name">{name}</td>
                                                            <td className="vconnect-td-email">{email}</td>
                                                            <td>{phone}</td>
                                                            <td className="vconnect-td-details">{details}</td>
                                                            <td className="vconnect-td-date">{formattedDate}</td>
                                                            <td>
                                                                <button
                                                                    className="vconnect-view-row-btn"
                                                                    onClick={() => setSelectedRowDetail(row)}
                                                                >
                                                                    <Eye size={13} /> View All
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Single Row Full Inspection View */}
                                {selectedRowDetail && (
                                    <div className="vconnect-row-detail-panel">
                                        <div className="vconnect-row-detail-header">
                                            <h4>Full Record Details</h4>
                                            <button onClick={() => setSelectedRowDetail(null)}>
                                                <X size={14} /> Close Preview
                                            </button>
                                        </div>
                                        <div className="vconnect-row-detail-grid">
                                            {Object.entries(selectedRowDetail).map(([key, val]) => (
                                                <div key={key} className="vconnect-row-detail-item">
                                                    <span className="vconnect-detail-key">{key}:</span>
                                                    <span className="vconnect-detail-val">
                                                        {typeof val === "object" ? JSON.stringify(val) : String(val ?? "N/A")}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="product-detail__grid">
                    {roadmap ? (
                        <div className="card product-detail__roadmap">
                            <h3>Roadmap Stage</h3>
                            <div className="product-detail__roadmap-row">
                                <span className="product-detail__roadmap-stage">{roadmap.stage}</span>
                                <div className="product-detail__roadmap-steps">
                                    {STEPS.map((step) => (
                                        <div key={step} className="product-detail__roadmap-step-wrap">
                                            <StepDot state={roadmap.steps[step]} />
                                            <span>{step[0].toUpperCase() + step.slice(1)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card product-detail__roadmap">
                            <h3>Roadmap Stage</h3>
                            <p className="product-detail__empty-text">
                                No roadmap breakdown set up for this product yet.
                            </p>
                        </div>
                    )}

                    <div className="card product-detail__milestones">
                        <h3>Milestones</h3>
                        {milestones.length > 0 ? (
                            <ul className="product-detail__milestones-list">
                                {milestones.map((m) => (
                                    <li key={m.id}>
                                        <div className="product-detail__milestone-top">
                                            <p>{m.title}</p>
                                            <span>{m.due}</span>
                                        </div>
                                        <div className="product-detail__progress-track product-detail__progress-track--sm">
                                            <div
                                                className="product-detail__progress-fill"
                                                style={{ width: `${m.progress}%` }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="product-detail__empty-text">No milestones scheduled yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}