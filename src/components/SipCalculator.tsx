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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-[32px] glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Indian Equity & Mutual Fund Wealth Accumulation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Systematic Investment Plan (SIP) & Mutual Fund Calculator
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Calculate the power of monthly compounding in Indian Mutual Funds (Nifty 50, Flexi-cap, Mid-cap) with optional Step-Up SIP and inflation adjustment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 sm:p-7 rounded-[32px] glass-card shadow-sm space-y-6">
            {/* Monthly Investment */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-sm">Monthly Investment Amount</span>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 glass-pill rounded-full font-mono font-bold text-sm">
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
                className="w-full h-2.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-950"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-medium mt-1.5">
                <span>₹500</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
                <span>₹2,00,000</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-sm">Expected Return Rate (% p.a.)</span>
                <div className="flex items-center gap-1 px-3.5 py-1.5 glass-pill rounded-full font-mono font-bold text-sm">
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
                className="w-full h-2.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-950"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-medium mt-1.5">
                <span>8% (Debt/FD)</span>
                <span>12% (Nifty Index)</span>
                <span>15% (Active Flexi)</span>
                <span>18%+ (Small-cap)</span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-bold text-sm">Time Horizon (Years)</span>
                <div className="flex items-center gap-1 px-3.5 py-1.5 glass-pill rounded-full font-mono font-bold text-sm">
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
                className="w-full h-2.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-zinc-950"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-medium mt-1.5">
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>35 Years</span>
              </div>
            </div>

            {/* Step Up Toggle & Controls */}
            <div className="pt-4 border-t border-zinc-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">Step-Up SIP Feature</div>
                  <div className="text-[11px] text-zinc-500">Increase investment with yearly salary increments</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStepUp(!isStepUp)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isStepUp 
                      ? 'bg-zinc-950 text-white font-bold shadow-xs' 
                      : 'glass-pill text-zinc-500'
                  }`}
                >
                  {isStepUp ? `Enabled (${stepUpPercent}%)` : 'Disabled'}
                </button>
              </div>

              {isStepUp && (
                <div className="mt-3 p-3 rounded-2xl glass-pill flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Annual Increment Rate:</span>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setStepUpPercent(rate)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          stepUpPercent === rate ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
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
            <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold">Adjust for Inflation (6% p.a.)</span>
                <p className="text-[11px] text-zinc-500">Shows real purchasing power of maturity corpus</p>
              </div>
              <button
                type="button"
                onClick={() => setInflationAdjusted(!inflationAdjusted)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  inflationAdjusted ? 'bg-zinc-950 text-white font-bold shadow-xs' : 'glass-pill text-zinc-500'
                }`}
              >
                {inflationAdjusted ? 'Inflation ON' : 'Nominal'}
              </button>
            </div>
          </div>
        </div>

        {/* Wealth Output Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 sm:p-7 rounded-[32px] glass-card shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Projected Wealth Corpus
              </h3>

              {/* Maturity Metric */}
              <div className="mb-5">
                <div className="text-xs font-medium text-zinc-500">
                  {inflationAdjusted ? 'Inflation-Adjusted Purchasing Power' : 'Total Maturity Value'}
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-1">
                  {formatIndianCurrency(realValue)}
                </div>
                <div className="text-xs text-zinc-500 mt-1 font-medium">
                  Accumulated over {tenureYears} years ({totalMonths} instalments)
                </div>
              </div>

              {/* Visual Ratio Bar */}
              <div className="space-y-2 mb-6">
                <div className="h-3.5 w-full rounded-full bg-zinc-200 overflow-hidden flex border border-zinc-300/80">
                  <div 
                    style={{ width: `${investedPercent}%` }} 
                    className="bg-zinc-400 transition-all duration-500" 
                    title={`Invested: ${investedPercent.toFixed(1)}%`}
                  />
                  <div 
                    style={{ width: `${gainPercent}%` }} 
                    className="bg-zinc-950 transition-all duration-500" 
                    title={`Gains: ${gainPercent.toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-400"></span>
                    Invested: {investedPercent.toFixed(1)}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-950"></span>
                    Estimated Wealth Gains: {gainPercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="p-4 rounded-2xl glass-pill space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Total Invested Capital:</span>
                  <span className="font-mono font-bold">{formatIndianCurrency(totalInvested)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Estimated Wealth Gains:</span>
                  <span className="font-mono font-bold">+{formatIndianCurrency(wealthGain)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 font-bold">
                  <span>Wealth Multiplier:</span>
                  <span className="font-mono font-black text-sm">
                    {totalInvested > 0 ? (maturityValue / totalInvested).toFixed(2) : 1}x
                  </span>
                </div>
              </div>
            </div>

            {/* Compounding Wisdom Milestone */}
            <div className="p-4 rounded-2xl glass-pill text-xs flex items-center gap-3">
              <Award className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-bold">Rule of 72 Compounding:</span> At {expectedReturnRate}%, your money doubles every <strong>{doublingYears} years</strong>.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
