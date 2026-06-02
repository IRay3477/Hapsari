import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { staticProducts, staticCategories, formatRupiah } from '../data';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentCategory, searchQuery]);

  let filteredProducts = staticProducts;

  if (currentCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.kategori === currentCategory);
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.nama_produk.toLowerCase().includes(lowerQuery) || 
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.kategori.toLowerCase().includes(lowerQuery)
    );
  }

  let headerTitle = currentCategory === 'All' ? 'All Products' : currentCategory;
  if (searchQuery) {
    headerTitle = `Results for "${searchQuery}"`;
  }

  return (
    <div className="flex-grow bg-white px-6 py-10 w-full min-h-[60vh]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase text-[#1A1A1A]">{headerTitle}</h1>
          <div className="w-12 h-[1px] bg-[#D18C7E] mx-auto mt-4"></div>
        </div>

        {!searchQuery && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button onClick={() => setSearchParams({})} className={`text-xs uppercase tracking-widest pb-1 border-b-2 transition ${currentCategory === 'All' ? 'border-[#D18C7E] text-[#D18C7E] font-medium' : 'border-transparent text-gray-500 hover:text-[#1A1A1A]'}`}>
              All
            </button>
            {staticCategories.map(cat => (
              <button key={cat.name} onClick={() => setSearchParams({ category: cat.name })} className={`text-xs uppercase tracking-widest pb-1 border-b-2 transition ${currentCategory === cat.name ? 'border-[#D18C7E] text-[#D18C7E] font-medium' : 'border-transparent text-gray-500 hover:text-[#1A1A1A]'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {searchQuery && (
           <div className="text-center mb-12">
             <button onClick={() => setSearchParams({})} className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-[#D18C7E] underline">
               Clear Search & View All
             </button>
           </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-[#F9F6F5] overflow-hidden mb-4 relative shadow-sm">
                <img src={product.image_url} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <span className="absolute top-3 left-3 bg-white/90 text-[9px] uppercase font-bold tracking-widest px-2 py-1 text-[#D18C7E]">{product.kategori}</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em] mb-1">{product.brand}</p>
                <h3 className="text-sm font-light text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-[#D18C7E] transition px-2">{product.nama_produk}</h3>
                <p className="text-sm font-medium text-[#1A1A1A] mt-2">{formatRupiah(product.harga)}</p>
                <button className="w-full mt-4 border border-gray-300 bg-white text-[#1A1A1A] text-[10px] uppercase tracking-[0.2em] py-3 hover:border-[#D18C7E] hover:bg-[#D18C7E] hover:text-white transition duration-300">
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="text-sm tracking-widest uppercase">Oops, produk tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}