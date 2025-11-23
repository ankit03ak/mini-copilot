"use client";

import { useEffect, useState, MouseEvent } from "react";
import { HistoryItem } from "@/lib/types";

interface Props {
  onSelect: (item: HistoryItem) => void;
  refreshKey: number;
}

function formatDate(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const month = months[date.getMonth()];
  return `${hours}:${minutes}, ${day} ${month}`;
}

type LanguageFilter = "all" | "python" | "javascript" | "cpp";

export default function HistoryPanel({ onSelect, refreshKey }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingFavoriteId, setTogglingFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/history", { method: "GET" });
        if (!res.ok) {
          console.error("Failed to fetch history");
          return;
        }
        const data: HistoryItem[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [refreshKey]);

  const languageColors = {
    python: "from-blue-500 to-cyan-500",
    javascript: "from-yellow-500 to-amber-500",
    cpp: "from-purple-500 to-pink-500"
  } as const;

  const languageBadgeColors = {
    python:
      "bg-blue-500/10 text-blue-400 dark:text-blue-400 border-blue-500/30",
    javascript:
      "bg-yellow-500/10 text-yellow-400 dark:text-yellow-400 border-yellow-500/30",
    cpp: "bg-purple-500/10 text-purple-400 dark:text-purple-400 border-purple-500/30"
  } as const;

  const filteredItems = items.filter((item) => {
    if (languageFilter !== "all" && item.language !== languageFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.prompt.toLowerCase().includes(q) ||
      item.language.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (
    e: MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    if (!id) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        console.error("Failed to delete history item");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting history item:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (
    e: MouseEvent<HTMLButtonElement>,
    item: HistoryItem
  ) => {
    e.stopPropagation();
    if (!item.id) return;

    const nextValue = !item.isFavorite;

    try {
      setTogglingFavoriteId(item.id);
      const res = await fetch(`/api/history/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: nextValue })
      });

      if (!res.ok) {
        console.error("Failed to update favorite");
        return;
      }

      const updated: HistoryItem = await res.json();

      setItems((prev) =>
        prev.map((h) =>
          h.id === updated.id ? { ...h, isFavorite: updated.isFavorite } : h
        )
      );
    } catch (err) {
      console.error("Error updating favorite:", err);
    } finally {
      setTogglingFavoriteId(null);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 rounded-xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-xl border border-slate-300 dark:border-slate-700/50 shadow-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-semibold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Prompt History
            </h3>
            {items.length > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                {items.length}
              </span>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur opacity-50"></div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-500 dark:text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50 rounded-lg text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                { value: "all", label: "All" },
                { value: "python", label: "Python" },
                { value: "javascript", label: "JavaScript" },
                { value: "cpp", label: "C++" }
              ] as { value: LanguageFilter; label: string }[]
            ).map((option) => {
              const isActive = languageFilter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setLanguageFilter(option.value)}
                  className={`px-2.5 py-1 text-[11px] rounded-full border transition-all ${
                    isActive
                      ? "bg-indigo-500/90 text-white border-indigo-500 shadow-sm"
                      : "bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400/70 hover:text-indigo-600 dark:hover:text-indigo-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 rounded-xl pointer-events-none"></div>

        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl rounded-full"></div>
              <div className="relative text-sm font-medium text-slate-600 dark:text-slate-400">
                Loading history...
              </div>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl rounded-full"></div>
              <div className="relative text-6xl opacity-30">📝</div>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
              No history yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-600 text-center max-w-xs">
              Try changing your filters or generate some code to see your prompts
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 pr-2">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full group relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${
                    languageColors[item.language]
                  } opacity-0 group-hover:opacity-10 rounded-lg blur-xl transition-opacity duration-300`}
                ></div>

                <div className="relative bg-gradient-to-br from-white/80 via-slate-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-800/50 dark:to-slate-900/80 border border-slate-300 dark:border-slate-700/50 rounded-lg p-3 transition-all duration-300 group-hover:border-slate-400 dark:group-hover:border-slate-600/50 group-hover:shadow-lg group-hover:translate-x-1">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 text-left leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {item.prompt}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${
                            languageBadgeColors[item.language]
                          } transition-all`}
                        >
                          {item.language}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">
                          {formatDate(new Date(item.createdAt))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleToggleFavorite(e, item)}
                          className="text-slate-400 dark:text-slate-500 hover:text-amber-400 dark:hover:text-amber-300 transition-colors"
                          title={
                            item.isFavorite ? "Remove from favorites" : "Add to favorites"
                          }
                        >
                          <svg
                            className={`w-4 h-4 ${
                              item.isFavorite ? "fill-amber-400 stroke-amber-400" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>

                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          className="text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                          title="Delete from history"
                        >
                          <svg
                            className="w-5 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 7h12M10 11v6M14 11v6M9 7V5h6v2M5 7l1 12h12l1-12"
                            />
                          </svg>
                        </button>

                        <div className="text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 text-[10px] text-slate-300 dark:text-slate-700 font-mono">
                    #{filteredItems.length - index}
                  </div>

                  {deletingId === item.id && (
                    <div className="absolute inset-0 rounded-lg bg-slate-900/10 dark:bg-black/30 flex items-center justify-center text-[10px] text-slate-500">
                      Deleting...
                    </div>
                  )}

                  {togglingFavoriteId === item.id && (
                    <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-slate-900/5 dark:bg-black/20 flex items-center justify-center text-[9px] text-slate-500 py-1">
                      Updating...
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .overflow-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 3px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
}
