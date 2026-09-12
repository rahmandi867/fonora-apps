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

export type ActiveTab = 'dashboard' | 'transaksi' | 'laporan' | 'produk' | 'insight';

export type PeriodFilter = 'hari_ini' | '7_hari' | 'bulan_ini' | 'tahun_ini';
