"use client";

import { useEffect, useState } from "react";
import { getVConnectStats } from "@/lib/vconnectStats.js";
import { supabase } from "@/lib/supabaseClient";

import Link from "next/link";
import {
    ArrowLeft,
    Download,
    Users,
    UserRound,
    TrendingUp,
    Check,
} from "lucide-react";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import {
    computeRoadmapSteps,
    upcomingMilestones,
} from "@/data/mockData";
import "./ProductDetail.css";

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

    useEffect(() => {
        let mounted = true;
        supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single()
            .then(({ data }) => {
                if (!mounted) return;
                setProduct(data || null);
                setLoaded(true);
            });
        return () => { mounted = false; };
    }, [slug]);

    useEffect(() => {
        if (product?.slug === "vconnect") {
            setLoadingStats(true);
            getVConnectStats()
                .then(setLiveStats)
                .finally(() => setLoadingStats(false));
        }
    }, [product?.slug]);

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

    const displayName = product.display_name || product.code;
    const roadmap = { steps: computeRoadmapSteps(product) };
    const milestones = upcomingMilestones.filter((m) =>
        m.title.toLowerCase().includes(`(${displayName.toLowerCase()})`)
    );

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

                    <p className="product-detail__desc">{product.description}</p>

                    <div className="product-detail__stats">
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
                    </div>

                    <div className="product-detail__progress-track">
                        <div
                            className="product-detail__progress-fill"
                            style={{ width: `${product.progress}%` }}
                        />
                    </div>

                    <div className="product-detail__meta">
                        <span>Version: {product.version}</span>
                        <span>Target Launch: {product.target_launch}</span>
                    </div>
                </div>

                {product.slug === "vconnect" && (
                    <div className="card product-detail__signups">
                        <div className="product-detail__signups-header">
                            <h3>Signups by Category</h3>
                            {liveStats && (
                                <span className="product-detail__signups-total">
                                    {liveStats.total} total submissions
                                </span>
                            )}
                        </div>

                        {loadingStats && <p className="product-detail__empty-text">Loading live data…</p>}

                        {!loadingStats && liveStats && (
                            <div className="product-detail__signups-grid">
                                {liveStats.breakdown.map((item) => (
                                    <div className="product-detail__signup-card" key={item.key}>
                                        <p className="product-detail__signup-label">{item.label}</p>
                                        <p className="product-detail__signup-value">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                        )}
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