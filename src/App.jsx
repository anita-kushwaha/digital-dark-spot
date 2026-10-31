import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TopicHeader } from './components/TopicHeader';
import { SourceManager } from './components/SourceManager';
import { AnalysisOverview } from './components/AnalysisOverview';
import { GapAnalysisTab } from './components/GapAnalysisTab';
import { ContradictionTab } from './components/ContradictionTab';
import { TemporalTab } from './components/TemporalTab';
import { FactSheetTab } from './components/FactSheetTab';
import { VerificationChecklist } from './components/VerificationChecklist';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { ExportModal } from './components/ExportModal';

import { SAMPLE_SCENARIOS } from './data/sampleScenarios';
import { detectInformationGaps } from './engine/gapDetector';
import { detectContradictions } from './engine/contradictionDetector';
import { analyzeTemporalDrift } from './engine/temporalAnalyzer';
import { extractGroundedFacts } from './engine/factExtractor';
import { generateVerificationChecklist } from './engine/checklistGenerator';
import { analyzeWithGemini } from './engine/geminiService';

export default function App() {
  // Scenario & Topic State (defaults to Artemis III sample scenario)
  const defaultScenario = SAMPLE_SCENARIOS[0];
  const [topic, setTopic] = useState(defaultScenario.title);
  const [domain, setDomain] = useState(defaultScenario.domain);
  const [sources, setSources] = useState(defaultScenario.sources);
  const [currentScenarioId, setCurrentScenarioId] = useState(defaultScenario.id);
  const [isSample, setIsSample] = useState(true);
  const [sampleBadgeText, setSampleBadgeText] = useState(defaultScenario.sampleBadgeText);

  // Settings & Navigation State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("dds_gemini_api_key") || "");
  const [activeTab, setActiveTab] = useState("gaps");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiErrorNotice, setAiErrorNotice] = useState(null);

  // Analytical Findings State
  const [gaps, setGaps] = useState([]);
  const [contradictions, setContradictions] = useState([]);
  const [temporalDrifts, setTemporalDrifts] = useState([]);
  const [facts, setFacts] = useState([]);
  const [checklist, setChecklist] = useState([]);

  // Core Engine Execution
  const executeAnalysis = useCallback(async (currentSources, currentTopic, preserveChecklist = false) => {
    setIsAnalyzing(true);
    setAiErrorNotice(null);

    try {
      // 1. Run Built-In Local Heuristic Engines (always reliable & offline-capable)
      const detectedGaps = detectInformationGaps(currentSources, currentTopic);
      const detectedConflicts = detectContradictions(currentSources);
      const detectedTemporal = analyzeTemporalDrift(currentSources);
      const extractedFacts = extractGroundedFacts(currentSources);

      // 2. Generate Actionable Verification Checklist
      const baseChecklist = generateVerificationChecklist(
        detectedGaps,
        detectedConflicts,
        detectedTemporal,
        currentSources
      );

      // If user provided a Gemini API Key, enhance findings with AI
      if (apiKey && apiKey.trim().length > 10 && currentSources.length >= 2) {
        try {
          const aiResponse = await analyzeWithGemini(currentTopic, currentSources, apiKey);
          if (aiResponse && aiResponse.darkSpotGaps) {
            // Append unique AI gaps
            aiResponse.darkSpotGaps.forEach((aiGap, i) => {
              detectedGaps.push({
                id: `gap-gemini-${i}`,
                type: "AI_HYPOTHESIZED_GAP",
                badge: "GEMINI 1.5 DEEP INFERENCE",
                category: aiGap.category || "Semantic Narrative Gap",
                urgency: aiGap.urgency || "High",
                unansweredQuestion: aiGap.unansweredQuestion,
                whyItMatters: aiGap.whyItMatters,
                affectedSources: currentSources.map(s => s.title),
                suggestedInvestigation: aiGap.suggestedInvestigation || "Investigate related primary documentation.",
                isGroundedInSource: false,
                aiRationale: "Identified via Gemini semantic cross-examination."
              });
            });
          }
        } catch (apiErr) {
          console.warn("Gemini enhancement notice:", apiErr);
          setAiErrorNotice(`Gemini key was not used (${apiErr.message}). Local engine provided all findings.`);
        }
      }

      setGaps(detectedGaps);
      setContradictions(detectedConflicts);
      setTemporalDrifts(detectedTemporal);
      setFacts(extractedFacts);

      // Preserve existing user checks or notes if requested
      if (preserveChecklist) {
        setChecklist((prev) => {
          const completedMap = new Map(prev.map(item => [item.id, { completed: item.completed, note: item.userNote }]));
          const userCustoms = prev.filter(item => item.id.startsWith("check-custom-"));
          
          const merged = baseChecklist.map(item => {
            const existing = completedMap.get(item.id);
            if (existing) {
              return { ...item, completed: existing.completed, userNote: existing.note };
            }
            return item;
          });
          return [...merged, ...userCustoms];
        });
      } else {
        setChecklist(baseChecklist);
      }

    } catch (err) {
      console.error("Analysis failure:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey]);

  // Initial trigger on mount or sources change
  useEffect(() => {
    executeAnalysis(sources, topic, false);
  }, []);

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("dds_gemini_api_key", key);
  };

  // Scenario selection
  const handleSelectSample = (scenarioId) => {
    const sc = SAMPLE_SCENARIOS.find(s => s.id === scenarioId);
    if (!sc) return;

    setCurrentScenarioId(sc.id);
    setTopic(sc.title);
    setDomain(sc.domain);
    setSources(sc.sources);
    setIsSample(true);
    setSampleBadgeText(sc.sampleBadgeText);
    executeAnalysis(sc.sources, sc.title, false);
  };

  // Reset to blank investigation
  const handleReset = () => {
    setCurrentScenarioId(null);
    setTopic("");
    setDomain("General Investigative Analysis");
    setSources([]);
    setIsSample(false);
    setSampleBadgeText("");
    setGaps([]);
    setContradictions([]);
    setTemporalDrifts([]);
    setFacts([]);
    setChecklist([]);
  };

  // Source CRUD
  const handleAddSource = (newSource) => {
    const updated = [newSource, ...sources];
    setSources(updated);
    setIsSample(false);
    executeAnalysis(updated, topic, true);
  };

  const handleUpdateSource = (updatedSource) => {
    const updated = sources.map(s => s.id === updatedSource.id ? updatedSource : s);
    setSources(updated);
    executeAnalysis(updated, topic, true);
  };

  const handleDeleteSource = (sourceId) => {
    const updated = sources.filter(s => s.id !== sourceId);
    setSources(updated);
    executeAnalysis(updated, topic, true);
  };

  // Checklist Handlers
  const handleToggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  const handleAddCustomTask = (newTask) => {
    setChecklist(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (id) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateNote = (id, note) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, userNote: note };
      }
      return item;
    }));
  };

  const checklistCompleted = checklist.filter(c => c.completed).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        onSelectSample={handleSelectSample}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isAiActive={Boolean(apiKey && apiKey.trim().length > 10)}
        sampleScenarios={SAMPLE_SCENARIOS}
        currentScenarioId={currentScenarioId}
      />

      {/* Main Investigation Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Notice for AI Fallback if relevant */}
        {aiErrorNotice && (
          <div className="mb-4 bg-slate-900 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-300 flex items-center justify-between">
            <span>{aiErrorNotice}</span>
            <button onClick={() => setAiErrorNotice(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
          </div>
        )}

        {/* 1. Target Topic & Domain Header */}
        <TopicHeader
          topic={topic}
          onTopicChange={setTopic}
          domain={domain}
          onDomainChange={setDomain}
          isSample={isSample}
          sampleBadgeText={sampleBadgeText}
          onReset={handleReset}
          sampleScenarios={SAMPLE_SCENARIOS}
          onSelectSample={handleSelectSample}
        />

        {/* 2. Source Management Section */}
        <SourceManager
          sources={sources}
          onAddSource={handleAddSource}
          onUpdateSource={handleUpdateSource}
          onDeleteSource={handleDeleteSource}
        />

        {/* 3. Analysis Overview & Navigation Tabs */}
        <AnalysisOverview
          activeTab={activeTab}
          onTabChange={setActiveTab}
          gapsCount={gaps.length}
          contradictionsCount={contradictions.length}
          outdatedCount={temporalDrifts.length}
          factsCount={facts.length}
          checklistTotal={checklist.length}
          checklistCompleted={checklistCompleted}
          onRunAnalysis={() => executeAnalysis(sources, topic, true)}
          isAnalyzing={isAnalyzing}
        />

        {/* 4. Tab Content Area */}
        <div className="pb-16">
          {activeTab === "gaps" && (
            <GapAnalysisTab gaps={gaps} topic={topic} />
          )}

          {activeTab === "contradictions" && (
            <ContradictionTab contradictions={contradictions} />
          )}

          {activeTab === "temporal" && (
            <TemporalTab temporalDrifts={temporalDrifts} sources={sources} />
          )}

          {activeTab === "facts" && (
            <FactSheetTab facts={facts} />
          )}

          {activeTab === "checklist" && (
            <VerificationChecklist
              checklist={checklist}
              onToggleComplete={handleToggleChecklist}
              onAddCustomTask={handleAddCustomTask}
              onDeleteTask={handleDeleteTask}
              onUpdateNote={handleUpdateNote}
            />
          )}
        </div>

      </main>

      {/* Footer with Integrity Pledge */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Digital Dark Spot</span>
            <span>—</span>
            <span>AI-Assisted Information Gap Detection</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Grounding-First Integrity Architecture</span>
            <span>•</span>
            <span>No Hallucinated Citations</span>
            <span>•</span>
            <span>Local Offline Engine Included</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        topic={topic}
        domain={domain}
        sources={sources}
        gaps={gaps}
        contradictions={contradictions}
        temporalDrifts={temporalDrifts}
        facts={facts}
        checklist={checklist}
      />

    </div>
  );
}
