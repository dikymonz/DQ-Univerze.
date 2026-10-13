import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { ShieldCheck, Gamepad2, MessageSquare, ExternalLink, Heart } from 'lucide-react';
import LogoGC from '../assets/LogoGC.png';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#05070a] border-t border-white/10 pt-12 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Section: Grid Brand & Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/5">
          
          {/* Brand Info (5 Kolom) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 no-underline group">
              <div className="p-1 rounded-xl group-hover:border-cyan-400/50 transition duration-300">
                <img 
                  src={LogoGC} 
                  alt="Gaming Corner Logo" 
                  className="w-9 h-9 object-contain group-hover:scale-105 transition duration-300"
                />
              </div>
              <div>
                <h2 className="m-0 text-lg font-black tracking-widest text-white group-hover:text-cyan-400 transition">
                  GAMING<span className="text-cyan-400">CORNER</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    COMMUNITY PORTAL
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm">
              Wadah resmi komunitas gaming terintegrasi. Jelajahi turnamen esports, item shop, serta rekam jejak perjalanan komunitas kami dalam satu portal.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SERVER DISCORD ONLINE & VERIFIED</span>
            </div>
          </div>

          {/* Quick Links (3 Kolom) */}
          <div className="md:col-span-3 space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition no-underline flex items-center gap-1.5">
                  › Home Portal
                </Link>
              </li>
              <li>
                <Link to="/journey" className="hover:text-white transition no-underline flex items-center gap-1.5">
                  › Community Journey
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="hover:text-white transition no-underline flex items-center gap-1.5">
                  › Esports Tournaments
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition no-underline flex items-center gap-1.5">
                  › Official Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Community (4 Kolom) */}
          <div className="md:col-span-4 space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              JOIN COMMUNITY
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bergabunglah dengan server Discord kami untuk mabar, ikut event bulanan, dan klaim role khusus.
            </p>

            <div className="pt-2">
              <a
                href="http://localhost:5000/api/auth/discord"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition shadow-lg shadow-indigo-600/20 no-underline"
              >
                <MessageSquare className="w-4 h-4" /> Discord Server <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Credit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} <span className="text-slate-300 font-bold">GAMING CORNER</span>. All rights reserved.
          </div>

          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Gaming Community</span>
          </div>
        </div>

      </div>
    </footer>
  );
}