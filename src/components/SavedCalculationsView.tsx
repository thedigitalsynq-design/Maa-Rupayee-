import React from 'react';
import { BookmarkCheck, Download, Trash2, ArrowUpRight, Calculator, FileSpreadsheet } from 'lucide-react';
import { SavedCalculation } from '../types';
import { formatIndianCurrency } from '../utils/indianCurrency';

interface SavedCalculationsViewProps {
  savedList: SavedCalculation[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onReload: (calc: SavedCalculation) => void;
}

export const SavedCalculationsView: React.FC<SavedCalculationsViewProps> = ({
  savedList,
  onDelete,
  onClearAll,
  onReload,
}) => {
  const handleExportCSV = () => {
    if (savedList.length === 0) return;

    const headers = [
      'Timestamp',
      'Query',
      'Product',
      'HSN/SAC',
      'GST Rate (%)',
      'Supplier State',
      'Customer State',
      'Transaction Type',
      'Taxable Value (INR)',
      'GST Amount (INR)',
      'Final Invoice Value (INR)',
    ];

    const rows = savedList.map(item => [
      new Date(item.timestamp).toLocaleString('en-IN'),
      `"${(item.query ?? '').replace(/"/g, '""')}"`,
      `"${(item.product ?? '').replace(/"/g, '""')}"`,
      item.hsnSac,
      item.rate,
      `"${item.supplierState}"`,
      `"${item.customerState}"`,
      item.transactionType,
      item.taxableValue,
      item.gstAmount,
      item.finalAmount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartGST_India_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
            <BookmarkCheck className="h-3.5 w-3.5" />
            <span>My Calculations & Audit Records</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Saved GST Determinations & Audits
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
            Persisted locally for easy reference, tax invoice creation, and CSV export.
          </p>
        </div>

        {savedList.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {savedList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Calculator className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No Saved Calculations</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Perform any query in the Smart GST Calculator and click "Save for Audit" to store it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-900 text-white rounded">
                    HSN {item.hsnSac}
                  </span>
                  <span className="text-xs font-extrabold text-zinc-900 font-mono">
                    {item.rate}% GST
                  </span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {item.transactionType} ({item.supplierState} &rarr; {item.customerState})
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.product}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Query: <span className="italic">"{item.query}"</span> &bull; {new Date(item.timestamp).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Amounts & Actions */}
              <div className="flex items-center gap-6">
                <div className="text-right text-xs">
                  <div className="text-slate-500">Taxable: <strong className="font-mono text-slate-800">{formatIndianCurrency(item.taxableValue)}</strong></div>
                  <div className="text-zinc-700">GST: <strong className="font-mono text-zinc-900">{formatIndianCurrency(item.gstAmount)}</strong></div>
                  <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                    Total: {formatIndianCurrency(item.finalAmount)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReload(item)}
                    title="Reload in Calculator"
                    className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="hidden sm:inline">Open</span>
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    title="Delete record"
                    className="p-2 text-slate-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
