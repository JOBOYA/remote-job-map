import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteMap — Remote Jobs on a Map",
  description:
    "Explore hundreds of remote job listings on an interactive world map. Filter by category, job type and location. Powered by Remotive, RemoteOK, Jobicy, Working Nomads and more.",
  keywords: [
    "remote jobs",
    "remote work",
    "job map",
    "work from home",
    "remote job board",
    "developer jobs",
    "tech jobs",
    "worldwide jobs",
    "remoteok",
    "remotive",
  ],
  authors: [{ name: "RemoteMap", url: "https://github.com/JOBOYA/remote-job-map" }],
  creator: "RemoteMap",
  openGraph: {
    title: "RemoteMap — Remote Jobs on a Map",
    description:
      "Explore hundreds of remote job listings on an interactive world map. Filter by category and job type.",
    url: "https://remote-job-map.vercel.app",
    siteName: "RemoteMap",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemoteMap — Remote Jobs on a Map",
    description:
      "Explore hundreds of remote job listings on an interactive world map.",
    creator: "@JOBOYA",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/VERT_logo.ico", type: "image/x-icon" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-zinc-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
