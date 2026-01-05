import React from 'react';
import { Clock, Calendar, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onNavigate: (tab: string) => void;
  onClearHistory?: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onNavigate, onClearHistory }) => {
  const handleResetClick = () => {
    const pw = window.prompt('Enter password to reset history:');
    if (pw === null) return; // cancelled
    if (pw !== '13041978') {
      window.alert('Incorrect password.');
      return;
    }
    const ok = window.confirm('This will permanently delete all inspection history stored on this device. Continue?');
    if (!ok) return;
    onClearHistory?.();
  };

  const isEmpty = history.length === 0;

  return (
    <div className="flex-1 px-4 py-6 animate-fade-in pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Inspection History</h2>

        <button
          onClick={handleResetClick}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition"
          title="Reset History (Password required)"
        >
          <Trash2 size={16} />
          <span className="text-sm font-medium">Reset History</span>
        </button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-slate-800 p-6 rounded-full mb-4">
            <Calendar className="text-slate-600" size={36} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No History Yet</h3>
          <p className="text-slate-400 max-w-xs mb-8">
            Your inspection history will appear here after you complete your first scan.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
          >
            Start New Inspection
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 transition-colors text-left border border-slate-700/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium mb-1 line-clamp-1">{item.title}</h4>
                    <div className="flex items-center text-slate-400 text-sm space-x-3">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>
                  {item.score !== undefined && (
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        item.score >= 90
                          ? 'bg-green-900/30 text-green-400'
                          : item.score >= 70
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {item.score}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
