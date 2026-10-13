// eslint-disable-next-line no-unused-vars
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DiscordRoleClaim from '../components/RoleClaimCard';
import TopDonators from '../components/TopDonators';
import DiscordWidget from '../components/DiscordWidget'
import {  ShieldCheck, Sparkles, MessageSquare, Radio } from 'lucide-react';

const TARGET_CHANNEL_ID = '1232172281258836035';

export default function Home({ user }) {
  const [channelActivities, setChannelActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannelActivity = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/discord/channel/${TARGET_CHANNEL_ID}/messages`);
        if (res.data && Array.isArray(res.data)) {
          setChannelActivities(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat pesan channel:', err);
        setChannelActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelActivity();
  }, []);

  return (
    <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-24 font-mono">
      <section className="grid lg:grid-cols-12 gap-10 items-center">
        
        {/* KOLOM KIRI: HERO INTRO & TOMBOL LOGIN DISCORD */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-slate-300">SERVER ONLINE</span>
         
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.95]">
              Connect. Play. <br />
              <span className="bg-linear-to-r from-indigo-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Dominates
              </span> <br />
              The Arena.
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed pt-2 font-sans">
              Gaming Corner is your ultimate hangout spot to play any game with friends! Chill, make new friends, join fun events, meet awesome gamers, and win real MONEY in giveaways. Join us now! 🎮✨
            </p>
          </div>

         <div className="flex flex-wrap items-center gap-4 pt-2">
  <a href="http://localhost:5000/api/auth/discord" className="no-underline">
    <button className="flex items-center gap-2.5 px-7 py-4 text-xs font-bold tracking-widest text-white uppercase bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 cursor-pointer">
      {/* Ikon Resmi Discord */}
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
      Join Server
    </button>
  </a>
</div>

          <div className="pt-6 border-t border-white/10 flex items-center gap-8">
            <div>
              <div className="text-2xl font-black text-white">2.5K+</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Members</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-2xl font-black text-cyan-400">99.9%</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Server Uptime</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <div className="text-2xl font-black text-emerald-400">24/7</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mabar Voice Room</div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: LIVE CHAT DARI CHANNEL ID DISCORD */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-5">
            
            {/* Header Ticker */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                  <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    #CHIT-CHAT LIVE
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 rounded">
                      SYNC
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 truncate max-w-45">
                    ID: {TARGET_CHANNEL_ID}
                  </p>
                </div>
              </div>
            </div>

            {/* List Pesan Asli dari Channel Discord */}
            <div className="space-y-3 max-h-85 overflow-y-auto pr-1">
              {loading ? (
                <div className="py-10 text-center text-xs text-cyan-400 animate-pulse">
                  Mengambil pesan dari Discord...
                </div>
              ) : channelActivities.length === 0 ? (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate-500">
                  Tidak ada pesan ditemukan di channel ini atau bot belum memiliki izin akses.
                </div>
              ) : (
                channelActivities.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/40 transition flex items-start gap-3"
                  >
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.user} className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10" />
                    ) : (
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 text-cyan-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">{item.user}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{item.time}</span>
                      </div>
                      
                      <p className="text-[11px] text-slate-300 leading-snug wrap-break-word font-sans">
                        {item.content}
                      </p>

                      {/* Jika pesan memiliki lampiran gambar dari Discord */}
                      {item.attachment && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-48 bg-slate-950 flex items-center justify-center">
                          <img src={item.attachment} alt="Attachment" className="max-h-44 w-auto object-contain rounded-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Widget */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-purple-400">
                <ShieldCheck className="w-3 h-3" /> Discord API Live
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3 h-3" /> Real-time
              </span>
            </div>

          </div>
        </div>

      </section>
      {/* CORE ECOSYSTEM HIGHLIGHTS & TOP DONATORS */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
              CORE ECOSYSTEM
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-mono tracking-wider">
              PORTAL HIGHLIGHTS
            </h2>
          </div>
        </div>

      <DiscordWidget user={user} />
        <DiscordRoleClaim user={user} />
        
        {/* TOP DONATORS COMPONENT */}
        <TopDonators />
      </section>
    </div>
  );
}