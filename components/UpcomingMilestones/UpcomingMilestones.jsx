"use client";

import { Flag } from "lucide-react";
import { upcomingMilestones } from "@/data/mockData";
import "./UpcomingMilestones.css";

export default function UpcomingMilestones({ items = upcomingMilestones }) {
  return (
    <div className="milestones card">
      <div className="milestones__header">
        <h3>
          Upcoming Milestones <span className="milestones__header-sub">(Next 30 Days)</span>
        </h3>
      </div>

      <ul className="milestones__list">
        {items.map((item) => (
          <li className="milestones__item" key={item.id}>
            <span className="milestones__icon">
              <Flag size={13} />
            </span>

            <div className="milestones__body">
              <p className="milestones__title">{item.title}</p>
              <div className="milestones__progress-track">
                <div className="milestones__progress-fill" style={{ width: `${item.progress}%` }} />
              </div>
            </div>

            <div className="milestones__meta">
              <span className="milestones__progress-value">{item.progress}%</span>
              <span className="milestones__due">{item.due}</span>
            </div>
          </li>
        ))}
      </ul>

      <button className="milestones__view-all">View All Milestones &gt;</button>
    </div>
  );
}
