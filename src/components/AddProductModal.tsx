import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  Tag, 
  DollarSign, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { ProductSales } from '../types';
import { formatRupiah } from '../utils/formatters';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductSales) => void;
  theme?: MontessoriTheme;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  theme,
}) => {
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Minuman Kopi');
  const [harga, setHarga] = useState<number>(25000);
  const [stok, setStok] = useState<number>(50);
  const [terjual, setTerjual] = useState<number>(0);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const primaryColor = theme?.colors.primary || '#5E8570';

  const defaultCategories = [
    'Minuman Kopi',
    'Pastry & Bakery',
    'Non-Kopi',
    'Makanan Ringan',
    'Makanan Utama',
    'Merchandise & Retail',
  ];

  // Handler when user clicks form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!nama.trim()) {
      setValidationError('Nama produk wajib diisi.');
      return;
    }

    if (harga <= 0) {
      setValidationError('Harga produk harus lebih dari Rp 0.');
      return;
    }

    // Open confirmation pop-up as requested by user
    setShowConfirmPopup(true);
  };

  // Handler when user confirms in pop-up ("tambahkan")
  const handleConfirmAdd = () => {
    const statusStok = stok <= 0 ? 'habis' : stok <= 15 ? 'menipis' : 'aman';
    const newProduct: ProductSales = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      nama: nama.trim(),
      kategori,
      harga: Number(harga),
      terjual: Number(terjual) || 0,
      pendapatan: (Number(terjual) || 0) * Number(harga),
      stok: Number(stok),
      statusStok,
      pertumbuhan: 10.0,
    };

    onAddProduct(newProduct);
    setShowConfirmPopup(false);
    resetForm();
    onClose();
  };

  // Handler when user cancels in pop-up ("batalkan")
  const handleCancelPopup = () => {
    setShowConfirmPopup(false);
  };

  const resetForm = () => {
    setNama('');
    setKategori('Minuman Kopi');
    setHarga(25000);
    setStok(50);
    setTerjual(0);
    setValidationError('');
    setShowConfirmPopup(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Tambahkan Produk Baru</h3>
              <p className="text-xs text-white/80">
                Pencatatan menu / produk katalog Finora UMKM
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Nama Produk */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Nama Produk / Menu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Kopi Susu Aren Signature, Croissant Almond..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#F4EFE6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Kategori & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Produk
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#F4EFE6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                {defaultCategories.map((c) => (
                  <option key={c} value={c} className="bg-white dark:bg-slate-800">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <span>Harga Jual (Rp)</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={harga}
                  onChange={(e) => setHarga(Number(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F4EFE6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stok & Terjual Awal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                Jumlah Stok Awal
              </label>
              <input
                type="number"
                min="0"
                value={stok}
                onChange={(e) => setStok(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F4EFE6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                Volume Terjual Awal (Opsional)
              </label>
              <input
                type="number"
                min="0"
                value={terjual}
                onChange={(e) => setTerjual(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#F4EFE6] dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Ringkasan Estimasi Item */}
          <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Estimasi Nilai Stok Produk:</p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                {formatRupiah((harga || 0) * (stok || 0))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">Status Awal Stok:</p>
              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                stok <= 0 
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : stok <= 15
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {stok <= 0 ? 'Habis' : stok <= 15 ? 'Menipis' : 'Stok Aman'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EAE4D8] dark:border-[#242D38] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer hover:brightness-105"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Produk</span>
            </button>
          </div>

        </form>

        {/* POP UP KONFIRMASI (Exact matching user prompt requirement: "Apakah anda yakin menambahkan?" with options "tambahkan" and "batalkan") */}
        {showConfirmPopup && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-5 sm:p-6 text-center space-y-4 animate-scaleUp">
              
              <div 
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <HelpCircle className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  Apakah anda yakin menambahkan?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Produk <strong className="text-slate-800 dark:text-slate-200">"{nama}"</strong> seharga{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">{formatRupiah(harga)}</strong> dengan stok {stok} item akan ditambahkan ke katalog menu Finora.
                </p>
              </div>

              {/* Two buttons requested by user: "tambahkan" and "batalkan" */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  id="cancel-add-product-btn"
                  onClick={handleCancelPopup}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-[#F2EDE4] dark:bg-slate-800 hover:bg-[#EAE4D8] dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  batalkan
                </button>

                <button
                  type="button"
                  id="confirm-add-product-btn"
                  onClick={handleConfirmAdd}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  tambahkan
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
