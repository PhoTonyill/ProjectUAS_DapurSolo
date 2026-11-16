// Fungsi bantu kecil yang dipakai di seluruh modul admin.

export const MAX_IMAGE_MB = 2;

/** Format angka menjadi Rupiah, contoh: 28000 -> "Rp 28.000". */
export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

/** ID unik sederhana untuk data di sisi klien. */
export const newId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** "Es Teh Manis" -> "es-teh-manis" (dipakai sebagai id menu / alamat /menu/:id). */
export const slugify = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'menu';

/**
 * Membaca file gambar menjadi data URL (base64) supaya bisa langsung
 * ditampilkan tanpa server. Ini hanya simulasi upload.
 */
export function readImageFile(file, maxMB = MAX_IMAGE_MB) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (JPG, PNG, WebP, dll).'));
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      reject(new Error(`Ukuran gambar maksimal ${maxMB} MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}

/** Nama kategori -> id anchor di halaman menu, contoh: "Lauk tambahan" -> "kategori-lauk-tambahan". */
export const categoryAnchor = (name) => `kategori-${slugify(name)}`;

/** Tanggal & jam untuk struk / daftar pesanan, contoh: "12 Nov 2026, 19.30". */
export const formatDateTime = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/** Nomor telepon sederhana: diawali 0 / 62 / +62, total 9-15 angka. Spasi & tanda "-" diabaikan. */
export const isValidPhone = (value) =>
  /^(\+?62|0)\d{8,13}$/.test(String(value).replace(/[\s-]/g, ''));
