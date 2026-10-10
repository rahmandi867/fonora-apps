import React, { useState } from 'react';
import { 
  ReceiptText, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Eye, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Building2,
  Banknote,
  Calendar,
  Lock,
  Archive,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Transaction, TransactionType, MonthlyClosingRecord } from '../types';
import { formatRupiah, formatTanggalWaktu } from '../utils/formatters';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onSelectTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onExportExcel: () => void;
  onExportWord: () => void;
  globalSearchTerm?: string;
  selectedMonthFilter?: string; // e.g. "semua" or "2026-01", "2026-09"
  onSelectMonthFilter?: (monthKey: string) => void;
  onOpenMonthlyClosingModal?: () => void;
  onOpenAdminResetModal?: () => void;
  closedBooks?: MonthlyClosingRecord[];
  currentUser?: { email?: string; role?: string; name?: string } | null;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  onOpenAddModal,
  onSelectTransaction,
  onDeleteTransaction,
  onExportExcel,
  onExportWord,
  globalSearchTerm = '',
  selectedMonthFilter = 'semua',
  onSelectMonthFilter,
  onOpenMonthlyClosingModal,
  onOpenAdminResetModal,
  closedBooks = [],
  currentUser,
}) => {
  const isCashier = currentUser?.role
    ? currentUser.role.toLowerCase().includes('kasir')
    : false;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState<'semua' | TransactionType>('semua');
  const [filterMetode, setFilterMetode] = useState<string>('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const monthOptions = [
    { key: 'semua', label: 'Semua Periode (2026)' },
    { key: '2026-09', label: 'September 2026 (Buku Berjalan)' },
    { key: '2026-08', label: 'Agustus 2026' },
    { key: '2026-07', label: 'Juli 2026' },
    { key: '2026-06', label: 'Juni 2026' },
    { key: '2026-05', label: 'Mei 2026' },
    { key: '2026-04', label: 'April 2026' },
    { key: '2026-03', label: 'Maret 2026' },
    { key: '2026-02', label: 'Februari 2026' },
    { key: '2026-01', label: 'Januari 2026' },
  ];

  // Sync external search if provided
  const activeSearch = searchTerm || globalSearchTerm;

  const filtered = transactions.filter((item) => {
    const matchSearch =
      item.deskripsi.toLowerCase().includes(activeSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(activeSearch.toLowerCase()) ||
      item.kategori.toLowerCase().includes(activeSearch.toLowerCase()) ||
      (item.pelangganAtauVendor &&
        item.pelangganAtauVendor.toLowerCase().includes(activeSearch.toLowerCase()));

    const matchTipe = filterTipe === 'semua' || item.tipe === filterTipe;
    const matchMetode = filterMetode === 'semua' || item.metodePembayaran === filterMetode;
    const matchMonth =
      selectedMonthFilter === 'semua' || item.tanggal.startsWith(selectedMonthFilter);

    return matchSearch && matchTipe && matchMetode && matchMonth;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedTransactions = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate monthly stats if a specific month is selected
  const isMonthSelected = selectedMonthFilter !== 'semua';
  const selectedMonthObj = monthOptions.find((m) => m.key === selectedMonthFilter);
  const selectedMonthIncome = filtered
    .filter((t) => t.tipe === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);
  const selectedMonthExpense = filtered
    .filter((t) => t.tipe === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);
  const selectedMonthNet = selectedMonthIncome - selectedMonthExpense;
  const isSelectedMonthClosed = closedBooks.some((b) => b.bulanKey === selectedMonthFilter);

  const getMethodIcon = (metode: string) => {
    switch (metode) {
      case 'QRIS':
        return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Transfer Bank':
        return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'Tunai':
        return <Banknote className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <CreditCard className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      id="recent-transactions-card"
      className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs transition-colors space-y-4"
    >
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Buku Catatan Transaksi
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.length} Mutasi
            </span>
            {isMonthSelected && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Filter: {selectedMonthObj?.label.split(' ')[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pencatatan kas masuk & keluar, pemeriksaan arsip bulanan, dan penutupan buku kas
          </p>
        </div>

        {/* Action buttons: Tutup Buku, Reset Admin, Excel, Word, & Tambah */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isCashier && onOpenMonthlyClosingModal && (
            <button
              onClick={onOpenMonthlyClosingModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Tutup buku bulan ini dan gulirkan saldo ke bulan berikutnya"
            >
              <Archive className="w-3.5 h-3.5 text-amber-600" />
              <span>Tutup Buku Bulanan</span>
            </button>
          )}

          {!isCashier && onOpenAdminResetModal && (
            <button
              onClick={onOpenAdminResetModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset transaksi dengan persetujuan password admin"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Transaksi</span>
            </button>
          )}

          <button
            id="download-excel-btn"
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-xs font-semibold transition-colors"
            title="Download Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Download Excel</span>
          </button>

          <button
            id="download-word-btn"
            onClick={onExportWord}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs font-semibold transition-colors"
            title="Download Word Document"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Download Word</span>
          </button>

          <button
            id="add-transaction-table-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat</span>
          </button>
        </div>
      </div>

      {/* Selected Month Summary Ribbon (e.g. Januari 2026) */}
      {isMonthSelected && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-950 dark:text-amber-100 text-sm">
                  {selectedMonthObj?.label}
                </span>
                {isSelectedMonthClosed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    Buku Diarsipkan & Ditutup
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Clock className="w-3 h-3" />
                    Buku Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Menampilkan mutasi khusus periode ini. Anda dapat memeriksa setiap transaksi atau mengosongkan catatan periode baru.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto bg-white/70 dark:bg-slate-900/70 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
            <div>
              <p className="text-[10px] text-slate-400">Total Masuk</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(selectedMonthIncome)}
              </p>
            </div>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-[10px] text-slate-400">Total Keluar</p>
              <p className="font-bold text-rose-600 dark:text-rose-400">
                {formatRupiah(selectedMonthExpense)}
              </p>
            </div>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-[10px] text-slate-400">Laba Bersih</p>
              <p className="font-extrabold text-slate-800 dark:text-slate-100">
                {formatRupiah(selectedMonthNet)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar: Bulan, Pos (Pemasukan/Pengeluaran), & Metode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="transactions-search-filter-input"
            type="text"
            placeholder="Cari transaksi, pihak terkait, nota..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <select
              value={selectedMonthFilter}
              onChange={(e) => {
                if (onSelectMonthFilter) onSelectMonthFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.key} value={opt.key} className="bg-white dark:bg-slate-800">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipe filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            {(['semua', 'pemasukan', 'pengeluaran'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterTipe(t);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  filterTipe === t
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t === 'semua' ? 'Semua Pos' : t}
              </button>
            ))}
          </div>

          {/* Metode filter */}
          <select
            id="payment-method-filter-dropdown"
            aria-label="Filter Metode Pembayaran"
            value={filterMetode}
            onChange={(e) => {
              setFilterMetode(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="semua">Semua Metode</option>
            <option value="QRIS">QRIS</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Tunai">Tunai</option>
            <option value="Kartu Debit">Kartu Debit</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-100 dark:border-slate-800">
              <th className="py-3 px-4">Transaksi</th>
              <th className="py-3 px-3">Kategori</th>
              <th className="py-3 px-3">Metode</th>
              <th className="py-3 px-3 text-right">Nominal</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => {
                const isIncome = tx.tipe === 'pemasukan';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Title & Date */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[220px] sm:max-w-xs">
                            {tx.deskripsi}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {tx.id} • {tx.tanggal}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.kategori}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                        {getMethodIcon(tx.metodePembayaran)}
                        <span>{tx.metodePembayaran}</span>
                      </div>
                    </td>

                    {/* Nominal */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`font-bold text-xs sm:text-sm ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatRupiah(tx.nominal)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'sukses'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                            : tx.status === 'pending'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {tx.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Lihat Rincian Nota"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ReceiptText className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                      Tidak ada catatan transaksi pada filter ini.
                    </p>
                    {isMonthSelected && (
                      <p className="text-[11px] text-slate-400 max-w-sm">
                        Periode ini masih kosong atau telah diarsipkan. Anda dapat mulai mencatat transaksi baru dengan tombol "+ Catat".
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Menampilkan baris{' '}
          <strong className="text-slate-800 dark:text-slate-200">
            {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
          </strong>{' '}
          -{' '}
          <strong className="text-slate-800 dark:text-slate-200">
            {Math.min(currentPage * itemsPerPage, filtered.length)}
          </strong>{' '}
          dari{' '}
          <strong className="text-slate-800 dark:text-slate-200">
            {filtered.length}
          </strong>{' '}
          transaksi
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
