import { Transaction, FinancialSummary, ProductSales } from '../types';
import { formatRupiah, formatTanggalWaktu } from './formatters';

// Export to Excel / CSV with proper UTF-8 BOM
export const exportToExcel = (
  transactions: Transaction[],
  summary: FinancialSummary,
  fileName = 'Finora_Laporan_Transaksi_UMKM'
) => {
  const headers = [
    'ID Transaksi',
    'Tanggal & Waktu',
    'Deskripsi Transaksi',
    'Kategori',
    'Tipe',
    'Nominal (Rp)',
    'Metode Pembayaran',
    'Status',
    'Pelanggan / Rekanan',
    'Catatan',
  ];

  const escapeCsv = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = transactions.map((t) => [
    escapeCsv(t.id),
    escapeCsv(t.tanggal),
    escapeCsv(t.deskripsi),
    escapeCsv(t.kategori),
    escapeCsv(t.tipe === 'pemasukan' ? 'Pemasukan (+)' : 'Pengeluaran (-)'),
    escapeCsv(t.nominal),
    escapeCsv(t.metodePembayaran),
    escapeCsv(t.status.toUpperCase()),
    escapeCsv(t.pelangganAtauVendor || '-'),
    escapeCsv(t.catatan || '-'),
  ]);

  const summaryHeader = [
    'RINGKASAN KEUANGAN FINORA',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];
  const summaryRows = [
    ['Total Pendapatan', escapeCsv(summary.totalPendapatan)],
    ['Total Pengeluaran', escapeCsv(summary.totalPengeluaran)],
    ['Laba Bersih', escapeCsv(summary.labaBersih)],
    ['Margin Keuntungan', escapeCsv(`${summary.marginLaba}%`)],
    ['Saldo Kas Operasional', escapeCsv(summary.saldoKas)],
    ['Total Transaksi Tercatat', escapeCsv(summary.totalTransaksi)],
    ['', ''],
    ['DAFTAR TRANSAKSI DETAIL', ''],
  ];

  const csvContent =
    '\uFEFF' + // UTF-8 BOM
    summaryHeader.join(',') +
    '\n' +
    summaryRows.map((r) => r.join(',')).join('\n') +
    '\n' +
    headers.join(',') +
    '\n' +
    rows.map((r) => r.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export to Microsoft Word formatted document (.doc)
export const exportToWord = (
  transactions: Transaction[],
  summary: FinancialSummary,
  topProducts: ProductSales[],
  fileName = 'Finora_Laporan_Keuangan_Resmi'
) => {
  const currentDate = formatTanggalWaktu(new Date().toISOString());

  const rowsHtml = transactions
    .slice(0, 20)
    .map(
      (t) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${t.id}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${t.tanggal}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${t.deskripsi}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${t.kategori}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: bold; color: ${
          t.tipe === 'pemasukan' ? '#16a34a' : '#dc2626'
        };">
          ${t.tipe === 'pemasukan' ? '+ ' : '- '}${formatRupiah(t.nominal)}
        </td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${t.metodePembayaran}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">
          <span style="background-color: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${t.status.toUpperCase()}</span>
        </td>
      </tr>
    `
    )
    .join('');

  const productsHtml = topProducts
    .slice(0, 5)
    .map(
      (p, idx) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px;">#${idx + 1}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: bold;">${p.nama}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${p.kategori}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; text-align: right;">${p.terjual.toLocaleString('id-ID')} unit</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; text-align: right; font-weight: bold; color: #0284c7;">${formatRupiah(p.pendapatan)}</td>
      </tr>
    `
    )
    .join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Laporan Keuangan UMKM Finora</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; color: #1e293b; line-height: 1.5; padding: 24px; }
        h1 { color: #0f172a; margin-bottom: 4px; font-size: 24px; }
        h2 { color: #1e3a8a; margin-top: 24px; margin-bottom: 12px; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        th { background-color: #f1f5f9; color: #334155; padding: 8px; border: 1px solid #cbd5e1; font-size: 12px; text-align: left; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        .summary-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 18px; }
        .signature-table td { border: none; padding-top: 40px; }
      </style>
    </head>
    <body>
      <div style="border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="border: none;">
              <h1 style="margin: 0; color: #1d4ed8; font-size: 26px;">FINORA</h1>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 13px;">Sistem Keuangan Terpadu & Akuntansi UMKM Modern</p>
            </td>
            <td style="border: none; text-align: right;">
              <p style="margin: 0; font-weight: bold; font-size: 12px;">DOKUMEN RESMI LAPORAN KEUANGAN</p>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px;">Dihasilkan pada: ${currentDate}</p>
              <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px;">Periode: September 2026</p>
            </td>
          </tr>
        </table>
      </div>

      <div class="summary-box">
        <h2 style="margin-top: 0; border: none; color: #0f172a; font-size: 15px;">RINGKASAN EKSEKUTIF KINERJA USAHA</h2>
        <table style="width: 100%; border: none; margin-bottom: 0;">
          <tr>
            <td style="border: none; width: 25%; padding: 6px;">
              <div style="font-size: 11px; color: #64748b;">Total Pendapatan Usaha</div>
              <div style="font-size: 16px; font-weight: bold; color: #16a34a;">${formatRupiah(summary.totalPendapatan)}</div>
              <div style="font-size: 10px; color: #16a34a;">+${summary.pertumbuhanPendapatan}% vs bulan lalu</div>
            </td>
            <td style="border: none; width: 25%; padding: 6px;">
              <div style="font-size: 11px; color: #64748b;">Total Pengeluaran</div>
              <div style="font-size: 16px; font-weight: bold; color: #dc2626;">${formatRupiah(summary.totalPengeluaran)}</div>
              <div style="font-size: 10px; color: #16a34a;">${summary.penurunanPengeluaran}% efisiensi</div>
            </td>
            <td style="border: none; width: 25%; padding: 6px;">
              <div style="font-size: 11px; color: #64748b;">Laba Bersih (Net Profit)</div>
              <div style="font-size: 16px; font-weight: bold; color: #2563eb;">${formatRupiah(summary.labaBersih)}</div>
              <div style="font-size: 10px; color: #2563eb;">Margin ${summary.marginLaba}%</div>
            </td>
            <td style="border: none; width: 25%; padding: 6px;">
              <div style="font-size: 11px; color: #64748b;">Saldo Kas & Bank</div>
              <div style="font-size: 16px; font-weight: bold; color: #0f172a;">${formatRupiah(summary.saldoKas)}</div>
              <div style="font-size: 10px; color: #64748b;">Likuiditas Aman</div>
            </td>
          </tr>
        </table>
      </div>

      <h2>1. Produk & Penjualan Unggulan (Best Sellers)</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">Peringkat</th>
            <th>Nama Produk / Menu</th>
            <th>Kategori</th>
            <th style="text-align: right;">Volume Terjual</th>
            <th style="text-align: right;">Total Kontribusi Omzet</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>

      <h2>2. Buku Transaksi Kas Terbaru</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tanggal</th>
            <th>Uraian Transaksi</th>
            <th>Kategori Pos</th>
            <th>Nominal</th>
            <th>Metode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <table class="signature-table" style="width: 100%; margin-top: 30px;">
        <tr>
          <td style="width: 50%; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Dipersiapkan oleh:</p>
            <br/><br/><br/>
            <p style="margin: 0; font-weight: bold; font-size: 13px;">Bagian Keuangan & Kasir</p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">Finora Coffee & Eatery</p>
          </td>
          <td style="width: 50%; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Disetujui oleh:</p>
            <br/><br/><br/>
            <p style="margin: 0; font-weight: bold; font-size: 13px;">Pemilik Usaha (Owner UMKM)</p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">Manajemen Finora</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export Annual Report to Excel (.csv)
export const exportAnnualToExcel = (
  annualSummary: any,
  fileName = 'Finora_Rekapitulasi_Tahunan'
) => {
  const escapeCsv = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = ['Bulan', 'Bulan Key', 'Pendapatan (Rp)', 'Pengeluaran (Rp)', 'Laba Bersih (Rp)', 'Margin (%)', 'Status Buku', 'Jumlah Mutasi'];
  
  const rows = annualSummary.rekapBulanan.map((m: any) => [
    escapeCsv(m.bulan),
    escapeCsv(m.bulanKey),
    escapeCsv(m.pendapatan),
    escapeCsv(m.pengeluaran),
    escapeCsv(m.laba),
    escapeCsv(`${m.margin}%`),
    escapeCsv(m.status.toUpperCase()),
    escapeCsv(m.totalMutasi),
  ]);

  const summaryRows = [
    ['REKAPITULASI LAPORAN KEUANGAN TAHUNAN FINORA', ''],
    ['Tahun Buku', escapeCsv(annualSummary.tahun)],
    ['Status Pembukuan', escapeCsv(annualSummary.status.toUpperCase())],
    ['Total Pendapatan Tahunan', escapeCsv(annualSummary.totalPendapatan)],
    ['Total Beban / Pengeluaran Tahunan', escapeCsv(annualSummary.totalPengeluaran)],
    ['Total Laba Bersih Tahunan', escapeCsv(annualSummary.labaBersih)],
    ['Rata-rata Margin Keuntungan', escapeCsv(`${annualSummary.marginRataRata}%`)],
    ['Posisi Saldo Kas Akhir Tahun', escapeCsv(annualSummary.saldoKasAkhir)],
    ['Catatan Manajemen', escapeCsv(annualSummary.catatanTahunan || '-')],
    ['', ''],
  ];

  const csvContent =
    '\ufeff' +
    summaryRows.map((r) => r.join(',')).join('\n') +
    '\n' +
    headers.join(',') +
    '\n' +
    rows.map((e: any[]) => e.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${annualSummary.tahun}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export Annual Report to Word (.doc)
export const exportAnnualToWord = (
  annualSummary: any,
  fileName = 'Finora_Laporan_Pertanggungjawaban_Tahunan'
) => {
  const rowsHtml = annualSummary.rekapBulanan
    .map(
      (m: any) => `
    <tr>
      <td>${m.bulan}</td>
      <td style="text-align: right;">${formatRupiah(m.pendapatan)}</td>
      <td style="text-align: right;">${formatRupiah(m.pengeluaran)}</td>
      <td style="text-align: right; font-weight: bold;">${formatRupiah(m.laba)}</td>
      <td style="text-align: center;">${m.margin}%</td>
      <td style="text-align: center;">${m.status === 'ditutup' ? 'Ditutup Resmi' : m.status === 'berjalan' ? 'Buku Berjalan' : 'Mendatang'}</td>
    </tr>
  `
    )
    .join('');

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Laporan Pertanggungjawaban Keuangan Tahunan UMKM</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; margin: 30px; }
        .kop { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
        .kop h1 { margin: 0; font-size: 20pt; color: #0f172a; }
        .kop p { margin: 2px 0; font-size: 9pt; color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt; }
        th { background-color: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; }
        td { padding: 8px; border: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h1>FINORA — SISTEM KEUANGAN UMKM</h1>
        <p>Kopi & Eatery Nusantara • Laporan Pertanggungjawaban Fiskal Tahunan</p>
        <p>Tahun Buku: ${annualSummary.tahun} • Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <h2>RINGKASAN EKSEKUTIF TAHUN BUKU ${annualSummary.tahun}</h2>
      <table>
        <tr><td style="width: 40%; font-weight: bold;">Total Omzet / Pendapatan Tahunan</td><td style="color: #059669; font-weight: bold;">${formatRupiah(annualSummary.totalPendapatan)}</td></tr>
        <tr><td style="font-weight: bold;">Total Beban & Biaya Operasional</td><td style="color: #e11d48; font-weight: bold;">${formatRupiah(annualSummary.totalPengeluaran)}</td></tr>
        <tr><td style="font-weight: bold;">Laba Bersih Akumulasi Tahunan</td><td style="color: #2563eb; font-weight: bold;">${formatRupiah(annualSummary.labaBersih)}</td></tr>
        <tr><td style="font-weight: bold;">Rata-rata Margin Keuntungan</td><td>${annualSummary.marginRataRata}%</td></tr>
        <tr><td style="font-weight: bold;">Posisi Saldo Kas Akhir Tahun</td><td style="font-weight: bold;">${formatRupiah(annualSummary.saldoKasAkhir)}</td></tr>
      </table>

      <h2 style="margin-top: 25px;">KONSOLIDASI BULANAN (JANUARI - DESEMBER)</h2>
      <table>
        <thead>
          <tr>
            <th>Bulan</th>
            <th>Pendapatan</th>
            <th>Pengeluaran</th>
            <th>Laba Bersih</th>
            <th>Margin</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <table style="width: 100%; margin-top: 40px;">
        <tr>
          <td style="width: 50%; text-align: center; border: none;">
            <p style="margin: 0; font-size: 11pt; color: #64748b;">Dipersiapkan oleh:</p>
            <br/><br/><br/>
            <p style="margin: 0; font-weight: bold;">Bagian Keuangan & Pembukuan</p>
            <p style="margin: 0; font-size: 9pt; color: #64748b;">Finora System</p>
          </td>
          <td style="width: 50%; text-align: center; border: none;">
            <p style="margin: 0; font-size: 11pt; color: #64748b;">Disetujui oleh:</p>
            <br/><br/><br/>
            <p style="margin: 0; font-weight: bold;">Pak Rahman (Owner UMKM)</p>
            <p style="margin: 0; font-size: 9pt; color: #64748b;">Manajemen Finora</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${annualSummary.tahun}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
