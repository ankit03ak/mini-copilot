"use client";

import { useEffect, useState } from "react";
import PromptForm from "@/components/PromptForm";
import CodeOutput from "@/components/CodeOutput";
import HistoryPanel from "@/components/HistoryPanel";
import { HistoryItem, Language } from "@/lib/types";
import { loadHistory, saveHistory } from "@/lib/storage";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [error, setError] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);


  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const handleGenerate = async () => {
  if (!prompt.trim()) return;
  setIsLoading(true);
  setError(null);
  setCopyStatus("idle");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, language })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Something went wrong");
    }

    const data: HistoryItem = await res.json();
    setCode(data.code);

    // ✅ trigger history refetch
    setHistoryRefreshKey((prev) => prev + 1);
  } catch (err: any) {
    setError(err.message || "Failed to generate code");
  } finally {
    setIsLoading(false);
  }
};


  const handleHistorySelect = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setCode(item.code);
    setLanguage(item.language);
    setCopyStatus("idle");
  };

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      
    }
  };

  const filteredHistory = history.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.prompt.toLowerCase().includes(q) ||
      item.language.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 flex-1">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Generate Code with AI
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Describe what you want in plain English, and let AI write the code for you
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1.5fr_1.5fr] gap-4 h-[calc(100vh-200px)]">
       
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-800/50 rounded-xl p-3 overflow-hidden flex flex-col shadow-lg">
          <HistoryPanel
            items={filteredHistory}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSelect={handleHistorySelect}
            refreshKey={historyRefreshKey}
          />
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-800/50 rounded-xl p-4 flex flex-col shadow-lg">
          <PromptForm
            prompt={prompt}
            onPromptChange={setPrompt}
            language={language}
            onLanguageChange={setLanguage}
            isLoading={isLoading}
            onSubmit={handleGenerate}
          />
          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-300 dark:border-slate-800/50 rounded-xl p-4 flex flex-col shadow-lg">
          <CodeOutput
            code={code}
            language={language}
            isLoading={isLoading}
            onCopy={handleCopy}
            copyStatus={copyStatus}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
          />
        </div>
      </div>
    </div>
  );
}