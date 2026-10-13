import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Journey from './Pages/Journey';
import Tournament from './Pages/Tournament';
import Shop from './Pages/Shop';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminLogin from './Pages/admin/AdminLogin';
import SplashScreen from './components/SplashScreen';

function LoginSuccess({ setUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch {
        localStorage.removeItem('token');
      }
      navigate('/');
    }
  }, [searchParams, navigate, setUser]);

  return <div className="p-16 text-center text-cyan-400 font-bold font-mono">Authenticating with Discord...</div>;
}

function AppContent({ user, handleLogout, setUser, showSplash }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-bg flex flex-col justify-between">
      
      {/* Background Cyber Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-cyber-grid opacity-40"></div>
        <div className="absolute inset-0 bg-vignette"></div>

        {/* Ambient Light Orbs */}
        <div className="absolute top-1/4 left-10 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px] animate-glow-slow"></div>
        <div className="absolute bottom-1/3 right-10 w-150 h-150 bg-cyan-500/15 rounded-full blur-[140px] animate-glow-delayed"></div>
        <div className="absolute top-2/3 left-1/3 w-100 h-100 bg-purple-600/15 rounded-full blur-[100px] animate-glow-slow"></div>
      </div>

      {/* Sembunyikan Navbar secara mutlak saat Splash Screen atau di Halaman Admin */}
      {!showSplash && !isAdminRoute && <Navbar user={user} onLogout={handleLogout} />}

      <main className={`relative z-10 flex-1 ${!showSplash && !isAdminRoute ? 'pt-24' : ''}`}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/tournaments" element={<Tournament />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login-success" element={<LoginSuccess setUser={setUser} />} />

          {/* Route Admin Panel */}
          <Route 
            path="/admin" 
            element={
              !user ? (
                <AdminLogin onLoginDiscord={() => window.location.href = 'http://localhost:5000/api/auth/discord'} />
              ) : user.isAdmin === true ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="p-8 rounded-3xl bg-slate-900/90 border border-red-500/40 text-center space-y-4 max-w-md shadow-2xl backdrop-blur-xl">
                    <div className="text-4xl">🚫</div>
                    <h2 className="text-xl font-black text-white uppercase font-mono">Akses Admin Ditolak</h2>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed">
                      Akun Discord <span className="text-amber-400 font-bold">{user.username}</span> belum bergabung di Server Discord Gaming Corner atau tidak memiliki Role Administrator.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold hover:bg-red-500 hover:text-white transition cursor-pointer"
                      >
                        Logout & Ganti Akun
                      </button>
                    </div>
                  </div>
                </div>
              )
            } 
          />
        </Routes>
      </main>

      {/* Sembunyikan Footer saat Loading / Halaman Admin */}
      {!showSplash && !isAdminRoute && <Footer />}

    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        localStorage.removeItem('token');
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <>
      {/* Splash Screen Layering z-[9999] */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <Router>
        <AppContent user={user} handleLogout={handleLogout} setUser={setUser} showSplash={showSplash} />
      </Router>
    </>
  );
}