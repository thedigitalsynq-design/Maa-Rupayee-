import React, { useState } from 'react';
import {
  ClipboardCheck,
  Gavel,
  Scale,
  FileCheck,
  ShieldAlert,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/indianCurrency';

type KitTool = 'penalty' | 'scheme' | 'einvoice' | 'itc';

const TOOLS: Array<{ id: KitTool; label: string; icon: React.FC<{ className?: string }>; blurb: string }> = [
  { id: 'penalty', label: 'Late Fee & Interest', icon: Gavel, blurb: 'GSTR-3B / GSTR-1 delays: ₹50/day fee + 18% interest' },
  { id: 'scheme', label: 'Composition vs Regular', icon: Scale, blurb: 'Which scheme costs you less? Side-by-side math' },
  { id: 'einvoice', label: 'E-Invoice & E-Way', icon: FileCheck, blurb: '₹5 Cr e-invoice + ₹50k e-way bill readiness' },
  { id: 'itc', label: 'ITC Blocked Credits', icon: ShieldAlert, blurb: 'Section 17(5): what you cannot claim' },
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
      type="number" min={min} step={step ?? 'any'} value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-full p-3 glass-pill rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950"
    />
  );
}

function ResultRow({ label, value, strong, warn }: { label: string; value: string; strong?: boolean; warn?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs gap-3">
      <span className="text-zinc-500 font-medium">{label}</span>
      <span className={`font-mono text-right ${strong ? 'font-black text-base' : 'font-bold'} ${warn ? 'text-red-600' : ''}`}>{value}</span>
    </div>
  );
}

