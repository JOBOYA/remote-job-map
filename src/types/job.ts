export interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  tags: string[];
}

export interface RemotiveResponse {
  "job-count": number;
  jobs: RemotiveJob[];
}

export interface JobWithCoordinates extends RemotiveJob {
  coordinates?: {
    lat: number;
    lng: number;
  };
  country?: string;
  source?: string;
}

// Mapping of known location names to coordinates
export const LOCATION_COORDINATES: Record<string, { lat: number; lng: number; country: string }> = {
  // Europe
  "france": { lat: 46.603354, lng: 1.888334, country: "France" },
  "paris": { lat: 48.8566, lng: 2.3522, country: "France" },
  "lyon": { lat: 45.7640, lng: 4.8357, country: "France" },
  "germany": { lat: 51.1657, lng: 10.4515, country: "Germany" },
  "berlin": { lat: 52.52, lng: 13.405, country: "Germany" },
  "munich": { lat: 48.1351, lng: 11.582, country: "Germany" },
  "münchen": { lat: 48.1351, lng: 11.582, country: "Germany" },
  "hamburg": { lat: 53.5511, lng: 9.9937, country: "Germany" },
  "cologne": { lat: 50.9375, lng: 6.9603, country: "Germany" },
  "köln": { lat: 50.9375, lng: 6.9603, country: "Germany" },
  "frankfurt": { lat: 50.1109, lng: 8.6821, country: "Germany" },
  "frankfurt am main": { lat: 50.1109, lng: 8.6821, country: "Germany" },
  "stuttgart": { lat: 48.7758, lng: 9.1829, country: "Germany" },
  "düsseldorf": { lat: 51.2277, lng: 6.7735, country: "Germany" },
  "dusseldorf": { lat: 51.2277, lng: 6.7735, country: "Germany" },
  "leipzig": { lat: 51.3397, lng: 12.3731, country: "Germany" },
  "dortmund": { lat: 51.5136, lng: 7.4653, country: "Germany" },
  "essen": { lat: 51.4556, lng: 7.0116, country: "Germany" },
  "bremen": { lat: 53.0793, lng: 8.8017, country: "Germany" },
  "dresden": { lat: 51.0504, lng: 13.7373, country: "Germany" },
  "hannover": { lat: 52.3759, lng: 9.732, country: "Germany" },
  "nuremberg": { lat: 49.4521, lng: 11.0767, country: "Germany" },
  "nürnberg": { lat: 49.4521, lng: 11.0767, country: "Germany" },
  "uk": { lat: 55.3781, lng: -3.436, country: "United Kingdom" },
  "united kingdom": { lat: 55.3781, lng: -3.436, country: "United Kingdom" },
  "london": { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
  "spain": { lat: 40.4637, lng: -3.7492, country: "Spain" },
  "madrid": { lat: 40.4168, lng: -3.7038, country: "Spain" },
  "barcelona": { lat: 41.3851, lng: 2.1734, country: "Spain" },
  "italy": { lat: 41.8719, lng: 12.5674, country: "Italy" },
  "netherlands": { lat: 52.1326, lng: 5.2913, country: "Netherlands" },
  "amsterdam": { lat: 52.3676, lng: 4.9041, country: "Netherlands" },
  "portugal": { lat: 39.3999, lng: -8.2245, country: "Portugal" },
  "lisbon": { lat: 38.7223, lng: -9.1393, country: "Portugal" },
  "ireland": { lat: 53.1424, lng: -7.6921, country: "Ireland" },
  "dublin": { lat: 53.3498, lng: -6.2603, country: "Ireland" },
  "switzerland": { lat: 46.8182, lng: 8.2275, country: "Switzerland" },
  "zurich": { lat: 47.3769, lng: 8.5417, country: "Switzerland" },
  "austria": { lat: 47.5162, lng: 14.5501, country: "Austria" },
  "vienna": { lat: 48.2082, lng: 16.3738, country: "Austria" },
  "poland": { lat: 51.9194, lng: 19.1451, country: "Poland" },
  "sweden": { lat: 60.1282, lng: 18.6435, country: "Sweden" },
  "stockholm": { lat: 59.3293, lng: 18.0686, country: "Sweden" },
  "denmark": { lat: 56.2639, lng: 9.5018, country: "Denmark" },
  "copenhagen": { lat: 55.6761, lng: 12.5683, country: "Denmark" },
  "norway": { lat: 60.472, lng: 8.4689, country: "Norway" },
  "finland": { lat: 61.9241, lng: 25.7482, country: "Finland" },
  "belgium": { lat: 50.5039, lng: 4.4699, country: "Belgium" },
  "brussels": { lat: 50.8503, lng: 4.3517, country: "Belgium" },
  "czech republic": { lat: 49.8175, lng: 15.473, country: "Czech Republic" },
  "prague": { lat: 50.0755, lng: 14.4378, country: "Czech Republic" },
  "romania": { lat: 45.9432, lng: 24.9668, country: "Romania" },
  "greece": { lat: 39.0742, lng: 21.8243, country: "Greece" },
  "hungary": { lat: 47.1625, lng: 19.5033, country: "Hungary" },
  "budapest": { lat: 47.4979, lng: 19.0402, country: "Hungary" },
  "ukraine": { lat: 48.3794, lng: 31.1656, country: "Ukraine" },
  "croatia": { lat: 45.1, lng: 15.2, country: "Croatia" },
  "bulgaria": { lat: 42.7339, lng: 25.4858, country: "Bulgaria" },
  "serbia": { lat: 44.0165, lng: 21.0059, country: "Serbia" },
  "slovakia": { lat: 48.669, lng: 19.699, country: "Slovakia" },
  "lithuania": { lat: 55.1694, lng: 23.8813, country: "Lithuania" },
  "latvia": { lat: 56.8796, lng: 24.6032, country: "Latvia" },
  "estonia": { lat: 58.5953, lng: 25.0136, country: "Estonia" },
  "tallinn": { lat: 59.437, lng: 24.7536, country: "Estonia" },
  "warsaw": { lat: 52.2297, lng: 21.0122, country: "Poland" },
  "krakow": { lat: 50.0647, lng: 19.945, country: "Poland" },
  "milan": { lat: 45.4642, lng: 9.19, country: "Italy" },
  "rome": { lat: 41.9028, lng: 12.4964, country: "Italy" },
  "helsinki": { lat: 60.1699, lng: 24.9384, country: "Finland" },
  "oslo": { lat: 59.9139, lng: 10.7522, country: "Norway" },
  "manchester": { lat: 53.4808, lng: -2.2426, country: "United Kingdom" },
  "edinburgh": { lat: 55.9533, lng: -3.1883, country: "United Kingdom" },
  
  // Americas
  "usa": { lat: 37.0902, lng: -95.7129, country: "USA" },
  "united states": { lat: 37.0902, lng: -95.7129, country: "USA" },
  "us": { lat: 37.0902, lng: -95.7129, country: "USA" },
  "new york": { lat: 40.7128, lng: -74.006, country: "USA" },
  "san francisco": { lat: 37.7749, lng: -122.4194, country: "USA" },
  "los angeles": { lat: 34.0522, lng: -118.2437, country: "USA" },
  "seattle": { lat: 47.6062, lng: -122.3321, country: "USA" },
  "austin": { lat: 30.2672, lng: -97.7431, country: "USA" },
  "chicago": { lat: 41.8781, lng: -87.6298, country: "USA" },
  "boston": { lat: 42.3601, lng: -71.0589, country: "USA" },
  "denver": { lat: 39.7392, lng: -104.9903, country: "USA" },
  "canada": { lat: 56.1304, lng: -106.3468, country: "Canada" },
  "toronto": { lat: 43.6532, lng: -79.3832, country: "Canada" },
  "vancouver": { lat: 49.2827, lng: -123.1207, country: "Canada" },
  "montreal": { lat: 45.5017, lng: -73.5673, country: "Canada" },
  "brazil": { lat: -14.235, lng: -51.9253, country: "Brazil" },
  "mexico": { lat: 23.6345, lng: -102.5528, country: "Mexico" },
  "argentina": { lat: -38.4161, lng: -63.6167, country: "Argentina" },
  "colombia": { lat: 4.5709, lng: -74.2973, country: "Colombia" },
  "chile": { lat: -35.6751, lng: -71.543, country: "Chile" },
  
  // Asia Pacific
  "india": { lat: 20.5937, lng: 78.9629, country: "India" },
  "bangalore": { lat: 12.9716, lng: 77.5946, country: "India" },
  "mumbai": { lat: 19.076, lng: 72.8777, country: "India" },
  "japan": { lat: 36.2048, lng: 138.2529, country: "Japan" },
  "tokyo": { lat: 35.6762, lng: 139.6503, country: "Japan" },
  "australia": { lat: -25.2744, lng: 133.7751, country: "Australia" },
  "sydney": { lat: -33.8688, lng: 151.2093, country: "Australia" },
  "melbourne": { lat: -37.8136, lng: 144.9631, country: "Australia" },
  "singapore": { lat: 1.3521, lng: 103.8198, country: "Singapore" },
  "china": { lat: 35.8617, lng: 104.1954, country: "China" },
  "south korea": { lat: 35.9078, lng: 127.7669, country: "South Korea" },
  "korea": { lat: 35.9078, lng: 127.7669, country: "South Korea" },
  "indonesia": { lat: -0.7893, lng: 113.9213, country: "Indonesia" },
  "philippines": { lat: 12.8797, lng: 121.774, country: "Philippines" },
  "vietnam": { lat: 14.0583, lng: 108.2772, country: "Vietnam" },
  "thailand": { lat: 15.87, lng: 100.9925, country: "Thailand" },
  "malaysia": { lat: 4.2105, lng: 101.9758, country: "Malaysia" },
  "new zealand": { lat: -40.9006, lng: 174.886, country: "New Zealand" },
  "pakistan": { lat: 30.3753, lng: 69.3451, country: "Pakistan" },
  
  // Middle East & Africa
  "israel": { lat: 31.0461, lng: 34.8516, country: "Israel" },
  "tel aviv": { lat: 32.0853, lng: 34.7818, country: "Israel" },
  "uae": { lat: 23.4241, lng: 53.8478, country: "UAE" },
  "dubai": { lat: 25.2048, lng: 55.2708, country: "UAE" },
  "south africa": { lat: -30.5595, lng: 22.9375, country: "South Africa" },
  "nigeria": { lat: 9.082, lng: 8.6753, country: "Nigeria" },
  "kenya": { lat: -0.0236, lng: 37.9062, country: "Kenya" },
  "egypt": { lat: 26.8206, lng: 30.8025, country: "Egypt" },
  
  // Regions
  "europe": { lat: 54.526, lng: 15.2551, country: "Europe" },
  "european union": { lat: 54.526, lng: 15.2551, country: "Europe" },
  "eu": { lat: 54.526, lng: 15.2551, country: "Europe" },
  "emea": { lat: 48.0, lng: 10.0, country: "EMEA" },
  "apac": { lat: 25.0, lng: 115.0, country: "APAC" },
  "asia": { lat: 34.0479, lng: 100.6197, country: "Asia" },
  "latam": { lat: -15.0, lng: -60.0, country: "LATAM" },
  "americas": { lat: 19.0, lng: -96.0, country: "Americas" },
  "north america": { lat: 45.0, lng: -100.0, country: "North America" },
  
  // "worldwide", "remote", "anywhere", "global" intentionally omitted
  // so they fall through to coordinates: undefined and stay off the map
};

export const CATEGORIES = [
  "Software Development",
  "Design",
  "Marketing",
  "Customer Support",
  "Sales",
  "Product",
  "DevOps / Sysadmin",
  "Data",
  "Business",
  "Finance / Legal",
  "HR",
  "QA",
  "Writing",
  "All others",
];

export const JOB_TYPES = [
  "full_time",
  "contract",
  "part_time",
  "freelance",
  "internship",
  "other",
];
