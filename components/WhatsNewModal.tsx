import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface WhatsNewModalProps {
  isOpen: boolean;
  versionLabel: string;
  updates: string[];
  onClose: () => void;
}

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, versionLabel, updates, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="What's new"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700/60 bg-slate-950/85 backdrop-blur-xl shadow-[0_30px_70px_-35px_rgba(0,0,0,0.95)] overflow-hidden">
        <div className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-sky-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-14 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-200/90">Samektra Compliance Lens</div>
              <h3 className="mt-1 text-2xl font-bold text-white">What's New</h3>
              <div className="mt-1 text-xs text-slate-300/70">{versionLabel}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full border border-slate-700/60 bg-slate-900/40 flex items-center justify-center text-slate-200 hover:bg-slate-800/60 active:scale-[0.98]"
              aria-label="Close"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4">
            <ul className="space-y-2 text-sm text-slate-200/90">
              {updates.map((u, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-3 shadow-md shadow-teal-500/20 active:scale-[0.99]"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsNewModal;
