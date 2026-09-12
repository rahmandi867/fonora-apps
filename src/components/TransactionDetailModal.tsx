import React from 'react';
import { X, CheckCircle2, ArrowDownLeft, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, formatTanggalWaktu } from '../utils/formatters';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const isIncome = transaction.tipe === 'pemasukan';

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Nota ${transaction.id}\nTanggal: ${transaction.tanggal}\nNominal: ${formatRupiah(transaction.nominal)}\nDeskripsi: ${transaction.deskripsi}\nMetode: ${transaction.metodePembayaran}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Rincian Bukti Transaksi
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher / Receipt Body */}
        <div className="p-6 text-center">
          <div
            className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-inner ${
              isIncome
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="w-7 h-7" />
            ) : (
              <ArrowUpRight className="w-7 h-7" />
            )}
          </div>

          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-2 ${
              isIncome
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
            }`}
          >
            {isIncome ? 'Pemasukan Kas' : 'Pengeluaran Kas'}
          </span>

          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isIncome
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isIncome ? '+ ' : '- '}
            {formatRupiah(transaction.nominal)}
          </h2>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
            {transaction.deskripsi}
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-left space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-400">ID Referensi:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {transaction.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Waktu Tercatat:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {transaction.tanggal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kategori Pos:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {transaction.kategori}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Metode Bayar:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {transaction.metodePembayaran}
              </span>
            </div>
            {transaction.pelangganAtauVendor && (
              <div className="flex justify-between">
                <span className="text-slate-400">Pihak Terkait:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {transaction.pelangganAtauVendor}
                </span>
              </div>
            )}
            {transaction.catatan && (
              <div className="flex justify-between">
                <span className="text-slate-400">Catatan:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {transaction.catatan}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400">Status Validasi:</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Bukti'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
