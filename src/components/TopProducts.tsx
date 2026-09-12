import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { ProductSales } from '../types';
import { formatRupiah } from '../utils/formatters';

interface TopProductsProps {
  products: ProductSales[];
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  const [filterKategori, setFilterKategori] = useState<string>('Semua');

  const categories = ['Semua', 'Minuman Kopi', 'Pastry & Bakery', 'Non-Kopi', 'Makanan Ringan'];

  const filteredProducts = filterKategori === 'Semua' 
    ? products 
    : products.filter(p => p.kategori === filterKategori);

  const maxRevenue = Math.max(...products.map(p => p.pendapatan), 1);

  return (
    <div
      id="top-products-card"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Menu & Produk Terlaris
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Top Performance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peringkat volume penjualan dan kontribusi omzet tertinggi
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterKategori(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                filterKategori === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3.5">
        {filteredProducts.map((product, index) => {
          const percentOfTop = Math.round((product.pendapatan / maxRevenue) * 100);

          return (
            <div
              key={product.id}
              className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Rank & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      index === 0
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
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
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {product.nama}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="truncate">{product.kategori}</span>
                      <span>•</span>
                      <span>{formatRupiah(product.harga)}/item</span>
                    </div>
                  </div>
                </div>

                {/* Right: Revenue & Sold stats */}
                <div className="text-right shrink-0">
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
              </div>

              {/* Progress bar & Stock info */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentOfTop}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">
                    Sisa Stok: <strong className="text-slate-700 dark:text-slate-200">{product.stok}</strong>
                  </span>
                  {product.statusStok === 'menipis' ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Menipis
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      Aman
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
