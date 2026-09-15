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
  Percent,
  Landmark
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

  // Compute New Regime Tax (FY 2025-26 / AY 2026-27, Finance Act 2025)
  // Slabs: 0-4L nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, >24L 30%
  // Standard deduction applies against salary income only.
  const standardDeductionNew = Math.min(75000, Math.max(0, grossSalary));
  const taxableIncomeNew = Math.max(0, grossSalary + otherIncome - standardDeductionNew);

  let taxNew = 0;
  if (taxableIncomeNew > 2400000) {
    taxNew += (taxableIncomeNew - 2400000) * 0.30;
    taxNew += 400000 * 0.25; // 20L to 24L
    taxNew += 400000 * 0.20; // 16L to 20L
    taxNew += 400000 * 0.15; // 12L to 16L
    taxNew += 400000 * 0.10; // 8L to 12L
    taxNew += 400000 * 0.05; // 4L to 8L
  } else if (taxableIncomeNew > 2000000) {
    taxNew += (taxableIncomeNew - 2000000) * 0.25;
    taxNew += 400000 * 0.20;
    taxNew += 400000 * 0.15;
    taxNew += 400000 * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 1600000) {
    taxNew += (taxableIncomeNew - 1600000) * 0.20;
    taxNew += 400000 * 0.15;
    taxNew += 400000 * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 1200000) {
    taxNew += (taxableIncomeNew - 1200000) * 0.15;
    taxNew += 400000 * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 800000) {
    taxNew += (taxableIncomeNew - 800000) * 0.10;
    taxNew += 400000 * 0.05;
  } else if (taxableIncomeNew > 400000) {
    taxNew += (taxableIncomeNew - 400000) * 0.05;
  }

  // Section 87A Rebate New Regime FY25-26: nil tax up to ₹12L taxable income
  if (taxableIncomeNew <= 1200000) {
    taxNew = 0;
  }

  // Marginal relief just above ₹12L: income-tax capped at the excess over ₹12L
  // (87A relief applies to income-tax; 4% health & education cess is levied after)
  if (taxableIncomeNew > 1200000) {
    const excessIncome = taxableIncomeNew - 1200000;
    if (taxNew > excessIncome) {
      taxNew = excessIncome;
    }
  }

  // Surcharge (new regime capped at 25%): 10% above ₹50L, 15% above ₹1Cr, 25% above ₹2Cr
  const surchargeNew = taxableIncomeNew > 20000000 ? taxNew * 0.25
    : taxableIncomeNew > 10000000 ? taxNew * 0.15
    : taxableIncomeNew > 5000000 ? taxNew * 0.10 : 0;
  const cessNew = (taxNew + surchargeNew) * 0.04;
  const totalTaxNew = Math.round(taxNew + surchargeNew + cessNew);

  // Compute Old Regime Tax (standard deduction applies against salary income only)
  const standardDeductionOld = Math.min(50000, Math.max(0, grossSalary));
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

  // Surcharge (old regime up to 37%): 10% above ₹50L, 15% above ₹1Cr, 25% above ₹2Cr, 37% above ₹5Cr
  const surchargeOld = taxableIncomeOld > 50000000 ? taxOld * 0.37
    : taxableIncomeOld > 20000000 ? taxOld * 0.25
    : taxableIncomeOld > 10000000 ? taxOld * 0.15
    : taxableIncomeOld > 5000000 ? taxOld * 0.10 : 0;
  const cessOld = (taxOld + surchargeOld) * 0.04;
  const totalTaxOld = Math.round(taxOld + surchargeOld + cessOld);

  // Comparison
  const diff = Math.abs(totalTaxNew - totalTaxOld);
  const recommendedRegime = totalTaxNew <= totalTaxOld ? 'NEW' : 'OLD';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <Landmark className="h-3.5 w-3.5" />
          <span>Section 115BAC vs Old Regime Engine (FY 2025-26)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Indian Income Tax Return (ITR) Simulator
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Instantly simulate your annual tax liability under both the New and Old Tax Regimes with accurate slab calculations, 87A rebate, standard deduction, and 80C/80D benefits.
        </p>
      </div>

      {/* Recommendation Banner */}
      <div className="p-6 sm:p-7 rounded-[32px] glass-card shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-black text-xl shadow-sm">
            ✓
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Tax Optimizer Recommendation
            </div>
            <div className="text-lg sm:text-xl font-black">
              {recommendedRegime === 'NEW' 
                ? `You save ${formatIndianCurrency(diff)} with the New Tax Regime!` 
                : `You save ${formatIndianCurrency(diff)} with the Old Tax Regime!`}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 max-w-xl leading-relaxed">
              {recommendedRegime === 'NEW'
                ? 'The New Regime provides a flat ₹75,000 standard deduction and lower tax slabs without requiring investments.'
                : 'Your high 80C, 80D, HRA and Home Loan deductions make the Old Regime more beneficial for you.'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-zinc-500 block font-medium">Lowest Tax Payable</span>
          <span className="text-3xl font-black font-mono tracking-tight">
            {formatIndianCurrency(Math.min(totalTaxNew, totalTaxOld))}
          </span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Income Section */}
          <div className="p-6 sm:p-7 rounded-[32px] glass-card shadow-sm space-y-5">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Income Details (Annual)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-500 font-semibold mb-1.5">Gross Annual Salary (₹)</label>
                <input 
                  type="number" 
                  value={grossSalary || ''}
                  onChange={(e) => setGrossSalary(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-semibold mb-1.5">Other Income (FD, Savings, Freelance) (₹)</label>
                <input 
                  type="number" 
                  value={otherIncome || ''}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-200/80 text-xs">
              <span className="text-zinc-500 font-medium">Taxpayer Category:</span>
              <div className="flex gap-2">
                {([
                  { id: 'below60', label: 'Regular (< 60)' },
                  { id: 'senior', label: 'Senior (60-80)' },
                  { id: 'superSenior', label: 'Super Senior (80+)' },
                ] as const).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setAgeGroup(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      ageGroup === cat.id
                        ? 'bg-zinc-950 text-white font-bold shadow-xs'
                        : 'glass-pill text-zinc-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Deductions Section (Old Regime) */}
          <div className="p-6 sm:p-7 rounded-[32px] glass-card shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Chapter VI-A Deductions (Old Regime Only)</span>
              </h3>
              <span className="text-[10px] px-2.5 py-1 rounded-full glass-pill text-zinc-500 font-medium">
                Not applicable in New Regime
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-500 font-semibold mb-1.5">Section 80C (PPF, ELSS, EPF, LIC - Max 1.5L)</label>
                <input 
                  type="number" 
                  value={sec80C || ''}
                  onChange={(e) => setSec80C(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-semibold mb-1.5">Section 80D (Health Insurance Premium)</label>
                <input 
                  type="number" 
                  value={sec80D || ''}
                  onChange={(e) => setSec80D(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-semibold mb-1.5">80CCD(1B) NPS Additional Deduction (Max 50k)</label>
                <input 
                  type="number" 
                  value={nps80CCD || ''}
                  onChange={(e) => setNps80CCD(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-semibold mb-1.5">HRA Exemption / Rent Paid Allowance</label>
                <input 
                  type="number" 
                  value={hraExemption || ''}
                  onChange={(e) => setHraExemption(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-500 font-semibold mb-1.5">Section 24(b) Home Loan Interest (Max 2 Lakh)</label>
                <input 
                  type="number" 
                  value={homeLoanInterest || ''}
                  onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                  className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Comparison Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* New Regime Card */}
          <div className={`p-6 sm:p-7 rounded-[32px] glass-card shadow-sm transition-all ${
            recommendedRegime === 'NEW' 
              ? 'ring-2 ring-zinc-950' 
              : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold flex items-center gap-2">
                <span>NEW TAX REGIME (Sec 115BAC)</span>
                {recommendedRegime === 'NEW' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-black">
                    RECOMMENDED
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Default Regime</span>
            </div>

            <div className="space-y-2.5 text-xs border-b border-zinc-200 pb-4 mb-4">
              <div className="flex justify-between text-zinc-500">
                <span>Gross Income:</span>
                <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(grossSalary + otherIncome)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Standard Deduction:</span>
                <span className="font-mono font-semibold text-zinc-900">- {formatIndianCurrency(standardDeductionNew)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Net Taxable Income:</span>
                <span className="font-mono font-bold text-zinc-950">{formatIndianCurrency(taxableIncomeNew)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Income Tax:</span>
                <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(taxNew)}</span>
              </div>
              {surchargeNew > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>Surcharge:</span>
                  <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(surchargeNew)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Health & Edu Cess (4%):</span>
                <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(cessNew)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-zinc-500">Total Tax Payable</span>
              <span className="text-3xl font-black font-mono tracking-tight">
                {formatIndianCurrency(totalTaxNew)}
              </span>
            </div>
          </div>

          {/* Old Regime Card */}
          <div className={`p-6 sm:p-7 rounded-[32px] glass-card shadow-sm transition-all ${
            recommendedRegime === 'OLD' 
              ? 'ring-2 ring-zinc-950' 
              : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold flex items-center gap-2">
                <span>OLD TAX REGIME</span>
                {recommendedRegime === 'OLD' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-black">
                    RECOMMENDED
                  </span>
                )}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">With Deductions</span>
            </div>

            <div className="space-y-2.5 text-xs border-b border-zinc-200 pb-4 mb-4">
              <div className="flex justify-between text-zinc-500">
                <span>Gross Income:</span>
                <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(grossSalary + otherIncome)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Standard Deduction:</span>
                <span className="font-mono font-semibold text-zinc-900">- {formatIndianCurrency(standardDeductionOld)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Chapter VI-A Deductions:</span>
                <span className="font-mono font-semibold text-zinc-900">- {formatIndianCurrency(totalDeductionsOld - standardDeductionOld)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Net Taxable Income:</span>
                <span className="font-mono font-bold text-zinc-950">{formatIndianCurrency(taxableIncomeOld)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Income Tax:</span>
                <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(taxOld)}</span>
              </div>
              {surchargeOld > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>Surcharge:</span>
                  <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(surchargeOld)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-500">
                <span>Health & Edu Cess (4%):</span>
                <span className="font-mono font-semibold text-zinc-900">{formatIndianCurrency(cessOld)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-zinc-500">Total Tax Payable</span>
              <span className="text-3xl font-black font-mono tracking-tight">
                {formatIndianCurrency(totalTaxOld)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
