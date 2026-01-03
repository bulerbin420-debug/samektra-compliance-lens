import React, { useMemo } from 'react';
import { Play, TrendingUp, AlertTriangle, FileText, CheckCircle2, ChevronRight, Clock, Download } from 'lucide-react';
import { HistoryItem } from '../types';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  installPrompt?: any;
  onInstall?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, history, onSelectHistory, installPrompt, onInstall }) => {
  
  // Calculate stats based on history
  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyItems = history.filter(item => item.timestamp > oneWeekAgo);
    
    const risks = weeklyItems.reduce((acc, item) => acc + item.result.violations.length, 0);
    
    return {
      weeklyScans: weeklyItems.length,
      risksFound: risks
    };
  }, [history]);

  return (
    <div className="flex-1 px-4 pt-2 pb-6 space-y-6 animate-fade-in pb-24">
      
      {/* Brand Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Welcome to</h2>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Samektra <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Compliance Lens</span>
          </h1>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center shadow-lg">
          <span className="font-bold text-orange-500 text-lg">S</span>
        </div>
      </div>

      {/* PWA Install Banner - Only shows if installable */}
      {installPrompt && (
        <button 
          onClick={onInstall}
          className="w-full bg-teal-600/20 border border-teal-500/50 p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-lg">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-sm">Install App</h3>
              <p className="text-xs text-teal-200">Add to Home Screen for offline use</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-teal-600 rounded-full text-xs font-bold text-white group-hover:bg-teal-500 transition-colors">
            Install
          </div>
        </button>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Weekly Scans</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.weeklyScans}</p>
          <p className="text-xs text-green-400 mt-1 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5"></span>
            Active
          </p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-medium">Risks Found</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.risksFound.toString().padStart(2, '0')}</p>
          <p className="text-xs text-orange-400 mt-1 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>
            Requires Review
          </p>
        </div>
      </div>

      {/* Primary Action Card */}
      <button 
        onClick={() => onNavigate('upload')}
        className="w-full group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">New Inspection</h3>
            <p className="text-orange-100 text-sm">Analyze image for code violations</p>
          </div>
          <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-white ml-1" />
          </div>
        </div>
      </button>

      {/* Daily Insight / Tip */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 relative overflow-hidden">
         <div className="absolute -right-4 -top-4 bg-teal-500/10 h-24 w-24 rounded-full blur-xl"></div>
         <h4 className="text-teal-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Daily Code Insight
         </h4>
         <p className="text-slate-300 text-sm leading-relaxed">
            <span className="font-semibold text-white">NFPA 101, 7.9.2.1:</span> Emergency illumination must be provided for a minimum of 1.5 hours in the event of failure of normal lighting.
         </p>
      </div>

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
              // Format time: "2 hours ago" or date
              const date = new Date(item.timestamp);
              const timeString = date.toLocaleDateString();

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
  );
};

export default HomeView;