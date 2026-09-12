import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  PieChart as PieIcon, 
  ArrowUpRight,
  ArrowDownRight,
  CreditCard
} from 'lucide-react';
import { FinancialSummary } from '../types';
import { formatRupiah } from '../utils/formatters';

interface StatsCardsProps {
  summary: FinancialSummary;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ summary }) => {
  const cards = [
    {
      id: 'stat-card-pendapatan',
      title: 'Total Pendapatan',
      amount: formatRupiah(summary.totalPendapatan),
      badgeText: `+${summary.pertumbuhanPendapatan}%`,
      badgeType: 'positive',
      subtext: 'vs bulan sebelumnya',
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-500/40',
      sparklineColor: '#10b981',
      sparklinePoints: '0,25 20,20 40,22 60,16 80,18 100,8 120,4',
    },
    {
      id: 'stat-card-pengeluaran',
      title: 'Total Pengeluaran',
      amount: formatRupiah(summary.totalPengeluaran),
      badgeText: `${summary.penurunanPengeluaran}%`,
      badgeType: 'positive', // negative cost is good for business
      subtext: 'efisiensi biaya operasional',
      icon: Wallet,
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
      borderColor: 'hover:border-rose-500/40',
      sparklineColor: '#f43f5e',
      sparklinePoints: '0,10 20,12 40,18 60,14 80,19 100,16 120,22',
    },
    {
      id: 'stat-card-laba',
      title: 'Laba Bersih (Net Profit)',
      amount: formatRupiah(summary.labaBersih),
      badgeText: `Margin ${summary.marginLaba.toFixed(1)}%`,
      badgeType: 'highlight',
      subtext: `+${summary.pertumbuhanLaba}% laba terakumulasi`,
      icon: PieIcon,
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
      borderColor: 'hover:border-blue-500/40',
      sparklineColor: '#3b82f6',
      sparklinePoints: '0,28 20,24 40,20 60,18 80,12 100,9 120,3',
    },
    {
      id: 'stat-card-kas',
      title: 'Saldo Kas & Likuiditas',
      amount: formatRupiah(summary.saldoKas),
      badgeText: `${summary.transaksiBerhasil} Trx`,
      badgeType: 'neutral',
      subtext: '99.1% transaksi terselesaikan',
      icon: CreditCard,
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-amber-500/40',
      sparklineColor: '#f59e0b',
      sparklinePoints: '0,15 20,17 40,12 60,14 80,10 100,7 120,5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-200 ${card.borderColor} flex flex-col justify-between group`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1 mb-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.amount}
                </h3>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0 ${
                    card.badgeType === 'positive'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                      : card.badgeType === 'highlight'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {card.badgeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : card.badgeType === 'highlight' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : null}
                  {card.badgeText}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {card.subtext}
                </span>
              </div>

              {/* Decorative mini sparkline */}
              <div className="w-14 h-7 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
                  <polyline
                    fill="none"
                    stroke={card.sparklineColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={card.sparklinePoints}
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
