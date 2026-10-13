import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

// Ganti dengan ID channel rules Discord Anda
const RULES_CHANNEL_ID = '1232172281258836030'; 

export default function ServerRules() {
  const [rulesData, setRulesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/discord/channel/${RULES_CHANNEL_ID}/rules`);
        if (res.data && Array.isArray(res.data)) {
          setRulesData(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat server rules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl space-y-6 font-mono">
      
      {/* Header Rules */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              SERVER REGULATIONS
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded-md">
                OFFICIAL
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Ketentuan dan tata tertib resmi komunitas Gaming Corner
            </p>
          </div>
        </div>
      </div>

      {/* Content Rules */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-12 text-center text-xs text-cyan-400 animate-pulse">
            Memuat regulasi server dari Discord...
          </div>
        ) : rulesData.length === 0 ? (
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate-500">
            Belum ada pesan Embed Rules yang dipublikasikan di channel tersebut.
          </div>
        ) : (
          rulesData.map((msg) => (
            <div key={msg.id} className="space-y-4">
              {msg.embeds.map((embed, idx) => (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-black/50 border-l-4 border-cyan-400 border space-y-3 relative overflow-hidden"
                  style={{ borderColor: embed.color ? `#${embed.color.toString(16)}` : undefined }}
                >
                  {embed.title && (
                    <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wide flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                      {embed.title}
                    </h4>
                  )}

                  {embed.description && (
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {embed.description}
                    </p>
                  )}

                  {/* Render fields jika embed memiliki field terstruktur */}
                  {embed.fields && embed.fields.length > 0 && (
                    <div className="grid gap-3 pt-2">
                      {embed.fields.map((field, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                          <div className="text-xs font-bold text-cyan-400">{field.name}</div>
                          <div className="text-xs text-slate-300 font-sans">{field.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {embed.footer && (
                    <div className="pt-2 text-[10px] text-slate-500 border-t border-white/5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> {embed.footer.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1 text-cyan-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Wajib dipatuhi oleh seluruh member
        </span>
        <span className="text-slate-400">Sync with Discord Embeds</span>
      </div>

    </div>
  );
}