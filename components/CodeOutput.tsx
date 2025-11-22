"use client";

import { Language } from "@/lib/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface Props {
  code: string;
  language: Language;
  isLoading: boolean;
  onCopy: () => void;
  copyStatus: "idle" | "copied";
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const mapLanguage = (lang: Language) => {
  if (lang === "cpp") return "cpp";
  if (lang === "javascript") return "javascript";
  return "python";
};

export default function CodeOutput({
  code,
  language,
  isLoading,
  onCopy,
  copyStatus,
  fontSize,
  onFontSizeChange
}: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const languageColors = {
    python: "from-blue-500 to-cyan-500",
    javascript: "from-yellow-500 to-amber-500",
    cpp: "from-purple-500 to-pink-500"
  };

  const languageIcons = {
    python: "🐍",
    javascript: "⚡",
    cpp: "⚙️"
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFontSizeChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col h-full gap-4">
      
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${languageColors[language]} opacity-10 rounded-xl blur-xl`}></div>
        <div className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-xl border border-slate-300 dark:border-slate-700/50 shadow-xl p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${languageColors[language]} shadow-lg transition-transform hover:scale-105`}>
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  {language}
                </span>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Output</span>
            </div>

            
            <div className="flex items-center gap-4 flex-wrap">
              
              <div className="flex items-center gap-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 border border-slate-300 dark:border-slate-700/50">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">Font</span>
                <div className="relative w-24">
                  <input
                    type="range"
                    min="10"
                    max="22"
                    value={fontSize}
                    onChange={handleSliderChange}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider-custom"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${((fontSize - 10) / 12) * 100}%, #cbd5e1 ${((fontSize - 10) / 12) * 100}%, #cbd5e1 100%)`
                    }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono min-w-[28px]">{fontSize}px</span>
              </div>

              <button
                onClick={onCopy}
                disabled={!code}
                className={`
                  relative px-5 py-2 rounded-lg font-semibold text-sm text-white
                  transition-all duration-300 ease-out
                  ${code ? 'hover:scale-105 hover:shadow-xl active:scale-95' : 'opacity-50 cursor-not-allowed'}
                  ${copyStatus === "copied" 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/50' 
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-indigo-500/50'}
                  shadow-lg
                `}
              >
                {copyStatus === "copied" ? (
                  <span className="flex items-center gap-2">
                    <span>✓</span> Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Copy Code
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 relative group">
        <div className={`absolute inset-0 bg-gradient-to-br ${languageColors[language]} opacity-5 rounded-xl blur-2xl transition-opacity group-hover:opacity-10`}></div>
        <div className="relative h-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl overflow-hidden">
          
          <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${languageColors[language]} opacity-10 blur-3xl pointer-events-none`}></div>
          <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${languageColors[language]} opacity-10 blur-3xl pointer-events-none`}></div>
          
          <div className="relative h-full overflow-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 gap-4 p-8">
                <div className="relative w-16 h-16">
                  <div className={`absolute inset-0 rounded-full border-4 border-slate-300 dark:border-slate-800 border-t-transparent animate-spin`}></div>
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${languageColors[language]} opacity-30 blur-md`}></div>
                </div>
                <p className="text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-500 bg-clip-text text-transparent animate-pulse">
                  Generating code...
                </p>
              </div>
            ) : code ? (
              <SyntaxHighlighter
                language={mapLanguage(language)}
                style={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? atomDark : prism}
                customStyle={{
                  margin: 0,
                  background: "transparent",
                  fontSize,
                  padding: "1.5rem"
                }}
                showLineNumbers={true}
                wrapLines={true}
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  color: typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? '#475569' : '#94a3b8',
                  userSelect: 'none'
                }}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-500 gap-3 p-8">
                
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Code output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #065f46;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
          transition: all 0.2s ease;
        }
        
        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
        }
        
        .slider-custom::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }
        
        .slider-custom::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #065f46;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
          transition: all 0.2s ease;
        }
        
        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
        }
      `}</style>
    </div>
  );
}