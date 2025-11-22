
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import ThemeRegistry from "@/components/ThemeRegistry";
import ThemeToggleButton from "@/components/ThemeToggleButton";

export const metadata: Metadata = {
  title: "Mini Code Copilot",
  description: "Lightweight code generation copilot demo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <div className="min-h-screen flex flex-col relative overflow-hidden">
           
            <div className="fixed inset-0 -z-10 overflow-hidden">
             
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500"></div>

              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div
                className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            <header className="relative border-b border-slate-300 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5"></div>
              <div className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
               
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="/images/mini-copilot.png"
                      alt="Mini Copilot Logo"
                      className="w-10 h-10 object-contain rounded-full"
                    />
                  </div>

                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                      Mini Code Copilot
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-500">
                      AI-Powered Code Generation
                    </p>
                  </div>
                </div>

                <ThemeToggleButton />
              </div>
            </header>

            <main className="flex-1 relative">{children}</main>
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
