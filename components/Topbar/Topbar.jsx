"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Calendar, ChevronDown, ChevronLeft, ChevronRight, ShieldCheck, Eye, LogOut, KeyRound, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useNotifications } from "@/lib/notifications";
import { supabase } from "@/lib/supabaseClient";
import "./Topbar.css";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PRESETS = [
  { label: "Today", getRange: () => { const d = startOfDay(new Date()); return [d, d]; } },
  { label: "Last 7 days", getRange: () => { const end = startOfDay(new Date()); const start = addDays(end, -6); return [start, end]; } },
  { label: "Last 30 days", getRange: () => { const end = startOfDay(new Date()); const start = addDays(end, -29); return [start, end]; } },
  { label: "This month", getRange: () => { const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth(), 1); const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); return [start, end]; } },
];

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}

function formatShort(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRangeLabel(start, end) {
  if (!start) return "Select date range";
  if (!end || isSameDay(start, end)) {
    return `${formatShort(start)}, ${start.getFullYear()}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${formatShort(start)} - ${formatShort(end)}, ${end.getFullYear()}`;
  }
  return `${formatShort(start)}, ${start.getFullYear()} - ${formatShort(end)}, ${end.getFullYear()}`;
}

function buildMonthGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const gridStart = addDays(firstDay, -startOffset);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }
  return cells;
}

