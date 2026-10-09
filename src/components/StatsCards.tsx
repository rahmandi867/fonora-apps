import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign, 
  PieChart as PieIcon, 
  CreditCard
} from 'lucide-react';
import { FinancialSummary } from '../types';
import { MontessoriTheme } from '../themes/montessoriThemes';
import { formatRupiah } from '../utils/formatters';

interface StatsCardsProps {
  summary: FinancialSummary;
  theme?: MontessoriTheme;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ summary, theme }) => {
  const incomeColor = theme ? theme.chart.income : '#10b981';
  const expenseColor = theme ? theme.chart.expense : '#f43f5e';
  const primaryColor = theme ? theme.colors.primary : '#3b82f6';
  const accentColor = theme ? theme.colors.accent : '#f59e0b';

  const cards = [
    {
      id: 'stat-card-pendapatan',
      title: 'Total Pendapatan',
      amount: formatRupiah(summary.totalPendapatan),
      badgeText: `+${summary.pertumbuhanPendapatan}%`,
      badgeType: 'positive',
      subtext: 'vs bulan sebelumnya',
      icon: DollarSign,
      color: incomeColor,
      sparklineColor: incomeColor,
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
      color: expenseColor,
      sparklineColor: expenseColor,
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
      color: primaryColor,
      sparklineColor: primaryColor,
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
      color: accentColor,
      sparklineColor: accentColor,
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
            className="p-5 rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xs transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {card.title}
                </span>
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${card.color}18`,
                    color: card.color,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1 mb-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.amount}
                </h3>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE4D8] dark:border-[#242D38] flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                    border: `1px solid ${card.color}30`,
                  }}
                >
                  {card.badgeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                  {card.badgeText}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate hidden xs:inline">
                  {card.subtext}
                </span>
              </div>

              {/* Sparkline Visual */}
              <div className="shrink-0 pl-2">
                <svg width="48" height="20" className="overflow-visible opacity-80 group-hover:opacity-100 transition-opacity">
                  <polyline
                    fill="none"
                    stroke={card.sparklineColor}
                    strokeWidth="2.2"
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
