import React from 'react';
import { HistoryItem } from '../types';
import { Calendar, FileText, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onNavigate: (tab: string) => void;
  onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onNavigate, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-20">
        <div className="bg-slate-800 p-6 rounded-full mb-4">
          <Calendar className="h-12 w-12 text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-white">No History Yet</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xs">
          Your inspection history will appear here once you complete your first scan.
        </p>
        <button 
          onClick={() => onNavigate('upload')}
          className="mt-8 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-teal-900/20"
        >
          Start New Inspection
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-4 animate-fade-in pb-24">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-3 mb-4 bg-slate-900/90 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Inspection History</h2>
        <button
          type="button"
          onClick={() => {
            const pwd = window.prompt("Enter admin password to reset history:");
            if (pwd !== "13041978") {
              if (pwd !== null) alert("Incorrect password.");
              return;
            }
            const ok = window.confirm("This will permanently clear all local inspection history on this device. Continue?");
            if (!ok) return;
            onClearHistory();
          }}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/15 border border-white/10"
          title="Clear all saved inspection history on this device"
        >
          Reset History
        </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {history.map((item) => {
          const hasViolations = item.result.violations.length > 0;
          const date = new Date(item.timestamp);
          
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-750 transition-all active:scale-[0.99] group text-left"
            >
              <div className="p-4 flex gap-4">
                {/* Thumbnail */}
                <div className="h-20 w-20 shrink-0 bg-slate-900 rounded-lg overflow-hidden border border-slate-600 relative">
                  <img src={item.image} alt="Thumbnail" className="h-full w-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-1`}>
                     {hasViolations ? (
                        <span className="text-[10px] font-bold text-red-300 flex items-center gap-1">
                           <AlertTriangle className="h-3 w-3" /> {item.result.violations.length}
                        </span>
                     ) : (
                        <span className="text-[10px] font-bold text-green-300 flex items-center gap-1">
                           <CheckCircle className="h-3 w-3" /> OK
                        </span>
                     )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                     <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white text-sm truncate pr-2">
                           {item.result.summary.text.substring(0, 50)}...
                        </h3>
                     </div>
                     <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {hasViolations 
                           ? `Violations: ${item.result.violations.map(v => v.code).join(', ')}`
                           : "No code violations detected."
                        }
                     </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                     <span className="text-[10px] text-slate-500 font-medium bg-slate-900/50 px-2 py-0.5 rounded-full">
                        {date.toLocaleDateString()} • {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                     <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;