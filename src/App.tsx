import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  FileText, 
  Search, 
  BellRing, 
  History, 
  BookmarkCheck, 
  BookOpen, 
  ArrowRightLeft,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Landmark,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Clock,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

import { IndianState, SavedCalculation, InvoiceLineItem, GSTItem, ClassifiedResult } from './types';
import { INDIAN_STATES, DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from './data/indianStates';
import { AllInOneCalculator } from './components/AllInOneCalculator';
import { InvoiceBuilder } from './components/InvoiceBuilder';
import { HsnSacExplorer } from './components/HsnSacExplorer';
import { GSTCouncilFeed } from './components/GSTCouncilFeed';
import { HistoricalLookupView } from './components/HistoricalLookupView';
import { SavedCalculationsView } from './components/SavedCalculationsView';
import { KnowledgeGuideView } from './components/KnowledgeGuideView';
import { SmartInputHero } from './components/SmartInputHero';
import { SmartResultCard } from './components/SmartResultCard';
import { ItrSimulator } from './components/ItrSimulator';
import { SipCalculator } from './components/SipCalculator';
import { LoanEmiCalculator } from './components/LoanEmiCalculator';
import { classifyProductOrService } from './services/classificationService';

export type NavTab = 
  | 'overview' 
  | 'calculator' 
  | 'invoice' 
  | 'explorer' 
  | 'council' 
  | 'itr' 
  | 'sip' 
  | 'loan' 
  | 'history' 
  | 'saved' 
  | 'knowledge';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State Route Configuration
  const [supplierState, setSupplierState] = useState<IndianState>(DEFAULT_SUPPLIER_STATE);
  const [customerState, setCustomerState] = useState<IndianState>(DEFAULT_CUSTOMER_STATE);
  const [topSearchTerm, setTopSearchTerm] = useState('');

  // Real-time AI GST Classification state
  const [activeClassifiedResult, setActiveClassifiedResult] = useState<ClassifiedResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSmartSearch = async (query: string, date: string) => {
    setIsClassifying(true);
    try {
      const res = await classifyProductOrService(query, supplierState, customerState, date);
      setActiveClassifiedResult(res);
      // Ensure we are viewing overview to see the result
      if (activeTab !== 'overview') {
        setActiveTab('overview');
      }
    } catch (e) {
      console.error('Classification error:', e);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleQuickSlabTest = (rate: number, query: string) => {
    setActiveTab('calculator');
  };

  // Invoice items state
  const [invoiceItems, setInvoiceItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      description: 'Cloud Server Infrastructure Consulting',
      hsnSac: '998313',
      type: 'SERVICES',
      quantity: 1,
      unit: 'Month',
      unitPrice: 45000,
      discountPercent: 0,
      taxableAmount: 45000,
      gstRate: 18,
      cessRate: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      utgstAmount: 0,
      igstAmount: 8100,
      cessAmount: 0,
      totalAmount: 53100
    },
    {
      id: 'item-2',
      description: 'Workstation Display Panels',
      hsnSac: '847130',
      type: 'GOODS',
      quantity: 2,
      unit: 'Units',
      unitPrice: 75000,
      discountPercent: 0,
      taxableAmount: 150000,
      gstRate: 18,
      cessRate: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      utgstAmount: 0,
      igstAmount: 27000,
      cessAmount: 0,
      totalAmount: 177000
    }
  ]);

  // Saved Audits (localStorage)
  const [savedAudits, setSavedAudits] = useState<SavedCalculation[]>(() => {
    try {
      const stored = localStorage.getItem('smart_gst_audits');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'init-1',
        timestamp: Date.now() - 3600000 * 4,
        query: 'Commercial LED Panel ₹78,000',
        product: 'Commercial Monitor & Display Panel',
        hsnSac: '852852',
        rate: 18,
        supplierState: 'Karnataka',
        customerState: 'Maharashtra',
        transactionType: 'Inter-State',
        taxableValue: 66101.69,
        gstAmount: 11898.31,
        finalAmount: 78000,
      },
      {
        id: 'init-2',
        timestamp: Date.now() - 3600000 * 24,
        query: 'Legal Consultancy Services ₹35,000',
        product: 'Legal and Statutory Advisory',
        hsnSac: '998211',
        rate: 18,
        supplierState: 'Delhi',
        customerState: 'Delhi',
        transactionType: 'Intra-State',
        taxableValue: 35000,
        gstAmount: 6300,
        finalAmount: 41300,
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart_gst_audits', JSON.stringify(savedAudits));
    } catch {
      // handle storage quota
    }
  }, [savedAudits]);

  const handleSwapStates = () => {
    const temp = supplierState;
    setSupplierState(customerState);
    setCustomerState(temp);
  };

  const handleSaveAudit = (auditData: any) => {
    const newEntry: SavedCalculation = {
      id: 'calc-' + Date.now(),
      timestamp: Date.now(),
      ...auditData
    };
    setSavedAudits(prev => [newEntry, ...prev]);
  };

  const handleDeleteAudit = (id: string) => {
    setSavedAudits(prev => prev.filter(a => a.id !== id));
  };

  const handleClearAllAudits = () => {
    setSavedAudits([]);
  };

  const handleAddToInvoice = (item: any) => {
    const newItem: InvoiceLineItem = {
      id: 'item-' + Date.now(),
      description: item.description || item.product || 'Custom Line Item',
      hsnSac: item.hsnSac || '998311',
      type: item.type || 'SERVICES',
      quantity: 1,
      unit: item.type === 'GOODS' ? 'Pcs' : 'Service',
      unitPrice: item.taxableAmount || item.taxableValue || 0,
      discountPercent: 0,
      taxableAmount: item.taxableAmount || item.taxableValue || 0,
      gstRate: item.gstRate || item.rate || 18,
      cessRate: item.cessRate || 0,
      cgstAmount: item.cgstAmount || 0,
      sgstAmount: item.sgstAmount || 0,
      utgstAmount: item.utgstAmount || 0,
      igstAmount: item.igstAmount || item.gstAmount || 0,
      cessAmount: item.cessAmount || 0,
      totalAmount: item.totalAmount || item.finalAmount || 0
    };
    setInvoiceItems(prev => [...prev, newItem]);
    setActiveTab('invoice');
  };

  const isIntraState = supplierState.code === customerState.code;

  return (
    <div className="min-h-screen py-3 sm:py-6 px-2 sm:px-5 lg:px-8 bg-[#090b0e] text-slate-100 font-sans selection:bg-[#2f66ee] selection:text-white">
      
      {/* Master Rounded Container */}
      <div className="max-w-[1440px] mx-auto rounded-[24px] sm:rounded-[32px] overflow-hidden border border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col md:flex-row bg-[#11141c]">
        
        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION (Focused, Clean, Structured)           */}
        {/* ========================================================= */}
        <aside aria-label="Site Navigation" className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-slate-800/90 bg-[#0e1118] flex flex-col justify-between shrink-0">
          
          <div className="p-4 sm:p-5">
            {/* Brand Logo & Tagline */}
            <div 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 cursor-pointer group mb-6 px-1"
            >
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#ff5b35] to-[#2f66ee] text-white flex items-center justify-center font-black text-xl shadow-md transition-transform group-hover:scale-105 active:scale-95">
                ₹
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>Smart GST India</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Direct & Indirect Tax Utility
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="md:hidden flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                Menu • <span className="text-blue-400 capitalize">{activeTab}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>

            {/* Navigation Sections */}
            <nav className={`space-y-5 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
              
              {/* PRIMARY TIER: GST & INDIRECT TAX */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase">
                  GST & Indirect Tax (Core)
                </div>
                <div className="space-y-1">
                  
                  {/* GST Intelligence */}
                  <button
                    onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'overview'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className={`h-4 w-4 ${activeTab === 'overview' ? 'text-white' : 'text-blue-400'}`} />
                      <span>GST Intelligence</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/50 font-semibold">
                      AI Hero
                    </span>
                  </button>

                  {/* All-in-One Calculator */}
                  <button
                    onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'calculator'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calculator className={`h-4 w-4 ${activeTab === 'calculator' ? 'text-white' : 'text-orange-400'}`} />
                      <span>GST Calculator</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Fwd/Rev</span>
                  </button>

                  {/* Tax Invoice Builder */}
                  <button
                    onClick={() => { setActiveTab('invoice'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'invoice'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className={`h-4 w-4 ${activeTab === 'invoice' ? 'text-white' : 'text-emerald-400'}`} />
                      <span>Tax Invoice Builder</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {invoiceItems.length}
                    </span>
                  </button>

                  {/* HSN/SAC Explorer */}
                  <button
                    onClick={() => { setActiveTab('explorer'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'explorer'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className={`h-4 w-4 ${activeTab === 'explorer' ? 'text-white' : 'text-purple-400'}`} />
                      <span>HSN / SAC Directory</span>
                    </div>
                  </button>

                  {/* Council Updates */}
                  <button
                    onClick={() => { setActiveTab('council'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'council'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BellRing className={`h-4 w-4 ${activeTab === 'council' ? 'text-white' : 'text-amber-400'}`} />
                      <span>Council Bulletins</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </button>

                </div>
              </div>

              {/* SECONDARY TIER: FINANCIAL UTILITIES */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase">
                  Financial Utilities
                </div>
                <div className="space-y-1">
                  
                  {/* ITR Simulator */}
                  <button
                    onClick={() => { setActiveTab('itr'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'itr'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Landmark className={`h-4 w-4 ${activeTab === 'itr' ? 'text-white' : 'text-emerald-400'}`} />
                      <span>ITR Filing Simulator</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                      FY 25-26
                    </span>
                  </button>

                  {/* SIP & Wealth Calculator */}
                  <button
                    onClick={() => { setActiveTab('sip'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'sip'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className={`h-4 w-4 ${activeTab === 'sip' ? 'text-white' : 'text-cyan-400'}`} />
                      <span>SIP & Mutual Funds</span>
                    </div>
                  </button>

                  {/* Loan EMI Calculator */}
                  <button
                    onClick={() => { setActiveTab('loan'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-between ${
                      activeTab === 'loan'
                        ? 'bg-[#2f66ee] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <PiggyBank className={`h-4 w-4 ${activeTab === 'loan' ? 'text-white' : 'text-pink-400'}`} />
                      <span>Loan EMI & Interest</span>
                    </div>
                  </button>

                </div>
              </div>

              {/* TERTIARY TIER: RECORDS & COMPLIANCE */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 px-2 uppercase">
                  Records & Guidance
                </div>
                <div className="space-y-1">
                  
                  {/* Saved Audits */}
                  <button
                    onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'saved'
                        ? 'bg-[#181d28] text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className="h-3.5 w-3.5 text-blue-400" />
                      <span>Saved Calculations</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {savedAudits.length}
                    </span>
                  </button>

                  {/* Rate History */}
                  <button
                    onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'history'
                        ? 'bg-[#181d28] text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <History className="h-3.5 w-3.5 text-slate-400" />
                      <span>Rate Gazette History</span>
                    </div>
                  </button>

                  {/* Knowledge Guide */}
                  <button
                    onClick={() => { setActiveTab('knowledge'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'knowledge'
                        ? 'bg-[#181d28] text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      <span>Compliance Handbook</span>
                    </div>
                  </button>

                </div>
              </div>

            </nav>
          </div>

          {/* Footer Badge: Trust & Transparency */}
          <div className="p-4 border-t border-slate-800/80 bg-[#0a0d13] text-[11px] text-slate-400 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>100% Free • No Login Required</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Grounded in official CBIC GST schedules & Indian Income Tax Act.
            </p>
          </div>

        </aside>

        {/* ========================================================= */}
        {/* MAIN APPLICATION CANVAS                                   */}
        {/* ========================================================= */}
        <main className="flex-1 flex flex-col min-w-0 p-3 sm:p-6 lg:p-7 overflow-x-hidden bg-[#11141c]">
          
          {/* TOP GLOBAL HEADER */}
          <header className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/80">
            
            {/* Left: Active Route / Intra vs Inter State indicator */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-[#171b24] border border-slate-800 text-xs flex items-center gap-2">
                <span className="text-slate-400">Transaction Route:</span>
                <span className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                  isIntraState 
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' 
                    : 'bg-blue-950/60 text-blue-300 border border-blue-800/50'
                }`}>
                  {isIntraState ? `Intra-State (${supplierState.code} CGST + SGST)` : `Inter-State (${supplierState.code} → ${customerState.code} IGST)`}
                </span>
              </div>
            </div>

            {/* Right: State Selectors & Quick Swap */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b24] border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">From:</span>
                <select
                  aria-label="Supplier State"
                  value={supplierState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setSupplierState(found);
                  }}
                  className="bg-transparent font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={`sup-${s.code}`} value={s.code} className="bg-slate-900 text-white">
                      {s.name} ({s.tin})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSwapStates}
                  title="Swap Supplier and Customer State"
                  className="p-1 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </button>

                <span className="text-slate-400 text-[11px]">To:</span>
                <select
                  aria-label="Customer State"
                  value={customerState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setCustomerState(found);
                  }}
                  className="bg-transparent font-bold text-slate-200 focus:outline-none cursor-pointer"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={`cust-${s.code}`} value={s.code} className="bg-slate-900 text-white">
                      {s.name} ({s.tin})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status indicator */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171b24] border border-slate-800 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-medium text-slate-400">CBIC 2026 Ready</span>
              </div>
            </div>

          </header>

          {/* ========================================================= */}
          {/* TAB VIEWS                                                 */}
          {/* ========================================================= */}

          {/* 1. OVERVIEW: GST INTELLIGENCE & ESSENTIAL BENTO */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Primary Smart Input Hero */}
              <SmartInputHero
                onSearch={handleSmartSearch}
                isLoading={isClassifying}
                supplierState={supplierState}
                customerState={customerState}
                transactionDate={transactionDate}
                setTransactionDate={setTransactionDate}
              />

              {/* Active Result Card (Instant Tax Split & Feedback) */}
              {activeClassifiedResult && (
                <div className="relative animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <Sparkles className="h-4 w-4 text-[#2f66ee] animate-pulse" />
                      <span>Statutory Classification & Tax Breakdown</span>
                    </div>
                    <button
                      onClick={() => setActiveClassifiedResult(null)}
                      className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    >
                      ✕ Close Result
                    </button>
                  </div>

                  <SmartResultCard
                    result={activeClassifiedResult}
                    onUpdateResult={setActiveClassifiedResult}
                    onSave={handleSaveAudit}
                    onAddToInvoice={handleAddToInvoice}
                  />
                </div>
              )}

              {/* CLEAN, FOCUSED FINANCIAL BENTO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
                
                {/* BENTO CARD 1: Indian GST Rate Slabs */}
                <div className="rounded-2xl p-5 bg-[#171b24] border border-slate-800/90 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Statutory GST Slabs
                      </span>
                      <span className="text-[10px] text-blue-400 font-semibold">
                        CBIC Schedule
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Standard Indian Goods and Services Tax slabs with representative categories:
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {[
                        { rate: '0%', label: 'Exempt / Grains', desc: 'Fresh milk, unbranded grains' },
                        { rate: '3%', label: 'Precious Metals', desc: 'Gold, silver, diamonds' },
                        { rate: '5%', label: 'Essentials', desc: 'Edible oil, tea, rail travel' },
                        { rate: '12%', label: 'Processed', desc: 'Butter, cheese, business class' },
                        { rate: '18%', label: 'Standard', desc: 'IT services, consumer electronics' },
                        { rate: '28%', label: 'Luxury & Sin', desc: 'Motorcars, aerated drinks' },
                      ].map((slab) => (
                        <div
                          key={slab.rate}
                          onClick={() => handleQuickSlabTest(parseFloat(slab.rate), slab.label)}
                          className="p-2 rounded-xl bg-[#12141c] hover:bg-[#1a1f2b] border border-slate-800/80 cursor-pointer transition-all group text-left"
                        >
                          <div className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors">
                            {slab.rate}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-300 truncate">
                            {slab.label}
                          </div>
                          <div className="text-[9px] text-slate-400 truncate mt-0.5">
                            {slab.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Forward & Reverse Supported</span>
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <span>Custom Calculator</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* BENTO CARD 2: Direct Tax & Financial Utilities Hub */}
                <div className="rounded-2xl p-5 bg-[#171b24] border border-slate-800/90 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Personal Tax & Wealth
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Free Utilities
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      Instant simulators for salary income tax, mutual fund wealth creation, and loan borrowing:
                    </p>

                    <div className="space-y-2">
                      {/* ITR link */}
                      <div
                        onClick={() => setActiveTab('itr')}
                        className="p-2.5 rounded-xl bg-[#12141c] hover:bg-[#1a1f2b] border border-slate-800/80 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            <Landmark className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-200 group-hover:text-white">
                              ITR Filing Simulator
                            </div>
                            <div className="text-[10px] text-slate-400">
                              New (₹75k deduction) vs Old Regime
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                      </div>

                      {/* SIP link */}
                      <div
                        onClick={() => setActiveTab('sip')}
                        className="p-2.5 rounded-xl bg-[#12141c] hover:bg-[#1a1f2b] border border-slate-800/80 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                            <TrendingUp className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-200 group-hover:text-white">
                              SIP & Mutual Fund Calculator
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Compounding, Step-Up & Inflation
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                      </div>

                      {/* Loan EMI link */}
                      <div
                        onClick={() => setActiveTab('loan')}
                        className="p-2.5 rounded-xl bg-[#12141c] hover:bg-[#1a1f2b] border border-slate-800/80 cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-pink-950/60 text-pink-400 border border-pink-800/40">
                            <PiggyBank className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-200 group-hover:text-white">
                              Loan EMI & Amortization
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Home, Car & Personal loan schedules
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    Calculated using standard RBI & Indian Income Tax rules.
                  </div>
                </div>

                {/* BENTO CARD 3: Statutory Thresholds & Filing Calendar */}
                <div className="rounded-2xl p-5 bg-[#171b24] border border-slate-800/90 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Key Statutory Thresholds
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        FY 2025-26
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#12141c] border border-slate-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-[11px]">GST Registration Limit</span>
                          <span className="font-bold text-white">₹40L / ₹20L</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          ₹40 Lakhs for Goods (normal states); ₹20 Lakhs for Services & Special Category states.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#12141c] border border-slate-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-[11px]">Composition Scheme</span>
                          <span className="font-bold text-white">₹1.50 Crore</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          1% for manufacturers/traders, 5% for restaurants, 6% for service providers (₹50L cap).
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#12141c] border border-slate-800/80">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-[11px]">Mandatory E-Invoicing</span>
                          <span className="font-bold text-white">₹5.00 Crore</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Required for any B2B supply whose aggregate turnover exceeded ₹5 Crore in any preceding year.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Due dates: GSTR-1 (11th), 3B (20th)</span>
                    <button
                      onClick={() => setActiveTab('council')}
                      className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <span>Council Circulars</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* SAVED AUDITS QUICK STRIP (If user has saved audits) */}
              {savedAudits.length > 0 && (
                <div className="rounded-2xl p-4 sm:p-5 bg-[#171b24] border border-slate-800/90">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Recent Saved Computations ({savedAudits.length})
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>View All Records</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedAudits.slice(0, 3).map((audit) => (
                      <div
                        key={audit.id}
                        className="p-3 rounded-xl bg-[#12141c] border border-slate-800 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-200 truncate">{audit.product || audit.query}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            HSN {audit.hsnSac} • {audit.rate}% GST • {audit.transactionType}
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Total Bill:</span>
                          <span className="font-bold text-white font-mono">
                            ₹{audit.finalAmount?.toLocaleString('en-IN') || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 2. DEDICATED GST TAX CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="animate-in fade-in duration-150">
              <AllInOneCalculator
                supplierState={supplierState}
                setSupplierState={setSupplierState}
                customerState={customerState}
                setCustomerState={setCustomerState}
                onAddToInvoice={handleAddToInvoice}
                onSaveAudit={handleSaveAudit}
                onSwitchToAiSearch={(q) => {
                  setTopSearchTerm(q);
                  setActiveTab('overview');
                }}
              />
            </div>
          )}

          {/* 3. TAX INVOICE BUILDER */}
          {activeTab === 'invoice' && (
            <div className="animate-in fade-in duration-150">
              <InvoiceBuilder
                items={invoiceItems}
                setItems={setInvoiceItems}
                supplierState={supplierState}
                setSupplierState={setSupplierState}
                customerState={customerState}
                setCustomerState={setCustomerState}
              />
            </div>
          )}

          {/* 4. HSN / SAC EXPLORER */}
          {activeTab === 'explorer' && (
            <div className="animate-in fade-in duration-150">
              <HsnSacExplorer
                onSelectForCalculation={(item: GSTItem) => {
                  setActiveTab('calculator');
                }}
              />
            </div>
          )}

          {/* 5. GST COUNCIL BULLETINS */}
          {activeTab === 'council' && (
            <div className="animate-in fade-in duration-150">
              <GSTCouncilFeed />
            </div>
          )}

          {/* 6. ITR FILING SIMULATOR */}
          {activeTab === 'itr' && (
            <div className="animate-in fade-in duration-150">
              <ItrSimulator />
            </div>
          )}

          {/* 7. SIP & WEALTH CALCULATOR */}
          {activeTab === 'sip' && (
            <div className="animate-in fade-in duration-150">
              <SipCalculator />
            </div>
          )}

          {/* 8. LOAN EMI CALCULATOR */}
          {activeTab === 'loan' && (
            <div className="animate-in fade-in duration-150">
              <LoanEmiCalculator />
            </div>
          )}

          {/* 9. RATE GAZETTE HISTORY */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-150">
              <HistoricalLookupView
                onApplyHistoricalQuery={(query, date) => {
                  setActiveTab('calculator');
                }}
              />
            </div>
          )}

          {/* 10. SAVED AUDITS */}
          {activeTab === 'saved' && (
            <div className="animate-in fade-in duration-150">
              <SavedCalculationsView
                savedList={savedAudits}
                onDelete={handleDeleteAudit}
                onClearAll={handleClearAllAudits}
                onReload={(calc) => {
                  setActiveTab('calculator');
                }}
              />
            </div>
          )}

          {/* 11. COMPLIANCE HANDBOOK */}
          {activeTab === 'knowledge' && (
            <div className="animate-in fade-in duration-150">
              <KnowledgeGuideView />
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
