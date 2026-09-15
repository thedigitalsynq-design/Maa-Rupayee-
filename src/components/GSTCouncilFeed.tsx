import React, { useEffect, useState } from 'react';
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
  CalendarCheck,
  RefreshCw,
  Radio
} from 'lucide-react';
import { GST_COUNCIL_UPDATES } from '../data/gstCouncilUpdates';
import { GSTCouncilStatus, GSTCouncilUpdate } from '../types';
import { notificationSearchUrl } from '../utils/googleSearch';
import {
  fetchGovSyncState,
  formatGovSyncAge,
  isGovSyncStale,
  readGovSyncSnapshot,
  requestGovSyncRefresh,
} from '../services/govUpdatesService';

export const GSTCouncilFeed: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<GSTCouncilStatus | 'ALL'>('ALL');
  const [liveUpdates, setLiveUpdates] = useState<GSTCouncilUpdate[]>(() => readGovSyncSnapshot().updates);
  const [lastChecked, setLastChecked] = useState<string | null>(() => readGovSyncSnapshot().updatedAt);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncFailed, setSyncFailed] = useState(false);

  // Auto-check for fresh government notifications on visit (stale > 24h or never).
  useEffect(() => {
    let cancelled = false;
    const snapshot = readGovSyncSnapshot();
    setLiveUpdates(snapshot.updates);
    setLastChecked(snapshot.updatedAt);
    if (!isGovSyncStale(snapshot.updatedAt)) return;
    setSyncing(true);
    fetchGovSyncState()
      .then(state => {
        if (cancelled) return;
        setLiveUpdates(state.updates);
        setLastChecked(state.updatedAt);
        setSyncFailed(false);
      })
      .catch(() => {
        if (!cancelled) setSyncFailed(true);
      })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleManualSync = async () => {
    if (syncing) return;
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await requestGovSyncRefresh();
      setLiveUpdates(result.state.updates);
      setLastChecked(result.state.updatedAt);
      setSyncMessage(result.message);
      setSyncFailed(!result.ok);
    } catch {
      setSyncFailed(true);
      setSyncMessage('Could not reach the sync service — showing verified static database');
    } finally {
      setSyncing(false);
    }
  };

  // Synced overlay wins over bundled entries with the same id.
  const liveIds = new Set(liveUpdates.map(u => u.id));
  const mergedUpdates = [
    ...liveUpdates,
    ...GST_COUNCIL_UPDATES.filter(u => !liveIds.has(u.id)),
  ];

  const filteredUpdates = mergedUpdates.filter(u => {
    if (filterStatus !== 'ALL' && u.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Feed Header */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <Bell className="h-3.5 w-3.5" />
          <span>GST Council Decisions & CBIC Notifications Intelligence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          India GST Council Intelligence & Notification Tracker
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Tracks official GST Council recommendations vs legal CBIC gazette notifications. We verify legal status before altering calculation engines.
        </p>

        {/* Government auto-sync status */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill font-semibold">
            <Radio className="h-3.5 w-3.5" />
            <span>Auto-sync with government notifications</span>
            <span className={`h-1.5 w-1.5 rounded-full ${syncFailed ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
          </span>
          <span className="text-zinc-500 font-medium">
            Last checked {formatGovSyncAge(lastChecked)}
            {liveUpdates.length > 0 && ` • ${liveUpdates.length} live update${liveUpdates.length === 1 ? '' : 's'}`}
          </span>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950 text-white text-xs font-bold hover:bg-black disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Checking…' : 'Check now'}</span>
          </button>
        </div>
        {syncMessage && (
          <p className={`mt-2 text-xs font-medium ${syncFailed ? 'text-red-600' : 'text-zinc-500'}`}>
            {syncMessage}
          </p>
        )}
      </div>

      {/* Critical India Tax Principle Callout (Section 8 & 17) */}
      <div className="bg-zinc-950 text-white rounded-2xl p-5 border border-zinc-800 shadow-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-white shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-sm text-white">
              The Indian Statutory Rule: Council Recommendation &ne; Legally Effective GST Rule
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              In India, GST Council press releases do <strong>not</strong> have legal force until the Central Board of Indirect Taxes and Customs (CBIC) issues an official statutory notification in the Gazette of India under Section 11 of the CGST Act.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-semibold text-zinc-400">
              <span className="flex items-center gap-1 text-zinc-200">
                &bull; <strong>Recommended:</strong> Discussed/approved by Council, awaiting notification.
              </span>
              <span className="flex items-center gap-1 text-zinc-300">
                &bull; <strong>Notified:</strong> Gazette published with a prospective date.
              </span>
              <span className="flex items-center gap-1 text-white">
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
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterStatus === 'ALL'
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
          }`}
        >
          All Updates
        </button>
        <button
          onClick={() => setFilterStatus('Effective')}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterStatus === 'Effective'
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          Effective (In Force)
        </button>
        <button
          onClick={() => setFilterStatus('Recommended')}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterStatus === 'Recommended'
              ? 'bg-zinc-900 text-white border-zinc-900'
              : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-50'
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
            className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-zinc-400 shadow-xs transition-all"
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
                {liveIds.has(update.id) && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-600 text-white">
                    Live sync
                  </span>
                )}
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border bg-zinc-100 text-zinc-900 border-zinc-300"
                >
                  {update.status === 'Effective' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-900" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-zinc-600" />
                  )}
                  <span>Status: {update.status}</span>
                </span>

                {/* Calculator Impact Badge */}
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-900 text-white"
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
                <ArrowRight className="h-4 w-4 text-zinc-600" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">New / Proposed Rate</span>
                  <span className="text-base font-extrabold text-zinc-950">{update.newRate}</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-400 text-[10px] uppercase">Effective Date</div>
                <div className="font-bold text-slate-800 font-mono flex items-center gap-1 justify-end">
                  <CalendarCheck className="h-3.5 w-3.5 text-zinc-700" />
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
              <span className="flex items-center gap-3">
                <span>
                  <strong>Source:</strong> {update.officialSource}
                </span>
                <a
                  href={notificationSearchUrl(update.notificationNo, update.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-zinc-700 hover:text-zinc-950 hover:underline"
                  title="Verify this notification on Google"
                >
                  <span>Verify on Google</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
