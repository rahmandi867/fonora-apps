import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  FileText, 
  ShoppingBag, 
  Sparkles, 
  Store,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  ShieldCheck,
  Palette,
  LogOut,
  Calendar,
  ShieldAlert,
  Archive,
  Users,
  Coffee,
  Utensils,
  Landmark,
  Edit3,
  Sliders
} from 'lucide-react';
import { ActiveTab, StoreBranding, LogoIconType } from '../types';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme?: MontessoriTheme;
  onOpenThemeModal?: () => void;
  onLogout?: () => void;
  onOpenAdminResetModal?: () => void;
  onOpenMonthlyClosingModal?: () => void;
  onOpenUserManagementModal?: () => void;
  pendingRequestsCount?: number;
  currentUser?: { email?: string; role?: string; name?: string } | null;
  branding?: StoreBranding;
  onOpenBrandingModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  isCollapsed,
  setIsCollapsed,
  theme,
  onOpenThemeModal,
  onLogout,
  onOpenAdminResetModal,
  onOpenMonthlyClosingModal,
  onOpenUserManagementModal,
  pendingRequestsCount = 0,
  currentUser,
  branding,
  onOpenBrandingModal,
}) => {
  const isCashier = currentUser?.role
    ? currentUser.role.toLowerCase().includes('kasir')
    : false;

  const BrandIconComp = (() => {
    switch (branding?.logoIcon) {
      case 'Store': return Store;
      case 'Coffee': return Coffee;
      case 'Utensils': return Utensils;
      case 'ShoppingBag': return ShoppingBag;
      case 'Sparkles': return Sparkles;
      case 'Landmark': return Landmark;
      default: return CreditCard;
    }
  })();

  const menuItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Buku Transaksi', icon: ReceiptText },
    { id: 'laporan', label: 'Laporan Keuangan', icon: FileText },
    { id: 'rekap_tahunan', label: 'Rekap Tahunan', icon: Calendar, badge: '12 Bln' },
    { id: 'produk', label: 'Produk', icon: ShoppingBag, badge: 'Menu' },
    { id: 'insight', label: 'Insight Bisnis AI', icon: Sparkles, badge: 'Smart' },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (isOpenMobile) {
      setIsOpenMobile(false);
    }
  };

  const primaryColor = theme?.colors.primary || '#059669';
  const secondaryColor = theme?.colors.secondary || '#ecfdf5';
  const accentColor = theme?.colors.accent || '#10b981';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FCFAF6] dark:bg-[#141A21] border-r border-[#EAE4D8] dark:border-[#242D38] transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#EAE4D8] dark:border-[#242D38]">
        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-all duration-300 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              boxShadow: `0 8px 16px -4px ${primaryColor}40`,
            }}
          >
            {branding?.logoType === 'custom_url' && branding?.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.brandName || 'Logo'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <BrandIconComp className="w-5 h-5" />
            )}
          </div>
          {(!isCollapsed || isOpenMobile) && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                  {branding?.brandName || 'Finora'}
                  {branding?.badgeText && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: secondaryColor,
                        color: primaryColor,
                        border: `1px solid ${theme?.colors.borderSoft || '#d1fae5'}`,
                      }}
                    >
                      {branding.badgeText}
                    </span>
                  )}
                </span>

                {!isCashier && onOpenBrandingModal && (
                  <button
                    type="button"
                    id="sidebar-quick-edit-branding-btn"
                    onClick={onOpenBrandingModal}
                    className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Ubah Logo, Nama Merek & Headline (Khusus Owner)"
                    aria-label="Edit Identitas Merek"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {branding?.headline || 'Sistem Keuangan Mandiri'}
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          id="close-sidebar-mobile-btn"
          onClick={() => setIsOpenMobile(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-[#F2ECE2] dark:hover:bg-slate-800 lg:hidden shrink-0 ml-1"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* UMKM Active Store Indicator & User Role */}
      {(!isCollapsed || isOpenMobile) && (
        <div className="mx-3 mt-3 p-2.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {branding?.storeName || (currentUser?.name ? `${currentUser.name} Coffee` : 'Finora Coffee & Eatery')}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: isCashier ? '#f59e0b' : primaryColor }}
              ></span>
              <span className="truncate">
                {isCashier ? 'Kasir Operasional' : 'Admin / Owner Finora'}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1">
          {(!isCollapsed || isOpenMobile) && (
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigasi Utama
            </p>
          )}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-[#F2ECE2] dark:hover:bg-slate-800/70'
              } ${isCollapsed && !isOpenMobile ? 'justify-center' : ''}`}
              style={
                isActive
                  ? {
                      backgroundColor: primaryColor,
                      boxShadow: `0 4px 12px ${primaryColor}35`,
                    }
                  : undefined
              }
              title={item.label}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              />
              {(!isCollapsed || isOpenMobile) && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {(!isCollapsed || isOpenMobile) && item.badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={
                    isActive
                      ? { backgroundColor: 'rgba(255,255,255,0.22)', color: '#ffffff' }
                      : {
                          backgroundColor: secondaryColor,
                          color: primaryColor,
                        }
                  }
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Montessori Theme Quick Switcher in Sidebar */}
        {(!isCollapsed || isOpenMobile) && onOpenThemeModal && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenThemeModal}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#F2ECE2] dark:hover:bg-slate-800 border border-dashed border-[#DDD5C7] dark:border-slate-800 transition-colors"
            >
              <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <p className="truncate">Tema: {theme?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{theme?.regionalTitle}</p>
              </div>
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-2xs ring-1 ring-black/10"
                style={{ backgroundColor: primaryColor }}
              />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info & Collapse Toggle */}
      <div className="p-3 border-t border-[#EAE4D8] dark:border-[#242D38] space-y-2">
        {(!isCollapsed || isOpenMobile) && (
          <div
            className="p-3 rounded-2xl border transition-colors"
            style={{
              backgroundColor: theme ? `${theme.colors.secondary}70` : undefined,
              borderColor: theme ? `${theme.colors.borderSoft}` : undefined,
            }}
          >
            <div
              className="flex items-center gap-2 font-semibold text-xs mb-1"
              style={{ color: primaryColor }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Status Pembukuan
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Semua mutasi telah seimbang (balanced). Siap unduh laporan pajak & bank.
            </p>
          </div>
        )}

        {/* Kasir Restricted Mode Info Banner */}
        {isCashier && (!isCollapsed || isOpenMobile) && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Sesi Kasir Aktif
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              Manajemen pengguna & fitur Admin disembunyikan otomatis.
            </p>
          </div>
        )}

        {/* Atur Logo & Headline Toko (Khusus Owner/Admin) */}
        {!isCashier && onOpenBrandingModal && (
          <button
            id="sidebar-branding-btn"
            onClick={onOpenBrandingModal}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-900/60 transition-colors ${
              isCollapsed && !isOpenMobile ? 'justify-center' : ''
            }`}
            title="Ubah Logo, Nama Merek & Headline (Khusus Owner)"
          >
            <Sliders className="w-4 h-4 shrink-0 text-emerald-600" />
            {(!isCollapsed || isOpenMobile) && <span>Atur Logo & Headline</span>}
          </button>
        )}

        {/* Manajemen Pengguna Button (Disembunyikan otomatis jika currentUser adalah Kasir) */}
        {!isCashier && onOpenUserManagementModal && (
          <button
            id="sidebar-user-management-btn"
            onClick={onOpenUserManagementModal}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-900/60 transition-colors ${
              isCollapsed && !isOpenMobile ? 'justify-center' : ''
            }`}
            title="Manajemen Pengguna & Persetujuan Akun Google"
          >
            <div className="relative">
              <Users className="w-4 h-4 shrink-0 text-indigo-600" />
              {pendingRequestsCount && pendingRequestsCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              ) : null}
            </div>
            {(!isCollapsed || isOpenMobile) && (
              <div className="flex items-center justify-between w-full">
                <span>Manajemen Pengguna</span>
                {pendingRequestsCount && pendingRequestsCount > 0 ? (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {pendingRequestsCount}
                  </span>
                ) : null}
              </div>
            )}
          </button>
        )}

        {/* Admin Reset Button (Disembunyikan otomatis jika currentUser adalah Kasir) */}
        {!isCashier && onOpenAdminResetModal && (
          <button
            id="sidebar-admin-reset-btn"
            onClick={onOpenAdminResetModal}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/60 transition-colors ${
              isCollapsed && !isOpenMobile ? 'justify-center' : ''
            }`}
            title="Reset Transaksi dengan Persetujuan Admin"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            {(!isCollapsed || isOpenMobile) && <span>Reset Transaksi</span>}
          </button>
        )}

        {/* Logout button */}
        {onLogout && (
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#8E3B27] dark:text-[#ECA18D] bg-[#FBECE6] dark:bg-[#2C1914] hover:bg-[#F6DDD4] dark:hover:bg-[#3D221C] border border-[#ECC8B9] dark:border-[#4B281F] transition-colors ${
              isCollapsed && !isOpenMobile ? 'justify-center' : ''
            }`}
            title="Keluar ke Welcome Screen"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isOpenMobile) && <span>Keluar Sistem</span>}
          </button>
        )}

        {/* Desktop collapse button */}
        <button
          id="collapse-sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-full py-2 px-3 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-[#F2ECE2] dark:hover:bg-slate-800 transition-colors text-xs font-medium gap-2"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Kecilkan Panel</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        id="sidebar-mobile"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        id="sidebar-desktop"
        className={`hidden lg:block shrink-0 transition-all duration-300 h-screen sticky top-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
