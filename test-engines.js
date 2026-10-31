import { detectInformationGaps } from './src/engine/gapDetector.js';
import { detectContradictions } from './src/engine/contradictionDetector.js';
import { analyzeTemporalDrift } from './src/engine/temporalAnalyzer.js';
import { extractGroundedFacts } from './src/engine/factExtractor.js';
import { generateVerificationChecklist } from './src/engine/checklistGenerator.js';
import { SAMPLE_SCENARIOS } from './src/data/sampleScenarios.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== RUNNING DIGITAL DARK SPOT TEST SUITE ===");

// TEST 1: Gap Detector with empty sources
console.log("\n[1] Testing Gap Detector (Empty & Single Source Edge Cases):");
const emptyGaps = detectInformationGaps([]);
assert(Array.isArray(emptyGaps) && emptyGaps.length === 0, "Empty sources return empty array");

const sample1 = SAMPLE_SCENARIOS[0].sources;
const gaps = detectInformationGaps(sample1, SAMPLE_SCENARIOS[0].title);
assert(gaps.length > 0, `Identified ${gaps.length} gaps in Artemis scenario`);
assert(gaps.some(g => g.category.includes("Cost") || g.category.includes("Safety") || g.category.includes("Verification")), "Identified core unaddressed dimensions");
assert(gaps.some(g => g.evidenceStatus === "missing" || g.evidenceStatus === "partial"), "Properly labeled evidenceStatus as missing or partial");

// TEST 2: Contradiction Detector
console.log("\n[2] Testing Contradiction Detector (Confirmed vs Needs Manual Verification):");
const emptyConflicts = detectContradictions([sample1[0]]);
assert(Array.isArray(emptyConflicts) && emptyConflicts.length === 0, "Single source returns no contradictions (cannot cross-examine)");

const conflicts = detectContradictions(sample1);
assert(conflicts.length > 0, `Detected ${conflicts.length} cross-source comparisons in Artemis scenario`);

const confirmedConflicts = conflicts.filter(c => c.status === "CONFIRMED_CONTRADICTION");
const manualConflicts = conflicts.filter(c => c.status === "NEEDS_MANUAL_VERIFICATION");
assert(confirmedConflicts.length > 0, `Found ${confirmedConflicts.length} confirmed contradictions`);
assert(manualConflicts.length > 0, `Found ${manualConflicts.length} items flagged as Needs Manual Verification`);

// Verify that it does not invent contradictions on identical or non-conflicting texts
const peacefulSources = [
  { id: "p1", title: "Doc 1", content: "The sky is blue on clear summer days in the temperate zone.", publishedDate: "2024-01-01" },
  { id: "p2", title: "Doc 2", content: "The sky is blue when light scatters through nitrogen in the atmosphere.", publishedDate: "2024-01-02" }
];
const peacefulConflicts = detectContradictions(peacefulSources);
assert(peacefulConflicts.length === 0, "Does not invent contradictions when evidence is concordant");

// TEST 3: Temporal Drift
console.log("\n[3] Testing Temporal Drift Analyzer (Chronology & Undated Handlers):");
const drifts = analyzeTemporalDrift(sample1);
assert(drifts.length > 0, `Identified ${drifts.length} temporal items in Artemis scenario`);
assert(drifts.some(d => d.type === "TEMPORAL_DRIFT"), "Identified chronological drift over time");

const undatedSourceTest = [
  { id: "u1", title: "Undated Doc", content: "Some content here that is important.", publishedDate: "" }
];
const undatedResult = analyzeTemporalDrift(undatedSourceTest);
assert(undatedResult.some(r => r.type === "UNDATED_SOURCE_ALERT"), "Properly flags undated sources without inventing dates");

// TEST 4: Fact Extractor
console.log("\n[4] Testing Grounded Fact Extractor:");
const facts = extractGroundedFacts(sample1);
assert(facts.length > 0, `Extracted ${facts.length} grounded facts`);
assert(facts.every(f => Boolean(f.supportedFinding)), "Every fact has a specific supportedFinding formulated");
assert(facts.every(f => f.metadataIntegrity !== undefined), "Every fact has metadataIntegrity checked");

// TEST 5: Verification Checklist Generator
console.log("\n[5] Testing Prioritized Verification Checklist:");
const checklist = generateVerificationChecklist(gaps, conflicts, drifts, sample1);
assert(checklist.length > 0, `Generated ${checklist.length} actionable verification tasks`);
assert(checklist[0].priority === "High", "Top checklist task is High priority");
assert(checklist.some(c => c.category === "Contradiction Resolution" || c.category === "Manual Scope Verification"), "Includes contradiction reconciliation tasks");

console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) process.exit(1);
