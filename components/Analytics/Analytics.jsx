"use client";

import { Box, Download, Users, Handshake, TrendingUp, TrendingDown } from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import {
    analyticsKpis,
    growthTrend,
    productComparison,
    retentionRanking,
} from "@/data/mockData";
import "./Analytics.css";

const ICONS = {
    box: Box,
    download: Download,
    users: Users,
    handshake: Handshake,
};

function GrowthTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip__label">{label}</p>
            {payload.map((p) => (
                <p key={p.dataKey} className="analytics-tooltip__row">
                    <span className="analytics-tooltip__dot" style={{ background: p.color }} />
                    {p.name}: {p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
}

export default function Analytics() {
    return (
        <div className="dashboard-shell">
            <Sidebar activeId="analytics" />

            <main className="dashboard-main">
                <Topbar />

                <section className="analytics-kpis">
                    {analyticsKpis.map((kpi) => {
                        const Icon = ICONS[kpi.icon];
                        return (
                            <div className="analytics-kpi card" key={kpi.id}>
                                <div className={`analytics-kpi__icon analytics-kpi__icon--${kpi.tone}`}>
                                    {Icon && <Icon size={18} strokeWidth={2} />}
                                </div>
                                <div className="analytics-kpi__body">
                                    <p className="analytics-kpi__label">{kpi.label}</p>
                                    <p className="analytics-kpi__value">{kpi.value}</p>
                                    <p
                                        className={`analytics-kpi__footnote ${kpi.trend === "up" ? "analytics-kpi__footnote--up" : "analytics-kpi__footnote--down"
                                            }`}
                                    >
                                        {kpi.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {kpi.footnote}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="analytics-grid">
                    <div className="analytics-chart card">
                        <h3 className="analytics-chart__title">Growth Trend</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={growthTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="installsFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6c4ff5" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#6c4ff5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="activeUsersFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#16a34a" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
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
                                <Tooltip content={<GrowthTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={28}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: 12.5, color: "#8a8a9c" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="installs"
                                    name="Installs"
                                    stroke="#6c4ff5"
                                    strokeWidth={2.5}
                                    fill="url(#installsFill)"
                                    dot={{ r: 3, fill: "#6c4ff5", strokeWidth: 0 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="activeUsers"
                                    name="Active Users"
                                    stroke="#16a34a"
                                    strokeWidth={2.5}
                                    fill="url(#activeUsersFill)"
                                    dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }}
                                    activeDot={{ r: 5 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="analytics-chart card">
                        <h3 className="analytics-chart__title">Product Comparison</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={productComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#f0f0f5" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11.5, fill: "#8a8a9c" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#8a8a9c" }}
                                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
                                />
                                <Tooltip content={<GrowthTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={28}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: 12.5, color: "#8a8a9c" }}
                                />
                                <Bar dataKey="installs" name="Installs" fill="#6c4ff5" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="activeUsers" name="Active Users" fill="#16a34a" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="analytics-retention card">
                    <h3 className="analytics-chart__title">Retention Ranking</h3>
                    <ul className="analytics-retention__list">
                        {retentionRanking.map((item) => (
                            <li key={item.name} className="analytics-retention__row">
                                <span className="analytics-retention__name">{item.name}</span>
                                <div className="analytics-retention__bar-track">
                                    <div
                                        className="analytics-retention__bar-fill"
                                        style={{
                                            width: `${Math.min(item.retention, 100)}%`,
                                            background: item.color,
                                        }}
                                    />
                                </div>
                                <span className="analytics-retention__value">{item.retention}%</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}