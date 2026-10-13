import { ShieldCheck, Lock, Gamepad2 } from 'lucide-react';

export default function AdminLogin({ onLoginDiscord }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-2xl shadow-2xl space-y-6 text-center">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit mx-auto">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-wider uppercase">ADMIN PORTAL</h1>
          <p className="text-xs text-slate-400 font-mono">
            Otentikasi khusus pengelola portal Gaming Corner.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/50 border border-white/5 text-xs text-slate-400 font-mono space-y-2 text-left">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Lock className="w-4 h-4" /> AKSES TERBATAS
          </div>
          <p>Silakan login menggunakan akun Discord yang memiliki hak akses Administrator.</p>
        </div>

        <button
          onClick={onLoginDiscord}
          className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-linear-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 shadow-lg shadow-purple-600/30 border border-amber-300/30 cursor-pointer transition flex items-center justify-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" /> Login via Discord
        </button>
      </div>
    </div>
  );
}