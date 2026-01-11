import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Info,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { HistoryItem } from '../types';
import { CURRENT_VERSION } from '../changelog';
import DailyCodeInsightCard from './DailyCodeInsightCard';
import WhatsNewModal from './WhatsNewModal';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, history, onSelectHistory }) => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    // Show "What's New" automatically once after each version update.
    try {
      const key = 'samektra_last_seen_version';
      const lastSeen = localStorage.getItem(key);
      if (lastSeen !== CURRENT_VERSION) {
        setShowWhatsNew(true);
        localStorage.setItem(key, CURRENT_VERSION);
      }
    } catch {
      // Ignore storage errors (private mode / blocked storage)
    }
  }, []);

  const baseUrl = (import.meta as any).env?.BASE_URL ?? './';
  const appIconUrl = `${baseUrl}icons/icon-192.png`;

  const openSamektra = () => {
    // Open in a new tab / external browser. (In Android TWA, this will open outside the app.)
    window.open('https://samektra.com', '_blank', 'noopener,noreferrer');
  };

  const formatWhen = (ts: number) => {
    const diffMs = Date.now() - ts;
    const diffMin = Math.floor(diffMs / (60 * 1000));
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return new Date(ts).toLocaleDateString();
  };
  
  // Calculate stats based on history
  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyItems = history.filter(item => item.timestamp > oneWeekAgo);

    const risks = weeklyItems.reduce((acc, item) => acc + item.result.violations.length, 0);
    const compliantCount = weeklyItems.reduce(
      (acc, item) => acc + (item.result.violations.length === 0 ? 1 : 0),
      0
    );
    const complianceRate = weeklyItems.length
      ? Math.round((compliantCount / weeklyItems.length) * 100)
      : 100;

    return {
      weeklyScans: weeklyItems.length,
      risksFound: risks,
      complianceRate,
    };
  }, [history]);

  return (
    <div className="flex-1 px-4 pt-3 pb-28 animate-fade-in">
      <div className="mx-auto w-full max-w-lg space-y-4">

        {/* Top bar (matches mock UI) */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-4xl font-light tracking-tight text-slate-100">Home</h2>
          <div className="flex items-center gap-2">
            {/* Recommended placement: next to the info icon on the Home top bar (always visible, not intrusive). */}
            <button
              type="button"
              className="h-11 w-11 rounded-full border border-slate-700/60 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-200 active:scale-[0.98]"
              aria-label="Open Samektra.com"
              title="Samektra.com"
              onClick={openSamektra}
            >
              <Globe className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="h-11 w-11 rounded-full border border-slate-700/60 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-200 active:scale-[0.98]"
              aria-label="About"
              title="About"
              onClick={() => setShowWhatsNew(true)}
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        <WhatsNewModal
          isOpen={showWhatsNew}
          onClose={() => setShowWhatsNew(false)}
        />

        {/* Hero card (Same look as the reference mock) */}
        <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-r from-sky-500/55 via-slate-600/10 to-orange-500/55 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.85)]">
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-900/55 backdrop-blur-xl p-5">
            {/* glows */}
            <div className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-sky-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -top-14 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] [background-size:24px_24px]" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="shrink-0">
                <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-950/70 border border-slate-700/60 shadow-lg overflow-hidden">
                  <img src={appIconUrl} alt="Samektra icon" className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-3xl font-semibold text-slate-100 leading-none">Samektra</div>
                <div className="mt-1 text-sm text-slate-300/80">Your Compliance Ally</div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className={`inline-flex items-center gap-2 ${isOnline ? 'text-emerald-200' : 'text-orange-200'}`}>
                    <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-300' : 'bg-orange-300'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions (exact feel: orange left, blue right) */}
            <div className="relative z-10 mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('upload')}
                className="rounded-2xl bg-gradient-to-b from-orange-400/80 to-orange-700/80 border border-orange-500/30 px-4 py-3 text-left shadow-md shadow-orange-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-white">New Inspection</div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('history')}
                className="rounded-2xl bg-gradient-to-b from-slate-700/60 to-slate-900/50 border border-slate-600/50 px-4 py-3 text-left shadow-md shadow-slate-900/30 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-white">History</div>
                  <ChevronRight className="h-5 w-5 text-slate-300/70" />
                </div>
              </button>
            </div>
          </div>
        </div>

      {/* Stats (3 tiles in a single row like the mock) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/35 backdrop-blur-md p-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-300/80">
            <TrendingUp className="h-4 w-4 text-sky-300" />
            <span className="text-[11px] font-medium">Weekly Scans</span>
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-100 leading-none">{stats.weeklyScans}</div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/35 backdrop-blur-md p-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-300/80">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-[11px] font-medium">Risks Found</span>
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-100 leading-none">{stats.risksFound}</div>
        </div>

        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/35 backdrop-blur-md p-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-300/80">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span className="text-[11px] font-medium">Weekly Compliance</span>
          </div>
          <div className="mt-2 text-3xl font-semibold text-emerald-200 leading-none">{stats.complianceRate}%</div>
        </div>
      </div>

      {/* Daily Insight / Tip */}
      <DailyCodeInsightCard />

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          {history.length > 0 && (
            <button onClick={() => onNavigate('history')} className="text-xs text-orange-400 font-medium hover:text-orange-300">View All</button>
          )}
        </div>
        
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
              <Clock className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No recent scans</p>
            </div>
          ) : (
            history.slice(0, 3).map((item) => {
              const issueCount = item.result.violations.length;
              const hasIssues = issueCount > 0;
              const timeString = formatWhen(item.timestamp);

              return (
                <button 
                  key={item.id} 
                  onClick={() => onSelectHistory(item)}
                  className="w-full bg-slate-800/40 border border-slate-700/50 p-3 rounded-xl flex items-center gap-3 active:bg-slate-800 transition-colors text-left"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${hasIssues ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{item.result.summary.text}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className={`text-[10px] px-1.5 py-0.5 rounded ${hasIssues ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                         {hasIssues ? `${issueCount} Violations` : 'Compliant'}
                       </span>
                       <span className="text-xs text-slate-500">{timeString}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              );
            })
          )}
        </div>
	      </div>
	    </div>
	  </div>
	);
};

export default HomeView;