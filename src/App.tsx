import { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Calculator, 
  ReceiptText, 
  Search, 
  BellRing, 
  History, 
  BookmarkCheck, 
  BookOpen, 
  Store,
  ClipboardCheck,
  GraduationCap, 
  ArrowRightLeft,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Landmark,
  CreditCard,
  Wallet,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

import { IndianState, SavedCalculation, InvoiceLineItem, GSTItem, ClassifiedResult } from './types';
import { INDIAN_STATES, DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from './data/indianStates';
import { SmartInputHero } from './components/SmartInputHero';
import { SmartResultCard } from './components/SmartResultCard';
import { classifyProductOrService } from './services/classificationService';

// Route-level code splitting: heavy tab views (notably the invoice studio with
// jspdf/html2canvas) load on demand so first paint stays lean.
const AllInOneCalculator = lazy(() => import('./components/AllInOneCalculator').then(m => ({ default: m.AllInOneCalculator })));
const InvoiceBuilder = lazy(() => import('./components/InvoiceBuilder').then(m => ({ default: m.InvoiceBuilder })));
const HsnSacExplorer = lazy(() => import('./components/HsnSacExplorer').then(m => ({ default: m.HsnSacExplorer })));
const BusinessHub = lazy(() => import('./components/BusinessHub').then(m => ({ default: m.BusinessHub })));
const ComplianceKit = lazy(() => import('./components/ComplianceKit').then(m => ({ default: m.ComplianceKit })));
const GstAcademy = lazy(() => import('./components/Academy').then(m => ({ default: m.GstAcademy })));
const GSTCouncilFeed = lazy(() => import('./components/GSTCouncilFeed').then(m => ({ default: m.GSTCouncilFeed })));
const HistoricalLookupView = lazy(() => import('./components/HistoricalLookupView').then(m => ({ default: m.HistoricalLookupView })));
const SavedCalculationsView = lazy(() => import('./components/SavedCalculationsView').then(m => ({ default: m.SavedCalculationsView })));
const KnowledgeGuideView = lazy(() => import('./components/KnowledgeGuideView').then(m => ({ default: m.KnowledgeGuideView })));
const ItrSimulator = lazy(() => import('./components/ItrSimulator').then(m => ({ default: m.ItrSimulator })));
const SipCalculator = lazy(() => import('./components/SipCalculator').then(m => ({ default: m.SipCalculator })));
const LoanEmiCalculator = lazy(() => import('./components/LoanEmiCalculator').then(m => ({ default: m.LoanEmiCalculator })));
const WealthToolsHub = lazy(() => import('./components/WealthTools').then(m => ({ default: m.WealthToolsHub })));

function ViewFallback() {
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in" aria-label="Loading view" role="status">
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm space-y-3">
        <div className="skeleton-bar w-1/3" />
        <div className="skeleton-bar w-2/3" />
        <div className="skeleton-bar w-1/2" />
      </div>
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm space-y-3">
        <div className="skeleton-bar w-1/2" />
        <div className="skeleton-bar w-3/4" />
      </div>
    </div>
  );
}

export type NavTab = 
  | 'overview' 
  | 'calculator' 
  | 'invoice' 
  | 'explorer' 
  | 'business'
  | 'compliance'
  | 'council' 
  | 'itr' 
  | 'sip' 
  | 'loan' 
  | 'wealth'
  | 'history' 
  | 'saved' 
  | 'knowledge'
  | 'academy';

export default function App() {
  // Theme: Obsidian (Dark Glass default) vs Crystal (Light Studio Frosted)
  const [theme, setTheme] = useState<'crystal' | 'obsidian'>(() => {
    try {
      const saved = localStorage.getItem('smart_gst_theme');
      if (saved === 'obsidian' || saved === 'crystal') return saved;
    } catch {}
    return 'obsidian';
  });

  useEffect(() => {
    try {
      localStorage.setItem('smart_gst_theme', theme);
    } catch {}
    if (theme === 'obsidian') {
      document.documentElement.classList.add('theme-obsidian');
      document.documentElement.classList.remove('theme-crystal');
    } else {
      document.documentElement.classList.add('theme-crystal');
      document.documentElement.classList.remove('theme-obsidian');
    }
  }, [theme]);

  const isDark = theme === 'obsidian';

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keep the document title in sync with the visible view
  useEffect(() => {
    const titles: Record<NavTab, string> = {
      overview: 'GST Intelligence',
      calculator: 'GST Calculator',
      invoice: 'Tax Invoice Builder',
      explorer: 'HSN / SAC Directory',
      business: 'Business Counter',
      compliance: 'Compliance Kit',
      council: 'GST Council Bulletins',
      itr: 'ITR Filing Simulator',
      sip: 'SIP & Mutual Fund Calculator',
      loan: 'Loan EMI Calculator',
      wealth: 'Savings & Tax Tools',
      history: 'Rate Gazette History',
      saved: 'Saved Calculations',
      knowledge: 'Compliance Handbook',
      academy: 'GST Academy',
    };
    document.title = `${titles[activeTab]} — Maa Rupayee`;
  }, [activeTab]);
  
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

  // Invoice items state (persisted — survives reloads and syncs across tabs)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceLineItem[]>(() => {
    try {
      const stored = localStorage.getItem('smart_gst_invoice_items');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(i => i && typeof i === 'object' && typeof (i as InvoiceLineItem).id === 'string')) {
          return parsed as InvoiceLineItem[];
        }
      }
    } catch {
      // fallback to seed items
    }
    return [
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
    ];
  });

  // Saved Audits (localStorage)
  const [savedAudits, setSavedAudits] = useState<SavedCalculation[]>(() => {
    try {
      const stored = localStorage.getItem('smart_gst_audits');
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as SavedCalculation[];
      }
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

  useEffect(() => {
    try {
      localStorage.setItem('smart_gst_invoice_items', JSON.stringify(invoiceItems));
    } catch {
      // handle storage quota
    }
  }, [invoiceItems]);

  // Cross-tab data synchronization: theme, audits, and invoice stay
  // consistent when the app is open in multiple tabs/windows.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      try {
        if (e.key === 'smart_gst_theme' && (e.newValue === 'crystal' || e.newValue === 'obsidian')) {
          setTheme(e.newValue);
        } else if (e.key === 'smart_gst_audits' && e.newValue) {
          const parsed: unknown = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setSavedAudits(parsed as SavedCalculation[]);
        } else if (e.key === 'smart_gst_invoice_items' && e.newValue) {
          const parsed: unknown = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setInvoiceItems(parsed as InvoiceLineItem[]);
        }
      } catch {
        // ignore malformed cross-tab payloads
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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

  // Dynamic navigation class helpers for pristine contrast in both modes
  const getNavItemClass = (tab: NavTab) => {
    const isActive = activeTab === tab;
    if (isDark) {
      return isActive 
        ? 'bg-white text-black shadow-md font-bold' 
        : 'text-zinc-400 hover:text-white hover:bg-white/5 font-medium';
    } else {
      return isActive 
        ? 'bg-zinc-950 text-white shadow-sm font-bold' 
        : 'text-zinc-700 hover:text-zinc-950 hover:bg-black/5 font-medium';
    }
  };

  const getNavIconClass = (tab: NavTab) => {
    const isActive = activeTab === tab;
    if (isDark) {
      return isActive ? 'text-black' : 'text-zinc-400';
    } else {
      return isActive ? 'text-white' : 'text-zinc-700';
    }
  };

  // Theme-aware ink & surfaces for Overview cards — guaranteed correct ink on
  // glass in both Crystal (light) and Obsidian (dark), including hovers.
  const inkHeading = isDark ? 'text-white' : 'text-zinc-950';
  const inkTitle = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const inkBody = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const surfTile = isDark
    ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25'
    : 'bg-zinc-950/[0.045] hover:bg-zinc-950/[0.08] border-zinc-950/10 hover:border-zinc-950/20';
  const surfBadge = isDark
    ? 'text-white border-white/20 bg-white/5'
    : 'text-zinc-800 border-zinc-950/15 bg-zinc-950/5';
  const lineDivide = isDark ? 'border-white/10' : 'border-zinc-950/10';
  const arrowTone = isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-500 group-hover:text-zinc-950';

  return (
    <div className={`min-h-screen relative py-3 sm:py-6 px-2 sm:px-5 lg:px-8 font-sans overflow-x-hidden ${
      isDark 
        ? 'bg-[#060709] text-white theme-obsidian selection:bg-white selection:text-black' 
        : 'bg-[#eef2f7] text-zinc-950 theme-crystal selection:bg-zinc-950 selection:text-white'
    }`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-zinc-950 focus:text-white focus:text-xs focus:font-bold"
      >
        Skip to main content
      </a>
      
      {/* Subtle Monochrome Ambient Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className={`absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full blur-[150px] ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`} />
        <div className={`absolute bottom-10 left-1/4 w-[500px] h-[350px] rounded-full blur-[130px] ${isDark ? 'bg-white/[0.015]' : 'bg-black/[0.015]'}`} />
      </div>

      {/* Master Monochrome Glass Container */}
      <div className={`glass-container relative z-10 max-w-[1400px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl ${
        isDark ? 'border-white/12' : 'border-white/90'
      }`}>
        
        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION (Pure Monochrome)                      */}
        {/* ========================================================= */}
        <aside aria-label="Site Navigation" className={`glass-sidebar w-full md:w-64 lg:w-72 border-b md:border-b-0 flex flex-col justify-between shrink-0 ${
          isDark ? 'border-white/10' : 'border-zinc-200/80'
        }`}>
          
          <div className="p-4 sm:p-5">
            {/* Brand Logo & Tagline */}
            <div 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 cursor-pointer group mb-6 px-1"
            >
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-md transition-transform group-hover:scale-105 active:scale-95 ${
                isDark ? 'bg-white text-black' : 'bg-zinc-950 text-white'
              }`}>
                ₹
              </div>
              <div>
                <div className={`font-black text-sm sm:text-base tracking-tight flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                  <span>Maa Rupayee</span>
                </div>
                <div className={`text-[10px] font-medium leading-tight max-w-[170px] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Simple tools for GST, Tax & Personal Finance
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className={`md:hidden flex items-center justify-between pb-3 mb-3 border-b ${isDark ? 'border-white/10' : 'border-zinc-200/80'}`}>
              <span className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Menu • <span className={`capitalize font-bold ${isDark ? 'text-white' : 'text-zinc-950'}`}>{activeTab}</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl cursor-pointer ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>

            {/* Navigation Sections */}
            <nav className={`space-y-5 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
              
              {/* TIER 1: GST CALCULATION (doing) */}
              <div role="group" aria-label="GST Calculation tools">
                <div className={`text-[10px] font-bold tracking-wider mb-2 px-2 uppercase flex items-center justify-between ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  <span>GST Calculation</span>
                  <span className="font-mono font-bold">6</span>
                </div>
                <div className="space-y-1">
                  
                  {/* GST Intelligence */}
                  <button
                    onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('overview')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className={`h-4 w-4 ${getNavIconClass('overview')}`} />
                      <span>GST Intelligence</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'overview'
                        ? (isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                        : (isDark ? 'bg-white/10 text-zinc-300 border border-white/10' : 'bg-zinc-200 text-zinc-800')
                    }`}>
                      AI
                    </span>
                  </button>

                  {/* All-in-One Calculator */}
                  <button
                    onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('calculator')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calculator className={`h-4 w-4 ${getNavIconClass('calculator')}`} />
                      <span>GST Calculator</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">Fwd/Rev</span>
                  </button>

                  {/* Tax Invoice Builder */}
                  <button
                    onClick={() => { setActiveTab('invoice'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('invoice')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ReceiptText className={`h-4 w-4 ${getNavIconClass('invoice')}`} />
                      <span>Tax Invoice Builder</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      activeTab === 'invoice' 
                        ? (isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white') 
                        : (isDark ? 'bg-white/10 text-zinc-300' : 'bg-zinc-200 text-zinc-800')
                    }`}>
                      {invoiceItems.length}
                    </span>
                  </button>

                  {/* HSN/SAC Explorer */}
                  <button
                    onClick={() => { setActiveTab('explorer'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('explorer')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className={`h-4 w-4 ${getNavIconClass('explorer')}`} />
                      <span>HSN / SAC Directory</span>
                    </div>
                  </button>

                  {/* Business Counter */}
                  <button
                    onClick={() => { setActiveTab('business'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('business')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Store className={`h-4 w-4 ${getNavIconClass('business')}`} />
                      <span>Business Counter</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'business'
                        ? (isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                        : (isDark ? 'bg-white/10 text-zinc-300 border border-white/10' : 'bg-zinc-200 text-zinc-800')
                    }`}>
                      Every Trade
                    </span>
                  </button>

                  {/* Compliance Kit */}
                  <button
                    onClick={() => { setActiveTab('compliance'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('compliance')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ClipboardCheck className={`h-4 w-4 ${getNavIconClass('compliance')}`} />
                      <span>Compliance Kit</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'compliance'
                        ? (isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                        : (isDark ? 'bg-white/10 text-zinc-300 border border-white/10' : 'bg-zinc-200 text-zinc-800')
                    }`}>
                      4-in-1
                    </span>
                  </button>

                </div>
              </div>

              {/* TIER 2: TAX & SAVINGS (personal money) */}
              <div role="group" aria-label="Tax and savings tools" className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-zinc-200/80'}`}>
                <div className={`text-[10px] font-bold tracking-wider mb-2 px-2 uppercase flex items-center justify-between ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  <span>Tax & Savings</span>
                  <span className="font-mono font-bold">4</span>
                </div>
                <div className="space-y-1">
                  
                  {/* ITR Simulator */}
                  <button
                    onClick={() => { setActiveTab('itr'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('itr')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Landmark className={`h-4 w-4 ${getNavIconClass('itr')}`} />
                      <span>ITR Filing Simulator</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      isDark ? 'bg-white/10 text-zinc-300' : 'bg-zinc-200 text-zinc-800'
                    }`}>
                      FY 25-26
                    </span>
                  </button>

                  {/* SIP & Wealth Calculator */}
                  <button
                    onClick={() => { setActiveTab('sip'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('sip')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className={`h-4 w-4 ${getNavIconClass('sip')}`} />
                      <span>SIP & Mutual Funds</span>
                    </div>
                  </button>

                  {/* Loan EMI Calculator */}
                  <button
                    onClick={() => { setActiveTab('loan'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('loan')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className={`h-4 w-4 ${getNavIconClass('loan')}`} />
                      <span>Loan EMI & Interest</span>
                    </div>
                  </button>

                  {/* Savings & Tax Tools Hub */}
                  <button
                    onClick={() => { setActiveTab('wealth'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('wealth')}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Wallet className={`h-4 w-4 ${getNavIconClass('wealth')}`} />
                      <span>Savings & Tax Tools</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'wealth'
                        ? (isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                        : (isDark ? 'bg-white/10 text-zinc-300 border border-white/10' : 'bg-zinc-200 text-zinc-800')
                    }`}>
                      5-in-1
                    </span>
                  </button>

                </div>
              </div>

              {/* TIER 3: LAW & UPDATES (reading & reference) */}
              <div role="group" aria-label="Law and updates" className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-zinc-200/80'}`}>
                <div className={`text-[10px] font-bold tracking-wider mb-2 px-2 uppercase flex items-center justify-between ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  <span>Law & Updates</span>
                  <span className="font-mono font-bold">4</span>
                </div>
                <div className="space-y-1">

                  {/* Council Updates */}
                  <button
                    onClick={() => { setActiveTab('council'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('council')}`}
                  >
                    <div className="flex items-center gap-2">
                      <BellRing className={`h-3.5 w-3.5 ${getNavIconClass('council')}`} />
                      <span>Council Bulletins</span>
                    </div>
                    <span className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-white' : 'bg-zinc-950'}`}></span>
                  </button>

                  {/* Rate History */}
                  <button
                    onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('history')}`}
                  >
                    <div className="flex items-center gap-2">
                      <History className={`h-3.5 w-3.5 ${getNavIconClass('history')}`} />
                      <span>Rate Gazette History</span>
                    </div>
                  </button>

                  {/* Knowledge Guide */}
                  <button
                    onClick={() => { setActiveTab('knowledge'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('knowledge')}`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className={`h-3.5 w-3.5 ${getNavIconClass('knowledge')}`} />
                      <span>Compliance Handbook</span>
                    </div>
                  </button>

                  {/* GST Academy */}
                  <button
                    onClick={() => { setActiveTab('academy'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('academy')}`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className={`h-3.5 w-3.5 ${getNavIconClass('academy')}`} />
                      <span>GST Academy</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'academy'
                        ? (isDark ? 'bg-black/10 text-black' : 'bg-white/20 text-white')
                        : (isDark ? 'bg-white/10 text-zinc-300 border border-white/10' : 'bg-zinc-200 text-zinc-800')
                    }`}>
                      Free Course
                    </span>
                  </button>

                </div>
              </div>

              {/* TIER 4: YOUR RECORDS (personal data) */}
              <div role="group" aria-label="Your records" className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-zinc-200/80'}`}>
                <div className={`text-[10px] font-bold tracking-wider mb-2 px-2 uppercase flex items-center justify-between ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  <span>Your Records</span>
                  <span className="font-mono font-bold">1</span>
                </div>
                <div className="space-y-1">
                  
                  {/* Saved Audits */}
                  <button
                    onClick={() => { setActiveTab('saved'); setMobileMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${getNavItemClass('saved')}`}
                  >
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className={`h-3.5 w-3.5 ${getNavIconClass('saved')}`} />
                      <span>Saved Calculations</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold leading-relaxed ${
                      isDark ? 'bg-white/10 text-zinc-300' : 'bg-zinc-200 text-zinc-800'
                    }`}>
                      {savedAudits.length}
                    </span>
                  </button>

                </div>
              </div>

            </nav>
          </div>

          {/* Footer Badge: Trust & Transparency */}
          <div className={`p-4 border-t text-[11px] flex flex-col gap-1.5 ${
            isDark ? 'border-white/10 bg-black/40 text-zinc-400' : 'border-zinc-200/80 bg-zinc-100/60 text-zinc-600'
          }`}>
            <div className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-900'}`}>
              <ShieldCheck className={`h-3.5 w-3.5 ${isDark ? 'text-white' : 'text-zinc-950'}`} />
              <span>100% Free • No Login Required</span>
            </div>
            <p className="text-[10px] leading-tight">
              Grounded in official CBIC GST schedules & Indian Income Tax Act.
            </p>
          </div>

        </aside>

        {/* ========================================================= */}
        {/* MAIN APPLICATION CANVAS                                   */}
        {/* ========================================================= */}
        <main id="main-content" className={`flex-1 flex flex-col min-w-0 p-3 sm:p-6 lg:p-7 overflow-x-hidden ${isDark ? 'bg-black/20' : 'bg-white/20'}`}>
          
          {/* TOP GLOBAL HEADER (Monochrome) */}
          <header className={`flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b ${
            isDark ? 'border-white/10' : 'border-zinc-200/80'
          }`}>
            
            {/* Left: Active Route / Intra vs Inter State indicator */}
            <div className="flex items-center gap-2">
              <div className={`glass-pill px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 border ${
                isDark ? 'border-white/15' : 'border-zinc-200/90'
              }`}>
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600 font-medium'}>Transaction Route:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                  isDark ? 'text-white bg-white/10 border border-white/20' : 'text-zinc-950 bg-white border border-zinc-200 shadow-2xs'
                }`}>
                  {isIntraState ? `Intra-State (${supplierState.code} CGST + SGST)` : `Inter-State (${supplierState.code} → ${customerState.code} IGST)`}
                </span>
              </div>
            </div>

            {/* Right: State Selectors, Status & Theme Switcher */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className={`glass-pill flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border ${
                isDark ? 'border-white/15' : 'border-zinc-200/90'
              }`}>
                <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-600 font-medium'}`}>From:</span>
                <select
                  aria-label="Supplier State"
                  value={supplierState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setSupplierState(found);
                  }}
                  className={`bg-transparent font-bold focus:outline-none cursor-pointer pr-1 ${
                    isDark ? 'text-white' : 'text-zinc-950'
                  }`}
                >
                  {INDIAN_STATES.map(s => (
                    <option key={`sup-${s.code}`} value={s.code} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-950'}>
                      {s.name} ({s.tin})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSwapStates}
                  title="Swap Supplier and Customer State"
                  className={`p-1 rounded-full transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </button>

                <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-600 font-medium'}`}>To:</span>
                <select
                  aria-label="Customer State"
                  value={customerState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setCustomerState(found);
                  }}
                  className={`bg-transparent font-bold focus:outline-none cursor-pointer ${
                    isDark ? 'text-white' : 'text-zinc-950'
                  }`}
                >
                  {INDIAN_STATES.map(s => (
                    <option key={`cust-${s.code}`} value={s.code} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-950'}>
                      {s.name} ({s.tin})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status indicator */}
              <div className={`glass-pill hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${
                isDark ? 'border-white/15 text-zinc-300' : 'border-zinc-200/90 text-zinc-800'
              }`}>
                <span className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-white' : 'bg-zinc-950'}`}></span>
                <span className="text-[11px] font-semibold">CBIC 2026 Ready</span>
              </div>

              {/* Theme Switcher (iOS Segmented Control: Crystal vs Obsidian) */}
              <div className="flex items-center p-1 rounded-full ios-segment" role="group" aria-label="Appearance">
                <button
                  type="button"
                  onClick={() => setTheme('crystal')}
                  aria-pressed={!isDark}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    !isDark
                      ? 'ios-segment-thumb text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Switch to Crystal Frosted Studio mode"
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-[11px]">Crystal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('obsidian')}
                  aria-pressed={isDark}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'ios-segment-thumb text-white'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                  title="Switch to Obsidian Night mode"
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline text-[11px]">Obsidian</span>
                </button>
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
                    <div className={`flex items-center gap-2 text-xs font-bold leading-relaxed ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                      <Sparkles className={`h-4 w-4 animate-pulse ${isDark ? 'text-white' : 'text-zinc-950'}`} />
                      <span>Statutory Classification & Tax Breakdown</span>
                    </div>
                    <button
                      onClick={() => setActiveClassifiedResult(null)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border leading-relaxed ${isDark ? 'bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border-white/10' : 'bg-zinc-950 hover:bg-zinc-800 text-white border-zinc-950'}`}
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

              {/* CLEAN, FOCUSED FINANCIAL BENTO GRID (Monochrome) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
                
                {/* BENTO CARD 1: Indian GST Rate Slabs */}
                <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${inkTitle}`}>
                        Statutory GST Slabs
                      </span>
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${surfBadge}`}>
                        CBIC Schedule
                      </span>
                    </div>
                    <p className={`text-xs mb-4 leading-relaxed ${inkBody}`}>
                      GST 2.0 slabs w.e.f. 22-09-2025 (12% & 28% merged into 5% / 18%, plus 40% demerit):
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {[
                        { rate: '0%', label: 'Exempt / Grains', desc: 'Fresh milk, unbranded grains' },
                        { rate: '0.25%', label: 'Special Goods', desc: 'Rough diamonds, precious stones' },
                        { rate: '3%', label: 'Precious Metals', desc: 'Gold, silver, jewellery' },
                        { rate: '5%', label: 'Essentials', desc: 'Edible oil, tea, butter, medicines' },
                        { rate: '18%', label: 'Standard', desc: 'IT services, small cars, cement' },
                        { rate: '40%', label: 'Sin & Luxury', desc: 'Tobacco, big cars, aerated drinks' },
                      ].map((slab) => (
                        <button
                          key={slab.rate}
                          type="button"
                          onClick={() => handleQuickSlabTest(parseFloat(slab.rate), slab.label)}
                          aria-label={`Test ${slab.rate} GST slab for ${slab.label}`}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all group text-left w-full ${surfTile}`}
                        >
                          <div className={`font-extrabold text-sm transition-colors ${inkHeading}`}>
                            {slab.rate}
                          </div>
                          <div className={`text-[10px] font-semibold truncate ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                            {slab.label}
                          </div>
                          <div className={`text-[9px] truncate mt-0.5 ${inkBody}`}>
                            {slab.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${lineDivide}`}>
                    <span className={`text-[11px] ${inkBody}`}>Forward & Reverse Supported</span>
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className={`hover:underline font-semibold text-[11px] flex items-center gap-1 cursor-pointer ${inkHeading}`}
                    >
                      <span>Custom Calculator</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* BENTO CARD 2: Direct Tax & Financial Utilities Hub */}
                <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${inkTitle}`}>
                        Personal Tax & Wealth
                      </span>
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${surfBadge}`}>
                        Free Utilities
                      </span>
                    </div>
                    <p className={`text-xs mb-3 leading-relaxed ${inkBody}`}>
                      Instant simulators for salary income tax, mutual fund wealth creation, and loan borrowing:
                    </p>

                    <div className="space-y-2">
                      {[
                        { tab: 'itr' as NavTab, Icon: Landmark, title: 'ITR Filing Simulator', sub: 'New (₹75k deduction) vs Old Regime' },
                        { tab: 'sip' as NavTab, Icon: TrendingUp, title: 'SIP & Mutual Fund Calculator', sub: 'Compounding, Step-Up & Inflation' },
                        { tab: 'loan' as NavTab, Icon: CreditCard, title: 'Loan EMI & Amortization', sub: 'Home, Car & Personal loan schedules' },
                        { tab: 'wealth' as NavTab, Icon: Wallet, title: 'Savings & Tax Tools', sub: 'PPF, Gratuity, HRA, FD/RD, NPS' },
                      ].map(({ tab, Icon, title, sub }) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`w-full p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group text-left ${surfTile}`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="icon-tile">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span>
                              <span className={`block font-semibold text-xs ${inkHeading}`}>
                                {title}
                              </span>
                              <span className={`block text-[10px] ${inkBody}`}>
                                {sub}
                              </span>
                            </span>
                          </span>
                          <ArrowRight className={`h-3.5 w-3.5 ${arrowTone}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-[11px] ${lineDivide} ${inkBody}`}>
                    Calculated using standard RBI & Indian Income Tax rules.
                  </div>
                </div>

                {/* BENTO CARD 3: Statutory Thresholds & Filing Calendar */}
                <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${inkTitle}`}>
                        Key Statutory Thresholds
                      </span>
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${surfBadge}`}>
                        FY 2025-26
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {[
                        { label: 'GST Registration Limit', value: '₹40L / ₹20L', desc: '₹40 Lakhs for Goods (normal states); ₹20 Lakhs for Services & Special Category states.' },
                        { label: 'Composition Scheme', value: '₹1.50 Crore', desc: '1% for manufacturers/traders, 5% for restaurants, 6% for service providers (₹50L cap).' },
                        { label: 'Mandatory E-Invoicing', value: '₹5.00 Crore', desc: 'Required for any B2B supply whose aggregate turnover exceeded ₹5 Crore in any preceding year.' },
                      ].map((row) => (
                        <div key={row.label} className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-950/[0.04] border-zinc-950/10'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[11px] ${inkBody}`}>{row.label}</span>
                            <span className={`font-bold ${inkHeading}`}>{row.value}</span>
                          </div>
                          <p className={`text-[10px] ${inkBody}`}>
                            {row.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${lineDivide}`}>
                    <span className={`text-[11px] ${inkBody}`}>Due dates: GSTR-1 (11th), 3B (20th)</span>
                    <button
                      onClick={() => setActiveTab('council')}
                      className={`hover:underline font-semibold text-[11px] flex items-center gap-1 cursor-pointer ${inkHeading}`}
                    >
                      <span>Council Circulars</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>

              {/* SAVED AUDITS QUICK STRIP (If user has saved audits) */}
              {savedAudits.length > 0 && (
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className={`h-4 w-4 ${inkHeading}`} />
                      <h2 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        Recent Saved Computations ({savedAudits.length})
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className={`text-xs hover:underline font-semibold flex items-center gap-1 cursor-pointer ${inkHeading}`}
                    >
                      <span>View All Records</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedAudits.slice(0, 3).map((audit) => (
                      <div
                        key={audit.id}
                        className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-950/[0.04] border-zinc-950/10'}`}
                      >
                        <div>
                          <div className={`font-semibold truncate ${inkHeading}`}>{audit.product || audit.query}</div>
                          <div className={`text-[10px] mt-0.5 ${inkBody}`}>
                            HSN {audit.hsnSac} • {audit.rate}% GST • {audit.transactionType}
                          </div>
                        </div>
                        <div className={`mt-2 pt-2 border-t flex items-center justify-between ${lineDivide}`}>
                          <span className={`text-[11px] ${inkBody}`}>Total Bill:</span>
                          <span className={`font-bold font-mono ${inkHeading}`}>
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
          <Suspense fallback={activeTab === 'overview' ? null : <ViewFallback />}>
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

          {/* 4b. BUSINESS COUNTER (EVERY TRADE) */}
          {activeTab === 'business' && (
            <div className="animate-in fade-in duration-150">
              <BusinessHub
                isClassifying={isClassifying}
                onTryExample={(q) => handleSmartSearch(q, transactionDate)}
                onOpenCalculator={() => setActiveTab('calculator')}
              />
            </div>
          )}

          {/* 4c. COMPLIANCE KIT */}
          {activeTab === 'compliance' && (
            <div className="animate-in fade-in duration-150">
              <ComplianceKit />
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

          {/* 8b. SAVINGS & TAX TOOLS HUB */}
          {activeTab === 'wealth' && (
            <div className="animate-in fade-in duration-150">
              <WealthToolsHub />
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

          {/* 12. GST ACADEMY */}
          {activeTab === 'academy' && (
            <div className="animate-in fade-in duration-150">
              <GstAcademy />
            </div>
          )}
          </Suspense>

        </main>

      </div>

    </div>
  );
}
