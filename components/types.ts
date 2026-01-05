export interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Violation {
  id: string;
  title: string;
  code: string;
  severity: "Low" | "Medium" | "High";
  description: string;
  location: string;
  coordinates: Coordinates;
  confidence: number;
  remediation: string;
  references: string[];
}

export interface Summary {
  text: string;
  confidence: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
}

export interface WhatToLookFor {
  item: string;
  details: string;
}

export interface AnalysisResult {
  schemaVersion: string;
  summary: Summary;
  image: ImageMetadata;
  violations: Violation[];
  whatToLookFor: WhatToLookFor[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string; // Base64
  result: AnalysisResult;
}

export interface AppState {
  step: 'upload' | 'disclaimer' | 'analyzing' | 'results';
  image: string | null; // Base64
  analysis: AnalysisResult | null;
  error: string | null;
}