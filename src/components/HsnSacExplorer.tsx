import React, { useState } from 'react';
import { Search, Filter, BookOpen, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { GST_DATABASE } from '../data/gstDatabase';
import { GSTItem } from '../types';

interface HsnSacExplorerProps {
  onSelectForCalculation: (item: GSTItem) => void;
}

export const HsnSacExplorer: React.FC<HsnSacExplorerProps> = ({ onSelectForCalculation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'GOODS' | 'SERVICES'>('ALL');
  const [selectedRate, setSelectedRate] = useState<number | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Categories list
  const categories = Array.from(new Set(GST_DATABASE.map(i => i.category))).sort();

  const filteredItems = GST_DATABASE.filter((item) => {
    // Type filter
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;

    // Rate filter
    if (selectedRate !== 'ALL' && item.gstRate !== selectedRate) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const codeMatch = item.code.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const catMatch = item.category.toLowerCase().includes(q);
      const subCatMatch = item.subCategory?.toLowerCase().includes(q) || false;
      const kwMatch = item.keywords.some(k => k.toLowerCase().includes(q));
      return codeMatch || descMatch || catMatch || subCatMatch || kwMatch;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Title */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>CBIC Tariff Schedule • HSN Chapters 01–98 & SAC 99</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Official Indian HSN & SAC Tariff Explorer</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 max-w-2xl leading-relaxed">
          Explore Goods (HSN Chapters 01–98) and Services (SAC Section 99) with official CBIC classifications and rates.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search input */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by HSN/SAC code, product name, or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-2">
            <select
              aria-label="Filter by Goods or Services"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">All (Goods & Services)</option>
              <option value="GOODS">HSN (Goods)</option>
              <option value="SERVICES">SAC (Services)</option>
            </select>
          </div>

          {/* Rate Filter */}
          <div className="sm:col-span-2">
            <select
              aria-label="Filter by GST Slab Rate"
              value={selectedRate.toString()}
              onChange={(e) => setSelectedRate(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none font-semibold text-slate-700"
            >
              <option value="ALL">All Rates</option>
              <option value="0">0% (Nil/Exempt)</option>
              <option value="5">5% Merit</option>
              <option value="18">18% Standard</option>
              <option value="40">40% Sin & Luxury</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              aria-label="Filter by Sector Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none font-semibold text-slate-700 truncate"
            >
              <option value="ALL">All Sectors</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active counter */}
        <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredItems.length}</strong> official tariff classifications
          </span>
          <span className="text-[11px] text-zinc-600 font-medium">
            Source: Central Board of Indirect Taxes and Customs (CBIC)
          </span>
        </div>
      </div>

      {/* Grid of HSN / SAC items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.code}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Code & Slab */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-sm px-2 py-0.5 rounded bg-zinc-900 text-white">
                    {item.code}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.type}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-zinc-950 font-mono">
                    {item.gstRate}%
                  </span>
                  {item.cessRate && (
                    <span className="text-xs text-zinc-600 font-bold ml-1">
                      +{item.cessRate}% Cess
                    </span>
                  )}
                </div>
              </div>

              {/* Category & SubCategory */}
              <div className="text-xs font-semibold text-slate-700 mb-1">
                {item.category}
                {item.subCategory && <span className="text-slate-400 font-normal"> &bull; {item.subCategory}</span>}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {item.description}
              </p>

              {/* Applicable Conditions snippet */}
              {item.applicableConditions && (
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-600 mb-3">
                  <strong className="text-slate-800">Condition: </strong>
                  {item.applicableConditions}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 truncate max-w-[170px]" title={item.source}>
                {item.source}
              </span>

              <button
                onClick={() => onSelectForCalculation(item)}
                className="px-3 py-1 bg-zinc-900 hover:bg-black text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
              >
                Calculate GST &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
