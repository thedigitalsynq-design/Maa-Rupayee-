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
  Folder,
  Sun,
  Moon,
  Plus,
  ArrowUpRight,
  Phone,
  MessageSquare,
  Clock,
  Calendar,
  Send,
  Lock,
  Layers,
  CheckCircle2,
  TrendingUp,
  X,
  Mic,
  Settings,
  LogOut,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

import { IndianState, SavedCalculation, InvoiceLineItem, GSTItem } from './types';
import { INDIAN_STATES, DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from './data/indianStates';
import { AllInOneCalculator } from './components/AllInOneCalculator';
import { InvoiceBuilder } from './components/InvoiceBuilder';
import { HsnSacExplorer } from './components/HsnSacExplorer';
import { GSTCouncilFeed } from './components/GSTCouncilFeed';
import { HistoricalLookupView } from './components/HistoricalLookupView';
import { SavedCalculationsView } from './components/SavedCalculationsView';
import { KnowledgeGuideView } from './components/KnowledgeGuideView';
import { SmartInputHero } from './components/SmartInputHero';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'invoice' | 'explorer' | 'council' | 'history' | 'saved' | 'knowledge'>('overview');
  
  // States
  const [supplierState, setSupplierState] = useState<IndianState>(DEFAULT_SUPPLIER_STATE);
  const [customerState, setCustomerState] = useState<IndianState>(DEFAULT_CUSTOMER_STATE);
  const isDarkMode = true;
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [topSearchTerm, setTopSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<'Prototype' | 'Wireframe' | 'Branding' | 'UI/UX'>('Branding');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(12);
  const [selectedProject, setSelectedProject] = useState('Garnaco Project');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [selectedClientDetail, setSelectedClientDetail] = useState<any | null>(null);
  
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
      description: 'Dell Precision Workstations (Dual Display)',
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
        query: 'Samsung 55-inch Commercial Display ₹78,000',
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

  const handleSaveAudit = (auditData: {
    query: string;
    product: string;
    hsnSac: string;
    rate: number;
    supplierState: string;
    customerState: string;
    transactionType: any;
    taxableValue: number;
    gstAmount: number;
    finalAmount: number;
  }) => {
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

  const handleAddToInvoice = (item: {
    description: string;
    hsnSac: string;
    type: 'GOODS' | 'SERVICES';
    taxableAmount: number;
    gstRate: number;
    cessRate: number;
    cgstAmount: number;
    sgstAmount: number;
    utgstAmount: number;
    igstAmount: number;
    cessAmount: number;
    totalAmount: number;
  }) => {
    const newItem: InvoiceLineItem = {
      id: 'item-' + Date.now(),
      description: item.description,
      hsnSac: item.hsnSac,
      type: item.type,
      quantity: 1,
      unit: item.type === 'GOODS' ? 'Pcs' : 'Service',
      unitPrice: item.taxableAmount,
      discountPercent: 0,
      taxableAmount: item.taxableAmount,
      gstRate: item.gstRate,
      cessRate: item.cessRate,
      cgstAmount: item.cgstAmount,
      sgstAmount: item.sgstAmount,
      utgstAmount: item.utgstAmount,
      igstAmount: item.igstAmount,
      cessAmount: item.cessAmount,
      totalAmount: item.totalAmount
    };
    setInvoiceItems(prev => [...prev, newItem]);
    setActiveTab('invoice');
  };

  // Team & Clients sample data
  const clientsList = [
    { id: 'c1', name: 'Petrick Evaa', role: '1 Task handled', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', phone: '+91 98201 44512', gstin: '27AABCT3518Q1ZY' },
    { id: 'c2', name: 'Tasya Farasya', role: '3 Task handled', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', phone: '+91 98112 88471', gstin: '07AAACA1299P1ZL' },
    { id: 'c3', name: 'Immanuel Yosse', role: '3 Task handled', initials: 'Y', bg: 'bg-[#26282e]', phone: '+91 99402 77123', gstin: '29AABCS8891M1ZD' },
    { id: 'c4', name: 'Dayat Comeback', role: '5 Task handled', initials: 'D', bg: 'bg-[#18191f]', phone: '+91 97230 66019', gstin: '24AACCL5510R1ZP' },
  ];

  const filteredClients = clientsList.filter(c => 
    c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) || 
    c.gstin.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-4 sm:py-7 px-2 sm:px-6 bg-[#090b0e] text-slate-100">
      
      {/* Master Rounded Dashboard Canvas */}
      <div className="max-w-[1440px] mx-auto rounded-[28px] sm:rounded-[32px] overflow-hidden border border-slate-800/80 shadow-[0_16px_50px_rgba(0,0,0,0.6)] flex flex-col md:flex-row bg-[#13161f]">
        
        {/* ========================================================= */}
        {/* LEFT ICON RAIL & SIDEBAR NAVIGATION                        */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row border-b md:border-b-0 md:border-r border-slate-800/80">
          
          {/* Vertical Icon Rail (Iconic leftmost dock from theme) */}
          <aside aria-label="Quick Dock" className="w-full md:w-[72px] py-4 px-3 flex md:flex-col items-center justify-between md:justify-start gap-4 border-r border-slate-800/80 bg-[#0e1017]">
            
            {/* Logo: Concentric Maze / Swirl badge */}
            <button 
              onClick={() => setActiveTab('overview')}
              className="h-11 w-11 rounded-2xl bg-[#18191f] hover:bg-black text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 group"
              title="Smart GST India"
            >
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10"/>
                <path d="M12 6a6 6 0 0 0-6 6c0 3.31 2.69 6 6 6s6-2.69 6-6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </button>

            {/* Quick action squircle buttons with theme's signature color accents */}
            <div className="flex md:flex-col items-center gap-3">
              {/* Vibrant Orange Squircle */}
              <button 
                onClick={() => setActiveTab('calculator')}
                className={`h-10 w-10 rounded-2xl bg-[#ff5b35] hover:bg-[#ff451a] text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95 ${activeTab === 'calculator' ? 'ring-2 ring-[#ff5b35] ring-offset-2' : ''}`}
                title="GST Calculator"
              >
                ₹
              </button>

              {/* Cobalt Electric Blue Squircle */}
              <button 
                onClick={() => setActiveTab('invoice')}
                className={`h-10 w-10 rounded-2xl bg-[#2f66ee] hover:bg-[#1d52d9] text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95 ${activeTab === 'invoice' ? 'ring-2 ring-[#2f66ee] ring-offset-2' : ''}`}
                title="Tax Invoice Builder"
              >
                <FileText className="h-4 w-4" />
              </button>

              {/* Dark Charcoal Squircle */}
              <button 
                onClick={() => setActiveTab('explorer')}
                className={`h-10 w-10 rounded-2xl bg-[#1e2229] hover:bg-black text-white flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95 ${activeTab === 'explorer' ? 'ring-2 ring-[#1e2229] ring-offset-2' : ''}`}
                title="HSN/SAC Explorer"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Circle + Button */}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="h-8 w-8 rounded-full bg-[#18191f] hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xs"
                title="Quick Add Audit / Client"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Bottom Dock Controls */}
            <div className="hidden md:flex flex-col items-center gap-3 mt-auto pt-4">
              <button 
                onClick={() => setActiveTab('knowledge')}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Statutory Settings & Rules"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button 
                onClick={() => {
                  if (confirm('Reset workspace session to default state?')) {
                    localStorage.removeItem('smart_gst_audits');
                    window.location.reload();
                  }
                }}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Reset Session"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </aside>

          {/* Collapsible Sidebar Navigation Panel */}
          <div className={`w-full md:w-60 lg:w-64 p-5 flex flex-col justify-between ${isDarkMode ? 'bg-[#15181e]' : 'bg-[#f5f6fa]'}`}>
            <div>
              {/* Home Navigation Menu */}
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2.5 px-1 uppercase">
                Home
              </div>

              <div className="space-y-1.5">
                {/* Overview Pill Button (Active state in theme) */}
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-between shadow-xs ${
                    activeTab === 'overview'
                      ? 'bg-[#18191f] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4" />
                    <span>Overview</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>

                {/* Calculator Tab */}
                <button
                  onClick={() => setActiveTab('calculator')}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-between ${
                    activeTab === 'calculator'
                      ? 'bg-[#18191f] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calculator className="h-4 w-4" />
                    <span>Tax Calculator</span>
                  </div>
                </button>

                {/* Report Overview / Tax Invoices */}
                <button
                  onClick={() => setActiveTab('invoice')}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-between ${
                    activeTab === 'invoice'
                      ? 'bg-[#18191f] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4" />
                    <span>Report Overview</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
                    {invoiceItems.length}
                  </span>
                </button>

                {/* Manage Task / HSN Explorer */}
                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-between ${
                    activeTab === 'explorer'
                      ? 'bg-[#18191f] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Search className="h-4 w-4" />
                    <span>HSN/SAC Explorer</span>
                  </div>
                </button>

                {/* Compliance Settings */}
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-between ${
                    activeTab === 'knowledge'
                      ? 'bg-[#18191f] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4" />
                    <span>Compliance Guide</span>
                  </div>
                </button>
              </div>

              {/* Second Navigation Section: COMPLIANCE & AUDIT */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    Council & Audits
                  </span>
                  <button 
                    onClick={() => setActiveTab('council')} 
                    className="h-4 w-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-[10px]"
                    title="View Council Updates"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('council')}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'council'
                        ? 'bg-[#18191f] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BellRing className="h-3.5 w-3.5 text-amber-500" />
                      <span>Council Updates</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'history'
                        ? 'bg-[#18191f] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <History className="h-3.5 w-3.5 text-blue-500" />
                      <span>Rate History</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === 'saved'
                        ? 'bg-[#18191f] text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Saved Audits</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {savedAudits.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Promo Card Widget: "Get Premium Feature" with 3D Twisted Ribbon / Coil */}
            <div className="mt-6">
              <div className="relative rounded-2xl bg-white dark:bg-[#1c2028] p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Close X */}
                <button 
                  onClick={() => setShowPromoModal(false)}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* 3D Orange Twisted Ribbon Art Illustration */}
                <div className="w-full flex justify-center py-2">
                  <svg className="w-24 h-16 drop-shadow-md" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="coilGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff8a50" />
                        <stop offset="50%" stopColor="#ff5722" />
                        <stop offset="100%" stopColor="#e64a19" />
                      </linearGradient>
                      <linearGradient id="coilGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffab91" />
                        <stop offset="100%" stopColor="#ff5722" />
                      </linearGradient>
                    </defs>
                    {/* Twisted coil rings */}
                    <path d="M20 50 C20 20, 35 15, 45 35 C55 55, 65 60, 75 40 C85 20, 95 25, 100 45" stroke="url(#coilGrad1)" strokeWidth="12" strokeLinecap="round" />
                    <path d="M30 45 C35 25, 45 22, 55 42 C65 62, 75 50, 85 30" stroke="url(#coilGrad2)" strokeWidth="9" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Get Premium Feature
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">
                  Automatic CBIC Gazette webhook sync
                </div>

                <div className="flex items-center justify-between">
                  {/* Subscription Pill */}
                  <button 
                    onClick={() => alert('Smart GST India Pro: Full Gazette API & bulk invoicing unlocks soon!')}
                    className="px-3.5 py-1 rounded-full bg-[#2f66ee] hover:bg-[#2052db] text-white text-[11px] font-semibold transition-all active:scale-95 shadow-xs"
                  >
                    Subscribe
                  </button>
                  {/* Dots wave indicator */}
                  <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600 text-[9px]">
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                    <span>•</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN STAGE / CONTENT CANVAS                               */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-7 overflow-x-hidden">
          
          {/* TOP HEADER BAR (User profile, Oracle assistant, Search, Dark mode) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200/70 dark:border-slate-800">
            
            {/* Left: User Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                  alt="User Avatar"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-xs" 
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Hey, Jenny Junny
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500">
                  jennie.junny@gmail.com
                </div>
              </div>
            </div>

            {/* Middle: Oracle Assistant + Search Bar */}
            <div className="flex-1 max-w-xl mx-2 flex items-center gap-2">
              {/* Oracle Assistant pill button */}
              <button 
                onClick={() => setShowAssistantModal(true)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                <span>Oracle Assistant</span>
              </button>

              {/* Universal Search Input pill */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={topSearchTerm}
                  onChange={(e) => setTopSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && topSearchTerm.trim()) {
                      setActiveTab('calculator');
                    }
                  }}
                  placeholder="Search HSN, SAC, GSTIN, rates or bill amount..."
                  className="w-full py-1.5 pl-9 pr-3 text-xs bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            {/* Right: State Switcher, Folder, Bell & Light/Dark segmented toggle */}
            <div className="flex items-center gap-2">
              {/* Quick State Switcher Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[11px] shadow-xs">
                <span className="text-slate-400">From:</span>
                <select 
                  aria-label="Supplier State"
                  value={supplierState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setSupplierState(found);
                  }}
                  className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.code} className="dark:bg-slate-900">{s.name}</option>
                  ))}
                </select>
                
                <button 
                  onClick={handleSwapStates}
                  title="Swap States"
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <ArrowRightLeft className="h-3 w-3" />
                </button>

                <span className="text-slate-400 ml-1">To:</span>
                <select 
                  aria-label="Customer State"
                  value={customerState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setCustomerState(found);
                  }}
                  className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.code} value={s.code} className="dark:bg-slate-900">{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Folder Icon Pill */}
              <button 
                onClick={() => setActiveTab('saved')}
                className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
                title="Saved Calculations Folder"
              >
                <Folder className="h-3.5 w-3.5" />
              </button>

              {/* Notification Bell Pill */}
              <button 
                onClick={() => setActiveTab('council')}
                className="relative h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
                title="Council Notifications"
              >
                <BellRing className="h-3.5 w-3.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ff5b35] ring-2 ring-white dark:ring-slate-800"></span>
              </button>

              {/* Dark Theme Active Indicator Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171b24] border border-slate-700/80 text-xs shadow-xs">
                <Moon className="h-3.5 w-3.5 text-[#2f66ee]" />
                <span className="text-[11px] font-bold text-slate-200">Dark Theme</span>
              </div>

            </div>

          </div>

          {/* DASHBOARD TITLE ROW ("Manage and track your beloved project / Garnaco Project") */}
          <div className="pt-5 pb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Manage and track your indirect tax & statutory calculations
              </div>
              <div className="flex items-center gap-3 mt-1 relative">
                <div 
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {selectedProject}
                  </h1>
                  <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                {showProjectDropdown && (
                  <div className="absolute top-10 left-0 z-30 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
                    {[
                      { name: 'Garnaco Project', desc: 'Creative & Software Media (18% GST)' },
                      { name: 'Aura Textiles Hub', desc: 'Garments & Handloom (5% & 12% GST)' },
                      { name: 'Zenith Logistics', desc: 'GTA Transport & Goods Freight (5% RCM)' },
                      { name: 'Apex Health Corp', desc: 'Pharma & Medical Supplies (12% GST)' },
                    ].map((proj) => (
                      <button
                        key={proj.name}
                        onClick={() => {
                          setSelectedProject(proj.name);
                          setShowProjectDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors ${
                          selectedProject === proj.name
                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-semibold">{proj.name}</div>
                        <div className="text-[10px] text-slate-400">{proj.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Orange Peach Pill Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0eb] dark:bg-orange-950/40 text-[#ff5b35] text-xs font-semibold border border-[#ffdecb] dark:border-orange-900/60 shadow-2xs">
                  <Lock className="h-3 w-3" />
                  <span>Private Access</span>
                </span>
              </div>
            </div>

            {/* Right: Last update info + Avatars cluster + Invite member */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">
                Last Update <strong className="text-slate-700 dark:text-slate-300">7.15 pm 2 Jan 2026</strong>
              </span>

              {/* Overlapping Avatar Stack */}
              <div className="flex items-center -space-x-2 overflow-hidden pl-1">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces" alt="" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces" alt="" />
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] ring-2 ring-white dark:ring-slate-800">
                  8+
                </span>
              </div>

              {/* Invite Member Button */}
              <button 
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Invite Member</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TAB ROUTING: OVERVIEW BENTO GRID vs DEDICATED TOOLS       */}
          {/* ========================================================= */}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-2">
              
              {/* ------------------------------------------------------- */}
              {/* COLUMN LEFT & CENTER (8 Cols): Bento Widgets            */}
              {/* ------------------------------------------------------- */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* ROW 1: Project Progress & Time Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* CARD 1: Project Progress (Bar chart & 230 metric) */}
                  <div className="rounded-[24px] bg-white dark:bg-[#191c23] p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Project Progess
                        </h3>
                        <p className="text-[10px] text-slate-400">Selected: {selectedStage} (Click bar to inspect)</p>
                      </div>
                      {/* Pill Dropdown */}
                      <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                        <span>In Progress</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Chart columns with percentages */}
                    <div className="flex items-end justify-between gap-4 pt-3 pb-2">
                      <div className="flex-1 flex items-end justify-between gap-2.5">
                        
                        {/* Bar 1: Prototype */}
                        <div 
                          onClick={() => setSelectedStage('Prototype')}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <span className={`text-[10px] font-semibold ${selectedStage === 'Prototype' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>+17%</span>
                          <div className={`w-8 sm:w-10 h-16 rounded-xl transition-all ${
                            selectedStage === 'Prototype'
                              ? 'bg-[#2f66ee] shadow-sm shadow-blue-500/20 scale-105'
                              : 'bg-[#202328] dark:bg-slate-700 hover:bg-slate-600'
                          }`}></div>
                          <span className={`text-[10px] ${selectedStage === 'Prototype' ? 'text-[#2f66ee] font-bold' : 'text-slate-400 font-medium'}`}>Prototype</span>
                        </div>

                        {/* Bar 2: Wireframe */}
                        <div 
                          onClick={() => setSelectedStage('Wireframe')}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <span className={`text-[10px] font-semibold ${selectedStage === 'Wireframe' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>+3%</span>
                          <div className={`w-8 sm:w-10 h-12 rounded-xl transition-all ${
                            selectedStage === 'Wireframe'
                              ? 'bg-[#2f66ee] shadow-sm shadow-blue-500/20 scale-105'
                              : 'bg-[#202328] dark:bg-slate-700 hover:bg-slate-600'
                          }`}></div>
                          <span className={`text-[10px] ${selectedStage === 'Wireframe' ? 'text-[#2f66ee] font-bold' : 'text-slate-400 font-medium'}`}>Wireframe</span>
                        </div>

                        {/* Bar 3: Branding (Active Blue Column from image!) */}
                        <div 
                          onClick={() => setSelectedStage('Branding')}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${selectedStage === 'Branding' ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {selectedStage === 'Branding' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>}
                            +12%
                          </span>
                          <div className={`w-8 sm:w-10 h-28 rounded-xl transition-all ${
                            selectedStage === 'Branding'
                              ? 'bg-[#2f66ee] shadow-sm shadow-blue-500/20 scale-105'
                              : 'bg-[#202328] dark:bg-slate-700 hover:bg-slate-600'
                          }`}></div>
                          <span className={`text-[10px] ${selectedStage === 'Branding' ? 'text-[#2f66ee] font-bold' : 'text-slate-400 font-medium'}`}>Branding</span>
                        </div>

                        {/* Bar 4: UI/UX */}
                        <div 
                          onClick={() => setSelectedStage('UI/UX')}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <span className={`text-[10px] font-semibold ${selectedStage === 'UI/UX' ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>+24%</span>
                          <div className={`w-8 sm:w-10 h-20 rounded-xl transition-all ${
                            selectedStage === 'UI/UX'
                              ? 'bg-[#2f66ee] shadow-sm shadow-blue-500/20 scale-105'
                              : 'bg-[#202328] dark:bg-slate-700 hover:bg-slate-600'
                          }`}></div>
                          <span className={`text-[10px] ${selectedStage === 'UI/UX' ? 'text-[#2f66ee] font-bold' : 'text-slate-400 font-medium'}`}>UI/UX</span>
                        </div>

                      </div>

                      {/* Right Counter: 230 */}
                      <div className="pl-4 border-l border-slate-100 dark:border-slate-800 text-right flex flex-col items-end">
                        <span className="px-2 py-0.5 rounded-full bg-[#ff5b35] text-white text-[10px] font-bold mb-1">
                          30 Days
                        </span>
                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          230
                        </div>
                        <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                          In Progress<br />Project in a month
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-2 cursor-pointer">
                          <span>January 26</span>
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* CARD 2: Time Schedule (Calendar & 72% metric) */}
                  <div className="rounded-[24px] bg-white dark:bg-[#191c23] p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Time Schedule
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#2f66ee] text-white text-[10px] font-semibold flex items-center gap-1">
                          Jan 2026 <ChevronDown className="h-2.5 w-2.5" />
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          <img className="h-5 w-5 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=faces" alt="" />
                          <img className="h-5 w-5 rounded-full ring-1 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=faces" alt="" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                          Daily Meeting
                        </span>
                      </div>
                    </div>

                    {/* Schedule Grid & Meeting Row */}
                    <div className="grid grid-cols-5 gap-2 my-4">
                      {/* Day 12 */}
                      <button 
                        onClick={() => setSelectedCalendarDay(12)}
                        className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                          selectedCalendarDay === 12 
                            ? 'bg-[#2f66ee] text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        12
                      </button>
                      
                      {/* Meeting Banner dynamically updating with day */}
                      <div className="col-span-4 h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <span className="truncate">
                          {selectedCalendarDay === 12 && 'Meeting with boss & CA'}
                          {selectedCalendarDay === 13 && 'IFF Invoice Upload Cutoff'}
                          {selectedCalendarDay === 14 && 'GSTR-2B ITC Reconciliation'}
                          {selectedCalendarDay === 15 && 'Monthly Statutory Audit'}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">10:00 AM</span>
                      </div>

                      {/* Row 2 of Calendar blocks */}
                      <button 
                        onClick={() => setSelectedCalendarDay(13)}
                        className={`h-9 rounded-xl font-semibold text-xs flex items-center justify-center transition-all ${
                          selectedCalendarDay === 13 
                            ? 'bg-[#2f66ee] text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        13
                      </button>
                      
                      <div className="h-9 rounded-xl bg-hatch border border-slate-200 dark:border-slate-700"></div>
                      
                      <button 
                        onClick={() => setSelectedCalendarDay(14)}
                        className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                          selectedCalendarDay === 14 
                            ? 'bg-[#2f66ee] text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        14
                      </button>
                      
                      <div className="h-9 rounded-xl bg-hatch border border-slate-200 dark:border-slate-700"></div>
                      
                      <button 
                        onClick={() => setSelectedCalendarDay(15)}
                        className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer transition-all ${
                          selectedCalendarDay === 15 
                            ? 'bg-[#2f66ee] text-white' 
                            : 'bg-[#2f66ee]/90 hover:bg-blue-600 text-white'
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {/* Bottom Progress Percent: 72% */}
                    <div className="flex items-end justify-between pt-1">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                        <span>January</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                          <span>72%</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">to full schedule</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* ROW 2: Triplets & Upcoming Event */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  
                  {/* Left Column (5 cols): Mini Stat Widgets */}
                  <div className="md:col-span-5 space-y-4">
                    
                    {/* Widget A: Project Productivity */}
                    <div className="rounded-[22px] bg-white dark:bg-[#191c23] p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span>Project Productivity</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">87</span>
                          <span className="text-[10px] text-slate-400">/Month</span>
                        </div>
                      </div>
                      {/* Mini Orange Equalizer Spark bars */}
                      <div className="flex items-end gap-1">
                        <div className="w-1.5 h-3 rounded-full bg-[#ff5b35]"></div>
                        <div className="w-1.5 h-6 rounded-full bg-[#ff5b35]"></div>
                        <div className="w-1.5 h-4 rounded-full bg-[#ff5b35]"></div>
                        <div className="w-1.5 h-7 rounded-full bg-[#ff5b35]"></div>
                      </div>
                    </div>

                    {/* Widget B: Time Members (Dark Charcoal Card with Blue Arrow from image!) */}
                    <div className="rounded-[22px] bg-[#1e2228] text-white p-4.5 border border-slate-800 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-300 font-medium">Time Members</div>
                        <span className="px-2 py-0.5 rounded-full bg-[#2f66ee] text-white text-[10px] font-semibold">
                          Increase 35%
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-2xl font-extrabold tracking-tight">
                          97 <span className="text-sm font-normal text-slate-300">Member</span>
                        </div>
                        <button 
                          onClick={() => setShowInviteModal(true)}
                          className="h-8 w-8 rounded-full bg-[#2f66ee] hover:bg-[#1d52d9] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Widget C: Team Productivity with Red Sparkline */}
                    <div className="rounded-[22px] bg-white dark:bg-[#191c23] p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-slate-900 dark:text-white">34</span>
                          <span className="text-[10px] text-slate-400">/Month</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Team Productivity
                        </div>
                      </div>
                      {/* Mini sparkline svg */}
                      <svg className="w-16 h-8 text-[#ff4d4d]" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="0,24 16,20 28,26 44,12 60,6" />
                      </svg>
                    </div>

                  </div>

                  {/* Right Column (7 cols): Upcoming Event Card */}
                  <div className="md:col-span-7 rounded-[24px] bg-white dark:bg-[#191c23] p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#2f66ee] text-white text-[10px] font-bold">
                          Next Event
                        </span>
                        <button 
                          onClick={() => setActiveTab('council')}
                          className="px-3 py-1 rounded-full bg-[#2f66ee] text-white text-[10px] font-bold hover:bg-blue-700 transition-colors shadow-2xs"
                        >
                          View Event
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Upcoming Event
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                        Important events every day
                      </p>

                      {/* Two Inner Rounded Soft Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {/* Meeting Time */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                            <Clock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            <span>•••</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Meeting Time</div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            3.00 - 4.30 PM
                          </div>
                        </div>

                        {/* Meeting Date */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                            <Calendar className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                            <span>•••</span>
                          </div>
                          <div className="text-[11px] text-slate-400">Meeting Date</div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                            Monday, 23 Jan
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attendant Row */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="text-[11px] text-slate-400 mb-2">Attendent</div>
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => alert('Invitation sent to team via secure Telegram & Email.')}
                          className="px-3.5 py-1.5 rounded-full bg-[#2f66ee] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                        >
                          <Send className="h-3 w-3" />
                          <span>Send Invitation</span>
                        </button>

                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces" alt="" />
                          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces" alt="" />
                          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=faces" alt="" />
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[9px] ring-2 ring-white dark:ring-slate-800">
                            2+
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* ------------------------------------------------------- */}
              {/* COLUMN RIGHT (4 Cols): Team Control Card                */}
              {/* ------------------------------------------------------- */}
              <div className="lg:col-span-4">
                <div className="rounded-[24px] bg-white dark:bg-[#191c23] p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] h-full flex flex-col justify-between">
                  <div>
                    {/* Header with ↗ external link */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        Team Control
                      </h3>
                      <button 
                        onClick={() => setShowInviteModal(true)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Search Team Input */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={clientSearchTerm}
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        placeholder="Search Team"
                        className="w-full py-2 pl-8.5 pr-3 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Team Members List */}
                    <div className="space-y-3">
                      {filteredClients.map((client) => (
                        <div 
                          key={client.id}
                          onClick={() => setSelectedClientDetail(client)}
                          className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between border border-transparent hover:border-slate-100 dark:hover:border-slate-700/60 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {client.avatar ? (
                              <img 
                                src={client.avatar} 
                                alt={client.name} 
                                className="h-9 w-9 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all" 
                              />
                            ) : (
                              <div className={`h-9 w-9 rounded-full ${client.bg} text-white font-bold text-xs flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-500 transition-all`}>
                                {client.initials}
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {client.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {client.role} • <span className="font-mono text-[9px]">{client.gstin.slice(0, 5)}...</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Phone & Message icons */}
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`tel:${client.phone}`}
                              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Call"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                            <button
                              onClick={() => alert(`Chat with ${client.name} (${client.gstin})`)}
                              className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Message"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Quick Launch into Calculator */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="w-full py-2.5 rounded-2xl bg-[#18191f] hover:bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Calculator className="h-4 w-4 text-[#ff5b35]" />
                      <span>Open GST Tax Calculator</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* DEDICATED TOOL TABS */}
          {activeTab === 'calculator' && (
            <div className="mt-2">
              <AllInOneCalculator
                supplierState={supplierState}
                setSupplierState={setSupplierState}
                customerState={customerState}
                setCustomerState={setCustomerState}
                onAddToInvoice={handleAddToInvoice}
                onSaveAudit={handleSaveAudit}
                onSwitchToAiSearch={(q) => {
                  setTopSearchTerm(q);
                }}
              />
            </div>
          )}

          {activeTab === 'invoice' && (
            <div className="mt-2">
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

          {activeTab === 'explorer' && (
            <div className="mt-2">
              <HsnSacExplorer
                onSelectForCalculation={(item: GSTItem) => {
                  setActiveTab('calculator');
                }}
              />
            </div>
          )}

          {activeTab === 'council' && (
            <div className="mt-2">
              <GSTCouncilFeed />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="mt-2">
              <HistoricalLookupView
                onApplyHistoricalQuery={(query, date) => {
                  setActiveTab('calculator');
                }}
              />
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="mt-2">
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

          {activeTab === 'knowledge' && (
            <div className="mt-2">
              <KnowledgeGuideView />
            </div>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* CLIENT DETAIL MODAL                                       */}
      {/* ========================================================= */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                Client Profile
              </span>
              <button 
                onClick={() => setSelectedClientDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {selectedClientDetail.avatar ? (
                <img src={selectedClientDetail.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500" />
              ) : (
                <div className={`h-12 w-12 rounded-full ${selectedClientDetail.bg} text-white font-bold text-base flex items-center justify-center`}>
                  {selectedClientDetail.initials}
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedClientDetail.name}</h4>
                <p className="text-xs text-slate-400">{selectedClientDetail.role}</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-semibold">{selectedClientDetail.gstin}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs space-y-1.5 mb-4 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Phone:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedClientDetail.phone}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Filing Status:</span>
                <span className="font-semibold text-emerald-600">GSTR-1 Filed</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Assigned Projects:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedProject}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSelectedClientDetail(null);
                  setActiveTab('invoice');
                }}
                className="py-2 rounded-xl bg-[#2f66ee] hover:bg-blue-600 text-white font-semibold text-xs shadow-xs"
              >
                Create Invoice
              </button>
              <button
                onClick={() => {
                  setSelectedClientDetail(null);
                  setActiveTab('calculator');
                }}
                className="py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs"
              >
                New Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ORACLE ASSISTANT MODAL DIALOG                             */}
      {/* ========================================================= */}
      {showAssistantModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#2f66ee] text-white flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Oracle Tax Assistant</h3>
                  <p className="text-[11px] text-slate-500">CBIC AI Legal Copilot</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAssistantModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Ask any question on Section 17(5) blocked credit, composite supplies, reverse charge (RCM), or e-invoicing limits.
            </p>

            <div className="space-y-2 mb-4">
              {[
                'Is GST applicable on director remuneration under RCM?',
                'What is the threshold limit for e-invoicing in 2026?',
                'Can input tax credit (ITC) be claimed on employee health insurance?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopSearchTerm(q);
                    setShowAssistantModal(false);
                    setActiveTab('calculator');
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 transition-colors"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowAssistantModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INVITE CLIENT / MEMBER MODAL                              */}
      {/* ========================================================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Invite Member to Garnaco Project</h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Collaborator Email</label>
                <input 
                  type="email" 
                  placeholder="name@firm.com" 
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Access Role</label>
                <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs">
                  <option>Tax Auditor (Full Edit & File)</option>
                  <option>Client Representative (Review & Approve)</option>
                  <option>Accountant (Invoice Only)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Invitation sent to collaborator!');
                  setShowInviteModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#2f66ee] text-white text-xs font-semibold hover:bg-blue-600"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
