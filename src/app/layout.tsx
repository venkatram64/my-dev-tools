import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyDevTools — Daily Developer Tools",
  description: "Fast, free developer utilities: UUID generator, JSON formatter, hash generator, regex tester, JWT decoder, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <footer className="border-t py-6 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          MyDevTools &mdash; Daily Developer Tools &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
