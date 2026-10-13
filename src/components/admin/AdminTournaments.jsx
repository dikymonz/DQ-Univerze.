import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  Trophy, Plus, Trash2, Calendar, DollarSign, Gamepad2, Loader2, 
  AlertCircle, Upload, Link as LinkIcon, Edit2, Search, 
  // eslint-disable-next-line no-unused-vars
  ChevronLeft, ChevronRight, X, Image as ImageIcon
} from 'lucide-react';
import { getEmbedUrl } from '../../utils/embed';

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // State Kontrol Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State (Tambah / Edit)
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [gameName, setGameName] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [startDate, setStartDate] = useState('');
  const [rules, setRules] = useState('');
  const [uploadSource, setUploadSource] = useState('file');
  
  // State Dynamic Image Array (Multi Image + Preview)
  const [fileList, setFileList] = useState([]); // List file baru
  const [filePreviews, setFilePreviews] = useState([]); // List Preview URL
  const [externalUrl, setExternalUrl] = useState('');
  const [existingVideoUrl, setExistingVideoUrl] = useState('');

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/tournaments');
      const dataList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setTournaments(dataList);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError('Gagal memuat data turnamen dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTournaments();
  }, [fetchTournaments]);

  // Filter Search
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.game_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tournaments, searchQuery]);

  // Calculation Pagination
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage) || 1;
  const paginatedTournaments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTournaments.slice(start, start + itemsPerPage);
  }, [filteredTournaments, currentPage]);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setGameName('');
    setPrizePool('');
    setStatus('Upcoming');
    setStartDate('');
    setRules('');
    setFileList([]);
    setFilePreviews([]);
    setExternalUrl('');
    setExistingVideoUrl('');
    setUploadSource('file');
    setError('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    resetForm();
    setEditingId(item.id);
    setTitle(item.title);
    setGameName(item.game_name);
    setPrizePool(item.prize_pool);
    setStatus(item.status);
    
    if (item.start_date) {
      const d = new Date(item.start_date);
      const isoString = d.toISOString().slice(0, 16);
      setStartDate(isoString);
    } else {
      setStartDate('');
    }

    setRules(item.rules);
    setExistingVideoUrl(item.video_url || '');

    if (item.video_url?.startsWith('/uploads') || item.images) {
      setUploadSource('file');
    } else if (item.video_url) {
      setUploadSource('link');
      setExternalUrl(item.video_url);
    }

    setIsModalOpen(true);
  };

  // Handler Tambah File Baru ke List
  const handleAddFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...fileList, ...newFiles].slice(0, 5); // Max 5 Gambar
      setFileList(updatedFiles);

      // Generate preview URL
      const previews = updatedFiles.map((f) => URL.createObjectURL(f));
      setFilePreviews(previews);
    }
  };

  // Handler Hapus File dari List berdasarkan index
  const handleRemoveFile = (index) => {
    const updatedFiles = fileList.filter((_, i) => i !== index);
    setFileList(updatedFiles);

    const previews = updatedFiles.map((f) => URL.createObjectURL(f));
    setFilePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('game_name', gameName);
      formData.append('prize_pool', prizePool);
      formData.append('status', status);
      formData.append('start_date', startDate);
      formData.append('rules', rules);

      if (uploadSource === 'file' && fileList.length > 0) {
        fileList.forEach((f) => {
          formData.append('images', f);
        });
      } else {
        formData.append('externalUrl', externalUrl);
      }
      formData.append('existingVideoUrl', existingVideoUrl);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      if (editingId) {
        await axios.put(`http://localhost:5000/api/tournaments/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/tournaments', formData, config);
      }

      setIsModalOpen(false);
      resetForm();
      fetchTournaments();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan turnamen.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus turnamen ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTournaments();
    } catch {
      alert('Gagal menghapus turnamen.');
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto font-mono">
      
      {/* HEADER & ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" /> TOURNAMENT MANAGEMENT
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Kelola pendaftaran, aturan, media carousel, dan jadwal turnamen komunitas Gaming Corner.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase transition cursor-pointer shadow-lg shadow-purple-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Turnamen
        </button>
      </div>

      {/* SEARCH & TABLE / GRID TOURNAMENTS */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
        
        {/* SEARCH BAR & SUMMARY */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider shrink-0">
            Daftar Turnamen Terdaftar ({filteredTournaments.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari turnamen / game..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" /> Memuat data turnamen...
          </div>
        ) : paginatedTournaments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            {searchQuery ? 'Tidak ada turnamen yang cocok dengan pencarian.' : 'Belum ada data turnamen.'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {paginatedTournaments.map((item) => {
              const isLocalUpload = item.video_url?.startsWith('/uploads');
              const fullMediaUrl = isLocalUpload
                ? `http://localhost:5000${item.video_url}`
                : item.video_url;

              const embedUrl = item.video_url ? getEmbedUrl(fullMediaUrl) : null;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 flex flex-col justify-between hover:border-purple-500/50 transition"
                >
                  <div className="space-y-2">
                    
                    {/* MEDIA DISPLAY */}
                    {item.video_url && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 relative">
                        {embedUrl ? (
                          <iframe
                            className="w-full h-full border-0"
                            src={embedUrl}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : item.video_url.endsWith('.mp4') || item.video_url.endsWith('.webm') ? (
                          <video controls src={fullMediaUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={fullMediaUrl} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="flex items-center gap-1 text-purple-400 font-bold uppercase">
                        <Gamepad2 className="w-3.5 h-3.5" /> {item.game_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                        item.status === 'Ongoing'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'Completed'
                          ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-mono">{item.title}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <DollarSign className="w-3.5 h-3.5" /> {item.prize_pool}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(item.start_date).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono line-clamp-2 pt-1 border-t border-white/5">
                      {item.rules}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/5">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black transition cursor-pointer"
                      title="Edit Turnamen"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                      title="Hapus Turnamen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5 font-mono text-xs">
            <span className="text-slate-400">
              Halaman <span className="text-amber-400 font-bold">{currentPage}</span> dari {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL FORM OVERLAY (ADD / EDIT TOURNAMENT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
                {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? 'Edit Data Turnamen' : 'Tambah Turnamen Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Judul Turnamen</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Valorant Community Cup"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Nama Game</label>
                  <input
                    type="text"
                    required
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Contoh: Valorant / Mobile Legends"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Prize Pool</label>
                  <input
                    type="text"
                    required
                    value={prizePool}
                    onChange={(e) => setPrizePool(e.target.value)}
                    placeholder="Contoh: Rp 1.000.000 / 1200 VP"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Tanggal Mulai</label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Rules / Deskripsi</label>
                <textarea
                  rows="3"
                  required
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Aturan turnamen..."
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                />
              </div>

              {/* MEDIA SOURCE TAB */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUploadSource('file')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-2 transition cursor-pointer ${
                      uploadSource === 'file'
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Gambar Carousel
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadSource('link')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase flex items-center gap-2 transition cursor-pointer ${
                      uploadSource === 'link'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Link Embed (YT / TikTok)
                  </button>
                </div>

                {uploadSource === 'file' ? (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    
                    {/* DYNAMIC FILE LIST PREVIEW */}
                    {filePreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {filePreviews.map((previewUrl, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/20 bg-slate-950 group">
                            <img src={previewUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                              title="Hapus gambar ini"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[9px] text-cyan-400 font-bold rounded">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* BUTTON DYNAMIC ADD FILE */}
                    {fileList.length < 5 && (
                      <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/10 text-amber-400 font-bold text-xs cursor-pointer transition">
                        <Plus className="w-4 h-4" />
                        <span>{fileList.length === 0 ? 'Pilih Gambar (Bisa Tambah S.d 5 Gambar)' : 'Tambah Gambar Lain (+)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAddFiles}
                          className="hidden"
                        />
                      </label>
                    )}

                    {existingVideoUrl && existingVideoUrl.startsWith('/uploads') && fileList.length === 0 && (
                      <p className="text-[10px] text-slate-500 font-mono">
                        File terpasang saat ini: <span className="text-amber-400">{existingVideoUrl}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <label className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                      URL Video (YouTube / TikTok)
                    </label>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-lg shadow-purple-600/30 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {submitting ? 'Menyimpan...' : editingId ? 'Update Turnamen' : 'Publish Turnamen'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}