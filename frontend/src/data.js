export const staticProducts = [
  { id: 1, brand: "Wardah", kategori: "Serum", nama_produk: "Lightening Serum Ampoule", harga: 78000, image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=500" },
  { id: 2, brand: "Wardah", kategori: "Serum", nama_produk: "Renew You Anti Aging Serum", harga: 119000, image_url: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500" },
  { id: 3, brand: "Wardah", kategori: "Cleanser", nama_produk: "Perfect Bright Creamy Foam", harga: 28000, image_url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500" },
  { id: 4, brand: "Wardah", kategori: "Lip Makeup", nama_produk: "Colorfit Velvet Matte Lip Mousse", harga: 73000, image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500" }
];

export const staticCategories = [
  { name: "Serum", image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600" },
  { name: "Cleanser", image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600" },
  { name: "Moisturizer", image_url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600" },
  { name: "Lip Makeup", image_url: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600" },
  { name: "Face Makeup", image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600" },
  { name: "Sunscreen", image_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600" },
  { name: "Haircare", image_url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800" },
];

export const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
};