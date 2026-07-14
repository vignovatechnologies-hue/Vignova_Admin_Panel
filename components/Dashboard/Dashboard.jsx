"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import StatCards from "@/components/StatCards/StatCards";
import InstallsChart from "@/components/InstallsChart/InstallsChart";
import ActiveUsersChart from "@/components/ActiveUsersChart/ActiveUsersChart";
import StageDistribution from "@/components/StageDistribution/StageDistribution";
import RecentNotifications from "@/components/RecentNotifications/RecentNotifications";
import ProductCards from "@/components/ProductCards/ProductCards";
import RoadmapOverview from "@/components/RoadmapOverview/RoadmapOverview";
import UpcomingMilestones from "@/components/UpcomingMilestones/UpcomingMilestones";
import CollaborationsSummary from "@/components/CollaborationsSummary/CollaborationsSummary";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-shell">
      <Sidebar activeId="dashboard" />

      <main className="dashboard-main">
        <Topbar />

        <StatCards />

        <section className="dashboard-grid dashboard-grid--charts">
          <InstallsChart />
          <ActiveUsersChart />
          <StageDistribution />
        </section>

        <ProductCards />

        <section className="dashboard-grid dashboard-grid--bottom">
          <RoadmapOverview />
          <UpcomingMilestones />
          <CollaborationsSummary />
        </section>
      </main>
    </div>
  );
}
