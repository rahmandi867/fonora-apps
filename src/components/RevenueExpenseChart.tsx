import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlyData, WeeklyData } from '../types';
import { formatRupiah, formatRupiahShort } from '../utils/formatters';
import { BarChart3, TrendingUp } from 'lucide-react';

interface RevenueExpenseChartProps {
  monthlyData: MonthlyData[];
  weeklyData: WeeklyData[];
}

export const RevenueExpenseChart: React.FC<RevenueExpenseChartProps> = ({
  monthlyData,
  weeklyData,
}) => {
  const [timeframe, setTimeframe] = useState<'bulanan' | 'mingguan'>('bulanan');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const data = timeframe === 'bulanan' ? monthlyData : weeklyData;
  const xAxisKey = timeframe === 'bulanan' ? 'bulan' : 'hari';

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rev = payload.find((p: any) => p.dataKey === 'pendapatan')?.value || 0;
      const exp = payload.find((p: any) => p.dataKey === 'pengeluaran')?.value || 0;
      const profit = rev - exp;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0';

      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 text-xs min-w-[200px]">
          <p className="font-bold text-slate-800 dark:text-slate-200 pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Periode {label}</span>
            <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Margin {margin}%
            </span>
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Pendapatan
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(rev)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Pengeluaran
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {formatRupiah(exp)}
              </span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Laba Bersih
              </span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {formatRupiah(profit)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="revenue-expense-chart-card"
      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors"
    >
      {/* Header with Title and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Tren Pendapatan & Pengeluaran
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Live Data
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Perbandingan omzet kotor vs biaya operasional usaha UMKM
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe selector */}
          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setTimeframe('bulanan')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === 'bulanan'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bulanan (2026)
            </button>
            <button
              onClick={() => setTimeframe('mingguan')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === 'mingguan'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              7 Hari Terakhir
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-lg transition-all ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grafik Garis Area"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Grafik Batang (Bar)"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => formatRupiahShort(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="pendapatan"
                name="Pendapatan (Omzet)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="pengeluaran"
                name="Pengeluaran (Biaya)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
              <XAxis
                dataKey={xAxisKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => formatRupiahShort(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
              />
              <Bar
                dataKey="pendapatan"
                name="Pendapatan"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="pengeluaran"
                name="Pengeluaran"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
