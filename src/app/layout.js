import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Musical Enchanter - Transform Your Tracks",
  description: "Transform your music into viral hits with AI-powered remixing optimized for TikTok and social platforms.",
  themeColor: "#6c5ce7",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-light)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10 z-[-1]"></div>
        <Navigation />
        <div className="pt-16 pb-10 px-4 max-w-7xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
