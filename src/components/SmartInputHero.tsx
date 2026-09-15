import React, { useState } from 'react';
import { Search, Calendar, ArrowRight } from 'lucide-react';
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
    'iPhone 17 256GB ₹89,900',
    'Restaurant bill ₹2,500',
    'SaaS cloud software ₹1,20,000',
    'Footwear 20 pairs ₹18,000',
    'Pre-packaged Rice 25kg ₹1,800',
    '₹11,800 including GST',
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
    <div className="apple-card-glass rounded-2xl p-6 sm:p-8 mb-6 border border-white/80 shadow-sm">
      <div className="max-w-2xl mx-auto text-center">
        {/* Apple Display Headline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-slate-700 text-xs font-medium mb-3 border border-black/[0.06]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Apple Intelligence & CBIC Tax Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Real-Time GST Classification
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6">
          Enter any product, service, or bill amount. The engine verifies HSN/SAC codes, statutory tax brackets, and computes exact splits.
        </p>

        {/* Apple Inset Search Input Form */}
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
          <div className="relative flex items-center rounded-2xl overflow-hidden bg-black/[0.035] hover:bg-black/[0.05] focus-within:bg-white focus-within:border-black/30 border border-black/[0.08] transition-all shadow-inner">
            <div className="pl-4 text-slate-400">
              <Search className="h-4 w-4 text-slate-600" />
            </div>
            
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. Samsung TV 55 inch ₹65,000, Cotton Saree, SaaS License..."
              className="w-full py-3.5 pl-3 pr-28 bg-transparent text-slate-900 placeholder-slate-400 text-sm focus:outline-none font-medium"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="absolute right-1.5 px-4 py-2 bg-[#1d1d1f] hover:bg-[#2c2c2e] disabled:opacity-40 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              {isLoading ? (
                <span>Classifying...</span>
              ) : (
                <>
                  <span>Compute</span>
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>
          </div>

          {/* Transaction Controls */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
            <div className="flex items-center gap-1.5 bg-black/[0.03] px-2.5 py-1 rounded-lg border border-black/[0.04]">
              <Calendar className="h-3 w-3 text-slate-600" />
              <span>Transaction Date:</span>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="bg-white/80 border border-black/10 text-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono"
              />
              {isHistorical && (
                <span className="text-amber-600 font-medium">
                  (Historical)
                </span>
              )}
            </div>

            <div className="bg-black/[0.03] px-2.5 py-1 rounded-lg border border-black/[0.04]">
              Route: <span className="text-slate-800 font-semibold">{supplierState.name}</span> &rarr; <span className="text-slate-800 font-semibold">{customerState.name}</span>
            </div>
          </div>
        </form>

        {/* Apple Prompt Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(p)}
              className="px-3 py-1 bg-white/70 hover:bg-white text-slate-600 hover:text-slate-900 border border-black/[0.06] rounded-full text-[11px] font-medium shadow-xs transition-all active:scale-95"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
