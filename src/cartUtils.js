export const parsePrice = (price) => Number(String(price).replace(/\D/g, ''));

export const formatRupiah = (value) =>
  'Rp ' + Number(value).toLocaleString('id-ID');
