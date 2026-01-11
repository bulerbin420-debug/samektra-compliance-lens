import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

interface DisclaimerModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-white p-6 pb-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Important Disclaimer</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-2 text-sm text-gray-600 space-y-4">
          <p>
            This tool provides an AI-based analysis for potential code violations based on visual information only. It is not a substitute for a professional inspection.
          </p>
          <p>
            Always verify wall ratings and other non-visible conditions with official documentation (e.g., life safety drawings).
          </p>
          <p>
            The analysis results are for informational purposes only and should be used as a starting point for further investigation by qualified professionals.
          </p>
          
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
             <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="font-semibold text-slate-700 text-xs uppercase">Privacy & Data</span>
             </div>
             <p className="text-xs text-slate-500">
               Images are processed securely and are not stored permanently. By proceeding, you agree to our <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>.
             </p>
          </div>

          <p className="font-medium text-gray-800">
            By using this application, you acknowledge that you understand these limitations and agree to use the results responsibly.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 sm:flex sm:flex-row-reverse sm:gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:text-sm"
            onClick={onConfirm}
          >
            I Understand & Agree
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;