import React, { useEffect, useState } from 'react'; // Tambahkan useState
import { useNavigate, useLocation } from 'react-router-dom';
import { staticCategories, formatRupiah } from '../data'; // Hapus staticProducts

export default function Home() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  
  // 1. Buat wadah untuk menampung data dari database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fungsi untuk menarik data dari Django saat halaman dimuat
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(response => response.json())
      .then(data => {
        setProducts(data); // Masukkan data dari database ke wadah
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Logika scroll untuk kategori (biarkan seperti aslinya)
  useEffect(() => {
    if (hash === '#categories') {
      const element = document.getElementById('categories');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="flex-grow">
      {/* HERO SECTION */}
      <section className="relative w-full h-[calc(100vh-80px)] flex items-center overflow-hidden -mb-[1px] z-10">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1600" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent w-full md:w-3/4"></div>
        </div>
        <div className="relative z-10 w-full px-8 md:px-16 max-w-7xl mx-auto flex flex-col items-start text-left">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#D18C7E] font-bold mb-4">Koleksi Terbaru</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-[#1A1A1A] mb-6 leading-tight max-w-xl">
            Tampil Cantik <br/> 
            <span className="italic font-serif text-[#D18C7E]">Alami & Elegan</span> <br/>
            Bersama <span className="font-medium tracking-widest">HAPSARI</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-8 max-w-sm">
            Rangkaian kosmetik premium yang dirancang khusus untuk memancarkan pesona aslimu setiap hari.
          </p>
          <button onClick={() => navigate('/shop')} className="bg-[#D18C7E] text-white text-xs uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#B5786B] transition duration-300">
            Shop Now
          </button>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-[#F9F6F5] px-6 py-20 w-full relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase">Best Sellers</h2>
            <div className="w-10 h-[1px] bg-[#D18C7E] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {/* Tampilkan teks loading jika data belum selesai ditarik */}
            {loading ? (
              <p className="text-center col-span-4 py-10">Memuat produk Hapsari...</p>
            ) : (
              /* Gunakan state 'products' yang asli dari database, bukan staticProducts */
              products.slice(0, 4).map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  {/* ... isi card biarkan sama persis seperti aslinya ... */}
                  <div className="aspect-[4/5] bg-white overflow-hidden mb-4 relative shadow-sm border border-white">
                    <img src={product.image_url} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <span className="absolute top-3 left-3 bg-white/90 text-[9px] uppercase font-bold tracking-widest px-2 py-1 text-[#D18C7E]">{product.kategori}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] mb-1">{product.brand}</p>
                    <h3 className="text-sm font-light text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-[#D18C7E] transition px-2">{product.nama_produk}</h3>
                    <p className="text-sm font-medium text-[#1A1A1A] mt-2">{formatRupiah(product.harga)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-12">
             <button onClick={() => navigate('/shop')} className="border border-[#1A1A1A] text-[#1A1A1A] text-xs uppercase tracking-widest px-8 py-3 hover:bg-[#1A1A1A] hover:text-white transition">
                View All Products
             </button>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section id="categories" className="bg-white px-6 py-20 w-full relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-[#D18C7E]">Shop By Category</h2>
            <div className="w-10 h-[1px] bg-[#D18C7E] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {staticCategories.map((cat) => (
              <div key={cat.name} onClick={() => navigate(`/shop?category=${cat.name}`)} className="relative group cursor-pointer overflow-hidden rounded-md aspect-square md:aspect-[4/3] bg-gray-100">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-lg md:text-2xl font-semibold tracking-[0.25em] uppercase drop-shadow-md">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}