"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const SEEN_KEY = "vignova_notifications_seen_ids";

function daysUntil(dateStr) {
  const due = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((due - today) / 86400000);
}

function loadSeenIds() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSeenIds(ids) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
}

/**
 * Builds real, live notifications from actual data (currently: client
 * deadlines). To add another source later (e.g. milestone due dates,
 * collaboration renewals), fetch that data here and push more items
 * into `items` using the same { id, text, time, tone, dueDays } shape.
 */
export function useNotifications() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [seenIds, setSeenIds] = useState([]);

  const load = useCallback(async () => {
    setSeenIds(loadSeenIds());

    const { data: clients, error } = await supabase
      .from("clients")
      .select("id, name, company, deadline")
      .not("deadline", "is", null);

    if (error) {
      setLoaded(true);
      return;
    }

    const notifications = (clients || [])
      .map((client) => {
        const daysLeft = daysUntil(client.deadline);
        // Only surface deadlines that are meaningfully relevant: overdue,
        // or due within the next 14 days.
        if (daysLeft > 14) return null;

        const who = client.company || client.name;
        let text;
        let tone;
        if (daysLeft < 0) {
          text = `${who}'s deadline was ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} ago`;
          tone = "red";
        } else if (daysLeft === 0) {
          text = `${who}'s deadline is today`;
          tone = "red";
        } else if (daysLeft <= 3) {
          text = `${who}'s deadline is in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
          tone = "orange";
        } else {
          text = `${who}'s deadline is in ${daysLeft} days`;
          tone = "blue";
        }

        return {
          id: `client-deadline-${client.id}`,
          text,
          time: new Date(client.deadline + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          tone,
          dueDays: daysLeft,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.dueDays - b.dueDays);

    setItems(notifications);
    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = items.filter((n) => !seenIds.includes(n.id)).length;

  const markAllSeen = useCallback(() => {
    const ids = items.map((n) => n.id);
    setSeenIds(ids);
    saveSeenIds(ids);
  }, [items]);

  return { notifications: items, loaded, unreadCount, markAllSeen, refresh: load };
}
