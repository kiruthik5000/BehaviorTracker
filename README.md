# AI-Powered Behaviour & Session Tracker 🚀

A highly dynamic, full-stack workflow and productivity application designed to manage daily protocols, deep work sessions, and DSA problem tracking. This project uses AI heavily to auto-generate and mutate your schedule using plain English commands.

---

## 🌟 Key Features

### 🤖 AI-Powered Schedule Mutations
- Interact with the integrated AI (powered by Groq / LLaMA 3) to build or modify your entire day.
- Simply type inputs like *"Move my afternoon DSA session to the evening and give me a 30-minute break"* and the schedule dynamically updates.

### ⏱️ Dynamic Session State Machine
- **Automated Flow**: Sessions on your dashboard automatically restructure themselves sequentially:
  - **🟢 Ongoing Sessions:** Actively occurring tasks bounce to the top.
  - **⏳ Upcoming Sessions:** Scheduled in the future.
  - **✅ Finished Sessions:** Pushed cleanly to the bottom when fully cleared.
- Each individual task proactively flags itself with **"ONGOING"** or **"MISSED"** chips based on real-time clock monitoring.

### 🔔 Integrated Heartbeat Monitor & Audio Alarms
- A 5-minute background time monitor tracks your scheduled blocks.
- Uses the `AudioContext` API to generate bespoke sequence tones/alarms when a critical task window approaches, keeping you in the zone without external clocks.

### 💻 DSA Revision & Analytics
- Complete data models for tracking Leetcode/DSA problems (`DSAProblem.js`).
- Frontend revision timelines (`DSARevision.jsx`) map out spaced-repetition parameters.

### 🎨 Premium UI / UX
- Sleek, dark-mode terminal esthetics built using **Tailwind CSS**.
- Micro-animations, sliding accordions, CSS-glow filters, and Framer-like transition effects.

---

## 🛠️ Technology Stack

**Frontend (Client)**
- React (Vite)
- Tailwind CSS & Tailwind-merge
- `date-fns` for time mechanics
- `lucide-react` for dynamic SVG iconography

**Backend (API)**
- Node.js & Express
- MongoDB (via Mongoose)
- `groq-sdk` for AI LLM processing
- RESTful JSON design

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd Backend
npm install

# Set up environment variables
# Create a .env file in the /Backend root containing:
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/ai-tracker
# GROQ_API_KEY=your_groq_api_key_here

npm run dev # Starts the Express server via nodemon
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev # Starts the Vite dev server
```

The application client will default to `http://localhost:5173`. Ensure your backend API handles CORS correctly for the dev server footprint.

---

## 🧠 Application Structure
- **`/Backend/src/services/llmService.js`**: Core brain that interacts with Groq APIs, feeding current schedule states and retrieving JSON parsed structural updates.
- **`/Frontend/src/hooks/useScheduleMonitor.js`**: Hook containing the `setInterval` heartbeat and Audio oscillator for notifications.
- **`/Frontend/src/pages/Dashboard.jsx`**: The command center grouping sessions dynamically into functional categories.

---

## 📝 License
This project is open-source and free to be customized for local workflow optimizations. Do not distribute proprietary API keys.
