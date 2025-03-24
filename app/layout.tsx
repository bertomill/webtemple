// Import necessary dependencies from Next.js
import type { Metadata } from "next";
// Import font families from Google Fonts through Next.js font system
import { Inter } from "next/font/google";
// Import global CSS styles
import "./globals.css";

// Configure the Inter font family
// This is a modern, clean sans-serif font for general text
const inter = Inter({ subsets: ["latin"] });

// Define metadata for the application
// This information appears in browser tabs and search results
export const metadata: Metadata = {
  title: "Web Temple",
  description: "Business Website Design Assistant",
};

// Root layout component that wraps all pages
// This is a special Next.js component that provides the basic HTML structure
export default function RootLayout({
  children, // Children represents all the page content that will be wrapped by this layout
}: {
  children: React.ReactNode
}) {
  return (
    // Basic HTML structure with language set to English
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
