import React, { useState } from 'react';
import {
  GraduationCap,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Trophy,
  BookOpen,
} from 'lucide-react';

interface QuizQ { q: string; options: string[]; answer: number; explain: string }
interface Lesson { id: string; title: string; minutes: number; body: string[]; quiz: QuizQ[] }

const LESSONS: Lesson[] = [
  {
    id: 'l1', title: 'What GST Really Is', minutes: 4,
    body: [
      'GST (Goods and Services Tax) replaced 17+ indirect taxes on 1 July 2017. It is a destination-based tax: the state where goods or services are consumed collects it.',
      'Inside one state you split tax into CGST (Centre) + SGST (State). Across states it becomes one IGST collected by the Centre. Union Territories without legislatures use UTGST instead of SGST.',
      'Since 22 September 2025 (GST 2.0), goods mostly sit in two slabs — 5% and 18% — plus a 40% demerit rate for sin and luxury goods. Gold stays at 3%.',
    ],
    quiz: [
      { q: 'A Delhi seller bills a Delhi buyer. Which taxes apply?', options: ['IGST only', 'CGST + SGST', 'CGST + UTGST'], answer: 1, explain: 'Same-state (intra-state) supplies split into CGST for the Centre and SGST for the state.' },
      { q: 'GST 2.0 standard goods slabs are…', options: ['12% and 28%', '5% and 18%, plus 40% demerit', '0% and 3% only'], answer: 1, explain: 'The 56th Council merged 12%/28% into 5%/18% w.e.f. 22-09-2025, with 40% for sin/luxury.' },
      { q: 'UTGST applies in…', options: ['All states', 'Maharashtra and Gujarat', 'UTs without legislatures, e.g. Chandigarh, Ladakh'], answer: 2, explain: 'UTs with legislatures (Delhi, Puducherry, J&K) use SGST; the rest use UTGST.' },
    ],
  },
  {
    id: 'l2', title: 'Registration: Who Must Register', minutes: 4,
    body: [
      'Goods sellers cross ₹40 lakh turnover (₹20 lakh in special-category states); service providers cross ₹20 lakh (₹10 lakh special states) — then registration is compulsory.',
      'Inter-state outward supply, reverse-charge recipients, e-commerce sellers and casual taxable persons must register regardless of turnover.',
      'Small players can opt for Composition (1% traders/manufacturers, 5% restaurants, 6% services up to ₹50 lakh) — flat tax, no ITC, no inter-state sales.',
    ],
    quiz: [
      { q: 'A Karnataka kirana store sells only within the state, turnover ₹35 lakh. Register?', options: ['Yes, immediately', 'No — below the ₹40 lakh goods limit', 'Only if it sells online'], answer: 1, explain: 'Normal-state goods threshold is ₹40 lakh for intra-state sellers.' },
      { q: 'Composition dealers CANNOT…', options: ['Claim input tax credit', 'File quarterly CMP-08', 'Sell within their state'], answer: 0, explain: 'Composition = flat rate + no ITC + intra-state only + annual GSTR-4.' },
      { q: 'A freelancer billing clients in 3 states must…', options: ['Register only at home state', 'Register — inter-state supply needs it at any turnover', 'Wait till ₹40 lakh'], answer: 1, explain: 'Inter-state outward supply triggers compulsory registration.' },
    ],
  },
  {
    id: 'l3', title: 'Invoices That Get You Paid', minutes: 5,
    body: [
      'A Rule 46 tax invoice needs: supplier GSTIN, consecutive serial, date, HSN/SAC, taxable value, rate and amount of CGST/SGST/IGST, and place of supply.',
      'Issue B2B invoices before/at supply; invoice within 30 days of service completion (45 for banks/insurers). Keep copies 72 months (6 years).',
      'Cross ₹5 crore aggregate turnover? Every B2B and export invoice needs IRN + QR from the Invoice Registration Portal before the goods move.',
    ],
    quiz: [
      { q: 'Which is NOT mandatory on a tax invoice?', options: ['HSN/SAC code', 'Place of supply', 'Buyer’s favourite colour'], answer: 2, explain: 'Rule 46 lists GSTIN, serial, HSN, values, rates and place of supply — not colours.' },
      { q: 'E-invoicing (IRP) kicks in above…', options: ['₹50 lakh turnover', '₹5 crore aggregate turnover, for B2B/export', '₹500 crore, B2C only'], answer: 1, explain: 'Above ₹5 Cr in any FY since 2017-18, B2B and export invoices need IRN + QR.' },
      { q: 'Invoice records must be kept for…', options: ['12 months', '72 months (6 years)', 'Forever'], answer: 1, explain: 'Section 36: retain books and invoices for 72 months from the due date of the annual return.' },
    ],
  },
  {
    id: 'l4', title: 'Input Tax Credit Without Reversals', minutes: 5,
    body: [
      'ITC = GST you paid on business purchases, subtracted from GST you collect. Claim only with a valid tax invoice, goods/services received, supplier filed GSTR-1, and payment made within 180 days.',
      'Section 17(5) blocks credit on: motor vehicles (with exceptions), food/catering/beauty (unless same business), works contracts into buildings, self-constructed property, and lost, gifted or personal-use goods.',
      'Blocked credit claimed wrongly draws interest plus penalty — use the ITC checker in the Compliance Kit before filing GSTR-3B.',
    ],
    quiz: [
      { q: 'A bakery buys an oven for the shop. ITC?', options: ['Blocked — machinery never qualifies', 'Eligible — business input with invoice', 'Only 50% allowed'], answer: 1, explain: 'Business inputs with valid invoice and receipt qualify; blocks target cars, food, buildings, gifts.' },
      { q: 'Office team lunch catering bill has GST. ITC?', options: ['Yes, always', 'Blocked under 17(5)(b) — food & catering', 'Yes, if above ₹10,000'], answer: 1, explain: 'Food, beverage and outdoor catering are blocked unless catering IS your business.' },
      { q: 'Supplier hasn’t filed GSTR-1. Your ITC…', options: ['Safe forever', 'At risk — credit needs supplier compliance + 180-day payment', 'Doubles next month'], answer: 1, explain: 'ITC needs invoice + receipt + supplier filing + payment within 180 days.' },
    ],
  },
  {
    id: 'l5', title: 'Returns: 11th, 20th, Never Late', minutes: 4,
    body: [
      'GSTR-1 (outward sales) is due the 11th; GSTR-3B (payment) the 20th of next month. Annual GSTR-9 by 31 December (above ₹2 Cr; reconciliation GSTR-9C above ₹5 Cr).',
      'Delay costs ₹50/day per return (₹20/day for nil), capped at ₹5,000 (₹500 nil) — plus 18% p.a. interest on net cash liability.',
      'Match GSTR-2B before paying: it auto-drafts your eligible ITC from supplier filings.',
    ],
    quiz: [
      { q: 'GSTR-3B for March is due…', options: ['11th April', '20th April', '31st December'], answer: 1, explain: '3B pays tax by the 20th; GSTR-1 reports sales by the 11th.' },
      { q: '10 days late with a taxable 3B costs…', options: ['₹500 flat', '₹50 × 10 = ₹500 fee + 18% interest on cash liability', 'Nothing the first time'], answer: 1, explain: '₹50/day up to ₹5,000, plus 18% p.a. interest on the net cash portion.' },
      { q: 'GSTR-2B is…', options: ['Your payment challan', 'Auto-drafted ITC statement from supplier filings', 'The annual return'], answer: 1, explain: 'Reconcile purchases against 2B so you never claim missing credit.' },
    ],
  },
  {
    id: 'l6', title: 'GST 2.0: What Changed for You', minutes: 4,
    body: [
      'From 22-09-2025: 12% and 28% merged into 5%/18%. Butter, biscuits, medicines, LEDs → 5%. TVs, ACs, cement, small cars, bikes ≤350cc → 18%. Big cars, bikes >350cc, aerated drinks → 40% all-inclusive.',
      'Apparel and footwear threshold rose ₹1,000 → ₹2,500 (5% below, 18% above). Hotel rooms ≤₹7,500 → 5%. 33 life-saving drugs → nil.',
      'Tobacco stays at 28% + cess transitionally until compensation loans clear, then migrates to 40%. Old invoices keep old rates — the Historical Lookup dates every transaction correctly.',
    ],
    quiz: [
      { q: 'A 55-inch TV bought in Oct 2025 attracts…', options: ['28%', '18% — all TVs unified under GST 2.0', '40%'], answer: 1, explain: 'Above-32-inch 28% slab was abolished 22-09-2025; every TV is 18%.' },
      { q: 'Garments priced ₹2,000 in Nov 2025 attract…', options: ['12%', '5% — within the ₹2,500 GST 2.0 threshold', '18%'], answer: 1, explain: 'Threshold rose to ₹2,500; only above it hits 18%.' },
      { q: 'A September 2024 invoice for cement used…', options: ['18%', '28% — pre-reform rate', '40%'], answer: 1, explain: 'Cement moved 28% → 18% on 22-09-2025; old dates keep old rates.' },
    ],
  },
];

