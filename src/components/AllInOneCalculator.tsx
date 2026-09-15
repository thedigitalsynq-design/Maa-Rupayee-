import React, { useState, useId } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  Copy, 
  Check, 
  ReceiptText, 
  Bookmark, 
  ArrowRightLeft, 
  SlidersHorizontal, 
  Info, 
  Sparkles,
  ShoppingBag,
  Utensils,
  Store,
  Laptop,
  Coins,
  Car
} from 'lucide-react';
import { IndianState, TaxBreakdown } from '../types';
import { INDIAN_STATES, DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from '../data/indianStates';
import { calculateGST } from '../utils/gstCalculator';
import { formatIndianCurrency, amountInIndianWords } from '../utils/indianCurrency';

interface AllInOneCalculatorProps {
  supplierState: IndianState;
  setSupplierState: (s: IndianState) => void;
  customerState: IndianState;
  setCustomerState: (s: IndianState) => void;
  onAddToInvoice?: (item: {
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
  }) => void;
  onSaveAudit?: (audit: {
    query: string;
    product: string;
    hsnSac: string;
    rate: number;
    supplierState: string;
    customerState: string;
    transactionType: string;
    taxableValue: number;
    gstAmount: number;
    finalAmount: number;
  }) => void;
  onSwitchToAiSearch?: (query: string) => void;
}

// Quick Scenario Presets for Everyone
interface PersonaPreset {
  id: string;
  icon: React.FC<{ className?: string }>;
  name: string;
  role: string;
  amount: number;
  rate: number;
  isInclusive: boolean;
  cess: number;
  isInterState: boolean;
  desc: string;
  hsn: string;
  type: 'GOODS' | 'SERVICES';
}

const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'consumer',
    icon: ShoppingBag,
    name: 'Consumer / Shopper',
    role: 'MRP Tax Verification',
    amount: 2360,
    rate: 18,
    isInclusive: true,
    cess: 0,
    isInterState: false,
    desc: 'Verify how much GST was embedded inside an MRP store bill',
    hsn: '8517',
    type: 'GOODS',
  },
  {
    id: 'restaurant',
    icon: Utensils,
    name: 'Restaurant Food Bill',
    role: 'Dining / Food Delivery',
    amount: 1500,
    rate: 5,
    isInclusive: false,
    cess: 0,
    isInterState: false,
    desc: '5% GST (2.5% CGST + 2.5% SGST) on restaurant food without ITC',
    hsn: '996331',
    type: 'SERVICES',
  },
  {
    id: 'kirana',
    icon: Store,
    name: 'Kirana / Retailer',
    role: 'Daily Retail Trade',
    amount: 8500,
    rate: 5,
    isInclusive: false,
    cess: 0,
    isInterState: false,
    desc: 'Compute packaged grocery & provisions with local CGST + SGST',
    hsn: '1006',
    type: 'GOODS',
  },
  {
    id: 'freelancer',
    icon: Laptop,
    name: 'Freelancer / Agency',
    role: 'IT & Consulting Services',
    amount: 60000,
    rate: 18,
    isInclusive: false,
    cess: 0,
    isInterState: true,
    desc: '18% IGST on out-of-state software, design, or consulting invoices',
    hsn: '998314',
    type: 'SERVICES',
  },
  {
    id: 'jewellery',
    icon: Coins,
    name: 'Gold & Jewellery',
    role: 'Precious Metals',
    amount: 150000,
    rate: 3,
    isInclusive: false,
    cess: 0,
    isInterState: false,
    desc: '3% statutory GST (1.5% CGST + 1.5% SGST) on gold/silver bullion',
    hsn: '7108',
    type: 'GOODS',
  },
  {
    id: 'automobile',
    icon: Car,
    name: 'Automobile / Vehicle',
    role: 'Motor Vehicle (GST 2.0)',
    amount: 750000,
    rate: 18,
    isInclusive: false,
    cess: 0,
    isInterState: false,
    desc: '18% GST on small petrol motor cars since 22-09-2025 (cess subsumed; large cars at 40%)',
    hsn: '8703',
    type: 'GOODS',
  },
];

