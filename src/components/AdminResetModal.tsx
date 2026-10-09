import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  KeyRound, 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle, 
  Download, 
  FileSpreadsheet,
  Lock,
  Wallet,
  Clock,
  UserCheck
} from 'lucide-react';
import { ResetAuditLog } from '../types';
import { formatRupiah } from '../utils/formatters';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface AdminResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteReset: (options: {
    type: 'bersihkan_transaksi' | 'reset_pabrik';
    newStartingBalance: number;
    adminName: string;
    keterangan: string;
  }) => void;
  onExportBackup: () => void;
  recentAuditLogs: ResetAuditLog[];
  theme?: MontessoriTheme;
}

export const AdminResetModal: React.FC<AdminResetModalProps> = ({
  isOpen,
  onClose,
  onExecuteReset,
  onExportBackup,
  recentAuditLogs,
  theme,
}) => {
  const [password, setPassword] = useState('');
  const [confirmationWord, setConfirmationWord] = useState('');
  const [resetType, setResetType] = useState<'bersihkan_transaksi' | 'reset_pabrik'>('bersihkan_transaksi');
  const [startingBalanceInput, setStartingBalanceInput] = useState<number>(0);
  const [adminName, setAdminName] = useState('Pak Rahman (Owner)');
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const primaryColor = theme?.colors.primary || '#5E8570';

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Verification 1: Admin password check
    if (password !== 'admin123' && password !== 'admin') {
      setErrorMessage('Kata sandi admin salah! Gunakan password admin yang valid (default: admin123).');
      return;
    }

    // Verification 2: Word confirmation
    if (confirmationWord.trim().toUpperCase() !== 'RESET') {
      setErrorMessage('Ketik kata "RESET" dengan huruf kapital pada kolom konfirmasi untuk melanjutkan.');
      return;
    }

    onExecuteReset({
      type: resetType,
      newStartingBalance: resetType === 'bersihkan_transaksi' ? startingBalanceInput : 20000000,
      adminName: adminName || 'Admin Finora',
      keterangan: reason || (resetType === 'bersihkan_transaksi' 
        ? `Reset transaksi pembukuan baru dengan modal awal ${formatRupiah(startingBalanceInput)}` 
        : 'Reset pabrik ke data bawaan demo sistem'),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#B85D43] to-[#8E3B27] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">Reset Transaksi dengan Persetujuan Admin</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-white/80">
                Otentikasi keamanan tinggi untuk membersihkan dan memulai pembukuan baru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleConfirmReset} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          
          {/* Warning Banner */}
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-red-900 dark:text-red-200 space-y-1">
              <p className="font-bold">Peringatan Penghapusan Data Transaksi!</p>
              <p className="leading-relaxed text-red-800/90 dark:text-red-300/80">
                Tindakan ini membutuhkan persetujuan dan verifikasi kata sandi Owner/Admin. Harap pastikan laporan keuangan telah diunduh atau dicadangkan sebelum melakukan reset.
              </p>
            </div>
          </div>

          {/* Backup Button */}
          <div className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Ingin Mengamankan Data Sekarang?</p>
                <p className="text-[11px] text-slate-400">Unduh mutasi saat ini ke berkas Excel sebelum direset</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onExportBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cadangkan Data</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Reset Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Pilih Jenis Reset Transaksi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setResetType('bersihkan_transaksi')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  resetType === 'bersihkan_transaksi'
                    ? 'bg-[#F2ECE2] dark:bg-slate-800 border-amber-600 dark:border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-[#FAF7F2] dark:bg-slate-800/40 border-[#E4DDD0] dark:border-slate-700/60 hover:bg-[#F2ECE2]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Mulai Buku Baru (Bersih)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Menghapus mutasi saat ini & membuka lembar baru dengan saldo kas awal yang ditentukan.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setResetType('reset_pabrik')}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  resetType === 'reset_pabrik'
                    ? 'bg-[#F2ECE2] dark:bg-slate-800 border-rose-600 dark:border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-[#FAF7F2] dark:bg-slate-800/40 border-[#E4DDD0] dark:border-slate-700/60 hover:bg-[#F2ECE2]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Reset ke Data Demo Bawaan</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Mengembalikan semua data ke setelan percontohan awal Finora Coffee & Eatery.
                </p>
              </button>
            </div>
          </div>

          {/* Custom Starting Balance (if clean slate) */}
          {resetType === 'bersihkan_transaksi' && (
            <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-slate-800/60 border border-[#E6DFD2] dark:border-slate-800 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
                Tetapkan Saldo Kas Awal untuk Transaksi Baru (Rp):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={startingBalanceInput}
                  onChange={(e) => setStartingBalanceInput(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Nilai ini akan dicatat sebagai saldo pembuka modal kerja awal di sistem buku baru.
              </p>
            </div>
          )}

          {/* Admin Credentials & Confirmation */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  Kata Sandi Admin / Owner
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                  Default: <code>admin123</code>
                </span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi admin..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                Konfirmasi Persetujuan (Ketik kata <span className="text-red-600 dark:text-red-400 font-extrabold">RESET</span>):
              </label>
              <input
                type="text"
                required
                value={confirmationWord}
                onChange={(e) => setConfirmationWord(e.target.value)}
                placeholder="Ketik RESET"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none uppercase tracking-widest font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alasan / Catatan Reset (Audit Trail)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Mulai tahun pembukuan baru / ganti shift kasir"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-[#E0D9CC] dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Audit History Snippet */}
          {recentAuditLogs.length > 0 && (
            <div className="pt-2 border-t border-[#EAE4D8] dark:border-[#242D38]">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Riwayat Audit Reset Terakhir:
              </p>
              <div className="space-y-1.5 max-h-24 overflow-y-auto">
                {recentAuditLogs.slice(0, 2).map((log) => (
                  <div key={log.id} className="p-2 rounded-xl bg-[#F4EFE6] dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{log.adminName}</span> — {log.keterangan}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Buttons */}
          <div className="pt-3 border-t border-[#EAE4D8] dark:border-[#242D38] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#B85D43] to-[#8E3B27] hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Setujui & Eksekusi Reset</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
