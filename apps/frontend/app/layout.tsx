"use client";
import "./globals.css";
import type { ReactNode } from "react";
import { createContext, useState } from "react";
import Link from "next/link";
import { daisyuiThemes } from "constants";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState("dark");

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <main className="">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">
            <Link href="/">Concept Lab</Link>
          </h1>

          <div className="mb-4">
            <label className="mr-2 font-semibold">Theme:</label>
            <select
              className="select select-bordered select-sm"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {daisyuiThemes?.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
