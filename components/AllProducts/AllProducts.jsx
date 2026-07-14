"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import ProductCards from "@/components/ProductCards/ProductCards";
import "@/components/Dashboard/Dashboard.css";

export default function AllProducts() {
    return (
        <div className="dashboard-shell">
            <Sidebar />

            <main className="dashboard-main">
                <Topbar
                    title="All Products"
                    subtitle="Every Vignova product, its rollout stage and how it's performing."
                />

                <ProductCards />
            </main>
        </div>
    );
}