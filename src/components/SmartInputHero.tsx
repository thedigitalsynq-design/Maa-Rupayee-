import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  FileSpreadsheet, 
  BookOpen, 
  Receipt, 
  Landmark, 
  PiggyBank, 
  Calculator, 
  FileText,
  Check,
  X
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

  const quickExamples = [
    { label: '₹2,360 MRP Store Bill', query: '₹2,360 including 18% GST' },
    { label: 'Samsung 55" TV ₹65,000', query: 'Samsung TV 55 inch ₹65,000' },
    { label: 'Cotton Saree ₹2,400', query: 'Cotton Saree ₹2,400' },
    { label: 'Freight GTA ₹45,000', query: 'Freight transport GTA ₹45,000' },
    { label: 'IT Consulting ₹85,000', query: 'IT Consultancy Services ₹85,000' },
    { label: 'Restaurant Dining ₹2,500', query: 'Restaurant dining bill ₹2,500' },
  ];

  // Disjointed tools replaced by Maa Rupayee
  const replacedTools = [
    { name: 'CBIC PDFs', icon: FileText, label: 'Rate Schedules' },
    { name: 'HSN Books', icon: BookOpen, label: 'Code Directory' },
    { name: 'Excel Sheets', icon: FileSpreadsheet, label: 'Tax Templates' },
    { name: 'GST Portals', icon: Calculator, label: 'Manual Portals' },
    { name: 'ITR Sheets', icon: Landmark, label: 'Tax Slabs' },
    { name: 'Bank EMI Sites', icon: PiggyBank, label: 'Loan Tools' },
    { name: 'Paper Bills', icon: Receipt, label: 'Rule 46 Invoices' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim(), transactionDate);
    }
  };

  const handleChipClick = (query: string) => {
    setInputVal(query);
    onSearch(query, transactionDate);
  };

  const isHistorical = transactionDate && transactionDate < '2025-01-01';

  return (
    <div className="max-w-4xl mx-auto my-3 sm:my-6 animate-in fade-in">
      <div className="glass-card rounded-[36px] p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* ========================================================= */}
        {/* HERO TITLE & CONSOLIDATION VALUE PROPOSITION              */}
        {/* ========================================================= */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>All-in-One Statutory Tax Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.15]">
            Consolidate tax tools, cut complexity, and calculate faster
          </h1>
          
          <p className="text-xs sm:text-sm text-zinc-500 mt-3 sm:mt-4 leading-relaxed max-w-xl mx-auto">
            No more juggling separate GST portals, confusing spreadsheets, offline rate PDF gazettes, or outdated calculators. Maa Rupayee combines official CBIC schedules, invoice generation, HSN/SAC explorer, and financial tools in one unified, 100% free platform.
          </p>
        </div>

        {/* ========================================================= */}
        {/* CONSOLIDATED TOOLS ARC (Inspired by reference design)     */}
        {/* ========================================================= */}
        <div className="relative py-3 sm:py-5 overflow-hidden">
          {/* Subtle curved arc background line */}
          <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 border-t border-dashed border-zinc-300 -translate-y-1/2 pointer-events-none opacity-60 z-0"></div>

          <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
            {replacedTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div 
                  key={idx}
                  className="group relative flex flex-col items-center shrink-0"
                  title={`${tool.name}: Consolidated into Maa Rupayee`}
                >
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl glass-card flex flex-col items-center justify-center shadow-xs border border-zinc-200/90 transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[9px] font-semibold tracking-tighter mt-1 opacity-70">
                      {tool.name}
                    </span>
                  </div>
                  
                  {/* Subtle Replacement Indicator Pill */}
                  <div className="mt-1.5 flex items-center gap-0.5 text-[9px] font-mono text-zinc-500">
                    <Check className="h-2.5 w-2.5" />
                    <span>Included</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* UNIFIED SMART INTELLIGENCE INPUT FORM                     */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
          <div className="relative flex items-center rounded-full glass-card p-1.5 pl-5 border border-zinc-300 shadow-md focus-within:ring-2 focus-within:ring-zinc-950 transition-all">
            <div className="text-zinc-500 pr-2 shrink-0">
              <Search className="h-5 w-5" />
            </div>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Describe any item, service or bill (e.g. ₹2,360 store bill, Samsung TV ₹65,000, IT Consulting ₹85,000)..."
              className="w-full py-3.5 pr-28 sm:pr-32 bg-transparent text-sm sm:text-base font-semibold focus:outline-none placeholder:text-zinc-400"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="compute-btn absolute right-2 px-5 sm:px-6 py-3 bg-zinc-950 hover:bg-black text-white font-bold rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer shrink-0"
            >
              {isLoading ? (
                <span>Computing...</span>
              ) : (
                <>
                  <span>Compute</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Example Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs text-zinc-500 font-bold mr-1">Quick Presets:</span>
            {quickExamples.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(item.query)}
                className="text-xs px-3.5 py-1.5 rounded-full glass-pill font-semibold transition-all hover:border-zinc-400 active:scale-95 cursor-pointer shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Context Footer (Date & Route) */}
          <div className="pt-4 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Assessment Date:</span>
              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              />
              {isHistorical && (
                <span className="font-semibold underline">(Gazette Archives)</span>
              )}
            </div>

            <div>
              Active Route: <span className="font-bold">{supplierState.code === customerState.code ? `Intra-State (${supplierState.code} CGST+SGST)` : `Inter-State (${supplierState.code} → ${customerState.code} IGST)`}</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
