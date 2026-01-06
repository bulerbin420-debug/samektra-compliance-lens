import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { CODE_INSIGHTS_COUNT, getDateKey, getInsightFor } from '../services/codeInsightService';

const STORAGE_KEY = 'samektra_codeInsight_v2';

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

  // Load stored offset for *today* ("Next" persists for the day, resets daily)
  useEffect(() => {
    let stored: StoredState | null = null;
    try {
      stored = safeParse(localStorage.getItem(STORAGE_KEY));
    } catch {
      stored = null;
    }

    if (stored && stored.dateKey === todayKey) {
      setOffset(Math.max(0, Math.floor(stored.offset)));
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ dateKey: todayKey, offset: 0 } satisfies StoredState));
    } catch {
      // ignore
    }
    setOffset(0);
  }, [todayKey]);

  // Persist on change
  useEffect(() => {
    const next: StoredState = { dateKey: todayKey, offset };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [todayKey, offset]);

  const { insight, index } = useMemo(() => getInsightFor(todayKey, offset), [todayKey, offset]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOffset((v) => (v + 1) % Math.max(1, CODE_INSIGHTS_COUNT));
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-sky-500/45 via-slate-600/10 to-orange-500/45 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.85)]">
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/45 bg-slate-900/45 backdrop-blur-xl p-4">
        {/* Edge glows */}
        <div className="pointer-events-none absolute -left-16 -bottom-14 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-14 -bottom-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:26px_26px]" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
              <FileText className="h-4 w-4 text-orange-300" />
            </div>
            <div className="text-lg font-semibold text-orange-200">Daily Code Insight</div>
          </div>

          {/* top-right "2 of 7 >" */}
          <div className="shrink-0 flex items-center gap-1 text-xs text-slate-300/80">
            <span className="tabular-nums">{index + 1}</span>
            <span className="text-slate-500">of</span>
            <span className="tabular-nums">{CODE_INSIGHTS_COUNT}</span>
            <ChevronRight className="h-4 w-4 text-slate-300/60" />
          </div>
        </div>

        <div className="relative z-10 mt-3 text-slate-200">
          <div className="text-sm font-semibold">
            {insight.standard} <span className="text-slate-400 font-normal">({insight.edition})</span>{' '}
            <span className="text-slate-500 font-normal">Reference</span>{' '}
            <span className="text-slate-400 font-normal">{insight.reference}</span>
          </div>

          <div className="mt-2 text-sm leading-relaxed text-slate-200/90">
            <span className="mr-2">•</span>
            {insight.insight}
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">Updates daily • Works offline</div>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-800/50 border border-slate-700/60 px-4 py-2 text-sm text-slate-200 shadow-sm active:scale-[0.98]"
            aria-label="Next daily code insight"
            title="Next"
          >
            Next
            <ChevronRight className="h-5 w-5 text-slate-300/70" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCodeInsightCard;
