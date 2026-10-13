import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import heroLogo from '../assets/LogoGC.png';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Simulasi progress loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              onFinish();
            }, 600); // Durasi fade out
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-dark-bg transition-opacity duration-600 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cyber Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-xs w-full px-4 text-center">
        {/* Logo Gambar HeroGC dengan Efek Glow & Shield Badge */}
        <div className="relative">
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 shadow-2xl shadow-purple-600/40 animate-pulse">
            <img 
              src={heroLogo} 
              alt="Gaming Corner Logo" 
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 border border-purple-500/50 rounded-xl text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-widest uppercase font-mono">
            GAMING <span className="text-amber-400">CORNER</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
            Initializing System Portal...
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2">
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-200 ease-out shadow-[0_0_12px_rgba(251,191,36,0.8)]"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f59e0b 0%, #a855f7 100%)' 
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>LOADING MODULES</span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}