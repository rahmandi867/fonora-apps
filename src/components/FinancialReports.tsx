import React, { useState } from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  TrendingUp, 
  Percent, 
  CheckCircle, 
  Download,
  Calendar,
  Building,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { FinancialSummary, Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FinancialReportsProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  onExportExcel: () => void;
  onExportWord: () => void;
}

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  summary,
  transactions,
  onExportExcel,
  onExportWord,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'laba_rugi' | 'arus_kas' | 'rasio'>('laba_rugi');

  // Calculate detailed items for P&L
  const hppBahanBaku = 21500000;
  const labaKotor = summary.totalPendapatan - hppBahanBaku;
  const marginKotor = ((labaKotor / summary.totalPendapatan) * 100).toFixed(1);

  const biayaOperasional = summary.totalPengeluaran - hppBahanBaku;
  const marginBersih = summary.marginLaba.toFixed(1);

  return (
    <div
      id="financial-reports-card"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors"
    >
      {/* Header with Title and Export Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Laporan Keuangan UMKM
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Standar SAK EMKM
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Laporan berkala untuk evaluasi bisnis, pengajuan modal KUR, dan pelaporan pajak
            </p>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="report-download-excel-btn"
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel</span>
          </button>
          <button
            id="report-download-word-btn"
            onClick={onExportWord}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Download Word</span>
          </button>
        </div>
      </div>

      {/* Tabs within Report section */}
      <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveReportTab('laba_rugi')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeReportTab === 'laba_rugi'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Laporan Laba Rugi (P&L)
        </button>
        <button
          onClick={() => setActiveReportTab('arus_kas')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeReportTab === 'arus_kas'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Laporan Arus Kas (Cash Flow)
        </button>
        <button
          onClick={() => setActiveReportTab('rasio')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeReportTab === 'rasio'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Rasio Finansial & Kesehatan UMKM
        </button>
      </div>

      {/* Report View Content */}
      <div className="pt-4">
        {activeReportTab === 'laba_rugi' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Ringkasan Laba Rugi Periode September 2026
              </div>

              <div className="space-y-2.5">
                {/* 1. Pendapatan */}
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>1. Pendapatan Penjualan Bersih (Omzet)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatRupiah(summary.totalPendapatan)}
                  </span>
                </div>

                {/* 2. HPP */}
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pl-4">
                  <span>Harga Pokok Penjualan (HPP Bahan Baku)</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    - {formatRupiah(hppBahanBaku)}
                  </span>
                </div>

                {/* Laba Kotor */}
                <div className="flex items-center justify-between py-2 border-y border-dashed border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                  <span>Laba Kotor (Gross Profit)</span>
                  <div className="text-right">
                    <span>{formatRupiah(labaKotor)}</span>
                    <span className="text-[10px] ml-2 text-emerald-600 font-normal">
                      (Margin {marginKotor}%)
                    </span>
                  </div>
                </div>

                {/* 3. Beban Operasional */}
                <div className="font-semibold text-slate-800 dark:text-slate-200 pt-1">
                  2. Beban Operasional & Usaha:
                </div>
                <div className="space-y-1 pl-4 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>• Beban Gaji & Upah Barista/Staf</span>
                    <span>Rp 14.000.000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Sewa Tempat, Listrik & Air</span>
                    <span>Rp 6.800.000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Pemasaran, Promosi & Ads</span>
                    <span>Rp 3.200.000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Logistik & Kemasan Takeaway</span>
                    <span>Rp 2.500.000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Pemeliharaan Mesin & Lain-lain</span>
                    <span>Rp 1.300.000</span>
                  </div>
                </div>

                {/* Total Beban */}
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold pl-4 pt-1">
                  <span>Total Beban Operasional</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    - {formatRupiah(biayaOperasional)}
                  </span>
                </div>

                {/* Laba Bersih */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                  <span>Laba Bersih Sebelum Pajak (Net Income)</span>
                  <div className="text-right">
                    <span className="text-base text-emerald-700 dark:text-emerald-300">
                      {formatRupiah(summary.labaBersih)}
                    </span>
                    <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Net Profit Margin: {marginBersih}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReportTab === 'arus_kas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold mb-3">
                <TrendingUp className="w-4 h-4" />
                Arus Kas Masuk (Cash Inflows)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-emerald-200/40 dark:border-emerald-900/30">
                  <span className="text-slate-600 dark:text-slate-400">Penjualan Kasir POS / QRIS</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp 65.400.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200/40 dark:border-emerald-900/30">
                  <span className="text-slate-600 dark:text-slate-400">Order Online (GrabFood / GoFood)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp 12.850.000</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Katering & Event B2B</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp 6.400.000</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex justify-between font-bold text-emerald-700 dark:text-emerald-300">
                  <span>Total Kas Masuk</span>
                  <span>{formatRupiah(summary.totalPendapatan)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-3">
                <Scale className="w-4 h-4" />
                Arus Kas Keluar (Cash Outflows)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-rose-200/40 dark:border-rose-900/30">
                  <span className="text-slate-600 dark:text-slate-400">Pembelian Bahan Baku Supplier</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp 21.500.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-rose-200/40 dark:border-rose-900/30">
                  <span className="text-slate-600 dark:text-slate-400">Payroll / Penggajian Staf</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp 14.000.000</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Beban Sewa, Listrik & Pemasaran</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rp 13.800.000</span>
                </div>
                <div className="pt-2 border-t border-rose-200 dark:border-rose-800 flex justify-between font-bold text-rose-700 dark:text-rose-300">
                  <span>Total Kas Keluar</span>
                  <span>{formatRupiah(summary.totalPengeluaran)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReportTab === 'rasio' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Net Profit Margin (NPM)</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                41.8%
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kategori: <strong className="text-emerald-600">Sangat Sehat</strong>. Standar industri F&B UMKM adalah 20-30%.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Rasio Beban Operasional</span>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                58.2%
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Biaya operasional terkendali di bawah 65% dari total penjualan kotor.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Cash Runway (Ketahanan Kas)</span>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mb-1">
                2.6 Bulan
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Saldo kas mampu menopang operasional penuh tanpa pemasukan selama 2.6 bulan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
