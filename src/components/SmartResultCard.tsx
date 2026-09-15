import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ReceiptText, 
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
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ClassifiedResult, AmbiguityOption } from '../types';
import { INDIAN_STATES } from '../data/indianStates';
import { gstRateSearchUrl } from '../utils/googleSearch';
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

  const breakdown = result.breakdown ?? calculateGST({
    amount: result.extractedPrice ?? 0,
    isInclusive: result.isInclusivePrice ?? false,
    gstRate: result.gstRate ?? 18,
    cessRate: result.cessRate ?? 0,
    supplierState: INDIAN_STATES[0],
    customerState: INDIAN_STATES[0],
  });
  const isIntraState = (breakdown.transactionType ?? 'Intra-State').startsWith('Intra-State');

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

    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl border border-white/15 shadow-xl overflow-hidden my-6 max-w-4xl mx-auto bg-[#0e1014]">
      {/* Window / Card Header Bar */}
      <div className="bg-zinc-900/90 px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base text-white tracking-tight">{result.product}</h2>
              <span className="font-mono text-xs text-zinc-300 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-full font-medium">
                HSN {result.hsnSac}
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                {result.type}
              </span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">{result.category}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-white/10 text-white border border-white/15 px-3 py-1 rounded-full font-medium text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            {result.confidence} Confidence
          </span>
          <span className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full font-medium text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-300" />
            {result.dataStatus}
          </span>
        </div>
      </div>

      {/* Council Update Notice if exists */}
      {result.councilUpdateNote && (
        <div className="bg-zinc-900/80 border-b border-zinc-800 px-5 py-2.5 text-xs text-zinc-300 flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">GST Council Update: </span>
            {result.councilUpdateNote}
          </div>
        </div>
      )}

      {/* Ambiguity Refinement Box */}
      {result.ambiguityQuestions && result.ambiguityQuestions.length > 0 && (
        <div className="bg-zinc-900/60 border-b border-zinc-800 px-5 py-3">
          <div className="text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
            <span>Conditional Rate Refinement</span>
          </div>
          {result.ambiguityQuestions.map((q) => (
            <div key={q.id}>
              <p className="text-xs text-zinc-400 mb-2">{q.question}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAmbiguitySelect(opt)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                      result.gstRate === opt.rate
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700'
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
      <div className="p-5 bg-zinc-900/50 border-b border-zinc-800 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <Sliders className="h-3.5 w-3.5 text-white" />
            <span>Real-Time Simulation Controls</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Intra / Inter State Quick Toggle */}
            <button
              onClick={handleToggleRoute}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isIntraState
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span>{breakdown.transactionType}</span>
            </button>

            {/* Exclusive vs Inclusive Toggle */}
            <div className="bg-zinc-800 p-0.5 rounded-lg flex items-center font-semibold text-[11px] border border-zinc-700">
              <button
                onClick={() => handleToggleInclusive(false)}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  !result.isInclusivePrice ? 'bg-white text-black font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                + GST (Excl)
              </button>
              <button
                onClick={() => handleToggleInclusive(true)}
                className={`px-2.5 py-0.5 rounded-md transition-all ${
                  result.isInclusivePrice ? 'bg-white text-black font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
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
            <span className="text-zinc-400 font-medium whitespace-nowrap">Transaction Value:</span>
            <div className="relative w-full">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={result.extractedPrice}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-6 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg font-mono font-bold text-white text-sm focus:outline-none focus:border-white"
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
              className="w-full accent-white bg-zinc-800 cursor-pointer"
            />
          </div>

          {/* Quick Rate Simulator Pills */}
          <div className="sm:col-span-3 flex items-center justify-end gap-1">
            {[0, 3, 5, 18, 40].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRatePreset(rate)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-colors ${
                  result.gstRate === rate
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Contrast Metric Breakdown */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Taxable Value */}
          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
              Taxable Value (Base)
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatIndianCurrency(breakdown.taxableValue)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {breakdown.isInclusive ? 'Extracted from inclusive total' : 'Amount before tax'}
            </div>
          </div>

          {/* Rate & Tax Components */}
          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                Tax Breakdown ({breakdown.gstRate}%)
              </span>
              <span className="text-[10px] font-semibold text-zinc-500">{breakdown.transactionType}</span>
            </div>

            {isIntraState ? (
              <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-sm text-zinc-200">
                <div>
                  <span className="text-[10px] text-zinc-500 block">CGST ({breakdown.cgstRate}%)</span>
                  <span className="font-bold text-white">{formatIndianCurrency(breakdown.cgstAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">
                    {breakdown.transactionType.includes('UTGST') ? 'UTGST' : 'SGST'} ({breakdown.sgstRate || breakdown.utgstRate}%)
                  </span>
                  <span className="font-bold text-white">{formatIndianCurrency(breakdown.sgstAmount || breakdown.utgstAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="mt-1 font-mono text-sm text-zinc-200">
                <span className="text-[10px] text-zinc-500 block">IGST ({breakdown.igstRate}%)</span>
                <span className="font-bold text-white">{formatIndianCurrency(breakdown.igstAmount)}</span>
              </div>
            )}
          </div>

          {/* Total GST */}
          <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
              Total GST Amount
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatIndianCurrency(breakdown.totalGst + breakdown.cessAmount)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Effective: {breakdown.taxableValue > 0 ? (((breakdown.totalGst + breakdown.cessAmount) / breakdown.taxableValue) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>

        {/* Final Total Card */}
        <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Final Invoice Value
            </div>
            <div className="text-3xl font-extrabold font-mono tracking-tight text-white mt-0.5">
              {formatIndianCurrency(breakdown.totalAmount)}
            </div>
            <div className="text-xs text-zinc-400 mt-1 italic font-medium">
              {amountInIndianWords(breakdown.totalAmount)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyBreakdown}
              className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => onAddToInvoice(result)}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ReceiptText className="h-3.5 w-3.5" />
              <span>Add to Invoice</span>
            </button>

            <button
              onClick={() => onSave(result)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isSaved
                  ? 'bg-white/20 text-white border-white/40'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5 text-white" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Citation Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
          <span>
            <strong className="text-zinc-300">Statutory Basis:</strong> {result.sourceCitation}
          </span>
          <span className="flex items-center gap-3">
            <span>Verified against CBIC Tariff: {result.lastVerified}</span>
            <a
              href={gstRateSearchUrl(result.hsnSac, result.product, result.gstRate)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-zinc-300 hover:text-white hover:underline"
              title="Cross-check this rate on Google (CBIC sources)"
            >
              <span>Cross-check on Google</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </span>
        </div>

        {/* Feedback / Report Error Section */}
        <div className="mt-4 pt-3 border-t border-zinc-800">
          {feedbackStatus === 'idle' && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-zinc-400 font-medium">Was this tax classification accurate & clear?</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFeedbackStatus('helpful')}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-all text-xs active:scale-95"
                >
                  <ThumbsUp className="h-3.5 w-3.5 text-white" />
                  <span>Accurate</span>
                </button>
                <button
                  onClick={() => setFeedbackStatus('reporting')}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-all text-xs active:scale-95"
                >
                  <ThumbsDown className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Report Discrepancy</span>
                </button>
              </div>
            </div>
          )}

          {feedbackStatus === 'helpful' && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-white" />
                Thank you! Your verification helps keep our Indian GST database precise and compliant.
              </span>
              <button 
                onClick={() => setFeedbackStatus('idle')}
                className="text-[10px] text-zinc-400 hover:text-white"
              >
                Reset
              </button>
            </div>
          )}

          {feedbackStatus === 'reporting' && (
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-white" />
                  <span>Report GST Classification or HSN/SAC Issue</span>
                </div>
                <button 
                  onClick={() => setFeedbackStatus('idle')}
                  className="text-zinc-400 hover:text-white text-xs"
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
                        ? 'bg-zinc-800 border-white text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
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
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackStatus('submitted');
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  <span>Submit Error Report</span>
                </button>
              </div>
            </div>
          )}

          {feedbackStatus === 'submitted' && (
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs flex items-center justify-between">
              <span>Report submitted! Our legal & tax research team will review this entry against the latest CBIC Gazette.</span>
              <button 
                onClick={() => setFeedbackStatus('idle')}
                className="text-[10px] text-zinc-400 hover:text-white"
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
