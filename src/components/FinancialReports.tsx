import React, { useState, useEffect } from 'react';
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
  Scale,
  Edit3,
  X,
  RotateCcw,
  Save,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { FinancialSummary, Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FinancialReportsProps {
  summary: FinancialSummary;
  transactions: Transaction[];
  onExportExcel: () => void;
  onExportWord: () => void;
  currentUser?: { email?: string; role?: string; name?: string } | null;
}

export interface PnlBreakdownSettings {
  hppNominal: number;
  bebanGaji: number;
  bebanSewaListrikAir: number;
  bebanPemasaran: number;
  bebanLogistik: number;
  bebanPemeliharaan: number;
}

const defaultPnlSettings: PnlBreakdownSettings = {
  hppNominal: 21500000,
  bebanGaji: 14000000,
  bebanSewaListrikAir: 6800000,
  bebanPemasaran: 3200000,
  bebanLogistik: 2500000,
  bebanPemeliharaan: 1300000,
};

export const FinancialReports: React.FC<FinancialReportsProps> = ({
  summary,
  transactions,
  onExportExcel,
  onExportWord,
  currentUser,
}) => {
  const isCashier = currentUser?.role
    ? currentUser.role.toLowerCase().includes('kasir')
    : false;
  const [activeReportTab, setActiveReportTab] = useState<'laba_rugi' | 'arus_kas' | 'rasio'>('laba_rugi');
  
  // P&L Component Customization without coding (stored in localStorage)
  const [pnlSettings, setPnlSettings] = useState<PnlBreakdownSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-pnl-settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return defaultPnlSettings;
        }
      }
    }
    return defaultPnlSettings;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<PnlBreakdownSettings>(pnlSettings);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync temp settings whenever modal opens
  const handleOpenEditModal = () => {
    setTempSettings(pnlSettings);
    setIsEditModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setPnlSettings(tempSettings);
    localStorage.setItem('finora-pnl-settings', JSON.stringify(tempSettings));
    setIsEditModalOpen(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleResetToDefault = () => {
    setTempSettings(defaultPnlSettings);
    setPnlSettings(defaultPnlSettings);
    localStorage.setItem('finora-pnl-settings', JSON.stringify(defaultPnlSettings));
    setIsEditModalOpen(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Calculations based on dynamic P&L settings & live transactions summary
  const hppBahanBaku = pnlSettings.hppNominal;
  const labaKotor = summary.totalPendapatan - hppBahanBaku;
  const marginKotor = summary.totalPendapatan > 0 
    ? ((labaKotor / summary.totalPendapatan) * 100).toFixed(1) 
    : '0';

  const totalBebanOperasional = 
    pnlSettings.bebanGaji + 
    pnlSettings.bebanSewaListrikAir + 
    pnlSettings.bebanPemasaran + 
    pnlSettings.bebanLogistik + 
    pnlSettings.bebanPemeliharaan;

  const labaBersihDihitung = labaKotor - totalBebanOperasional;
  const marginBersihDihitung = summary.totalPendapatan > 0
    ? ((labaBersihDihitung / summary.totalPendapatan) * 100).toFixed(1)
    : '0';

  return (
    <div
      id="financial-reports-card"
      className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs transition-colors"
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
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ringkasan Laba Rugi Periode September 2026
                </div>
                <div className="flex items-center gap-2">
                  {saveSuccessNotice && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Tersimpan!
                    </span>
                  )}
                  {!isCashier && (
                    <button
                      type="button"
                      id="edit-pnl-settings-btn"
                      onClick={handleOpenEditModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 transition-all cursor-pointer shadow-2xs"
                      title="Ubah rincian komponen HPP dan Beban Operasional langsung dari UI tanpa koding"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sesuaikan Komponen P&L</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {/* 1. Pendapatan */}
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>1. Pendapatan Penjualan Bersih (Omzet Kasir)</span>
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
                    <span>{formatRupiah(pnlSettings.bebanGaji)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Sewa Tempat, Listrik & Air</span>
                    <span>{formatRupiah(pnlSettings.bebanSewaListrikAir)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Pemasaran, Promosi & Ads</span>
                    <span>{formatRupiah(pnlSettings.bebanPemasaran)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Logistik & Kemasan Takeaway</span>
                    <span>{formatRupiah(pnlSettings.bebanLogistik)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Pemeliharaan Mesin & Lain-lain</span>
                    <span>{formatRupiah(pnlSettings.bebanPemeliharaan)}</span>
                  </div>
                </div>

                {/* Total Beban */}
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold pl-4 pt-1">
                  <span>Total Beban Operasional</span>
                  <span className="text-rose-600 dark:text-rose-400">
                    - {formatRupiah(totalBebanOperasional)}
                  </span>
                </div>

                {/* Laba Bersih */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                  <span>Laba Bersih Sebelum Pajak (Net Income)</span>
                  <div className="text-right">
                    <span className="text-base text-emerald-700 dark:text-emerald-300">
                      {formatRupiah(labaBersihDihitung)}
                    </span>
                    <span className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Net Profit Margin: {marginBersihDihitung}%
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
      {/* MODAL: Sesuaikan Komponen Laba Rugi Tanpa Koding */}
      {isEditModalOpen && (
        <div 
          id="pnl-edit-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            id="pnl-edit-modal-card"
            className="w-full max-w-lg rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8] dark:border-[#242D38]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg">
                    Sesuaikan Komponen Laba Rugi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Atur nilai HPP & biaya operasional langsung tanpa koding
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSettings} className="space-y-4 pt-4 text-xs">
              {/* Info Box */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 text-slate-700 dark:text-slate-300">
                <p className="leading-relaxed">
                  💡 <strong>Catatan:</strong> Pendapatan Penjualan (Omzet) otomatis diambil dari transaksi kasir aktif sebesar <strong className="text-emerald-700 dark:text-emerald-300">{formatRupiah(summary.totalPendapatan)}</strong>. Di bawah ini Anda dapat menyesuaikan estimasi biaya untuk periode ini:
                </p>
              </div>

              {/* 1. HPP */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Harga Pokok Penjualan (HPP Bahan Baku)</span>
                  <span className="text-[11px] font-normal text-slate-500">{formatRupiah(tempSettings.hppNominal)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={tempSettings.hppNominal}
                    onChange={(e) => setTempSettings({ ...tempSettings, hppNominal: Number(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* 2. Beban Gaji */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Beban Gaji & Upah Barista/Staf</span>
                  <span className="text-[11px] font-normal text-slate-500">{formatRupiah(tempSettings.bebanGaji)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={tempSettings.bebanGaji}
                    onChange={(e) => setTempSettings({ ...tempSettings, bebanGaji: Number(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* 3. Sewa Tempat & Utilitas */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Sewa Tempat, Listrik & Air</span>
                  <span className="text-[11px] font-normal text-slate-500">{formatRupiah(tempSettings.bebanSewaListrikAir)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={tempSettings.bebanSewaListrikAir}
                    onChange={(e) => setTempSettings({ ...tempSettings, bebanSewaListrikAir: Number(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* 4. Pemasaran & Promosi */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Pemasaran, Promosi & Ads</span>
                  <span className="text-[11px] font-normal text-slate-500">{formatRupiah(tempSettings.bebanPemasaran)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={tempSettings.bebanPemasaran}
                    onChange={(e) => setTempSettings({ ...tempSettings, bebanPemasaran: Number(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* 5. Logistik & Kemasan */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Logistik & Kemasan Takeaway</span>
                  <span className="text-[11px] font-normal text-slate-500">{formatRupiah(tempSettings.bebanLogistik)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={tempSettings.bebanLogistik}
                    onChange={(e) => setTempSettings({ ...tempSettings, bebanLogistik: Number(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* 6. Pemeliharaan Mesin */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Pemeliharaan Mesin & Lain-lain</span>
                  <span className="text-[11px] font-normal text-slate-500">{formatRupiah(tempSettings.bebanPemeliharaan)}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={tempSettings.bebanPemeliharaan}
                    onChange={(e) => setTempSettings({ ...tempSettings, bebanPemeliharaan: Number(e.target.value) || 0 })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Estimasi Kalkulasi Langsung */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Total Beban Operasional:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {formatRupiah(
                      tempSettings.bebanGaji + 
                      tempSettings.bebanSewaListrikAir + 
                      tempSettings.bebanPemasaran + 
                      tempSettings.bebanLogistik + 
                      tempSettings.bebanPemeliharaan
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <span>Estimasi Laba Bersih Baru:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(
                      summary.totalPendapatan - 
                      tempSettings.hppNominal - 
                      (tempSettings.bebanGaji + 
                       tempSettings.bebanSewaListrikAir + 
                       tempSettings.bebanPemasaran + 
                       tempSettings.bebanLogistik + 
                       tempSettings.bebanPemeliharaan)
                    )}
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-2 gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bawaan</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
