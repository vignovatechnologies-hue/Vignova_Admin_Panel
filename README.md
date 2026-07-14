# Vignova Admin Dashboard

A Next.js admin panel built to match the Vignova dashboard design — stat cards,
installs/active-users charts, product stage donut, product cards, roadmap
table, milestones, and collaborations summary.

## Structure

No Tailwind — every component is a plain `.jsx` + `.css` pair living in the
same folder, e.g.:

```
components/
  Sidebar/
    Sidebar.jsx
    Sidebar.css
  StatCards/
    StatCards.jsx
    StatCards.css
  InstallsChart/
    InstallsChart.jsx
    InstallsChart.css
  ActiveUsersChart/
    ActiveUsersChart.jsx
    ActiveUsersChart.css
  StageDistribution/
    StageDistribution.jsx
    StageDistribution.css
  RecentNotifications/
    RecentNotifications.jsx
    RecentNotifications.css
  ProductCards/
    ProductCards.jsx
    ProductCards.css
  RoadmapOverview/
    RoadmapOverview.jsx
    RoadmapOverview.css
  UpcomingMilestones/
    UpcomingMilestones.jsx
    UpcomingMilestones.css
  CollaborationsSummary/
    CollaborationsSummary.jsx
    CollaborationsSummary.css
  Dashboard/
    Dashboard.jsx      <- composes everything into the page layout
    Dashboard.css

app/
  layout.jsx
  globals.css           <- reset + design tokens (colors, radii, shadow) + shared .card class
  page.jsx               <- renders <Dashboard />

data/
  mockData.js            <- all sample data (stat cards, chart series, products,
                             roadmap, milestones, collaborations). Replace this
                             with real API calls when you're ready.
```

Each component only imports its own CSS file (e.g. `import "./Sidebar.css"`),
so styles stay scoped to that folder and nothing leaks globally except the
tokens and `.card` helper in `app/globals.css`.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Charts

Charts (`InstallsChart`, `ActiveUsersChart`, `StageDistribution`) use
[Recharts](https://recharts.org/). Icons use
[lucide-react](https://lucide.dev/).

## Wiring up real data

Everything currently reads from `data/mockData.js`. To connect a real
backend:

1. Replace the exported arrays in `mockData.js` with `fetch`/API calls
   (e.g. in a Server Component or a `useEffect` + `useState` if you need it
   client-side).
2. Each component already accepts its data as a prop with the mock as the
   default value (e.g. `<StatCards items={...} />`), so you can pass your
   fetched data straight in without touching the component internals.

## Extending the panel

The sidebar navigation (`data/mockData.js` -> `sidebarNav`) already lists
routes for Products, Analytics, Roadmaps, Collaborations, Notifications, and
Settings. Add matching folders under `app/` (e.g. `app/products/page.jsx`)
as you build those out — the second screen in your reference image (the FIM
product detail page) is a good next candidate, following the same
`ComponentName.jsx` + `ComponentName.css` pattern used here.
