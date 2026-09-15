import React from 'react';
import { 
  Calculator, 
  FileText, 
  Search, 
  BellRing, 
  History, 
  BookmarkCheck, 
  BookOpen, 
  MapPin, 
  ArrowRightLeft 
} from 'lucide-react';
import { IndianState } from '../types';
import { INDIAN_STATES, DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from '../data/indianStates';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  supplierState: IndianState;
  setSupplierState: (state: IndianState) => void;
  customerState: IndianState;
  setCustomerState: (state: IndianState) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  supplierState,
  setSupplierState,
  customerState,
  setCustomerState,
  savedCount,
}) => {
  const safeSupplierState = supplierState || DEFAULT_SUPPLIER_STATE;
  const safeCustomerState = customerState || DEFAULT_CUSTOMER_STATE;
  const isIntraState = safeSupplierState.code === safeCustomerState.code;

  const handleSwapStates = () => {
    const temp = safeSupplierState;
    setSupplierState(safeCustomerState);
    setCustomerState(temp);
  };

  const navItems = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'invoice', label: 'Tax Invoice', icon: FileText },
    { id: 'explorer', label: 'HSN / SAC', icon: Search },
    { id: 'council', label: 'Council Updates', icon: BellRing },
    { id: 'history', label: 'Rate History', icon: History },
    { id: 'saved', label: 'Saved Audits', icon: BookmarkCheck, count: savedCount },
    { id: 'knowledge', label: 'Compliance Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => setActiveTab('calculator')}
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-bold text-base text-slate-950 shadow-sm">
            ₹
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base tracking-tight text-white">PaisaCalc</span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Real-time Tax Engine</span>
          </div>
        </div>

        {/* Global State Selector (Clean Minimalist Pill) */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">From:</span>
            <select
              aria-label="Supplier State"
              value={safeSupplierState.code}
              onChange={(e) => {
                const found = INDIAN_STATES.find(s => s.code === e.target.value);
                if (found) setSupplierState(found);
              }}
              className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {INDIAN_STATES.map((s) => (
                <option key={`sup-${s.code}`} value={s.code} className="bg-slate-900 text-slate-100">
                  {s.name} ({s.tin})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwapStates}
            title="Swap Source and Destination"
            className="p-1 hover:bg-slate-700/80 rounded text-slate-400 hover:text-white transition-colors"
          >
            <ArrowRightLeft className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px]">To:</span>
            <select
              aria-label="Customer State"
              value={safeCustomerState.code}
              onChange={(e) => {
                const found = INDIAN_STATES.find(s => s.code === e.target.value);
                if (found) setCustomerState(found);
              }}
              className="bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {INDIAN_STATES.map((s) => (
                <option key={`cust-${s.code}`} value={s.code} className="bg-slate-900 text-slate-100">
                  {s.name} ({s.tin})
                </option>
              ))}
            </select>
          </div>

          <span
            className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isIntraState
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-sky-500/20 text-sky-300'
            }`}
          >
            {isIntraState ? 'Intra (CGST+SGST)' : 'Inter (IGST)'}
          </span>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none gap-0.5 border-t border-slate-800/80 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 py-2 px-3 font-medium whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-amber-400 text-amber-300 bg-slate-800/40 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
