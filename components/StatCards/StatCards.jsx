"use client";

import { Box, Download, Users, UserRound, Handshake, TrendingUp } from "lucide-react";
import { statCards } from "@/data/mockData";
import "./StatCards.css";

const ICONS = {
  box: Box,
  download: Download,
  users: Users,
  "user-round": UserRound,
  handshake: Handshake,
};

export default function StatCards({ items = statCards }) {
  return (
    <section className="stat-cards">
      {items.map((card) => {
        const Icon = ICONS[card.icon];
        return (
          <div className="stat-card" key={card.id}>
            <div className={`stat-card__icon stat-card__icon--${card.tone}`}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div className="stat-card__body">
              <p className="stat-card__label">{card.label}</p>
              <p className="stat-card__value">{card.value}</p>
              <p className={`stat-card__footnote ${card.trend === "up" ? "stat-card__footnote--up" : ""}`}>
                {card.trend === "up" && <TrendingUp size={12} />}
                {card.footnote}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
