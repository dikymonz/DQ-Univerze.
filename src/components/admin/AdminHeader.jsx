import { Shield, Sparkles } from 'lucide-react';

export default function AdminHeader({ user }) {
  return (
    <header className="p-4 md:p-6 bg-slate-900/60 border-b border-white/10 backdrop-blur-xl flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>GAMING CORNER MANAGEMENT SYSTEM</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right font-mono">
          <div className="text-xs font-bold text-white">{user?.username || 'Admin Staff'}</div>
          <div className="text-[10px] text-emerald-400">● Administrator</div>
        </div>
        {user?.avatar ? (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
            alt="Avatar"
            className="w-9 h-9 rounded-xl border border-amber-400/50"
          />
        ) : (
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
        )}
      </div>
    </header>
  );
}