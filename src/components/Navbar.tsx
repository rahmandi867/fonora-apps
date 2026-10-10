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
  FileText,
  Palette,
  Check,
  ChevronDown,
  Sparkles,
  LogOut, 
  Users,
  Sliders
} from 'lucide-react';
import { ActiveTab, PeriodFilter, StoreBranding } from '../types';
import { MontessoriTheme, MontessoriThemeId, MONTESSORI_THEMES } from '../themes/montessoriThemes';

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
  theme?: MontessoriTheme;
  activeThemeId: MontessoriThemeId;
  onSelectTheme: (id: MontessoriThemeId) => void;
  onOpenThemeModal: () => void;
  onLogout?: () => void;
  onOpenMonthlyClosingModal?: () => void;
  onOpenAdminResetModal?: () => void;
  onOpenUserManagementModal?: () => void;
  pendingRequestsCount?: number;
  currentUser?: { email?: string; role?: string; name?: string } | null;
  onSwitchUserRole?: (role: 'admin' | 'kasir') => void;
  branding?: StoreBranding;
  onOpenBrandingModal?: () => void;
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
  theme,
  activeThemeId,
  onSelectTheme,
  onOpenThemeModal,
  onLogout,
  onOpenMonthlyClosingModal,
  onOpenAdminResetModal,
  onOpenUserManagementModal,
  pendingRequestsCount = 0,
  currentUser,
  onSwitchUserRole,
  branding,
  onOpenBrandingModal,
}) => {
  const isCashier = currentUser?.role
    ? currentUser.role.toLowerCase().includes('kasir')
    : false;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showThemeQuickMenu, setShowThemeQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const primaryColor = theme?.colors.primary || '#059669';

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Ringkasan Eksekutif';
      case 'transaksi':
        return 'Buku Catatan Transaksi';
      case 'laporan':
        return 'Laporan Keuangan & Rasio';
      case 'rekap_tahunan':
        return 'Laporan & Rekapitulasi Tahunan (12 Bulan)';
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

  const themesList = Object.values(MONTESSORI_THEMES);

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 bg-[#FCFAF6]/90 dark:bg-[#141A21]/90 backdrop-blur-md border-b border-[#EAE4D8] dark:border-[#242D38] px-4 sm:px-6 py-3 transition-colors duration-200"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            id="open-sidebar-mobile-btn"
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#F2ECE2] dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>{branding?.brandName || 'Finora'}</span>
              <span>/</span>
              <span
                className="capitalize font-semibold"
                style={{ color: primaryColor }}
              >
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
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-[#F4EFE6] dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 rounded-xl border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
              style={{
                borderColor: searchTerm ? primaryColor : undefined,
              }}
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
          {/* Quick Montessori 3-Theme Selector Pill */}
          <div className="relative">
            <button
              id="theme-switcher-btn"
              onClick={() => setShowThemeQuickMenu(!showThemeQuickMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F2EDE4] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#EAE4D8] dark:hover:bg-slate-700 transition-all border border-[#E0D9CC] dark:border-slate-700/60 shadow-2xs"
              title="Pilih Tema Warna Modern Soft Montessori Eropa"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <div className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-inner ring-1 ring-black/10"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="hidden md:inline font-bold">
                  {theme ? theme.regionalTitle : 'Montessori'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Quick Theme Dropdown */}
            {showThemeQuickMenu && (
              <div
                id="theme-quick-dropdown"
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-2.5 z-50 text-xs animate-fadeIn"
              >
                <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-[#EAE4D8] dark:border-[#242D38]">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    Warna Montessori Eropa
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">3 Pilihan</span>
                </div>

                <div className="space-y-1.5 py-1">
                  {themesList.map((thm) => {
                    const isSelected = activeThemeId === thm.id;
                    return (
                      <button
                        key={thm.id}
                        onClick={() => {
                          onSelectTheme(thm.id);
                          setShowThemeQuickMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-[#F0EBE0] dark:bg-slate-800 ring-1 ring-[#D8D0C0] dark:ring-slate-700'
                            : 'hover:bg-[#F6F2E9] dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* 3 mini swatches */}
                          <div className="flex -space-x-1 shrink-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full ring-1 ring-white dark:ring-slate-900 shadow-2xs"
                              style={{ backgroundColor: thm.swatches.primary }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full ring-1 ring-white dark:ring-slate-900 shadow-2xs"
                              style={{ backgroundColor: thm.swatches.accent }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full ring-1 ring-white dark:ring-slate-900 shadow-2xs"
                              style={{ backgroundColor: thm.swatches.secondary }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                              {thm.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {thm.regionalTitle}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <Check
                            className="w-4 h-4 shrink-0 font-bold"
                            style={{ color: thm.colors.primary }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-1 border-t border-[#EAE4D8] dark:border-[#242D38]">
                  <button
                    onClick={() => {
                      setShowThemeQuickMenu(false);
                      onOpenThemeModal();
                    }}
                    className="w-full py-1.5 px-2 rounded-xl text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-[#F0EBE0] dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Buka Opsi Warna & Mode Lengkap
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Period selector */}
          <div className="relative hidden xl:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F2EDE4] dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#E0D9CC] dark:border-slate-700/60">
              <Calendar
                className="w-3.5 h-3.5"
                style={{ color: primaryColor }}
              />
              <select
                id="period-select-dropdown"
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                aria-label="Pilih Periode Laporan"
                className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer text-slate-800 dark:text-slate-200"
              >
                <option value="hari_ini" className="bg-[#FCFAF6] dark:bg-slate-800">
                  {periodLabels.hari_ini}
                </option>
                <option value="7_hari" className="bg-[#FCFAF6] dark:bg-slate-800">
                  {periodLabels['7_hari']}
                </option>
                <option value="bulan_ini" className="bg-[#FCFAF6] dark:bg-slate-800">
                  {periodLabels.bulan_ini}
                </option>
                <option value="tahun_ini" className="bg-[#FCFAF6] dark:bg-slate-800">
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F2EDE4] dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#EAE4D8] dark:hover:bg-slate-700 transition-colors border border-[#E0D9CC] dark:border-slate-700"
              title="Unduh Laporan Keuangan"
            >
              <FileText
                className="w-3.5 h-3.5"
                style={{ color: primaryColor }}
              />
              <span className="hidden lg:inline">Unduh</span>
            </button>

            {showExportMenu && (
              <div
                id="export-dropdown-menu"
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-xl py-1.5 z-50 text-xs font-medium animate-fadeIn"
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#F2ECE0] dark:hover:bg-slate-800"
                >
                  <FileSpreadsheet
                    className="w-4 h-4"
                    style={{ color: primaryColor }}
                  />
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-[#F2ECE0] dark:hover:bg-slate-800"
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
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 4px 12px ${primaryColor}40`,
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Catat Transaksi</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-[#F2ECE2] dark:hover:bg-slate-800 transition-colors"
              aria-label="Pemberitahuan"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"
                style={{ backgroundColor: primaryColor }}
              />
            </button>

            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-3 z-50 text-xs animate-fadeIn"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EAE4D8] dark:border-[#242D38]">
                  <span className="font-bold text-slate-900 dark:text-white">Pemberitahuan Usaha</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: theme?.colors.secondary,
                      color: primaryColor,
                    }}
                  >
                    2 Baru
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-[#EAE4D8] dark:border-transparent flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: primaryColor }}
                    />
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

          {/* DUA MODE TAMPILAN: LIGHT MODE (OFF-WHITE) & DARK MODE */}
          <div
            className="inline-flex p-0.5 rounded-xl bg-[#EFE8DD] dark:bg-[#1E252E] border border-[#DDD5C7] dark:border-[#2B3542] text-xs font-semibold shrink-0"
            title="Dua Mode Tampilan: Light Mode (Off-White) vs Dark Mode"
          >
            <button
              id="mode-offwhite-btn"
              onClick={() => setIsDarkMode(false)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                !isDarkMode
                  ? 'bg-[#FCFAF6] text-amber-900 shadow-2xs font-bold border border-[#E6DFD2]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
              title="Aktifkan Light Mode (Off-White Alabaster)"
              aria-label="Mode Terang Off-White"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline text-[11px]">Off-White</span>
            </button>
            <button
              id="mode-dark-btn"
              onClick={() => setIsDarkMode(true)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-[#12171E] text-amber-300 shadow-2xs font-bold border border-[#2B3644]'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
              title="Aktifkan Dark Mode (Deep Charcoal Night)"
              aria-label="Mode Gelap Dark Mode"
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Dark</span>
            </button>
          </div>

          {/* Kelola Pengguna & Persetujuan Akun Google (Hanya untuk Admin/Owner) */}
          {!isCashier && onOpenUserManagementModal && (
            <button
              id="navbar-manage-users-btn"
              onClick={onOpenUserManagementModal}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F2EDE4] dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#EAE4D8] dark:hover:bg-slate-700 transition-all border border-[#E0D9CC] dark:border-slate-700/60 shadow-2xs cursor-pointer"
              title="Kelola Pengguna, Persetujuan Akun Google & Ubah Password Admin"
            >
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline font-bold">Kelola Pengguna</span>
              {pendingRequestsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* User Profile Avatar & Role Info with Quick Role Switcher */}
          <div className="relative flex items-center gap-2 pl-1 border-l border-[#EAE4D8] dark:border-[#242D38]">
            <button
              type="button"
              id="user-profile-menu-toggle-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F2ECE2] dark:hover:bg-slate-800 transition-all cursor-pointer text-left"
              title={`Profil Pengguna: ${currentUser?.name || 'Pak Rahman'} (${currentUser?.role || 'Owner Finora'})`}
            >
              <div
                className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-inner transition-colors shrink-0"
                style={{ backgroundColor: isCashier ? '#f59e0b' : primaryColor }}
              >
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'PR'}
              </div>
              <div className="hidden xl:block text-left min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none truncate max-w-[110px]">
                  {currentUser?.name || 'Pak Rahman'}
                </p>
                <span
                  className="inline-block text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider mt-1"
                  style={{
                    backgroundColor: isCashier ? '#fef3c7' : `${primaryColor}20`,
                    color: isCashier ? '#b45309' : primaryColor,
                  }}
                >
                  {isCashier ? 'Kasir' : 'Admin'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:block" />
            </button>

            {/* User Dropdown Menu with Switch Role Option */}
            {showUserMenu && (
              <div
                id="user-profile-dropdown"
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-3 z-50 text-xs animate-fadeIn"
              >
                <div className="pb-2.5 mb-2 border-b border-[#EAE4D8] dark:border-[#242D38]">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Pengguna'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email || 'user@finora.id'}
                  </p>
                  <div className="mt-1.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block"
                      style={{
                        backgroundColor: isCashier ? '#fef3c7' : '#ecfdf5',
                        color: isCashier ? '#b45309' : '#059669',
                      }}
                    >
                      {currentUser?.role || (isCashier ? 'Kasir Utama' : 'Owner / Admin')}
                    </span>
                  </div>
                </div>

                {onSwitchUserRole && (
                  <div className="space-y-1 py-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                      Uji Peran Akun (Role Simulator)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUserRole('admin');
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        !isCashier
                          ? 'bg-[#F0EBE0] dark:bg-slate-800 font-bold text-emerald-800 dark:text-emerald-300'
                          : 'hover:bg-[#F6F2E9] dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">👑 Mode Admin / Owner</p>
                        <p className="text-[10px] text-slate-400">Akses penuh semua fitur & pengaturan</p>
                      </div>
                      {!isCashier && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchUserRole('kasir');
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isCashier
                          ? 'bg-[#F0EBE0] dark:bg-slate-800 font-bold text-amber-800 dark:text-amber-300'
                          : 'hover:bg-[#F6F2E9] dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">🏷️ Mode Kasir</p>
                        <p className="text-[10px] text-slate-400">Akses dibatasi: transaksi & produk saja</p>
                      </div>
                      {isCashier && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                  </div>
                )}

                {!isCashier && onOpenBrandingModal && (
                  <div className="pt-1 mt-1 border-t border-[#EAE4D8] dark:border-[#242D38]">
                    <button
                      type="button"
                      id="navbar-edit-branding-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenBrandingModal();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#F6F2E9] dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <Sliders className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          Atur Logo & Headline Toko
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Ganti nama brand, slogan, dan logo usaha
                        </p>
                      </div>
                    </button>
                  </div>
                )}

                <div className="pt-2 mt-1 border-t border-[#EAE4D8] dark:border-[#242D38]">
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar ke Welcome Screen</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {onLogout && (
              <button
                id="navbar-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#8E3B27] dark:text-[#ECA18D] bg-[#FBECE6] dark:bg-[#2C1914] hover:bg-[#F6DDD4] dark:hover:bg-[#3D221C] border border-[#ECC8B9] dark:border-[#4B281F] transition-colors ml-1"
                title="Keluar ke Welcome Screen"
                aria-label="Keluar / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
