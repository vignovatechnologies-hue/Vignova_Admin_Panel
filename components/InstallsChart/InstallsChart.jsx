"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { installsOverview } from "@/data/mockData";
import "./InstallsChart.css";

const TABS = ["Daily", "Weekly", "Monthly"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="installs-chart__tooltip">
      <p className="installs-chart__tooltip-date">{label}, 2024</p>
      <p className="installs-chart__tooltip-value">
        <span className="installs-chart__tooltip-dot" />
        Installs: {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function InstallsChart({ data = installsOverview }) {
  const [activeTab, setActiveTab] = useState("Daily");

  return (
    <div className="installs-chart card">
      <div className="installs-chart__header">
        <h3>Installs Overview</h3>
        <div className="installs-chart__tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`installs-chart__tab ${activeTab === tab ? "installs-chart__tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="installs-chart__body">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="installsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6c4ff5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6c4ff5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f0f0f5" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#8a8a9c" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#8a8a9c" }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="installs"
              stroke="#6c4ff5"
              strokeWidth={2.5}
              fill="url(#installsFill)"
              dot={{ r: 3, fill: "#6c4ff5", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
