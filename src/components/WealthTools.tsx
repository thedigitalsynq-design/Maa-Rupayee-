import React, { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  Award,
  Home,
  Landmark,
  Coins,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/indianCurrency';

type WealthTool = 'ppf' | 'gratuity' | 'hra' | 'fdrd' | 'nps';

const TOOLS: Array<{ id: WealthTool; label: string; icon: React.FC<{ className?: string }>; blurb: string }> = [
  { id: 'ppf', label: 'PPF', icon: PiggyBank, blurb: 'Public Provident Fund • 7.1% Govt rate' },
  { id: 'gratuity', label: 'Gratuity', icon: Award, blurb: 'Payment of Gratuity Act, 1972' },
  { id: 'hra', label: 'HRA', icon: Home, blurb: 'Sec 10(13A) rent exemption' },
  { id: 'fdrd', label: 'FD / RD', icon: Coins, blurb: 'Bank deposits, quarterly compounding' },
  { id: 'nps', label: 'NPS', icon: Landmark, blurb: 'Pension corpus + monthly annuity' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-zinc-500 font-semibold mb-1.5 text-xs">{label}</label>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min = 0, step }: { value: number; onChange: (v: number) => void; min?: number; step?: number | string }) {
  return (
    <input
      type="number"
      min={min}
      step={step ?? 'any'}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
    />
  );
}

function Slider({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full cursor-pointer"
      aria-label="Adjust value"
    />
  );
}

function ResultRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-zinc-500 font-medium">{label}</span>
      <span className={`font-mono ${strong ? 'font-black text-base' : 'font-bold'}`}>{value}</span>
    </div>
  );
}

/* ---------------- PPF: 7.1% p.a., annual compounding, deposits at FY start ---------------- */
function PpfTool() {
  const [yearly, setYearly] = useState(150000);
  const [years, setYears] = useState(15);
  const rate = 7.1;
  const deposit = Math.min(150000, Math.max(500, yearly));
  let balance = 0;
  for (let y = 0; y < years; y++) balance = (balance + deposit) * (1 + rate / 100);
  const invested = deposit * years;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label={`Yearly Deposit (max ₹1,50,000): ₹${deposit.toLocaleString('en-IN')}`}>
          <Slider value={deposit} onChange={(v) => setYearly(Math.min(150000, v))} min={500} max={150000} step={500} />
        </Field>
        <Field label={`Duration: ${years} years (15 mandatory + extensions)`}>
          <Slider value={years} onChange={setYears} min={15} max={50} step={1} />
        </Field>
        <NumInput value={yearly} onChange={setYearly} min={500} />
        <p className="text-[11px] text-zinc-500 leading-relaxed">7.1% p.a. compounded yearly (Govt rate since Apr 2020). Deposits assumed at FY start (5th Apr rule). Interest + maturity fully tax-free (EEE).</p>
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label="Total Invested" value={formatIndianCurrency(invested)} />
        <ResultRow label="Interest Earned" value={formatIndianCurrency(balance - invested)} />
        <ResultRow label="Maturity Value" value={formatIndianCurrency(balance)} strong />
      </div>
    </div>
  );
}

/* ---------------- Gratuity: (Basic+DA) × 15/26 × eligible years ---------------- */
function GratuityTool() {
  const [monthlyBasic, setMonthlyBasic] = useState(50000);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const eligible = years + (months >= 6 ? 1 : 0);
  const gratuity = Math.round((monthlyBasic * 15 * eligible) / 26);
  const taxFreeLimit = 2000000;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label="Monthly Basic + DA (₹)"><NumInput value={monthlyBasic} onChange={setMonthlyBasic} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Completed Years"><NumInput value={years} onChange={setYears} step={1} /></Field>
          <Field label="Extra Months (0–11)"><NumInput value={months} onChange={(v) => setMonths(Math.min(11, v))} step={1} /></Field>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Formula: Basic × 15/26 × eligible years. A fraction over 6 months counts as a full year. Needs 5+ years of continuous service. Tax-free up to ₹20 lakh for private employees.</p>
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label="Eligible Years" value={`${eligible} yrs`} />
        <ResultRow label="Gratuity Payable" value={formatIndianCurrency(gratuity)} strong />
        <ResultRow label="Tax-Free (up to ₹20L)" value={formatIndianCurrency(Math.min(gratuity, taxFreeLimit))} />
        <ResultRow label="Taxable Portion" value={formatIndianCurrency(Math.max(0, gratuity - taxFreeLimit))} />
      </div>
    </div>
  );
}

