import React, { useState } from 'react';
import { 
  TrendingUp, 
  Coins, 
  PieChart, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sliders,
  Award
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/indianCurrency';

export const SipCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [isStepUp, setIsStepUp] = useState<boolean>(false);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(false);
  const inflationRate = 6; // 6% average Indian CPI inflation

  // Regular SIP formula: M = P * ((1 + i)^n - 1) / i * (1 + i)
  // Step-up SIP: Calculated year by year
  const totalMonths = tenureYears * 12;
  const monthlyRate = expectedReturnRate / 12 / 100;

  let totalInvested = 0;
  let maturityValue = 0;

  if (!isStepUp) {
    totalInvested = monthlyInvestment * totalMonths;
    if (monthlyRate > 0) {
      maturityValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    } else {
      maturityValue = totalInvested;
    }
  } else {
    // Step up month by month
    let currentMonthly = monthlyInvestment;
    for (let year = 1; year <= tenureYears; year++) {
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthly;
        // Remaining months for this specific instalment to compound
        const remainingMonths = totalMonths - ((year - 1) * 12 + month) + 1;
        maturityValue += currentMonthly * Math.pow(1 + monthlyRate, remainingMonths);
      }
      currentMonthly += currentMonthly * (stepUpPercent / 100);
    }
  }

  const wealthGain = Math.max(0, maturityValue - totalInvested);

  // Inflation adjusted value: Present Value = Future Value / (1 + r)^n
  const realValue = inflationAdjusted 
    ? maturityValue / Math.pow(1 + inflationRate / 100, tenureYears) 
    : maturityValue;

  const investedPercent = maturityValue > 0 ? (totalInvested / maturityValue) * 100 : 50;
  const gainPercent = maturityValue > 0 ? (wealthGain / maturityValue) * 100 : 50;

  // Rule of 72
  const doublingYears = expectedReturnRate > 0 ? (72 / expectedReturnRate).toFixed(1) : 'N/A';

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-white animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2330] text-emerald-400 text-xs font-semibold mb-2 border border-slate-700">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>Indian Equity & Mutual Fund Wealth Accumulation</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Systematic Investment Plan (SIP) & Mutual Fund Calculator
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Calculate the power of monthly compounding in Indian Mutual Funds (Nifty 50, Flexi-cap, Mid-cap) with optional Step-Up SIP and inflation adjustment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm space-y-5">
            {/* Monthly Investment */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-300">Monthly Investment Amount</span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#12141c] border border-slate-700 rounded-xl font-mono text-emerald-400 font-bold text-sm">
                  <span>₹</span>
                  <span>{monthlyInvestment.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <input 
                type="range"
                min="500"
                max="200000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2f66ee]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹500</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-300">Expected Return Rate (% p.a.)</span>
                <div className="flex items-center gap-1 px-3 py-1 bg-[#12141c] border border-slate-700 rounded-xl font-mono text-blue-400 font-bold text-sm">
                  <span>{expectedReturnRate}%</span>
                </div>
              </div>
              <input 
                type="range"
                min="5"
                max="30"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2f66ee]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>8% (Debt/FD)</span>
                <span>12% (Nifty Index)</span>
                <span>15% (Active Flexi-cap)</span>
                <span>18%+ (Small-cap)</span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-300">Time Horizon (Years)</span>
                <div className="flex items-center gap-1 px-3 py-1 bg-[#12141c] border border-slate-700 rounded-xl font-mono text-amber-400 font-bold text-sm">
                  <span>{tenureYears} Years</span>
                </div>
              </div>
              <input 
                type="range"
                min="1"
                max="35"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2f66ee]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>35 Years</span>
              </div>
            </div>

            {/* Step Up Toggle & Controls */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Step-Up SIP Feature</div>
                  <div className="text-[11px] text-slate-400">Increase your investment with yearly salary increments</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStepUp(!isStepUp)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isStepUp 
                      ? 'bg-[#2f66ee] text-white shadow-xs' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isStepUp ? 'Enabled (10%)' : 'Disabled'}
                </button>
              </div>

              {isStepUp && (
                <div className="mt-3 p-3 rounded-2xl bg-[#12141c] border border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Annual Increment Rate:</span>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setStepUpPercent(rate)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          stepUpPercent === rate ? 'bg-[#2f66ee] text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inflation Adjustment Toggle */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-300">Adjust for Inflation (6% p.a.)</span>
                <p className="text-[10px] text-slate-500">Shows real purchasing power of your maturity corpus</p>
              </div>
              <button
                type="button"
                onClick={() => setInflationAdjusted(!inflationAdjusted)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  inflationAdjusted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {inflationAdjusted ? 'Inflation ON' : 'Nominal'}
              </button>
            </div>
          </div>
        </div>

        {/* Wealth Output Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-[#171b24] border border-slate-800 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Projected Wealth Corpus
            </h3>

            {/* Big Maturity Metric */}
            <div>
              <div className="text-xs text-slate-400">
                {inflationAdjusted ? 'Inflation-Adjusted Purchasing Power' : 'Total Maturity Value'}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight mt-1">
                {formatIndianCurrency(realValue)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Accumulated over {tenureYears} years ({totalMonths} instalments)
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div 
                  style={{ width: `${investedPercent}%` }} 
                  className="bg-[#2f66ee] transition-all duration-500" 
                  title={`Invested: ${investedPercent.toFixed(1)}%`}
                />
                <div 
                  style={{ width: `${gainPercent}%` }} 
                  className="bg-emerald-500 transition-all duration-500" 
                  title={`Gains: ${gainPercent.toFixed(1)}%`}
                />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="h-2 w-2 rounded-full bg-[#2f66ee]"></span>
                  Invested: {investedPercent.toFixed(1)}%
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Gains: {gainPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-4 rounded-2xl bg-[#12141c] border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Invested Capital:</span>
                <span className="font-mono text-white font-bold">{formatIndianCurrency(totalInvested)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Wealth Gains:</span>
                <span className="font-mono text-emerald-400 font-bold">+{formatIndianCurrency(wealthGain)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Wealth Multiplier:</span>
                <span className="font-mono text-blue-400 font-bold">
                  {totalInvested > 0 ? (maturityValue / totalInvested).toFixed(2) : 1}x
                </span>
              </div>
            </div>

            {/* Compounding Wisdom Milestone */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-3">
              <Award className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">Rule of 72 Compounding:</span> At {expectedReturnRate}%, your invested money doubles every <strong>{doublingYears} years</strong>.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
