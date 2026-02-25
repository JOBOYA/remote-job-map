import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteMap - Remote Jobs on a Map",
  description: "Visualize remote job listings on an interactive world map. Find your next remote tech job anywhere in the world.",
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
      </body>
    </html>
  );
}
