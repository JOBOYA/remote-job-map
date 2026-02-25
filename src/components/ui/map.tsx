"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { JobWithCoordinates } from "@/types/job";
import { getJobTypeLabel, getJobTypeColor } from "@/lib/utils";
import { MapPin, X, Building2, ExternalLink } from "lucide-react";

// ─── Popup card ─────────────────────────────────────────────────────────────

const SOURCE_BADGE: Record<string, string> = {
  Remotive: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  Arbeitnow: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Jobicy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  "The Muse": "text-sky-400 bg-sky-500/10 border-sky-500/30",
};

interface PopupCardProps {
  jobs: JobWithCoordinates[];
  locationName: string;
  onClose: () => void;
  onViewAll: () => void;
}

function MapPopupCard({ jobs, locationName, onClose, onViewAll }: PopupCardProps) {
  const preview = jobs.slice(0, 4);
  return (
    <div className="w-72 bg-zinc-900 border border-white/15 rounded-xl shadow-2xl shadow-black/70 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <span className="font-semibold text-sm text-white truncate">{locationName}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-xs text-white/50">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          </span>
          <button onClick={onClose} className="p-0.5 rounded hover:bg-white/15 transition-colors">
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {preview.map((job) => (
          <a
            key={job.id}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group"
          >
            <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt=""
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-violet-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate group-hover:text-violet-300 transition-colors">
                {job.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[11px] text-white/45 truncate">{job.company_name}</p>
                {job.source && (
                  <span
                    className={`flex-shrink-0 px-1 py-px text-[9px] rounded border ${
                      SOURCE_BADGE[job.source] ?? "text-white/40 bg-white/5 border-white/15"
                    }`}
                  >
                    {job.source}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span
                className={`px-1.5 py-0.5 text-[10px] rounded-full border ${getJobTypeColor(job.job_type)}`}
              >
                {getJobTypeLabel(job.job_type)}
              </span>
              <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-violet-400 transition-colors" />
            </div>
          </a>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-white/10">
        <button
          onClick={onViewAll}
          className="w-full py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-violet-300 text-xs font-medium transition-all"
        >
          View all {jobs.length} jobs in sidebar →
        </button>
      </div>
    </div>
  );
}

// ─── Map ────────────────────────────────────────────────────────────────────

interface MapProps {
  jobs: JobWithCoordinates[];
  onSelectJobs: (jobs: JobWithCoordinates[]) => void;
  selectedJobs: JobWithCoordinates[];
}

interface PopupState {
  jobs: JobWithCoordinates[];
  lng: number;
  lat: number;
  x: number;
  y: number;
  locationName: string;
}

const SRC = "jobs";
const L_CLUSTER = "clusters";
const L_CLUSTER_COUNT = "cluster-count";
const L_POINT = "point";

export function Map({ jobs, onSelectJobs }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [popup, setPopup] = useState<PopupState | null>(null);
  const popupDivRef = useRef<HTMLDivElement>(null);
  const popupDataRef = useRef<PopupState | null>(null);
  const jobsRef = useRef<JobWithCoordinates[]>([]);
  jobsRef.current = jobs;
  const skipMapClick = useRef(false);

  // Jobs → GeoJSON
  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: jobs
        .filter((j) => j.coordinates)
        .map((j) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [j.coordinates!.lng, j.coordinates!.lat] as [number, number],
          },
          properties: { id: j.id, country: j.country ?? "Worldwide" },
        })),
    }),
    [jobs]
  );


  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || map.current) return;

    map.current = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        // Glyphs are required for any text/symbol layer (cluster count labels)
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution: "© CARTO, © OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "carto-dark-layer",
            type: "raster",
            source: "carto-dark",
            minzoom: 0,
            maxzoom: 20,
          },
        ],
      },
      center: [10, 30],
      zoom: 2,
      maxZoom: 18,
      minZoom: 1,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );

    map.current.on("load", () => setMapLoaded(true));

    // Close popup when clicking empty map (layer clicks set skipMapClick)
    map.current.on("click", () => {
      if (skipMapClick.current) {
        skipMapClick.current = false;
        return;
      }
      popupDataRef.current = null;
      setPopup(null);
    });

    // Keep popup pinned to its lng/lat while the map pans / zooms
    map.current.on("move", () => {
      if (!popupDataRef.current || !popupDivRef.current || !map.current) return;
      const pt = map.current.project([popupDataRef.current.lng, popupDataRef.current.lat]);
      popupDivRef.current.style.left = `${pt.x}px`;
      popupDivRef.current.style.top = `${pt.y}px`;
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ── Sources + layers ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clustered source
    map.current.addSource(SRC, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // ── Cluster glow ──
    map.current.addLayer({
      id: `${L_CLUSTER}-glow`,
      type: "circle",
      source: SRC,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "rgba(124,58,237,0.2)",
          10,
          "rgba(147,51,234,0.2)",
          50,
          "rgba(192,38,211,0.2)",
        ],
        "circle-radius": ["step", ["get", "point_count"], 28, 10, 38, 50, 50],
        "circle-blur": 0.7,
      },
    });

    // ── Cluster circle ──
    map.current.addLayer({
      id: L_CLUSTER,
      type: "circle",
      source: SRC,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#7c3aed",
          10,
          "#9333ea",
          50,
          "#c026d3",
        ],
        "circle-radius": ["step", ["get", "point_count"], 18, 10, 26, 50, 36],
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "rgba(255,255,255,0.3)",
      },
    });

    // ── Cluster count text ──
    map.current.addLayer({
      id: L_CLUSTER_COUNT,
      type: "symbol",
      source: SRC,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 13,
        "text-font": ["Open Sans Bold"],
      },
      paint: { "text-color": "#ffffff" },
    });

    // ── Single-point ring ──
    map.current.addLayer({
      id: `${L_POINT}-ring`,
      type: "circle",
      source: SRC,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "transparent",
        "circle-radius": 13,
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "rgba(139,92,246,0.45)",
      },
    });

    // ── Single point ──
    map.current.addLayer({
      id: L_POINT,
      type: "circle",
      source: SRC,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#8b5cf6",
        "circle-radius": 6,
        "circle-stroke-width": 2,
        "circle-stroke-color": "rgba(255,255,255,0.75)",
      },
    });


    // ── Cursors ──
    const ptr = () => {
      if (map.current) map.current.getCanvas().style.cursor = "pointer";
    };
    const rst = () => {
      if (map.current) map.current.getCanvas().style.cursor = "";
    };
    map.current.on("mouseenter", L_CLUSTER, ptr);
    map.current.on("mouseleave", L_CLUSTER, rst);
    map.current.on("mouseenter", L_POINT, ptr);
    map.current.on("mouseleave", L_POINT, rst);

    // ── Helper: show popup for a list of jobs at given coords ──
    const showPopup = (
      jobList: JobWithCoordinates[],
      coords: [number, number],
      offsetY: number
    ) => {
      if (!map.current || jobList.length === 0) return;
      const pt = map.current.project(coords);
      const next: PopupState = {
        jobs: jobList,
        lng: coords[0],
        lat: coords[1],
        x: pt.x,
        y: pt.y - offsetY,
        locationName: jobList[0].country ?? "Worldwide",
      };
      popupDataRef.current = next;
      setPopup(next);
      onSelectJobs(jobList);
    };

    // ── Click CLUSTER ──
    // If the cluster can still split → zoom in.
    // If all points overlap at the same spot → show popup with all jobs.
    map.current.on("click", L_CLUSTER, async (e) => {
      if (!map.current || !e.features?.[0]) return;
      skipMapClick.current = true;

      const feature = e.features[0];
      const clusterId = feature.properties?.cluster_id as number;
      const coords = (feature.geometry as unknown as { coordinates: [number, number] }).coordinates;

      try {
        const src = map.current.getSource(SRC) as maplibregl.GeoJSONSource;
        const expansionZoom = await src.getClusterExpansionZoom(clusterId);

        // If expansion zoom is at or past the max → points can't split,
        // they share the same location. Show popup instead of zooming.
        if (expansionZoom >= 14) {
          const leaves = await src.getClusterLeaves(clusterId, 500, 0);
          const ids = new Set(leaves.map((l) => l.properties?.id as number));
          const clusterJobs = jobsRef.current.filter((j) => ids.has(j.id));
          showPopup(clusterJobs, coords as [number, number], 28);
        } else {
          // Normal: zoom in to split
          popupDataRef.current = null;
          setPopup(null);
          map.current.easeTo({
            center: coords as [number, number],
            zoom: expansionZoom + 1,
            duration: 500,
          });
        }
      } catch {
        map.current.easeTo({
          center: coords as [number, number],
          zoom: map.current.getZoom() + 2,
          duration: 500,
        });
      }
    });

    // ── Click POINT → find ALL co-located jobs and show popup ──
    map.current.on("click", L_POINT, (e) => {
      if (!map.current || !e.features?.[0]) return;
      skipMapClick.current = true;

      const coords = (e.features[0].geometry as unknown as { coordinates: [number, number] }).coordinates;

      // Collect ALL jobs that share the exact same country + coordinates.
      // Many jobs map to the same lat/lng (e.g. all "Germany" jobs).
      const clickedId = e.features[0].properties?.id as number;
      const clickedJob = jobsRef.current.find((j) => j.id === clickedId);
      if (!clickedJob || !clickedJob.coordinates) return;

      const cLat = clickedJob.coordinates.lat;
      const cLng = clickedJob.coordinates.lng;

      const colocated = jobsRef.current.filter(
        (j) =>
          j.coordinates &&
          Math.abs(j.coordinates.lat - cLat) < 0.01 &&
          Math.abs(j.coordinates.lng - cLng) < 0.01
      );

      showPopup(
        colocated.length > 0 ? colocated : [clickedJob],
        coords as [number, number],
        16
      );
    });
  }, [mapLoaded, onSelectJobs]);

  // ── Sync GeoJSON data ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    (map.current.getSource(SRC) as maplibregl.GeoJSONSource | undefined)?.setData(geojson);
  }, [mapLoaded, geojson]);

  const closePopup = () => {
    popupDataRef.current = null;
    setPopup(null);
  };

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full rounded-2xl overflow-hidden" />

      {popup && (
        <div
          ref={popupDivRef}
          className="absolute z-50 pointer-events-auto"
          style={{ left: popup.x, top: popup.y, transform: "translate(-50%, -100%)" }}
        >
          <MapPopupCard
            jobs={popup.jobs}
            locationName={popup.locationName}
            onClose={closePopup}
            onViewAll={() => {
              onSelectJobs(popup.jobs);
              closePopup();
            }}
          />
          <div className="flex justify-center">
            <div className="w-3 h-3 bg-zinc-900 border-r border-b border-white/15 rotate-45 -mt-1.5" />
          </div>
        </div>
      )}
    </div>
  );
}
