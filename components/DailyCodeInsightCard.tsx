import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { getDateKey, getInsightFor } from '../services/codeInsightService';

const STORAGE_KEY = 'samektra_codeInsight_v1';

type StoredState = {
  dateKey: string;
  offset: number;
};

function safeParse(raw: string | null): StoredState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.dateKey === 'string' && typeof parsed?.offset === 'number') {
      return { dateKey: parsed.dateKey, offset: parsed.offset };
    }
    return null;
  } catch {
    return null;
  }
}

const DailyCodeInsightCard: React.FC = () => {
  const todayKey = useMemo(() => getDateKey(new Date()), []);
  const [offset, setOffset] = useState<number>(0);

  // Load stored offset for *today* (so "Next" persists through refresh, but resets daily)
  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    if (stored && stored.dateKey === todayKey) {
      setOffset(Math.max(0, Math.floor(stored.offset)));
      return;
    }
    // reset for a new day
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dateKey: todayKey, offset: 0 } satisfies StoredState));
    setOffset(0);
  }, [todayKey]);

  // Persist on change
  useEffect(() => {
    const next: StoredState = { dateKey: todayKey, offset };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [todayKey, offset]);

  const { insight } = useMemo(() => getInsightFor(todayKey, offset), [todayKey, offset]);

  const handleNext = () => setOffset((v) => v + 1);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 bg-teal-500/10 h-24 w-24 rounded-full blur-xl"></div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Daily Code Insight
          </h4>
          <div className="text-[11px] text-slate-400">
            <span className="text-slate-200 font-semibold">{insight.standard}</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="text-slate-300">Edition:</span> {insight.edition}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Reference: <span className="text-slate-400">{insight.reference}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-slate-700/70 text-slate-200 hover:bg-slate-900/70 active:bg-slate-900 transition-colors"
          aria-label="Next daily code insight"
          title="Next daily code insight"
        >
          Next
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mt-3">
        {insight.insight}
      </p>

      <div className="mt-3 text-[11px] text-slate-500">
        Tip: Tap <span className="text-slate-300 font-semibold">Next</span> for another insight (resets daily).
      </div>
    </div>
  );
};

export default DailyCodeInsightCard;
