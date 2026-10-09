import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Download, 
  Wallet, 
  Sparkles, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AnnualReportSummary } from '../types';
import { formatRupiah } from '../utils/formatters';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface AnnualClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  annualSummary: AnnualReportSummary;
  onExecuteAnnualClosing: (nextYear: number, newStartingCapital: number, notes: string) => void;
  onExportAnnualBackup: () => void;
  theme?: MontessoriTheme;
}

export const AnnualClosingModal: React.FC<AnnualClosingModalProps> = ({
  isOpen,
  onClose,
  annualSummary,
  onExecuteAnnualClosing,
  onExportAnnualBackup,
  theme,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [notes, setNotes] = useState('');
  const nextYear = annualSummary.tahun + 1;
  const [startingCapital, setStartingCapital] = useState<number>(annualSummary.saldoKasAkhir);

  if (!isOpen) return null;

  const primaryColor = theme?.colors.primary || '#5E8570';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    onExecuteAnnualClosing(
      nextYear,
      startingCapital,
      notes || `Tutup buku tahun fiskal ${annualSummary.tahun} selesai. Saldo kas akhir ${formatRupiah(annualSummary.saldoKasAkhir)} dialihkan sebagai ekuitas modal kerja pembuka tahun fiskal ${nextYear}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Tutup Buku Tahunan & Mulai Tahun {nextYear}</h3>
              <p className="text-xs text-white/80">
                Penyelesaian Tahun Buku {annualSummary.tahun} → Pembukaan Tahun Fiskal Baru {nextYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          
          {/* Explanation Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-bold">Mekanisme Rekap Tahunan & Mulai Tahun Baru</p>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                Tutup buku tahunan akan mengarsipkan seluruh mutasi periode {annualSummary.tahun} sebagai buku tahunan resmi. Saldo kas penutupan akan digulirkan sebagai <strong>Modal Kas Awal</strong> untuk memulai pencatatan bersih pada <strong>Januari {nextYear}</strong>.
              </p>
            </div>
          </div>

          {/* Key Annual Totals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
              <p className="text-[10px] text-slate-400">Total Omzet Tahunan ({annualSummary.tahun})</p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatRupiah(annualSummary.totalPendapatan)}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
              <p className="text-[10px] text-slate-400">Total Laba Bersih ({annualSummary.tahun})</p>
              <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {formatRupiah(annualSummary.labaBersih)}
              </p>
            </div>
          </div>

          {/* Rollover to New Year Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Modal Kas Awal untuk Tahun {nextYear} (Rollover)
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                Otomatis dari Saldo Akhir
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Rp
              </span>
              <input
                type="number"
                min="0"
                step="100000"
                value={startingCapital}
                onChange={(e) => setStartingCapital(Number(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-emerald-300 dark:border-emerald-800 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
              Anda dapat menyesuaikan nilai modal awal jika sebagian saldo kas disetorkan ke tabungan pribadi owner atau deviden.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Evaluasi / Notulensi Tutup Buku Tahunan:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Target omzet 2026 tercapai 105%. Rencana 2027 membuka cabang kedua..."
              rows={2}
              className="w-full p-2.5 rounded-xl text-xs bg-[#F2EDE4] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
            />
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-emerald-600 rounded-sm cursor-pointer"
            />
            <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              Saya menyetujui penguncian buku tahunan {annualSummary.tahun} dan membuka lembar pembukuan baru untuk tahun {nextYear}.
            </span>
          </label>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EAE4D8] dark:border-[#242D38] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onExportAnnualBackup}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 border border-[#E0D9CC] dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cadangkan Laporan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!isConfirmed}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  isConfirmed
                    ? 'hover:brightness-105 active:scale-95 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: primaryColor }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Kunci {annualSummary.tahun} & Mulai {nextYear}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
