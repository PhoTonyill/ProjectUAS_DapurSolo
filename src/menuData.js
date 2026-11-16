// Data menu awal. Isi `ingredients` sama dengan kolom "Komponen / Isian" pada tabel
// di halaman Menu, dan `category` menentukan di tabel mana menu itu tampil.
// Setelah dashboard admin dipakai, data menu disimpan di localStorage dan
// file ini hanya menjadi data awal.
//
// Catatan: baru 3 foto yang tersedia (Makanan 1-3), jadi menu baru memakai foto
// itu sementara. Ganti lewat Admin > Manajemen Menu > Edit.
const FOTO = ['/ProjectUAS_DapurSolo/Gambar/Makanan 1.png', '/ProjectUAS_DapurSolo/Gambar/Makanan 2.png', '/ProjectUAS_DapurSolo/Gambar/Makanan 3.png'];

export const MENU_ITEMS = [
  // ---------------------------------------------------------------- MAKANAN
  {
    id: 'nasi-langgi',
    category: 'Makanan',
    name: 'Nasi Langgi',
    image: FOTO[0],
    price: 42000,
    description:
      'Nasi putih atau kuning dengan empal sapi goreng, kentang balado, kering tempe, telur dadar, serundeng, abon sapi, dan sambal terasi.',
    ingredients: [
      'Nasi dengan empal sapi goreng',
      'Kentang balado',
      'Kering tempe manis',
      'Irisan telur dadar',
      'Kelapa parut sangrai (serundeng)',
      'Abon sapi',
      'Sambal terasi',
    ],
    allergens: 'Mengandung telur, kedelai, gluten, dan seafood (udang pada sambal terasi).',
  },
  {
    id: 'nasi-liwet',
    category: 'Makanan',
    name: 'Nasi Liwet Solo',
    image: FOTO[1],
    price: 'Rp35.000',
    description:
      'Nasi gurih bersantan dengan suwiran ayam, telur pindang, sayur labu siam, dan saus areh.',
    ingredients: [
      'Nasi dimasak dengan santan',
      'Suwiran ayam',
      'Telur rebus berbumbu (pindang)',
      'Sayur labu siam berkuah',
      'Saus areh (santan kental)',
    ],
    allergens: 'Mengandung telur dan santan.',
  },
  {
    id: 'gudeg',
    category: 'Makanan',
    name: 'Nasi Gudeg Jogja',
    image: FOTO[2],
    price: 'Rp38.000',
    description:
      'Nasi dengan gudeg nangka muda, krecek pedas, ayam kampung, dan telur pindang.',
    ingredients: [
      'Nasi dengan sayur nangka muda masak manis',
      'Sayur kulit sapi pedas (krecek)',
      'Ayam kampung',
      'Telur pindang',
    ],
    allergens: 'Berpotensi mengandung telur dan kedelai.',
  },
  {
    id: 'selat-solo',
    category: 'Makanan',
    name: 'Selat Solo',
    image: FOTO[1],
    price: 'Rp40.000',
    description:
      'Bistik sapi dengan kuah manis gurih, telur rebus, kentang, sayuran, dan saus mustard Jawa.',
    ingredients: [
      'Bistik daging sapi saus encer manis-gurih',
      'Telur rebus',
      'Kentang goreng',
      'Buncis',
      'Wortel',
      'Selada',
      'Saus mustard Jawa',
    ],
    allergens: 'Mengandung telur, kedelai, dan gluten.',
  },
  {
    id: 'timlo-solo',
    category: 'Makanan',
    name: 'Timlo Solo',
    image: FOTO[0],
    price: 'Rp35.000',
    description:
      'Sup kaldu bening khas Solo dengan sosis Solo, telur pindang, ati ampela, dan mi soun.',
    ingredients: [
      'Kuah kaldu bening',
      'Sosis Solo (daging ayam dibalut kulit dadar telur)',
      'Telur pindang',
      'Ati ampela',
      'Mi soun',
    ],
    allergens: 'Mengandung telur, gluten, dan kedelai.',
  },
  {
    id: 'pecel-madiun',
    category: 'Makanan',
    name: 'Nasi Pecel Madiun',
    image: FOTO[2],
    price: 'Rp25.000',
    description:
      'Nasi dengan aneka sayuran rebus, saus kacang tanah, dan rempeyek renyah.',
    ingredients: [
      'Nasi dengan aneka sayur mayur rebus',
      'Saus bumbu kacang tanah giling',
      'Rempeyek',
    ],
    allergens: 'Mengandung kacang tanah; rempeyek dapat mengandung udang rebon.',
  },
  {
    id: 'lontong-solo',
    category: 'Makanan',
    name: 'Lontong Solo',
    image: FOTO[0],
    price: 'Rp30.000',
    description:
      'Potongan lontong dengan kuah santan opor ayam, sayur labu siam, dan telur rebus.',
    ingredients: [
      'Potongan lontong beras',
      'Kuah santan opor ayam kuning',
      'Sayur labu siam',
      'Telur rebus',
    ],
    allergens: 'Mengandung telur dan santan.',
  },

  // ---------------------------------------------------------------- MINUMAN
  {
    id: 'es-dawet',
    category: 'Minuman',
    name: 'Es Dawet / Cendol',
    image: FOTO[1],
    price: 18000,
    description:
      'Minuman dingin khas Jawa dengan dawet hijau, nangka, kuah santan, dan cairan gula merah.',
    ingredients: [
      'Adonan tepung beras / sagu hijau',
      'Buah nangka',
      'Kuah santan',
      'Cairan gula merah',
    ],
    allergens: 'Mengandung santan; bebas susu sapi.',
  },
  {
    id: 'wedang-ronde',
    category: 'Minuman',
    name: 'Wedang Ronde',
    image: FOTO[2],
    price: 16000,
    description:
      'Wedang jahe hangat manis dengan bola-bola ketan berisi kacang tanah tumbuk.',
    ingredients: [
      'Kuah jahe panas manis',
      'Bola-bola tepung ketan isi kacang tanah tumbuk',
    ],
    allergens: 'Mengandung kacang tanah.',
  },
  {
    id: 'es-campur',
    category: 'Minuman',
    name: 'Es Campur / Es Teler',
    image: FOTO[0],
    price: 22000,
    description:
      'Es segar berisi nangka, alpukat, kelapa muda, dan agar-agar dengan sirup serta susu kental manis.',
    ingredients: [
      'Nangka',
      'Alpukat',
      'Daging kelapa muda',
      'Agar-agar',
      'Es batu + sirup + susu kental manis',
    ],
    allergens: 'Mengandung susu sapi / dairy (susu kental manis).',
  },
  {
    id: 'teh-poci',
    category: 'Minuman',
    name: 'Teh Poci',
    image: FOTO[1],
    price: 12000,
    description: 'Teh melati asli yang diseduh dalam poci tanah liat, disajikan dengan gula batu.',
    ingredients: ['Seduhan daun teh melati asli', 'Bongkahan gula batu'],
    allergens: 'Tidak ada alergen utama.',
  },

  // ---------------------------------------------------------------- CAMILAN
  {
    id: 'sosis-solo',
    category: 'Camilan',
    name: 'Sosis Solo (Goreng/Kukus)',
    image: FOTO[0],
    price: 12000,
    description:
      'Daging ayam giling berbumbu manis yang dibalut kulit dadar tipis, digoreng atau dikukus.',
    ingredients: [
      'Daging ayam giling berbumbu manis',
      'Kulit dadar tipis',
      'Pilihan: digoreng atau dikukus',
    ],
    allergens: 'Mengandung telur, gandum/gluten (kulit dadar), dan kedelai (kecap pada ayam).',
  },
  {
    id: 'tempe-mendoan',
    category: 'Camilan',
    name: 'Tempe Mendoan',
    image: FOTO[2],
    price: 15000,
    description:
      'Irisan tempe lebar dalam adonan tepung dan daun bawang, digoreng sebentar hingga lembek.',
    ingredients: [
      'Irisan tempe lebar',
      'Adonan tepung terigu dan daun bawang',
      'Digoreng sebentar (lembek / mendo)',
    ],
    allergens: 'Mengandung kedelai (tempe) dan gandum/gluten (adonan tepung).',
  },
  {
    id: 'bakwan-jagung',
    category: 'Camilan',
    name: 'Bakwan Jagung',
    image: FOTO[1],
    price: 12000,
    description: 'Pipilan jagung manis dalam adonan tepung berbumbu, digoreng kering dan renyah.',
    ingredients: [
      'Pipilan jagung manis',
      'Adonan tepung dan bumbu',
      'Digoreng kering dan renyah',
    ],
    allergens: 'Mengandung gandum/gluten (tepung terigu) dan telur (pengikat adonan).',
  },
  {
    id: 'pisang-goreng',
    category: 'Camilan',
    name: 'Pisang Goreng',
    image: FOTO[0],
    price: 15000,
    description: 'Pisang kepok pilihan dibalut adonan tepung manis yang krispi.',
    ingredients: ['Buah pisang kepok pilihan', 'Balutan adonan tepung manis krispi'],
    allergens: 'Mengandung gandum/gluten (adonan tepung).',
  },

  // ---------------------------------------------------------- LAUK TAMBAHAN
  {
    id: 'empal-goreng',
    category: 'Lauk tambahan',
    name: 'Empal Goreng',
    image: FOTO[0],
    price: 22000,
    description: 'Daging sapi empuk yang diungkep bumbu ketumbar dan gula merah, lalu digoreng gurih.',
    ingredients: [
      'Potongan daging sapi empuk',
      'Rebusan bumbu ketumbar dan gula merah',
      'Digoreng gurih',
    ],
    allergens: 'Umumnya aman; berpotensi mengandung kedelai jika memakai sedikit kecap saat diungkep.',
  },
  {
    id: 'ayam-kalasan',
    category: 'Lauk tambahan',
    name: 'Ayam Goreng Kalasan / Bakar',
    image: FOTO[1],
    price: 24000,
    description: 'Ayam potong pilihan diungkep bumbu manis air kelapa, digoreng atau dibakar madu/kecap.',
    ingredients: [
      'Daging ayam potong pilihan',
      'Ungkep bumbu manis air kelapa',
      'Pilihan: digoreng atau dibakar madu/kecap',
    ],
    allergens: 'Mengandung kedelai dan gluten (marinasi kecap manis pada varian bakar).',
  },
  {
    id: 'tahu-tempe-bacem',
    category: 'Lauk tambahan',
    name: 'Tahu & Tempe Bacem',
    image: FOTO[2],
    price: 10000,
    description: 'Tahu dan tempe yang direbus dalam bumbu gula merah dan rempah pekat, digoreng sebentar.',
    ingredients: [
      'Tahu dan tempe potong',
      'Rebusan bumbu gula merah dan rempah pekat',
      'Digoreng sebentar',
    ],
    allergens: 'Mengandung kedelai (bahan utama).',
  },
  {
    id: 'sambal-goreng-krecek',
    category: 'Lauk tambahan',
    name: 'Sambal Goreng Krecek',
    image: FOTO[2],
    price: 18000,
    description: 'Kerupuk kulit sapi lumer dalam kuah santan pedas gurih dengan cabai rawit utuh.',
    ingredients: ['Kerupuk kulit sapi lumer', 'Kuah santan pedas gurih', 'Cabai rawit utuh'],
    allergens: 'Mengandung santan dan bumbu cabai yang kuat; tidak ada alergen utama lain.',
  },
  {
    id: 'sate-puyuh-ati',
    category: 'Lauk tambahan',
    name: 'Sate Telur Puyuh & Ati Ampela',
    image: FOTO[1],
    price: 14000,
    description: 'Telur puyuh rebus dan ati ampela ayam dalam bumbu baceman manis gurih, ditusuk sate.',
    ingredients: [
      'Telur puyuh rebus',
      'Ati ampela ayam',
      'Bumbu baceman manis gurih ditusuk sate',
    ],
    allergens: 'Mengandung telur dan kedelai (bumbu baceman).',
  },
  {
    id: 'telur-pindang-dadar',
    category: 'Lauk tambahan',
    name: 'Telur Pindang / Telur Dadar Iris',
    image: FOTO[0],
    price: 8000,
    description: 'Pilihan telur rebus rempah (pindang) atau telur dadar iris tipis.',
    ingredients: [
      'Pilihan: telur rebus rempah (pindang)',
      'Pilihan: telur kocok dadar iris tipis',
    ],
    allergens: 'Mengandung telur.',
  },
  {
    id: 'kerupuk-emping-rempeyek',
    category: 'Lauk tambahan',
    name: 'Kerupuk Udang, Emping, & Rempeyek',
    image: FOTO[2],
    price: 8000,
    description: 'Aneka pelengkap renyah: kerupuk udang, emping melinjo, dan rempeyek gurih.',
    ingredients: [
      'Kerupuk udang renyah',
      'Emping melinjo gurih',
      'Rempeyek gurih (kacang tanah / rebon)',
    ],
    allergens: 'Mengandung seafood/udang (kerupuk udang) dan kacang tanah (rempeyek).',
  },
];
