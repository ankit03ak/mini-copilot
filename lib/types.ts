export type Language = "python" | "javascript" | "cpp";

export interface HistoryItem {
  id: string;
  prompt: string;
  code: string;
  language: Language;
  createdAt: string;
}
