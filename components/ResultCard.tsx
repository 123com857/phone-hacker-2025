import React from 'react';
import { OsintResult } from '../types';
import { ShieldAlert, MapPin, Radio, Database, Globe, Lock } from 'lucide-react';

interface ResultCardProps {
  result: OsintResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500 border-green-500';
    if (score < 70) return 'text-yellow-500 border-yellow-500';
    return 'text-red-600 border-red-600 animate-pulse';
  };

  return (
    <div id="osint-report" className="w-full max-w-2xl mx-auto bg-black/90 border border-green-500/50 p-6 shadow-[0_0_30px_rgba(0,255,0,0.2)] relative overflow-hidden mt-8">
      {/* Header decorative line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
      
      <div className="flex justify-between items-start mb-6 border-b border-green-500/30 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white glow-text mb-1">TARGET_ANALYSIS_REPORT</h2>
          <p className="text-xs text-green-600 uppercase tracking-widest">CONFIDENTIAL // EYES ONLY</p>
        </div>
        <div className={`border-2 px-3 py-1 rounded font-bold ${getRiskColor(result.riskScore)}`}>
          RISK: {result.riskScore}/100
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Radio className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Carrier</p>
              <p className="text-lg text-green-400 font-bold">{result.carrier}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Location</p>
              <p className="text-lg text-white">{result.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Line Type</p>
              <p className="text-lg text-white">
                {result.lineType} 
                {result.isVoip && <span className="ml-2 text-xs bg-red-900 text-red-200 px-1 rounded">VOIP DETECTED</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Deep Web Data */}
        <div className="space-y-4 border-l border-green-500/20 pl-0 md:pl-6">
          <div className="flex items-center space-x-3">
             <Database className="w-5 h-5 text-red-500" />
             <div>
               <p className="text-xs text-gray-500 uppercase">Data Leaks Found</p>
               <p className="text-xl text-red-500 font-bold">{result.leakCount} RECORDS</p>
             </div>
          </div>

          <div className="flex items-center space-x-3">
             <ShieldAlert className="w-5 h-5 text-orange-500" />
             <div>
               <p className="text-xs text-gray-500 uppercase">Latest Breach</p>
               <p className="text-sm text-orange-400">{result.lastLeakSource}</p>
             </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <Lock className="w-5 h-5 text-gray-400" />
             <div>
               <p className="text-xs text-gray-500 uppercase">Associated Accounts</p>
               <p className="text-lg text-white">~{result.linkedAccounts} Platforms</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tags Footer */}
      <div className="mt-6 pt-4 border-t border-green-500/30">
        <p className="text-xs text-gray-500 mb-2">DETECTED_FOOTPRINTS:</p>
        <div className="flex flex-wrap gap-2">
          {result.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-green-900/30 text-green-400 text-xs border border-green-500/30 rounded">
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute bottom-0 right-0 p-2 opacity-20">
         <div className="w-16 h-16 border-r-2 border-b-2 border-green-500"></div>
      </div>
    </div>
  );
};

export default ResultCard;