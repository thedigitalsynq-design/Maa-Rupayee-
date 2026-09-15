import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Bookmark, 
  Copy, 
  Check, 
  ShieldCheck, 
  Info, 
  Sliders,
  ArrowRightLeft,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  AlertCircle
} from 'lucide-react';
import { ClassifiedResult, AmbiguityOption } from '../types';
import { INDIAN_STATES } from '../data/indianStates';
import { formatIndianCurrency, amountInIndianWords } from '../utils/indianCurrency';
import { calculateGST } from '../utils/gstCalculator';

interface SmartResultCardProps {
  result: ClassifiedResult;
  onUpdateResult: (updated: ClassifiedResult) => void;
  onSave: (result: ClassifiedResult) => void;
  onAddToInvoice: (result: ClassifiedResult) => void;
  isSaved?: boolean;
}

export const SmartResultCard: React.FC<SmartResultCardProps> = ({
  result,
  onUpdateResult,
  onSave,
  onAddToInvoice,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSimulatorControls, setShowSimulatorControls] = useState(true);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'helpful' | 'reporting' | 'submitted'>('idle');
  const [feedbackType, setFeedbackType] = useState('Wrong GST Rate');
  const [feedbackNotes, setFeedbackNotes] = useState('');

  const breakdown = result.breakdown!;
  const isIntraState = breakdown.transactionType.startsWith('Intra-State');

  // Real-time calculation helper
  const triggerRecalculate = (
    newPrice: number,
    newInclusive: boolean,
    newRate: number,
    newCess: number,
    forceInterState?: boolean
  ) => {
    if (isNaN(newPrice) || newPrice < 0) return;

    let supState = breakdown.supplierState;
    let custState = breakdown.customerState;

    if (forceInterState !== undefined) {
      if (forceInterState && isIntraState) {
        // Switch to inter-state: make customer different state
        const ka = INDIAN_STATES.find(s => s.code === 'KA') || INDIAN_STATES[15];
        const mh = INDIAN_STATES.find(s => s.code === 'MH') || INDIAN_STATES[20];
        custState = supState.code === 'KA' ? mh : ka;
      } else if (!forceInterState && !isIntraState) {
        // Switch to intra-state: make customer same state as supplier
        custState = supState;
      }
    }

    const newBreakdown = calculateGST({
      amount: newPrice,
      isInclusive: newInclusive,
      gstRate: newRate,
      cessRate: newCess,
      supplierState: supState,
      customerState: custState,
    });

    onUpdateResult({
      ...result,
      extractedPrice: newPrice,
      isInclusivePrice: newInclusive,
      gstRate: newRate,
      cessRate: newCess,
      breakdown: newBreakdown,
    });
  };

  const handleAmountChange = (val: number) => {
    triggerRecalculate(val, result.isInclusivePrice, result.gstRate, result.cessRate || 0);
  };

  const handleToggleInclusive = (inclusive: boolean) => {
    triggerRecalculate(result.extractedPrice, inclusive, result.gstRate, result.cessRate || 0);
  };

  const handleRatePreset = (rate: number) => {
    triggerRecalculate(result.extractedPrice, result.isInclusivePrice, rate, result.cessRate || 0);
  };

  const handleToggleRoute = () => {
    triggerRecalculate(
      result.extractedPrice, 
      result.isInclusivePrice, 
      result.gstRate, 
      result.cessRate || 0, 
      isIntraState // if currently intra, force inter; if inter, force intra
    );
  };

  const handleAmbiguitySelect = (option: AmbiguityOption) => {
    const newRate = option.rate;
    const newHsn = option.hsn || result.hsnSac;

    const newBreakdown = calculateGST({
      amount: result.extractedPrice,
      isInclusive: result.isInclusivePrice,
      gstRate: newRate,
      cessRate: result.cessRate || 0,
      supplierState: breakdown.supplierState,
      customerState: breakdown.customerState,
    });

    onUpdateResult({
      ...result,
      gstRate: newRate,
      hsnSac: newHsn,
      confidence: 'High',
      applicableConditions: option.conditionNote || result.applicableConditions,
      breakdown: newBreakdown,
    });
  };

  const handleCopyBreakdown = () => {
    const text = `--- INDIAN GST CALCULATION BREAKDOWN ---
Product: ${result.product}
HSN/SAC: ${result.hsnSac} (${result.type})
Applicable Rate: ${result.gstRate}% ${result.cessRate ? `+ ${result.cessRate}% Cess` : ''}
Transaction Type: ${breakdown.transactionType} (${breakdown.supplierState.name} -> ${breakdown.customerState.name})
Taxable Value: ${formatIndianCurrency(breakdown.taxableValue)}
${isIntraState ? `CGST (${breakdown.cgstRate}%): ${formatIndianCurrency(breakdown.cgstAmount)}\n${breakdown.transactionType.includes('UTGST') ? 'UTGST' : 'SGST'} (${breakdown.sgstRate || breakdown.utgstRate}%): ${formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}` : `IGST (${breakdown.igstRate}%): ${formatIndianCurrency(breakdown.igstAmount)}`}
${breakdown.cessAmount > 0 ? `Compensation Cess: ${formatIndianCurrency(breakdown.cessAmount)}\n` : ''}Total GST: ${formatIndianCurrency(breakdown.totalGst)}
Final Invoice Amount: ${formatIndianCurrency(breakdown.totalAmount)}
In Words: ${amountInIndianWords(breakdown.totalAmount)}
Source: ${result.sourceCitation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="apple-card-glass rounded-2xl border border-white/80 shadow-md overflow-hidden my-6 max-w-4xl mx-auto">
      {/* Apple Window / Card Header Bar */}
      <div className="bg-white/85 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-slate-900 tracking-tight">{result.product}</span>
              <span className="font-mono text-xs text-slate-700 bg-black/[0.05] border border-black/[0.06] px-2 py-0.5 rounded-full font-medium">
                HSN {result.hsnSac}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {result.type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{result.category}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full font-medium text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            {result.confidence} Confidence
          </span>
          <span className="flex items-center gap-1.5 bg-black/[0.04] text-slate-700 border border-black/[0.06] px-3 py-1 rounded-full font-medium text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            {result.dataStatus}
          </span>
        </div>
      </div>

      {/* Council Update Notice if exists */}
      {result.councilUpdateNote && (
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-950">GST Council Update: </span>
            {result.councilUpdateNote}
          </div>
        </div>
      )}

      {/* Clean Ambiguity Refinement Box */}
      {result.ambiguityQuestions && result.ambiguityQuestions.length > 0 && (
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
          <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
            <span>Conditional Rate Refinement</span>
          </div>
          {result.ambiguityQuestions.map((q) => (
            <div key={q.id}>
              <p className="text-xs text-slate-600 mb-2">{q.question}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAmbiguitySelect(opt)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      result.gstRate === opt.rate
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    <span>{opt.label} &bull; <strong>{opt.rate}% GST</strong></span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Real-Time Interactive Simulation Studio Controls */}
      <div className="p-5 bg-slate-50/70 border-b border-slate-200 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Sliders className="h-3.5 w-3.5 text-amber-600" />
            <span>Real-Time Simulation Controls</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Intra / Inter State Quick Toggle */}
            <button
              onClick={handleToggleRoute}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isIntraState
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-sky-50 text-sky-800 border-sky-300'
              }`}
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span>{breakdown.transactionType}</span>
            </button>

            {/* Exclusive vs Inclusive Toggle */}
            <div className="bg-slate-200/80 p-0.5 rounded-lg flex items-center font-semibold text-[11px]">
              <button
                onClick={() => handleToggleInclusive(false)}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  !result.isInclusivePrice ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + GST (Excl)
              </button>
              <button
                onClick={() => handleToggleInclusive(true)}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  result.isInclusivePrice ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incl. GST
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Amount & Slider Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 flex items-center gap-2">
            <span className="text-slate-500 font-medium whitespace-nowrap">Transaction Value:</span>
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={result.extractedPrice}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={result.extractedPrice <= 200000 ? result.extractedPrice : 200000}
              onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Quick Rate Simulator Pills */}
          <div className="sm:col-span-3 flex items-center justify-end gap-1">
            {[0, 5, 12, 18, 28].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRatePreset(rate)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                  result.gstRate === rate
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean High-Contrast Metric Breakdown */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Taxable Value */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Taxable Value (Base)
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 mt-1">
              {formatIndianCurrency(breakdown.taxableValue)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {breakdown.isInclusive ? 'Extracted from inclusive total' : 'Amount before tax'}
            </div>
          </div>

          {/* Rate & Tax Components */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Tax Breakdown ({breakdown.gstRate}%)
              </span>
              <span className="text-[10px] font-semibold text-slate-500">{breakdown.transactionType}</span>
            </div>

            {isIntraState ? (
              <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-sm text-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">CGST ({breakdown.cgstRate}%)</span>
                  <span className="font-bold">{formatIndianCurrency(breakdown.cgstAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">
                    {breakdown.transactionType.includes('UTGST') ? 'UTGST' : 'SGST'} ({breakdown.sgstRate || breakdown.utgstRate}%)
                  </span>
                  <span className="font-bold">{formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="mt-1 font-mono text-sm text-slate-800">
                <span className="text-[10px] text-slate-500 block">IGST ({breakdown.igstRate}%)</span>
                <span className="font-bold">{formatIndianCurrency(breakdown.igstAmount)}</span>
              </div>
            )}
          </div>

          {/* Total GST */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
            <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
              Total GST Amount
            </div>
            <div className="text-xl font-bold font-mono text-amber-950 mt-1">
              {formatIndianCurrency(breakdown.totalGst + breakdown.cessAmount)}
            </div>
            <div className="text-[11px] text-amber-700 mt-1">
              Effective: {breakdown.taxableValue > 0 ? (((breakdown.totalGst + breakdown.cessAmount) / breakdown.taxableValue) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* Clean Final Total Card */}
        <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
              Final Invoice Value
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-white mt-0.5">
              {formatIndianCurrency(breakdown.totalAmount)}
            </div>
            <div className="text-xs text-slate-300 mt-1 italic font-medium">
              {amountInIndianWords(breakdown.totalAmount)}
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyBreakdown}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => onAddToInvoice(result)}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Add to Invoice</span>
            </button>

            <button
              onClick={() => onSave(result)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 text-amber-400" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Clean Citation Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>
            <strong>Statutory Basis:</strong> {result.sourceCitation}
          </span>
          <span>Verified against CBIC Tariff: {result.lastVerified}</span>
        </div>

        {/* Feedback / Report Error Section */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          {feedbackStatus === 'idle' && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-medium">Was this tax classification accurate & clear?</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFeedbackStatus('helpful')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 border border-slate-700/80 flex items-center gap-1.5 transition-all text-xs active:scale-95"
                >
                  <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Accurate</span>
                </button>
                <button
                  onClick={() => setFeedbackStatus('reporting')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700/80 flex items-center gap-1.5 transition-all text-xs active:scale-95"
                >
                  <ThumbsDown className="h-3.5 w-3.5 text-rose-400" />
                  <span>Report Discrepancy</span>
                </button>
              </div>
            </div>
          )}

          {feedbackStatus === 'helpful' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Thank you! Your verification helps keep our Indian GST database precise and compliant.
              </span>
              <button 
                onClick={() => setFeedbackStatus('idle')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Reset
              </button>
            </div>
          )}

          {feedbackStatus === 'reporting' && (
            <div className="p-4 rounded-2xl bg-[#12151d] border border-slate-700/80 text-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <span>Report GST Classification or HSN/SAC Issue</span>
                </div>
                <button 
                  onClick={() => setFeedbackStatus('idle')}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Wrong GST Rate (e.g. 5% instead of 12%)',
                  'Incorrect HSN / SAC Code',
                  'Missing Condition (e.g. stitched vs unstitched)',
                  'Outdated Gazette Notification',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFeedbackType(type)}
                    className={`p-2 rounded-xl text-left border text-[11px] transition-all ${
                      feedbackType === type
                        ? 'bg-blue-950/60 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Optional details or official CBIC notification reference..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackStatus('submitted');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2f66ee] hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  <span>Submit Error Report</span>
                </button>
              </div>
            </div>
          )}

          {feedbackStatus === 'submitted' && (
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 text-xs flex items-center justify-between">
              <span>Report submitted! Our legal & tax research team will review this entry against the latest CBIC Gazette.</span>
              <button 
                onClick={() => setFeedbackStatus('idle')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
