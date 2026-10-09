import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Store, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  UserPlus,
  X,
  Send,
  Phone
} from 'lucide-react';
import { AppUser, UserRegistrationRequest } from '../types';

interface WelcomeScreenProps {
  onLogin: (userData: { email: string; role: string; name: string }) => void;
  users?: AppUser[];
  onRequestAccess?: (request: UserRegistrationRequest) => void;
  registrationRequests?: UserRegistrationRequest[];
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onLogin,
  users = [],
  onRequestAccess,
  registrationRequests = [],
}) => {
  const [email, setEmail] = useState('rahman@finora.id');
  const [password, setPassword] = useState('finora2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Google registration request modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regReason, setRegReason] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const inputIdentifier = email.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputIdentifier) {
      setErrorMessage('Harap masukkan email atau username Anda.');
      return;
    }
    if (!inputPass) {
      setErrorMessage('Harap masukkan kata sandi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check against users
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === inputIdentifier || u.username.toLowerCase() === inputIdentifier
      );

      // Check if admin password was modified in localStorage
      let adminCustomPass: string | null = null;
      if (typeof window !== 'undefined') {
        adminCustomPass = localStorage.getItem('finora-admin-password');
      }

      if (foundUser) {
        let expectedPass = foundUser.password;
        if (foundUser.role === 'admin' && adminCustomPass) {
          expectedPass = adminCustomPass;
        }

        if (expectedPass && expectedPass !== inputPass) {
          setErrorMessage('Kata sandi salah. Harap periksa kembali.');
          return;
        }

        onLogin({
          email: foundUser.email,
          role: foundUser.roleTitle,
          name: foundUser.name,
        });
        return;
      }

      // Check if this email is in pending registration requests
      const pendingReq = registrationRequests.find(
        (r) => r.email.toLowerCase() === inputIdentifier && r.status === 'pending'
      );
      if (pendingReq) {
        setErrorMessage(`Akun ${pendingReq.email} sedang dalam antrean verifikasi dan menunggu persetujuan Developer/Admin.`);
        return;
      }

      // Default fallback for demo credentials
      if (inputIdentifier === 'rahman@finora.id' || inputIdentifier === 'rahman') {
        if (adminCustomPass && inputPass !== adminCustomPass) {
          setErrorMessage('Kata sandi admin tidak cocok dengan password yang baru disimpan.');
          return;
        }
        onLogin({
          email: 'rahman@finora.id',
          role: 'Owner / Admin Keuangan',
          name: 'Pak Rahman',
        });
        return;
      } else if (inputIdentifier === 'kasir@finora.id' || inputIdentifier === 'siti_kasir') {
        onLogin({
          email: 'kasir@finora.id',
          role: 'Kasir Utama',
          name: 'Siti Kasir',
        });
        return;
      }

      setErrorMessage('Pengguna tidak ditemukan. Silakan hubungi admin atau klik "Daftar dengan Akun Google" di bawah.');
    }, 500);
  };

  const handleQuickDemoLogin = (role: 'owner' | 'kasir') => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    let currentAdminPass = 'finora2026';
    if (typeof window !== 'undefined') {
      const savedPass = localStorage.getItem('finora-admin-password');
      if (savedPass) currentAdminPass = savedPass;
    }

    if (role === 'owner') {
      setEmail('rahman@finora.id');
      setPassword(currentAdminPass);
    } else {
      setEmail('kasir@finora.id');
      setPassword('kasir123');
    }

    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        email: role === 'owner' ? 'rahman@finora.id' : 'kasir@finora.id',
        role: role === 'owner' ? 'Owner / Admin Keuangan' : 'Kasir Utama',
        name: role === 'owner' ? 'Pak Rahman' : 'Siti Kasir',
      });
    }, 450);
  };

  const handleGoogleQuickFill = () => {
    setRegName('Rian Hidayat');
    setRegEmail('rian.hidayat@gmail.com');
    setRegPhone('0812-3456-7890');
    setRegReason('Staf kasir baru cabang Eatery Nusantara');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim()) return;

    setIsSubmittingReg(true);

    setTimeout(() => {
      setIsSubmittingReg(false);

      const newRequest: UserRegistrationRequest = {
        id: `REQ-${Date.now()}`,
        name: regName.trim() || 'Pengguna Google',
        email: regEmail.trim(),
        googleId: `g_${Date.now()}`,
        alasanPengajuan: regReason.trim() || 'Pengajuan akses kasir / staf operasional',
        noHp: regPhone.trim(),
        requestDate: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' WIB',
        status: 'pending',
      };

      if (onRequestAccess) {
        onRequestAccess(newRequest);
      }

      setIsRegisterModalOpen(false);
      setSuccessNotice(`Permintaan akun Google (${newRequest.email}) telah dikirim! Menunggu persetujuan Developer / Admin.`);
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegReason('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F6F2EB] text-[#2D2A26] flex flex-col justify-between selection:bg-[#BD6048] selection:text-white transition-colors duration-300">
      {/* Subtle Warm Montessori Ambient Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#EFE4D6]/70 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#F3DDD3]/60 blur-3xl" />
        <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-[#EAD8CB]/40 blur-2xl" />
      </div>

      {/* Top Minimalist Brand Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BD6048] text-white flex items-center justify-center shadow-md shadow-[#BD6048]/25">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-[#2B2723] flex items-center gap-1.5">
              Finora
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#FBECE6] text-[#8E3B27] border border-[#ECC8B9]">
                UMKM
              </span>
            </span>
            <p className="text-[11px] text-[#786F66]">Sistem Keuangan & Pembukuan Kas</p>
          </div>
        </div>

        {/* Terracotta Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE8DD] border border-[#DDD4C5] text-xs font-semibold text-[#665E54]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#BD6048]" />
          <span>Tema: Warm Beige & Terracotta</span>
        </div>
      </header>

      {/* Main Welcome Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          {/* Main Card with Warm Alabaster/Beige & Terracotta Border */}
          <div className="bg-[#FAF7F2] border border-[#E7DACF] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#D8C7B8]/30 transition-all">
            {/* Header Greeting */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FBECE6] border border-[#ECC8B9] flex items-center justify-center text-[#BD6048] mb-3 shadow-inner">
                <Store className="w-7 h-7" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#28231E] tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-xs sm:text-sm text-[#73685E] mt-1.5 leading-relaxed">
                Masuk ke sistem keuangan untuk mengelola pembukuan, mutasi kas, dan analitik usaha Anda.
              </p>
            </div>

            {/* Success Notification if any */}
            {successNotice && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-[#FDF0ED] border border-[#F6CBC0] text-[#9A3821] text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div>
                <label className="block text-xs font-bold text-[#564D43] uppercase tracking-wider mb-1.5">
                  Email atau Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9C9083] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    id="login-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@finora.id atau username"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F4EFE6] text-[#2B2723] placeholder-[#A3978B] rounded-2xl border border-[#DED4C5] focus:outline-none focus:border-[#BD6048] focus:bg-[#FFFDFB] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#564D43] uppercase tracking-wider">
                    Kata Sandi
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('finora2026');
                      setErrorMessage('Kata sandi demo diset: finora2026');
                    }}
                    className="text-[11px] text-[#BD6048] hover:text-[#9A3821] font-medium transition-colors"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9C9083] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#F4EFE6] text-[#2B2723] placeholder-[#A3978B] rounded-2xl border border-[#DED4C5] focus:outline-none focus:border-[#BD6048] focus:bg-[#FFFDFB] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9083] hover:text-[#564D43] p-1 rounded-lg"
                    aria-label="Lihat kata sandi"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#635A50] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#BD6048] focus:ring-[#BD6048] border-[#DED4C5] bg-[#F4EFE6] accent-[#BD6048] cursor-pointer"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
                <span className="text-[11px] text-[#8C8074]">Sesi 30 Hari</span>
              </div>

              {/* Submit Button (Terracotta Primary) */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#BD6048] hover:bg-[#A65039] active:scale-98 text-white font-bold text-sm shadow-md shadow-[#BD6048]/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Membuka Menu Utama...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Menu Utama</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider & Google Registration Request Button */}
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5DACF]" />
                </div>
                <span className="relative px-3 text-[11px] font-semibold bg-[#FAF7F2] text-[#8C8074]">
                  atau belum punya akun?
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F3EDE4] border border-[#DED4C5] text-[#2B2723] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:border-[#BD6048]"
              >
                <Mail className="w-4 h-4 text-rose-500" />
                <span>Daftar Layanan dengan Akun Google</span>
              </button>
            </form>

            {/* Quick Demo Access Pills */}
            <div className="mt-6 pt-5 border-t border-[#EAE0D4]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#73685E] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#BD6048]" />
                  Akses Demo Cepat (1-Klik)
                </span>
                <span className="text-[10px] text-[#968A7D]">Tanpa mengetik</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('owner')}
                  className="p-2.5 rounded-xl bg-[#F3EDE4] hover:bg-[#EAE2D6] border border-[#DDD3C4] text-left transition-colors group cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#2B2723] group-hover:text-[#BD6048] transition-colors flex items-center gap-1">
                    👑 Owner
                  </p>
                  <p className="text-[10px] text-[#786F66]">Pak Rahman</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('kasir')}
                  className="p-2.5 rounded-xl bg-[#F3EDE4] hover:bg-[#EAE2D6] border border-[#DDD3C4] text-left transition-colors group cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#2B2723] group-hover:text-[#BD6048] transition-colors flex items-center gap-1">
                    ☕ Kasir
                  </p>
                  <p className="text-[10px] text-[#786F66]">Siti Kasir</p>
                </button>
              </div>
            </div>
          </div>

          {/* Security & Standard Badge below card */}
          <div className="mt-4 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DE] border border-[#DDD4C6] text-[11px] font-medium text-[#6B6258]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BD6048]" />
              <span>Standar Pembukuan SAK EMKM Indonesia</span>
            </div>
            <p className="text-[11px] text-[#8C8276]">
              Data terenkripsi lokal dan siap diekspor ke Excel & Word resmi
            </p>
          </div>
        </div>
      </main>

      {/* MODAL PENDAFTARAN LAYANAN DENGAN AKUN GOOGLE */}
      {isRegisterModalOpen && (
        <div 
          id="google-reg-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn text-[#2D2A26]"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div 
            id="google-reg-modal-card"
            className="w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#E7DACF] shadow-2xl p-6 sm:p-7 text-left max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EAE0D4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FBECE6] text-[#BD6048] flex items-center justify-center shadow-xs border border-[#ECC8B9]">
                  <Mail className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#28231E]">
                    Daftar Akun Layanan Google
                  </h3>
                  <p className="text-xs text-[#73685E]">
                    Persetujuan oleh Developer / Admin Finora
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#EFE8DE] flex items-center justify-center text-[#8C8276] hover:text-[#28231E] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo Fill */}
            <div className="my-3 p-3 rounded-2xl bg-[#EFE8DD] border border-[#DDD4C5] flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-[#665E54]">Isi data contoh cepat Google:</span>
              <button
                type="button"
                onClick={handleGoogleQuickFill}
                className="px-2.5 py-1 rounded-lg bg-[#BD6048] text-white text-[11px] font-bold hover:bg-[#A65039] transition-colors cursor-pointer"
              >
                Isi Otomatis
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#564D43] mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rian Hidayat"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#DED4C5] text-[#2B2723] focus:outline-none focus:border-[#BD6048] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#564D43] mb-1">
                  Email Akun Google (@gmail.com):
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9C9083] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="rian.hidayat@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#DED4C5] text-[#2B2723] focus:outline-none focus:border-[#BD6048] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564D43] mb-1">
                  Nomor WhatsApp / HP:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#9C9083] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#DED4C5] text-[#2B2723] focus:outline-none focus:border-[#BD6048] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#564D43] mb-1">
                  Keperluan / Alasan Pengajuan Akses:
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kasir shift malam / Staf barista baru cabang Eatery"
                  value={regReason}
                  onChange={(e) => setRegReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#DED4C5] text-[#2B2723] focus:outline-none focus:border-[#BD6048] focus:bg-white"
                />
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ℹ️ <strong>Alur Otorisasi:</strong> Pengajuan ini akan langsung masuk ke dashboard Developer / Admin Finora untuk disetujui sebagai <strong>Pengguna Kasir</strong> atau <strong>Admin</strong>.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#EFE8DD] hover:bg-[#E5DDCE] text-[#564D43] font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BD6048] hover:bg-[#A65039] text-white font-bold shadow-md shadow-[#BD6048]/30 transition-all active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReg ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
