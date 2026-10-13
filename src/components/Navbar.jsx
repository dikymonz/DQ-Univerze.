import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Trophy, ShoppingBag, LogIn, LogOut, X, Sparkles, User, ChevronDown } from 'lucide-react';
import LogoGC from '../assets/LogoGC.png';
import PlayerCard from './PlayerCard';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Journey', path: '/journey', icon: Map },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'Store', path: '/shop', icon: ShoppingBag },
  ];

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* HEADER DESKTOP & MOBILE TOP BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4">
        <div className="max-w-7xl mx-auto bg-slate-950/70 backdrop-blur-md rounded-2xl px-4 py-2.5 md:px-6 md:py-3 flex items-center justify-between border border-white/10 shadow-xl transition-all">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-cyan-500/50 transition duration-300">
              <img 
                src={LogoGC} 
                alt="Gaming Corner Logo" 
                className="w-7 h-7 md:w-8 md:h-8 object-contain group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-black tracking-wider text-white font-mono group-hover:text-cyan-400 transition">
                GAMING<span className="text-cyan-400">CORNER</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                Official Website Server.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-white/5 font-mono">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 no-underline ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Trigger Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition cursor-pointer group focus:outline-none"
                >
                  {/* Avatar dengan Discord Avatar Decoration */}
                  <div className="relative w-7 h-7 md:w-8 md:h-8 shrink-0">
                    <img
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                      alt={user.username}
                      className="w-full h-full rounded-lg object-cover border border-cyan-500/50"
                    />
                    {user.avatar_decoration && (
                      <img
                        src={`https://cdn.discordapp.com/avatar-decorations/${user.id}/${user.avatar_decoration}.png`}
                        alt="Avatar Decoration"
                        className="absolute -top-1.5 -left-1.5 w-[140%] h-[140%] pointer-events-none object-contain z-10"
                      />
                    )}
                  </div>

                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold font-mono text-slate-200 group-hover:text-cyan-400 transition leading-tight">
                      {user.username}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                      <User className="w-2.5 h-2.5 text-cyan-400" /> Card ID
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 font-mono animate-fadeIn py-1.5">
                    <button
                      onClick={() => {
                        setIsCardOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition text-left cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Lihat Player Card</span>
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="http://localhost:5000/api/auth/discord" className="no-underline">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold tracking-wide text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md transition cursor-pointer">
                  <LogIn className="w-4 h-4" /> <span>Login Discord</span>
                </button>
              </a>
            )}
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center justify-around shadow-2xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 no-underline relative ${
                  active
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all ${
                  active ? 'bg-cyan-500/10 border border-cyan-500/30' : ''
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono tracking-wide">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MODAL PLAYER CARD 3D */}
      {isCardOpen && user && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setIsCardOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 border border-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title Header */}
            <div className="text-center mb-3">
              <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> PLAYER CARD ID
              </span>
            </div>

            {/* PlayerCard Component */}
            <PlayerCard user={user} />
          </div>
        </div>
      )}
    </>
  );
}