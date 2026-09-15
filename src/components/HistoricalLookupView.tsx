import React, { useState } from 'react';
import { History, Calendar, ArrowRight, ShieldCheck, Search } from 'lucide-react';
import { HISTORICAL_RULES, getHistoricalRateForDate } from '../data/historicalRates';
import { formatIndianCurrency } from '../utils/indianCurrency';
import { calculateGST } from '../utils/gstCalculator';
import { DEFAULT_SUPPLIER_STATE, DEFAULT_CUSTOMER_STATE } from '../data/indianStates';

interface HistoricalLookupViewProps {
  onApplyHistoricalQuery: (query: string, date: string) => void;
}

export const HistoricalLookupView: React.FC<HistoricalLookupViewProps> = ({ onApplyHistoricalQuery }) => {
  const [selectedDate, setSelectedDate] = useState('2021-08-15');
  const [selectedItem, setSelectedItem] = useState(HISTORICAL_RULES[0]);
  const [testAmount, setTestAmount] = useState(10000);

  // Check rate on selectedDate
  const historicalCheck = getHistoricalRateForDate(selectedItem.itemKeyword, selectedDate, 18);

  const breakdown = calculateGST({
    amount: testAmount,
    isInclusive: false,
    gstRate: historicalCheck.rate,
    supplierState: DEFAULT_SUPPLIER_STATE,
    customerState: DEFAULT_CUSTOMER_STATE,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold mb-2">
          <History className="h-3.5 w-3.5 text-amber-600" />
          <span>Section 10: Versioned Indian GST History Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Historical GST Rate & Notification Lookup
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Query past tax rates based on transaction date. In India, GST rates evolved dramatically across footwear, electronics, food commodities, and online services.
        </p>
      </div>

      {/* Interactive Date & Item Simulator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Historical Rate Simulator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
          {/* Item Selector */}
          <div className="sm:col-span-4">
            <label className="block text-slate-600 font-semibold mb-1">Select Commodity / Category</label>
            <select
              aria-label="Select Commodity for Historical Lookup"
              value={selectedItem.id}
              onChange={(e) => {
                const found = HISTORICAL_RULES.find(r => r.id === e.target.value);
                if (found) setSelectedItem(found);
              }}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              {HISTORICAL_RULES.map((rule) => (
                <option key={rule.id} value={rule.id}>
                  {rule.description} (HSN {rule.hsnSac})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="sm:col-span-4">
            <label className="block text-slate-600 font-semibold mb-1">Historical Transaction Date</label>
            <input
              type="date"
              value={selectedDate}
              min="2017-07-01"
              max="2026-12-31"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 font-bold focus:outline-none"
            />
          </div>

          {/* Amount input */}
          <div className="sm:col-span-4">
            <label className="block text-slate-600 font-semibold mb-1">Sample Transaction Value (₹)</label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800 font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Historical Result Output */}
        <div className="mt-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Applicable Historical GST Rate</div>
              <div className="text-3xl font-extrabold text-amber-700 font-mono mt-1">
                {historicalCheck.rate}% GST
              </div>
              <div className="text-xs text-slate-600 mt-1 font-medium">
                Effective on <strong>{selectedDate}</strong>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="text-slate-500 font-medium">Historical Tax on {formatIndianCurrency(testAmount)}:</div>
              <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                {formatIndianCurrency(breakdown.totalGst)}
              </div>
              <div className="text-slate-500 text-[11px]">
                Total with Tax: <strong className="font-mono text-slate-800">{formatIndianCurrency(breakdown.totalAmount)}</strong>
              </div>
            </div>
          </div>

          {/* Notification explanation */}
          {historicalCheck.note && (
            <div className="mt-3 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Legal Citation: </strong>
              {historicalCheck.note}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => onApplyHistoricalQuery(`${selectedItem.description} ₹${testAmount}`, selectedDate)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <span>Calculate in Smart Calculator with this Date</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Historical Rules Catalog */}
      <h3 className="text-sm font-bold text-slate-900 mb-3">Landmark Indian GST Rate Milestones</h3>
      <div className="space-y-4">
        {HISTORICAL_RULES.map((rule) => (
          <div key={rule.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-slate-900 text-sm">
                {rule.description}
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                HSN {rule.hsnSac}
              </span>
            </div>

            {/* Timeline ranges */}
            <div className="space-y-2 mt-3 text-xs">
              {rule.ranges.map((range, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600">
                      {range.startDate} &rarr; {range.endDate}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold text-amber-800">{range.notificationRef}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 font-mono">{range.rate}%</span>
                    <span className="text-[11px] text-slate-500">({range.rationale})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
