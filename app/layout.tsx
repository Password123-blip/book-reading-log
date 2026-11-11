import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Reading Log",
  description: "Track pages, not vibes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
