export const statCards = [
  {
    id: "products",
    label: "Total Products",
    value: "1",
    footnote: "Live: 0  ·  In Progress: 1",
    icon: "box",
    tone: "purple",
  },
  {
    id: "installs",
    label: "Total Installs",
    value: "0",
    footnote: "0% this week",
    trend: "up",
    icon: "download",
    tone: "green",
  },
  {
    id: "active-users",
    label: "Total Active Users",
    value: "0",
    footnote: "0% this week",
    trend: "up",
    icon: "users",
    tone: "blue",
  },
  {
    id: "total-users",
    label: "Total Users",
    value: "0",
    footnote: "0% this week",
    trend: "up",
    icon: "user-round",
    tone: "orange",
  },
  {
    id: "collaborations",
    label: "Total Collaborations",
    value: "0",
    footnote: "Active: 0  ·  Pending: 0",
    icon: "handshake",
    tone: "red",
  },
];

export const installsOverview = [
  { day: "Jun 1", installs: 0 },
  { day: "Jun 2", installs: 0 },
  { day: "Jun 3", installs: 0 },
  { day: "Jun 4", installs: 0 },
  { day: "Jun 5", installs: 0 },
  { day: "Jun 6", installs: 0 },
  { day: "Jun 7", installs: 0 },
];

export const activeUsersOverview = [
  { day: "Jun 1", users: 0 },
  { day: "Jun 2", users: 0 },
  { day: "Jun 3", users: 0 },
  { day: "Jun 4", users: 0 },
  { day: "Jun 5", users: 0 },
  { day: "Jun 6", users: 0 },
  { day: "Jun 7", users: 0 },
];

const STAGE_COLORS = {
  Planning: "#8b5cf6",
  Development: "#3b82f6",
  Testing: "#f59e0b",
  Live: "#16a34a",
};

// Derived from `products` below so this can never fall out of sync or
// contain duplicate stage names (which caused a React "duplicate key" warning).
export function computeStageDistribution(productList) {
  const order = ["Planning", "Development", "Testing", "Live"];
  const counts = order.reduce((acc, stage) => ({ ...acc, [stage]: 0 }), {});
  productList.forEach((p) => {
    if (counts[p.status] !== undefined) counts[p.status] += 1;
  });
  return order.map((name) => ({ name, value: counts[name], color: STAGE_COLORS[name] }));
}

// The `products` table has no dedicated "steps" column, so the idea/design/
// development/testing/launch dots are derived from status + progress.
// This keeps the Roadmap Overview and Product Detail step-trackers in sync
// with whatever an admin sets in the Add/Edit Product form, instead of a
// hand-maintained list that silently drifts out of sync (and drops products).
const STAGE_ORDER = ["Planning", "Development", "Testing", "In Progress", "Live"];

export function computeRoadmapSteps(product) {
  const stageIndex = STAGE_ORDER.indexOf(product.status);
  const progress = Number(product.progress) || 0;

  return {
    idea: true, // every product that exists has passed the idea stage
    design: stageIndex >= 1 || progress >= 20,
    development: stageIndex >= 1 || progress >= 40,
    testing: stageIndex >= 2 || progress >= 80,
    launch: product.status === "Live" || progress >= 100,
  };
}

export function computeRoadmapOverview(productList) {
  return productList.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.display_name || p.code,
    tone: p.tone,
    stage: p.status,
    progress: Number(p.progress) || 0,
    steps: computeRoadmapSteps(p),
  }));
}

export const recentNotifications = [
  {
    id: 1,
    text: "New collaboration with Razorpay added",
    time: "2h ago",
    tone: "purple",
  },
  {
    id: 2,
    text: "FIM reached 10,000 total installs 🎉",
    time: "5h ago",
    tone: "red",
  },
  {
    id: 3,
    text: "AI Insights module completed in FIM",
    time: "1d ago",
    tone: "blue",
  },
  {
    id: 4,
    text: "TalentedHub UI/UX design completed",
    time: "2d ago",
    tone: "green",
  },
  {
    id: 5,
    text: "Partnership with Bank of Baroda expiring in 10 days",
    time: "2d ago",
    tone: "orange",
  },
];

export const products = [
  {
    id: "fim",
    slug: "fim",
    code: "FIM",
    name: "Financial Intelligence Manager",
    displayName: "FIM",
    description:
      "AI-powered personal finance app that tracks expenses, forecasts spending and delivers smart financial insights.",
    status: "Testing",
    installs: "0",
    activeUsers: "0",
    totalUsers: "0",
    progress: 80,
    version: "1.0.0 (Beta)",
    targetLaunch: "Aug 2026",
    tone: "dark",
  },
  {
    id: "fim-business",
    slug: "fim-business",
    code: "FB",
    name: "Business Financial Manager",
    displayName: "FIM Business",
    description:
      "Cash-flow, invoicing and financial reporting suite built for small and mid-sized businesses.",
    status: "Planning",
    installs: "0",
    activeUsers: "0",
    totalUsers: "0",
    progress: 0,
    version: "0.3.0 (Alpha)",
    targetLaunch: "Nov 2026",
    tone: "pink",
  },
  {
    id: "vconnect",
    slug: "vconnect",
    code: "VC",
    name: "Network Building Platform",
    displayName: "VConnect",
    description:
      "Professional networking platform connecting founders, freelancers and investors in one place.",
    status: "Live",
    installs: "0",
    activeUsers: "0",
    totalUsers: "0",
    progress: 100,
    version: "0.1.5 (Alpha)",
    targetLaunch: "June 2026",
    tone: "green",
  },
  {
    id: "future-idea-lab",
    slug: "future-idea-lab",
    code: "IL",
    name: "New Product Ideas",
    displayName: "Future Idea Lab",
    description:
      "Incubation space for early-stage product ideas before they get a roadmap of their own.",
    status: "Planning",
    installs: "0",
    activeUsers: "0",
    totalUsers: "0",
    progress: 0,
    version: "TBD",
    targetLaunch: "TBD",
    tone: "purple",
  },
];

