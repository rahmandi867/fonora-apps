import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ArrowUpRight,
  Filter,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  Wallet,
  X,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { ProductSales } from '../types';
import { formatRupiah } from '../utils/formatters';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface TopProductsProps {
  products: ProductSales[];
  onOpenAddProduct?: () => void;
  onResetProducts?: () => void;
  onDeleteProduct?: (id: string) => void;
  theme?: MontessoriTheme;
  isFullView?: boolean;
  currentUser?: { email?: string; role?: string; name?: string } | null;
}

export const TopProducts: React.FC<TopProductsProps> = ({ 
  products,
  onOpenAddProduct,
  onResetProducts,
  onDeleteProduct,
  theme,
  isFullView = false,
  currentUser,
}) => {
  const isCashier = currentUser?.role
    ? currentUser.role.toLowerCase().includes('kasir')
    : false;
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductSales | null>(null);

  const primaryColor = theme?.colors.primary || '#5E8570';

  const defaultCategories = ['Semua', 'Minuman Kopi', 'Pastry & Bakery', 'Non-Kopi', 'Makanan Ringan'];
  const customCategories = Array.from(new Set<string>(products.map((p) => p.kategori))).filter(
    (c) => !defaultCategories.includes(c)
  );
  const allCategories = [...defaultCategories, ...customCategories];

  const filteredProducts = filterKategori === 'Semua' 
    ? products 
    : products.filter(p => p.kategori === filterKategori);

  // Resume Calculations
  const totalProducts = products.length;
  const totalUnitsSold = products.reduce((sum, p) => sum + p.terjual, 0);
  const totalProductRevenue = products.reduce((sum, p) => sum + p.pendapatan, 0);
  const topProduct = products.length > 0 
    ? [...products].sort((a, b) => b.pendapatan - a.pendapatan)[0] 
    : null;
  const lowStockCount = products.filter(p => p.statusStok === 'menipis' || p.statusStok === 'habis').length;
  const maxRevenue = Math.max(...products.map(p => p.pendapatan), 1);

  const handleConfirmReset = () => {
    if (onResetProducts) {
      onResetProducts();
    }
    setShowResetConfirmModal(false);
  };

  const handleConfirmDelete = () => {
    if (productToDelete && onDeleteProduct) {
      onDeleteProduct(productToDelete.id);
    }
    setProductToDelete(null);
  };

  return (
    <div
      id="top-products-card"
      className="p-5 sm:p-6 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs transition-colors space-y-5"
    >
      {/* Header with Title & Action Controls: Tambah Produk & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE4D8] dark:border-[#242D38]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Resume & Menu Produk Terlaris
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {totalProducts} Menu Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Analisis volume penjualan, omzet tertinggi, sisa stok, serta penghapusan produk yang tidak tersedia
          </p>
        </div>

        {/* Action Buttons: + Tambah Produk & Tombol Reset */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {!isCashier && onResetProducts && (
            <button
              type="button"
              id="reset-products-btn"
              onClick={() => setShowResetConfirmModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Reset data produk ke data bawaan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Produk</span>
            </button>
          )}

          {onOpenAddProduct && (
            <button
              type="button"
              id="open-add-product-btn"
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer hover:brightness-105"
              style={{ backgroundColor: primaryColor }}
              title="Tambahkan menu produk baru"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Produk</span>
            </button>
          )}
        </div>
      </div>

      {/* RESUME KARTU PRODUK TERLARIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Top Product #1 */}
        <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-medium">Juara Omzet #1</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
            {topProduct ? topProduct.nama : '-'}
          </p>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
            {topProduct ? `${topProduct.terjual.toLocaleString('id-ID')} cup terjual` : '-'}
          </p>
        </div>

        {/* Total Omzet Menu */}
        <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-medium">Total Omzet Produk</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
            {formatRupiah(totalProductRevenue)}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Akumulasi penjualan menu
          </p>
        </div>

        {/* Total Volume Terjual */}
        <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-medium">Volume Terjual</span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
            {totalUnitsSold.toLocaleString('id-ID')} Item
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Di seluruh kategori
          </p>
        </div>

        {/* Peringatan Stok */}
        <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-medium">Perhatian Stok</span>
            <Package className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
            {lowStockCount} Menu
          </p>
          <p className={`text-[10px] font-semibold mt-0.5 ${lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`}>
            {lowStockCount > 0 ? 'Perlu Restock Segera' : 'Semua Stok Aman'}
          </p>
        </div>
      </div>

      {/* MENU KATEGORI PRODUK & OPSI TAMBAHKAN "PRODUK BARU" */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Kategori:
        </span>

        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterKategori(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              filterKategori === cat
                ? 'text-white shadow-xs'
                : 'bg-[#F2ECE2] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#EAE4D8] dark:hover:bg-slate-700'
            }`}
            style={
              filterKategori === cat
                ? { backgroundColor: primaryColor }
                : undefined
            }
          >
            {cat}
          </button>
        ))}

        {/* Opsi Tambahkan "Produk Baru" di menu kategori sesuai permintaan */}
        {onOpenAddProduct && (
          <button
            type="button"
            id="category-bar-add-product-btn"
            onClick={onOpenAddProduct}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 cursor-pointer hover:brightness-105 shrink-0 ml-1"
            style={{ backgroundColor: primaryColor }}
            title="Opsi Tambahkan Produk Baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Produk Baru</span>
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => {
            const percentOfTop = Math.round((product.pendapatan / maxRevenue) * 100);
            const isOutOfStock = product.statusStok === 'habis' || product.stok <= 0;

            return (
              <div
                key={product.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isOutOfStock
                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50'
                    : 'bg-[#F8F4EC] dark:bg-slate-800/40 border-[#E8E2D6]/80 dark:border-slate-800/80 hover:border-[#DDD4C5] dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Rank & Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs ${
                        isOutOfStock
                          ? 'bg-rose-500 text-white'
                          : index === 0
                          ? 'bg-amber-500 text-white shadow-amber-500/30'
                          : index === 1
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          : index === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {product.nama}
                        </h4>
                        {isOutOfStock && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0">
                            Tidak Tersedia
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="truncate">{product.kategori}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {formatRupiah(product.harga)}/item
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Revenue, Sold stats & ICON "X" untuk menghapus produk tidak tersedia */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                        {formatRupiah(product.pendapatan)}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {product.terjual.toLocaleString('id-ID')} terjual
                        </span>
                        <span
                          className={`inline-flex items-center text-[10px] font-bold ${
                            product.pertumbuhan >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-500'
                          }`}
                        >
                          {product.pertumbuhan >= 0 ? '+' : ''}
                          {product.pertumbuhan}%
                        </span>
                      </div>
                    </div>

                    {/* ICON "X" untuk menghapus produk yang tidak tersedia */}
                    {onDeleteProduct && (
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className={`p-1.5 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
                          isOutOfStock
                            ? 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-transparent hover:border-rose-200 dark:hover:border-rose-900'
                        }`}
                        title={isOutOfStock ? `Hapus produk tidak tersedia (x)` : `Hapus ${product.nama} (x)`}
                        aria-label={`Hapus ${product.nama}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar & Stock info */}
                <div className="mt-3 pt-2.5 border-t border-[#EAE4D8]/80 dark:border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-[#EAE4D8] dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentOfTop}%`,
                          backgroundColor: isOutOfStock ? '#E11D48' : primaryColor
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400">
                      Sisa Stok: <strong className={isOutOfStock ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-200 font-semibold'}>{product.stok}</strong>
                    </span>
                    {isOutOfStock ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        Tidak Tersedia
                      </span>
                    ) : product.statusStok === 'menipis' ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Menipis
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Tersedia
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-slate-400">
            Tidak ada produk pada kategori ini.
          </div>
        )}
      </div>

      {/* POP UP KONFIRMASI HAPUS PRODUK DENGAN ICON "X" */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-5 sm:p-6 text-center space-y-4">
            
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-rose-100 dark:bg-rose-950/60 text-rose-600 shadow-sm">
              <X className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Hapus Produk Tidak Tersedia?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Apakah anda yakin ingin menghapus <strong className="text-slate-800 dark:text-slate-200">"{productToDelete.nama}"</strong> dari katalog karena stok tidak tersedia?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-[#F2EDE4] dark:bg-slate-800 hover:bg-[#EAE4D8] dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                batalkan
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Hapus Produk
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POP UP KONFIRMASI RESET PRODUK */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-5 sm:p-6 text-center space-y-4">
            
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-rose-100 dark:bg-rose-950/60 text-rose-600 shadow-sm">
              <RotateCcw className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Apakah Anda yakin ingin mereset produk?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Tindakan ini akan mengembalikan daftar produk dan ranking terlaris ke data awal default Finora.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-[#F2EDE4] dark:bg-slate-800 hover:bg-[#EAE4D8] dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                batalkan
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Reset Produk
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
