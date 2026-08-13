"use client";

import { Bell } from "lucide-react";
import { recentNotifications } from "@/data/mockData";
import "./RecentNotifications.css";

export default function RecentNotifications({ items = recentNotifications }) {
  return (
    <div className="recent-notifications card">
      <div className="recent-notifications__header">
        <h3>Recent Notifications</h3>
        <a href="#" className="recent-notifications__view-all">
          View All
        </a>
      </div>

      <ul className="recent-notifications__list">
        {items.map((item) => (
          <li className="recent-notifications__item" key={item.id}>
            <span className={`recent-notifications__icon recent-notifications__icon--${item.tone}`}>
              <Bell size={13} />
            </span>
            <span className="recent-notifications__text">{item.text}</span>
            <span className="recent-notifications__time">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
