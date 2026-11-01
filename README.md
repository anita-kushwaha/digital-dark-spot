# 🔍 Truthora — AI-Assisted Information Gap Detection Platform

> **"Uncover the Gaps. Discover the Truth."**

> **Official Hackathon Theme:** Digital Dark Spot  
> **Mission:** Most AI platforms merely summarize what is already stated in documents. **Truthora** does the critical opposite: it exposes what is **missing**, cross-examines **contradictions**, highlights **outdated claims**, grounds verified **evidence**, and equips researchers with an actionable **verification checklist**.

---

## 🚀 Key Capabilities & Features

1. **Missing Information & Digital Dark Spots**
   - Automatically detects unaddressed operational dimensions across all sources (e.g., *Cost & Liability*, *Emergency Abort Protocols*, *Demographic Edge Cases*, *Independent Audit Replications*).
   - Generates precise, unanswered research questions labeled distinctly as `[AI HYPOTHESIZED GAP]` so investigators never confuse inference with source facts.

2. **Cross-Source Contradiction Matrix**
   - Discrepancy detector compares assertions across sources.
   - Isolates direct clashes in numerical figures (costs, percentages, cycles), dates, and feasibility status.
   - Displays **exact verbatim quotes side-by-side** with author, date, and extracted value.

3. **Temporal Drift & Obsolescence Radar**
   - Builds a chronological timeline of all sources.
   - Flags older promotional or preliminary claims (e.g., 2022 press releases) that have been superseded or disproven by newer audits (e.g., 2024–2026 reports).

4. **Grounded Source Evidence Sheet**
   - Extracts concrete factual statements strictly grounded in the ingested documents.
   - Provides full citations (Title, Author, Publisher, Date, URL) with one-click formal citation copying.

5. **Prioritized Verification Checklist**
   - Synthesizes findings into an actionable investigation roadmap.
   - Prioritized by **Priority 1 (High: Contradictions)**, **Priority 2 (Medium: Dark Spots)**, and **Priority 3 (Low: Stale Updates)**.
   - Interactive completion checkboxes, analyst notes input, custom task creator, and progress bar.

6. **Dossier Export**
   - One-click export of complete findings into clean **Markdown (.md)** or structured **JSON (.json)** for publication or sharing with team members and judges.

7. **Dual-Mode Engine Architecture**
   - **Local Heuristic Engine (100% Offline, Zero-Setup)**: Works immediately out-of-the-box without requiring an API key.
   - **Optional Gemini AI Enhancement**: An API settings modal allows investigators to connect a Google Gemini API key for deep semantic cross-examination.

---

## 📁 Pre-Loaded Demonstration Scenarios (Clearly Labeled `[SAMPLE DATA]`)

Three realistic, multi-source dossiers are built-in:
1. **Artemis III Lunar Landing:** NASA Public Schedule vs. GAO Independent Audit & ASAP Safety Panel (reveals conflicting launch dates, 4–8 vs 14–19 orbital refuelings, and missing abort protocols).
2. **QuantumSolid EV Battery:** Vendor Series-C Pitch Deck vs. Department of Energy Lab Audit (reveals 520 Wh/kg vs 385 Wh/kg disputes and missing cold-weather degradation data).
3. **OmniClinician AI Diagnostic:** Vendor Hospital Product Dossier vs. Multi-Center Emergency Clinical Trial (reveals 98.4% vs 86.1% sensitivity disputes and missing pediatric demographics).

---

## 🛠️ Step-by-Step Guide for Beginners

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your computer.

### Step 1: Open the Project Folder
Open your terminal (PowerShell, Command Prompt, or VS Code terminal) and navigate into the `digital-dark-spot` folder:
```powershell
cd digital-dark-spot
```

### Step 2: Start the Development Server
Run:
```powershell
npm run dev
```
*(Or double-click the `start.bat` file in Windows Explorer).*

### Step 3: Open the Web Application
Open your browser and navigate to:
```
http://localhost:5173
```

### Step 4: Test & Explore
1. Use the **[SAMPLE DATA]** dropdown in the top bar to switch between the 3 demonstration scenarios.
2. Click on the 5 tabs: **Digital Dark Spots**, **Contradiction Matrix**, **Temporal Drift**, **Source Evidence**, and **Verification Checklist**.
3. Try clicking **"Add New Source"** to paste your own article or interview notes and watch the engine update the findings in real time.
4. Click **"Export Report"** to copy or download your finished investigative briefing.

---

## 🏗️ Architecture & Folder Structure

```
digital-dark-spot/
├── index.html                   # HTML entry point with Inter & JetBrains fonts
├── vite.config.js               # Vite config with React & Tailwind v4 plugins
├── package.json                 # Project dependencies & scripts
├── start.bat                    # Quick launcher for Windows users
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main coordinator & analytical state
│   ├── index.css                # Tailwind CSS imports & custom styling tokens
│   ├── data/
│   │   └── sampleScenarios.js   # 3 realistic multi-source sample datasets
│   ├── engine/
│   │   ├── gapDetector.js       # Heuristic ontology & missing dimension analyzer
│   │   ├── contradictionDetector.js # Cross-source numerical & timeline dispute engine
│   │   ├── temporalAnalyzer.js  # Chronological lag & obsolescence detector
│   │   ├── factExtractor.js     # Verifiable source claim extraction
│   │   ├── checklistGenerator.js# Actionable prioritized verification planner
│   │   └── geminiService.js     # Optional live Gemini 1.5/2.0 API integration
│   └── components/
│       ├── Navbar.jsx           # Top branding, sample loader, and actions
│       ├── TopicHeader.jsx      # Topic input, domain selector, sample pill alerts
│       ├── SourceManager.jsx    # Ingestion form, validation, and source grid
│       ├── SourceCard.jsx       # Individual document card with word count & badges
│       ├── AnalysisOverview.jsx # Radar risk index, coverage stats, and tab bar
│       ├── GapAnalysisTab.jsx   # Digital dark spots & unanswered questions
│       ├── ContradictionTab.jsx # Side-by-side conflicting claims with verbatim quotes
│       ├── TemporalTab.jsx      # Chronology timeline & staleness alerts
│       ├── FactSheetTab.jsx     # Grounded facts with primary citations
│       ├── VerificationChecklist.jsx # Prioritized action tasks with checkboxes
│       ├── ApiSettingsModal.jsx # Optional Gemini key modal with localStorage
│       └── ExportModal.jsx      # Markdown and JSON dossier export
```

---

## 🏆 Hackathon Presentation Tips
When presenting to judges:
1. **Emphasize the Core Philosophy:** Explain that most AI projects merely summarize; Truthora solves the harder, more critical problem of finding **what is missing or contradicted**.
2. **Showcase Grounding Integrity:** Point out that all AI hypotheses are labeled with purple badges (`[AI HYPOTHESIZED GAP]`), while factual statements are labeled with emerald badges (`[SOURCE EVIDENCE]`) citing verbatim source paragraphs.
3. **Demonstrate Interactivity:** Check off tasks in the Verification Checklist, add a custom note, add a new source, and click "Export Report" to show a polished end-to-end workflow.
