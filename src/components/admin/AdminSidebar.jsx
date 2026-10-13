import { LayoutDashboard, ShoppingBag, Trophy, Rocket, LogOut, ShieldCheck, Crown } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shop', label: 'Shop Items', icon: ShoppingBag },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'journeys', label: 'Journeys Log', icon: Rocket },
    { id: 'donators', label: 'Top Donators', icon: Crown }, // Item menu baru
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-purple-500/20 p-6 flex flex-col justify-between min-h-screen">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wider uppercase">GC ADMIN</h2>
            <p className="text-[10px] text-slate-400 font-mono">Control Panel v2.0</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                  isActive
                    ? 'bg-linear-to-r from-amber-500 to-purple-600 text-white border-amber-400 shadow-lg shadow-purple-600/20'
                    : 'bg-black/20 text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Keluar Admin</span>
      </button>
    </aside>
  );
}