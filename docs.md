================================================================================
                      NEUROTRACKER — APPLICATION DOCUMENTATION
                             High-Intensity Session & Behaviour Tracker
================================================================================

OVERVIEW
────────
NeuroTracker is a full-stack AI-powered productivity application designed to help
developers manage their day at a granular level. It supports real-time schedule
mutation via natural language, DSA problem tracking, performance analytics, and
an integrated IDE Workbench view — all in a premium dark-mode interface.

TECH STACK
──────────
  Frontend  : React 19 (Vite), Tailwind CSS v4, lucide-react, recharts, date-fns
  Backend   : Node.js, Express, MongoDB (Mongoose), Groq SDK (LLaMA 3 AI)
  AI Engine : Groq API — natural language → structured JSON schedule mutations

ROUTES & PAGES
──────────────
  /dashboard   → Daily Protocol command center
  /dsa         → DSA Revision Hub (problem tracker)
  /analytics   → Performance metrics and chart history
  /settings    → Preferences, API key, notifications, data management
  /workbench   → NeonIDE — Full-screen coding challenge UI (static mockup)

PAGE FUNCTIONALITY
──────────────────

  DASHBOARD (/dashboard)
  • Displays today's scheduled sessions, fetched from the backend by date.
  • Sessions are auto-sorted into 3 live states:
      - 🟢 Ongoing   → Task window is currently active (clock-aware).
      - ⏳ Upcoming  → Future scheduled tasks.
      - ✅ Finished  → All tasks in the session are completed.
  • Each task card shows "ONGOING" or "MISSED" badges in real time (updates
    every 60 seconds via a client-side timer).
  • One-click task completion toggle — optimistic UI with backend sync.
  • A progress bar tracks overall daily completion percentage.
  • AI Copilot widget (bottom of sidebar) lets you type plain-English prompts
    (e.g. "I woke up late, compress morning") to restructure the entire day's
    schedule via the Groq AI backend.
  • AI Mutations counter shows how many times AI has touched today's schedule.
  • Background heartbeat hook (useScheduleMonitor) fires every 5 minutes and
    uses the WebAudio API to play alarm tones for approaching task windows.

  DSA REVISION (/dsa)
  • Tracks LeetCode / algorithm problems stored in MongoDB.
  • Problems are grouped by pattern (e.g. Sliding Window, Hash Map).
  • Collapsible accordion per pattern group showing progress (X / N completed).
  • Add new problems via inline form: title, URL, difficulty, pattern tag.
  • Toggle problem status between "to-revise" and "completed" with one click.

  ANALYTICS (/analytics)
  • Fetches all historical session logs from the backend.
  • Three stat cards: Avg. Completion %, Total AI Interventions, Best Day.
  • Area chart (Recharts) showing day-by-day task completion trend over time.

  SETTINGS (/settings)
  • Google Gemini API Key — stored in localStorage, used for AI schedule calls.
  • Push Notifications toggle — enables/disables audio alarm behaviour.
  • System Theme selector (Light / Dark / System) — UI preference.
  • Data Management — Export history as CSV or permanently reset all records.

  WORKBENCH (/workbench)
  • Full-screen NeonIDE UI — a static mockup of a coding challenge interface.
  • Panels: Problem Description | Code Editor (syntax-highlighted) | AI Insights.
  • Bottom terminal with Custom Test Cases, Active Cases, and Locked Cases.
  • Status bar, evaluation bar (runtime/memory/pass stats), and AI chat input.

QUICK START
───────────
  Backend:   cd Backend && npm install && npm run dev      → http://localhost:5000
  Frontend:  cd Frontend && npm install && npm run dev     → http://localhost:5173

  Backend .env required:
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/ai-tracker
    GROQ_API_KEY=<your_key>

================================================================================