import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const STORAGE_KEYS = {
  SOURCES: "dds_sources_v2",
  TOPIC: "dds_topic_v2",
  DOMAIN: "dds_domain_v2",
  IS_SAMPLE: "dds_is_sample_v2",
  BADGE: "dds_badge_v2",
  SCENARIO_ID: "dds_scenario_id_v2",
  CHECKLIST: "dds_checklist_v2",
  API_KEY: "dds_gemini_api_key"
};

export default function App() {
  const defaultScenario = SAMPLE_SCENARIOS[0];

  // Persistent Scenario & Topic State
  const [topic, setTopic] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.TOPIC) || defaultScenario.title;
  });

  const [domain, setDomain] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DOMAIN) || defaultScenario.domain;
  });

  const [sources, setSources] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOURCES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn("Failed to parse saved sources:", e);
      }
    }
    return defaultScenario.sources;
  });

  const [currentScenarioId, setCurrentScenarioId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SCENARIO_ID) || defaultScenario.id;
  });

  const [isSample, setIsSample] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_SAMPLE);
    return saved !== null ? saved === "true" : true;
  });

  const [sampleBadgeText, setSampleBadgeText] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.BADGE) || defaultScenario.sampleBadgeText;
  });

  // Settings & Navigation State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEYS.API_KEY) || "");
  const [activeTab, setActiveTab] = useState("gaps");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);

  // Analytical Findings State
  const [gaps, setGaps] = useState([]);
  const [contradictions, setContradictions] = useState([]);
  const [temporalDrifts, setTemporalDrifts] = useState([]);
  const [facts, setFacts] = useState([]);
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn("Failed to parse saved checklist:", e);
      }
    }
    return [];
  });

  // Keep localStorage synchronized
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPIC, topic);
  }, [topic]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOMAIN, domain);
  }, [domain]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_SAMPLE, String(isSample));
  }, [isSample]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BADGE, sampleBadgeText);
  }, [sampleBadgeText]);

  useEffect(() => {
    if (currentScenarioId) {
      localStorage.setItem(STORAGE_KEYS.SCENARIO_ID, currentScenarioId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SCENARIO_ID);
    }
  }, [currentScenarioId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
  }, [checklist]);

  // Core Engine Execution
  const executeAnalysis = useCallback(async (currentSources, currentTopic, preserveChecklist = true) => {
    setIsAnalyzing(true);
    setAiNotice(null);

    try {
      const detectedGaps = detectInformationGaps(currentSources, currentTopic);
      const detectedConflicts = detectContradictions(currentSources);
      const detectedTemporal = analyzeTemporalDrift(currentSources);
      const extractedFacts = extractGroundedFacts(currentSources);

      const baseChecklist = generateVerificationChecklist(
        detectedGaps,
        detectedConflicts,
        detectedTemporal,
        currentSources
      );

      // Optional Gemini Semantic Analysis
      if (apiKey && apiKey.trim().length > 10 && currentSources.length >= 2) {
        try {
          const aiResponse = await analyzeWithGemini(currentTopic, currentSources, apiKey);
          if (aiResponse && aiResponse.darkSpotGaps) {
            aiResponse.darkSpotGaps.forEach((aiGap, i) => {
              detectedGaps.push({
                id: `gap-gemini-${i}`,
                type: "INFORMATION_GAP",
                badge: "GEMINI 1.5 DEEP INFERENCE",
                category: aiGap.category || "Semantic Narrative Gap",
                urgency: aiGap.urgency || "High",
                unansweredQuestion: aiGap.unansweredQuestion,
                whyItMatters: aiGap.whyItMatters,
                evidenceStatus: "missing",
                evidenceSummary: "Identified via Gemini semantic cross-examination across documents.",
                supportingEvidenceSnippet: null,
                affectedSources: currentSources.map(s => s.title),
                suggestedInvestigation: aiGap.suggestedInvestigation || "Investigate related primary documentation.",
                isGroundedInSource: false,
                detectionMethod: "Gemini 1.5 Flash API"
              });
            });
            setAiNotice("Gemini 1.5 successfully augmented the investigation with semantic inferences.");
          }
        } catch (apiErr) {
          console.warn("Gemini enhancement notice:", apiErr);
          setAiNotice(`Note: Optional Gemini key call failed (${apiErr.message}). Local deterministic engine provided all findings.`);
        }
      }

      setGaps(detectedGaps);
      setContradictions(detectedConflicts);
      setTemporalDrifts(detectedTemporal);
      setFacts(extractedFacts);

      // Merge Checklist while preserving user completion state, notes, and custom tasks
      setChecklist((prevList) => {
        if (!preserveChecklist || prevList.length === 0) {
          return baseChecklist;
        }

        const completedMap = new Map(
          prevList.map(item => [item.id, { completed: item.completed, note: item.userNote }])
        );
        const userCustoms = prevList.filter(item => item.id.startsWith("check-custom-"));

        const merged = baseChecklist.map(item => {
          const existing = completedMap.get(item.id);
          if (existing) {
            return { ...item, completed: existing.completed, userNote: existing.note };
          }
          return item;
        });

        return [...merged, ...userCustoms];
      });

    } catch (err) {
      console.error("Analysis failure:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey]);

  // Initial trigger on mount
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      executeAnalysis(sources, topic, true);
    }
  }, [executeAnalysis, sources, topic]);

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  };

  // Sample scenario selection
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
    localStorage.removeItem(STORAGE_KEYS.SOURCES);
    localStorage.removeItem(STORAGE_KEYS.TOPIC);
    localStorage.removeItem(STORAGE_KEYS.DOMAIN);
    localStorage.removeItem(STORAGE_KEYS.IS_SAMPLE);
    localStorage.removeItem(STORAGE_KEYS.BADGE);
    localStorage.removeItem(STORAGE_KEYS.SCENARIO_ID);
    localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
  };

  // Source CRUD Operations
  const handleAddSource = (newSource) => {
    const updated = [newSource, ...sources];
    setSources(updated);
    const hasAnySample = updated.some(s => s.isSample);
    const hasAnyUser = updated.some(s => s.isUserSource);
    if (hasAnyUser && !hasAnySample) {
      setIsSample(false);
      setSampleBadgeText("");
    } else if (hasAnyUser && hasAnySample) {
      setIsSample(true);
      setSampleBadgeText("HYBRID DOSSIER (SAMPLE + USER SOURCES)");
    }
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
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <Navbar
        onSelectSample={handleSelectSample}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isAiActive={Boolean(apiKey && apiKey.trim().length > 10)}
        sampleScenarios={SAMPLE_SCENARIOS}
        currentScenarioId={currentScenarioId}
      />

      {/* Centered, Responsive Content Container with Generous Spacing */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8 lg:space-y-10">
        
        {/* Notice for AI Fallback or Status if relevant */}
        {aiNotice && (
          <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-3 text-xs text-indigo-300 flex items-center justify-between">
            <span>{aiNotice}</span>
            <button onClick={() => setAiNotice(null)} className="text-slate-400 hover:text-white ml-2 text-xs">✕</button>
          </div>
        )}

        {/* 1. Target Topic & Domain Header */}
        <section>
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
        </section>

        {/* 2. Source Management Section */}
        <section>
          <SourceManager
            sources={sources}
            onAddSource={handleAddSource}
            onUpdateSource={handleUpdateSource}
            onDeleteSource={handleDeleteSource}
          />
        </section>

        {/* 3. Analysis Navigation & Results */}
        <section className="space-y-6">
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
            isAiActive={Boolean(apiKey && apiKey.trim().length > 10)}
            sourcesCount={sources.length}
          />

          {/* 4. Tab Content Area */}
          <div className="pt-2">
            {activeTab === "gaps" && (
              <GapAnalysisTab 
                gaps={gaps} 
                topic={topic} 
                sourcesCount={sources.length} 
              />
            )}

            {activeTab === "contradictions" && (
              <ContradictionTab 
                contradictions={contradictions} 
                sourcesCount={sources.length} 
              />
            )}

            {activeTab === "temporal" && (
              <TemporalTab 
                temporalDrifts={temporalDrifts} 
                sources={sources} 
              />
            )}

            {activeTab === "facts" && (
              <FactSheetTab 
                facts={facts} 
                sourcesCount={sources.length} 
              />
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
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Digital Dark Spot</span>
            <span>—</span>
            <span>AI-Assisted Information Gap Detection Platform</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Grounding-First Integrity</span>
            <span>•</span>
            <span>Zero Hallucinated URLs</span>
            <span>•</span>
            <span>Offline Deterministic Engine</span>
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
