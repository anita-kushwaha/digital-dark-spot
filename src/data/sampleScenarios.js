/**
 * SAMPLE DATASETS FOR DEMONSTRATION & JUDGING
 * 
 * IMPORTANT REQUIREMENT:
 * All scenarios in this file are clearly tagged with isSample: true 
 * and isUserSource: false, displaying prominent [SAMPLE DATA] banners in the UI.
 */

export const SAMPLE_SCENARIOS = [
  {
    id: "artemis-lunar-mission",
    title: "Artemis III Lunar Landing: NASA Schedule vs. GAO Audit",
    domain: "Aerospace & Defense",
    description: "Conflicting launch dates, discrepancies in orbital refueling requirements, outdated 2022 budget estimates, and missing abort safety protocols.",
    isSample: true,
    sampleBadgeText: "OFFICIAL SAMPLE DATASET #1",
    sources: [
      {
        id: "src-artemis-1",
        title: "NASA Artemis III Architecture & Schedule Milestone Announcement",
        publisher: "NASA Public Affairs Office",
        author: "Jim Free, Associate Administrator",
        publishedDate: "2022-10-15",
        url: "https://www.nasa.gov/press-release/artemis-iii-update-2022",
        reliabilityTier: "Official Agency (Primary Source)",
        isSample: true,
        isUserSource: false,
        content: `NASA targets late 2025 for the historic Artemis III mission to return American astronauts to the lunar South Pole. The SpaceX Starship Human Landing System (HLS) contract is structured under a firm fixed-price award of $2.89 billion. Orbital refueling architecture requires an estimated 4 to 8 propellant transfer flights in Low Earth Orbit prior to lunar departure. Thermal insulation testing indicates propellant boil-off rates remain well within acceptable mission thresholds. Crew spacesuits manufactured by Axiom Space are on schedule for preliminary design review in Q1 2023.`
      },
      {
        id: "src-artemis-2",
        title: "GAO Report GAO-24-106256: NASA Lunar Programs Face Significant Schedule Pressures",
        publisher: "U.S. Government Accountability Office (GAO)",
        author: "Office of Acquisition and Sourcing Management",
        publishedDate: "2024-11-20",
        url: "https://www.gao.gov/products/gao-24-106256",
        reliabilityTier: "Independent Audit (Oversight Body)",
        isSample: true,
        isUserSource: false,
        content: `A realistic schedule analysis indicates Artemis III is delayed to no earlier than September 2026, with elevated risk of sliding into mid-2027. GAO independent engineering assessments reveal that SpaceX's Starship HLS will require approximately 14 to 19 in-orbit cryogenic propellant transfer flights, substantially higher than initial projections. High boil-off rates during multi-week orbital cryogenic loiter remain unresolved. Total agency obligations for lunar surface systems have climbed to $4.15 billion. The uncrewed lunar test flight originally slated for 2024 has not yet occurred.`
      },
      {
        id: "src-artemis-3",
        title: "Aerospace Safety Advisory Panel (ASAP) Annual Report to Congress",
        publisher: "Aerospace Safety Advisory Panel",
        author: "Dr. Patricia Sanders, ASAP Chair",
        publishedDate: "2026-01-18",
        url: "https://oiir.hq.nasa.gov/asap/documents/2025_ASAP_Annual_Report.pdf",
        reliabilityTier: "Independent Safety Review",
        isSample: true,
        isUserSource: false,
        content: `The Panel observes ongoing technical risks with Orion capsule heat-shield char loss observed on Artemis I. Crew egress procedures during a South Pole contingency remain undefined. SpaceX orbital docking mechanisms have undergone partial vacuum testing, but microgravity cryogenic transfer at scale is unproven. While NASA maintains a 2026 target window, the convergence of Starship cryogenic transfer, Axiom suit mobility certification, and heat-shield verification suggests early 2028 as the first statistically sound crewed landing target.`
      }
    ]
  },
  {
    id: "solid-state-battery",
    title: "QuantumSolid EV Battery: Breakthrough Claims vs. Independent Lab Audit",
    domain: "Clean Energy & DeepTech",
    description: "Commercialization timelines, energy density discrepancies, outdated cathode lifespan projections, and missing cold-weather degradation data.",
    isSample: true,
    sampleBadgeText: "OFFICIAL SAMPLE DATASET #2",
    sources: [
      {
        id: "src-bat-1",
        title: "QuantumSolid Corp Series-C Pitch Deck & Technical Whitepaper",
        publisher: "QuantumSolid Technologies Inc.",
        author: "Dr. Viktor Vance, Chief Scientist",
        publishedDate: "2022-04-10",
        url: "https://quantumsolid.tech/whitepaper/qs-500-battery-cell",
        reliabilityTier: "Commercial Vendor (Self-Reported)",
        isSample: true,
        isUserSource: false,
        content: `QuantumSolid's proprietary ceramic electrolyte cell achieves a revolutionary gravimetric energy density of 520 Wh/kg. Cell degradation testing shows retention of 94% initial capacity after 1,200 fast-charge cycles at 25°C. Full-scale automotive pilot production is slated to launch by Q4 2024 at our Nevada gigafactory, with vehicle integration partnerships beginning in early 2025 at an estimated cost of $72 per kWh.`
      },
      {
        id: "src-bat-2",
        title: "National Clean Energy Laboratory (NCEL) Battery Assessment Bulletin",
        publisher: "Department of Energy Research Institute",
        author: "Dr. Elena Rostova & Materials Validation Team",
        publishedDate: "2025-06-12",
        url: "https://ncel.energy.gov/reports/solid-state-eval-2025",
        reliabilityTier: "Independent Government Testing Lab",
        isSample: true,
        isUserSource: false,
        content: `Independent bench testing of QuantumSolid Gen-2 prototype pouch cells measured actual ambient energy density at 385 Wh/kg under standard load cycles, significantly lower than manufacturer claims. When subjected to continuous fast-charging, micro-crack dendrite formations caused capacity degradation to 78% after only 450 cycles. Mass manufacturing scalability remains inhibited by high defect rates in ceramic separator sintering, preventing projected 2024-2025 gigafactory deployment.`
      },
      {
        id: "src-bat-3",
        title: "Automotive Industry Supply Chain Analysis 2026",
        publisher: "Global Mobility Insights",
        author: "Marcus Chen, Lead Analyst",
        publishedDate: "2026-02-05",
        url: "https://mobilityinsights.org/reports/solid-state-timeline-2026",
        reliabilityTier: "Industry Analysis / Market Report",
        isSample: true,
        isUserSource: false,
        content: `No automaker has confirmed active tooling integration for QuantumSolid cells for model years 2025 or 2026. Realistic commercial production parity with conventional lithium nickel manganese cobalt oxide (NMC) chemistries will not be economically viable before 2029. Current raw production cost for prototype ceramic separators exceeds $180 per kWh, over double conventional lithium-ion cell packs.`
      }
    ]
  },
  {
    id: "healthcare-ai-diagnostic",
    title: "OmniClinician AI: Vendor Diagnostic Claims vs. Clinical Hospital Trial",
    domain: "Healthcare & Clinical AI",
    description: "Conflicting diagnostic accuracy metrics, outdated regulatory approval assumptions, and critical gaps in pediatric and minority demographic validation.",
    isSample: true,
    sampleBadgeText: "OFFICIAL SAMPLE DATASET #3",
    sources: [
      {
        id: "src-med-1",
        title: "OmniClinician Diagnostic Assistant 2.0 Product Dossier",
        publisher: "Synthetix Health AI",
        author: "Clinical Engineering Group",
        publishedDate: "2023-08-14",
        url: "https://synthetixhealth.ai/omniclinician-dossier-2023",
        reliabilityTier: "Commercial Vendor (Self-Reported)",
        isSample: true,
        isUserSource: false,
        content: `OmniClinician 2.0 achieves 98.4% diagnostic concordance with senior board-certified radiologists in detecting early-stage pulmonary nodules and thoracic pathologies. The algorithm processes chest CT scans in under 12 seconds with a zero false-negative rate on critical emergencies. The platform is designed for turnkey emergency triage deployment under pending FDA 510(k) clearance anticipated by mid-2024.`
      },
      {
        id: "src-med-2",
        title: "Multicenter Emergency Radiology Clinical Evaluation of OmniClinician",
        publisher: "Annals of Emergency Diagnostic Medicine",
        author: "K. Gupta, MD, MPH; R. Torres, MD",
        publishedDate: "2025-10-02",
        url: "https://aedm-journal.org/article/2025-multicenter-omniclinician-trial",
        reliabilityTier: "Peer-Reviewed Academic Journal",
        isSample: true,
        isUserSource: false,
        content: `In a blinded 8-hospital validation study comprising 14,200 emergency chest scans, OmniClinician demonstrated 86.1% diagnostic sensitivity, missing 43 non-calcified malignant nodules (a 3.2% false-negative rate). When tested on patients with co-morbid chronic obstructive pulmonary disease (COPD), diagnostic specificity dropped precipitously to 69.4%, generating an excessive 31% false-positive rate that induced clinical alarm fatigue.`
      }
    ]
  }
];
