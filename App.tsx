import React, { useState, useEffect, useRef } from 'react';
import MatrixRain from './components/MatrixRain';
import ResultCard from './components/ResultCard';
import { OsintResult, ScanStatus, LogEntry } from './types';
import { generateRandomResult, getRandomLog } from './services/osintService';
import { Search, Terminal, AlertTriangle, Download, Copy, RotateCcw } from 'lucide-react';

// Extend window for html2canvas
declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<OsintResult | null>(null);
  const [matrixActive, setMatrixActive] = useState(true);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleScan = () => {
    if (!input || input.length < 5) return;
    
    setStatus('scanning');
    setProgress(0);
    setLogs([]);
    setResult(null);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      
      if (Math.random() > 0.7) {
        setLogs(prev => [...prev.slice(-6), {
          id: Date.now(),
          text: getRandomLog(),
          type: 'info'
        }]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        completeScan();
      } else {
        setProgress(currentProgress);
      }
    }, 150);
  };

  const completeScan = () => {
    setTimeout(() => {
      setResult(generateRandomResult(input));
      setStatus('complete');
      setLogs(prev => [...prev, { id: Date.now(), text: "SCAN COMPLETE. DATA RENDERED.", type: 'success' }]);
    }, 500);
  };

  const handleReset = () => {
    setStatus('idle');
    setInput('');
    setResult(null);
    setLogs([]);
  };

  const handleDownload = () => {
    const reportElement = document.getElementById('osint-report');
    if (reportElement && window.html2canvas) {
      window.html2canvas(reportElement, {
        backgroundColor: '#000000',
        scale: 2
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `OSINT_REPORT_${input}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    } else {
      alert("Module HTML2CANVAS not loaded. Check internet connection.");
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `
[OSINT REPORT // ${result.phoneNumber}]
Carrier: ${result.carrier}
Location: ${result.location}
Risk Score: ${result.riskScore}/100
Leaks Found: ${result.leakCount}
Linked Accounts: ${result.linkedAccounts}
    `.trim();
    navigator.clipboard.writeText(text);
    alert("ENCRYPTED TEXT COPIED TO CLIPBOARD");
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 overflow-hidden">
      <MatrixRain active={matrixActive} />
      
      {/* Toggle Matrix Button */}
      <button 
        onClick={() => setMatrixActive(!matrixActive)}
        className="absolute top-4 right-4 text-xs text-green-700 hover:text-green-400 border border-green-900 px-2 py-1 opacity-50 hover:opacity-100 transition"
      >
        {matrixActive ? "DISABLE_MATRIX" : "ENABLE_MATRIX"}
      </button>

      {/* Main Container */}
      <div className="w-full max-w-3xl z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 glow-text tracking-tighter">
            CYBER<span className="text-white">_</span>OSINT
          </h1>
          <p className="text-green-600 mt-2 tracking-[0.2em] text-sm md:text-base animate-pulse">
            NUCLEAR PROBE V.2025 // UNRESTRICTED ACCESS
          </p>
        </div>

        {/* Input Section (Only visible when idle or scanning) */}
        {(status === 'idle' || status === 'scanning') && (
          <div className="bg-black/80 border border-green-500/30 p-6 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)] backdrop-blur-sm">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-200"></div>
              <div className="relative flex bg-black rounded-lg">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ENTER TARGET NUMBER (+86...)"
                  disabled={status === 'scanning'}
                  className="w-full bg-transparent text-green-400 text-xl p-4 outline-none font-mono placeholder-green-800"
                />
                <button
                  onClick={handleScan}
                  disabled={status === 'scanning' || input.length < 5}
                  className="px-8 text-black font-bold bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {status === 'scanning' ? 'SCANNING...' : 'INITIATE'}
                </button>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between text-xs text-gray-500 font-mono">
               <span>SUPPORTED: +86 / GLOBAL / VOIP</span>
               <span>DATABASE: 105,402,110 RECORDS</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {status === 'scanning' && (
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-green-500 text-xs font-mono">
              <span>BRUTE_FORCING...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-green-900">
              <div 
                className="h-full bg-green-500 shadow-[0_0_10px_#0f0]"
                style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
              ></div>
            </div>
            {/* Terminal Logs */}
            <div className="h-32 bg-black/90 border border-green-900/50 p-4 font-mono text-xs text-green-400 overflow-hidden flex flex-col justify-end relative">
              <div className="absolute top-0 right-0 p-1">
                <Terminal size={12} className="text-gray-600" />
              </div>
              {logs.map((log) => (
                <div key={log.id} className="opacity-80 truncate">
                  <span className="mr-2 text-gray-600">[{new Date(log.id).toLocaleTimeString().split(' ')[0]}]</span>
                  <span className="text-green-500">&gt; {log.text}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* Results */}
        {status === 'complete' && result && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <ResultCard result={result} />
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button 
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-900 border border-gray-700 text-gray-300 px-6 py-3 hover:bg-gray-800 transition"
              >
                <RotateCcw size={18} />
                <span>NEW SEARCH</span>
              </button>
              
              <button 
                onClick={handleCopy}
                className="flex items-center space-x-2 bg-green-900/20 border border-green-600 text-green-400 px-6 py-3 hover:bg-green-900/40 transition"
              >
                <Copy size={18} />
                <span>COPY DATA</span>
              </button>
              
              <button 
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-green-600 text-black font-bold px-6 py-3 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:bg-green-500 transition"
              >
                <Download size={18} />
                <span>EXPORT REPORT</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="mt-12 text-center opacity-40">
          <div className="flex items-center justify-center space-x-2 text-yellow-500 mb-2">
            <AlertTriangle size={14} />
            <span className="text-xs font-mono">SIMULATION MODE ONLY</span>
          </div>
          <p className="text-[10px] text-gray-600 max-w-md mx-auto leading-relaxed">
            WARNING: This tool is a graphical simulation for entertainment purposes only. 
            No real data is accessed, stored, or processed. 
            Any resemblance to real person data is purely coincidental.
            Do not use for illegal activities.
          </p>
        </div>

      </div>
    </div>
  );
};

export default App;