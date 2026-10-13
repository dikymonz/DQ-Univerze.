import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Award, Sparkles, CheckCircle2, AlertCircle, Loader2, Gamepad2 } from 'lucide-react';

export default function RoleClaimCard({ user }) {
  const [claiming, setClaiming] = useState(null);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const rolesAvailable = [
    {
      key: 'web_member',
      name: 'Web Portal Member',
      desc: 'Role bukti verifikasi bahwa kamu telah terhubung di Portal Web Resmi Gaming Corner.',
      badge: 'OFFICIAL PORTAL',
      border: 'border-amber-500/40',
      color: 'from-amber-500 to-amber-700'
    }
  ];

  const handleClaim = async (roleKey) => {
    if (!user) {
      setStatus({ 
        type: 'error', 
        text: 'Silakan login dengan akun Discord terlebih dahulu di Navbar untuk klaim role!' 
      });
      return;
    }

    setClaiming(roleKey);
    setStatus(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/claim-role',
        { roleKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStatus({ type: 'success', text: res.data.message });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memproses klaim role. Coba lagi nanti.';
      setStatus({ type: 'error', text: msg });
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="h-full p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl space-y-6 flex flex-col justify-between">
      
      {/* Header Title */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                AUTO ROLE DISCORD CLAIM
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Klaim peranan spesial Discord otomatis hanya dengan sekali klik.
              </p>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LOGGED IN: {user.username}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-400/30 text-amber-400 text-xs font-mono font-bold">
              <Gamepad2 className="w-4 h-4" /> NOT LOGGED IN
            </div>
          )}
        </div>

        {/* Notification Banner */}
        {status && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border transition-all ${
            status.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{status.text}</span>
          </div>
        )}

        {/* Role Cards List */}
        <div className="space-y-4">
          {rolesAvailable.map((role) => (
            <div 
              key={role.key}
              className={`p-6 rounded-2xl bg-black/60 border ${role.border} flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-amber-400/60 transition duration-300 shadow-xl`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/5 border border-white/10 text-amber-400 uppercase">
                    {role.badge}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-lg font-bold text-white tracking-wide">{role.name}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{role.desc}</p>
              </div>

              <button
                onClick={() => handleClaim(role.key)}
                disabled={claiming === role.key}
                className={`px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-linear-to-r ${role.color} hover:opacity-90 shadow-lg shadow-amber-500/20 cursor-pointer transition disabled:opacity-50 shrink-0 border border-amber-300/30`}
              >
                {claiming === role.key ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Assigning Role...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Klaim Role Sekarang
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}