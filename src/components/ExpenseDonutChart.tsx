import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ExpenseCategoryItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ExpenseDonutChartProps {
  categories: ExpenseCategoryItem[];
  totalPengeluaran: number;
}

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({
  categories,
  totalPengeluaran,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const activeCategory = activeIndex !== null ? categories[activeIndex] : null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ExpenseCategoryItem;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2.5 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            ></span>
            {data.kategori}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Nominal: <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(data.nominal)}</span>
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            Porsi: <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.persentase}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="expense-donut-chart-card"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Komposisi Pengeluaran
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Alokasi Biaya
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Distribusi pos operasional bulan berjalan
        </p>

        {/* Donut Chart Container */}
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
                dataKey="nominal"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    className="cursor-pointer transition-transform duration-200 hover:opacity-90"
                    style={{
                      transform: activeIndex === index ? 'scale(1.04)' : 'scale(1)',
                      transformOrigin: 'center center',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Info in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400">
              {activeCategory ? activeCategory.kategori : 'Total Biaya'}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeCategory
                ? formatRupiah(activeCategory.nominal)
                : formatRupiah(totalPengeluaran)}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {activeCategory ? `${activeCategory.persentase}% porsi` : '100% dialokasikan'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Legend List */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {categories.map((cat, idx) => (
          <div
            key={cat.kategori}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              activeIndex === idx
                ? 'bg-slate-100 dark:bg-slate-800 font-semibold'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              ></span>
              <span className="truncate text-slate-800 dark:text-slate-200">
                {cat.kategori}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                {formatRupiah(cat.nominal)}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 min-w-[36px] text-right">
                {cat.persentase}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
