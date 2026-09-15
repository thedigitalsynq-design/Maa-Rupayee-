import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Receipt, 
  Tv, 
  Truck, 
  UtensilsCrossed,
  Layers
} from 'lucide-react';
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

  const suggestions = [
    {
      icon: Receipt,
      title: 'Verify MRP Store Bill GST',
      query: '₹2,360 including 18% GST',
      hint: 'Extracts base amount & embedded CGST+SGST',
    },
    {
      icon: Tv,
      title: 'Commercial Electronics & Display',
      query: 'Samsung TV 55 inch ₹65,000',
      hint: 'HSN 8528 • 18% standard bracket',
    },
    {
      icon: Truck,
      title: 'Freight Transport GTA & Logistics',
      query: 'Freight transport GTA ₹45,000',
      hint: 'SAC 9965 • 5% RCM reverse charge',
    },
    {
      icon: UtensilsCrossed,
      title: 'Restaurant Dining & Food Delivery',
      query: 'Restaurant bill ₹2,500',
      hint: 'SAC 9963 • 5% composite food without ITC',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim(), transactionDate);
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInputVal(query);
    onSearch(query, transactionDate);
  };

  const isHistorical = transactionDate && transactionDate < '2025-01-01';

  return (
    <div className="max-w-2xl mx-auto my-2">
      {/* Outer Floating Frosted Glass Card (Directly inspired by Reference Artwork) */}
      <div className="glass-card rounded-[32px] sm:rounded-[36px] overflow-hidden p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,10,35,0.4)] border border-white/20 transition-all">
        
        {/* 1. Iridescent Top Header: "✦ Suggest for you" */}
        <div className="w-full rounded-2xl py-3 px-4 mb-4 flex items-center justify-between bg-gradient-to-r from-emerald-400/20 via-sky-400/25 to-indigo-400/20 border border-white/30 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-2 text-white font-semibold text-xs tracking-wide">
            <Sparkles className="h-4 w-4 text-emerald-300 animate-pulse" />
            <span>Suggest for you</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
            CBIC Intelligence
          </span>
        </div>

        {/* 2. Interactive Suggestion Action Rows */}
        <div className="divide-y divide-white/10 mb-5">
          {suggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item.query)}
                className="w-full py-3.5 px-3 flex items-center justify-between text-left hover:bg-white/10 rounded-2xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  {/* Embossed Neumorphic Pearl Icon Badge */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-b from-white/30 to-white/10 border border-white/40 shadow-[inset_0_2px_3px_rgba(255,255,255,0.5),0_4px_10px_rgba(0,0,0,0.15)] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-cyan-300 transition-all">
                    <Icon className="h-4 w-4 text-white group-hover:text-cyan-300 transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-blue-200/80 font-medium">
                      {item.hint}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold text-white/70 hidden sm:inline group-hover:text-white">
                    {item.query}
                  </span>
                  <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Floating Pearl Button over "Ask anything..." Input Bar */}
        <div className="relative pt-4 border-t border-white/10">
          
          {/* Centered Floating Pearl Icon Button */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
            <button
              type="button"
              onClick={() => {
                const sample = suggestions[Math.floor(Math.random() * suggestions.length)].query;
                handleSuggestionClick(sample);
              }}
              className="h-10 w-10 rounded-full bg-gradient-to-b from-white to-slate-200 text-slate-800 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.25),inset_0_2px_3px_rgba(255,255,255,0.9)] border border-white hover:scale-110 active:scale-95 transition-all cursor-pointer group"
              title="Click for surprise sample calculation"
            >
              <span className="text-base font-bold text-slate-900 group-hover:rotate-12 transition-transform">
                ✦
              </span>
            </button>
          </div>

          {/* Frosted Input Bar */}
          <form onSubmit={handleSubmit} className="relative mt-2">
            <div className="relative flex items-center rounded-2xl overflow-hidden bg-white/10 hover:bg-white/15 focus-within:bg-white/20 focus-within:border-cyan-300 border border-white/25 transition-all shadow-inner backdrop-blur-xl">
              <div className="pl-4 text-white/70">
                <Search className="h-4 w-4 text-white/70" />
              </div>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="ask anything... e.g. Samsung TV 55 inch ₹65,000, Cotton Saree"
                className="w-full py-3.5 pl-3 pr-28 bg-transparent text-white placeholder:text-blue-100/70 text-xs sm:text-sm focus:outline-none font-medium"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                {isLoading ? (
                  <span>Computing...</span>
                ) : (
                  <>
                    <span>Compute</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Context bar (Filing date & State Route) */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-100/80 px-1 font-medium">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 border border-white/15">
                <Calendar className="h-3 w-3 text-cyan-300" />
                <span>Filing Date:</span>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="bg-transparent text-white rounded px-1 text-[11px] focus:outline-none font-mono cursor-pointer"
                />
                {isHistorical && (
                  <span className="text-amber-300 font-bold ml-1">
                    (Gazette Rates)
                  </span>
                )}
              </div>

              <div className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15">
                Route: <span className="text-white font-bold">{supplierState.code === customerState.code ? `Intra-State (${supplierState.code} CGST+SGST)` : `Inter-State (${supplierState.code}→${customerState.code} IGST)`}</span>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
