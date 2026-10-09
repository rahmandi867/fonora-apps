import React from 'react';
import { 
  X, 
  Check, 
  Palette, 
  Sparkles, 
  Leaf, 
  Flame, 
  Mountain, 
  Sun, 
  Moon,
  Layers,
  Eye
} from 'lucide-react';
import { MontessoriThemeId, MONTESSORI_THEMES } from '../themes/montessoriThemes';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: MontessoriThemeId;
  onSelectTheme: (id: MontessoriThemeId) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (val: boolean) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme,
  isDarkMode,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  const themes = Object.values(MONTESSORI_THEMES);

  const getThemeIcon = (id: MontessoriThemeId) => {
    switch (id) {
      case 'sage':
        return Leaf;
      case 'terracotta':
        return Flame;
      case 'alpine':
        return Mountain;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FCFAF6] dark:bg-[#161C23] border border-[#E8E2D6] dark:border-[#242D38] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE4D8] dark:border-[#242D38] flex items-start justify-between gap-4 bg-white/70 dark:bg-[#182028]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Pengaturan Tampilan & Warna Finora
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Montessori Eropa
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kustomisasi 2 mode pencahayaan (Off-White & Dark) serta 3 palet warna alami.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-[#F2ECE2] dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* SECTION 1: DUA MODE TAMPILAN (OFF-WHITE VS DARK MODE) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  2 Mode Tampilan (Pencahayaan)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Pilih kenyamanan mata Anda
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Light Mode (Off-White) */}
              <div
                onClick={() => onToggleDarkMode(false)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                  !isDarkMode
                    ? 'border-amber-600/80 bg-[#FAF7F2] shadow-sm ring-2 ring-amber-500/15'
                    : 'border-[#EAE4D8] dark:border-[#28323F] bg-white dark:bg-[#19212A] hover:border-slate-400 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Light Mode (Off-White)
                        </h4>
                        <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">
                          Linen & Alabaster Alami
                        </span>
                      </div>
                    </div>
                    {!isDarkMode && (
                      <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Kanvas lembut bernuansa kertas linen dan kayu Montessori. Menghilangkan silau putih 100%, sangat nyaman untuk pencatatan kas harian.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#EAE4D8] dark:border-[#2C3847] text-[11px] text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-[#FAF7F2] border border-[#DCD5C6] shadow-2xs"></span>
                  <span>Kanvas: Warm Off-White (#FAF7F2)</span>
                </div>
              </div>

              {/* Option 2: Dark Mode */}
              <div
                onClick={() => onToggleDarkMode(true)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                  isDarkMode
                    ? 'border-slate-300 dark:border-amber-400 bg-slate-900 dark:bg-[#12171E] shadow-sm ring-2 ring-slate-400/20 text-white'
                    : 'border-[#EAE4D8] dark:border-[#28323F] bg-white dark:bg-[#19212A] hover:border-slate-400 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-300 flex items-center justify-center shadow-2xs">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          Dark Mode
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Deep Charcoal Night
                        </span>
                      </div>
                    </div>
                    {isDarkMode && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Nuansa malam yang tenang dan sejuk tanpa cahaya kontras berlebih. Mengurangi emisi cahaya biru dan ramah mata di kondisi minim cahaya.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#EAE4D8] dark:border-[#2C3847] text-[11px] text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-[#0E1318] border border-slate-700 shadow-2xs"></span>
                  <span>Kanvas: Deep Slate Night (#0E1318)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: 3 PILIHAN TEMA WARNA MODERN SOFT MONTESSORI EROPA */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  3 Pilihan Palet Warna Modern Soft Montessori
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Aksen & Grafis
              </span>
            </div>

            <div className="space-y-3">
              {themes.map((thm) => {
                const isSelected = activeThemeId === thm.id;
                const Icon = getThemeIcon(thm.id);

                return (
                  <div
                    key={thm.id}
                    onClick={() => onSelectTheme(thm.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-slate-800 dark:border-slate-200 bg-white dark:bg-[#1A222B] shadow-sm ring-2 ring-slate-400/20'
                        : 'border-[#EAE4D8] dark:border-[#242D38] hover:border-slate-400 dark:hover:border-slate-700 bg-white/70 dark:bg-[#161C23]'
                    }`}
                  >
                    {/* Left details */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: thm.colors.primary }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {thm.name}
                        </h4>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: thm.colors.secondary,
                            color: thm.colors.primary,
                            border: `1px solid ${thm.colors.borderSoft}`,
                          }}
                        >
                          {thm.regionalTitle}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Aktif
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {thm.tagline}
                      </p>
                    </div>

                    {/* Right: Swatches & Select Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE4D8] dark:border-[#242D38]">
                      {/* Color Swatch Circles */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F6F2EA] dark:bg-slate-800 border border-[#E4DDD0] dark:border-slate-700">
                        <div
                          className="w-4.5 h-4.5 rounded-full shadow-inner ring-1 ring-black/10"
                          style={{ backgroundColor: thm.swatches.primary }}
                          title="Warna Utama"
                        />
                        <div
                          className="w-4.5 h-4.5 rounded-full shadow-inner ring-1 ring-black/10"
                          style={{ backgroundColor: thm.swatches.secondary }}
                          title="Nuansa Lembut"
                        />
                        <div
                          className="w-4.5 h-4.5 rounded-full shadow-inner ring-1 ring-black/10"
                          style={{ backgroundColor: thm.swatches.accent }}
                          title="Aksen Kontras"
                        />
                        <div
                          className="w-4.5 h-4.5 rounded-full shadow-inner ring-1 ring-black/10"
                          style={{ backgroundColor: thm.swatches.neutral }}
                          title="Linen Alami"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTheme(thm.id);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                            : 'bg-[#F2EDE4] hover:bg-[#EAE2D6] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isSelected ? 'Terpilih' : 'Terapkan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Montessori Educational note */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Kombinasi Sempurna:</strong> Gunakan <strong>Light Mode (Off-White)</strong> untuk kenyamanan membaca buku kas tanpa silau di siang hari, dan <strong>Dark Mode</strong> untuk sesi penutupan kas malam hari.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE4D8] dark:border-[#242D38] bg-[#F7F3EB] dark:bg-[#141A21] flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Setelan mode & tema tersimpan otomatis.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
