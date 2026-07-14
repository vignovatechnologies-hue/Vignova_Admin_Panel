"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChevronDown } from "lucide-react";
import { activeUsersOverview } from "@/data/mockData";
import "./ActiveUsersChart.css";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="active-users-chart__tooltip">
      <p>{label}, 2024</p>
      <p className="active-users-chart__tooltip-value">
        Active users: {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function ActiveUsersChart({ data = activeUsersOverview }) {
  return (
    <div className="active-users-chart card">
      <div className="active-users-chart__header">
        <h3>Active Users Overview</h3>
        <button className="active-users-chart__filter">
          This Week <ChevronDown size={14} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke="#f0f0f5" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a8a9c" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#8a8a9c" }}
            tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(22,163,74,0.06)" }} />
          <Bar dataKey="users" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
