import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Calendar, Sparkles, Loader2, Rocket } from 'lucide-react';
import { getEmbedUrl } from '../utils/embed';

export default function Journey() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef(null);

  const fetchJourneys = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/journeys').catch(() => 
        axios.get('http://localhost:5000/api/journey')
      );

      const dataList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setJourneys(dataList);
    } catch (err) {
      console.error('Gagal mengambil data journey:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJourneys();

    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalHeight = rect.height;
      const currentScroll = windowHeight / 2 - rect.top;
      let progress = (currentScroll / totalHeight) * 100;
      
      if (progress < 0) progress = 0;
      if (progress > 100) progress = 100;

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchJourneys]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/10">
          <Sparkles className="w-4 h-4" /> COMMUNITY HIGHLIGHTS
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-mono uppercase tracking-wider">
          OUR <span className="text-amber-400">JOURNEY</span> TIMELINE
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-mono max-w-xl mx-auto leading-relaxed">
          Rekam jejak perjalanan, event esports, serta momen bersejarah yang membentuk komunitas Gaming Corner.
        </p>
      </div>

      {/* TIMELINE SECTION */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-mono text-xs gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span>LOADING JOURNEY TIMELINE...</span>
        </div>
      ) : journeys.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/60 border border-white/10 text-slate-400 font-mono text-xs">
          Belum ada log kegiatan yang dipublikasikan.
        </div>
      ) : (
        <div ref={timelineRef} className="relative py-8">
          
          {/* GARIS TIMELINE TENGAH (BACKGROUND) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 -translate-x-1/2 rounded-full hidden md:block" />

          {/* GARIS TIMELINE AKTIF (SCROLL ANIMATED PROGRESS BAR) */}
          <div 
            className="absolute left-4 md:left-1/2 top-0 w-1 bg-linear-to-b from-amber-400 via-purple-500 to-cyan-400 -translate-x-1/2 rounded-full transition-all duration-150 ease-out hidden md:block shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            style={{ height: `${scrollProgress}%` }}
          />

          {/* ITEM TIMELINE */}
          <div className="space-y-12 md:space-y-16">
            {journeys.map((item, index) => {
              const isEven = index % 2 === 0;
              const isLocalUpload = item.media_url?.startsWith('/uploads');
              const fullMediaUrl = isLocalUpload
                ? `http://localhost:5000${item.media_url}`
                : item.media_url;

              const embedUrl = item.media_url ? getEmbedUrl(fullMediaUrl) : null;

              return (
                <div 
                  key={item.id} 
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* NODE / LENCANA IKON TENGAH */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl bg-slate-900 border-2 border-amber-400 z-20 hidden md:flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Rocket className="w-4 h-4 text-amber-400" />
                  </div>

                  {/* CONTENT CARD (KIRI / KANAN) */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/20 shadow-2xl space-y-4 hover:border-amber-400/50 transition duration-300 group backdrop-blur-xl">
                      
                      {/* MEDIA DISPLAY */}
                      <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-white/10">
                        {item.media_type === 'embed' && embedUrl ? (
                          <iframe
                            className="w-full h-full border-0"
                            src={embedUrl}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : item.media_type === 'video' ? (
                          <video
                            controls
                            src={fullMediaUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={fullMediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        )}
                      </div>

                      {/* TEXT CONTENT */}
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-xs font-mono ${
                          isEven ? 'md:justify-end' : 'justify-start'
                        }`}>
                          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.event_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-purple-300">
                            {item.media_type}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-white font-mono tracking-wide group-hover:text-amber-400 transition">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* SPACE KOSONG UNTUK BALANCING GRID TENGAH */}
                  <div className="w-full md:w-[calc(50%-2.5rem)] hidden md:block" />

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}