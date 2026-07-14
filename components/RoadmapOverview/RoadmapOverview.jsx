"use client";

import { Check } from "lucide-react";
import { roadmapOverview } from "@/data/mockData";
import "./RoadmapOverview.css";

const STAGE_CLASS = {
  Development: "roadmap__stage--dev",
  Testing: "roadmap__stage--testing",
  Planning: "roadmap__stage--planning",
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

export default function RoadmapOverview({ items = roadmapOverview }) {
  return (
    <div className="roadmap card">
      <h3 className="roadmap__title">Product Roadmap Overview</h3>

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
              <span className={`roadmap__product-tag roadmap__product-tag--${item.id}`}>
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
