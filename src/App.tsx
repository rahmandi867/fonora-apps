import React, { useState, useEffect } from 'react';
import { 
  initialSummary, 
  monthlyChartData, 
  weeklyChartData, 
  expenseCategoriesData, 
  topProductsData, 
  businessInsightsData, 
  initialTransactions,
  initialClosedBooks,
  initialAnnualSummary,
  initialResetLogs,
  initialUsers,
  initialRegistrationRequests
} from './data/mockData';
import { 
  ActiveTab, 
  PeriodFilter, 
  Transaction, 
  FinancialSummary,
  MonthlyClosingRecord,
  AnnualReportSummary,
  ResetAuditLog,
  ProductSales,
  AppUser,
  UserRole,
  UserRegistrationRequest
} from './types';
import { MontessoriThemeId, MONTESSORI_THEMES } from './themes/montessoriThemes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { RevenueExpenseChart } from './components/RevenueExpenseChart';
import { ExpenseDonutChart } from './components/ExpenseDonutChart';
import { BusinessInsights } from './components/BusinessInsights';
import { RecentTransactionsTable } from './components/RecentTransactionsTable';
import { TopProducts } from './components/TopProducts';
import { FinancialReports } from './components/FinancialReports';
import { AnnualReconciliationView } from './components/AnnualReconciliationView';
import { MonthlyClosingModal } from './components/MonthlyClosingModal';
import { AnnualClosingModal } from './components/AnnualClosingModal';
import { AdminResetModal } from './components/AdminResetModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddProductModal } from './components/AddProductModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { UserManagementModal } from './components/UserManagementModal';
import { 
  exportToExcel, 
  exportToWord, 
  exportAnnualToExcel, 
  exportAnnualToWord 
} from './utils/exportUtils';
import { formatRupiah } from './utils/formatters';
import { CheckCircle } from 'lucide-react';

