import React, { useState } from 'react';
import { Search, Calendar, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { IndianState } from '../types';

interface SmartInputHeroProps {
  onSearch: (query: string, transactionDate: string) => void;
  isLoading: boolean;
  supplierState: IndianState;
  customerState: IndianState;
  transactionDate: string;
  setTransactionDate: (date: string) => void;
}

export const SmartInputHero: React.FC<SmartInputHeroProps> = ({
  onSearch,
  isLoading,
  supplierState,
  customerState,
  transactionDate,
  setTransactionDate,
}) => {
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'Samsung TV 55 inch ₹65,000',
    'Cotton Saree ₹2,400',
    'Camera rent for shooting ₹15,000',
    'Pre-packaged Rice 25kg ₹1,800',
    'Restaurant bill ₹2,500',
    'SaaS cloud software ₹1,20,000',
    '₹11,800 including GST',
    'Freight transport GTA ₹45,000'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim(), transactionDate);
    }
  };

  const handleChipClick = (prompt: string) => {
    setInputVal(prompt);
    onSearch(prompt, transactionDate);
  };

  const isHistorical = transactionDate && transactionDate < '2025-01-01';

  return (
    <div className="rounded-[28px] p-6 sm:p-8 bg-[#171b24] border border-slate-800/90 shadow-[0_10px_35px_rgba(0,0,0,0.35)] text-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e2330] text-blue-400 text-xs font-semibold mb-3 border border-slate-700/80 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Free • No Login • Real-Time CBIC India GST Intelligence</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Instant GST, HSN/SAC & Tax Classification
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6">
          Describe any product, service, or bill. The engine automatically classifies HSN/SAC, identifies statutory rates, verifies Gazette notifications, and computes forward & reverse splits.
        </p>

        {/* Inset Search Input Form */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center rounded-2xl overflow-hidden bg-[#12141c] hover:bg-[#131620] focus-within:bg-[#0f1118] focus-within:border-blue-500 border border-slate-700/80 transition-all shadow-inner">
            <div className="pl-4 text-slate-400">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. Samsung TV 55 inch ₹65,000, Cotton Saree, Freight transport..."
              className="w-full py-3.5 pl-3 pr-32 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-medium"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="absolute right-1.5 px-4 py-2 bg-[#2f66ee] hover:bg-[#2052db] disabled:opacity-40 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              {isLoading ? (
                <span>Classifying...</span>
              ) : (
                <>
                  <span>Compute</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Transaction Controls */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5 bg-[#12141c] px-3 py-1 rounded-xl border border-slate-800">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>Filing Date:</span>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="bg-transparent text-slate-200 rounded px-1 text-[11px] focus:outline-none font-mono cursor-pointer"
              />
              {isHistorical && (
                <span className="text-amber-400 font-semibold ml-1">
                  (Historical Rates)
                </span>
              )}
            </div>

            <div className="bg-[#12141c] px-3 py-1 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              Route: <span className="text-slate-200 font-semibold">{supplierState.code === customerState.code ? `Intra-State (${supplierState.code} CGST+SGST)` : `Inter-State (${supplierState.code}→${customerState.code} IGST)`}</span>
            </div>
          </div>
        </form>

        {/* Quick Example Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(prompt)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#12141d] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all active:scale-95 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
