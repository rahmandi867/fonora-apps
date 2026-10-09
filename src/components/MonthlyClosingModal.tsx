import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Archive, 
  Sparkles,
  Lock,
  Download
} from 'lucide-react';
import { Transaction, FinancialSummary, MonthlyClosingRecord } from '../types';
import { formatRupiah } from '../utils/formatters';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface MonthlyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMonthKey: string; // e.g. "2026-01" or "2026-09"
  activeMonthName: string; // e.g. "Januari 2026"
  nextMonthName: string; // e.g. "Februari 2026"
  transactions: Transaction[];
  currentSummary: FinancialSummary;
  theme?: MontessoriTheme;
  onExecuteMonthlyClosing: (record: MonthlyClosingRecord, startFreshNextMonth: boolean) => void;
  onExportExcel: () => void;
}

export const MonthlyClosingModal: React.FC<MonthlyClosingModalProps> = ({
  isOpen,
  onClose,
  activeMonthKey,
  activeMonthName,
  nextMonthName,
  transactions,
  currentSummary,
  theme,
  onExecuteMonthlyClosing,
  onExportExcel,
}) => {
  const [startFreshNextMonth, setStartFreshNextMonth] = useState(true);
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const primaryColor = theme?.colors.primary || '#5E8570';

  // Calculate monthly stats from active month's transactions
  const monthTransactions = transactions.filter((t) => t.tanggal.startsWith(activeMonthKey));
  
  const monthIncome = monthTransactions
    .filter((t) => t.tipe === 'pemasukan')
    .reduce((acc, t) => acc + t.nominal, 0);

  const monthExpense = monthTransactions
    .filter((t) => t.tipe === 'pengeluaran')
    .reduce((acc, t) => acc + t.nominal, 0);

  const monthNetProfit = monthIncome - monthExpense;
  const endingCash = currentSummary.saldoKas; // Closing cash to be rolled over

  const handleCloseBook = () => {
    const record: MonthlyClosingRecord = {
      id: `CLS-${activeMonthKey.replace('-', '')}`,
      bulanKey: activeMonthKey,
      namaBulan: activeMonthName,
      tanggalTutup: new Date().toISOString().replace('T', ' ').slice(0, 16),
      totalPendapatan: monthIncome,
      totalPengeluaran: monthExpense,
      labaBersih: monthNetProfit,
      saldoKasAwal: endingCash - monthNetProfit,
      saldoKasAkhir: endingCash,
      totalTransaksi: monthTransactions.length,
      status: 'ditutup',
      closedBy: 'Pak Rahman (Admin / Owner)',
      catatan: notes || `Tutup buku resmi periode ${activeMonthName}. Saldo akhir kas Rp ${endingCash.toLocaleString('id-ID')} dialihkan sebagai modal kerja awal ${nextMonthName}.`,
      transaksiTersimpan: [...monthTransactions],
    };

    onExecuteMonthlyClosing(record, startFreshNextMonth);
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
              <Archive className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Tutup Buku & Mulai Bulan Baru</h3>
              <p className="text-xs text-white/80">
                Rekapitulasi {activeMonthName} → Transisi ke {nextMonthName}
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs sm:text-sm">
          
          {/* Explanation Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-bold">Bagaimana Mekanisme Tutup Buku & Bulan Baru Bekerja?</p>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                1. Semua mutasi transaksi di <strong>{activeMonthName}</strong> akan direkapitulasi dan diarsipkan secara aman di Buku Besar Finora.
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                2. <strong>Saldo Kas Akhir</strong> bulan ini otomatis dijadikan <strong>Saldo Kas Awal (Modal Berjalan)</strong> untuk <strong>{nextMonthName}</strong>.
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                3. Halaman mutasi bulan berikutnya akan mulai kosong/bersih (*fresh sheet*) sehingga kasir dan owner siap mencatat tanpa terbebani riwayat bulan lalu.
              </p>
            </div>
          </div>

          {/* Ringkasan Keuangan Periode Berjalan */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Ringkasan Rekapitulasi {activeMonthName}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-medium">Total Pemasukan</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatRupiah(monthIncome)}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-medium">Total Pengeluaran</p>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
                  {formatRupiah(monthExpense)}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-medium">Laba Bersih</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {formatRupiah(monthNetProfit)}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-medium">Jumlah Mutasi</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {monthTransactions.length} Transaksi
                </p>
              </div>
            </div>
          </div>

          {/* Rollover Balance Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                  Saldo Kas Bergulir (Rollover ke {nextMonthName})
                </p>
                <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-100">
                  {formatRupiah(endingCash)}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Modal Kerja Terjaga</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={startFreshNextMonth}
                onChange={(e) => setStartFreshNextMonth(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Kosongkan lembar transaksi aktif untuk {nextMonthName} (Fresh Start)
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Catatan {activeMonthName} tetap tersimpan utuh di arsip dan sewaktu-waktu dapat dilihat kembali lewat filter periode.
                </p>
              </div>
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Penutupan Buku (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tutup buku tepat waktu, stok opname selesai, siap ekspansi menu baru..."
                rows={2}
                className="w-full p-2.5 rounded-xl text-xs bg-[#F2EDE4] dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
              />
            </div>

            {/* Checkbox Konfirmasi */}
            <label className="flex items-center gap-2.5 pt-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm cursor-pointer"
              />
              <span className="font-semibold">
                Saya menyetujui penutupan buku periode {activeMonthName} dan pembukaan buku {nextMonthName}.
              </span>
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F6F2EA] dark:bg-[#12171E] border-t border-[#EAE4D8] dark:border-[#242D38] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 border border-[#E0D9CC] dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cadangkan Excel Dulu</span>
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
              type="button"
              disabled={!isConfirmed}
              onClick={handleCloseBook}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                isConfirmed
                  ? 'hover:brightness-105 active:scale-95 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: primaryColor }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Tutup Buku & Buka {nextMonthName}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
