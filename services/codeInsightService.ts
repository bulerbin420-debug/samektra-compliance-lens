export type InsightSource = 'NFPA' | 'TJC' | 'CMS' | 'ADA' | 'NEC' | 'IBC' | 'IFC';

export interface CodeInsight {
  source: InsightSource;
  standard: string;
  edition: string;
  reference: string;
  insight: string;
}

/**
 * Curated rotation of practical compliance reminders.
 * NOTE: Editions can vary by jurisdiction / contract; adjust as needed.
 */
export const CODE_INSIGHTS: CodeInsight[] = [
  // --- NFPA ---
  {
    source: 'NFPA',
    standard: 'NFPA 101 — Life Safety Code',
    edition: '2024',
    reference: 'Emergency Lighting (7.9)',
    insight:
      'Verify emergency lighting is provided for required means of egress components and is supported by reliable power (generator/battery) so occupants can safely exit during normal power loss.'
  },
  {
    source: 'NFPA',
    standard: 'NFPA 72 — National Fire Alarm and Signaling Code',
    edition: '2022',
    reference: 'Inspection/Testing/ Maintenance (ITM)',
    insight:
      'When you change devices, programming, or interfaces, confirm the change is documented and that acceptance/verification testing aligns with your ITM program and system configuration.'
  },
  {
    source: 'NFPA',
    standard: 'NFPA 25 — Water-Based Fire Protection Systems',
    edition: '2023',
    reference: 'Valves & Supervision',
    insight:
      'Keep control valves accessible, identified, and supervised where required. A “closed valve” is one of the fastest ways to turn a compliant sprinkler system into a life safety risk.'
  },
  {
    source: 'NFPA',
    standard: 'NFPA 99 — Health Care Facilities Code',
    edition: '2024',
    reference: 'Risk Categories & Utilities',
    insight:
      'Make sure your risk assessment (Category 1–4) drives the maintenance/testing rigor for medical gas, electrical, and other critical utilities—documentation should show the “why,” not just the “what.”'
  },
  {
    source: 'NFPA',
    standard: 'NFPA 70E — Electrical Safety in the Workplace',
    edition: '2024',
    reference: 'Arc Flash / PPE',
    insight:
      'If arc-flash labels exist, confirm they match the latest study and the equipment configuration. Outdated labels can create false confidence and wrong PPE decisions.'
  },
  {
    source: 'NFPA',
    standard: 'NFPA 10 — Portable Fire Extinguishers',
    edition: '2022',
    reference: 'Monthly Visual Checks',
    insight:
      'Monthly checks are simple but powerful: visible, accessible, proper pressure, intact pin/seal, and no damage. Missing/blocked units are often the easiest “quick win” during rounding.'
  },

  // --- TJC / CMS ---
  {
    source: 'TJC',
    standard: 'The Joint Commission — PE 04.01.01',
    edition: 'Current (manual year varies)',
    reference: 'Managing building & utility risks',
    insight:
      'PE 04.01.01 is about managing risks to occupants: keep your utility management documentation tight—risk assessments, inventories, testing evidence, and follow-up on deficiencies.'
  },
  {
    source: 'CMS',
    standard: 'CMS Conditions of Participation',
    edition: 'Current (updated periodically)',
    reference: 'Life Safety / Utility reliability',
    insight:
      'CMS expectations often hinge on evidence: show that testing, maintenance, corrective actions, and leadership oversight exist for critical systems (power, fire protection, medical gas) and that issues are tracked to closure.'
  },
  {
    source: 'TJC',
    standard: 'The Joint Commission — PE 04.01.01',
    edition: 'Current (manual year varies)',
    reference: 'Deficiency management',
    insight:
      'If you find a deficiency, document the interim mitigation (when needed), the repair plan, responsible party, and a clear “closed-loop” date. Surveyors love clean closure evidence.'
  },

  // --- ADA ---
  {
    source: 'ADA',
    standard: '2010 ADA Standards for Accessible Design',
    edition: '2010',
    reference: 'Door hardware & operable parts',
    insight:
      'Common quick check: door hardware and operable parts should be usable with one hand and without tight grasping, pinching, or twisting—small details that frequently show up in complaints.'
  },
  {
    source: 'ADA',
    standard: '2010 ADA Standards for Accessible Design',
    edition: '2010',
    reference: 'Clear width & routes',
    insight:
      'Keep accessible routes clear. Temporary obstructions (carts, boxes, stored equipment) are often the real-world reason compliant spaces become non-compliant.'
  },

  // --- NEC ---
  {
    source: 'NEC',
    standard: 'NFPA 70 — National Electrical Code (NEC)',
    edition: '2023',
    reference: 'Working space (110.26)',
    insight:
      'Electrical working clearances matter: avoid storage in front of panels and maintain required working space so maintenance can be performed safely and quickly during failures.'
  },
  {
    source: 'NEC',
    standard: 'NFPA 70 — National Electrical Code (NEC)',
    edition: '2023',
    reference: 'Equipment identification',
    insight:
      'Accurate panel schedules and labeling reduce downtime during outages. If a breaker directory is wrong, treat it as a safety issue, not just an inconvenience.'
  },

  // --- IBC ---
  {
    source: 'IBC',
    standard: 'International Building Code (IBC)',
    edition: '2021 (commonly adopted; verify local edition)',
    reference: 'Means of egress basics',
    insight:
      'Egress paths must be continuous and unobstructed. Watch for “small” changes—furniture, partitions, locked doors—that can unintentionally reduce egress capacity.'
  },
  {
    source: 'IBC',
    standard: 'International Building Code (IBC)',
    edition: '2021 (commonly adopted; verify local edition)',
    reference: 'Exit signage & illumination',
    insight:
      'Exit signs and illumination should remain effective under normal and emergency conditions. When lighting retrofits happen, confirm exit visibility wasn’t accidentally reduced.'
  },

  // --- IFC ---
  {
    source: 'IFC',
    standard: 'International Fire Code (IFC)',
    edition: '2021 (commonly adopted; verify local edition)',
    reference: 'Housekeeping & storage',
    insight:
      'Control combustibles: maintain proper storage clearances (especially in mechanical/electrical rooms) and avoid storage in stairwells or exit corridors—these are frequent enforcement points.'
  },
  {
    source: 'IFC',
    standard: 'International Fire Code (IFC)',
    edition: '2021 (commonly adopted; verify local edition)',
    reference: 'Fire department access',
    insight:
      'Keep fire department connections, hydrants, and fire lanes clear and identifiable. A blocked FDC can delay suppression efforts when minutes matter.'
  },

  // --- More rotation (mix standards to reduce repeats) ---
  {
    source: 'NFPA',
    standard: 'NFPA 110 — Emergency and Standby Power Systems',
    edition: '2022',
    reference: 'Generator readiness',
    insight:
      'Generator problems are often “small”: low fuel, charger faults, coolant leaks. Trend your test results and alarms so you catch failure modes before the next outage.'
  },
  {
    source: 'TJC',
    standard: 'The Joint Commission — PE 04.01.01',
    edition: 'Current (manual year varies)',
    reference: 'Documentation quality',
    insight:
      'Make your evidence easy to audit: consistent file naming, clear dates, and a simple crosswalk from requirement → test/inspection → deficiency → corrective action → closure.'
  },
  {
    source: 'ADA',
    standard: '2010 ADA Standards for Accessible Design',
    edition: '2010',
    reference: 'Mounting heights',
    insight:
      'Check mounting heights for dispensers, fire alarm manual stations (where applicable), signage, and controls—“a few inches” can be the difference between accessible and not.'
  },
  {
    source: 'NEC',
    standard: 'NFPA 70 — National Electrical Code (NEC)',
    edition: '2023',
    reference: 'GFCI where required',
    insight:
      'Verify GFCI protection where required (wet locations, certain receptacles). Missing protection is a high-visibility safety issue and easy to correct once identified.'
  },
  {
    source: 'IBC',
    standard: 'International Building Code (IBC)',
    edition: '2021 (commonly adopted; verify local edition)',
    reference: 'Rated barriers & penetrations',
    insight:
      'When contractors add cable/pipe, confirm firestopping matches the rated assembly. A great wall on paper becomes a weak link if penetrations aren’t sealed correctly.'
  },
  {
    source: 'IFC',
    standard: 'International Fire Code (IFC)',
    edition: '2021 (commonly adopted; verify local edition)',
    reference: 'Extinguishers, cabinets, visibility',
    insight:
      'Extinguishers must be visible, accessible, and in their correct locations. If you install cabinets or décor, verify they didn’t hide the extinguisher from view.'
  }
];

// Convenience export for UI logic (e.g., cycling)
export const CODE_INSIGHTS_COUNT = CODE_INSIGHTS.length;

export function getDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getBaseIndexForDateKey(dateKey: string, length: number): number {
  // Stable day-based index: days since epoch modulo the number of insights
  const t = new Date(dateKey + 'T00:00:00').getTime();
  const days = Math.floor(t / 86400000);
  return ((days % length) + length) % length;
}

export function getInsightFor(dateKey: string, offset: number): { insight: CodeInsight; index: number } {
  const base = getBaseIndexForDateKey(dateKey, CODE_INSIGHTS.length);
  const index = (base + Math.max(0, offset)) % CODE_INSIGHTS.length;
  return { insight: CODE_INSIGHTS[index], index };
}