/* ---------------- HRA: min(actual, rent − 10% salary, 50%/40% salary) ---------------- */
function HraTool() {
  const [basic, setBasic] = useState(600000);
  const [hra, setHra] = useState(240000);
  const [rent, setRent] = useState(300000);
  const [metro, setMetro] = useState(true);
  const salary = Math.max(0, basic);
  const exempt = Math.max(0, Math.min(hra, rent - salary * 0.1, salary * (metro ? 0.5 : 0.4)));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label="Annual Basic + DA (₹)"><NumInput value={basic} onChange={setBasic} /></Field>
        <Field label="Annual HRA Received (₹)"><NumInput value={hra} onChange={setHra} /></Field>
        <Field label="Annual Rent Paid (₹)"><NumInput value={rent} onChange={setRent} /></Field>
        <div className="flex gap-2">
          {([true, false] as const).map(m => (
            <button key={String(m)} type="button" onClick={() => setMetro(m)}
              aria-pressed={metro === m}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${metro === m ? 'bg-zinc-950 text-white font-bold shadow-xs' : 'glass-pill text-zinc-600'}`}>
              {m ? 'Metro City (50%)' : 'Non-Metro (40%)'}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Exempt = least of: HRA received, rent − 10% salary, 50%/40% salary (Sec 10(13A)). Only for salaried employees living in rented accommodation.</p>
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label="HRA Exempt from Tax" value={formatIndianCurrency(exempt)} strong />
        <ResultRow label="Taxable HRA" value={formatIndianCurrency(Math.max(0, hra - exempt))} />
      </div>
    </div>
  );
}

/* ---------------- FD (quarterly) + RD (monthly) ---------------- */
function FdRdTool() {
  const [mode, setMode] = useState<'FD' | 'RD'>('FD');
  const [principal, setPrincipal] = useState(200000);
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  let invested = 0, maturity = 0;
  if (mode === 'FD') {
    invested = principal;
    maturity = principal * Math.pow(1 + rate / 400, 4 * years);
  } else {
    const n = years * 12, i = rate / 1200;
    invested = monthly * n;
    maturity = i > 0 ? monthly * ((Math.pow(1 + i, n) - 1) / i) : invested;
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['FD', 'RD'] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${mode === m ? 'bg-zinc-950 text-white font-bold shadow-xs' : 'glass-pill text-zinc-600'}`}>
              {m === 'FD' ? 'Fixed Deposit' : 'Recurring Deposit'}
            </button>
          ))}
        </div>
        {mode === 'FD'
          ? <Field label="Deposit Amount (₹)"><NumInput value={principal} onChange={setPrincipal} /></Field>
          : <Field label="Monthly Instalment (₹)"><NumInput value={monthly} onChange={setMonthly} /></Field>}
        <Field label={`Interest Rate: ${rate}% p.a.`}><Slider value={rate} onChange={setRate} min={1} max={12} step={0.05} /></Field>
        <Field label={`Duration: ${years} years`}><Slider value={years} onChange={setYears} min={1} max={10} step={1} /></Field>
        <p className="text-[11px] text-zinc-500 leading-relaxed">{mode === 'FD' ? 'Compounded quarterly, the Indian bank standard.' : 'Monthly deposits, monthly compounding approximation of bank RD schedules.'} Interest is taxable at your slab.</p>
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label="Total Invested" value={formatIndianCurrency(invested)} />
        <ResultRow label="Interest Earned" value={formatIndianCurrency(maturity - invested)} />
        <ResultRow label="Maturity Value" value={formatIndianCurrency(maturity)} strong />
      </div>
    </div>
  );
}

/* ---------------- NPS: corpus via SIP math, 40% annuity ---------------- */
function NpsTool() {
  const [monthly, setMonthly] = useState(10000);
  const [age, setAge] = useState(30);
  const [ret, setRet] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);
  const years = Math.max(1, 60 - age);
  const n = years * 12, i = ret / 1200;
  const corpus = i > 0 ? monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : monthly * n;
  const annuityCorpus = corpus * (annuityPct / 100);
  const pension = (annuityCorpus * 0.075) / 12;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label="Monthly Contribution (₹)"><NumInput value={monthly} onChange={setMonthly} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Current Age"><NumInput value={age} onChange={(v) => setAge(Math.min(59, v))} step={1} /></Field>
          <Field label="Expected Return %"><NumInput value={ret} onChange={setRet} step={0.5} /></Field>
        </div>
        <Field label={`Annuity Purchase: ${annuityPct}% (min 40% at exit)`}>
          <Slider value={annuityPct} onChange={setAnnuityPct} min={40} max={100} step={5} />
        </Field>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Invests till age 60. Annuity pension estimated at 7.5%. Extra ₹50,000 deduction under 80CCD(1B) over the 80C limit.</p>
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label="Invested" value={formatIndianCurrency(monthly * n)} />
        <ResultRow label="Corpus at 60" value={formatIndianCurrency(corpus)} strong />
        <ResultRow label={`Tax-Free Lumpsum (${100 - annuityPct}%)`} value={formatIndianCurrency(corpus - annuityCorpus)} />
        <ResultRow label="Monthly Pension (est.)" value={formatIndianCurrency(pension)} strong />
      </div>
    </div>
  );
}

export const WealthToolsHub: React.FC = () => {
  const [tool, setTool] = useState<WealthTool>('ppf');
  const active = TOOLS.find(t => t.id === tool)!;
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <Wallet className="h-3.5 w-3.5" />
          <span>100% Free • No Login • Fully Offline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Savings & Tax Tools</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Five more free calculators: PPF growth, gratuity payout, HRA exemption, bank FD/RD maturity, and NPS pension — all computed on-device.
        </p>
        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Choose a savings tool">
          {TOOLS.map(t => {
            const Icon = t.icon;
            const selected = tool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTool(t.id)}
                aria-pressed={selected}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${selected ? 'bg-zinc-950 text-white shadow-xs' : 'glass-pill text-zinc-600'}`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500 font-semibold">
          <active.icon className="h-4 w-4" />
          <span>{active.blurb}</span>
        </div>
        {tool === 'ppf' && <PpfTool />}
        {tool === 'gratuity' && <GratuityTool />}
        {tool === 'hra' && <HraTool />}
        {tool === 'fdrd' && <FdRdTool />}
        {tool === 'nps' && <NpsTool />}
      </div>

      <div className="p-4 rounded-2xl glass-pill text-xs text-zinc-500 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <span>Indicative estimates from statutory formulas and bank conventions — cross-check with official calculators before filing or investing.</span>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">More tools coming soon <ArrowRight className="h-3 w-3" /></span>
      </div>
    </div>
  );
};
