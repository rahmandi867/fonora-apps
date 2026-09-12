import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw, 
  ArrowRight,
  Check,
  Tag
} from 'lucide-react';
import { BusinessInsight } from '../types';

interface BusinessInsightsProps {
  insights: BusinessInsight[];
  onApplyRecommendation?: (insight: BusinessInsight) => void;
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({
  insights: initialInsights,
}) => {
  const [insights, setInsights] = useState<BusinessInsight[]>(initialInsights);
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleApply = (id: string) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  const filteredInsights = selectedFilter === 'Semua' 
    ? insights 
    : insights.filter(i => i.kategori === selectedFilter || (selectedFilter === 'Peringatan' && i.tipe === 'peringatan'));

  const getTypeStyle = (tipe: BusinessInsight['tipe']) => {
    switch (tipe) {
      case 'positif':
        return {
          badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: TrendingUp,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          borderColor: 'border-l-emerald-500',
        };
      case 'peringatan':
        return {
          badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400',
          borderColor: 'border-l-amber-500',
        };
      case 'rekomendasi':
        return {
          badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: Lightbulb,
          iconColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-l-blue-500',
        };
      default:
        return {
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200',
          icon: Sparkles,
          iconColor: 'text-slate-500',
          borderColor: 'border-l-slate-400',
        };
    }
  };

  return (
    <div
      id="business-insights-container"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Insight Bisnis Otomatis
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Finora AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analisis cerdas berdasarkan buku kas, rasio profit, dan tren konsumsi pelanggan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Refresh simulated trigger */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            title="Analisis ulang pembukuan"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
            <span>{isRefreshing ? 'Menganalisis...' : 'Segarkan Data'}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar">
        {['Semua', 'Efisiensi Biaya', 'Penjualan', 'Inventaris', 'Arus Kas'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedFilter(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
              selectedFilter === tag
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filteredInsights.map((insight) => {
          const style = getTypeStyle(insight.tipe);
          const Icon = style.icon;
          const isApplied = appliedIds.includes(insight.id);

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}
                  >
                    <Icon className="w-3 h-3" />
                    {insight.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400">{insight.tanggal}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {insight.judul}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {insight.deskripsi}
                </p>

                {/* Impact callout */}
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 mb-3 text-xs">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Proyeksi Dampak Keuangan:
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {insight.dampak}
                  </div>
                </div>
              </div>

              {/* Action Recommendation */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Aksi:</span>{' '}
                  {insight.rekomendasiAksi}
                </div>
                <button
                  onClick={() => handleApply(insight.id)}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isApplied
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Diterapkan</span>
                    </>
                  ) : (
                    <>
                      <span>Terapkan</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
