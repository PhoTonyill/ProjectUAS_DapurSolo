// Data awal dashboard. Menu diambil dari menuData.js milik proyek Anda, jadi
// tampilan situs tidak berubah sampai admin mengubahnya.
//
// Letak file: src/admin/data/initialData.js  ->  menuData.js ada di src/
import { MENU_ITEMS } from '../../menuData.js';

// Harga di menuData.js campuran (42000 dan 'Rp35.000'); di sini dijadikan angka.
const toNumber = (price) => Number(String(price).replace(/\D/g, '')) || 0;

// Kategori awal. Admin bisa menambah, mengubah nama, dan menghapus kategori
// lewat Admin > Kategori; daftar yang berlaku disimpan di localStorage.
export const DEFAULT_CATEGORIES = ['Makanan', 'Minuman', 'Camilan', 'Lauk tambahan'];

export const initialMenus = MENU_ITEMS.map((item) => ({
  ...item,
  price: toNumber(item.price),
  category: item.category || 'Makanan',
  ingredients: item.ingredients || [],
  allergens: item.allergens || '',
}));

export const initialGallery = [
  { id: 'g1', title: 'Suasana Restoran Pria Solo', src: '/ProjectUAS_DapurSolo/Gambar/Pria solo (2).jpg' },
  { id: 'g2', title: 'Hidangan khas 1', src: '/ProjectUAS_DapurSolo/Gambar/Makanan 1.png' },
  { id: 'g3', title: 'Hidangan khas 2', src: '/ProjectUAS_DapurSolo/Gambar/Makanan 2.png' },
  { id: 'g4', title: 'Hidangan khas 3', src: '/ProjectUAS_DapurSolo/Gambar/Makanan 3.png' },
];

// Isi awal sama dengan teks di HomePage (bagian Cerita Kami & Kontak).
export const initialAbout = {
  story:
    'Restoran Pria Solo berdiri sejak tahun 2020, saat sang pendiri kembali ke Solo setelah ' +
    'lama merantau. Restoran ini didirikan oleh Bapak Slamet Wibowo, dengan tujuan menghadirkan ' +
    'cita rasa autentik khas Solo kepada semua orang.\n\n' +
    'Restoran ini dinamakan "Pria Solo" karena seluruh pegawai di restoran ini merupakan orang ' +
    'Solo asli. Maka dari itu, kami sebagai Pria Solo dapat menciptakan cita rasa yang autentik ' +
    'dan khas dengan cita rasa Solo.',
  address:
    'Universitas Tarumanagara Kampus 1\nJl. Letjen S. Parman No. 1\nJakarta Barat, DKI Jakarta 11440',
  instagram: 'restoranpriasolo',
  tiktok: 'restoranpriasolo',
  phone: '',
  email: '',
};
