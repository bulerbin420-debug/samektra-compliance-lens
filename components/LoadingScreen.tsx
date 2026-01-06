import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 z-40 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-teal-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="h-16 w-16 text-teal-500 animate-spin relative z-10" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold text-white">Analyzing Image</h2>
      <p className="mt-2 text-slate-400 text-center max-w-xs">
        Compliance Lens is checking specifically for NFPA, IBC, and NEC violations...
      </p>
    </div>
  );
};

export default LoadingScreen;