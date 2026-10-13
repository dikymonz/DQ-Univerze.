import { useEffect, useState } from 'react';
import axios from 'axios';
import { Crown, Plus, Edit2, Trash2, Save, X, Loader2, DollarSign, UserCheck } from 'lucide-react';

export default function AdminDonators() {
  const [donators, setDonators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: null, discord_id: '', amount: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDonators();
  }, []);

  const fetchDonators = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/donators');
      if (res.data?.success) {
        setDonators(res.data.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data donatur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.discord_id || !formData.amount) return alert('Semua kolom wajib diisi!');

    setSubmitting(true);
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/donators/${formData.id}`, formData);
        alert('Data donatur berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/donators', formData);
        alert('Donatur baru berhasil ditambahkan!');
      }

      resetForm();
      fetchDonators();
    } catch (err) {
      console.error('Gagal menyimpan data:', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      discord_id: item.discord_id,
      amount: item.amount,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus donatur ini?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/donators/${id}`);
      fetchDonators();
    } catch (err) {
      console.error('Gagal menghapus:', err);
      alert('Gagal menghapus donatur.');
    }
  };

  const resetForm = () => {
    setFormData({ id: null, discord_id: '', amount: '' });
    setIsEditing(false);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Crown className="w-3.5 h-3.5" /> DONATOR MANAGEMENT
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            MANAJEMEN <span className="text-amber-400">TOP DONATUR</span>
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* FORM */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-white/10 rounded-2xl p-5 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-white/10 pb-3">
            {isEditing ? <Edit2 className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-cyan-400" />}
            {isEditing ? 'Edit Donatur' : 'Tambah Donatur'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block">DISCORD USER ID</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: 123456789012345678"
                  value={formData.discord_id}
                  onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold block">NOMINAL DONASI (IDR)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  placeholder="Contoh: 250000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isEditing ? 'UPDATE' : 'SIMPAN'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABEL LIST */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide border-b border-white/10 pb-3">
            DAFTAR DONATUR TERDAFTAR
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              <span>Memuat data...</span>
            </div>
          ) : donators.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">Belum ada donatur terdaftar.</div>
          ) : (
            <div className="space-y-3">
              {donators.map((item, index) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-900/60 border border-white/5 rounded-xl hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>

                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                      <img src={item.avatar} alt={item.username} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">{item.username}</h4>
                      <span className="text-[10px] text-slate-500">ID: {item.discord_id}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <span className="text-xs font-black text-amber-400">{formatCurrency(item.amount)}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}