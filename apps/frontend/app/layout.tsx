"use client";
import "./globals.css";
import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { daisyuiThemes } from "constants";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("dark");

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <main className="min-h-screen bg-base-200 px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-primary drop-shadow">
              <Link href="/">Concept Lab</Link>
            </h1>
            <div className="flex items-center">
              <label className="mr-2 font-semibold text-base-content">
                Theme:
              </label>
              <select
                className="select select-bordered select-sm capitalize bg-base-100 text-base-content font-semibold"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                {daisyuiThemes?.map((t: string) => (
                  <option key={t} value={t} className="capitalize">
                    {t.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <section className="max-w-8xl mx-auto bg-base-100 rounded-xl shadow-lg p-6">
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
