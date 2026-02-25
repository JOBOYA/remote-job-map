import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RemoteMap - Remote Jobs on a Map",
  description: "Visualize remote job listings on an interactive world map. Find your next remote tech job anywhere in the world.",
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
