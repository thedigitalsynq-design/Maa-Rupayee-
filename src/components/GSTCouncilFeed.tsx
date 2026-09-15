import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Filter,
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';
import { GST_COUNCIL_UPDATES } from '../data/gstCouncilUpdates';
import { GSTCouncilStatus } from '../types';

export const GSTCouncilFeed: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<GSTCouncilStatus | 'ALL'>('ALL');

  const filteredUpdates = GST_COUNCIL_UPDATES.filter(u => {
    if (filterStatus !== 'ALL' && u.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Feed Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
          <Bell className="h-3.5 w-3.5 text-amber-700" />
          <span>GST Council Decisions & CBIC Notifications Intelligence</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          India GST Council Intelligence & Notification Tracker
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Tracks official GST Council recommendations vs legal CBIC gazette notifications. We verify legal status before altering calculation engines.
        </p>
      </div>

      {/* Critical India Tax Principle Callout (Section 8 & 17) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8 border border-slate-800 shadow-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-sm text-amber-300">
              The Indian Statutory Rule: Council Recommendation &ne; Legally Effective GST Rule
            </h3>
            <p className="text-slate-300 leading-relaxed">
              In India, GST Council press releases do <strong>not</strong> have legal force until the Central Board of Indirect Taxes and Customs (CBIC) issues an official statutory notification in the Gazette of India under Section 11 of the CGST Act.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1 text-amber-400">
                &bull; <strong>Recommended:</strong> Discussed/approved by Council, awaiting notification.
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                &bull; <strong>Notified:</strong> Gazette published with a prospective date.
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                &bull; <strong>Effective:</strong> Legally in force; active in calculator.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 text-xs font-bold">
        <span className="text-slate-500">Filter by Status:</span>
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            filterStatus === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          All Updates
        </button>
        <button
          onClick={() => setFilterStatus('Effective')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            filterStatus === 'Effective'
              ? 'bg-emerald-700 text-white border-emerald-800'
              : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
          }`}
        >
          Effective (In Force)
        </button>
        <button
          onClick={() => setFilterStatus('Recommended')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            filterStatus === 'Recommended'
              ? 'bg-amber-600 text-white border-amber-700'
              : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
          }`}
        >
          Recommended (Pending)
        </button>
      </div>

      {/* Intelligence Cards Feed */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <div
            key={update.id}
            className={`bg-white rounded-2xl p-6 border shadow-xs transition-all ${
              update.status === 'Effective'
                ? 'border-slate-200 hover:border-emerald-300'
                : 'border-amber-200 bg-amber-50/20 hover:border-amber-400'
            }`}
          >
            {/* Card Top: Meeting & Status Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 font-mono">
                  {update.meeting}
                </span>
                <span className="text-xs text-slate-400 font-medium">&bull;</span>
                <span className="text-xs font-semibold text-slate-600 font-mono">
                  HSN/SAC {update.hsnSac}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${
                    update.status === 'Effective'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : update.status === 'Notified'
                      ? 'bg-sky-100 text-sky-900 border-sky-300'
                      : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}
                >
                  {update.status === 'Effective' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  )}
                  <span>Status: {update.status}</span>
                </span>

                {/* Calculator Impact Badge */}
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    update.appliedToCalculator
                      ? 'bg-slate-900 text-emerald-400'
                      : 'bg-amber-200/80 text-amber-950 border border-amber-300'
                  }`}
                >
                  {update.appliedToCalculator ? 'Active in Engine' : 'Pending Gazette (Not Applied)'}
                </span>
              </div>
            </div>

            {/* Title & Product */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {update.title}
            </h3>
            <div className="text-xs text-slate-600 font-medium mb-3">
              Commodity / Service: <strong className="text-slate-900">{update.productName}</strong>
            </div>

            {/* Old Rate vs New Rate Visual Bar */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Previous Rate</span>
                  <span className="text-base font-bold text-slate-700 line-through">{update.oldRate}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-600" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">New / Proposed Rate</span>
                  <span className="text-base font-extrabold text-emerald-700">{update.newRate}</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-400 text-[10px] uppercase">Effective Date</div>
                <div className="font-bold text-slate-800 font-mono flex items-center gap-1 justify-end">
                  <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {update.effectiveDate}
                </div>
              </div>
            </div>

            {/* Impact Summary & Context */}
            <p className="text-xs text-slate-700 leading-relaxed mb-3">
              {update.impactSummary}
            </p>

            {/* Legal Footnote */}
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>Notification No:</strong> {update.notificationNo || 'Pending Official Gazette'}
              </span>
              <span>
                <strong>Source:</strong> {update.officialSource}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
