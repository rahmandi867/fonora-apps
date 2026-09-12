export const formatRupiah = (nominal: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(nominal);
};

export const formatRupiahShort = (nominal: number): string => {
  if (nominal >= 1_000_000_000) {
    return `Rp ${(nominal / 1_000_000_000).toFixed(1)} M`;
  }
  if (nominal >= 1_000_000) {
    return `Rp ${(nominal / 1_000_000).toFixed(1)} jt`;
  }
  if (nominal >= 1_000) {
    return `Rp ${(nominal / 1_000).toFixed(0)} rb`;
  }
  return `Rp ${nominal}`;
};

export const formatTanggalIndo = (tanggalString: string): string => {
  try {
    const date = new Date(tanggalString);
    if (isNaN(date.getTime())) return tanggalString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return tanggalString;
  }
};

export const formatTanggalWaktu = (tanggalString: string): string => {
  try {
    const date = new Date(tanggalString);
    if (isNaN(date.getTime())) return tanggalString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return tanggalString;
  }
};