export default function Topbar({
  title = "Dashboard Overview",
  subtitle,
  userName,
}) {
  const router = useRouter();
  const { employee, isAdmin, signOut } = useAuth();
  const { notifications, unreadCount, markAllSeen } = useNotifications();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const displayName = userName || employee?.name || (isAdmin ? "Admin" : "Employee");
  const displaySubtitle =
    subtitle ||
    (isAdmin
      ? "Welcome back, Admin! Here's what's happening with Vignova today."
      : "Welcome back! You're viewing Vignova in view-only mode.");
  const defaultEnd = startOfDay(new Date());
  const defaultStart = addDays(defaultEnd, -6);

  const [appliedRange, setAppliedRange] = useState([defaultStart, defaultEnd]);
  const [draftRange, setDraftRange] = useState([defaultStart, defaultEnd]);
  const [viewDate, setViewDate] = useState(defaultEnd);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") { setIsOpen(false); setUserMenuOpen(false); setNotifOpen(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const [changePwOpen, setChangePwOpen] = useState(false);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const openChangePassword = () => {
    setUserMenuOpen(false);
    setPw1("");
    setPw2("");
    setPwError("");
    setPwSuccess(false);
    setChangePwOpen(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pw1.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setPwSaving(false);
    if (error) {
      setPwError(error.message);
      return;
    }
    setPwSuccess(true);
  };

  const openCalendar = () => {
    setDraftRange(appliedRange);
    setViewDate(appliedRange[1] || new Date());
    setIsOpen((prev) => !prev);
  };

  const handleDayClick = (date) => {
    const [start, end] = draftRange;
    if (!start || (start && end)) {
      setDraftRange([date, null]);
    } else if (date < start) {
      setDraftRange([date, start]);
    } else {
      setDraftRange([start, date]);
    }
  };

  const handlePreset = (preset) => {
    const range = preset.getRange();
    setDraftRange(range);
    setViewDate(range[1]);
  };

  const applyRange = () => {
    const [start, end] = draftRange;
    if (start) {
      setAppliedRange([start, end || start]);
      setIsOpen(false);
    }
  };

  const cancel = () => {
    setDraftRange(appliedRange);
    setIsOpen(false);
  };

  const grid = buildMonthGrid(viewDate);
  const [draftStart, draftEnd] = draftRange;

  return (
    <header className="topbar">
      <div className="topbar__heading">
        <h1>{title}</h1>
        <p>{displaySubtitle}</p>
      </div>

      <div className="topbar__actions">
        <div className="topbar__date-wrap">
          <button
            type="button"
            ref={triggerRef}
            className={`topbar__date ${isOpen ? "topbar__date--active" : ""}`}
            onClick={openCalendar}
          >
            <Calendar size={15} />
            <span>{formatRangeLabel(appliedRange[0], appliedRange[1])}</span>
            <ChevronDown size={14} className={`topbar__date-chevron ${isOpen ? "topbar__date-chevron--open" : ""}`} />
          </button>

          {isOpen && (
            <div className="topbar__calendar" ref={popoverRef}>
              <div className="topbar__calendar-presets">
                {PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.label}
                    className="topbar__calendar-preset"
                    onClick={() => handlePreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="topbar__calendar-body">
                <div className="topbar__calendar-nav">
                  <button
                    type="button"
                    className="topbar__calendar-nav-btn"
                    onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="topbar__calendar-month">
                    {MONTH_LABELS[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </span>
                  <button
                    type="button"
                    className="topbar__calendar-nav-btn"
                    onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                    aria-label="Next month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="topbar__calendar-grid topbar__calendar-grid--labels">
                  {DAY_LABELS.map((label, i) => (
                    <span key={`${label}-${i}`}>{label}</span>
                  ))}
                </div>

                <div className="topbar__calendar-grid">
                  {grid.map(({ date, inMonth }) => {
                    const isStart = draftStart && isSameDay(date, draftStart);
                    const isEnd = draftEnd && isSameDay(date, draftEnd);
                    const inRange =
                      draftStart && draftEnd && date > draftStart && date < draftEnd;
                    const isToday = isSameDay(date, startOfDay(new Date()));

                    return (
                      <button
                        type="button"
                        key={date.toISOString()}
                        onClick={() => handleDayClick(date)}
                        className={[
                          "topbar__calendar-day",
                          !inMonth && "topbar__calendar-day--muted",
                          (isStart || isEnd) && "topbar__calendar-day--selected",
                          inRange && "topbar__calendar-day--inrange",
                          isToday && "topbar__calendar-day--today",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="topbar__calendar-footer">
                <span className="topbar__calendar-range-preview">
                  {draftStart ? formatShort(draftStart) : "Start"} &rarr;{" "}
                  {draftEnd ? formatShort(draftEnd) : "End"}
                </span>
                <div className="topbar__calendar-footer-actions">
                  <button type="button" className="topbar__calendar-cancel" onClick={cancel}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="topbar__calendar-apply"
                    onClick={applyRange}
                    disabled={!draftStart}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="topbar__search">
          <Search size={15} />
          <input type="text" placeholder="Search anything..." />
        </div>

        <div className="topbar__notif-wrap" ref={notifRef}>
          <button
            className="topbar__icon-btn"
            onClick={() => {
              setNotifOpen((v) => !v);
              if (!notifOpen) markAllSeen();
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="topbar__icon-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="topbar__notif-menu">
              <div className="topbar__notif-menu-header">
                <p className="topbar__user-menu-name">Notifications</p>
                <p className="topbar__user-menu-email">Client deadlines coming up or overdue</p>
              </div>
              {notifications.length === 0 ? (
                <p className="topbar__notif-empty">No upcoming client deadlines. You're all caught up.</p>
              ) : (
                <ul className="topbar__notif-list">
                  {notifications.map((n) => (
                    <li key={n.id} className="topbar__notif-item">
                      <span className={`topbar__notif-dot topbar__notif-dot--${n.tone}`} />
                      <div className="topbar__notif-item-body">
                        <p className="topbar__notif-item-text">{n.text}</p>
                        <p className="topbar__notif-item-time">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className={`role-pill ${isAdmin ? "role-pill--admin" : "role-pill--employee"}`}>
          {isAdmin ? <ShieldCheck size={13} /> : <Eye size={13} />}
          {isAdmin ? "Admin" : "View only"}
        </div>

        <div className="topbar__user-wrap" ref={userMenuRef}>
          <button className="topbar__user" onClick={() => setUserMenuOpen((v) => !v)}>
            <span className="topbar__avatar">{displayName.charAt(0)}</span>
            <span className="topbar__user-name">{displayName}</span>
            <ChevronDown size={14} />
          </button>

          {userMenuOpen && (
            <div className="topbar__user-menu">
              <div className="topbar__user-menu-info">
                <p className="topbar__user-menu-name">{displayName}</p>
                <p className="topbar__user-menu-email">{employee?.email}</p>
              </div>
              <button className="topbar__user-menu-item topbar__user-menu-item--neutral" onClick={openChangePassword}>
                <KeyRound size={14} /> Change password
              </button>
              <button className="topbar__user-menu-item" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {changePwOpen && (
        <div className="modal-overlay" onClick={() => setChangePwOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <p className="modal__title">Change password</p>
                <p className="modal__subtitle">Update your own login password.</p>
              </div>
              <button className="modal__close" onClick={() => setChangePwOpen(false)}><X size={18} /></button>
            </div>

            {pwSuccess ? (
              <>
                <div className="login-card__success">
                  <ShieldCheck size={18} />
                  <p>Password updated successfully.</p>
                </div>
                <div className="modal__actions">
                  <button className="btn btn--primary" onClick={() => setChangePwOpen(false)}>Done</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="field">
                  <label>New password</label>
                  <input required type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} placeholder="At least 6 characters" />
                </div>
                <div className="field">
                  <label>Confirm new password</label>
                  <input required type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Re-enter password" />
                </div>
                {pwError && <p className="login-card__error">{pwError}</p>}
                <div className="modal__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setChangePwOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn--primary" disabled={pwSaving}>{pwSaving ? "Updating..." : "Update password"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}