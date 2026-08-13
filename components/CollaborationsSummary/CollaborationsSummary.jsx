"use client";

import { Building2 } from "lucide-react";
import { collaborationsSummary } from "@/data/mockData";
import "./CollaborationsSummary.css";

export default function CollaborationsSummary({ items = collaborationsSummary }) {
  return (
    <div className="collab-summary card">
      <div className="collab-summary__header">
        <h3>Collaborations Summary</h3>
        <a href="#" className="collab-summary__view-all">
          View All
        </a>
      </div>

      <ul className="collab-summary__list">
        {items.map((item) => (
          <li className="collab-summary__item" key={item.id}>
            <span className="collab-summary__icon">
              <Building2 size={15} />
            </span>

            <div className="collab-summary__body">
              <p className="collab-summary__name">{item.name}</p>
              <p className="collab-summary__role">{item.role}</p>
            </div>

            <div className="collab-summary__meta">
              <span
                className={`collab-summary__status ${
                  item.status === "Active" ? "collab-summary__status--active" : "collab-summary__status--pending"
                }`}
              >
                {item.status}
              </span>
              <span className="collab-summary__since">Since {item.since}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
