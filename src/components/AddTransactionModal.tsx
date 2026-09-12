import React, { useState } from 'react';
import { X, PlusCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [tipe, setTipe] = useState<TransactionType>('pemasukan');
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');
  const [kategori, setKategori] = useState('Penjualan F&B');
  const [metodePembayaran, setMetodePembayaran] = useState<PaymentMethod>('QRIS');
  const [pelangganAtauVendor, setPelangganAtauVendor] = useState('');
  const [catatan, setCatatan] = useState('');

  if (!isOpen) return null;

  const categoriesIncome = [
    'Penjualan F&B',
    'Penjualan Produk',
    'Katering & Event',
    'Pendapatan Lain-lain',
  ];

  const categoriesExpense = [
    'Bahan Baku (HPP)',
    'Gaji & Upah Staf',
    'Sewa & Utilitas',
    'Pemasaran & Ads',
    'Logistik & Kemasan',
    'Lain-lain & Perawatan',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNominal = parseFloat(nominal.replace(/[^0-9]/g, ''));
    if (!deskripsi || !cleanNominal || isNaN(cleanNominal)) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTx: Transaction = {
      id: `TRX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      tanggal: formattedDate,
      deskripsi,
      kategori,
      tipe,
      nominal: cleanNominal,
      metodePembayaran,
      status: 'sukses',
      pelangganAtauVendor: pelangganAtauVendor || undefined,
      catatan: catatan || undefined,
    };

    onAddTransaction(newTx);
    onClose();
    // Reset form
    setDeskripsi('');
    setNominal('');
    setPelangganAtauVendor('');
    setCatatan('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Catat Mutasi Transaksi
              </h3>
              <p className="text-xs text-slate-400">Masukkan transaksi kas baru ke buku kas Finora</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Tipe Selector: Pemasukan vs Pengeluaran */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTipe('pemasukan');
                  setKategori('Penjualan F&B');
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  tipe === 'pemasukan'
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>Pemasukan (+)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipe('pengeluaran');
                  setKategori('Bahan Baku (HPP)');
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  tipe === 'pengeluaran'
                    ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                <span>Pengeluaran (-)</span>
              </button>
            </div>
          </div>

          {/* Nominal */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nominal (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                Rp
              </span>
              <input
                type="text"
                required
                placeholder="Contoh: 150000"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Transaksi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Penjualan Kasir Siang / Beli Kopi Gayo 5kg"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Kategori & Metode Pembayaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Pos
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
              >
                {(tipe === 'pemasukan' ? categoriesIncome : categoriesExpense).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Metode Pembayaran
              </label>
              <select
                value={metodePembayaran}
                onChange={(e) => setMetodePembayaran(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
              >
                <option value="QRIS">QRIS Statis/Dinamis</option>
                <option value="Transfer Bank">Transfer Bank (BCA/Mandiri)</option>
                <option value="Tunai">Tunai (Cash di Laci)</option>
                <option value="Kartu Debit">Kartu Debit / EDC</option>
              </select>
            </div>
          </div>

          {/* Pelanggan / Vendor */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pelanggan / Pihak Rekanan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Walk-in customer / Toko Kemasan Jaya"
              value={pelangganAtauVendor}
              onChange={(e) => setPelangganAtauVendor(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Internal
            </label>
            <input
              type="text"
              placeholder="Keterangan tambahan untuk audit buku kas..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
