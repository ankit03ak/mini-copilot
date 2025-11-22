"use client";

import { Language } from "@/lib/types";
import { KeyboardEvent, useState } from "react";

interface Props {
  prompt: string;
  onPromptChange: (value: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export default function PromptForm({
  prompt,
  onPromptChange,
  language,
  onLanguageChange,
  isLoading,
  onSubmit
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  const languageOptions = [
    { value: "python", label: "Python", color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30" },
    { value: "javascript", label: "JavaScript", color: "from-yellow-500 to-amber-500", bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30" },
    { value: "cpp", label: "C++", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30" }
  ];

  const selectedLanguage = languageOptions.find(opt => opt.value === language)!;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r ${selectedLanguage.color} opacity-10 rounded-xl blur-xl`}></div>
        <div className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-xl border border-slate-300 dark:border-slate-700/50 shadow-xl p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all duration-300 ${selectedLanguage.bgColor}`}
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                  {selectedLanguage.label}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-lg shadow-2xl overflow-hidden z-20">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onLanguageChange(option.value as Language);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-slate-200 dark:border-slate-800/50 last:border-b-0 ${
                          option.value === language 
                            ? option.bgColor 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{option.label}</span>
                        {option.value === language && (
                          <svg className="w-4 h-4 ml-auto text-emerald-500 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onSubmit}
              disabled={isLoading || !prompt.trim()}
              className={`
                relative px-6 py-2.5 rounded-lg font-semibold text-sm text-white
                transition-all duration-300 ease-out
                ${(isLoading || !prompt.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl active:scale-95'}
                ${isLoading 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'}
                shadow-lg
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Generate Code
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative group">
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedLanguage.color} opacity-5 rounded-xl blur-2xl transition-opacity ${isFocused ? 'opacity-10' : ''}`}></div>
        <div className="relative h-full rounded-xl border border-slate-300 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl overflow-hidden">
          
          <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${selectedLanguage.color} opacity-10 blur-3xl pointer-events-none`}></div>
          <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${selectedLanguage.color} opacity-10 blur-3xl pointer-events-none`}></div>
          
          <div className="relative h-full flex flex-col p-4">
            
            

            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`e.g. "Write a ${selectedLanguage.label} function to reverse a string"`}
              className={`
                flex-1 w-full bg-transparent text-slate-900 dark:text-slate-200 text-sm
                placeholder-slate-400 dark:placeholder-slate-600 resize-none outline-none
                transition-all duration-200
                ${isFocused ? 'placeholder-slate-500 dark:placeholder-slate-500' : ''}
              `}
            />

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/50">
              
              <span className={`text-xs font-mono ${prompt.length > 0 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'}`}>
                {prompt.length} chars
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}