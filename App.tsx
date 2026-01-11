import React, { useState, useEffect } from 'react';
import { AppState, AnalysisResult, HistoryItem } from './types';
import { analyzeComplianceImage } from './services/geminiService';
import { getHistory, saveScan, clearHistory } from './services/historyService';
import ImageUploader from './components/ImageUploader';
import DisclaimerModal from './components/DisclaimerModal';
import LoadingScreen from './components/LoadingScreen';
import AnalysisResults from './components/AnalysisResults';
import HomeView from './components/HomeView';
import HistoryView from './components/HistoryView';
import { ShieldCheck, HelpCircle, Home, History, Upload, User } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'upload',
    image: null,
    analysis: null,
    error: null,
  });

  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const items = await getHistory();
      setHistory(items);
    };
    loadHistory();
  }, []);

  const handleImageSelected = (base64Image: string) => {
    setState(prev => ({ ...prev, image: base64Image, step: 'disclaimer' }));
  };

  const handleDisclaimerConfirmed = async () => {
    if (!state.image) return;

    setState(prev => ({ ...prev, step: 'analyzing', error: null }));

    try {
      const result = await analyzeComplianceImage(state.image);
      
      // Save to history immediately upon success (awaiting the async DB operation)
      const updatedHistory = await saveScan(result, state.image);
      setHistory(updatedHistory);

      setState(prev => ({ ...prev, step: 'results', analysis: result }));
    } catch (error: any) {
      console.error(error);
      setState(prev => ({
        ...prev,
        step: 'upload',
        // Show specific error message from geminiService if available
        error: error.message || "Analysis failed. Please try again or check your internet connection."
      }));
    }
  };

  const handleDisclaimerCancelled = () => {
    setState(prev => ({ ...prev, image: null, step: 'upload' }));
  };

  const handleReset = () => {
    setState({
      step: 'upload',
      image: null,
      analysis: null,
      error: null,
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

const handleClearHistory = async () => {
  try {
    await clearHistory();
  } catch (err) {
    console.error('Failed to clear history', err);
  } finally {
    setHistory([]);
    setSelectedHistoryItem(null);
  }
};


  // Used by HistoryView and HomeView to open a past report
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setState({
      step: 'results',
      image: item.image,
      analysis: item.result,
      error: null
    });
    // Switch to upload tab (acting as the workspace) to show the results component
    setActiveTab('upload');
  };

  // Helper to render content based on active tab
  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <HomeView 
          onNavigate={handleTabClick} 
          history={history}
          onSelectHistory={handleSelectHistoryItem}
        />
      );
    }

    if (activeTab === 'history') {
      return (
        <HistoryView
            onClearHistory={handleClearHistory}
          history={history}
          onSelect={handleSelectHistoryItem}
          onNavigate={handleTabClick}
        />
      );
    }

    if (activeTab === 'upload') {
      // Logic for the upload/analysis flow
      if (state.step === 'upload') {
        return (
          <div className="flex-1 flex flex-col justify-center px-4 animate-fade-in pb-20">
             <ImageUploader onImageSelected={handleImageSelected} />
          </div>
        );
      } else if (state.step === 'disclaimer') {
        return (
          <DisclaimerModal
            onConfirm={handleDisclaimerConfirmed}
            onCancel={handleDisclaimerCancelled}
          />
        );
      } else if (state.step === 'analyzing') {
        return <LoadingScreen />;
      } else if (state.step === 'results' && state.analysis && state.image) {
        return (
          <AnalysisResults
            result={state.analysis}
            image={state.image}
            onReset={handleReset}
          />
        );
      }
    }

    // Placeholders for other tabs
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center animate-fade-in">
        <div className="bg-slate-800 p-6 rounded-full mb-4">
           {activeTab === 'profile' && <User className="h-12 w-12 text-slate-600" />}
        </div>
        <h2 className="text-xl font-semibold text-white capitalize">{activeTab}</h2>
        <p className="mt-2 text-sm">This feature is coming soon.</p>
        <button 
          onClick={() => handleTabClick('upload')}
          className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-full text-sm font-medium transition-colors"
        >
          Go to Upload
        </button>
      </div>
    );
  };

  const showGlobalHeader = state.step !== 'results' && activeTab !== 'history' && activeTab !== 'home';

  return (
    <div className="min-h-screen bg-transparent text-slate-50 font-sans selection:bg-orange-500/30">
      
      {/* Header - Only show on Home or specific views */}
      {/*
        The Home screen has its own "Home" header (to match the app UI mock),
        so we hide the global header there.
      */}
      {showGlobalHeader && (
        <header className="fixed top-0 w-full z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                {/* Logo Icon */}
                <div className="relative h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-400 shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-50"></div>
                    <span className="font-bold text-slate-900 text-lg italic pr-0.5">S</span>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-2 bg-orange-500 skew-x-[-15deg] shadow-sm"></div>
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight text-white tracking-wide">
                    <span className="text-slate-100">Samektra</span>
                  </h1>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`${showGlobalHeader ? 'pt-16' : 'pt-0'} relative min-h-screen flex flex-col`}>
        {state.error && (
          <div className="max-w-md mx-auto w-full px-4 mt-4 mb-2">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200 text-sm text-center">
              <p className="font-semibold mb-1">Error</p>
              {state.error}
            </div>
          </div>
        )}
        
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      {state.step !== 'analyzing' && (
        <nav className="fixed bottom-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 pb-safe z-40 print:hidden">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
            <button 
              onClick={() => handleTabClick('home')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${activeTab === 'home' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Home className={`h-6 w-6 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
              <span className={`text-[10px] font-medium tracking-wide ${activeTab === 'home' ? 'opacity-100' : 'opacity-70'}`}>Home</span>
            </button>
            
            <button 
              onClick={() => handleTabClick('history')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${activeTab === 'history' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <History className={`h-6 w-6 ${activeTab === 'history' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
              <span className={`text-[10px] font-medium tracking-wide ${activeTab === 'history' ? 'opacity-100' : 'opacity-70'}`}>History</span>
            </button>
            
            <button 
              onClick={() => handleTabClick('upload')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${activeTab === 'upload' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'upload' ? 'bg-orange-500/10 shadow-sm shadow-orange-500/20' : ''}`}>
                 <Upload className={`h-6 w-6 ${activeTab === 'upload' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${activeTab === 'upload' ? 'opacity-100' : 'opacity-70'}`}>Upload</span>
            </button>
            
            <button 
              onClick={() => handleTabClick('profile')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${activeTab === 'profile' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User className={`h-6 w-6 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-1.5'}`} />
              <span className={`text-[10px] font-medium tracking-wide ${activeTab === 'profile' ? 'opacity-100' : 'opacity-70'}`}>Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};
export default App;