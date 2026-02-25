import { RemotiveJob, JobWithCoordinates, LOCATION_COORDINATES } from "@/types/job";

function matchLocation(location: string): { lat: number; lng: number; country: string } | null {
  const loc = location.toLowerCase().trim();
  if (!loc) return null;

  // Exact match
  if (LOCATION_COORDINATES[loc]) return LOCATION_COORDINATES[loc];

  // Partial match (both directions)
  for (const [key, value] of Object.entries(LOCATION_COORDINATES)) {
    if (loc.includes(key) || key.includes(loc)) return value;
  }

  return null;
}

export function parseJobLocation(job: RemotiveJob): JobWithCoordinates {
  const raw = (job.candidate_required_location ?? "").trim();

  // Try the full string first
  const full = matchLocation(raw);
  if (full) {
    return { ...job, coordinates: { lat: full.lat, lng: full.lng }, country: full.country };
  }

  // Split by common separators and try each token
  const tokens = raw.split(/[,;/\-–|]+/).map((t) => t.trim()).filter(Boolean);
  for (const token of tokens) {
    const m = matchLocation(token);
    if (m) {
      return { ...job, coordinates: { lat: m.lat, lng: m.lng }, country: m.country };
    }
  }

  // No match — leave coordinates undefined so the job won't appear on the map
  return {
    ...job,
    coordinates: undefined,
    country: "Worldwide",
  };
}

export function groupJobsByLocation(jobs: JobWithCoordinates[]): Map<string, JobWithCoordinates[]> {
  const grouped = new Map<string, JobWithCoordinates[]>();

  jobs.forEach((job) => {
    if (!job.coordinates) return;

    // Round coordinates to group nearby jobs
    const key = `${job.coordinates.lat.toFixed(1)}_${job.coordinates.lng.toFixed(1)}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(job);
  });
  
  return grouped;
}

export function formatSalary(salary: string): string {
  if (!salary) return "Not specified";
  return salary;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function getJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    full_time: "Full-time",
    contract: "Contract",
    part_time: "Part-time",
    freelance: "Freelance",
    internship: "Internship",
    other: "Other",
  };
  return labels[type] || type;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getJobTypeColor(type: string): string {
  const colors: Record<string, string> = {
    full_time: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    contract: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    part_time: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    freelance: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    internship: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };
  return colors[type] || colors.other;
}
