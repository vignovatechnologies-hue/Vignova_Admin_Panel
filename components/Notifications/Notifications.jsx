"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import { useNotifications } from "@/lib/notifications";
import { BellOff } from "lucide-react";
import "@/components/Dashboard/Dashboard.css";
import "@/components/Employees/Employees.css";
import "./Notifications.css";

export default function Notifications() {
  const { notifications, loaded, markAllSeen } = useNotifications();

  return (
    <div className="dashboard-shell">
      <Sidebar activeId="notifications" />
      <main className="dashboard-main">
        <Topbar title="Notifications" subtitle="Client deadlines that need your attention." />

        <div className="card employees-card">
          <div className="employees-card__header">
            <h3>All notifications</h3>
            {notifications.length > 0 && (
              <button className="btn btn--ghost btn--sm" onClick={markAllSeen}>
                Mark all as read
              </button>
            )}
          </div>

          {!loaded ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 13, padding: "24px", textAlign: "center" }}>
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">
              <BellOff size={28} color="var(--color-employee)" />
              <p className="employees-restricted__title">No more notifications</p>
              <p className="employees-restricted__text">
                You're all caught up. New alerts about client deadlines will show up here.
              </p>
            </div>
          ) : (
            <ul className="notifications-list">
              {notifications.map((n) => (
                <li key={n.id} className="notifications-list__item">
                  <span className={`topbar__notif-dot topbar__notif-dot--${n.tone}`} />
                  <div className="notifications-list__body">
                    <p className="notifications-list__text">{n.text}</p>
                    <p className="notifications-list__time">{n.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
