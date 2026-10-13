import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, ExternalLink, Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Jumlah produk per halaman

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/shop');
      setItems(res.data);
    } catch (err) {
      console.error('Gagal memuat data shop:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter berdasarkan kategori dan pencarian nama produk
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Logika Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Reset halaman ke 1 saat kategori atau pencarian berubah
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pb-24 px-4 md:px-8 max-w-7xl mx-auto space-y-10 font-mono">
      
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="text-xs font-bold tracking-widest text-cyan-400 uppercase mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> COMMUNITY STORE
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-wider">
            ROBLOX & MERCH STORE
          </h1>
        </div>

        {/* Kotak Pencarian */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari item atau merch..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 transition shadow-inner"
          />
        </div>
      </div>

      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Roblox', 'Merchandise', 'Digital Item'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 font-black' 
                : 'bg-slate-900/80 text-slate-300 border border-white/10 hover:border-cyan-400/40 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Produk / Skeleton Loading */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-3xl bg-slate-900/60 border border-white/5 p-5 space-y-4 animate-pulse">
              <div className="h-56 w-full bg-slate-800 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-8 bg-slate-800 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/80 border border-white/5 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">Tidak ada produk yang ditemukan.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div 
                key={item.id}
                className="rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Container Gambar (Menggunakan object-contain dan padding agar gambar tidak terpotong) */}
                  <div className="relative h-60 w-full bg-slate-950/80 overflow-hidden border-b border-white/10 flex items-center justify-center p-4">
                    {item.image_url ? (
                      <img 
                        src={`http://localhost:5000${item.image_url}`} 
                        alt={item.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-500 drop-shadow-md"
                      />
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center gap-2">
                        <ShoppingBag className="w-10 h-10" />
                        <span className="text-[10px]">No Image</span>
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-400/30 rounded-full shadow">
                      {item.category}
                    </span>
                  </div>

                  {/* Detail Teks */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-sm font-black text-white tracking-wide truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans leading-relaxed">
                      {item.description || 'Tidak ada deskripsi produk.'}
                    </p>
                  </div>
                </div>

                {/* Harga & Tombol View Item */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Harga</div>
                    <div className="text-xs font-black text-emerald-400">
                      {item.category === 'Roblox' ? `${item.price} Robux` : `Rp ${Number(item.price).toLocaleString('id-ID')}`}
                    </div>
                  </div>

                  <a 
                    href={item.item_url || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="no-underline"
                  >
                    <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 uppercase bg-cyan-400 hover:bg-cyan-300 rounded-xl transition shadow-lg shadow-cyan-400/20 cursor-pointer">
                      View Item <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </a>
                </div>

              </div>
            ))}
          </div>

          {/* Navigasi Paginasi */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/10 text-xs">
              <div className="text-slate-400">
                Menampilkan halaman <span className="text-white font-bold">{currentPage}</span> dari <span className="text-white font-bold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white hover:border-cyan-400/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="hidden sm:flex gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl font-bold transition cursor-pointer ${
                        currentPage === page
                          ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                          : 'bg-slate-900 border border-white/10 text-slate-300 hover:border-cyan-400/40'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white hover:border-cyan-400/40 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}