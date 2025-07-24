import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <main className="max-w-2xl mx-auto my-10 bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Concept Lab</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
