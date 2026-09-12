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
  ShieldCheck
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  isCollapsed,
  setIsCollapsed,
}) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Buku Transaksi', icon: ReceiptText },
    { id: 'laporan', label: 'Laporan Keuangan', icon: FileText },
    { id: 'produk', label: 'Produk Terlaris', icon: ShoppingBag },
    { id: 'insight', label: 'Insight Bisnis AI', icon: Sparkles, badge: 'Smart' },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    if (isOpenMobile) {
      setIsOpenMobile(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          {(!isCollapsed || isOpenMobile) && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Finora
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  UMKM
                </span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Sistem Keuangan Mandiri
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          id="close-sidebar-mobile-btn"
          onClick={() => setIsOpenMobile(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* UMKM Active Store Indicator */}
      {(!isCollapsed || isOpenMobile) && (
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              Finora Coffee & Eatery
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Kasir & Buku Aktif
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              } ${isCollapsed && !isOpenMobile ? 'justify-center' : ''}`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              {(!isCollapsed || isOpenMobile) && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {(!isCollapsed || isOpenMobile) && item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info & Collapse Toggle */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {(!isCollapsed || isOpenMobile) && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 dark:border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Status Pembukuan
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Semua mutasi telah seimbang (balanced). Siap unduh laporan pajak & bank.
            </p>
          </div>
        )}

        {/* Desktop collapse button */}
        <button
          id="collapse-sidebar-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-full py-2 px-3 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium gap-2"
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
