import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminShop from '../../components/admin/AdminShop';
import AdminTournaments from '../../components/admin/AdminTournaments';
import AdminDonators from '../../components/admin/AdminDonators';
import AdminJourney from './AdminJourney';
import { ShoppingBag, Trophy, Rocket, Crown, HardDrive, Loader2 } from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ shopCount: 0, tourneyCount: 0, journeyCount: 0, donatorCount: 0 });
  const [cleaningDisk, setCleaningDisk] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Menggunakan Promise.allSettled agar jika satu endpoint gagal, yang lain tetap terbaca
      const [shopRes, tourneyRes, journeyRes, donatorRes] = await Promise.allSettled([
        axios.get('https://dq-universe-api.vercel.app/api/shop', { headers }),
        axios.get('https://dq-universe-api.vercel.app/api/tournaments', { headers }),
        axios.get('https://dq-universe-api.vercel.app/api/journeys', { headers }),
        axios.get('https://dq-universe-api.vercel.app/api/donators', { headers }),
      ]);

      const getVal = (res) => {
        if (res.status !== 'fulfilled') return [];
        const data = res.value.data;
        return Array.isArray(data) ? data : (data?.data || []);
      };

      const shops = getVal(shopRes);
      const tourneys = getVal(tourneyRes);
      const journeys = getVal(journeyRes);
      const donators = getVal(donatorRes);

      setStats({
        shopCount: shops.length,
        tourneyCount: tourneys.length,
        journeyCount: journeys.length,
        donatorCount: donators.length,
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err.message);
    }
  };

  // HANDLER PEMBERSIHAN FILE SAMPAH UPLOADS
  const handleCleanDisk = async () => {
    if (!window.confirm('Jalankan Clean Disk untuk menghapus file media terasing dari folder uploads?')) return;

    setCleaningDisk(true);
    try {
      const res = await axios.post('https://dq-universe-api.vercel.app/api/admin/clean-disk');
      alert(res.data.message || 'Pembersihan file selesai!');
    } catch (err) {
      console.error('Error clean disk:', err);
      alert('Gagal membersihkan disk storage.');
    } finally {
      setCleaningDisk(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-bg font-mono">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />

        <main className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">
                  SYSTEM OVERVIEW
                </h2>

                {/* ACTION BUTTON CLEAN DISK */}
                <button
                  onClick={handleCleanDisk}
                  disabled={cleaningDisk}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {cleaningDisk ? <Loader2 className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
                  <span>CLEAN DISK STORAGE</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase">Total Produk Shop</span>
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats.shopCount}</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase">Total Turnamen</span>
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats.tourneyCount}</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase">Total Log Journey</span>
                    <Rocket className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats.journeyCount}</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase">Top Donators</span>
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{stats.donatorCount}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHOP CRUD */}
          {activeTab === 'shop' && <AdminShop />}

          {/* TAB 3: TOURNAMENT CRUD */}
          {activeTab === 'tournaments' && <AdminTournaments />}

          {/* TAB 4: JOURNEY CRUD */}
          {activeTab === 'journeys' && <AdminJourney onUpdateStats={fetchStats} />}

          {/* TAB 5: DONATORS CRUD */}
          {activeTab === 'donators' && <AdminDonators />}
        </main>
      </div>
    </div>
  );
}