"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabaseClient";
import { computeStageDistribution } from "@/data/mockData";
import "./StageDistribution.css";

export default function StageDistribution() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: rows, error } = await supabase.from("products").select("*");
      if (!mounted) return;
      if (!error) setData(computeStageDistribution(rows || []));
      setLoaded(true);
    };

    load();

    const channel = supabase
      .channel("stage-distribution-products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="stage-distribution card">
      <h3 className="stage-distribution__title">Product Stage Distribution</h3>

      {!loaded && (
        <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>Loading...</p>
      )}

      <div className="stage-distribution__chart">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="stage-distribution__legend">
        {data.map((entry) => (
          <li key={entry.name} className="stage-distribution__legend-item">
            <span className="stage-distribution__dot" style={{ background: entry.color }} />
            <span className="stage-distribution__legend-label">{entry.name}</span>
            <span className="stage-distribution__legend-value">
              {entry.value} ({total ? Math.round((entry.value / total) * 100) : 0}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}