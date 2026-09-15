import React, { useState } from 'react';
import { 
  CreditCard, 
  Home, 
  Car, 
  User, 
  GraduationCap, 
  Percent, 
  Calendar, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/indianCurrency';

export const LoanEmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(4000000); // 40 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.75); // 8.75% home loan
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [monthlyPrepayment, setMonthlyPrepayment] = useState<number>(0);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const principal = Math.max(0, loanAmount);
  const totalMonths = tenureYears * 12;
  const monthlyRate = interestRate / 12 / 100;

  let emi = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else if (totalMonths > 0) {
    emi = principal / totalMonths;
  }

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const principalPercent = totalPayment > 0 ? (principal / totalPayment) * 100 : 50;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  // Presets
  const handlePreset = (type: 'home' | 'car' | 'personal' | 'edu') => {
    if (type === 'home') {
      setLoanAmount(5000000);
      setInterestRate(8.5);
      setTenureYears(20);
    } else if (type === 'car') {
      setLoanAmount(1000000);
      setInterestRate(9.2);
      setTenureYears(5);
    } else if (type === 'personal') {
      setLoanAmount(500000);
      setInterestRate(12.5);
      setTenureYears(3);
    } else if (type === 'edu') {
      setLoanAmount(1500000);
      setInterestRate(10.0);
      setTenureYears(7);
    }
  };

  // Year-by-Year Amortization Schedule
  const amortizationSchedule = [];
  let remainingPrincipal = principal;
  for (let year = 1; year <= Math.min(tenureYears, 30); year++) {
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let month = 1; month <= 12; month++) {
      if (remainingPrincipal <= 0) break;
      const interestForMonth = remainingPrincipal * monthlyRate;
      const principalForMonth = Math.min(remainingPrincipal, emi - interestForMonth);
      yearlyInterest += interestForMonth;
      yearlyPrincipal += principalForMonth;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalForMonth);
    }

    amortizationSchedule.push({
      year,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      totalYearlyPayment: Math.round(yearlyPrincipal + yearlyInterest),
      closingBalance: Math.round(remainingPrincipal)
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-white animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2330] text-blue-400 text-xs font-semibold mb-2 border border-slate-700">
          <CreditCard className="h-3.5 w-3.5 text-blue-400" />
          <span>India Banking & RBI Formula Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Loan EMI, Principal & Interest Calculator
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Compute accurate monthly EMIs for Home, Car, and Personal Loans in India. Inspect full amortization schedules and find out how much interest you pay to the bank.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-400">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handlePreset('home')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Home className="h-3 w-3 text-blue-400" />
            <span>Home Loan (50L, 8.5%, 20Y)</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('car')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Car className="h-3 w-3 text-emerald-400" />
            <span>Car Loan (10L, 9.2%, 5Y)</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('personal')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <User className="h-3 w-3 text-amber-400" />
            <span>Personal Loan (5L, 12.5%, 3Y)</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreset('edu')}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <GraduationCap className="h-3 w-3 text-purple-400" />
            <span>Education (15L, 10%, 7Y)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm space-y-5">
            {/* Loan Amount */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-300">Loan Amount (Principal)</span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#12141c] border border-slate-700 rounded-xl font-mono text-white font-bold text-sm">
                  <span>₹</span>
                  <span>{loanAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <input 
                type="range"
                min="50000"
                max="20000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2f66ee]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹50,000</span>
                <span>₹50 Lakhs</span>
                <span>₹1 Crore</span>
                <span>₹2 Crores</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-300">Annual Interest Rate (% p.a.)</span>
                <div className="flex items-center gap-1 px-3 py-1 bg-[#12141c] border border-slate-700 rounded-xl font-mono text-blue-400 font-bold text-sm">
                  <span>{interestRate}%</span>
                </div>
              </div>
              <input 
                type="range"
                min="5"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2f66ee]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>7.5% (SBI Home)</span>
                <span>9.0% (Auto Loan)</span>
                <span>12.5% (Personal)</span>
                <span>20%+ (NBFC)</span>
              </div>
            </div>

            {/* Tenure Years */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-300">Loan Tenure</span>
                <div className="flex items-center gap-1 px-3 py-1 bg-[#12141c] border border-slate-700 rounded-xl font-mono text-amber-400 font-bold text-sm">
                  <span>{tenureYears} Years ({totalMonths} Months)</span>
                </div>
              </div>
              <input 
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2f66ee]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Output Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              EMI & Interest Summary
            </h3>

            {/* Big Monthly EMI */}
            <div>
              <div className="text-xs text-slate-400">Monthly Loan EMI</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#2f66ee] font-mono tracking-tight mt-1">
                {formatIndianCurrency(Math.round(emi))}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Per month for {totalMonths} instalments
              </div>
            </div>

            {/* Visual Ratio Bar: Principal vs Interest */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div 
                  style={{ width: `${principalPercent}%` }} 
                  className="bg-emerald-500 transition-all duration-500" 
                  title={`Principal: ${principalPercent.toFixed(1)}%`}
                />
                <div 
                  style={{ width: `${interestPercent}%` }} 
                  className="bg-[#ff5b35] transition-all duration-500" 
                  title={`Interest: ${interestPercent.toFixed(1)}%`}
                />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Principal ({principalPercent.toFixed(1)}%)
                </span>
                <span className="flex items-center gap-1.5 text-[#ff5b35] font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#ff5b35]"></span>
                  Interest ({interestPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-4 rounded-2xl bg-[#12141c] border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Principal Amount:</span>
                <span className="font-mono text-white font-bold">{formatIndianCurrency(principal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Interest Payable:</span>
                <span className="font-mono text-[#ff5b35] font-bold">+{formatIndianCurrency(Math.round(totalInterest))}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="font-bold text-slate-200">Total Payment:</span>
                <span className="font-mono text-white font-bold text-sm">{formatIndianCurrency(Math.round(totalPayment))}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>{showAmortization ? 'Hide Amortization Table' : 'View Year-by-Year Schedule'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Amortization Table (Expandable) */}
      {showAmortization && (
        <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm animate-in fade-in">
          <h3 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
            <span>Yearly Loan Repayment Schedule</span>
            <span className="text-xs text-slate-400 font-normal">({tenureYears} Years Amortization)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-2.5 font-semibold">Year</th>
                  <th className="pb-2.5 font-semibold">Principal Paid</th>
                  <th className="pb-2.5 font-semibold">Interest Paid</th>
                  <th className="pb-2.5 font-semibold">Total Paid</th>
                  <th className="pb-2.5 font-semibold text-right">Balance Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {amortizationSchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 text-slate-300 font-sans font-medium">Year {row.year}</td>
                    <td className="py-2.5 text-emerald-400">{formatIndianCurrency(row.principalPaid)}</td>
                    <td className="py-2.5 text-[#ff5b35]">{formatIndianCurrency(row.interestPaid)}</td>
                    <td className="py-2.5 text-slate-200">{formatIndianCurrency(row.totalYearlyPayment)}</td>
                    <td className="py-2.5 text-right text-slate-300 font-bold">{formatIndianCurrency(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
