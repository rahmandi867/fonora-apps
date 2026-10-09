export type TransactionType = 'pemasukan' | 'pengeluaran';

export type PaymentMethod = 'QRIS' | 'Transfer Bank' | 'Tunai' | 'Kartu Debit';

export type TransactionStatus = 'sukses' | 'pending' | 'dibatalkan';

export interface Transaction {
  id: string;
  tanggal: string;
  deskripsi: string;
  kategori: string;
  tipe: TransactionType;
  nominal: number;
  metodePembayaran: PaymentMethod;
  status: TransactionStatus;
  catatan?: string;
  pelangganAtauVendor?: string;
}

export interface ProductSales {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  terjual: number;
  pendapatan: number;
  stok: number;
  statusStok: 'aman' | 'menipis' | 'habis';
  pertumbuhan: number;
}

export interface MonthlyData {
  bulan: string;
  pendapatan: number;
  pengeluaran: number;
  laba: number;
}

export interface WeeklyData {
  hari: string;
  pendapatan: number;
  pengeluaran: number;
  laba: number;
}

export interface ExpenseCategoryItem {
  kategori: string;
  nominal: number;
  persentase: number;
  color: string;
}

export interface BusinessInsight {
  id: string;
  tipe: 'positif' | 'peringatan' | 'rekomendasi' | 'netral';
  judul: string;
  deskripsi: string;
  dampak: string;
  rekomendasiAksi: string;
  tanggal: string;
  kategori: 'Arus Kas' | 'Efisiensi Biaya' | 'Penjualan' | 'Inventaris';
}

export interface FinancialSummary {
  totalPendapatan: number;
  pertumbuhanPendapatan: number;
  totalPengeluaran: number;
  penurunanPengeluaran: number;
  labaBersih: number;
  marginLaba: number;
  pertumbuhanLaba: number;
  saldoKas: number;
  totalTransaksi: number;
  transaksiBerhasil: number;
}

export type ActiveTab = 'dashboard' | 'transaksi' | 'laporan' | 'rekap_tahunan' | 'produk' | 'insight';

export type PeriodFilter = 'hari_ini' | '7_hari' | 'bulan_ini' | 'tahun_ini';

export interface MonthlyClosingRecord {
  id: string;
  bulanKey: string; // e.g. "2026-01"
  namaBulan: string; // e.g. "Januari 2026"
  tanggalTutup: string;
  totalPendapatan: number;
  totalPengeluaran: number;
  labaBersih: number;
  saldoKasAwal: number;
  saldoKasAkhir: number;
  totalTransaksi: number;
  status: 'ditutup' | 'aktif';
  closedBy: string;
  catatan?: string;
  transaksiTersimpan: Transaction[];
}

export interface AnnualReportSummary {
  tahun: number;
  status: 'aktif' | 'ditutup';
  totalPendapatan: number;
  totalPengeluaran: number;
  labaBersih: number;
  marginRataRata: number;
  saldoKasAkhir: number;
  rekapBulanan: {
    bulan: string;
    bulanKey: string;
    pendapatan: number;
    pengeluaran: number;
    laba: number;
    margin: number;
    status: 'ditutup' | 'berjalan' | 'belum_mulai';
    totalMutasi: number;
  }[];
  catatanTahunan?: string;
  closedBy?: string;
  tanggalTutup?: string;
}

export type UserRole = 'admin' | 'kasir' | 'staf';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  roleTitle: string;
  createdAt: string;
  authProvider?: 'local' | 'google';
  isActive: boolean;
}

export interface UserRegistrationRequest {
  id: string;
  name: string;
  email: string;
  googleId?: string;
  alasanPengajuan?: string;
  noHp?: string;
  requestDate: string;
  status: 'pending' | 'disetujui' | 'ditolak';
  approvedRole?: UserRole;
  approvedBy?: string;
  approvedDate?: string;
}

export interface ResetAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  actionType: 'bersihkan_transaksi' | 'reset_pabrik' | 'tutup_buku_tahunan';
  saldoKasAwalBaru: number;
  transaksiDihapusCount: number;
  keterangan: string;
}
