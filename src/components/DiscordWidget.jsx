import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Volume2, ShieldCheck, Gamepad2, ArrowUpRight, Radio, Sparkles } from 'lucide-react';

const DISCORD_SERVER_ID = '1232172280813981737'; 

export default function DiscordWidget() {
  const [widgetData, setWidgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`)
      .then(res => {
        setWidgetData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Filter semua voice channel yang dikembalikan oleh Discord API
  const voiceChannels = widgetData?.channels || [];
  
  // Mengelompokkan user yang berada di voice channel
  const membersInVoice = widgetData?.members?.filter(m => m.channel_id) || [];

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
      
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Radio className="w-6 h-6 animate-pulse text-purple-400" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              DISCORD LIVE WIDGET
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 rounded-md">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {widgetData?.name || 'Gaming Corner Server'}
            </p>
          </div>
        </div>

        <a 
          href={widgetData?.instant_invite || 'https://discord.gg'} 
          target="_blank" 
          rel="noreferrer"
          className="no-underline"
        >
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase bg-linear-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 rounded-xl shadow-lg shadow-purple-600/20 border border-amber-300/30 cursor-pointer transition">
            <Gamepad2 className="w-4 h-4" /> Connect Voice <ArrowUpRight className="w-4 h-4" />
          </button>
        </a>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-amber-400 animate-pulse">
          Fetching live server telemetry...
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-black/40 border border-amber-500/20 text-center space-y-2">
          <p className="text-xs text-amber-300 font-mono">
            ⚠️ Widget Server belum diaktifkan di Discord Server Settings.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Members Stats */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-2xl font-black text-white">{widgetData?.presence_count || 0}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Members Online</div>
                </div>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-3">
              <div className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>ONLINE USERS</span>
                <span className="text-slate-500">{widgetData?.members?.length || 0} Listed</span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {widgetData?.members?.slice(0, 12).map((member) => (
                  <div 
                    key={member.id} 
                    className="relative group cursor-pointer"
                    title={member.username}
                  >
                    <img 
                      src={member.avatar_url} 
                      alt={member.username} 
                      className="w-8 h-8 rounded-xl border border-white/10 group-hover:border-purple-400 transition"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                      member.status === 'online' ? 'bg-emerald-400' : 
                      member.status === 'idle' ? 'bg-amber-400' : 'bg-red-500'
                    }`}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Rooms List */}
          <div className="md:col-span-7 space-y-3">
            <div className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" /> SALURAN MABAR (VOICE ROOMS)
              </span>
              <span className="text-emerald-400 font-mono text-[10px]">{membersInVoice.length} User In Voice</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {voiceChannels.length === 0 ? (
                <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-slate-500 font-mono">
                  Belum ada voice channel mabar yang aktif saat ini.
                </div>
              ) : (
                voiceChannels.map((channel) => {
                  const channelMembers = widgetData?.members?.filter(m => m.channel_id === channel.id) || [];
                  return (
                    <div 
                      key={channel.id} 
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/40 transition space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-purple-400" /> {channel.name}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 rounded-md border border-emerald-400/20">
                          {channelMembers.length} User
                        </span>
                      </div>

                      {channelMembers.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                          {channelMembers.map((m) => (
                            <div key={m.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-[11px] text-slate-300">
                              <img src={m.avatar_url} alt={m.username} className="w-4 h-4 rounded-full" />
                              <span>{m.username}</span>
                              {m.game && <span className="text-[9px] text-amber-400">({m.game.name})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1 text-purple-400">
          <ShieldCheck className="w-3.5 h-3.5" /> OFFICIAL DISCORD TELEMETRY
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <Sparkles className="w-3 h-3" /> Auto Sync
        </span>
      </div>

    </div>
  );
}