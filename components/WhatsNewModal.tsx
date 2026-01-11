import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, X, ChevronDown } from 'lucide-react';
import { CHANGELOG, CURRENT_RELEASE } from '../changelog';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose }) => {
  const [showPrevious, setShowPrevious] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const baseUrl = (import.meta as any).env?.BASE_URL ?? './';
  const appIconUrl = `${baseUrl}icons/icon-192.png`;

  const openSamektra = () => {
    // Open in a new tab / external browser. (In Android TWA, this will open outside the app.)
    window.open('https://samektra.com', '_blank', 'noopener,noreferrer');
  };

  const versionLabel = useMemo(() => `v${CURRENT_RELEASE.version}`, []);
  const updates = CURRENT_RELEASE.notes;

  const previous = useMemo(() => CHANGELOG.slice(1), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-700/60 bg-slate-950/85 backdrop-blur-xl shadow-[0_30px_70px_-35px_rgba(0,0,0,0.95)] overflow-hidden">
        <div className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-sky-500/12 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-14 h-52 w-52 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <img
                src={appIconUrl}
                alt="Samektra"
                className="h-12 w-12 rounded-2xl border border-slate-700/60 bg-slate-900/40 object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200/90">Samektra Compliance Lens</div>
                <h3 className="mt-1 text-2xl font-bold text-white">What&apos;s New</h3>
                <div className="mt-1 text-xs text-slate-300/70">{versionLabel}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full border border-slate-700/60 bg-slate-900/30 inline-flex items-center justify-center text-slate-200 hover:bg-slate-800/60 active:scale-[0.98]"
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

          {previous.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowPrevious(v => !v)}
                className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/25 px-4 py-3 text-left text-sm text-slate-200/90 hover:bg-slate-900/40 inline-flex items-center justify-between"
              >
                <span>Previous versions</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showPrevious ? 'rotate-180' : ''}`} />
              </button>

              {showPrevious && (
                <div className="mt-3 rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4">
                  <div className="space-y-4">
                    {previous.map((r) => (
                      <div key={r.version}>
                        <div className="text-xs font-semibold text-slate-200/80">{`v${r.version}`}</div>
                        <ul className="mt-2 space-y-1 text-xs text-slate-200/75">
                          {r.notes.map((n, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400/70" />
                              <span>{n}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={openSamektra}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/30 hover:bg-slate-900/50 text-slate-200 font-semibold px-5 py-3 active:scale-[0.99] inline-flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Samektra.com
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-3 shadow-md shadow-teal-500/20 active:scale-[0.99]"
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
