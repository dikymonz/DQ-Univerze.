import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, X, Loader2, ShoppingBag, Upload, ExternalLink } from 'lucide-react';

export default function AdminShop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Roblox',
    item_url: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/shop');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching shop items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || 'Roblox',
        item_url: item.item_url || '',
        image: null
      });
      // Menampilkan preview gambar yang sudah ada di database dengan URL lengkap backend
      setImagePreview(item.image_url ? `http://localhost:5000${item.image_url}` : null);
    } else {
      setEditId(null);
      setForm({
        name: '',
        description: '',
        price: '',
        category: 'Roblox',
        item_url: '',
        image: null
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('item_url', form.item_url);
    
    // Pastikan key file adalah 'image' agar terbaca oleh middleware multer di backend
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/admin/shop/${editId}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Produk berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/admin/shop', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Produk berhasil ditambahkan!');
      }
      handleCloseModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan produk.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/shop/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus produk.');
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900/80 border border-white/10">
        <div>
          <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Manajemen Toko & Merchandise
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Kelola katalog item Roblox dan produk fisik komunitas</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-wider hover:bg-amber-400 transition cursor-pointer text-xs shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Daftar Katalog Produk ({items.length})
        </h3>

        {loading ? (
          <div className="text-center py-16 text-amber-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Memuat data...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl">
            Belum ada produk tersimpan di database.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  {/* Menampilkan Gambar dengan URL server backend */}
                  <img 
                    src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/60'} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 bg-slate-800" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-md uppercase">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                    <p className="text-[11px] font-black text-emerald-400">
                      {item.category === 'Roblox' ? `${item.price} Robux` : `Rp ${Number(item.price).toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <a href={item.item_url || '#'} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]">
                    Link Item <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 md:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" /> {editId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Produk:</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: 1,000 Robux / Official Hoodie"
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Harga (Angka):</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="100 atau 150000"
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Kategori:</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Roblox">Roblox</option>
                    <option value="Merchandise">Merchandise</option>
                    <option value="Digital Item">Digital Item</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">URL Redirect Item (Tombol View Item):</label>
                <input
                  type="text"
                  value={form.item_url}
                  onChange={(e) => setForm({ ...form, item_url: e.target.value })}
                  placeholder="https://roblox.com/... atau link toko"
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Upload Gambar Produk:</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-black/60 border border-dashed border-white/20 text-slate-300 hover:border-amber-400 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="truncate max-w-50">{form.image ? form.image.name : 'Pilih file gambar...'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0 bg-slate-800" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Deskripsi:</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat produk..."
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white outline-none focus:border-amber-400 resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-wider hover:bg-amber-400 transition cursor-pointer shadow-lg shadow-amber-500/20">
                  {editId ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}