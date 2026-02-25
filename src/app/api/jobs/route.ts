import { NextResponse } from "next/server";

// Server-side proxy — bypasses CORS restrictions for all job APIs.
// The browser only calls /api/jobs, and this route fetches all sources.

const APIS = [
  {
    name: "Remotive",
    urls: ["https://remotive.com/api/remote-jobs?limit=250"],
    parse: (data: Record<string, unknown>) => (data.jobs as unknown[]) ?? [],
  },
  {
    name: "Arbeitnow",
    urls: [
      "https://www.arbeitnow.com/api/job-board-api?lang=en",
      "https://www.arbeitnow.com/api/job-board-api?lang=en&page=2",
    ],
    parse: (data: Record<string, unknown>) => (data.data as unknown[]) ?? [],
  },
  {
    name: "Jobicy",
    urls: ["https://jobicy.com/api/v2/remote-jobs?count=50"],
    parse: (data: Record<string, unknown>) => (data.jobs as unknown[]) ?? [],
  },
];

async function fetchUrl(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 }, // cache 5 min
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

export async function GET() {
  const result: Record<string, unknown[]> = {};

  await Promise.all(
    APIS.map(async (api) => {
      try {
        const pages = await Promise.all(api.urls.map(fetchUrl));
        const items = pages.flatMap((p) =>
          api.parse(p as Record<string, unknown>)
        );
        result[api.name] = items;
      } catch (err) {
        console.warn(`[proxy] ${api.name} failed:`, err);
        result[api.name] = [];
      }
    })
  );

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
