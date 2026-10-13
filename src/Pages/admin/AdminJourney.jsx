import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Link as LinkIcon, Upload, Image, Video, Calendar, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function AdminJourney() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [uploadSource, setUploadSource] = useState('file'); // 'file' | 'link'
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video' | 'embed'
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/journeys');
      if (res.data.success) setJourneys(res.data.data);
    } catch {
      setError('Gagal memuat data journey.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('eventDate', eventDate);
      formData.append('mediaType', uploadSource === 'link' ? 'embed' : mediaType);

      if (uploadSource === 'file' && file) {
        formData.append('mediaFile', file);
      } else {
        formData.append('externalUrl', externalUrl);
      }

      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/journeys', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        // Reset Form
        setTitle('');
        setDescription('');
        setEventDate('');
        setFile(null);
        setExternalUrl('');
        fetchJourneys();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan log journey.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus journey ini?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/journeys/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJourneys();
    } catch {
      alert('Gagal menghapus log.');
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> JOURNEY & EVENT LOG MANAGER
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Kelola rekam jejak, kegiatan, dan momen dokumentasi komunitas Gaming Corner.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* FORM INPUT JOURNEY */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 space-y-5">
        <h3 className="text-sm font-bold text-amber-400 uppercase font-mono flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Log Kegiatan Baru
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Judul Kegiatan / Event</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Community Tournament Season 1"
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Tanggal Event</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Deskripsi Ringkas</label>
          <textarea
            rows="3"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan momen seru atau keseruan acara..."
            className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* TAB OPSIONAL MEDIA: UPLOAD FILE vs LINK EXTERNAL */}
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
              <Upload className="w-3.5 h-3.5" /> Upload File Lokal
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
              <LinkIcon className="w-3.5 h-3.5" /> Link Media (YT / TikTok / IG)
            </button>
          </div>

          {/* INPUT JIKA PILIH FILE UPLOAD */}
          {uploadSource === 'file' ? (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                  />
                  <Image className="w-3.5 h-3.5 text-amber-400" /> Gambar
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                  />
                  <Video className="w-3.5 h-3.5 text-purple-400" /> Video (MP4)
                </label>
              </div>

              <input
                type="file"
                required
                accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-xs text-slate-400 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
              />
            </div>
          ) : (
            /* INPUT JIKA PILIH LINK EXTERNAL */
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <label className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                URL Video / Post (YouTube, TikTok, Instagram)
              </label>
              <input
                type="url"
                required
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... atau TikTok link"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-500 to-purple-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-lg shadow-purple-600/30 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {submitting ? 'Menyimpan Log...' : 'Publish Journey Log'}
        </button>
      </form>

      {/* TABLE LIST LOG JOURNEY */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
          Daftar Log Terpublikasi ({journeys.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Memuat data log...
          </div>
        ) : (
          <div className="space-y-3">
            {journeys.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between gap-4 hover:border-amber-400/40 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(item.event_date).toLocaleDateString('id-ID')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono uppercase bg-white/5 border border-white/10 text-purple-300">
                      {item.media_type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono">{item.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer shrink-0"
                  title="Hapus Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}