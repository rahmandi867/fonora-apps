export type MontessoriThemeId = 'sage' | 'terracotta' | 'alpine';

export interface MontessoriTheme {
  id: MontessoriThemeId;
  name: string;
  regionalTitle: string;
  tagline: string;
  philosophy: string;
  swatches: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  // CSS Colors
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    bgSoft: string;
    bgSoftDark: string;
    borderSoft: string;
    borderSoftDark: string;
  };
  // Tailwind utility classes for consistent styling
  classes: {
    badge: string;
    badgeDark: string;
    buttonPrimary: string;
    sidebarActive: string;
    sidebarIconActive: string;
    bannerGradient: string;
    cardHighlightBorder: string;
    brandGradient: string;
    textAccent: string;
  };
  // Chart Colors adapted for Recharts
  chart: {
    income: string;
    incomeGradientStart: string;
    expense: string;
    expenseGradientStart: string;
    categories: string[];
  };
}

export const MONTESSORI_THEMES: Record<MontessoriThemeId, MontessoriTheme> = {
  sage: {
    id: 'sage',
    name: 'Nordic Sage & Oat',
    regionalTitle: 'Skandinavia Alami',
    tagline: 'Ketenangan alam Skandinavia dengan nuansa sage dan kayu gandum alami',
    philosophy:
      'Diinspirasi oleh material kayu birch alami, daun sage, dan linen organik ruang kelas Montessori Skandinavia. Menenangkan mata kasir/pemilik UMKM, menurunkan kelelahan visual, dan memberi fokus tinggi pada angka finansial.',
    swatches: {
      primary: '#5E8570',     // Soft Sage
      secondary: '#E8EFEA',   // Eucalyptus Mist
      accent: '#D5A259',      // Warm Ochre
      neutral: '#F8F6F1',     // Warm Oat Linen
    },
    colors: {
      primary: '#5E8570',
      primaryDark: '#78A88E',
      secondary: '#E8EFEA',
      accent: '#D5A259',
      bgSoft: '#F8F7F3',
      bgSoftDark: '#121A16',
      borderSoft: '#D7E3DC',
      borderSoftDark: '#22352B',
    },
    classes: {
      badge: 'bg-[#E8EFEA] text-[#3A5E4B] border-[#CDE0D4]',
      badgeDark: 'dark:bg-[#1A2E23] dark:text-[#97CBB0] dark:border-[#274836]',
      buttonPrimary: 'bg-[#5E8570] hover:bg-[#4E725F] text-white shadow-sm shadow-[#5E8570]/30',
      sidebarActive: 'bg-[#5E8570] text-white font-semibold shadow-sm shadow-[#5E8570]/30',
      sidebarIconActive: 'text-white',
      bannerGradient: 'from-[#4D7762] via-[#5C8670] to-[#719B85]',
      cardHighlightBorder: 'hover:border-[#5E8570]/50',
      brandGradient: 'from-[#4D7762] to-[#719B85]',
      textAccent: 'text-[#4E7762] dark:text-[#88BCA0]',
    },
    chart: {
      income: '#5E8570',
      incomeGradientStart: '#5E8570',
      expense: '#CF7660', // Soft Muted Clay
      expenseGradientStart: '#CF7660',
      categories: [
        '#5E8570', // Bahan Baku: Soft Sage
        '#7E9D7C', // Gaji: Olive Matcha
        '#D5A259', // Sewa: Muted Warm Ochre
        '#8D83A4', // Promosi: Dusty Lavender
        '#CF7660', // Logistik: Terracotta Blush
        '#6D7D84', // Perawatan: Warm Slate
      ],
    },
  },

  terracotta: {
    id: 'terracotta',
    name: 'Tuscan Terracotta & Linen',
    regionalTitle: 'Mediterania Hangat',
    tagline: 'Kehangatan tembikar Mediterania, tanah liat Tuscany, dan aprikot lembut',
    philosophy:
      'Diinspirasi oleh kerajinan tanah liat Eropa Selatan, ubin terakota Tuscany, aprikot matang, dan kain linen mentah. Mencerminkan kehangatan, keramahan bisnis keluarga/kuliner, dan otentisitas karya UMKM.',
    swatches: {
      primary: '#BD6048',     // Warm Terracotta
      secondary: '#FBECE6',   // Peach Blush
      accent: '#638A75',      // Olive Herb
      neutral: '#FAF7F3',     // Warm Alabaster
    },
    colors: {
      primary: '#BD6048',
      primaryDark: '#DC7E67',
      secondary: '#FBECE6',
      accent: '#638A75',
      bgSoft: '#FAF6F1',
      bgSoftDark: '#1A1412',
      borderSoft: '#EED9CE',
      borderSoftDark: '#382520',
    },
    classes: {
      badge: 'bg-[#FBECE6] text-[#8E3B27] border-[#ECC8B9]',
      badgeDark: 'dark:bg-[#2C1914] dark:text-[#EFA491] dark:border-[#4B281F]',
      buttonPrimary: 'bg-[#BD6048] hover:bg-[#A65039] text-white shadow-sm shadow-[#BD6048]/30',
      sidebarActive: 'bg-[#BD6048] text-white font-semibold shadow-sm shadow-[#BD6048]/30',
      sidebarIconActive: 'text-white',
      bannerGradient: 'from-[#A84F38] via-[#BD6048] to-[#D47E66]',
      cardHighlightBorder: 'hover:border-[#BD6048]/50',
      brandGradient: 'from-[#A84F38] to-[#D47E66]',
      textAccent: 'text-[#BD6048] dark:text-[#ECA18D]',
    },
    chart: {
      income: '#BD6048',
      incomeGradientStart: '#BD6048',
      expense: '#5C8573', // Soft Muted Olive
      expenseGradientStart: '#5C8573',
      categories: [
        '#BD6048', // Bahan Baku: Tuscan Terracotta
        '#638A75', // Gaji: Herb Olive
        '#D69E4B', // Sewa: Honey Mustard
        '#A8687A', // Promosi: Dusty Clay Rose
        '#D58A6F', // Logistik: Muted Apricot
        '#7B736F', // Perawatan: Sand Stone
      ],
    },
  },

  alpine: {
    id: 'alpine',
    name: 'Alpine Mineral & Mist',
    regionalTitle: 'Alpen & Mineral',
    tagline: 'Kesejukan kabut pegunungan Alpen Swiss dengan nuansa biru kapur elegan',
    philosophy:
      'Diinspirasi oleh panorama pagi pegunungan Alpen Eropa, batuan kapur mineral, dan kabut embun danau Jenewa. Memberikan kesan presisi analitis, kejernihan kalkulasi data finansial, dan ketenangan modern tingkat tinggi.',
    swatches: {
      primary: '#517495',     // Alpine Mineral Blue
      secondary: '#EAF0F6',   // Glacier Mist
      accent: '#C7725B',      // Soft Terracotta Copper
      neutral: '#F5F8FA',     // Chalk White
    },
    colors: {
      primary: '#517495',
      primaryDark: '#799DBF',
      secondary: '#EAF0F6',
      accent: '#C7725B',
      bgSoft: '#F4F7FA',
      bgSoftDark: '#121821',
      borderSoft: '#D4E1EC',
      borderSoftDark: '#212D3D',
    },
    classes: {
      badge: 'bg-[#EAF0F6] text-[#315170] border-[#C7D9E8]',
      badgeDark: 'dark:bg-[#182635] dark:text-[#9CC2E5] dark:border-[#253D54]',
      buttonPrimary: 'bg-[#517495] hover:bg-[#405F7D] text-white shadow-sm shadow-[#517495]/30',
      sidebarActive: 'bg-[#517495] text-white font-semibold shadow-sm shadow-[#517495]/30',
      sidebarIconActive: 'text-white',
      bannerGradient: 'from-[#416281] via-[#517495] to-[#6E93B5]',
      cardHighlightBorder: 'hover:border-[#517495]/50',
      brandGradient: 'from-[#416281] to-[#6E93B5]',
      textAccent: 'text-[#517495] dark:text-[#88B0D6]',
    },
    chart: {
      income: '#517495',
      incomeGradientStart: '#517495',
      expense: '#C7725B', // Soft Terracotta Rust
      expenseGradientStart: '#C7725B',
      categories: [
        '#517495', // Bahan Baku: Alpine Mineral Blue
        '#5E897B', // Gaji: Glacier Spruce
        '#D19C52', // Sewa: Muted Amber Glow
        '#827599', // Promosi: Heather Twilight
        '#C7725B', // Logistik: Soft Copper
        '#687B8D', // Perawatan: Mountain Mist Grey
      ],
    },
  },
};
