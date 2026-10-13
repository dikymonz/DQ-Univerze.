import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  Trophy, Calendar, Gamepad2, Sparkles, 
  CheckCircle2, Clock, PlayCircle, ShieldAlert, Search,
  ChevronLeft, ChevronRight, Zap, ImageOff, Maximize2, X, Coins
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { getEmbedUrl } from '../utils/embed';

// KOMPONEN CAROUSEL SLIDER GAMBAR & EMBED VIDEO
function ImageCarousel({ images, title, fullMediaUrl, isCompleted, embedUrl, onOpenDetail }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parsing array images dari JSON MySQL jika ada
  const imageList = useMemo(() => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }, [images]);

  // Susun daftar media (Prioritaskan list images, lalu fallback ke fullMediaUrl / embedUrl)
  const displayImages = useMemo(() => {
    if (imageList.length > 0) {
      return imageList.map(img => img.startsWith('/uploads') ? `http://localhost:5000${img}` : img);
    }
    if (fullMediaUrl) return [fullMediaUrl];
    if (embedUrl) return [embedUrl];
    return [];
  }, [imageList, fullMediaUrl, embedUrl]);

  if (displayImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-600 gap-1 font-mono text-[11px] h-full">
        <ImageOff className="w-6 h-6 text-slate-700" />
        <span>NO MEDIA PREVIEW</span>
      </div>
    );
  }

  const currentMedia = displayImages[currentIndex];
  // Cek apakah item media saat ini berupa URL Embed Video
  const isEmbedMedia = currentMedia && (
    currentMedia.includes('youtube.com') || 
    currentMedia.includes('youtu.be') || 
    currentMedia.includes('tiktok.com') ||
    currentMedia.includes('embed')
  );
  const activeEmbedUrl = isEmbedMedia ? getEmbedUrl(currentMedia) : null;

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-slate-950/90 group/carousel flex items-center justify-center cursor-pointer"
      onClick={() => {
        if (!activeEmbedUrl) {
          onOpenDetail(displayImages, currentIndex);
        }
      }}
    >
      {/* 1. JIKA MEDIA ADALAH EMBED VIDEO (YOUTUBE / TIKTOK) */}
      {activeEmbedUrl ? (
        <iframe
          className="w-full h-full border-0 pointer-events-auto"
          src={activeEmbedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        /* 2. JIKA MEDIA ADALAH GAMBAR (WITH OBJECT-CONTAIN) */
        <>
          <img
            src={currentMedia}
            alt={`${title} - slide ${currentIndex + 1}`}
            className={`w-full h-full object-contain transition-all duration-300 ${
              isCompleted ? 'grayscale-30' : ''
            }`}
          />

          {/* OVERLAY HOVER ZOOM ICON */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/carousel:opacity-100 transition flex items-center justify-center z-10 pointer-events-none">
            <div className="px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400/50 text-cyan-400 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
              <Maximize2 className="w-3.5 h-3.5" /> LIHAT DETAIL GAMBAR
            </div>
          </div>
        </>
      )}

      {/* NAVIGASI SLIDE JIKA MEDIA LEBIH DARI 1 */}
      {displayImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/70 text-white hover:bg-cyan-500 hover:text-black transition opacity-0 group-hover/carousel:opacity-100 cursor-pointer z-20"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/70 text-white hover:bg-cyan-500 hover:text-black transition opacity-0 group-hover/carousel:opacity-100 cursor-pointer z-20"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* INDIKATOR DOTS */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded-full backdrop-blur-md z-20 pointer-events-auto">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? 'bg-cyan-400 w-3' : 'bg-white/40 w-1.5'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// SKELETON LOADING COMPONENT
function TournamentSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div 
          key={n} 
          className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 md:p-4 space-y-3 animate-pulse relative overflow-hidden"
        >
          <div className="aspect-16/10 bg-slate-800/80 rounded-xl w-full" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-800 rounded-full w-1/4" />
            </div>
            <div className="h-5 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-800/50 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Tournament() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // State Modal Lightbox Detail Gambar
  const [lightboxData, setLightboxData] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/tournaments');
      const dataList = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.data || []);

      setTournaments(dataList);
    } catch (err) {
      console.error('Gagal mengambil data turnamen:', err);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter Search & Tab
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((item) => {
      const matchesTab = activeTab === 'ALL' || item.status === activeTab;
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.game_name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [tournaments, activeTab, searchQuery]);

  // Total Kategori Status
  const counts = useMemo(() => {
    return {
      ALL: tournaments.length,
      Upcoming: tournaments.filter((t) => t.status === 'Upcoming').length,
      Ongoing: tournaments.filter((t) => t.status === 'Ongoing').length,
      Completed: tournaments.filter((t) => t.status === 'Completed').length,
    };
  }, [tournaments]);

  // Kalkulasi Paginasi
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage) || 1;
  const paginatedTournaments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTournaments.slice(start, start + itemsPerPage);
  }, [filteredTournaments, currentPage]);

  const openLightbox = (item, images, index = 0) => {
    setLightboxData({ item, images, activeIndex: index });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-20 md:pt-24 pb-28 md:pb-16 space-y-6 min-h-screen font-mono">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-1.5 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> GAMING CORNER ESPORTS
        </div>
        <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest">
          TOURNAMENT <span className="text-cyan-400">ARENA</span>
        </h1>
        <p className="text-[11px] text-slate-400 max-w-lg mx-auto leading-relaxed px-2">
          Buktikan skuat kamu yang terbaik, perebutkan Prize Pool jutaan rupiah, dan klaim kejayaan di leaderboard!
        </p>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 bg-slate-950/70 p-2.5 md:p-3 rounded-2xl border border-white/10 backdrop-blur-md">
          
          <div className="flex items-center gap-1.5 text-xs w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => { setActiveTab('ALL'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-medium uppercase transition whitespace-nowrap flex items-center gap-1 cursor-pointer text-[10px] md:text-[11px] ${
                activeTab === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Trophy className="w-3 h-3" /> All ({counts.ALL})
            </button>

            <button
              onClick={() => { setActiveTab('Upcoming'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-medium uppercase transition whitespace-nowrap flex items-center gap-1 cursor-pointer text-[10px] md:text-[11px] ${
                activeTab === 'Upcoming'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Clock className="w-3 h-3" /> Upcoming ({counts.Upcoming})
            </button>

            <button
              onClick={() => { setActiveTab('Ongoing'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-medium uppercase transition whitespace-nowrap flex items-center gap-1 cursor-pointer text-[10px] md:text-[11px] ${
                activeTab === 'Ongoing'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <PlayCircle className="w-3 h-3" /> Ongoing ({counts.Ongoing})
            </button>

            <button
              onClick={() => { setActiveTab('Completed'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-medium uppercase transition whitespace-nowrap flex items-center gap-1 cursor-pointer text-[10px] md:text-[11px] ${
                activeTab === 'Completed'
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> Finished ({counts.Completed})
            </button>
          </div>

          <div className="relative w-full md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search event / game..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-[11px] focus:border-cyan-400 focus:outline-none transition"
            />
          </div>

        </div>
      </div>

      {/* TOURNAMENTS GRID COMPACT */}
      {loading ? (
        <TournamentSkeleton />
      ) : paginatedTournaments.length === 0 ? (
        <div className="text-center py-12 p-4 rounded-2xl bg-slate-950/50 border border-dashed border-white/10 text-slate-400 text-xs space-y-1.5">
          <ShieldAlert className="w-7 h-7 mx-auto text-slate-500" />
          <p className="text-slate-300 font-semibold text-xs">TIDAK ADA TURNAMEN DITEMUKAN</p>
          <p className="text-[10px] text-slate-500">Coba kata kunci lain atau pilih tab status yang berbeda.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTournaments.map((item) => {
            const isLocalUpload = item.video_url?.startsWith('/uploads');
            const fullMediaUrl = isLocalUpload
              ? `http://localhost:5000${item.video_url}`
              : item.video_url;

            const embedUrl = item.video_url ? getEmbedUrl(fullMediaUrl) : null;
            const isCompleted = item.status === 'Completed';
            const isOngoing = item.status === 'Ongoing';

            return (
              <div
                key={item.id}
                className="group relative bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 transition duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* COMPACT MEDIA & IMAGE CAROUSEL SECTION */}
                  <div className="relative aspect-16/10 bg-slate-950 overflow-hidden border-b border-white/10 flex items-center justify-center">
                    <ImageCarousel
                      images={item.images}
                      title={item.title}
                      fullMediaUrl={fullMediaUrl}
                      isCompleted={isCompleted}
                      embedUrl={embedUrl}
                      onOpenDetail={(imgs, idx) => openLightbox(item, imgs, idx)}
                    />
                    
                    {/* NAMA GAME BADGE */}
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-bold text-cyan-400 uppercase flex items-center gap-1 shadow-md pointer-events-none z-10">
                      <Gamepad2 className="w-3 h-3 text-cyan-400" /> {item.game_name}
                    </div>
                  </div>

                  {/* COMPACT CONTENT SECTION */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-1 text-amber-400 font-bold tracking-wider text-xs">
                        <Coins className="w-3.5 h-3.5" /> 
                        <span>Rp {item.prize_pool}</span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                          isOngoing
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                            : isCompleted
                            ? 'bg-slate-800 text-slate-400 border-slate-700'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <Zap className="w-2 h-2" />
                        {item.status === 'Upcoming' ? 'Akan Datang' : item.status === 'Ongoing' ? 'Berlangsung' : 'Selesai'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-400 transition line-clamp-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/60 px-2 py-1 rounded-lg border border-white/5">
                      <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">
                        {new Date(item.start_date).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WITA
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {item.rules}
                    </p>
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="p-2 px-3.5 bg-slate-900/40 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500">
                  <button 
                    onClick={() => {
                      let imgs = [];
                      if (item.images) {
                        imgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                      } else if (fullMediaUrl) {
                        imgs = [fullMediaUrl];
                      }
                      const formattedImgs = imgs.map(img => img.startsWith('/uploads') ? `http://localhost:5000${img}` : img);
                      openLightbox(item, formattedImgs, 0);
                    }}
                    className="text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-2.5 h-2.5" /> DETAIL EVENT
                  </button>
                  <span className="text-cyan-400 font-semibold uppercase tracking-widest">#ESPORTS2026</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
          <span className="text-slate-400 text-[10px]">
            Halaman <span className="text-cyan-400 font-bold">{currentPage}</span> dari {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:border-cyan-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg font-bold transition cursor-pointer text-[11px] ${
                  currentPage === pageNum
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:border-cyan-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX FULLSCREEN DETAIL GAMBAR / EMBED (REACT PORTAL) */}
      {lightboxData && createPortal(
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-3 md:p-6 bg-slate-950/95 backdrop-blur-2xl font-mono">
          
          <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-4 md:p-6 space-y-3 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden my-auto">
            
            {/* LIGHTBOX HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div className="pr-4">
                <span className="text-[10px] font-bold text-cyan-400 uppercase block">
                  {lightboxData.item.game_name} ESPORTS
                </span>
                <h3 className="text-sm md:text-base font-bold text-white line-clamp-1">
                  {lightboxData.item.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxData(null)}
                className="p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIGHTBOX MEDIA CONTAINER */}
            <div className="relative flex-1 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center min-h-55 p-2">
              {lightboxData.images[lightboxData.activeIndex] && 
               (lightboxData.images[lightboxData.activeIndex].includes('youtube.com') || 
                lightboxData.images[lightboxData.activeIndex].includes('youtu.be') || 
                lightboxData.images[lightboxData.activeIndex].includes('tiktok.com')) ? (
                <iframe
                  className="w-full h-full min-h-87.5 border-0"
                  src={getEmbedUrl(lightboxData.images[lightboxData.activeIndex])}
                  title={lightboxData.item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <img
                  src={lightboxData.images[lightboxData.activeIndex]}
                  alt={lightboxData.item.title}
                  className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg"
                />
              )}

              {/* NAVIGASI SLIDE PREV/NEXT LIGHTBOX */}
              {lightboxData.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        activeIndex:
                          prev.activeIndex === 0
                            ? prev.images.length - 1
                            : prev.activeIndex - 1,
                      }))
                    }
                    className="absolute left-2.5 p-2 rounded-full bg-slate-950/80 border border-white/20 text-white hover:bg-cyan-500 hover:text-slate-950 transition cursor-pointer shadow-lg z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setLightboxData((prev) => ({
                        ...prev,
                        activeIndex:
                          prev.activeIndex === prev.images.length - 1
                            ? 0
                            : prev.activeIndex + 1,
                      }))
                    }
                    className="absolute right-2.5 p-2 rounded-full bg-slate-950/80 border border-white/20 text-white hover:bg-cyan-500 hover:text-slate-950 transition cursor-pointer shadow-lg z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* LIGHTBOX DETAILS FOOTER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-amber-400 font-bold flex items-center gap-1 text-xs">
                  <Coins className="w-3.5 h-3.5" /> Rp {lightboxData.item.prize_pool}
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {new Date(lightboxData.item.start_date).toLocaleString('id-ID')} WITA
                </span>
              </div>

              {lightboxData.images.length > 1 && (
                <div className="text-[10px] text-slate-500">
                  Gambar <span className="text-cyan-400 font-bold">{lightboxData.activeIndex + 1}</span> dari {lightboxData.images.length}
                </div>
              )}
            </div>

            {/* RULES FULL TEXT */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 max-h-20 overflow-y-auto whitespace-pre-line shrink-0">
              <span className="text-cyan-400 font-bold block mb-0.5 text-[10px]">ATURAN TURNAMEN:</span>
              {lightboxData.item.rules}
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}