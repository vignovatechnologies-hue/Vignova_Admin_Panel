"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Map,
  Handshake,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  UsersRound,
  Briefcase,
  Lightbulb,
} from "lucide-react";
import { sidebarNav } from "@/data/mockData";
import { useRole } from "@/lib/RoleContext";
import { useNotifications } from "@/lib/notifications";
import "./Sidebar.css";

const ICONS = {
  "layout-dashboard": LayoutDashboard,
  package: Package,
  "bar-chart-3": BarChart3,
  map: Map,
  handshake: Handshake,
  bell: Bell,
  settings: Settings,
  "users-round": UsersRound,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
};

function findActiveId(pathname) {
  for (const item of sidebarNav) {
    if (item.children) {
      for (const child of item.children) {
        if (pathname === child.href) return { activeId: child.id, openMenu: item.id };
      }
      if (pathname === item.href) return { activeId: item.id, openMenu: item.id };
    } else if (pathname === item.href) {
      return { activeId: item.id, openMenu: null };
    }
  }
  return { activeId: "dashboard", openMenu: null };
}

export default function Sidebar({ activeId: activeIdProp }) {
  const pathname = usePathname();
  const { isAdmin } = useRole();
  const { unreadCount } = useNotifications();
  const derived = findActiveId(pathname || "/");
  const [openMenu, setOpenMenu] = useState(derived.openMenu || "products");
  const activeId = activeIdProp || derived.activeId;
  const visibleNav = sidebarNav.filter((item) => !item.adminOnly || isAdmin)
    .map((item) => (item.id === "notifications" ? { ...item, badge: unreadCount || null } : item));

  useEffect(() => {
    if (derived.openMenu) setOpenMenu(derived.openMenu);
  }, [pathname]);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">V</div>
        <div>
          <p className="sidebar__brand-name">VIGNOVA</p>
          <p className="sidebar__brand-sub">MANAGEMENT</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        <ul>
          {visibleNav.map((item) => {
            const Icon = ICONS[item.icon];
            const hasChildren = !!item.children;
            const isOpen = openMenu === item.id;
            const isActive = activeId === item.id;

            return (
              <li key={item.id} className="sidebar__item">
                {hasChildren ? (
                  <button
                    className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
                    onClick={() => setOpenMenu(isOpen ? null : item.id)}
                  >
                    <span className="sidebar__link-left">
                      <Icon size={18} strokeWidth={2} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge ? (
                      <span className="sidebar__badge">{item.badge}</span>
                    ) : (
                      isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
                  >
                    <span className="sidebar__link-left">
                      <Icon size={18} strokeWidth={2} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge ? (
                      <span className="sidebar__badge">{item.badge}</span>
                    ) : null}
                  </Link>
                )}

                {hasChildren && isOpen && (
                  <ul className="sidebar__submenu">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.href}
                          className={`sidebar__sublink ${activeId === child.id ? "sidebar__sublink--active" : ""
                            }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__footer-logo">V</div>
        <div className="sidebar__footer-text">
          <p className="sidebar__footer-title">Vignova Pvt. Ltd.</p>
          <p className={`sidebar__footer-role sidebar__footer-role--${isAdmin ? "admin" : "employee"}`}>
            {isAdmin ? "Admin access" : "View-only access"}
          </p>
        </div>
      </div>
    </aside>
  );
}