export const productStageDistribution = computeStageDistribution(products);

export const roadmapOverview = [
  {
    id: "fim",
    code: "FIM",
    name: "FIM",
    stage: "Testing",
    progress: 80,
    steps: { idea: true, design: true, development: true, testing: true, launch: false },
  },
  {
    id: "fim-business",
    code: "FB",
    name: "FIM Business",
    stage: "Planning",
    progress: 0,
    steps: { idea: true, design: false, development: false, testing: false, launch: false },
  },
  {
    id: "vconnect",
    code: "VC",
    name: "Vconnect",
    stage: "Live",
    progress: 100,
    steps: { idea: true, design: true, development: true, testing: true, launch: true },
  },
  {
    id: "future-idea-lab",
    code: "IL",
    name: "Future Idea Lab",
    stage: "Planning",
    progress: 0,
    steps: { idea: true, design: false, development: false, testing: false, launch: false },
  },
];

export const upcomingMilestones = [
  { id: 1, title: "Expense Tracking Complete (FIM)", progress: 0, due: "Jun 15, 2026" },
  { id: 2, title: "AI Insights Module (FIM)", progress: 0, due: "Jun 30, 2026" },
  { id: 3, title: "Premium Subscription (FIM)", progress: 5, due: "Jul 20, 2026" },
  { id: 4, title: "Play Store Launch (FIM)", progress: 0, due: "Aug 15, 2026" },
  { id: 5, title: "TalentedHub MVP", progress: 0, due: "Jul 10, 2026" },
];

export const collaborationsSummary = [
  { id: 1, name: "Razorpay", role: "Payment Partner", status: "Pending", since: "Jun 2026" },
  { id: 2, name: "Bank of Baroda", role: "Banking Partner", status: "Pending", since: "Jun 2026" },
  { id: 3, name: "Finology", role: "Content Partner", status: "Pending", since: "Jun 2026" },
  { id: 4, name: "WinZo", role: "Promotion Partner", status: "Pending", since: "Jun 2026" },
  { id: 5, name: "Google Cloud", role: "Technology Partner", status: "Pending", since: "Jun 2026" },
];

export const analyticsKpis = [
  { id: "sessions", label: "Total Sessions", value: "48,210", footnote: "9.2% this month", trend: "up", icon: "download", tone: "purple" },
  { id: "avg-retention", label: "Avg. Retention (D7)", value: "34.5%", footnote: "2.1% this month", trend: "up", icon: "users", tone: "green" },
  { id: "conversion", label: "Conversion Rate", value: "6.8%", footnote: "0.4% this month", trend: "down", icon: "box", tone: "blue" },
  { id: "churn", label: "Churn Rate", value: "3.1%", footnote: "0.6% this month", trend: "up", icon: "handshake", tone: "orange" },
];

export const growthTrend = [
  { day: "Jun 1", installs: 0, activeUsers: 0 },
  { day: "Jun 2", installs: 0, activeUsers: 0 },
  { day: "Jun 3", installs: 0, activeUsers: 0 },
  { day: "Jun 4", installs: 0, activeUsers: 0 },
  { day: "Jun 5", installs: 0, activeUsers: 0 },
  { day: "Jun 6", installs: 0, activeUsers: 0 },
  { day: "Jun 7", installs: 0, activeUsers: 0 },
];

export const productComparison = [
  { name: "FIM", installs: 0, activeUsers: 0 },
  { name: "FIM Business", installs: 0, activeUsers: 0 },
  { name: "Vconnect", installs: 0, activeUsers: 0 },
  { name: "Future Idea Lab", installs: 0, activeUsers: 0 },
];

export const retentionRanking = [
  { name: "FIM", retention: 0, color: "#6c4ff5" },
  { name: "FIM Business", retention: 0, color: "#16a34a" },
  { name: "Vconnect", retention: 0, color: "#ec4899" },
  { name: "Future Idea Lab", retention: 0, color: "#9ca3af" },
];


export const sidebarNav = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard", href: "/" },
  {
    id: "products",
    label: "Products",
    icon: "package",
    children: [
      { id: "all-products", label: "All Products", href: "/products" },
      { id: "fim", label: "FIM", href: "/products/fim" },
      { id: "fim-business", label: "FIM Business", href: "/products/fim-business" },
      { id: "vconnect", label: "VConnect", href: "/products/vconnect" },
      { id: "future-idea-lab", label: "Future Idea Lab", href: "/products/future-idea-lab" },
    ],
  },
  { id: "analytics", label: "Analytics", icon: "bar-chart-3", href: "/analytics" },
  { id: "employees", label: "Employees", icon: "users-round", href: "/employees", adminOnly: true },
  { id: "clients", label: "Clients", icon: "briefcase", href: "/clients" },
  { id: "collaborations", label: "Collaborations", icon: "handshake", href: "/collaborations" },
  { id: "notifications", label: "Notifications", icon: "bell", href: "/notifications", badge: 8 },
  { id: "settings", label: "Settings", icon: "settings", href: "/settings" },
];