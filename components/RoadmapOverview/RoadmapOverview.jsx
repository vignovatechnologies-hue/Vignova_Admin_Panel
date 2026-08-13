"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { computeRoadmapOverview } from "@/data/mockData";
import "./RoadmapOverview.css";

const STAGE_CLASS = {
  Development: "roadmap__stage--dev",
  Testing: "roadmap__stage--testing",
  Planning: "roadmap__stage--planning",
  Live: "roadmap__stage--live",
  "In Progress": "roadmap__stage--progress",
};

const TONE_COLORS = {
  dark: "#1c1b2e",
  purple: "#8b5cf6",
  pink: "#ec4899",
  green: "#16a34a",
  blue: "#3b82f6",
  orange: "#f59e0b",
  red: "#ef4444",
};

const STEPS = ["idea", "design", "development", "testing", "launch"];

function StepDot({ state }) {
  if (state === true) {
    return (
      <span className="roadmap__step roadmap__step--done">
        <Check size={11} strokeWidth={3} />
      </span>
    );
  }
  if (state === "current") {
    return <span className="roadmap__step roadmap__step--current" />;
  }
  return <span className="roadmap__step roadmap__step--pending" />;
}

export default function RoadmapOverview() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (!mounted) return;
      if (!error) setItems(computeRoadmapOverview(data || []));
      setLoaded(true);
    };

    load();

    // Keep the roadmap in sync whenever a product is added/edited elsewhere
    // (e.g. from the Add Product modal on the dashboard) without a full reload.
    const channel = supabase
      .channel("roadmap-products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="roadmap card">
      <h3 className="roadmap__title">Product Roadmap Overview</h3>

      {!loaded && (
        <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>Loading roadmap...</p>
      )}

      <div className="roadmap__table">
        <div className="roadmap__row roadmap__row--head">
          <span>Product</span>
          <span>Stage</span>
          <span>Overall Progress</span>
          {STEPS.map((step) => (
            <span key={step} className="roadmap__step-head">
              {step[0].toUpperCase() + step.slice(1)}
            </span>
          ))}
        </div>

        {items.map((item) => (
          <div className="roadmap__row" key={item.id}>
            <span className="roadmap__product">
              <span
                className="roadmap__product-tag"
                style={{ background: TONE_COLORS[item.tone] || "#6c4ff5" }}
              >
                {item.code}
              </span>
              {item.name}
            </span>

            <span>
              <span className={`roadmap__stage ${STAGE_CLASS[item.stage] || ""}`}>{item.stage}</span>
            </span>

            <span className="roadmap__progress">
              <span className="roadmap__progress-track">
                <span className="roadmap__progress-fill" style={{ width: `${item.progress}%` }} />
              </span>
              <span className="roadmap__progress-value">{item.progress}%</span>
            </span>

            {STEPS.map((step) => (
              <span key={step} className="roadmap__step-cell">
                <StepDot state={item.steps[step]} />
              </span>
            ))}
          </div>
        ))}
      </div>

      <button className="roadmap__view-all">View All Roadmaps &gt;</button>
    </div>
  );
}