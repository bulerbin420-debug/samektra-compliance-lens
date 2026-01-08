export type ReleaseNote = {
  version: string; // e.g. "2.0.0"
  date: string;    // e.g. "2026-01-07"
  notes: string[];
};

export const CHANGELOG: ReleaseNote[] = [
  {
    version: "2.0.0",
    date: "2026-01-07",
    notes: [
      "Added “What’s New” window (Info button) with version display.",
      "Added quick link to Samektra.com.",
      "Removed the PWA install banner from the Home screen.",
      "Improved update reliability (cache refresh / offline behavior)."
    ]
  }
  // Add the next release ABOVE this line (newest first).
];

export const CURRENT_RELEASE = CHANGELOG[0];
export const CURRENT_VERSION = CURRENT_RELEASE.version;