const STANDARD_RATES = [0, 3, 5, 18, 40];

export const AllInOneCalculator: React.FC<AllInOneCalculatorProps> = ({
  supplierState,
  setSupplierState,
  customerState,
  setCustomerState,
  onAddToInvoice,
  onSaveAudit,
  onSwitchToAiSearch,
}) => {
  const [amount, setAmount] = useState<number>(10000);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [cessRate, setCessRate] = useState<number>(0);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Generate accessible IDs for form inputs
  const amountInputId = useId();
  const customRateId = useId();
  const cessRateId = useId();
  const supplierSelectId = useId();
  const customerSelectId = useId();

  // Route state with safe fallbacks
  const safeSupplierState = supplierState || DEFAULT_SUPPLIER_STATE;
  const safeCustomerState = customerState || DEFAULT_CUSTOMER_STATE;
  const isIntraState = safeSupplierState.code === safeCustomerState.code;
  const isUTWithoutLeg = isIntraState && Boolean(safeSupplierState.isUT) && !safeSupplierState.hasLegislature;

  // Toggle Intra vs Inter-State supply
  const handleToggleRoute = () => {
    if (isIntraState) {
      // Switch to interstate: if current state is KA, switch to MH; otherwise KA
      const nextState = (safeSupplierState.code === 'KA' || safeSupplierState.tin === '29')
        ? (INDIAN_STATES.find(s => s.code === 'MH' || s.tin === '27') || INDIAN_STATES[0])
        : (INDIAN_STATES.find(s => s.code === 'KA' || s.tin === '29') || INDIAN_STATES[15]);
      setCustomerState(nextState);
    } else {
      // Switch to intrastate
      setCustomerState(safeSupplierState);
    }
  };

  // Run core computation
  const breakdown: TaxBreakdown = calculateGST({
    amount: isNaN(amount) ? 0 : amount,
    isInclusive,
    gstRate: isNaN(gstRate) ? 0 : gstRate,
    cessRate,
    supplierState: safeSupplierState,
    customerState: safeCustomerState,
  });

  // Apply Quick Persona Presets
  const handleApplyPersona = (preset: PersonaPreset) => {
    setSelectedPersona(preset.id);
    setAmount(preset.amount);
    setGstRate(preset.rate);
    setIsCustomRate(!STANDARD_RATES.includes(preset.rate));
    setIsInclusive(preset.isInclusive);
    setCessRate(preset.cess);

    if (preset.isInterState && isIntraState) {
      const nextCust = (safeSupplierState.code === 'KA' || safeSupplierState.tin === '29')
        ? (INDIAN_STATES.find(s => s.code === 'MH' || s.tin === '27') || INDIAN_STATES[0])
        : (INDIAN_STATES.find(s => s.code === 'KA' || s.tin === '29') || INDIAN_STATES[15]);
      setCustomerState(nextCust);
    } else if (!preset.isInterState && !isIntraState) {
      setCustomerState(safeSupplierState);
    }
  };

  // Quick Amount Adjusters
  const handleAddAmount = (addVal: number) => {
    setAmount(prev => (isNaN(prev) ? 0 : prev) + addVal);
  };

  const handleClearAmount = () => {
    setAmount(0);
  };

  // Copy breakdown to clipboard
  const handleCopyBreakdown = () => {
    const text = `--- GST / CGST / SGST CALCULATION SUMMARY ---
Calculated On: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Calculation Mode: ${isInclusive ? 'Inclusive (GST extracted from Total)' : 'Exclusive (GST added to Base Price)'}
Route: ${breakdown.transactionType} (${supplierState.name} -> ${customerState.name})
--------------------------------------------------
Taxable (Base) Value: ${formatIndianCurrency(breakdown.taxableValue)}
GST Rate: ${breakdown.gstRate}% ${breakdown.cessRate ? `+ ${breakdown.cessRate}% Cess` : ''}
${
  isIntraState
    ? `CGST (${breakdown.cgstRate}%): ${formatIndianCurrency(breakdown.cgstAmount)}
${isUTWithoutLeg ? 'UTGST' : 'SGST'} (${breakdown.sgstRate || breakdown.utgstRate}%): ${formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}`
    : `IGST (${breakdown.igstRate}%): ${formatIndianCurrency(breakdown.igstAmount)}`
}
${breakdown.cessAmount > 0 ? `Compensation Cess: ${formatIndianCurrency(breakdown.cessAmount)}\n` : ''}Total GST Tax: ${formatIndianCurrency(breakdown.totalGst + breakdown.cessAmount)}
==================================================
Total Payable Amount: ${formatIndianCurrency(breakdown.totalAmount)}
In Words: ${amountInIndianWords(breakdown.totalAmount)}
--------------------------------------------------
Computed with Maa Rupayee`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Send to Tax Invoice
  const handleSendToInvoice = () => {
    if (onAddToInvoice) {
      onAddToInvoice({
        description: selectedPersona 
          ? PERSONA_PRESETS.find(p => p.id === selectedPersona)?.name || 'General Supply'
          : 'General Taxable Supply',
        hsnSac: selectedPersona 
          ? PERSONA_PRESETS.find(p => p.id === selectedPersona)?.hsn || '9983'
          : '9983',
        type: selectedPersona 
          ? PERSONA_PRESETS.find(p => p.id === selectedPersona)?.type || 'GOODS'
          : 'GOODS',
        taxableAmount: breakdown.taxableValue,
        gstRate: breakdown.gstRate,
        cessRate: breakdown.cessRate,
        cgstAmount: isIntraState ? breakdown.cgstAmount : 0,
        sgstAmount: isIntraState && !isUTWithoutLeg ? breakdown.sgstAmount : 0,
        utgstAmount: isIntraState && isUTWithoutLeg ? breakdown.utgstAmount : 0,
        igstAmount: !isIntraState ? breakdown.igstAmount : 0,
        cessAmount: breakdown.cessAmount,
        totalAmount: breakdown.totalAmount,
      });
    }
  };

  // Save to Audits
  const handleSaveToAudits = () => {
    if (onSaveAudit) {
      onSaveAudit({
        query: `₹${amount} @ ${gstRate}% (${isInclusive ? 'Incl' : 'Excl'})`,
        product: selectedPersona 
          ? PERSONA_PRESETS.find(p => p.id === selectedPersona)?.name || `General Calculation ₹${amount}`
          : `General Calculation ₹${amount}`,
        hsnSac: 'General',
        rate: breakdown.gstRate,
        supplierState: supplierState.name,
        customerState: customerState.name,
        transactionType: breakdown.transactionType,
        taxableValue: breakdown.taxableValue,
        gstAmount: breakdown.totalGst + breakdown.cessAmount,
        finalAmount: breakdown.totalAmount,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Compute table of all slabs for the current amount & mode
  const allSlabsComparison = STANDARD_RATES.map(rate => {
    const b = calculateGST({
      amount: isNaN(amount) ? 0 : amount,
      isInclusive,
      gstRate: rate,
      cessRate: 0,
      supplierState,
      customerState,
    });
    return {
      rate,
      taxable: b.taxableValue,
      cgst: b.cgstAmount,
      sgst: b.sgstAmount || b.utgstAmount,
      igst: b.igstAmount,
      totalGst: b.totalGst,
      finalAmount: b.totalAmount,
    };
  });

  // Calculate percentage width for visual distribution bar
  const totalBar = breakdown.totalAmount || 1;
  const taxableWidth = Math.max(1, (breakdown.taxableValue / totalBar) * 100);
  const cgstWidth = isIntraState ? Math.max(0, (breakdown.cgstAmount / totalBar) * 100) : 0;
  const sgstWidth = isIntraState ? Math.max(0, ((breakdown.sgstAmount || breakdown.utgstAmount) / totalBar) * 100) : 0;
  const igstWidth = !isIntraState ? Math.max(0, (breakdown.igstAmount / totalBar) * 100) : 0;
  const cessWidth = breakdown.cessAmount > 0 ? Math.max(0, (breakdown.cessAmount / totalBar) * 100) : 0;

  return (
    <div className="space-y-6 text-white">
      <h2 className="sr-only">GST Calculator — forward and reverse tax computation</h2>
      {/* Quick Persona Scenarios Bar */}
      <div className="bg-[#0e1014] rounded-2xl border border-white/10 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-white/10 text-white flex items-center justify-center text-xs font-bold border border-white/15">
              ⚡
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Who is calculating? Instant Presets for Everyone</h3>
              <p className="text-[11px] text-zinc-400">Pick your persona or scenario to load realistic GST values with one click</p>
            </div>
          </div>
          {selectedPersona && (
            <button
              onClick={() => setSelectedPersona(null)}
              className="text-[11px] text-zinc-400 hover:text-white font-medium"
            >
              Clear Preset
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PERSONA_PRESETS.map((p) => {
            const IconComponent = p.icon;
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPersona(p)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-xs font-bold'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <IconComponent className={`h-4 w-4 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-black text-white font-mono' : 'bg-zinc-800 text-zinc-300 font-mono'
                  }`}>
                    {p.rate}%
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight line-clamp-1 ${isSelected ? 'text-black' : 'text-white'}`}>{p.name}</div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-zinc-700' : 'text-zinc-400'}`}>{p.role}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Calculator Form & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e1014] rounded-2xl border border-white/10 p-6 space-y-5 shadow-sm">
          {/* Header & Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="h-4 w-4 text-white" />
                <span>GST, CGST & SGST Parameters</span>
              </h3>
              <span className="text-xs text-zinc-400">Configure amount, tax slab, and route</span>
            </div>

            {/* Exclusive vs Inclusive Segmented Toggle */}
            <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  !isInclusive
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                + GST (Exclusive)
              </button>
              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isInclusive
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Remove GST (Inclusive / MRP)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor={amountInputId} className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                {isInclusive ? 'Total Amount (MRP / Incl. Tax)' : 'Taxable Base Amount (Excl. Tax)'}
              </label>
              <span className="text-xs font-mono font-semibold text-white">
                ₹ {amount ? amount.toLocaleString('en-IN') : 0}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-500">
                ₹
              </span>
              <input
                id={amountInputId}
                type="number"
                min="0"
                step="100"
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Enter amount (e.g. 10000)"
                className="w-full pl-9 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-lg font-mono font-bold text-white focus:outline-none focus:border-white transition-all"
              />
            </div>

            {/* Quick Add Amount Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-zinc-500 font-medium mr-1">Quick Add:</span>
              {[500, 1000, 5000, 10000, 50000, 100000].map((addVal) => (
                <button
                  key={addVal}
                  type="button"
                  onClick={() => handleAddAmount(addVal)}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded text-xs font-mono font-semibold transition-colors"
                >
                  +{addVal >= 100000 ? `${addVal / 100000}L` : addVal >= 1000 ? `${addVal / 1000}k` : addVal}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearAmount}
                className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded text-xs font-semibold transition-colors ml-auto"
              >
                Clear
              </button>
            </div>
          </div>

          {/* GST Rate Slabs Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                GST Rate Slab (Statutory Indian Schedules)
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {isCustomRate ? `Custom ${gstRate}%` : `${gstRate}% Slab`}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {STANDARD_RATES.map((rate) => {
                const isSelected = !isCustomRate && gstRate === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setGstRate(rate);
                      setIsCustomRate(false);
                    }}
                    className={`py-2 px-1 rounded-xl text-center font-mono font-bold transition-all border ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    <div className="text-sm">{rate}%</div>
                    <div className="text-[9px] font-sans font-normal opacity-70">
                      {rate === 0 && 'Nil/Exempt'}
                      {rate === 3 && 'Gold/Gems'}
                      {rate === 5 && 'Essentials'}
                      {rate === 18 && 'Standard'}
                      {rate === 40 && 'Sin/Luxury'}
                    </div>
                  </button>
                );
              })}

              {/* Custom Rate Button */}
              <button
                type="button"
                onClick={() => setIsCustomRate(true)}
                className={`py-2 px-1 rounded-xl text-center font-mono font-bold transition-all border ${
                  isCustomRate
                    ? 'bg-white text-black border-white shadow-xs'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                }`}
              >
                <div className="text-sm">Custom</div>
                <div className="text-[9px] font-sans font-normal opacity-70">Enter %</div>
              </button>
            </div>

            {/* Custom Rate Input if active */}
            {isCustomRate && (
              <div className="mt-2.5 flex items-center gap-2 p-3 bg-zinc-900 rounded-xl border border-zinc-700 text-xs">
                <span className="text-zinc-300 font-semibold">Enter Custom Rate:</span>
                <input
                  id={customRateId}
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={gstRate}
                  onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded font-mono font-bold text-white focus:outline-none focus:border-white"
                  aria-label="Custom GST Rate Percentage"
                />
                <span className="text-white font-bold">%</span>
              </div>
            )}
          </div>

          {/* Supply Route & State Selectors */}
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                Supply Route (Tax Apportionment)
              </span>

              {/* Quick Route Toggle */}
              <button
                type="button"
                onClick={handleToggleRoute}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  isIntraState
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                <ArrowRightLeft className="h-3 w-3" />
                <span>
                  {isIntraState ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor={supplierSelectId} className="block text-zinc-400 font-medium mb-1">
                  Supplier / Origin State:
                </label>
                <select
                  id={supplierSelectId}
                  value={safeSupplierState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setSupplierState(found);
                  }}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-semibold focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={`src-${s.code}`} value={s.code}>
                      {s.name} ({s.tin}) {s.isUT ? '(UT)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={customerSelectId} className="block text-zinc-400 font-medium mb-1">
                  Customer / Place of Supply:
                </label>
                <select
                  id={customerSelectId}
                  value={safeCustomerState.code}
                  onChange={(e) => {
                    const found = INDIAN_STATES.find(s => s.code === e.target.value);
                    if (found) setCustomerState(found);
                  }}
                  className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-semibold focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={`dst-${s.code}`} value={s.code}>
                      {s.name} ({s.tin}) {s.isUT ? '(UT)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 pt-1 flex items-center justify-between">
              <span>
                {isIntraState ? (
                  isUTWithoutLeg ? (
                    <>Split 50:50 &rarr; <strong>CGST ({gstRate/2}%)</strong> + <strong>UTGST ({gstRate/2}%)</strong></>
                  ) : (
                    <>Split 50:50 &rarr; <strong>CGST ({gstRate/2}%)</strong> to Centre + <strong>SGST ({gstRate/2}%)</strong> to {customerState.name}</>
                  )
                ) : (
                  <>100% Integrated Tax &rarr; <strong>IGST ({gstRate}%)</strong> collected by Centre</>
                )}
              </span>
              <span className="font-mono text-zinc-500">
                {supplierState.tin} &rarr; {customerState.tin}
              </span>
            </div>
          </div>

          {/* Optional Compensation Cess Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
              <span>Compensation Cess (Automobiles, Tobacco, Aerated Drinks):</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 1, 12, 15, 22].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCessRate(c)}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-semibold transition-colors ${
                    cessRate === c
                      ? 'bg-white text-black font-bold'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {c}%
                </button>
              ))}
              {cessRate > 0 && (
                <input
                  id={cessRateId}
                  type="number"
                  min="0"
                  max="100"
                  value={cessRate}
                  onChange={(e) => setCessRate(parseFloat(e.target.value) || 0)}
                  className="w-14 px-1 py-0.5 bg-zinc-950 border border-zinc-700 rounded text-center font-mono text-xs text-white"
                  aria-label="Custom Compensation Cess Percentage"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Hero Card */}
          <div className="bg-[#0e1014] text-white rounded-2xl shadow-md border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                Tax Breakdown Summary
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {breakdown.transactionType}
              </span>
            </div>

            {/* Key Output Metrics Grid */}
            <div className="space-y-3 font-mono text-sm">
              {/* Base Taxable Value */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div>
                  <div className="text-[11px] font-sans text-zinc-400 font-semibold">Taxable (Base) Value</div>
                  <div className="text-xs text-zinc-500 font-sans">
                    {isInclusive ? 'Extracted from gross MRP' : 'Amount before tax'}
                  </div>
                </div>
                <div className="text-base font-bold text-white">
                  {formatIndianCurrency(breakdown.taxableValue)}
                </div>
              </div>

              {/* Tax Splits (CGST + SGST or IGST) */}
              {isIntraState ? (
                <div className="grid grid-cols-2 gap-2">
                  {/* CGST */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] font-sans text-zinc-400 font-bold uppercase">
                      Central Tax (CGST)
                    </div>
                    <div className="text-[10px] text-zinc-500 font-sans">
                      Rate: {breakdown.cgstRate}%
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {formatIndianCurrency(breakdown.cgstAmount)}
                    </div>
                  </div>

                  {/* SGST or UTGST */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="text-[10px] font-sans text-zinc-400 font-bold uppercase">
                      {isUTWithoutLeg ? 'Union Territory Tax (UTGST)' : 'State Tax (SGST)'}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-sans">
                      Rate: {breakdown.sgstRate || breakdown.utgstRate}%
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}
                    </div>
                  </div>
                </div>
              ) : (
                /* IGST */
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-sans text-zinc-400 font-bold uppercase">
                        Integrated Tax (IGST)
                      </div>
                      <div className="text-[10px] text-zinc-500 font-sans">
                        Full Rate: {breakdown.igstRate}% to Centre
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {formatIndianCurrency(breakdown.igstAmount)}
                    </div>
                  </div>
                </div>
              )}

              {/* Cess if exists */}
              {breakdown.cessAmount > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-[11px] font-sans text-zinc-400 font-semibold">
                    Compensation Cess ({breakdown.cessRate}%)
                  </div>
                  <div className="text-sm font-bold text-white">
                    {formatIndianCurrency(breakdown.cessAmount)}
                  </div>
                </div>
              )}

              {/* Total GST Amount */}
              <div className="flex items-center justify-between pt-1 text-zinc-300">
                <span className="text-xs font-sans">Total GST Tax ({breakdown.gstRate}%):</span>
                <span className="font-bold text-white">
                  {formatIndianCurrency(breakdown.totalGst + breakdown.cessAmount)}
                </span>
              </div>
            </div>

            {/* Visual Stacked Tax Distribution Bar */}
            <div className="pt-2 border-t border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-sans">
                <span>Value Breakdown:</span>
                <span>Base ({taxableWidth.toFixed(0)}%) + Tax ({(100 - taxableWidth).toFixed(0)}%)</span>
              </div>

              <div className="dist-bar h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden flex border border-zinc-700">
                <div 
                  style={{ width: `${taxableWidth}%` }} 
                  className="bg-zinc-600 h-full transition-all" 
                  title={`Taxable: ${formatIndianCurrency(breakdown.taxableValue)}`}
                />
                {isIntraState ? (
                  <>
                    <div 
                      style={{ width: `${cgstWidth}%` }} 
                      className="bg-zinc-400 h-full transition-all" 
                      title={`CGST: ${formatIndianCurrency(breakdown.cgstAmount)}`}
                    />
                    <div 
                      style={{ width: `${sgstWidth}%` }} 
                      className="bg-zinc-200 h-full transition-all" 
                      title={`SGST/UTGST: ${formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}`}
                    />
                  </>
                ) : (
                  <div 
                    style={{ width: `${igstWidth}%` }} 
                    className="bg-white h-full transition-all" 
                    title={`IGST: ${formatIndianCurrency(breakdown.igstAmount)}`}
                  />
                )}
                {cessWidth > 0 && (
                  <div 
                    style={{ width: `${cessWidth}%` }} 
                    className="bg-zinc-500 h-full transition-all" 
                    title={`Cess: ${formatIndianCurrency(breakdown.cessAmount)}`}
                  />
                )}
              </div>
            </div>

            {/* Grand Total Highlight */}
            <div className="pt-3 border-t border-zinc-800">
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                Total Payable Amount
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mt-0.5 tracking-tight">
                {formatIndianCurrency(breakdown.totalAmount)}
              </div>
              <div className="text-xs text-zinc-400 font-medium italic mt-1 font-sans">
                {amountInIndianWords(breakdown.totalAmount)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-xs">
              <button
                type="button"
                onClick={handleCopyBreakdown}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendToInvoice}
                className="p-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                title="Transfer to Tax Invoice Studio"
              >
                <ReceiptText className="h-3.5 w-3.5" />
                <span>Invoice</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToAudits}
                className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  savedSuccess
                    ? 'bg-white/20 text-white border-white/40'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5 text-white" />
                <span>{savedSuccess ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Statutory Formula Explainer */}
          <div className="bg-[#0e1014] rounded-2xl border border-white/10 p-5 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Info className="h-3.5 w-3.5 text-white" />
              <span>How this is calculated (CBIC Rules):</span>
            </div>
            
            <div className="space-y-1.5 text-zinc-300 text-[11px] leading-relaxed">
              {isInclusive ? (
                <>
                  <div className="font-mono bg-zinc-900 p-2 rounded-lg border border-zinc-800 text-white">
                    Taxable Base = Amount ÷ [1 + (Rate ÷ 100)]<br/>
                    = ₹{amount} ÷ [1 + {gstRate / 100}] = <strong>{formatIndianCurrency(breakdown.taxableValue)}</strong>
                  </div>
                  <div className="text-zinc-400">Total GST deducted from MRP = <strong className="text-white">{formatIndianCurrency(breakdown.totalGst)}</strong></div>
                </>
              ) : (
                <>
                  <div className="font-mono bg-zinc-900 p-2 rounded-lg border border-zinc-800 text-white">
                    Total GST = Taxable Base × (Rate ÷ 100)<br/>
                    = ₹{breakdown.taxableValue} × {gstRate}% = <strong>{formatIndianCurrency(breakdown.totalGst)}</strong>
                  </div>
                  <div className="text-zinc-400">Final Bill = Base + GST = <strong className="text-white">{formatIndianCurrency(breakdown.totalAmount)}</strong></div>
                </>
              )}

              <div className="pt-1 text-zinc-400">
                {isIntraState ? (
                  <span>
                    Dual GST split: <strong>CGST ({breakdown.cgstRate}%)</strong> = {formatIndianCurrency(breakdown.cgstAmount)}, and <strong>{isUTWithoutLeg ? 'UTGST' : 'SGST'} ({breakdown.sgstRate || breakdown.utgstRate}%)</strong> = {formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}.
                  </span>
                ) : (
                  <span>
                    Inter-state supply: 100% goes to <strong>IGST ({breakdown.igstRate}%)</strong> = {formatIndianCurrency(breakdown.igstAmount)}.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "All Slabs at a Glance" Comparison Matrix */}
      <div className="bg-[#0e1014] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              All Slabs at a Glance for ₹{amount ? amount.toLocaleString('en-IN') : 0}
            </h3>
            <p className="text-xs text-zinc-400">
              Instant comparison of tax across 0%, 3%, 5%, 18%, and 40% rates. Click any row to apply it.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {isInclusive ? 'Inclusive (MRP)' : 'Exclusive (+ GST)'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900 text-zinc-400 font-bold border-b border-zinc-800">
                <th className="py-2.5 px-3">GST Slab</th>
                <th className="py-2.5 px-3">Taxable Base</th>
                {isIntraState ? (
                  <>
                    <th className="py-2.5 px-3 text-right">CGST (Central)</th>
                    <th className="py-2.5 px-3 text-right">{isUTWithoutLeg ? 'UTGST' : 'SGST (State)'}</th>
                  </>
                ) : (
                  <th className="py-2.5 px-3 text-right">IGST (Integrated)</th>
                )}
                <th className="py-2.5 px-3 text-right">Total Tax (₹)</th>
                <th className="py-2.5 px-3 text-right font-bold">Total Bill (₹)</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-mono">
              {allSlabsComparison.map((slab) => {
                const isCurrent = !isCustomRate && gstRate === slab.rate;
                return (
                  <tr 
                    key={slab.rate}
                    className={`hover:bg-zinc-800/40 transition-colors ${
                      isCurrent ? 'bg-white/10 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isCurrent ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {slab.rate}%
                        </span>
                        <span className="text-[11px] font-sans text-zinc-400">
                          {slab.rate === 0 && 'Nil'}
                          {slab.rate === 3 && 'Gold'}
                          {slab.rate === 5 && 'Essentials'}
                          {slab.rate === 18 && 'Standard'}
                          {slab.rate === 40 && 'Sin/Luxury'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-zinc-300">
                      {formatIndianCurrency(slab.taxable)}
                    </td>
                    {isIntraState ? (
                      <>
                        <td className="py-2.5 px-3 text-right text-zinc-300">
                          {formatIndianCurrency(slab.cgst)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-zinc-300">
                          {formatIndianCurrency(slab.sgst)}
                        </td>
                      </>
                    ) : (
                      <td className="py-2.5 px-3 text-right text-zinc-300">
                        {formatIndianCurrency(slab.igst)}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right text-white font-bold">
                      {formatIndianCurrency(slab.totalGst)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-white">
                      {formatIndianCurrency(slab.finalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setGstRate(slab.rate);
                          setIsCustomRate(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-semibold transition-colors ${
                          isCurrent 
                            ? 'bg-white text-black font-bold cursor-default' 
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Apply'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Micro-Guide: Dual GST Structure in India */}
      <div className="bg-[#0e1014] rounded-2xl border border-white/10 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white" />
          <h3 className="text-sm font-bold text-white">Understanding GST, CGST, SGST & IGST in India</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center justify-between">
              <span>CGST</span>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">Centre</span>
            </div>
            <div className="font-semibold text-zinc-200">Central Goods & Services Tax</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Levied under the CGST Act 2017 on intra-state supplies. 50% of the total tax revenue goes directly to the Government of India.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center justify-between">
              <span>SGST</span>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">State</span>
            </div>
            <div className="font-semibold text-zinc-200">State Goods & Services Tax</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Levied under individual State GST Acts. The remaining 50% goes to the state government where goods or services are consumed.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center justify-between">
              <span>IGST</span>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">Inter-State</span>
            </div>
            <div className="font-semibold text-zinc-200">Integrated Goods & Services Tax</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Levied on transactions between two different states or imports/exports under the IGST Act. Collected by Centre and apportioned to destination state.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center justify-between">
              <span>UTGST</span>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">Union Terr.</span>
            </div>
            <div className="font-semibold text-zinc-200">Union Territory Tax</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Applies in UTs without state legislative assemblies (Chandigarh, Ladakh, Andaman & Nicobar, Lakshadweep, Daman & Diu). Replaces SGST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