export default function App() {
  // Authentication & Welcome Screen State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finora-auth') === 'true';
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; name: string }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return { email: 'rahman@finora.id', role: 'Owner UMKM', name: 'Pak Rahman' };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [period, setPeriod] = useState<PeriodFilter>('bulan_ini');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Theme State: 3 Modern Soft Montessori European Color Palettes
  const [themeId, setThemeId] = useState<MontessoriThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-montessori-theme') as MontessoriThemeId;
      if (saved && MONTESSORI_THEMES[saved]) return saved;
    }
    return 'sage'; // Default to Nordic Sage & Oat
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Two Display Modes: Light Mode (Off-White Alabaster) vs Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-dark-mode');
      if (saved !== null) return saved === 'true';
      return false; // Default to Light Mode (Off-White)
    }
    return false;
  });

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isCollapsedSidebar, setIsCollapsedSidebar] = useState(false);

  // State for dynamic live data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-transactions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialTransactions;
  });

  const [summary, setSummary] = useState<FinancialSummary>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-summary');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialSummary;
  });

  const [products, setProducts] = useState<ProductSales[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return topProductsData;
  });

  const [insights] = useState(businessInsightsData);

  // Month and Year Management State
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('semua');
  
  const [closedBooks, setClosedBooks] = useState<MonthlyClosingRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-closed-books');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialClosedBooks;
  });

  const [annualSummary, setAnnualSummary] = useState<AnnualReportSummary>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-annual-summary');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialAnnualSummary;
  });

  const [resetAuditLogs, setResetAuditLogs] = useState<ResetAuditLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-reset-logs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialResetLogs;
  });

  // User Management, Registration Requests & Admin Password State
  const [users, setUsers] = useState<AppUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-users');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialUsers;
  });

  const [registrationRequests, setRegistrationRequests] = useState<UserRegistrationRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-registration-requests');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return initialRegistrationRequests;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finora-admin-password');
      if (saved) return saved;
    }
    return 'finora2026';
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMonthlyClosingModalOpen, setIsMonthlyClosingModalOpen] = useState(false);
  const [isAdminResetModalOpen, setIsAdminResetModalOpen] = useState(false);
  const [isAnnualClosingModalOpen, setIsAnnualClosingModalOpen] = useState(false);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTheme = MONTESSORI_THEMES[themeId] || MONTESSORI_THEMES.sage;

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('finora-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('finora-registration-requests', JSON.stringify(registrationRequests));
  }, [registrationRequests]);

  useEffect(() => {
    localStorage.setItem('finora-admin-password', adminPassword);
  }, [adminPassword]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('finora-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finora-summary', JSON.stringify(summary));
  }, [summary]);

  useEffect(() => {
    localStorage.setItem('finora-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('finora-closed-books', JSON.stringify(closedBooks));
  }, [closedBooks]);

  useEffect(() => {
    localStorage.setItem('finora-annual-summary', JSON.stringify(annualSummary));
  }, [annualSummary]);

  useEffect(() => {
    localStorage.setItem('finora-reset-logs', JSON.stringify(resetAuditLogs));
  }, [resetAuditLogs]);

  // Sync dark mode class & data-theme to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finora-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finora-dark-mode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('finora-montessori-theme', themeId);
  }, [themeId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (userData: { email: string; role: string; name: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    localStorage.setItem('finora-auth', 'true');
    localStorage.setItem('finora-user', JSON.stringify(userData));
    showToast(`Selamat datang di Finora, ${userData.name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('finora-auth');
    showToast('Anda telah keluar ke Halaman Pembuka.');
  };

  const handleSelectTheme = (newThemeId: MontessoriThemeId) => {
    setThemeId(newThemeId);
    showToast(`Tema diterapkan: ${MONTESSORI_THEMES[newThemeId].name}`);
  };

  const handleToggleMode = (dark: boolean) => {
    setIsDarkMode(dark);
    showToast(dark ? 'Mode Gelap (Dark Mode) aktif' : 'Mode Terang (Off-White) aktif');
  };

  // Add new transaction and update live summary metrics
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    setSummary((prev) => {
      const isIncome = newTx.tipe === 'pemasukan';
      const newTotalPendapatan = isIncome ? prev.totalPendapatan + newTx.nominal : prev.totalPendapatan;
      const newTotalPengeluaran = !isIncome ? prev.totalPengeluaran + newTx.nominal : prev.totalPengeluaran;
      const newLabaBersih = newTotalPendapatan - newTotalPengeluaran;
      const newMargin = newTotalPendapatan > 0 ? (newLabaBersih / newTotalPendapatan) * 100 : 0;
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

  // Monthly Closing execution handler (Menutup buku & mengosongkan/membuka catatan bulan berikutnya)
  const handleExecuteMonthlyClosing = (record: MonthlyClosingRecord, startFreshNextMonth: boolean) => {
    setClosedBooks((prev) => [record, ...prev.filter((b) => b.bulanKey !== record.bulanKey)]);

    // Update annual summary record status for this month
    setAnnualSummary((prev) => ({
      ...prev,
      rekapBulanan: prev.rekapBulanan.map((m) =>
        m.bulanKey === record.bulanKey
          ? {
              ...m,
              status: 'ditutup',
              pendapatan: record.totalPendapatan,
              pengeluaran: record.totalPengeluaran,
              laba: record.labaBersih,
              margin: record.totalPendapatan > 0 ? Number(((record.labaBersih / record.totalPendapatan) * 100).toFixed(1)) : 0,
              totalMutasi: record.totalTransaksi,
            }
          : m
      ),
    }));

    if (startFreshNextMonth) {
      // Determine next month key
      const [yearStr, monthStr] = record.bulanKey.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      const nextMonthNum = month === 12 ? 1 : month + 1;
      const nextYearNum = month === 12 ? year + 1 : year;
      const nextMonthKey = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}`;

      // Create opening rollover transaction for the new month
      const rolloverTx: Transaction = {
        id: `TRX-${nextMonthKey.replace('-', '')}01-OPEN`,
        tanggal: `${nextMonthKey}-01 08:00`,
        deskripsi: `Saldo Kas Awal Bulan Baru (Rollover ${record.namaBulan})`,
        kategori: 'Lain-lain & Perawatan',
        tipe: 'pemasukan',
        nominal: record.saldoKasAkhir,
        metodePembayaran: 'Transfer Bank',
        status: 'sukses',
        pelangganAtauVendor: 'Manajemen Finora (Rollover Kas)',
        catatan: `Saldo kas bergulir dari penutupan buku ${record.namaBulan}.`,
      };

      // Set new transactions containing the opening transaction
      setTransactions((prev) => [rolloverTx, ...prev]);

      // Reset monthly totals for new period while carrying forward cash
      setSummary((prev) => ({
        ...prev,
        totalPendapatan: 0,
        totalPengeluaran: 0,
        labaBersih: 0,
        marginLaba: 0,
        saldoKas: record.saldoKasAkhir,
        totalTransaksi: 1,
        transaksiBerhasil: 1,
      }));

      setSelectedMonthFilter(nextMonthKey);
      showToast(`Buku ${record.namaBulan} berhasil ditutup! Buku baru dibuka dengan Saldo Kas Awal ${formatRupiah(record.saldoKasAkhir)}.`);
    } else {
      showToast(`Buku ${record.namaBulan} berhasil diarsipkan secara resmi.`);
    }
  };

  // Admin Reset execution handler (Reset dengan persetujuan admin)
  const handleExecuteAdminReset = (options: {
    type: 'bersihkan_transaksi' | 'reset_pabrik';
    newStartingBalance: number;
    adminName: string;
    keterangan: string;
  }) => {
    const newLog: ResetAuditLog = {
      id: `RST-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      adminName: options.adminName,
      adminEmail: currentUser.email,
      actionType: options.type,
      saldoKasAwalBaru: options.newStartingBalance,
      transaksiDihapusCount: transactions.length,
      keterangan: options.keterangan,
    };

    setResetAuditLogs((prev) => [newLog, ...prev]);

    if (options.type === 'bersihkan_transaksi') {
      let freshTransactions: Transaction[] = [];

      if (options.newStartingBalance > 0) {
        const todayStr = new Date().toISOString().slice(0, 10);
        freshTransactions = [
          {
            id: `TRX-${Date.now()}-INIT`,
            tanggal: `${todayStr} 08:00`,
            deskripsi: 'Setoran Modal Kas Awal Pembukuan Baru',
            kategori: 'Lain-lain & Perawatan',
            tipe: 'pemasukan',
            nominal: options.newStartingBalance,
            metodePembayaran: 'Transfer Bank',
            status: 'sukses',
            pelangganAtauVendor: options.adminName,
            catatan: 'Modal kerja awal pembukuan setelah reset admin.',
          },
        ];
      }

      setTransactions(freshTransactions);
      setSummary({
        totalPendapatan: 0,
        pertumbuhanPendapatan: 0,
        totalPengeluaran: 0,
        penurunanPengeluaran: 0,
        labaBersih: 0,
        marginLaba: 0,
        pertumbuhanLaba: 0,
        saldoKas: options.newStartingBalance,
        totalTransaksi: freshTransactions.length,
        transaksiBerhasil: freshTransactions.length,
      });

      setSelectedMonthFilter('semua');
      showToast(`Buku transaksi telah dibersihkan oleh ${options.adminName} dengan Saldo Awal ${formatRupiah(options.newStartingBalance)}.`);
    } else {
      // Factory reset
      setTransactions(initialTransactions);
      setSummary(initialSummary);
      setClosedBooks(initialClosedBooks);
      setAnnualSummary(initialAnnualSummary);
      setSelectedMonthFilter('semua');
      showToast('Sistem Finora berhasil direset ke data awal demo percontohan.');
    }
  };

  // Annual Closing execution handler (Tutup buku tahunan & mulai tahun baru)
  const handleExecuteAnnualClosing = (nextYear: number, newStartingCapital: number, notes: string) => {
    // Lock current year in annual summary
    setAnnualSummary({
      tahun: nextYear,
      status: 'aktif',
      totalPendapatan: 0,
      totalPengeluaran: 0,
      labaBersih: 0,
      marginRataRata: 0,
      saldoKasAkhir: newStartingCapital,
      catatanTahunan: notes,
      rekapBulanan: [
        { bulan: 'Januari', bulanKey: `${nextYear}-01`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'berjalan', totalMutasi: 0 },
        { bulan: 'Februari', bulanKey: `${nextYear}-02`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Maret', bulanKey: `${nextYear}-03`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'April', bulanKey: `${nextYear}-04`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Mei', bulanKey: `${nextYear}-05`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Juni', bulanKey: `${nextYear}-06`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Juli', bulanKey: `${nextYear}-07`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Agustus', bulanKey: `${nextYear}-08`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'September', bulanKey: `${nextYear}-09`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Oktober', bulanKey: `${nextYear}-10`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'November', bulanKey: `${nextYear}-11`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
        { bulan: 'Desember', bulanKey: `${nextYear}-12`, pendapatan: 0, pengeluaran: 0, laba: 0, margin: 0, status: 'belum_mulai', totalMutasi: 0 },
      ],
    });

    // Create opening balance transaction for the new year
    const openingYearTx: Transaction = {
      id: `TRX-${nextYear}0101-INIT`,
      tanggal: `${nextYear}-01-01 08:00`,
      deskripsi: `Modal Kas Awal Pembukuan Tahun Fiskal ${nextYear}`,
      kategori: 'Lain-lain & Perawatan',
      tipe: 'pemasukan',
      nominal: newStartingCapital,
      metodePembayaran: 'Transfer Bank',
      status: 'sukses',
      pelangganAtauVendor: 'Owner Finora (Ekuitas Awal)',
      catatan: `Modal awal digulirkan dari penutupan tahun buku ${nextYear - 1}.`,
    };

    setTransactions([openingYearTx]);
    setSummary({
      totalPendapatan: 0,
      pertumbuhanPendapatan: 0,
      totalPengeluaran: 0,
      penurunanPengeluaran: 0,
      labaBersih: 0,
      marginLaba: 0,
      pertumbuhanLaba: 0,
      saldoKas: newStartingCapital,
      totalTransaksi: 1,
      transaksiBerhasil: 1,
    });

    setSelectedMonthFilter(`${nextYear}-01`);
    showToast(`Tahun buku ${nextYear - 1} resmi ditutup! Pembukuan Tahun ${nextYear} dimulai dengan Modal Awal ${formatRupiah(newStartingCapital)}.`);
  };

  // Inspect specific month
  const handleSelectMonthForInspection = (monthKey: string) => {
    setSelectedMonthFilter(monthKey);
    setActiveTab('transaksi');
    showToast(`Menampilkan transaksi periode ${monthKey}`);
  };

  // Product management handlers
  const handleAddProduct = (newProduct: ProductSales) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produk "${newProduct.nama}" berhasil ditambahkan!`);
  };

  const handleResetProducts = () => {
    setProducts(topProductsData);
    localStorage.setItem('finora-products', JSON.stringify(topProductsData));
    showToast('Daftar produk telah direset ke data percontohan awal.');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produk berhasil dihapus dari katalog.');
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

  const handleExportAnnualExcel = () => {
    exportAnnualToExcel(annualSummary);
    showToast(`Rekap Tahunan Excel (.csv) Tahun ${annualSummary.tahun} berhasil diunduh!`);
  };

  const handleExportAnnualWord = () => {
    exportAnnualToWord(annualSummary);
    showToast(`Laporan Tahunan Word (.doc) Tahun ${annualSummary.tahun} berhasil diunduh!`);
  };

  // User Management & Security Handlers
  const handleAddUser = (newUser: AppUser) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`Pengguna "${newUser.name}" (@${newUser.username}) berhasil ditambahkan!`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Pengguna telah dihapus dari sistem.');
  };

  const handleUpdateUserPassword = (userId: string, newPass: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: newPass } : u)));
    showToast('Password pengguna berhasil diubah.');
  };

  const handleApproveRegistrationRequest = (requestId: string, role: UserRole) => {
    const targetReq = registrationRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    setRegistrationRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'disetujui',
              approvedRole: role,
              approvedBy: currentUser.name,
              approvedDate: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );

    const usernameClean = targetReq.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const roleTitleMap: Record<UserRole, string> = {
      admin: 'Owner / Admin Keuangan',
      kasir: 'Kasir Utama',
      staf: 'Staf Operasional / Barista',
    };

    const newAppUser: AppUser = {
      id: `USR-${Date.now()}`,
      name: targetReq.name,
      username: usernameClean,
      email: targetReq.email,
      password: role === 'admin' ? adminPassword : 'kasir123',
      role,
      roleTitle: roleTitleMap[role],
      createdAt: new Date().toISOString().slice(0, 10),
      authProvider: 'google',
      isActive: true,
    };

    setUsers((prev) => [newAppUser, ...prev.filter((u) => u.email !== targetReq.email)]);
    showToast(`Akun Google ${targetReq.email} berhasil disetujui sebagai ${newAppUser.roleTitle}!`);
  };

  const handleRejectRegistrationRequest = (requestId: string) => {
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'ditolak' } : r))
    );
    showToast('Pengajuan akun Google telah ditolak.');
  };

  const handleChangeAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('finora-admin-password', newPass);
    setUsers((prev) =>
      prev.map((u) => (u.role === 'admin' ? { ...u, password: newPass } : u))
    );
    showToast('Kata sandi khusus Admin berhasil diperbarui!');
  };

  const handleRequestAccess = (newReq: UserRegistrationRequest) => {
    setRegistrationRequests((prev) => [newReq, ...prev]);
    showToast(`Pengajuan akun ${newReq.email} berhasil dikirim! Menunggu persetujuan Developer/Admin.`);
  };

  // If not authenticated, render Welcome Screen with Beige & Terracotta theme
  if (!isAuthenticated) {
    return (
      <WelcomeScreen 
        onLogin={handleLogin}
        users={users}
        registrationRequests={registrationRequests}
        onRequestAccess={handleRequestAccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1318] text-slate-900 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl text-white shadow-xl text-xs font-semibold animate-bounce"
          style={{ backgroundColor: currentTheme.colors.primary }}
        >
          <CheckCircle className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigasi */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobileSidebar}
          setIsOpenMobile={setIsOpenMobileSidebar}
          isCollapsed={isCollapsedSidebar}
          setIsCollapsed={setIsCollapsedSidebar}
          theme={currentTheme}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onLogout={handleLogout}
          onOpenAdminResetModal={() => setIsAdminResetModalOpen(true)}
          onOpenMonthlyClosingModal={() => setIsMonthlyClosingModalOpen(true)}
          onOpenUserManagementModal={() => setIsUserManagementModalOpen(true)}
          pendingRequestsCount={registrationRequests.filter((r) => r.status === 'pending').length}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <Navbar
            activeTab={activeTab}
            period={period}
            setPeriod={setPeriod}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDarkMode={isDarkMode}
            setIsDarkMode={handleToggleMode}
            onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
            theme={currentTheme}
            activeThemeId={themeId}
            onSelectTheme={handleSelectTheme}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
            onLogout={handleLogout}
            onOpenMonthlyClosingModal={() => setIsMonthlyClosingModalOpen(true)}
            onOpenAdminResetModal={() => setIsAdminResetModalOpen(true)}
            onOpenUserManagementModal={() => setIsUserManagementModalOpen(true)}
            pendingRequestsCount={registrationRequests.filter((r) => r.status === 'pending').length}
          />

          {/* Main Dashboard Views */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {/* TAB: DASHBOARD (PRIMARY COMPREHENSIVE VIEW) */}
            {activeTab === 'dashboard' && (
              <>
                {/* 4 Kartu Statistik */}
                <StatsCards summary={summary} theme={currentTheme} />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RevenueExpenseChart
                      monthlyData={monthlyChartData}
                      weeklyData={weeklyChartData}
                      theme={currentTheme}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <ExpenseDonutChart
                      categories={expenseCategoriesData}
                      totalPengeluaran={summary.totalPengeluaran}
                      theme={currentTheme}
                    />
                  </div>
                </div>

                {/* Insight Bisnis Otomatis */}
                <BusinessInsights insights={insights} onShowToast={showToast} />

                {/* Grid: Tabel Transaksi Terbaru & Produk Terlaris */}
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
                      selectedMonthFilter={selectedMonthFilter}
                      onSelectMonthFilter={setSelectedMonthFilter}
                      onOpenMonthlyClosingModal={() => setIsMonthlyClosingModalOpen(true)}
                      onOpenAdminResetModal={() => setIsAdminResetModalOpen(true)}
                      closedBooks={closedBooks}
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <TopProducts 
                      products={products}
                      onOpenAddProduct={() => setIsAddProductModalOpen(true)}
                      onResetProducts={handleResetProducts}
                      onDeleteProduct={handleDeleteProduct}
                      theme={currentTheme}
                    />
                  </div>
                </div>

                {/* Bagian Laporan Keuangan */}
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
                  selectedMonthFilter={selectedMonthFilter}
                  onSelectMonthFilter={setSelectedMonthFilter}
                  onOpenMonthlyClosingModal={() => setIsMonthlyClosingModalOpen(true)}
                  onOpenAdminResetModal={() => setIsAdminResetModalOpen(true)}
                  closedBooks={closedBooks}
                />
              </div>
            )}

            {/* TAB: REKAP TAHUNAN & TUTUP TAHUN BUKU */}
            {activeTab === 'rekap_tahunan' && (
              <AnnualReconciliationView
                annualSummary={annualSummary}
                closedBooks={closedBooks}
                onSelectMonthForInspection={handleSelectMonthForInspection}
                onOpenAnnualClosingModal={() => setIsAnnualClosingModalOpen(true)}
                onExportExcel={handleExportAnnualExcel}
                onExportWord={handleExportAnnualWord}
                theme={currentTheme}
              />
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

            {/* TAB: PRODUK */}
            {activeTab === 'produk' && (
              <div className="space-y-6">
                <TopProducts 
                  products={products}
                  onOpenAddProduct={() => setIsAddProductModalOpen(true)}
                  onResetProducts={handleResetProducts}
                  onDeleteProduct={handleDeleteProduct}
                  theme={currentTheme}
                  isFullView={true}
                />
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
          <footer className="mt-auto border-t border-[#EAE4D8] dark:border-[#242D38] py-4 px-6 text-center text-xs text-slate-400">
            <p>
              Finora — Solusi Finansial & Pembukuan Kas UMKM Indonesia. Dilengkapi Rekap Bulanan, Tutup Buku Tahunan, dan Reset Transaksi Terotorisasi Admin.
            </p>
          </footer>
        </div>
      </div>

      {/* Theme Selector Modal (Comprehensive Details, Swatches & Philosophy) */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeThemeId={themeId}
        onSelectTheme={handleSelectTheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleMode}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Add Product Modal with Confirmation Pop-up */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        theme={currentTheme}
      />

      {/* Transaction Detail Receipt Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* Monthly Closing Modal */}
      <MonthlyClosingModal
        isOpen={isMonthlyClosingModalOpen}
        onClose={() => setIsMonthlyClosingModalOpen(false)}
        activeMonthKey={selectedMonthFilter === 'semua' ? '2026-09' : selectedMonthFilter}
        activeMonthName={selectedMonthFilter === '2026-01' ? 'Januari 2026' : 'September 2026'}
        nextMonthName={selectedMonthFilter === '2026-01' ? 'Februari 2026' : 'Oktober 2026'}
        transactions={transactions}
        currentSummary={summary}
        theme={currentTheme}
        onExecuteMonthlyClosing={handleExecuteMonthlyClosing}
        onExportExcel={handleExportExcel}
      />

      {/* Admin Reset Modal */}
      <AdminResetModal
        isOpen={isAdminResetModalOpen}
        onClose={() => setIsAdminResetModalOpen(false)}
        onExecuteReset={handleExecuteAdminReset}
        onExportBackup={handleExportExcel}
        recentAuditLogs={resetAuditLogs}
        theme={currentTheme}
      />

      {/* Annual Closing Modal */}
      <AnnualClosingModal
        isOpen={isAnnualClosingModalOpen}
        onClose={() => setIsAnnualClosingModalOpen(false)}
        annualSummary={annualSummary}
        onExecuteAnnualClosing={handleExecuteAnnualClosing}
        onExportAnnualBackup={handleExportAnnualExcel}
        theme={currentTheme}
      />

      {/* User Management, Google Registration Approvals & Admin Password Modal */}
      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        onUpdateUserPassword={handleUpdateUserPassword}
        registrationRequests={registrationRequests}
        onApproveRequest={handleApproveRegistrationRequest}
        onRejectRequest={handleRejectRegistrationRequest}
        onChangeAdminPassword={handleChangeAdminPassword}
        adminCurrentPassword={adminPassword}
      />
    </div>
  );
}
