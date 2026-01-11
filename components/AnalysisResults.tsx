import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle, Info, ArrowLeft, RefreshCw, AlertTriangle, Download } from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
}

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const colors = {
    High: "bg-red-500/20 text-red-200 border-red-500/50 print:bg-red-100 print:text-red-800 print:border-red-200",
    Medium: "bg-orange-500/20 text-orange-200 border-orange-500/50 print:bg-orange-100 print:text-orange-800 print:border-orange-200",
    Low: "bg-yellow-500/20 text-yellow-200 border-yellow-500/50 print:bg-yellow-100 print:text-yellow-800 print:border-yellow-200",
  };
  
  const styles = colors[severity as keyof typeof colors] || colors.Low;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      {severity}
    </span>
  );
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, image, onReset }) => {
  const [activeViolationId, setActiveViolationId] = useState<string | null>(null);
  const hasViolations = result.violations.length > 0;

  // Generate timestamp once for consistency
  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  const handleDownload = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Samektra Compliance Report - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; color: #333; line-height: 1.6; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .brand { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -0.05em; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-title { font-size: 18px; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; color: #0f172a; }
          .violation-card { border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; margin-bottom: 15px; background: #f8fafc; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; border: 1px solid transparent; }
          .High { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
          .Medium { background: #ffedd5; color: #9a3412; border-color: #fed7aa; }
          .Low { background: #fef9c3; color: #854d0e; border-color: #fde047; }
          .main-image { max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0; }
          .remediation { margin-top: 10px; padding: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; }
          .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">Samektra Compliance Lens</div>
            <div class="subtitle">AI-Assisted Inspection Report</div>
          </div>
          <div style="text-align: right; font-size: 14px; color: #64748b;">
            ${timestamp}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Visual Evidence</div>
          <img src="${image}" class="main-image" alt="Inspection Image" />
        </div>

        <div class="section">
           <div class="section-title">Summary</div>
           <p>${result.summary.text}</p>
           <p style="font-size: 14px; color: #64748b;">AI Confidence: ${Math.round(result.summary.confidence * 100)}%</p>
        </div>

        <div class="section">
          <div class="section-title">Findings & Violations</div>
          ${result.violations.length === 0 ? '<p>No visible code violations were detected in this image.</p>' : result.violations.map(v => `
            <div class="violation-card">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                <div>
                  <strong style="font-size: 16px;">${v.title}</strong>
                  <div style="font-family: monospace; color: #0f766e; font-weight: bold;">${v.code}</div>
                </div>
                <span class="badge ${v.severity}">${v.severity}</span>
              </div>
              <p style="margin: 0 0 10px 0; color: #334155;">${v.description}</p>
              <div class="remediation">
                <strong>Remediation:</strong> ${v.remediation}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="section">
           <div class="section-title">On-Site Verification Checklist</div>
           <ul>
             ${result.whatToLookFor.map(item => `<li style="margin-bottom: 8px;"><strong>${item.item}:</strong> ${item.details}</li>`).join('')}
           </ul>
        </div>

        <div class="footer">
          Generated by Samektra Compliance Lens. This report is for informational purposes only. Verification by a certified professional is required.
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Samektra-Report-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBoxClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveViolationId(prev => prev === id ? null : id);
  };

  return (
    <div className="pb-24 animate-fade-in print:bg-white print:pb-0 print:text-black relative">
      
      {/* Print Watermark - Visible only when printing */}
      <div className="hidden print:flex fixed inset-0 z-0 flex-col items-center justify-center opacity-[0.08] pointer-events-none select-none overflow-hidden">
         <div className="transform -rotate-45 text-center">
            <h1 className="text-[8rem] font-black uppercase tracking-tighter text-slate-900 leading-none whitespace-nowrap">Samektra</h1>
            <h2 className="text-4xl font-bold uppercase tracking-[0.2em] text-slate-900 mt-4">Compliance Lens</h2>
            <p className="text-xl font-mono text-slate-900 mt-8 font-bold border-t-2 border-slate-900 inline-block pt-2">{timestamp}</p>
         </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block p-8 border-b-2 border-slate-200 mb-6 relative z-10">
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-bold text-slate-900">Samektra Compliance Report</h1>
               <p className="text-slate-500 mt-1 text-sm">Generated on {timestamp}</p>
            </div>
            <div className="text-right">
               <div className="text-2xl font-bold text-orange-600">Compliance Lens</div>
               <div className="text-xs text-slate-400">AI-Assisted Inspection</div>
            </div>
         </div>
      </div>

      {/* Navbar for results - Hidden when printing */}
      <div className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-800 print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onReset} className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload} 
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-teal-900/40 active:scale-95"
              title="Download HTML Report"
            >
              <Download className="h-4 w-4" />
              <span>Save Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 print:px-8 print:py-0 print:max-w-none print:space-y-4 relative z-10">
        
        {/* Analyzed Image Card with Bounding Boxes */}
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 card print:bg-white print:border-slate-200 print:shadow-none print:rounded-lg">
          <div className="relative w-full bg-black flex justify-center print:bg-slate-50 print:p-2">
            {/* Wrapper for relative positioning of boxes */}
            <div className="relative inline-block">
               <img 
                 src={image} 
                 alt="Analyzed scene" 
                 className="w-full h-auto max-h-96 object-contain block print:max-h-[400px] print:w-auto" 
               />

               {/* Render Bounding Boxes */}
               {result.violations.map((violation, idx) => {
                 const { x1, y1, x2, y2 } = violation.coordinates;
                 const { width, height } = result.image;
                 
                 // Guard against missing dimensions or 0
                 if (!width || !height) return null;

                 const left = `${(x1 / width) * 100}%`;
                 const top = `${(y1 / height) * 100}%`;
                 const boxWidth = `${((x2 - x1) / width) * 100}%`;
                 const boxHeight = `${((y2 - y1) / height) * 100}%`;
                 const isActive = activeViolationId === violation.id;

                 return (
                   <div
                     key={violation.id}
                     onClick={(e) => handleBoxClick(violation.id, e)}
                     className={`absolute cursor-pointer transition-all duration-200 z-10 hover:z-20
                       ${isActive 
                         ? 'border-2 border-yellow-400 bg-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.5)]' 
                         : 'border-2 border-red-500/80 hover:bg-red-500/10 hover:border-red-400'}
                     `}
                     style={{ left, top, width: boxWidth, height: boxHeight }}
                   >
                     {/* Badge */}
                     <div className={`absolute -top-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-md transition-colors
                        ${isActive ? 'bg-yellow-400 text-slate-900' : 'bg-red-600 text-white'}
                     `}>
                       {idx + 1}
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
          {hasViolations && (
            <div className="p-3 bg-slate-800/50 text-center border-t border-slate-700 print:hidden">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" /> Tap a box to highlight the violation details
              </p>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 card print:bg-white print:border-slate-200 print:shadow-none print:border print:p-4">
          <h2 className="text-lg font-semibold text-white mb-3 print:text-slate-900">Summary</h2>
          <p className="text-slate-300 leading-relaxed text-sm print:text-slate-700">
            {result.summary.text}
          </p>
          <div className="mt-4 flex items-center text-xs text-slate-500 print:text-slate-500">
            <span>Confidence: {Math.round(result.summary.confidence * 100)}%</span>
          </div>
        </div>

        {/* Violations Section */}
        <div className="print:break-before-auto">
          <h3 className="text-xl font-bold text-white mb-4 print:text-slate-900 print:mb-2 print:mt-6">Potential Violations</h3>
          
          {!hasViolations ? (
            <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700 card print:bg-white print:border-slate-200 print:shadow-none print:border">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 mb-4 print:bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-500 print:text-green-700" />
              </div>
              <h3 className="text-lg font-medium text-white print:text-slate-900">No visible violations detected</h3>
              <p className="mt-2 text-slate-400 text-sm print:text-slate-600">
                Based on visual analysis, no immediate code violations were found. Always conduct a physical inspection.
              </p>
            </div>
          ) : (
            <div className="space-y-4 print:space-y-4">
              {result.violations.map((violation, idx) => {
                const isActive = activeViolationId === violation.id;
                
                return (
                  <div 
                    key={violation.id} 
                    onClick={() => setActiveViolationId(isActive ? null : violation.id)}
                    className={`bg-slate-800 rounded-xl p-5 border shadow-sm card print:bg-white print:border-slate-200 print:shadow-none print:border print:break-inside-avoid cursor-pointer transition-all duration-200
                      ${isActive 
                        ? 'border-yellow-400 ring-1 ring-yellow-400 bg-slate-800' 
                        : 'border-slate-700 hover:border-slate-500'}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Number Badge in List */}
                        <span className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold mt-0.5 transition-colors
                          ${isActive ? 'bg-yellow-400 text-slate-900' : 'bg-slate-700 text-slate-300'}
                        `}>
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className={`font-semibold text-base transition-colors print:text-slate-900 ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                            {violation.title}
                          </h4>
                          <p className="text-xs text-teal-400 font-mono mb-2 print:text-teal-700 font-bold mt-1">{violation.code}</p>
                        </div>
                      </div>
                      <SeverityBadge severity={violation.severity} />
                    </div>
                    
                    <div className="pl-9">
                      <p className="text-sm text-slate-300 mb-3 print:text-slate-700">
                        {violation.description}
                      </p>

                      <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 print:bg-slate-50 print:border-slate-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-teal-500 mt-0.5 shrink-0 print:text-teal-700" />
                          <div>
                            <span className="text-xs font-semibold text-teal-500 uppercase tracking-wider block mb-1 print:text-teal-700">Remediation</span>
                            <p className="text-sm text-slate-400 print:text-slate-600">{violation.remediation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* What To Look For */}
        <div className="print:break-inside-avoid">
          <h3 className="text-xl font-bold text-white mb-4 print:text-slate-900 print:mt-6 print:mb-2">What to Look For (On-Site)</h3>
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden card print:bg-white print:border-slate-200 print:shadow-none print:border">
            {result.whatToLookFor.map((item, idx) => (
              <div key={idx} className="p-4 border-b border-slate-700 last:border-0 hover:bg-slate-750 transition-colors print:border-slate-200">
                <h4 className="text-sm font-semibold text-white mb-1 print:text-slate-900">{item.item}</h4>
                <p className="text-xs text-slate-400 print:text-slate-600">{item.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions - Hidden in Print */}
        <div className="pt-4 no-print print:hidden">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-teal-900/20"
          >
            <RefreshCw className="h-5 w-5" />
            Analyze Another Image
          </button>
        </div>
        
        {/* Print Footer */}
        <div className="hidden print:block mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400 relative z-10">
          <p>Disclaimer: This report is generated by Samektra Compliance Lens AI. Verify all findings with a certified professional.</p>
        </div>

      </div>
    </div>
  );
};

export default AnalysisResults;