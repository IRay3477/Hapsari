import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { staticCategories } from '../data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?search=${keyword}`);
      setKeyword(''); 
      setIsMenuOpen(false); 
    }
  };

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* KIRI: Hamburger (Mobile) & Links (Desktop) */}
          <div className="flex-1 flex items-center justify-start">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-[#D18C7E]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            
            <div className="hidden md:flex space-x-8 text-xs uppercase tracking-[0.15em] font-medium text-gray-600 items-center">
              <Link to="/" className="hover:text-[#D18C7E] transition duration-300">Home</Link>
              <Link to="/shop" className="hover:text-[#D18C7E] transition duration-300">Shop</Link>
              
              <div className="relative group py-8">
                <button className="hover:text-[#D18C7E] transition duration-300 flex items-center gap-1 uppercase">
                  Categories
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-[#D18C7E] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-50 transform origin-top scale-95 group-hover:scale-100">
                  {staticCategories.map(cat => (
                    <Link key={cat.name} to={`/shop?category=${cat.name}`} className="text-left px-5 py-3 text-[10px] tracking-widest hover:bg-[#F9F6F5] hover:text-[#D18C7E] border-b border-gray-50 last:border-0 transition">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/#about" className="hover:text-[#D18C7E] transition duration-300">About</Link>
            </div>
          </div>

          {/* TENGAH: Logo */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link to="/" className="text-2xl md:text-3xl font-light tracking-[0.25em] text-[#D18C7E]">
              HAPSARI COSMETIC
            </Link>
          </div>

          {/* KANAN: Search (Icon Bag Dihapus) */}
          <div className="flex-1 flex items-center justify-end space-x-4 md:space-x-6">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-300 rounded px-3 py-1 w-64">
              <input type="text" placeholder="Cari produk..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="outline-none text-sm w-full bg-transparent"/>
              <button type="submit" className="text-gray-500 hover:text-[#D18C7E] ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
            
            <button className="md:hidden p-2 text-gray-600 hover:text-[#D18C7E]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full z-40 shadow-xl pb-4">
          <form onSubmit={handleSearchSubmit} className="px-4 pt-4 pb-2">
            <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 focus-within:border-[#D18C7E]">
              <input type="text" placeholder="Cari produk..." className="w-full text-xs bg-transparent focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="submit"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
            </div>
          </form>
          <div className="px-4 space-y-2 flex flex-col text-sm uppercase tracking-[0.1em] text-gray-600">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 hover:bg-[#F9F6F5] hover:text-[#D18C7E] rounded">Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 hover:bg-[#F9F6F5] hover:text-[#D18C7E] rounded">Shop</Link>
            
            <div>
              <button onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)} className="w-full flex justify-between items-center px-3 py-3 hover:bg-[#F9F6F5] hover:text-[#D18C7E] rounded uppercase">
                Categories
                <svg className={`w-4 h-4 transition duration-300 ${isMobileCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isMobileCategoryOpen && (
                <div className="bg-gray-50 flex flex-col pl-6 pr-3 py-2 rounded-b space-y-1">
                  {staticCategories.map(cat => (
                    <Link key={cat.name} to={`/shop?category=${cat.name}`} onClick={() => setIsMenuOpen(false)} className="block py-2 text-xs hover:text-[#D18C7E]">{cat.name}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 hover:bg-[#F9F6F5] hover:text-[#D18C7E] rounded">About</Link>
          </div>
        </div>
      )}
    </nav>
  );
}