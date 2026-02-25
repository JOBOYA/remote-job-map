"use client";

import { CATEGORIES, JOB_TYPES } from "@/types/job";
import { getJobTypeLabel } from "@/lib/utils";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedJobTypes: string[];
  onJobTypesChange: (types: string[]) => void;
  totalJobs: number;
  filteredJobs: number;
}

export function Filters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedJobTypes,
  onJobTypesChange,
  totalJobs,
  filteredJobs,
}: FiltersProps) {
  const [showCategories, setShowCategories] = useState(false);
  const [showJobTypes, setShowJobTypes] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const toggleJobType = (type: string) => {
    if (selectedJobTypes.includes(type)) {
      onJobTypesChange(selectedJobTypes.filter((t) => t !== type));
    } else {
      onJobTypesChange([...selectedJobTypes, type]);
    }
  };

  const clearFilters = () => {
    onSearchChange("");
    onCategoriesChange([]);
    onJobTypesChange([]);
  };

  const hasFilters =
    searchQuery || selectedCategories.length > 0 || selectedJobTypes.length > 0;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by role, company, or tech stack..."
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Categories dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategories(!showCategories);
              setShowJobTypes(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              selectedCategories.length > 0
                ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
            }`}
          >
            <Filter className="w-4 h-4" />
            Category
            {selectedCategories.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-violet-500 text-white rounded-full">
                {selectedCategories.length}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showCategories ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCategories && (
            <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
              {CATEGORIES.map((category) => {
                const checked = selectedCategories.includes(category);
                return (
                  <label
                    key={category}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all hover:bg-white/5 ${
                      checked ? "text-violet-300" : "text-white/70"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checked
                          ? "bg-violet-500 border-violet-500"
                          : "border-white/30 bg-white/5"
                      }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(category)}
                      className="sr-only"
                    />
                    {category}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Job types dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowJobTypes(!showJobTypes);
              setShowCategories(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              selectedJobTypes.length > 0
                ? "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300"
                : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
            }`}
          >
            Job Type
            {selectedJobTypes.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-fuchsia-500 text-white rounded-full">
                {selectedJobTypes.length}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showJobTypes ? "rotate-180" : ""
              }`}
            />
          </button>

          {showJobTypes && (
            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50">
              {JOB_TYPES.map((type) => {
                const checked = selectedJobTypes.includes(type);
                return (
                  <label
                    key={type}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all hover:bg-white/5 ${
                      checked ? "text-fuchsia-300" : "text-white/70"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checked
                          ? "bg-fuchsia-500 border-fuchsia-500"
                          : "border-white/30 bg-white/5"
                      }`}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleJobType(type)}
                      className="sr-only"
                    />
                    {getJobTypeLabel(type)}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-white/50">
        <span className="text-white font-medium">{filteredJobs}</span> jobs
        {filteredJobs !== totalJobs && (
          <span> of {totalJobs}</span>
        )}
      </div>
    </div>
  );
}
