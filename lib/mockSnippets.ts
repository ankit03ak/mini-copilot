import { Language } from "./types";

const snippets: Record<Language, { id: string; code: string }[]> = {
  python: [
    {
      id: "reverse-string",
      code: `def reverse_string(s: str) -> str:
    return s[::-1]`
    },
    {
      id: "factorial",
      code: `def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)`
    }
  ],
  javascript: [
    {
      id: "reverse-string",
      code: `function reverseString(str) {
  return str.split("").reverse().join("");
}`
    },
    {
      id: "factorial",
      code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`
    }
  ],
  cpp: [
    {
      id: "reverse-string",
      code: `#include <string>
#include <algorithm>

std::string reverseString(const std::string& s) {
    std::string result = s;
    std::reverse(result.begin(), result.end());
    return result;
}`
    },
    {
      id: "factorial",
      code: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`
    }
  ]
};

const pickByPrompt = (prompt: string): "reverse-string" | "factorial" => {
  const lower = prompt.toLowerCase();
  if (lower.includes("reverse") && lower.includes("string")) {
    return "reverse-string";
  }
  if (lower.includes("factorial")) {
    return "factorial";
  }
  return "reverse-string";
};

export const getMockCode = (prompt: string, language: Language): string => {
  const key = pickByPrompt(prompt);
  const list = snippets[language];
  const found = list.find((s) => s.id === key) ?? list[0];
  return found.code;
};
