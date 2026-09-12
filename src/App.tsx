import React, { useState, useEffect } from 'react';
import { 
  initialSummary, 
  monthlyChartData, 
  weeklyChartData, 
  expenseCategoriesData, 
  topProductsData, 
  businessInsightsData, 
  initialTransactions 
} from './data/mockData';
import { 
  ActiveTab, 
  PeriodFilter, 
  Transaction, 
  FinancialSummary 
} from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { RevenueExpenseChart } from './components/RevenueExpenseChart';
import { ExpenseDonutChart } from './components/ExpenseDonutChart';
import { BusinessInsights } from './components/BusinessInsights';
import { RecentTransactionsTable } from './components/RecentTransactionsTable';
import { TopProducts } from './components/TopProducts';
import { FinancialReports } from './components/FinancialReports';
import { AddTransactionModal } from './components/AddTransactionModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { exportToExcel, exportToWord } from './utils/exportUtils';
import { Store, TrendingUp, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [period, setPeriod] = useState<PeriodFilter>('bulan_ini');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isCollapsedSidebar, setIsCollapsedSidebar] = useState(false);

  // State for dynamic live data
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [summary, setSummary] = useState<FinancialSummary>(initialSummary);
  const [products] = useState(topProductsData);
  const [insights] = useState(businessInsightsData);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finora-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finora-dark-mode', 'false');
    }
  }, [isDarkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add new transaction and update live summary metrics
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    setSummary((prev) => {
      const isIncome = newTx.tipe === 'pemasukan';
      const newTotalPendapatan = isIncome ? prev.totalPendapatan + newTx.nominal : prev.totalPendapatan;
      const newTotalPengeluaran = !isIncome ? prev.totalPengeluaran + newTx.nominal : prev.totalPengeluaran;
      const newLabaBersih = newTotalPendapatan - newTotalPengeluaran;
      const newMargin = (newLabaBersih / newTotalPendapatan) * 100;
      const newSaldoKas = isIncome ? prev.saldoKas + newTx.nominal : prev.saldoKas - newTx.nominal;

      return {
        ...prev,
        totalPendapatan: newTotalPendapatan,
        totalPengeluaran: newTotalPengeluaran,
        labaBersih: newLabaBersih,
        marginLaba: Number(newMargin.toFixed(2)),
        saldoKas: newSaldoKas,
        totalTransaksi: prev.totalTransaksi + 1,
        transaksiBerhasil: prev.transaksiBerhasil + 1,
      };
    });

    showToast(`Transaksi "${newTx.deskripsi}" berhasil dicatat!`);
  };

  // Delete transaction handler
  const handleDeleteTransaction = (id: string) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    setSummary((prev) => {
      const isIncome = txToDelete.tipe === 'pemasukan';
      const newTotalPendapatan = isIncome ? prev.totalPendapatan - txToDelete.nominal : prev.totalPendapatan;
      const newTotalPengeluaran = !isIncome ? prev.totalPengeluaran - txToDelete.nominal : prev.totalPengeluaran;
      const newLabaBersih = newTotalPendapatan - newTotalPengeluaran;
      const newMargin = newTotalPendapatan > 0 ? (newLabaBersih / newTotalPendapatan) * 100 : 0;
      const newSaldoKas = isIncome ? prev.saldoKas - txToDelete.nominal : prev.saldoKas + txToDelete.nominal;

      return {
        ...prev,
        totalPendapatan: newTotalPendapatan,
        totalPengeluaran: newTotalPengeluaran,
        labaBersih: newLabaBersih,
        marginLaba: Number(newMargin.toFixed(2)),
        saldoKas: newSaldoKas,
        totalTransaksi: Math.max(prev.totalTransaksi - 1, 0),
      };
    });

    showToast(`Transaksi ${id} telah dihapus.`);
  };

  // Export handlers
  const handleExportExcel = () => {
    exportToExcel(transactions, summary);
    showToast('Berkas Excel (.csv) berhasil diunduh!');
  };

  const handleExportWord = () => {
    exportToWord(transactions, summary, products);
    showToast('Laporan Dokumen Word (.doc) berhasil diunduh!');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-xl text-xs font-semibold animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigasi (Feature #1) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobileSidebar}
          setIsOpenMobile={setIsOpenMobileSidebar}
          isCollapsed={isCollapsedSidebar}
          setIsCollapsed={setIsCollapsedSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar (Feature #2, #10, #11, #12) */}
          <Navbar
            activeTab={activeTab}
            period={period}
            setPeriod={setPeriod}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
          />

          {/* Main Dashboard Views */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* Quick Hero Banner for UMKM owner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg sm:text-xl tracking-tight">
                      Finora Dashboard — Kopi & Eatery Nusantara
                    </h2>
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Periode Aktif: <strong>September 2026</strong> • Arus kas tercatat seimbang dan siap audit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  + Mutasi Baru
                </button>
                <button
                  onClick={handleExportWord}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white border border-white/20 text-xs font-semibold transition-colors"
                >
                  Cetak Laporan
                </button>
              </div>
            </div>

            {/* TAB: DASHBOARD (PRIMARY COMPREHENSIVE VIEW) */}
            {activeTab === 'dashboard' && (
              <>
                {/* 4 Kartu Statistik (Feature #3) */}
                <StatsCards summary={summary} />

                {/* Charts Grid: Pendapatan & Pengeluaran (Feature #4) and Komposisi Pengeluaran (Feature #5) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RevenueExpenseChart
                      monthlyData={monthlyChartData}
                      weeklyData={weeklyChartData}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <ExpenseDonutChart
                      categories={expenseCategoriesData}
                      totalPengeluaran={summary.totalPengeluaran}
                    />
                  </div>
                </div>

                {/* Insight Bisnis Otomatis (Feature #6) */}
                <BusinessInsights insights={insights} />

                {/* Grid: Tabel Transaksi Terbaru (Feature #7) & Produk Terlaris (Feature #8) */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <RecentTransactionsTable
                      transactions={transactions}
                      onOpenAddModal={() => setIsAddModalOpen(true)}
                      onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                      onDeleteTransaction={handleDeleteTransaction}
                      onExportExcel={handleExportExcel}
                      onExportWord={handleExportWord}
                      globalSearchTerm={searchTerm}
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <TopProducts products={products} />
                  </div>
                </div>

                {/* Bagian Laporan Keuangan (Feature #9, #10, #11) */}
                <FinancialReports
                  summary={summary}
                  transactions={transactions}
                  onExportExcel={handleExportExcel}
                  onExportWord={handleExportWord}
                />
              </>
            )}

            {/* TAB: TRANSAKSI */}
            {activeTab === 'transaksi' && (
              <div className="space-y-6">
                <RecentTransactionsTable
                  transactions={transactions}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                  onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  onDeleteTransaction={handleDeleteTransaction}
                  onExportExcel={handleExportExcel}
                  onExportWord={handleExportWord}
                  globalSearchTerm={searchTerm}
                />
              </div>
            )}

            {/* TAB: LAPORAN KEUANGAN */}
            {activeTab === 'laporan' && (
              <div className="space-y-6">
                <FinancialReports
                  summary={summary}
                  transactions={transactions}
                  onExportExcel={handleExportExcel}
                  onExportWord={handleExportWord}
                />
              </div>
            )}

            {/* TAB: PRODUK TERLARIS */}
            {activeTab === 'produk' && (
              <div className="space-y-6">
                <TopProducts products={products} />
              </div>
            )}

            {/* TAB: INSIGHT BISNIS */}
            {activeTab === 'insight' && (
              <div className="space-y-6">
                <BusinessInsights insights={insights} />
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-400">
            <p>
              Finora — Solusi Finansial & Pembukuan Kas UMKM Indonesia. Dilengkapi Ekspor Excel, Word, & Smart AI Analytics.
            </p>
          </footer>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Transaction Detail Receipt Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
