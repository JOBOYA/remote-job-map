# 🗺️ RemoteMap

**Visualize remote job listings on an interactive world map.**

RemoteMap aggregates hundreds of remote job offers from multiple public APIs and pins them on a beautiful dark-mode map. Click any cluster to explore jobs by location, filter by category or job type, and open listings directly from the map.

---

## ✨ Features

- **Interactive cluster map** — MapLibre GL with GeoJSON clustering, click to expand or preview jobs
- **6 job sources aggregated** — Remotive, Arbeitnow, Jobicy, RemoteOK, Working Nomads, The Muse
- **Smart geocoding** — location strings are matched against a curated coordinates table with token-splitting fallback
- **Filters** — search by keyword, category (checkbox dropdown), job type
- **Popup previews** — click a pin to see a mini card with job title, company, type and source badge
- **Responsive** — Map/Jobs tab switcher on mobile
- **Server-side proxy** — all external API calls go through `/api/jobs` to avoid CORS issues and enable caching

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Map | MapLibre GL JS v5 |
| Tiles | CARTO Dark Matter |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/jobs/route.ts     # Server-side proxy — fetches all job APIs
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── remote-job-app.tsx    # Root app component (layout, filters, state)
│   └── ui/
│       ├── map.tsx           # MapLibre map + clustering + popups
│       ├── job-card.tsx      # Job listing card
│       └── filters.tsx       # Search + category/type dropdowns
├── lib/
│   ├── api.ts                # API normalizers (one per source)
│   └── utils.ts              # parseJobLocation, formatDate, helpers
└── types/
    └── job.ts                # Types + LOCATION_COORDINATES lookup table
```

---

## 🌍 Job Sources

| Source | Endpoint | Notes |
|---|---|---|
| [Remotive](https://remotive.com) | `/api/remote-jobs` | Remote-only, 250 jobs |
| [Arbeitnow](https://www.arbeitnow.com) | `/api/job-board-api?lang=en` | English filter applied |
| [Jobicy](https://jobicy.com) | `/api/v2/remote-jobs` | Remote-only |
| [RemoteOK](https://remoteok.com) | `/api` | No auth required |
| [Working Nomads](https://www.workingnomads.com) | `/api/exposed_jobs/` | Nomad-friendly jobs |
| [The Muse](https://www.themuse.com) | `/api/public/jobs` | Tech & creative roles |

All sources are **free public APIs** — no API key required.

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- **Add a new job source** — create a raw interface + normalizer in `src/lib/api.ts` and add the URL to `src/app/api/jobs/route.ts`
- **Improve geocoding** — add missing cities/countries to `LOCATION_COORDINATES` in `src/types/job.ts`
- **Better mobile UX** — the mobile tab layout is functional but could be improved
- **Salary filter** — many jobs include salary data that isn't yet filterable
- **Save/bookmark jobs** — local storage persistence
- **Dark/light mode toggle**

### How to add a new job source

1. Add the API URL to `APIS` array in `src/app/api/jobs/route.ts`
2. Define a raw interface for the API response shape in `src/lib/api.ts`
3. Write a `normalise<Source>()` function that maps to `RemotiveJob` shape
4. Add the source to the `fetchAllJobs()` merge in `src/lib/api.ts`
5. Add a color for the source badge in `job-card.tsx` and `remote-job-app.tsx`

### Running locally

```bash
git clone https://github.com/JOBOYA/remote-job-map
cd remote-job-map
npm install
npm run dev
```

No `.env` file needed — all APIs are public.

---

## 📄 License

MIT — free to use, fork and contribute.
