"use client";

import { JobWithCoordinates } from "@/types/job";
import {
  formatSalary,
  formatDate,
  getJobTypeLabel,
  getJobTypeColor,
  stripHtml,
} from "@/lib/utils";
import {
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Building2,
  Tag,
  Briefcase,
  Clock,
} from "lucide-react";

interface JobCardProps {
  job: JobWithCoordinates;
}

export function JobCard({ job }: JobCardProps) {
  const descriptionText = job.description ? stripHtml(job.description) : "";
  const excerpt = descriptionText.length > 160
    ? descriptionText.slice(0, 160) + "…"
    : descriptionText;

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company_name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <Building2 className={`w-6 h-6 text-violet-400 ${job.company_logo ? "hidden" : ""}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & link icon */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors leading-snug">
              {job.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-violet-400 flex-shrink-0 transition-colors mt-0.5" />
          </div>

          {/* Company + source */}
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 className="w-3.5 h-3.5 text-white/40" />
            <p className="text-sm text-white/60">{job.company_name}</p>
            {job.source && (
              <span
                className={`ml-auto flex-shrink-0 px-1.5 py-px text-[10px] rounded border font-medium ${
                  job.source === "Remotive"
                    ? "text-violet-400 bg-violet-500/10 border-violet-500/30"
                    : job.source === "Arbeitnow"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    : job.source === "Jobicy"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    : job.source === "RemoteOK"
                    ? "text-sky-400 bg-sky-500/10 border-sky-500/30"
                    : job.source === "WorkingNomads"
                    ? "text-orange-400 bg-orange-500/10 border-orange-500/30"
                    : job.source === "TheMuse"
                    ? "text-pink-400 bg-pink-500/10 border-pink-500/30"
                    : "text-white/40 bg-white/5 border-white/15"
                }`}
              >
                {job.source}
              </span>
            )}
          </div>

          {/* Description excerpt */}
          {excerpt && (
            <p className="text-xs text-white/45 mt-2 leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.candidate_required_location || "Worldwide"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {formatDate(job.publication_date)}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{job.category}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              {getJobTypeLabel(job.job_type)}
            </span>
          </div>

          {/* Salary */}
          {job.salary && (
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{formatSalary(job.salary)}</span>
            </div>
          )}

          {/* Tags */}
          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${getJobTypeColor(job.job_type)}`}
              >
                {getJobTypeLabel(job.job_type)}
              </span>
              {job.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full border border-violet-500/30 text-violet-300 flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
              {job.tags.length > 5 && (
                <span className="px-2 py-0.5 text-xs rounded-full border border-white/15 text-white/40">
                  +{job.tags.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