function Seg<T extends string>({ options, value, onChange, labels }: { options: readonly T[]; value: T; onChange: (v: T) => void; labels?: Record<T, string> }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onChange(o)} aria-pressed={value === o}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${value === o ? 'bg-zinc-950 text-white font-bold shadow-xs' : 'glass-pill text-zinc-600'}`}>
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  );
}

/* ---------------- 1. Late fee + interest ---------------- */
function PenaltyTool() {
  const [form, setForm] = useState<'3B' | 'GSTR-1'>('3B');
  const [isNil, setIsNil] = useState(false);
  const [days, setDays] = useState(10);
  const [liability, setLiability] = useState(50000);
  const perDay = isNil ? 20 : 50;
  const cap = isNil ? 500 : 5000;
  const fee = Math.min(Math.max(0, days) * perDay, cap);
  const interest = Math.max(0, liability) * 0.18 * (Math.max(0, days) / 365);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label="Return Type">
          <Seg options={['3B', 'GSTR-1'] as const} value={form} onChange={setForm} labels={{ '3B': 'GSTR-3B', 'GSTR-1': 'GSTR-1' }} />
        </Field>
        <Field label="Return Category">
          <Seg options={['taxable', 'nil'] as const} value={isNil ? 'nil' : 'taxable'} onChange={(v) => setIsNil(v === 'nil')} labels={{ taxable: 'With Tax / Sales', nil: 'Nil Return' }} />
        </Field>
        <Field label="Days Delayed"><NumInput value={days} onChange={setDays} step={1} /></Field>
        <Field label="Net Cash Tax Liability — interest applies on this only (₹)"><NumInput value={liability} onChange={setLiability} /></Field>
        <p className="text-[11px] text-zinc-500 leading-relaxed">Late fee: ₹50/day (₹20/day for nil), capped at ₹5,000 (₹500 nil) per return. Interest 18% p.a. runs only on the net cash-paid liability after ITC — per CBIC clarification.</p>
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label={`Late Fee (${days}d × ₹${perDay}, cap ₹${cap.toLocaleString('en-IN')})`} value={formatIndianCurrency(fee)} warn={fee > 0} />
        <ResultRow label="Interest @ 18% p.a." value={formatIndianCurrency(interest)} warn={interest > 0} />
        <ResultRow label="Total Payable Extra" value={formatIndianCurrency(fee + interest)} strong warn={fee + interest > 0} />
      </div>
    </div>
  );
}

/* ---------------- 2. Composition vs Regular ---------------- */
type BizKind = 'Trader / Manufacturer' | 'Restaurant' | 'Service Provider';
function SchemeTool() {
  const [kind, setKind] = useState<BizKind>('Trader / Manufacturer');
  const [turnover, setTurnover] = useState(8000000);
  const [saleRate, setSaleRate] = useState(18);
  const [inputTax, setInputTax] = useState(300000);
  const [interState, setInterState] = useState(false);
  const [viaECO, setViaECO] = useState(false);
  const compRate = kind === 'Restaurant' ? 5 : kind === 'Service Provider' ? 6 : 1;
  const compCap = kind === 'Service Provider' ? 5000000 : 15000000;
  const outputTax = turnover * (saleRate / 100);
  const regularPayable = Math.max(0, outputTax - inputTax);
  const compPayable = turnover * (compRate / 100);
  const blocked = turnover > compCap || interState || viaECO;
  const regularWins = regularPayable <= compPayable;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label="Business Category">
          <Seg options={['Trader / Manufacturer', 'Restaurant', 'Service Provider'] as const} value={kind} onChange={setKind} />
        </Field>
        <Field label="Annual Turnover (₹)"><NumInput value={turnover} onChange={setTurnover} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Avg GST on Sales %"><NumInput value={saleRate} onChange={setSaleRate} step={0.5} /></Field>
          <Field label="Yearly Input Tax (ITC) ₹"><NumInput value={inputTax} onChange={setInputTax} /></Field>
        </div>
        <Field label="Inter-State outward supplies?">
          <Seg options={['no', 'yes'] as const} value={interState ? 'yes' : 'no'} onChange={(v) => setInterState(v === 'yes')} labels={{ no: 'No', yes: 'Yes' }} />
        </Field>
        <Field label="Sell via e-commerce operators?">
          <Seg options={['no', 'yes'] as const} value={viaECO ? 'yes' : 'no'} onChange={(v) => setViaECO(v === 'yes')} labels={{ no: 'No', yes: 'Yes' }} />
        </Field>
      </div>
      <div className="space-y-3">
        {blocked && (
          <div className="p-4 rounded-2xl border border-red-300 bg-red-50 text-xs text-red-800 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
            <span><strong>Composition NOT allowed:</strong> {turnover > compCap ? `turnover exceeds ₹${(compCap / 10000000).toFixed(2)} Cr limit. ` : ''}{interState ? 'Inter-state outward supplies barred. ' : ''}{viaECO ? 'ECO sales barred. ' : ''}Regular scheme is your only option.</span>
          </div>
        )}
        <div className="p-5 rounded-2xl glass-pill space-y-2.5">
          <ResultRow label={`Regular (≈${saleRate}% − ITC)`} value={formatIndianCurrency(regularPayable)} />
          <ResultRow label={`Composition (${compRate}% flat, no ITC)`} value={formatIndianCurrency(compPayable)} />
          <ResultRow label={blocked ? 'You Must Pay (Regular)' : regularWins ? 'Cheaper: Regular' : 'Cheaper: Composition'} value={formatIndianCurrency(blocked ? regularPayable : Math.min(regularPayable, compPayable))} strong />
          {!blocked && <p className="text-[11px] text-zinc-500 leading-relaxed">Composition: quarterly CMP-08, annual GSTR-4, no ITC, no inter-state sales. Regular: monthly returns, full ITC, all markets open.</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 3. E-invoice + E-way readiness ---------------- */
function ECheckTool() {
  const [turnoverCr, setTurnoverCr] = useState(6);
  const [b2b, setB2b] = useState(true);
  const [consignment, setConsignment] = useState(75000);
  const turnover = turnoverCr * 10000000;
  const einvoice = turnover > 50000000;
  const eway = consignment > 50000;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="space-y-4">
        <Field label="Aggregate Annual Turnover (₹ Cr)"><NumInput value={turnoverCr} onChange={setTurnoverCr} step={0.5} /></Field>
        <Field label="Do you raise B2B / export invoices?">
          <Seg options={['yes', 'no'] as const} value={b2b ? 'yes' : 'no'} onChange={(v) => setB2b(v === 'yes')} labels={{ yes: 'Yes', no: 'B2C only' }} />
        </Field>
        <Field label="Typical Consignment Value (₹)"><NumInput value={consignment} onChange={setConsignment} /></Field>
      </div>
      <div className="space-y-3">
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2 ${einvoice && b2b ? 'border-red-300 bg-red-50 text-red-800' : 'glass-pill text-zinc-600'}`}>
          {einvoice && b2b ? <AlertTriangle className="h-4 w-4 shrink-0 mt-px" /> : <Check className="h-4 w-4 shrink-0 mt-px" />}
          <span><strong>E-Invoice (IRP): {einvoice && b2b ? 'MANDATORY' : 'not required'}.</strong> {einvoice && b2b ? 'Turnover exceeds ₹5 Cr — every B2B/export invoice needs IRN + QR from the portal before movement.' : 'Mandatory only above ₹5 Cr aggregate turnover (any FY since 2017-18) for B2B/export supplies.'}</span>
        </div>
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2 ${eway ? 'border-red-300 bg-red-50 text-red-800' : 'glass-pill text-zinc-600'}`}>
          {eway ? <AlertTriangle className="h-4 w-4 shrink-0 mt-px" /> : <Check className="h-4 w-4 shrink-0 mt-px" />}
          <span><strong>E-Way Bill: {eway ? 'REQUIRED' : 'not required'}.</strong> {eway ? 'Consignment exceeds ₹50,000 — generate EWB on the portal before goods move.' : 'Needed only when a goods consignment exceeds ₹50,000 (some intra-state exemptions apply).'}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 4. ITC blocked credits 17(5) ---------------- */
interface ItcRow { id: string; label: string; ref: string; blocked: boolean; exception?: string }
const ITC_ROWS: ItcRow[] = [
  { id: 'vehicle', label: 'Motor vehicles (car, bike)', ref: '17(5)(a)', blocked: true, exception: 'Allowed for dealers, transporters, trainers & taxable goods transport.' },
  { id: 'food', label: 'Food, beverage, outdoor catering', ref: '17(5)(b)(i)', blocked: true, exception: 'Allowed when you outward-supply the same category (e.g. restaurants, caterers).' },
  { id: 'beauty', label: 'Beauty, health, fitness, plastic surgery', ref: '17(5)(b)(ii)', blocked: true, exception: 'Allowed when outward supply is the same service.' },
  { id: 'works', label: 'Works contract → immovable property', ref: '17(5)(c)', blocked: true, exception: 'Allowed for plant & machinery; or when you supply works contract service itself.' },
  { id: 'construct', label: 'Self-constructed building / civil structure', ref: '17(5)(d)', blocked: true, exception: 'Allowed for plant & machinery (apparatus, equipment, pipelines).' },
  { id: 'lost', label: 'Lost, stolen, destroyed, gifted, free samples', ref: '17(5)(h)', blocked: true },
  { id: 'personal', label: 'Personal-use goods / services', ref: '17(5)(g)', blocked: true },
  { id: 'rentcar', label: 'Rent-a-cab / life & health insurance', ref: '17(5)(b)(iii)', blocked: true, exception: 'Allowed when obligatory for employees under law, or same-line outward supply.' },
  { id: 'office', label: 'Office rent, laptops, raw material, freight-in', ref: 'General', blocked: false },
  { id: 'prof', label: 'CA / legal / software / ads for business', ref: 'General', blocked: false },
];

function ItcTool() {
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const set = (id: string, v: number) => setAmounts(prev => ({ ...prev, [id]: v }));
  let eligible = 0, blockedAmt = 0;
  for (const r of ITC_ROWS) {
    const v = amounts[r.id] || 0;
    if (r.blocked) blockedAmt += v; else eligible += v;
  }
  return (
    <div className="space-y-4">
      <p className="text-[11px] text-zinc-500 leading-relaxed">Enter the GST paid on each expense head for the period. Blocked credits under Section 17(5) are ring-fenced automatically.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ITC_ROWS.map(r => (
          <div key={r.id} className={`p-3.5 rounded-2xl border space-y-2 ${r.blocked ? 'border-red-200 bg-red-50/60' : 'glass-pill'}`}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold">{r.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${r.blocked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                {r.blocked ? `BLOCKED ${r.ref}` : 'ELIGIBLE'}
              </span>
            </div>
            {r.exception && <p className="text-[10px] text-zinc-500 leading-relaxed">Exception: {r.exception}</p>}
            <input
              type="number" min={0} value={amounts[r.id] || ''}
              onChange={(e) => set(r.id, e.target.value === '' ? 0 : Number(e.target.value) || 0)}
              placeholder="GST paid ₹"
              aria-label={`GST paid on ${r.label}`}
              className="w-full p-2 glass-pill rounded-xl font-mono font-bold text-xs focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="p-5 rounded-2xl glass-pill space-y-2.5">
        <ResultRow label="Eligible ITC (claim in GSTR-3B)" value={formatIndianCurrency(eligible)} strong />
        <ResultRow label="Blocked — reverse / do not claim" value={formatIndianCurrency(blockedAmt)} warn={blockedAmt > 0} />
      </div>
    </div>
  );
}

export const ComplianceKit: React.FC = () => {
  const [tool, setTool] = useState<KitTool>('penalty');
  const active = TOOLS.find(t => t.id === tool)!;
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <ClipboardCheck className="h-3.5 w-3.5" />
          <span>100% Free • No Login • Fully Offline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Compliance Kit</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Stay on the right side of CBIC: delay costs, scheme choice, e-document mandates, and ITC discipline — computed on-device.
        </p>
        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Choose a compliance tool">
          {TOOLS.map(t => {
            const Icon = t.icon;
            const selected = tool === t.id;
            return (
              <button key={t.id} type="button" onClick={() => setTool(t.id)} aria-pressed={selected}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${selected ? 'bg-zinc-950 text-white shadow-xs' : 'glass-pill text-zinc-600'}`}>
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
        {tool === 'penalty' && <PenaltyTool />}
        {tool === 'scheme' && <SchemeTool />}
        {tool === 'einvoice' && <ECheckTool />}
        {tool === 'itc' && <ItcTool />}
      </div>
      <div className="flex justify-end">
        <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">File before the 11th & 20th <ArrowRight className="h-3 w-3" /></span>
      </div>
    </div>
  );
};
