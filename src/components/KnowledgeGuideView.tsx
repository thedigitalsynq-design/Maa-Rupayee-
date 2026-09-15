import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Truck, 
  Sparkles, 
  Building,
  CreditCard
} from 'lucide-react';
import { INDIAN_STATES } from '../data/indianStates';

export const KnowledgeGuideView: React.FC = () => {
  const [testGstin, setTestGstin] = useState('27AAACW2527G1ZT');

  // GSTIN Validator logic
  // Pattern: 2 digits (State TIN), 10 char PAN (5 letters, 4 digits, 1 letter), 1 entity digit/char, 'Z', 1 checksum char
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const isGstinValid = gstinRegex.test(testGstin.trim().toUpperCase());
  const stateCode = testGstin.substring(0, 2);
  const matchedState = INDIAN_STATES.find(s => s.tin === stateCode);
  const extractedPan = testGstin.length >= 12 ? testGstin.substring(2, 12).toUpperCase() : '';

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Statutory Indian GST Compliance & Rules Reference</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Indian GST Master Guide & Compliance Checker
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Authoritative handbook on GST thresholds, GSTIN anatomy, E-Invoicing mandates, E-Way bills, RCM, and Composition Scheme.
        </p>
      </div>

      {/* Interactive GSTIN Structure & Validator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-5 w-5 text-zinc-700" />
          <h3 className="font-bold text-base text-slate-900">Interactive 15-Digit GSTIN Inspector & Validator</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Every Indian Goods and Services Tax Identification Number (GSTIN) is mathematically structured around the business's Permanent Account Number (PAN).
        </p>

        <div className="max-w-xl mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 15-digit GSTIN to test:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              maxLength={15}
              value={testGstin}
              onChange={(e) => setTestGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AAACW2527G1ZT"
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-1 focus:ring-zinc-900 w-full"
            />
            <div className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
              isGstinValid ? 'bg-zinc-100 text-zinc-900 border border-zinc-300' : 'bg-zinc-200 text-zinc-800 border border-zinc-400'
            }`}>
              {isGstinValid ? <CheckCircle className="h-4 w-4 text-zinc-900" /> : <AlertCircle className="h-4 w-4 text-zinc-600" />}
              <span>{isGstinValid ? 'Valid Format' : 'Invalid Format'}</span>
            </div>
          </div>
        </div>

        {/* Breakdown of the 15 digits */}
        {testGstin.length === 15 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-700 mb-2">GSTIN Structural Dissection:</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="text-base font-bold text-zinc-900">{testGstin.substring(0, 2)}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">State Code ({matchedState ? matchedState.name : 'Unknown'})</div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200 sm:col-span-2">
                <div className="text-base font-bold text-slate-800">{extractedPan}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">PAN of Business (10 Chars)</div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="text-base font-bold text-slate-800">{testGstin[12]}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Entity Number</div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="text-base font-bold text-slate-800">{testGstin[13]} {testGstin[14]}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Default 'Z' + Checksum</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Rule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Registration Thresholds */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Building className="h-5 w-5 text-zinc-700" />
            <h3 className="font-bold text-base text-slate-900">GST Registration Threshold Limits</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Goods (Intra-State Suppliers)</strong>
                <span className="text-slate-500 text-[11px]">Normal Category States</span>
              </div>
              <span className="font-mono text-sm font-bold text-zinc-950">₹40 Lakhs</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Services (or Goods & Services)</strong>
                <span className="text-slate-500 text-[11px]">All Standard Indian States</span>
              </div>
              <span className="font-mono text-sm font-bold text-zinc-950">₹20 Lakhs</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <strong className="text-slate-900 block">Special Category States</strong>
                <span className="text-slate-500 text-[11px]">Manipur, Mizoram, Nagaland, Tripura</span>
              </div>
              <span className="font-mono text-sm font-bold text-zinc-950">₹10 Lakhs</span>
            </div>
            
            <p className="text-[11px] text-slate-500 pt-1">
              *Mandatory registration applies irrespective of turnover for inter-state suppliers, casual taxable persons, and e-commerce operators.
            </p>
          </div>
        </div>

        {/* 2. E-Invoicing & E-Way Bill */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-5 w-5 text-zinc-700" />
            <h3 className="font-bold text-base text-slate-900">E-Invoicing & E-Way Bill Mandates</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900">E-Invoicing (IRN Mandate)</strong>
                <span className="font-mono font-bold text-zinc-950">Turnover &gt; ₹5 Crore</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Any taxpayer with aggregate turnover exceeding ₹5 Cr in any prior financial year since 2017-18 must generate Invoice Reference Numbers (IRN) with signed QR code for all B2B invoices and credit/debit notes via IRP.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900">E-Way Bill (EWB-01)</strong>
                <span className="font-mono font-bold text-zinc-950">Value &gt; ₹50,000</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Required for movement of goods where the consignment value exceeds ₹50,000 (inter-state and intra-state, with some states offering higher intra-state limits e.g., ₹1,00,000 in Maharashtra).
              </p>
            </div>
          </div>
        </div>

        {/* 3. Composition Scheme */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-zinc-700" />
            <h3 className="font-bold text-base text-slate-900">Composition Scheme (Section 10)</h3>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Simplified tax mechanism for small businesses with turnover up to <strong>₹1.5 Crore</strong> (₹75 Lakhs for Special Category States):
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Traders & Manufacturers of Goods:</span>
              <strong className="font-mono text-slate-900">1% of Turnover (0.5% CGST + 0.5% SGST)</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Restaurants (not serving alcohol):</span>
              <strong className="font-mono text-slate-900">5% of Turnover (2.5% CGST + 2.5% SGST)</strong>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
              <span>Service Providers (Section 10(2A)):</span>
              <strong className="font-mono text-slate-900">6% of Turnover (3% CGST + 3% SGST, up to ₹50L)</strong>
            </div>
            <div className="text-[11px] text-zinc-800 bg-zinc-100 p-2.5 rounded-lg border border-zinc-300">
              <strong>Key Condition:</strong> Composition dealers cannot collect tax from customers, cannot claim Input Tax Credit (ITC), and must issue a "Bill of Supply" instead of a Tax Invoice.
            </div>
          </div>
        </div>

        {/* 4. Reverse Charge Mechanism (RCM) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-zinc-700" />
            <h3 className="font-bold text-base text-slate-900">Reverse Charge Mechanism (RCM)</h3>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Under Section 9(3) & 9(4) of the CGST Act, the recipient of goods/services is liable to pay tax directly to the Government:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="p-2 bg-slate-50 rounded-lg flex items-start gap-2">
              <span className="font-bold text-zinc-600">&bull;</span>
              <div>
                <strong>Goods Transport Agency (GTA):</strong> Recipient pays 5% under RCM (without ITC) if GTA has not opted for forward charge (12%).
              </div>
            </li>
            <li className="p-2 bg-slate-50 rounded-lg flex items-start gap-2">
              <span className="font-bold text-zinc-600">&bull;</span>
              <div>
                <strong>Legal Services by Advocates / Senior Advocates:</strong> Business entity recipient pays 18% under RCM.
              </div>
            </li>
            <li className="p-2 bg-slate-50 rounded-lg flex items-start gap-2">
              <span className="font-bold text-zinc-600">&bull;</span>
              <div>
                <strong>Director's Remuneration:</strong> Company pays 18% RCM on services provided by company directors in their capacity.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
