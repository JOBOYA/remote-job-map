"use client";

import { useState, useEffect, useMemo } from "react";
import { Map } from "@/components/ui/map";
import { JobCard } from "@/components/ui/job-card";
import { Filters } from "@/components/ui/filters";
import { JobWithCoordinates } from "@/types/job";
import { fetchAllJobs, countBySource } from "@/lib/api";
import {
  Globe2,
  Briefcase,
  Loader2,
  MapPin,
  X,
  RefreshCw,
  Github,
} from "lucide-react";

const SOURCE_DOT: Record<string, string> = {
  Remotive: "bg-violet-400",
  Arbeitnow: "bg-amber-400",
  Jobicy: "bg-emerald-400",
};

export function RemoteJobApp() {
  const [jobs, setJobs] = useState<JobWithCoordinates[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<JobWithCoordinates[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllJobs();
      setJobs(data);
    } catch {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          job.title.toLowerCase().includes(q) ||
          job.company_name.toLowerCase().includes(q) ||
          job.tags.some((t) => t.toLowerCase().includes(q)) ||
          job.candidate_required_location.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(job.category))
        return false;
      if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.job_type))
        return false;
      return true;
    });
  }, [jobs, searchQuery, selectedCategories, selectedJobTypes]);

  const displayJobs = selectedJobs.length > 0 ? selectedJobs : filteredJobs;

  const sourceCounts = useMemo(() => countBySource(jobs), [jobs]);
  const countryCount = useMemo(
    () => new Set(filteredJobs.map((j) => j.country)).size,
    [filteredJobs]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Remote<span className="text-violet-400">Map</span>
              </h1>
              <p className="text-xs text-white/40">Remote jobs on a map</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadJobs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 h-screen flex">
        {/* Sidebar */}
        <aside className="w-[480px] h-full flex flex-col border-r border-white/5 bg-zinc-950">
          {/* Filters */}
          <div className="p-6 border-b border-white/5">
            <Filters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              selectedJobTypes={selectedJobTypes}
              onJobTypesChange={setSelectedJobTypes}
              totalJobs={jobs.length}
              filteredJobs={filteredJobs.length}
            />
          </div>

          {/* Selected location header */}
          {selectedJobs.length > 0 && (
            <div className="px-6 py-3 bg-violet-500/10 border-b border-violet-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-300">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">
                  {selectedJobs[0].country || "Worldwide"}
                </span>
                <span className="text-white/50">
                  · {selectedJobs.length} job{selectedJobs.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => setSelectedJobs([])}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Job list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/50">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Loading jobs from 3 sources…</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-red-400">
                <p>{error}</p>
                <button
                  onClick={loadJobs}
                  className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : displayJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/50">
                <Briefcase className="w-12 h-12 mb-4 opacity-50" />
                <p>No jobs found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              displayJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            jobs={filteredJobs}
            onSelectJobs={setSelectedJobs}
            selectedJobs={selectedJobs}
          />

          {/* Stats overlay */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none">
            <div className="flex gap-3">
              <div className="px-4 py-3 rounded-xl bg-zinc-900/90 backdrop-blur border border-white/10">
                <div className="text-2xl font-bold text-white">{filteredJobs.length}</div>
                <div className="text-xs text-white/50">remote jobs</div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-zinc-900/90 backdrop-blur border border-white/10">
                <div className="text-2xl font-bold text-violet-400">{countryCount}</div>
                <div className="text-xs text-white/50">countries / regions</div>
              </div>
            </div>

            {/* Per-source breakdown */}
            {Object.keys(sourceCounts).length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {Object.entries(sourceCounts).map(([src, count]) => (
                  <div
                    key={src}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900/90 backdrop-blur border border-white/10 text-xs flex items-center gap-1.5"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${SOURCE_DOT[src] ?? "bg-white/40"}`}
                    />
                    <span className="text-white/50">{src}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
