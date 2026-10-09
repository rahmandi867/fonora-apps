import React, { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileSpreadsheet, 
  FileText, 
  Archive, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Download,
  Lock,
  Sparkles,
  Search,
  ShieldCheck,
  ChevronRight,
  Eye,
  Building
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { AnnualReportSummary, MonthlyClosingRecord } from '../types';
import { formatRupiah } from '../utils/formatters';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface AnnualReconciliationViewProps {
  annualSummary: AnnualReportSummary;
  closedBooks: MonthlyClosingRecord[];
  onSelectMonthForInspection: (monthKey: string) => void;
  onOpenAnnualClosingModal: () => void;
  onExportExcel: () => void;
  onExportWord: () => void;
  theme?: MontessoriTheme;
}

export const AnnualReconciliationView: React.FC<AnnualReconciliationViewProps> = ({
  annualSummary,
  closedBooks,
  onSelectMonthForInspection,
  onOpenAnnualClosingModal,
  onExportExcel,
  onExportWord,
  theme,
}) => {
  const [selectedChartMetric, setSelectedChartMetric] = useState<'semua' | 'laba'>('semua');
  const primaryColor = theme?.colors.primary || '#5E8570';
  const accentColor = theme?.colors.accent || '#D5A259';

  const chartData = annualSummary.rekapBulanan.map((item) => ({
    name: item.bulan.slice(0, 3),
    fullName: item.bulan,
    pendapatan: item.pendapatan,
    pengeluaran: item.pengeluaran,
    laba: item.laba,
  }));

  return (
    <div className="space-y-6">
      
      {/* Header Section (Bersih tanpa banner gradien besar) */}
      <div 
        id="annual-reconciliation-header"
        className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-center gap-3.5">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Rekapitulasi Laporan Tahunan — Tahun Buku {annualSummary.tahun}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {annualSummary.status === 'aktif' ? 'Tahun Buku Aktif' : 'Tahun Buku Diarsipkan'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Konsolidasi performa keuangan 12 bulan (Januari s.d. Desember) untuk evaluasi tahunan, SPT Pajak UMKM, & pengajuan KUR.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Excel Tahunan</span>
          </button>

          <button
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Word Resmi</span>
          </button>

          <button
            onClick={onOpenAnnualClosingModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer hover:brightness-105"
            style={{ backgroundColor: primaryColor }}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Tutup Tahun & Mulai {annualSummary.tahun + 1}</span>
          </button>
        </div>
      </div>

      {/* 4 Kartu Metrik Tahunan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Omzet */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Omzet Tahunan ({annualSummary.tahun})
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(annualSummary.totalPendapatan)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <span>Konsolidasi 12 Bulan Pembukuan</span>
          </p>
        </div>

        {/* Total Pengeluaran */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Beban & HPP Tahunan
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(annualSummary.totalPengeluaran)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            HPP Bahan Baku, Gaji Staf & Sewa
          </p>
        </div>

        {/* Laba Bersih Tahunan */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Laba Bersih Akumulasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatRupiah(annualSummary.labaBersih)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Rata-rata Margin: <strong className="text-slate-700 dark:text-slate-300">{annualSummary.marginRataRata}%</strong>
          </p>
        </div>

        {/* Saldo Kas Berjalan */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Posisi Kas Akhir Periode
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            {formatRupiah(annualSummary.saldoKasAkhir)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            Siap untuk rollover modal baru
          </p>
        </div>

      </div>

      {/* Grafik Kinerja 12 Bulan */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE4D8] dark:border-[#242D38]">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tren Pendapatan & Beban Bulanan ({annualSummary.tahun})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan pertumbuhan omzet dan pengeluaran tiap bulan dalam setahun
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F4EFE6] dark:bg-slate-800 self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setSelectedChartMetric('semua')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedChartMetric === 'semua'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Semua Metrik
            </button>
            <button
              onClick={() => setSelectedChartMetric('laba')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedChartMetric === 'laba'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              Laba Bersih Saja
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis 
                tick={{ fontSize: 10 }} 
                tickFormatter={(val) => `Rp${(val / 1000000).toFixed(0)}jt`}
              />
              <Tooltip 
                formatter={(val: any) => [formatRupiah(Number(val)), '']}
                labelFormatter={(lbl, payload) => {
                  const item = payload?.[0]?.payload;
                  return item ? item.fullName : lbl;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              {selectedChartMetric === 'semua' ? (
                <>
                  <Bar dataKey="pendapatan" name="Pendapatan" fill={primaryColor} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="laba" name="Laba Bersih" fill={accentColor} radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <Bar dataKey="laba" name="Laba Bersih" fill={accentColor} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabel Rincian 12 Bulan (Januari s.d. Desember) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE4D8] dark:border-[#242D38]">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tabel Rekapitulasi Pembukuan 12 Bulan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klik <strong>"Periksa Transaksi"</strong> pada baris bulan tertentu untuk memeriksa seluruh mutasi detail di bulan tersebut.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-[#F4EFE6] dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
            12 Periode Fiskal
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE4D8] dark:border-[#242D38] text-slate-400 font-semibold">
                <th className="py-3 px-3">Bulan</th>
                <th className="py-3 px-3">Pendapatan</th>
                <th className="py-3 px-3">Pengeluaran</th>
                <th className="py-3 px-3">Laba Bersih</th>
                <th className="py-3 px-3">Margin</th>
                <th className="py-3 px-3">Status Buku</th>
                <th className="py-3 px-3 text-right">Aksi Pemeriksaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE4D8]/60 dark:divide-[#242D38]/60">
              {annualSummary.rekapBulanan.map((m) => {
                const isClosed = m.status === 'ditutup';
                const isOngoing = m.status === 'berjalan';
                const isUpcoming = m.status === 'belum_mulai';

                return (
                  <tr key={m.bulanKey} className="hover:bg-[#F8F4EC] dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {m.bulan} {annualSummary.tahun}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {isUpcoming ? '-' : formatRupiah(m.pendapatan)}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-rose-600 dark:text-rose-400">
                      {isUpcoming ? '-' : formatRupiah(m.pengeluaran)}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      {isUpcoming ? '-' : formatRupiah(m.laba)}
                    </td>
                    <td className="py-3.5 px-3">
                      {isUpcoming ? '-' : (
                        <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {m.margin}%
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {isClosed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Ditutup Resmi
                        </span>
                      )}
                      {isOngoing && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3 h-3" />
                          Buku Berjalan
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400">
                          Mendatang
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {!isUpcoming ? (
                        <button
                          onClick={() => onSelectMonthForInspection(m.bulanKey)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F0EBE0] dark:bg-slate-800 hover:bg-[#E6DFD2] dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                          title={`Buka & periksa transaksi bulan ${m.bulan}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Periksa Transaksi</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Belum ada mutasi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
