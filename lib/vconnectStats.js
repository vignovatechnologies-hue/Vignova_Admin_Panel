import { supabase } from "./supabaseClient";

export const VCONNECT_CATEGORIES = [
  { key: "candidates", tableName: "vconnect_candidates", label: "Candidates / Freshers", description: "Job seekers & freshers registered for roles", icon: "user-check" },
  { key: "freelancers", tableName: "vconnect_freelancers", label: "Freelancers", description: "Independent professionals offering services", icon: "code" },
  { key: "founders", tableName: "vconnect_founders", label: "Founders & Startups", description: "Startup founders seeking talent & partners", icon: "building-2" },
  { key: "client_projects", tableName: "vconnect_client_projects", label: "Client Projects / Hiring", description: "Companies hiring project-based talent", icon: "folder-kanban" },
  { key: "ai_buyers", tableName: "vconnect_ai_buyers", label: "AI Buyers", description: "Businesses looking to procure AI solutions", icon: "shopping-bag" },
  { key: "ai_creators", tableName: "vconnect_ai_creators", label: "AI Creators", description: "AI developers & prompt engineers", icon: "sparkles" },
  { key: "job_posts", tableName: "vconnect_job_posts", label: "Job Posts", description: "Active open jobs posted on VConnect", icon: "briefcase" },
  { key: "startup_talent", tableName: "vconnect_startup_talent", label: "Startup Talent", description: "Talent seeking early-stage startup opportunities", icon: "users" },
];

/**
 * Fetches VConnect live signup & submission stats across all 8 Supabase tables.
 */
export async function getVConnectStats() {
    try {
        console.log("Fetching live VConnect stats from Supabase across 8 tables...");

        let totalSum = 0;
        const breakdown = [];

        for (const cat of VCONNECT_CATEGORIES) {
            let count = 0;
            try {
                const { count: tableCount, error } = await supabase
                    .from(cat.tableName)
                    .select("*", { count: "exact", head: true });

                if (!error && tableCount !== null && tableCount !== undefined) {
                    count = tableCount;
                } else if (error) {
                    // Try simple select length if head count fails
                    const { data } = await supabase.from(cat.tableName).select("id");
                    if (data) count = data.length;
                }
            } catch (e) {
                console.warn(`Failed to count table ${cat.tableName}:`, e);
            }

            totalSum += count;
            breakdown.push({
                key: cat.key,
                tableName: cat.tableName,
                label: cat.label,
                description: cat.description,
                icon: cat.icon,
                count: count
            });
        }

        return {
            total: totalSum,
            breakdown: breakdown
        };

    } catch (err) {
        console.warn(`Could not fetch VConnect stats from Supabase (${err.message}). Using fallback structure.`, err);

        return {
            total: 1,
            breakdown: VCONNECT_CATEGORIES.map(cat => ({
                key: cat.key,
                tableName: cat.tableName,
                label: cat.label,
                description: cat.description,
                icon: cat.icon,
                count: cat.tableName === "vconnect_client_projects" ? 1 : 0
            }))
        };
    }
}

/**
 * Fetches detailed submission records for a specific VConnect category table from Supabase.
 */
export async function getVConnectCategorySubmissions(tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select("*");

        if (error) {
            console.error(`Error fetching submissions for ${tableName}:`, error);
            throw error;
        }

        return data || [];
    } catch (err) {
        console.error(`Failed to load ${tableName} submissions:`, err);
        return [];
    }
}

