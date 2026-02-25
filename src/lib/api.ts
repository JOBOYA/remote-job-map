import { RemotiveJob, JobWithCoordinates } from "@/types/job";
import { parseJobLocation } from "@/lib/utils";

// All external APIs are fetched server-side via /api/jobs to avoid CORS issues.
// This module normalises the proxy response into JobWithCoordinates[].

// ── Arbeitnow raw shape ─────────────────────────────────────────────────────

interface ArbeitnowRaw {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
  url: string;
}

function inferCategory(tags: string[]): string {
  const t = tags.join(" ").toLowerCase();
  if (/design|ux\b|ui\b|figma/.test(t)) return "Design";
  if (/marketing|seo|growth/.test(t)) return "Marketing";
  if (/\bdata\b|analytics|\bml\b|\bai\b/.test(t)) return "Data";
  if (/devops|cloud|\baws\b|azure|kubernetes|docker/.test(t)) return "DevOps / Sysadmin";
  if (/product manager|\bpm\b/.test(t)) return "Product";
  if (/sales|business dev/.test(t)) return "Sales";
  if (/support|customer success/.test(t)) return "Customer Support";
  if (/\bqa\b|testing/.test(t)) return "QA";
  if (/finance|legal/.test(t)) return "Finance / Legal";
  if (/\bhr\b|recruit/.test(t)) return "HR";
  if (/writ|content|copy/.test(t)) return "Writing";
  return "Software Development";
}

// ── Jobicy raw shape ────────────────────────────────────────────────────────

interface JobicyRaw {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobType: string | string[];    // API returns an array like ["Full-Time"]
  jobCategory: string;
  jobGeo: string;
  jobSalary: string;
  pubDate: string;
  jobDescription: string;
  tags: string[] | null;         // often null
}

function normalizeJobType(type: unknown): string {
  // Jobicy sends jobType as an array e.g. ["Full-Time"], handle both
  const raw = Array.isArray(type) ? type[0] : type;
  if (typeof raw !== "string") return "other";
  const m: Record<string, string> = {
    "full-time": "full_time",
    "part-time": "part_time",
    contract: "contract",
    freelance: "freelance",
    internship: "internship",
  };
  return m[raw.toLowerCase()] ?? "other";
}

// ── Language filter ──────────────────────────────────────────────────────────

// Common German words that rarely appear in English job titles/descriptions
const DE_WORDS = /\b(und|für|oder|mit|bei|zur|zum|eine[rnms]?|wir|dein[em]?|unser[em]?|arbeit|stelle|aufgaben|anforderungen|bewerbung|beruf|erfahrung|kenntnisse|verantwortung|bereich|unterstützung)\b/i;

function looksGerman(title: string, description: string): boolean {
  // Check title first (fastest signal)
  if (DE_WORDS.test(title)) return true;
  // Check first 300 chars of description
  const snippet = description.slice(0, 300);
  const matches = snippet.match(DE_WORDS);
  return (matches?.length ?? 0) >= 1;
}

// ── Normalisers ─────────────────────────────────────────────────────────────

function normaliseRemotive(raw: RemotiveJob[]): JobWithCoordinates[] {
  return raw.map((job) => ({ ...parseJobLocation(job), source: "Remotive" }));
}

function normaliseArbeitnow(raw: ArbeitnowRaw[]): JobWithCoordinates[] {
  // Filter out German-language listings — Arbeitnow is primarily a German board
  const english = raw.filter((job) => !looksGerman(job.title, job.description));
  return english.map((job, i) => {
    const n: RemotiveJob = {
      id: 100_000 + i,
      url: job.url,
      title: job.title,
      company_name: job.company_name,
      company_logo: null,
      category: inferCategory(job.tags),
      job_type: job.job_types?.[0] ?? "other",
      publication_date: new Date(job.created_at * 1000).toISOString(),
      candidate_required_location: job.location || "Worldwide",
      salary: "",
      description: job.description,
      tags: job.tags ?? [],
    };
    return { ...parseJobLocation(n), source: "Arbeitnow" };
  });
}

function normaliseJobicy(raw: JobicyRaw[]): JobWithCoordinates[] {
  return raw.map((job) => {
    const n: RemotiveJob = {
      id: 200_000 + job.id,
      url: job.url,
      title: job.jobTitle,
      company_name: job.companyName,
      company_logo: job.companyLogo || null,
      category: job.jobCategory || "All others",
      job_type: normalizeJobType(job.jobType),
      publication_date: job.pubDate,
      candidate_required_location: job.jobGeo || "Worldwide",
      salary: job.jobSalary || "",
      description: job.jobDescription,
      tags: job.tags ?? [],
    };
    return { ...parseJobLocation(n), source: "Jobicy" };
  });
}

// ── Main fetch ──────────────────────────────────────────────────────────────

export async function fetchAllJobs(): Promise<JobWithCoordinates[]> {
  const res = await fetch("/api/jobs");
  if (!res.ok) throw new Error(`Proxy ${res.status}`);

  const data = (await res.json()) as Record<string, unknown[]>;

  const remotive = normaliseRemotive((data.Remotive ?? []) as RemotiveJob[]);
  const arbeitnow = normaliseArbeitnow((data.Arbeitnow ?? []) as ArbeitnowRaw[]);
  const jobicy = normaliseJobicy((data.Jobicy ?? []) as JobicyRaw[]);

  // Deduplicate by URL
  const all: JobWithCoordinates[] = [];
  const seen = new Set<string>();

  for (const job of [...remotive, ...arbeitnow, ...jobicy]) {
    if (!seen.has(job.url)) {
      seen.add(job.url);
      all.push(job);
    }
  }

  console.log(
    `[RemoteMap] Loaded ${all.length} jobs — Remotive: ${remotive.length}, Arbeitnow: ${arbeitnow.length}, Jobicy: ${jobicy.length}`
  );

  return all;
}

export function countBySource(jobs: JobWithCoordinates[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const job of jobs) {
    const src = job.source ?? "Unknown";
    counts[src] = (counts[src] ?? 0) + 1;
  }
  return counts;
}
