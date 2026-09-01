# AlgoX Dashboard — Frontend Setup

## 1. Where these files go

You already have a working Vite + React + Tailwind v4 project at:
`C:\Users\hp\Downloads\algox-dashboard\algox-dashboard`

Copy the files from this package into that folder, **overwriting**:
- `src/App.jsx`
- `src/index.css`

And **adding** these new folders:
- `src/components/` (7 files)
- `src/data/` (2 files)

Your `src/` folder should end up looking like:

```
src/
  components/
    AIQuizGenerator.jsx
    ContinueLearning.jsx
    Header.jsx
    ProgressWidget.jsx
    RecommendedPath.jsx
    Sidebar.jsx
    StatsGrid.jsx
  data/
    colorMap.js
    dashboardData.js
  App.jsx
  index.css
  main.jsx        <- already exists, no change needed
```

## 2. Install the one extra dependency (icons)

This design uses `lucide-react` for all icons (lightweight, tree-shakeable):

```bash
cd algox-dashboard
npm install lucide-react
```

## 3. Run it

```bash
npm run dev
```

Open http://localhost:5173/ — you should see the full dashboard.

## 4. How it's organized (for your team)

- **`src/data/dashboardData.js`** — every number/label/status on the page
  lives here as plain JS objects/arrays. This is the ONLY file the backend
  team needs to touch to wire up real data: replace each `export const` with
  a `useState` + `useEffect`/`fetch` call (or React Query), keeping the same
  shape, and every component below updates automatically.
- **`src/data/colorMap.js`** — one place to change the color palette used
  across cards/badges/progress bars.
- **`src/components/`** — one component per dashboard section (Sidebar,
  Header, StatsGrid, SkillGapOverview, RecommendedPath, AIQuizGenerator,
  ProgressWidget, ContinueLearning). Each takes plain props, so they're easy
  to reuse or restyle independently.
- **`src/App.jsx`** — just lays out the components and wires up 3 placeholder
  handler functions (`handleStartLearningPath`, `handleQuizUpload`,
  `handleGenerateSample`) — clearly marked `TODO` for backend calls.

## 5. Branding

- Logo/sidebar header now reads **AlgoX** instead of iGOT KARMAYOGI.
- A small "Built on iGOT Karmayogi" credit (with Ministry attribution) sits
  at the bottom of the sidebar, as a promotional nod to the original platform.
- The top header keeps the "Smart Learning. Stronger India." tagline.

## 6. Next steps you may want

- Add React Router if you want the sidebar nav items to actually change pages.
- Replace the donut chart / bars with a charting library (e.g. `recharts`)
  once real time-series data exists.
- Add a `.env` file once the backend gives you an API base URL, and create
  a small `src/api/` folder with fetch functions matching `dashboardData.js`.
