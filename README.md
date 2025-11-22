# Mini Code Copilot

A lightweight web app that simulates a code-generation copilot.  
Users can type natural language prompts, choose a language, and see generated code suggestions with syntax highlighting.

Deployed demo: _add your URL here_

---

## Tech Stack

- **Framework:** Next.js (App Router) with **TypeScript**
- **Styling / UI:** Tailwind CSS + Material UI (MUI)
- **Code Highlighting:** `react-syntax-highlighter` (Prism theme)
- **State & Data:**
  - Client-side React state (`useState`, `useEffect`)
  - Prompt history persisted in `localStorage`
- **Backend:** Next.js API Route (`/api/generate`) acting as a mock AI backend

---

## Features

### Core Requirements

- **Prompt Input Box**
  - Users type natural-language instructions (e.g. “Write a Python function to reverse a string”).
- **Generate Button**
  - Sends a `POST` request to `/api/generate`.
  - Shows a **loading state** while waiting.
  - Handles error states gracefully.
- **Code Output Box**
  - Shows generated code with syntax highlighting.
  - Uses `react-syntax-highlighter` with a Prism theme.
- **Clean, responsive layout**
  - History on the left (side panel).
  - Prompt editor in the center.
  - Code output on the right.
  - Uses Tailwind for layout and spacing, MUI for form controls and buttons.
- **TypeScript**
  - All app code written in TypeScript.

### Strongly Recommended Bonus Features

- **Language Selector**
  - Dropdown: Python / JavaScript / C++.
  - Selected language is sent to the backend and used to pick a code snippet.
- **Prompt History Panel**
  - Shows previous prompts and their generated code.
  - Persisted in `localStorage` so it survives page reloads.
  - Clicking a history item restores that prompt + code.
  - Search bar to filter history by prompt text or language.
- **Copy to Clipboard**
  - Button to copy the generated code snippet.
  - Shows a small “Copied” feedback.
- **Adjustable Code Font Size**
  - Slider control to increase/decrease code font size in the output panel.

### Additional UX Details

- Keyboard shortcut: **Ctrl/⌘ + Enter** to trigger code generation.
- Clear, minimal dark theme using MUI + Tailwind.
- Empty-state messages for history and output areas.
- Inline error message if the API fails or prompt is missing.

---

## Project Structure

```bash
mini-code-copilot/
├─ app/
│  ├─ layout.tsx          
│  ├─ globals.css         
│  ├─ page.tsx            
│  └─ api/
│     └─ generate/
│        └─ route.ts     
├─ components/
│  ├─ PromptForm.tsx      
│  ├─ CodeOutput.tsx      
│  └─ HistoryPanel.tsx    
├─ lib/
│  ├─ types.ts            
│  ├─ storage.ts          
│  └─ mockSnippets.ts     
├─ public/
│  └─ favicon.ico
├─ tailwind.config.ts
├─ postcss.config.mjs
├─ next.config.mjs
├─ tsconfig.json
└─ package.json
