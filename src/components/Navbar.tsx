import React, { useState } from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Plus, 
  Bell, 
  Search, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { ActiveTab, PeriodFilter } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  period: PeriodFilter;
  setPeriod: (period: PeriodFilter) => void;
  searchTerm: string;
  setSearchTerm: (search: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenMobileSidebar: () => void;
  onOpenAddModal: () => void;
  onExportExcel: () => void;
  onExportWord: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  period,
  setPeriod,
  searchTerm,
  setSearchTerm,
  isDarkMode,
  setIsDarkMode,
  onOpenMobileSidebar,
  onOpenAddModal,
  onExportExcel,
  onExportWord,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Ringkasan Eksekutif';
      case 'transaksi':
        return 'Buku Catatan Transaksi';
      case 'laporan':
        return 'Laporan Keuangan & Rasio';
      case 'produk':
        return 'Produk & Penjualan Terlaris';
      case 'insight':
        return 'Smart Insights & Analisis AI';
      default:
        return 'Dashboard';
    }
  };

  const periodLabels: Record<PeriodFilter, string> = {
    hari_ini: 'Hari Ini',
    '7_hari': '7 Hari Terakhir',
    bulan_ini: 'Bulan Ini (Sep 2026)',
    tahun_ini: 'Tahun 2026',
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 transition-colors duration-200"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            id="open-sidebar-mobile-btn"
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Finora</span>
              <span>/</span>
              <span className="capitalize text-emerald-600 dark:text-emerald-400 font-medium">
                {activeTab}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {getTabTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Center / Search on medium+ screens */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Cari transaksi, produk, nota, vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Actions & Controls */}
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="relative hidden sm:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <select
                id="period-select-dropdown"
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                aria-label="Pilih Periode Laporan"
                className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
              >
                <option value="hari_ini" className="bg-white dark:bg-slate-800">
                  {periodLabels.hari_ini}
                </option>
                <option value="7_hari" className="bg-white dark:bg-slate-800">
                  {periodLabels['7_hari']}
                </option>
                <option value="bulan_ini" className="bg-white dark:bg-slate-800">
                  {periodLabels.bulan_ini}
                </option>
                <option value="tahun_ini" className="bg-white dark:bg-slate-800">
                  {periodLabels.tahun_ini}
                </option>
              </select>
            </div>
          </div>

          {/* Export Dropdown (Excel / Word) */}
          <div className="relative">
            <button
              id="export-menu-toggle-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Unduh Laporan Keuangan"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Unduh Laporan</span>
            </button>

            {showExportMenu && (
              <div
                id="export-dropdown-menu"
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs font-medium"
              >
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Format Berkas
                </div>
                <button
                  id="navbar-download-excel-btn"
                  onClick={() => {
                    onExportExcel();
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold">Unduh Excel (.csv)</p>
                    <p className="text-[10px] text-slate-400">Tabel & Buku Kas Lengkap</p>
                  </div>
                </button>
                <button
                  id="navbar-download-word-btn"
                  onClick={() => {
                    onExportWord();
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-400"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">Unduh Word (.doc)</p>
                    <p className="text-[10px] text-slate-400">Format Resmi & Tanda Tangan</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick Add Transaction Button */}
          <button
            id="quick-add-transaction-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Catat Transaksi</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Pemberitahuan"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 text-xs"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Pemberitahuan Usaha</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                    2 Baru
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Pencairan QRIS Berhasil
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Rp 2.150.000 telah masuk ke Rekening Operasional BCA.
                      </p>
                      <span className="text-[10px] text-slate-400">10 menit lalu</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200">
                        Pengingat Stok Matcha
                      </p>
                      <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                        Sisa 12 porsi, segera reorder ke supplier sebelum akhir pekan.
                      </p>
                      <span className="text-[10px] text-amber-600/70">1 jam lalu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle Mode Gelap/Terang"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* UMKM Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-inner">
              FN
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                Pak Rahman
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-1">Owner Finora</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
