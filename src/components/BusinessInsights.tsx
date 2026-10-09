import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  RefreshCw, 
  ArrowRight,
  Check,
  X,
  AlertCircle,
  Tag,
  CheckCircle2,
  Undo2
} from 'lucide-react';
import { BusinessInsight } from '../types';

interface BusinessInsightsProps {
  insights: BusinessInsight[];
  onApplyRecommendation?: (insight: BusinessInsight) => void;
  onShowToast?: (message: string) => void;
}

export const BusinessInsights: React.FC<BusinessInsightsProps> = ({
  insights: initialInsights,
  onApplyRecommendation,
  onShowToast,
}) => {
  const [insights, setInsights] = useState<BusinessInsight[]>(initialInsights);
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Stored application and cancellation states
  const [appliedIds, setAppliedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-applied-insights');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [cancelledIds, setCancelledIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-cancelled-insights');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Modal confirmation state
  const [confirmModalData, setConfirmModalData] = useState<{
    insight: BusinessInsight;
    actionType: 'terapkan' | 'batalkan';
  } | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const executeApply = (insight: BusinessInsight) => {
    const updatedApplied = [...appliedIds.filter((id) => id !== insight.id), insight.id];
    const updatedCancelled = cancelledIds.filter((id) => id !== insight.id);
    
    setAppliedIds(updatedApplied);
    setCancelledIds(updatedCancelled);
    localStorage.setItem('finora-applied-insights', JSON.stringify(updatedApplied));
    localStorage.setItem('finora-cancelled-insights', JSON.stringify(updatedCancelled));

    if (onApplyRecommendation) {
      onApplyRecommendation(insight);
    }
    if (onShowToast) {
      onShowToast(`Promosi "${insight.judul}" berhasil diterapkan ke sistem kasir!`);
    }
    setConfirmModalData(null);
  };

  const executeCancel = (insight: BusinessInsight) => {
    const updatedCancelled = [...cancelledIds.filter((id) => id !== insight.id), insight.id];
    const updatedApplied = appliedIds.filter((id) => id !== insight.id);

    setCancelledIds(updatedCancelled);
    setAppliedIds(updatedApplied);
    localStorage.setItem('finora-applied-insights', JSON.stringify(updatedApplied));
    localStorage.setItem('finora-cancelled-insights', JSON.stringify(updatedCancelled));

    if (onShowToast) {
      onShowToast(`Promosi "${insight.judul}" telah dibatalkan.`);
    }
    setConfirmModalData(null);
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
      className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs transition-colors"
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
          const isCancelled = cancelledIds.includes(insight.id);

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border ${
                isApplied
                  ? 'border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-500/20'
                  : isCancelled
                  ? 'border-slate-200 dark:border-slate-800 opacity-75'
                  : 'border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              } transition-all flex flex-col justify-between`}
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

              {/* Action Recommendation & Buttons: Terapkan & Batalkan */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Aksi:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{insight.rekomendasiAksi}</span>
                </div>

                {/* Pilihan Aksi: Terapkan & Batalkan */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {isApplied ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Diterapkan</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfirmModalData({ insight, actionType: 'batalkan' })}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 transition-colors cursor-pointer"
                        title="Batalkan promosi ini"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Batalkan</span>
                      </button>
                    </>
                  ) : isCancelled ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        <X className="w-3.5 h-3.5" />
                        <span>Dibatalkan</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfirmModalData({ insight, actionType: 'terapkan' })}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                        title="Terapkan kembali promosi ini"
                      >
                        <ArrowRight className="w-3 h-3" />
                        <span>Terapkan</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Opsi Batalkan */}
                      <button
                        type="button"
                        onClick={() => setConfirmModalData({ insight, actionType: 'batalkan' })}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Batalkan atau lewati promosi ini"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Batalkan</span>
                      </button>
                      {/* Opsi Terapkan */}
                      <button
                        type="button"
                        onClick={() => setConfirmModalData({ insight, actionType: 'terapkan' })}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                        title="Terapkan promosi ini ke sistem kasir"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terapkan</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POP-UP MODAL KONFIRMASI: TERAPKAN / BATALKAN */}
      {confirmModalData && (
        <div 
          id="insight-confirm-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setConfirmModalData(null)}
        >
          <div 
            id="insight-confirm-modal-card"
            className="w-full max-w-md rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Icon & Header */}
            <div className="flex items-start gap-3.5 mb-4">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  confirmModalData.actionType === 'terapkan'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {confirmModalData.actionType === 'terapkan' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {confirmModalData.actionType === 'terapkan'
                    ? 'Konfirmasi Terapkan Promosi'
                    : 'Konfirmasi Batalkan Promosi'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {confirmModalData.actionType === 'terapkan'
                    ? 'Apakah Anda yakin ingin menerapkan promosi/aksi ini?'
                    : 'Apakah Anda yakin ingin membatalkan aksi promosi ini?'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 mb-5 text-xs space-y-2">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Nama Rekomendasi:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{confirmModalData.insight.judul}</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Rekomendasi Aksi:</span>
                <p className="text-slate-600 dark:text-slate-300 italic">{confirmModalData.insight.rekomendasiAksi}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block uppercase">Proyeksi Finansial:</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">{confirmModalData.insight.dampak}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {confirmModalData.actionType === 'terapkan' ? 'Batalkan' : 'Tutup'}
              </button>

              {confirmModalData.actionType === 'terapkan' ? (
                <button
                  type="button"
                  onClick={() => executeApply(confirmModalData.insight)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  Terapkan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => executeCancel(confirmModalData.insight)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  Batalkan Promosi
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
