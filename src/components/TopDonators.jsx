import { useEffect, useState } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { Crown, HeartHandshake, Sparkles, Trophy, Loader2 } from 'lucide-react';

export default function TopDonators() {
  const [donators, setDonators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDonators();
  }, []);

  const fetchDonators = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donators');
      if (res.data?.success) {
        setDonators(res.data.data);
      }
    } catch (err) {
      console.error('Gagal memuat top donatur:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Border & Crown Style berdasarkan Rank Top 3
  const getRankBadge = (index) => {
    if (index === 0) {
      return {
        badgeBg: 'bg-amber-400 text-slate-950',
        borderColor: 'border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)]',
        crownColor: 'text-amber-400',
        label: 'TOP DONATOR',
      };
    }
    if (index === 1) {
      return {
        badgeBg: 'bg-slate-300 text-slate-950',
        borderColor: 'border-slate-300/80 shadow-[0_0_15px_rgba(203,213,225,0.2)]',
        crownColor: 'text-slate-300',
        label: '2ND SUPPORTER',
      };
    }
    if (index === 2) {
      return {
        badgeBg: 'bg-amber-700 text-white',
        borderColor: 'border-amber-600/80 shadow-[0_0_15px_rgba(217,119,6,0.2)]',
        crownColor: 'text-amber-600',
        label: '3RD SUPPORTER',
      };
    }
    return {
      badgeBg: 'bg-slate-800 text-slate-400',
      borderColor: 'border-white/10',
      crownColor: null,
      label: `#${index + 1} SUPPORTER`,
    };
  };

  return (
    <div className="bg-slate-950/80 border border-purple-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* HEADER COMPONENT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" /> SERVER HALL OF FAME
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-mono tracking-wider flex items-center gap-2">
            TOP <span className="text-amber-400">DONATORS</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-white/5">
          <HeartHandshake className="w-4 h-4 text-purple-400" />
          <span>Support Gaming Corner Community</span>
        </div>
      </div>

      {/* DONATOR LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 font-mono text-xs gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span>MEMUAT DATA TOP DONATUR...</span>
        </div>
      ) : donators.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-slate-400 font-mono text-xs space-y-2">
          <Sparkles className="w-8 h-8 mx-auto text-slate-500" />
          <p>Belum ada data donatur tercatat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donators.map((item, index) => {
            const rankStyle = getRankBadge(index);

            return (
              <div
                key={item.id}
                className={`relative bg-slate-900/90 rounded-2xl p-4 border ${rankStyle.borderColor} transition duration-300 hover:scale-[1.02] flex items-center justify-between gap-4`}
              >
                {/* RANK NUMBER / CROWN BADGE */}
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {/* DISCORD AVATAR WITH DECORATION */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-white/10">
                      <img
                        src={item.avatar}
                        alt={item.username}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* DISCORD AVATAR DECORATION OVERLAY */}
                    {item.avatarDecoration && (
                      <img
                        src={item.avatarDecoration}
                        alt="Decoration"
                        className="absolute -top-1.5 -left-1.5 w-15 h-15 pointer-events-none z-10 max-w-none"
                      />
                    )}

                    {/* RANK NUMBER OVERLAY BADGE */}
                    <span
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-black flex items-center justify-center border border-slate-950 ${rankStyle.badgeBg}`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* USERNAME & DISCORD INFO */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white font-mono leading-tight">
                        {item.username}
                      </h4>
                      {rankStyle.crownColor && (
                        <Crown className={`w-3.5 h-3.5 ${rankStyle.crownColor}`} />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      ID: {item.discord_id}
                    </span>
                  </div>
                </div>

                {/* DONATION AMOUNT */}
                <div className="text-right font-mono shrink-0">
                  <div className="text-sm font-black text-amber-400">
                    {formatCurrency(item.amount)}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 block">
                    TOTAL DONATE
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER NOTE */}
      <div className="text-center pt-2 font-mono text-[11px] text-slate-500">
        Terima kasih kepada seluruh member yang telah mendukung keberlangsungan server Gaming Corner!
      </div>
    </div>
  );
}