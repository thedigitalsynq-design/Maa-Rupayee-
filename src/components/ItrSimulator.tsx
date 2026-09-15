import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  Percent
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/indianCurrency';

export const ItrSimulator: React.FC = () => {
  // Incomes
  const [grossSalary, setGrossSalary] = useState<number>(1200000);
  const [otherIncome, setOtherIncome] = useState<number>(50000);

  // Deductions (Old Regime)
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [nps80CCD, setNps80CCD] = useState<number>(50000);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);

  // Age group
  const [ageGroup, setAgeGroup] = useState<'below60' | 'senior' | 'superSenior'>('below60');

  // Compute New Regime Tax (FY 2025-26)
  const standardDeductionNew = 75000;
  const taxableIncomeNew = Math.max(0, grossSalary + otherIncome - standardDeductionNew);

  let taxNew = 0;
  if (taxableIncomeNew > 1500000) {
    taxNew += (taxableIncomeNew - 1500000) * 0.30;
    taxNew += 300000 * 0.20; // 12L to 15L
    taxNew += 200000 * 0.15; // 10L to 12L
    taxNew += 300000 * 0.10; // 7L to 10L
    taxNew += 400000 * 0.05; // 3L to 7L
  } else if (taxableIncomeNew > 1200000) {
    taxNew += (taxableIncomeNew - 1200000) * 0.20;
    taxNew += 200000 * 0.15;
    taxNew += 300000 * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 1000000) {
    taxNew += (taxableIncomeNew - 1000000) * 0.15;
    taxNew += 300000 * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 700000) {
    taxNew += (taxableIncomeNew - 700000) * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 300000) {
    taxNew += (taxableIncomeNew - 300000) * 0.05;
  }

  // Section 87A Rebate New Regime (up to 7 Lakh taxable income)
  if (taxableIncomeNew <= 700000) {
    taxNew = 0;
  }

  // Marginal relief if income is slightly above 7 Lakh
  if (taxableIncomeNew > 700000 && taxableIncomeNew <= 727770) {
    const excessIncome = taxableIncomeNew - 700000;
    if (taxNew > excessIncome) {
      taxNew = excessIncome;
    }
  }

  const cessNew = taxNew * 0.04;
  const totalTaxNew = Math.round(taxNew + cessNew);

  // Compute Old Regime Tax
  const standardDeductionOld = 50000;
  const capped80C = Math.min(150000, Math.max(0, sec80C));
  const capped80D = Math.min(100000, Math.max(0, sec80D));
  const cappedNps = Math.min(50000, Math.max(0, nps80CCD));
  const cappedHomeLoan = Math.min(200000, Math.max(0, homeLoanInterest));
  const totalDeductionsOld = standardDeductionOld + capped80C + capped80D + cappedNps + hraExemption + cappedHomeLoan;
  const taxableIncomeOld = Math.max(0, grossSalary + otherIncome - totalDeductionsOld);

  const basicExemptionOld = ageGroup === 'superSenior' ? 500000 : (ageGroup === 'senior' ? 300000 : 250000);

  let taxOld = 0;
  if (taxableIncomeOld > 1000000) {
    taxOld += (taxableIncomeOld - 1000000) * 0.30;
    taxOld += (1000000 - 500000) * 0.20;
    taxOld += (500000 - basicExemptionOld) * 0.05;
  } else if (taxableIncomeOld > 500000) {
    taxOld += (taxableIncomeOld - 500000) * 0.20;
    taxOld += (500000 - basicExemptionOld) * 0.05;
  } else if (taxableIncomeOld > basicExemptionOld) {
    taxOld += (taxableIncomeOld - basicExemptionOld) * 0.05;
  }

  // Section 87A Rebate Old Regime (up to 5 Lakh)
  if (taxableIncomeOld <= 500000) {
    taxOld = 0;
  }

  const cessOld = taxOld * 0.04;
  const totalTaxOld = Math.round(taxOld + cessOld);

  // Comparison
  const diff = Math.abs(totalTaxNew - totalTaxOld);
  const recommendedRegime = totalTaxNew <= totalTaxOld ? 'NEW' : 'OLD';

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-white animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2330] text-blue-400 text-xs font-semibold mb-2 border border-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Section 115BAC vs Old Regime Engine (FY 2025-26)</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Indian Income Tax Return (ITR) Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Instantly simulate your annual tax liability under both the New and Old Tax Regimes with accurate slab calculations, 87A rebate, standard deduction, and 80C/80D benefits.
        </p>
      </div>

      {/* Recommendation Banner */}
      <div className={`p-5 rounded-3xl border flex flex-wrap items-center justify-between gap-4 shadow-sm ${
        recommendedRegime === 'NEW' 
          ? 'bg-gradient-to-r from-emerald-950/50 to-blue-950/40 border-emerald-800/80' 
          : 'bg-gradient-to-r from-blue-950/50 to-indigo-950/40 border-blue-800/80'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Tax Optimizer Recommendation
            </div>
            <div className="text-lg font-bold text-white">
              {recommendedRegime === 'NEW' 
                ? `You save ${formatIndianCurrency(diff)} with the New Tax Regime!` 
                : `You save ${formatIndianCurrency(diff)} with the Old Tax Regime!`}
            </div>
            <p className="text-xs text-slate-300">
              {recommendedRegime === 'NEW'
                ? 'The New Regime provides a flat ₹75,000 standard deduction and lower tax slabs without requiring investments.'
                : 'Your high 80C, 80D, HRA and Home Loan deductions make the Old Regime more beneficial for you.'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Lowest Tax Payable</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatIndianCurrency(Math.min(totalTaxNew, totalTaxOld))}
          </span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Income Section */}
          <div className="p-5 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <span>Income Details (Annual)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Gross Annual Salary (₹)</label>
                <input 
                  type="number" 
                  value={grossSalary || ''}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Other Income (FD, Savings, Freelance) (₹)</label>
                <input 
                  type="number" 
                  value={otherIncome || ''}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span>Taxpayer Category:</span>
              <div className="flex gap-2">
                {[
                  { id: 'below60', label: 'Regular (< 60)' },
                  { id: 'senior', label: 'Senior (60-80)' },
                  { id: 'superSenior', label: 'Super Senior (80+)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setAgeGroup(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                      ageGroup === cat.id
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deductions Section (Old Regime) */}
          <div className="p-5 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Chapter VI-A Deductions (Old Regime Only)</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Not applicable in New Regime
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Section 80C (PPF, ELSS, EPF, LIC - Max 1.5L)</label>
                <input 
                  type="number" 
                  value={sec80C || ''}
                  onChange={(e) => setSec80C(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Section 80D (Health Insurance Premium)</label>
                <input 
                  type="number" 
                  value={sec80D || ''}
                  onChange={(e) => setSec80D(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">80CCD(1B) NPS Additional Deduction (Max 50k)</label>
                <input 
                  type="number" 
                  value={nps80CCD || ''}
                  onChange={(e) => setNps80CCD(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">HRA Exemption / Rent Paid Allowance</label>
                <input 
                  type="number" 
                  value={hraExemption || ''}
                  onChange={(e) => setHraExemption(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Section 24(b) Home Loan Interest (Max 2 Lakh)</label>
                <input 
                  type="number" 
                  value={homeLoanInterest || ''}
                  onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#12141c] border border-slate-700/80 rounded-xl text-white font-mono font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Comparison Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* New Regime Card */}
          <div className={`p-5 rounded-3xl border transition-all ${
            recommendedRegime === 'NEW' 
              ? 'bg-[#181d26] border-blue-500 shadow-md ring-1 ring-blue-500/40' 
              : 'bg-[#151821] border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>NEW TAX REGIME (Sec 115BAC)</span>
                {recommendedRegime === 'NEW' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    RECOMMENDED
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-400">Default Regime</span>
            </div>

            <div className="space-y-2 text-xs border-b border-slate-800 pb-3 mb-3">
              <div className="flex justify-between text-slate-400">
                <span>Gross Income:</span>
                <span className="font-mono text-slate-200">{formatIndianCurrency(grossSalary + otherIncome)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Standard Deduction:</span>
                <span className="font-mono text-emerald-400">- ₹75,000</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Net Taxable Income:</span>
                <span className="font-mono text-white font-bold">{formatIndianCurrency(taxableIncomeNew)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Income Tax:</span>
                <span className="font-mono text-slate-200">{formatIndianCurrency(taxNew)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Health & Edu Cess (4%):</span>
                <span className="font-mono text-slate-200">{formatIndianCurrency(cessNew)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-300">Total Tax Payable</span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {formatIndianCurrency(totalTaxNew)}
              </span>
            </div>
          </div>

          {/* Old Regime Card */}
          <div className={`p-5 rounded-3xl border transition-all ${
            recommendedRegime === 'OLD' 
              ? 'bg-[#181d26] border-emerald-500 shadow-md ring-1 ring-emerald-500/40' 
              : 'bg-[#151821] border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>OLD TAX REGIME</span>
                {recommendedRegime === 'OLD' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    RECOMMENDED
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-400">With Deductions</span>
            </div>

            <div className="space-y-2 text-xs border-b border-slate-800 pb-3 mb-3">
              <div className="flex justify-between text-slate-400">
                <span>Gross Income:</span>
                <span className="font-mono text-slate-200">{formatIndianCurrency(grossSalary + otherIncome)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Standard Deduction:</span>
                <span className="font-mono text-slate-200">- ₹50,000</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Chapter VI-A Deductions:</span>
                <span className="font-mono text-emerald-400">- {formatIndianCurrency(totalDeductionsOld - standardDeductionOld)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Net Taxable Income:</span>
                <span className="font-mono text-white font-bold">{formatIndianCurrency(taxableIncomeOld)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Income Tax:</span>
                <span className="font-mono text-slate-200">{formatIndianCurrency(taxOld)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Health & Edu Cess (4%):</span>
                <span className="font-mono text-slate-200">{formatIndianCurrency(cessOld)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-300">Total Tax Payable</span>
              <span className="text-2xl font-extrabold text-white font-mono">
                {formatIndianCurrency(totalTaxOld)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
