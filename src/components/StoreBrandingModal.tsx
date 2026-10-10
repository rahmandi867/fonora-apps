import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CreditCard, 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  Sparkles, 
  Landmark, 
  Save, 
  RotateCcw, 
  Check, 
  Image as ImageIcon,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { StoreBranding, LogoIconType } from '../types';
import { MontessoriTheme } from '../themes/montessoriThemes';

interface StoreBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: StoreBranding;
  onSaveBranding: (newBranding: StoreBranding) => void;
  onResetBranding: () => void;
  theme?: MontessoriTheme;
}

export const logoIconMap: Record<LogoIconType, { label: string; icon: React.ElementType }> = {
  CreditCard: { label: 'Keuangan / Kartu', icon: CreditCard },
  Store: { label: 'Toko / Warung', icon: Store },
  Coffee: { label: 'Kopi / Kafe', icon: Coffee },
  Utensils: { label: 'Resto / Kuliner', icon: Utensils },
  ShoppingBag: { label: 'Retail / Belanja', icon: ShoppingBag },
  Sparkles: { label: 'Modern / Premium', icon: Sparkles },
  Landmark: { label: 'Bisnis / Kantor', icon: Landmark },
};

export const StoreBrandingModal: React.FC<StoreBrandingModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSaveBranding,
  onResetBranding,
  theme,
}) => {
  const [formData, setFormData] = useState<StoreBranding>(branding);
  const [activeTab, setActiveTab] = useState<'teks' | 'logo'>('teks');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const primaryColor = theme?.colors.primary || '#059669';
  const secondaryColor = theme?.colors.secondary || '#ecfdf5';
  const accentColor = theme?.colors.accent || '#10b981';

  const CurrentLogoIcon = logoIconMap[formData.logoIcon]?.icon || CreditCard;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBranding(formData);
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (confirm('Kembalikan nama merek, headline, dan logo ke pengaturan bawaan (Finora)?')) {
      onResetBranding();
      onClose();
    }
  };

  return (
    <div 
      id="store-branding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="store-branding-modal"
        className="w-full max-w-2xl bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-[#EAE4D8] dark:border-[#242D38] bg-[#F7F2E8] dark:bg-[#1A222C]">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Identitas Merek, Logo & Headline
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Khusus Owner
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ubah nama aplikasi, logo icon/gambar, slogan, dan nama usaha langsung tanpa koding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="p-4 bg-[#F2ECE0] dark:bg-[#141B22] border-b border-[#EAE4D8] dark:border-[#242D38]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>Pratinjau Langsung (Sidebar Preview):</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Real-Time</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCFAF6] dark:bg-[#182029] border border-[#DDD5C7] dark:border-[#283340] shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              >
                {formData.logoType === 'custom_url' && formData.logoUrl ? (
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo Toko" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <CurrentLogoIcon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white truncate">
                    {formData.brandName || 'Nama Brand'}
                  </span>
                  {formData.badgeText && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0"
                      style={{
                        backgroundColor: secondaryColor,
                        color: primaryColor,
                        border: `1px solid ${theme?.colors.borderSoft || '#d1fae5'}`,
                      }}
                    >
                      {formData.badgeText}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {formData.headline || 'Slogan atau Tagline Usaha'}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-right border-l border-[#EAE4D8] dark:border-slate-800 pl-3 shrink-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {formData.storeName || 'Nama Unit Usaha'}
              </p>
              <p className="text-[10px] text-slate-400">
                {formData.storeCategory || 'Kategori Usaha'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EAE4D8] dark:border-[#242D38] px-5 pt-3 bg-[#FBF9F5] dark:bg-[#161C23]">
          <button
            type="button"
            onClick={() => setActiveTab('teks')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'teks'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            1. Nama Brand & Headline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'logo'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            2. Pilihan Logo & Icon
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'teks' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Aplikasi / Brand <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="Contoh: Kopi Nusantara, Finora, KasirKu"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#DDD5C7] dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Teks judul besar di header navigasi.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teks Badge (Label Kecil)
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    placeholder="Contoh: UMKM, CAFE, RESTO, PRO"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#DDD5C7] dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Pill kecil di samping nama brand.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Headline Slogan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Contoh: Sistem Keuangan Mandiri, Solusi Pembukuan Kas Harian"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#DDD5C7] dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Slogan di bawah nama brand pada sidebar & welcome screen.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EAE4D8] dark:border-[#242D38]">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Unit Toko / Usaha
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="Contoh: Kopi Nusantara Sudirman, Toko Berkah"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#DDD5C7] dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Tercetak pada nota kasir dan berkas unduhan.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori / Bidang Bisnis
                  </label>
                  <input
                    type="text"
                    value={formData.storeCategory || ''}
                    onChange={(e) => setFormData({ ...formData, storeCategory: e.target.value })}
                    placeholder="Contoh: F&B / Coffee & Eatery, Retail Toko"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#DDD5C7] dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Keterangan unit usaha Anda.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logo' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Tipe Tampilan Logo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoType: 'icon' })}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      formData.logoType === 'icon'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-[#DDD5C7] dark:border-slate-800 hover:bg-[#F7F2E8]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">Icon Preset Vektor</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Pilih dari 7 icon elegan siap pakai (Kopi, Kartu, Resto, Toko, dll).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoType: 'custom_url' })}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      formData.logoType === 'custom_url'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-[#DDD5C7] dark:border-slate-800 hover:bg-[#F7F2E8]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">URL Gambar Kustom</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Gunakan link gambar logo PNG/SVG resmi bisnis Anda.
                    </p>
                  </button>
                </div>
              </div>

              {formData.logoType === 'icon' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Pilih Desain Icon Logo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {(Object.keys(logoIconMap) as LogoIconType[]).map((key) => {
                      const item = logoIconMap[key];
                      const IconComp = item.icon;
                      const isSelected = formData.logoIcon === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, logoIcon: key })}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500 font-bold'
                              : 'bg-white dark:bg-slate-900 border-[#DDD5C7] dark:border-slate-800 hover:bg-[#F7F2E8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div 
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="text-xs truncate">{item.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#DDD5C7] dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tautan / URL Gambar Logo (PNG/SVG/JPG)
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo-toko.png"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-[#DDD5C7] dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Masukkan URL gambar langsung yang dapat diakses publik. Jika kosong, sistem otomatis memakai icon vektor.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#EAE4D8] dark:border-[#242D38] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Bawaan (Finora)</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-[#EAE4D8] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer hover:brightness-105"
                style={{ backgroundColor: primaryColor }}
              >
                {saveSuccessMsg ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
