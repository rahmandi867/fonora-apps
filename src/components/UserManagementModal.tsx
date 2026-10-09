import React, { useState } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Mail, 
  User, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Clock, 
  Phone, 
  Building2,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { AppUser, UserRole, UserRegistrationRequest } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { email: string; name: string; role: string };
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUserPassword: (userId: string, newPassword: string) => void;
  registrationRequests: UserRegistrationRequest[];
  onApproveRequest: (requestId: string, role: UserRole) => void;
  onRejectRequest: (requestId: string) => void;
  onChangeAdminPassword: (newPassword: string) => void;
  adminCurrentPassword?: string;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onAddUser,
  onDeleteUser,
  onUpdateUserPassword,
  registrationRequests,
  onApproveRequest,
  onRejectRequest,
  onChangeAdminPassword,
  adminCurrentPassword = 'finora2026',
}) => {
  const [activeTab, setActiveTab] = useState<'daftar_pengguna' | 'persetujuan_google' | 'ubah_password_admin'>('daftar_pengguna');
  
  // State for adding a new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('kasir');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [addUserSuccessMsg, setAddUserSuccessMsg] = useState<string | null>(null);
  const [addUserErrorMsg, setAddUserErrorMsg] = useState<string | null>(null);

  // State for changing admin password
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePasswordSuccessMsg, setChangePasswordSuccessMsg] = useState<string | null>(null);
  const [changePasswordErrorMsg, setChangePasswordErrorMsg] = useState<string | null>(null);

  // State for editing a specific staff password by admin
  const [editingUserForPassword, setEditingUserForPassword] = useState<AppUser | null>(null);
  const [staffNewPassword, setStaffNewPassword] = useState('');

  if (!isOpen) return null;

  const pendingRequestsCount = registrationRequests.filter((r) => r.status === 'pending').length;

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserPassword(result);
    setShowNewUserPassword(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserErrorMsg(null);
    setAddUserSuccessMsg(null);

    const cleanUsername = newUserUsername.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanUsername) {
      setAddUserErrorMsg('Username wajib diisi.');
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      setAddUserErrorMsg(`Username "${cleanUsername}" sudah digunakan. Gunakan username lain.`);
      return;
    }

    if (!newUserName.trim()) {
      setAddUserErrorMsg('Nama lengkap pengguna wajib diisi.');
      return;
    }

    if (!newUserPassword.trim() || newUserPassword.length < 5) {
      setAddUserErrorMsg('Password minimal harus terdiri dari 5 karakter.');
      return;
    }

    const roleTitleMap: Record<UserRole, string> = {
      admin: 'Owner / Admin Keuangan',
      kasir: 'Kasir Utama',
      staf: 'Staf Operasional / Barista',
    };

    const createdUser: AppUser = {
      id: `USR-${Date.now()}`,
      name: newUserName.trim(),
      username: cleanUsername,
      email: newUserEmail.trim() || `${cleanUsername}@finora.id`,
      password: newUserPassword.trim(),
      role: newUserRole,
      roleTitle: roleTitleMap[newUserRole],
      createdAt: new Date().toISOString().slice(0, 10),
      authProvider: 'local',
      isActive: true,
    };

    onAddUser(createdUser);
    setAddUserSuccessMsg(`Pengguna "${createdUser.name}" (@${createdUser.username}) berhasil ditambahkan sebagai ${createdUser.roleTitle}!`);

    // Reset form
    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('kasir');

    setTimeout(() => {
      setAddUserSuccessMsg(null);
    }, 4000);
  };

  const handleChangeAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordErrorMsg(null);
    setChangePasswordSuccessMsg(null);

    if (oldPasswordInput !== adminCurrentPassword) {
      setChangePasswordErrorMsg('Password lama yang Anda masukkan tidak cocok!');
      return;
    }

    if (newPasswordInput.length < 6) {
      setChangePasswordErrorMsg('Password baru minimal harus 6 karakter.');
      return;
    }

    if (newPasswordInput !== confirmNewPasswordInput) {
      setChangePasswordErrorMsg('Konfirmasi password baru tidak cocok.');
      return;
    }

    onChangeAdminPassword(newPasswordInput);
    setChangePasswordSuccessMsg('Kata sandi Admin berhasil diperbarui! Silakan gunakan sandi baru untuk login berikutnya.');
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');

    setTimeout(() => {
      setChangePasswordSuccessMsg(null);
    }, 4500);
  };

  const handleSaveStaffPassword = () => {
    if (!editingUserForPassword) return;
    if (staffNewPassword.length < 5) {
      alert('Password minimal 5 karakter!');
      return;
    }

    onUpdateUserPassword(editingUserForPassword.id, staffNewPassword);
    alert(`Password untuk pengguna ${editingUserForPassword.name} berhasil diubah.`);
    setEditingUserForPassword(null);
    setStaffNewPassword('');
  };

  return (
    <div 
      id="user-management-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="user-management-modal-card"
        className="w-full max-w-3xl rounded-3xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] shadow-2xl p-5 sm:p-7 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE4D8] dark:border-[#242D38]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Manajemen Pengguna & Otorisasi
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Khusus Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola username & password kasir/staf, persetujuan akun Google, serta keamanan admin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('daftar_pengguna')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'daftar_pengguna'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pengguna & Tambah Akun ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('persetujuan_google')}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'persetujuan_google'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Persetujuan Akun Google</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ubah_password_admin')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ubah_password_admin'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Ubah Password Admin</span>
          </button>
        </div>

        {/* Tab 1: Daftar Pengguna & Tambah Akun Baru */}
        {activeTab === 'daftar_pengguna' && (
          <div className="pt-4 space-y-6">
            {/* Form Tambah Pengguna Baru */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Tambah Pengguna (Username & Password Baru)
                </span>
                <span className="text-[11px] text-slate-400">Kasir / Staf / Co-Admin</span>
              </div>

              {addUserSuccessMsg && (
                <div className="mb-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{addUserSuccessMsg}</span>
                </div>
              )}

              {addUserErrorMsg && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{addUserErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Dewi Arimbi"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username Login (Unik):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                      <input
                        type="text"
                        placeholder="dewi_kasir"
                        value={newUserUsername}
                        onChange={(e) => setNewUserUsername(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email (Opsional / Akun Google):
                    </label>
                    <input
                      type="email"
                      placeholder="dewi@gmail.com atau dewi@finora.id"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Role / Hak Akses */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Peran / Hak Akses:
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    >
                      <option value="kasir">☕ Kasir Utama (Pencatatan Transaksi & POS)</option>
                      <option value="staf">🧑‍🍳 Staf Operasional / Barista (Stok & Menu)</option>
                      <option value="admin">👑 Admin / Owner (Akses Penuh Seluruh Sistem)</option>
                    </select>
                  </div>
                </div>

                {/* Password Input with Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Kata Sandi (Password):
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomPassword}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      Acak Sandi Otomatis
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewUserPassword ? 'text' : 'password'}
                      placeholder="Masukkan kata sandi (min 5 karakter)"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 rounded-xl bg-[#FAF7F2] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showNewUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Simpan & Daftarkan Pengguna</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Daftar Pengguna Aktif */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Daftar Pengguna Terdaftar ({users.length} Akun Aktif)
                </h4>
                <span className="text-[11px] text-slate-500">Tersimpan di sistem lokal</span>
              </div>

              <div className="space-y-2.5">
                {users.map((user) => {
                  const isCurrent = user.email === currentUser.email || user.username === 'rahman';
                  return (
                    <div
                      key={user.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                            user.role === 'admin' 
                              ? 'bg-amber-600' 
                              : user.role === 'kasir' 
                              ? 'bg-emerald-600' 
                              : 'bg-blue-600'
                          }`}
                        >
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              @{user.username}
                            </span>
                            <span 
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                user.role === 'admin'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200'
                                  : user.role === 'kasir'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200'
                              }`}
                            >
                              {user.roleTitle}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 font-semibold">
                                (Anda)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Email: {user.email} • Terdaftar: {user.createdAt}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUserForPassword(user);
                            setStaffNewPassword('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          title="Reset kata sandi staf ini"
                        >
                          Reset Sandi
                        </button>

                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus pengguna "${user.name}" (@${user.username})?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Hapus pengguna"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Mini: Reset Sandi Staf oleh Admin */}
            {editingUserForPassword && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      Ubah Sandi: {editingUserForPassword.name}
                    </h5>
                    <button onClick={() => setEditingUserForPassword(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-500">
                    Masukkan kata sandi baru untuk <strong>@{editingUserForPassword.username}</strong>:
                  </p>
                  <input
                    type="text"
                    placeholder="Sandi baru (min 5 karakter)"
                    value={staffNewPassword}
                    onChange={(e) => setStaffNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingUserForPassword(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveStaffPassword}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      Simpan Sandi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Persetujuan Akun Google oleh Developer / Admin */}
        {activeTab === 'persetujuan_google' && (
          <div className="pt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Persetujuan Registrasi Email Google (Developer / Admin Verification)</span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                Setiap calon kasir atau staf yang mengajukan pendaftaran menggunakan akun Google akan masuk ke antrean di bawah ini. Anda dapat menyetujui akses mereka sebagai <strong>Pengguna Kasir</strong> atau <strong>Admin</strong>.
              </p>
            </div>

            {registrationRequests.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-xs">Belum ada pengajuan pendaftaran baru.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {registrationRequests.map((req) => {
                  const isPending = req.status === 'pending';
                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isPending
                          ? 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-xs'
                          : req.status === 'disetujui'
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-75'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {req.name}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              <Mail className="w-3 h-3 text-rose-500" />
                              {req.email}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                req.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : req.status === 'disetujui'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {req.status === 'pending' ? '⏳ Menunggu Persetujuan' : req.status === 'disetujui' ? '✅ Disetujui' : '❌ Ditolak'}
                            </span>
                          </div>

                          {req.alasanPengajuan && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                              "{req.alasanPengajuan}"
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                            {req.noHp && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {req.noHp}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {req.requestDate}
                            </span>
                          </div>
                        </div>

                        {/* Tombol Aksi Persetujuan */}
                        {isPending ? (
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                            <button
                              type="button"
                              onClick={() => onRejectRequest(req.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950/60 dark:text-slate-300 dark:hover:text-rose-300 transition-colors cursor-pointer"
                            >
                              Tolak
                            </button>

                            <button
                              type="button"
                              onClick={() => onApproveRequest(req.id, 'kasir')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                              title="Setujui sebagai Pengguna Kasir"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Setujui sbg Kasir</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onApproveRequest(req.id, 'admin')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                              title="Setujui sebagai Co-Admin"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Setujui sbg Admin</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500 font-semibold self-end sm:self-center">
                            {req.status === 'disetujui' ? (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Aktif sebagai {req.approvedRole?.toUpperCase()}
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400">Permintaan Ditolak</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Fitur Ubah Password Khusus untuk Admin */}
        {activeTab === 'ubah_password_admin' && (
          <div className="pt-4 max-w-md mx-auto w-full space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Keamanan Akun Administrator:</strong>
                <p className="mt-0.5 text-[11px] text-amber-800/90 dark:text-amber-300">
                  Password ini digunakan oleh <strong>{currentUser.name}</strong> ({currentUser.email}) untuk mengotorisasi pembukuan kas, reset mutasi, tutup buku tahunan, dan login sistem.
                </p>
              </div>
            </div>

            {changePasswordSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{changePasswordSuccessMsg}</span>
              </div>
            )}

            {changePasswordErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{changePasswordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangeAdminPasswordSubmit} className="space-y-4 text-xs">
              {/* Password Lama */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Lama Admin:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Masukkan sandi lama"
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Baru */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ulangi Kata Sandi Baru:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Ketik ulang sandi baru"
                    value={confirmNewPasswordInput}
                    onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Perbarui Kata Sandi Admin</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