const STORE_KEY = 'smart_gst_academy_progress';

function readProgress(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const p: unknown = JSON.parse(raw);
    return p && typeof p === 'object' ? (p as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export const GstAcademy: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>(readProgress);

  const active = LESSONS.find(l => l.id === activeId) ?? null;
  const done = Object.keys(progress).length;
  const pct = Math.round((done / LESSONS.length) * 100);

  const openLesson = (id: string) => {
    setActiveId(id);
    setAnswers({});
    setSubmitted(false);
  };

  const submitQuiz = () => {
    if (!active) return;
    const score = active.quiz.filter((q, i) => answers[i] === q.answer).length;
    setSubmitted(true);
    setProgress(prev => {
      const next = { ...prev, [active.id]: Math.max(prev[active.id] ?? 0, score) };
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(next));
      } catch { /* private mode */ }
      return next;
    });
  };

  const score = active ? active.quiz.filter((q, i) => answers[i] === q.answer).length : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>100% Free Course • No Login • Certificates of Completion: Your Brain</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">GST Academy</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Six short lessons that take a beginner to return-ready: concepts, registration, invoices, ITC, returns, and GST 2.0. Quizzes lock in every lesson.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-zinc-500/20 overflow-hidden">
            <div className="h-full bg-zinc-950 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-bold font-mono">{done}/{LESSONS.length} lessons</span>
        </div>
        {done === LESSONS.length && (
          <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-bold">
            <Trophy className="h-3.5 w-3.5" />
            <span>Course complete — you file like a professional now</span>
          </div>
        )}
      </div>

      {!active && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.map((l, i) => {
            const best = progress[l.id];
            return (
              <button
                key={l.id} type="button" onClick={() => openLesson(l.id)}
                className="glass-card rounded-2xl p-5 text-left transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-zinc-500">LESSON {i + 1} • {l.minutes} MIN</span>
                    {best !== undefined && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px] font-bold">
                        <Check className="h-3 w-3" /> {best}/{l.quiz.length}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black tracking-tight mb-1">{l.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{l.body[0]}</p>
                </div>
                <span className="text-xs font-bold flex items-center gap-1">Start lesson <ArrowRight className="h-3.5 w-3.5" /></span>
              </button>
            );
          })}
        </div>
      )}

      {active && (
        <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm space-y-5">
          <button type="button" onClick={() => setActiveId(null)}
            className="text-xs font-bold flex items-center gap-1 text-zinc-500 hover:underline cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" /> All lessons
          </button>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> {active.title}
            </h3>
            <div className="mt-3 space-y-3">
              {active.body.map((para, i) => (
                <p key={i} className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-zinc-950/10 space-y-4">
            <h4 className="text-sm font-black tracking-tight">Quick quiz — {active.quiz.length} questions</h4>
            {active.quiz.map((q, qi) => (
              <div key={qi} className="p-4 rounded-2xl glass-pill space-y-2">
                <p className="text-xs font-bold">{qi + 1}. {q.q}</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {q.options.map((opt, oi) => {
                    const picked = answers[qi] === oi;
                    const revealed = submitted && oi === q.answer;
                    const wrong = submitted && picked && oi !== q.answer;
                    return (
                      <button
                        key={oi} type="button" disabled={submitted} onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border flex items-center justify-between gap-2 ${revealed ? 'bg-green-600 text-white border-green-600' : wrong ? 'bg-red-600 text-white border-red-600' : picked ? 'bg-zinc-950 text-white border-zinc-950' : 'glass-pill'}`}
                      >
                        <span>{opt}</span>
                        {revealed && <Check className="h-3.5 w-3.5 shrink-0" />}
                        {wrong && <X className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && (
                  <p className="text-[11px] text-zinc-500 leading-relaxed">{q.explain}</p>
                )}
              </div>
            ))}
            {!submitted ? (
              <button type="button" onClick={submitQuiz} disabled={Object.keys(answers).length < active.quiz.length}
                className="px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-black disabled:opacity-40 cursor-pointer transition-all">
                Check answers ({Object.keys(answers).length}/{active.quiz.length})
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black">Score: {score}/{active.quiz.length}</span>
                <button type="button" onClick={() => { setAnswers({}); setSubmitted(false); }}
                  className="px-4 py-2 rounded-full glass-pill text-xs font-bold cursor-pointer">Retry quiz</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
