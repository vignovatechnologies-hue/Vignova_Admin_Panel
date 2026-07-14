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
  { day: "Jun 1", users: 1250 },
  { day: "Jun 2", users: 1200 },
  { day: "Jun 3", users: 1550 },
  { day: "Jun 4", users: 1350 },
  { day: "Jun 5", users: 1250 },
  { day: "Jun 6", users: 1300 },
  { day: "Jun 7", users: 1580 },
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
    installs: "10,250",
    activeUsers: "2,850",
    totalUsers: "12,400",
    progress: 80,
    version: "1.0.0 (Beta)",
    targetLaunch: "Aug 2024",
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
    installs: "1,350",
    activeUsers: "320",
    totalUsers: "1,600",
    progress: 60,
    version: "0.3.0 (Alpha)",
    targetLaunch: "Nov 2024",
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
    installs: "650",
    activeUsers: "120",
    totalUsers: "700",
    progress: 40,
    version: "0.1.5 (Alpha)",
    targetLaunch: "Jan 2025",
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
    progress: 60,
    steps: { idea: true, design: true, development: "current", testing: false, launch: false },
  },
  {
    id: "vconnect",
    code: "VC",
    name: "Vconnect",
    stage: "Live",
    progress: 40,
    steps: { idea: true, design: true, development: true, testing: "current", launch: false },
  },
  {
    id: "future-idea-lab",
    code: "IL",
    name: "Future Idea Lab",
    stage: "Planning",
    progress: 0,
    steps: { idea: false, design: false, development: false, testing: false, launch: false },
  },
];

export const upcomingMilestones = [
  { id: 1, title: "Expense Tracking Complete (FIM)", progress: 90, due: "Jun 15, 2024" },
  { id: 2, title: "AI Insights Module (FIM)", progress: 60, due: "Jun 30, 2024" },
  { id: 3, title: "Premium Subscription (FIM)", progress: 25, due: "Jul 20, 2024" },
  { id: 4, title: "Play Store Launch (FIM)", progress: 10, due: "Aug 15, 2024" },
  { id: 5, title: "TalentedHub MVP", progress: 50, due: "Jul 10, 2024" },
];

export const collaborationsSummary = [
  { id: 1, name: "Razorpay", role: "Payment Partner", status: "Active", since: "May 2024" },
  { id: 2, name: "Bank of Baroda", role: "Banking Partner", status: "Active", since: "Apr 2024" },
  { id: 3, name: "Finology", role: "Content Partner", status: "Active", since: "May 2024" },
  { id: 4, name: "WinZo", role: "Promotion Partner", status: "Pending", since: "Jun 2024" },
  { id: 5, name: "Google Cloud", role: "Technology Partner", status: "Active", since: "Mar 2024" },
];

export const analyticsKpis = [
  { id: "sessions", label: "Total Sessions", value: "48,210", footnote: "9.2% this month", trend: "up", icon: "download", tone: "purple" },
  { id: "avg-retention", label: "Avg. Retention (D7)", value: "34.5%", footnote: "2.1% this month", trend: "up", icon: "users", tone: "green" },
  { id: "conversion", label: "Conversion Rate", value: "6.8%", footnote: "0.4% this month", trend: "down", icon: "box", tone: "blue" },
  { id: "churn", label: "Churn Rate", value: "3.1%", footnote: "0.6% this month", trend: "up", icon: "handshake", tone: "orange" },
];

export const growthTrend = [
  { day: "Jun 1", installs: 300, activeUsers: 1250 },
  { day: "Jun 2", installs: 480, activeUsers: 1200 },
  { day: "Jun 3", installs: 420, activeUsers: 1550 },
  { day: "Jun 4", installs: 380, activeUsers: 1350 },
  { day: "Jun 5", installs: 1250, activeUsers: 1250 },
  { day: "Jun 6", installs: 520, activeUsers: 1300 },
  { day: "Jun 7", installs: 1750, activeUsers: 1580 },
];

export const productComparison = [
  { name: "FIM", installs: 10250, activeUsers: 2850 },
  { name: "FIM Business", installs: 1350, activeUsers: 320 },
  { name: "Vconnect", installs: 650, activeUsers: 120 },
  { name: "Future Idea Lab", installs: 0, activeUsers: 0 },
];

export const retentionRanking = [
  { name: "FIM", retention: 32, color: "#6c4ff5" },
  { name: "FIM Business", retention: 24, color: "#16a34a" },
  { name: "Vconnect", retention: 18, color: "#ec4899" },
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

export const employees = [
  {
    id: "emp-1",
    name: "Ananya Rao",
    email: "ananya.rao@vignova.in",
    phone: "+91 98765 43210",
    role: "Product Analyst",
    status: "Active",
    joined: "Mar 2024",
  },
  {
    id: "emp-2",
    name: "Karthik Iyer",
    email: "karthik.iyer@vignova.in",
    phone: "+91 91234 56780",
    role: "Support Lead",
    status: "Active",
    joined: "Jan 2024",
  },
];
