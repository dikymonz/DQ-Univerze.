import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, ShieldCheck, Gamepad2, Sparkles, UserCheck } from 'lucide-react';

export default function PlayerCard({ user, showDownload = true }) {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    : 'https://cdn.discordapp.com/embed/avatars/0.png';

  const username = user?.username || 'GUEST_MEMBER';
  const userId = user?.id || '0000000000000000';
  const isAdmin = user?.isAdmin || false;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.6 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      setRotate({ x: 0, y: 0 });
      setGlare({ x: 50, y: 50, opacity: 0 });

      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `GC-ID-CARD-${username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Gagal mengunduh kartu:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 3D PERSPECTIVE CONTAINER */}
      <div className="perspective-1000">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="relative w-72 h-108 rounded-3xl p-5 bg-[#0a0d14] border border-amber-500/40 shadow-[0_0_35px_rgba(168,85,247,0.25)] overflow-hidden cursor-pointer select-none flex flex-col justify-between"
        >
          {/* HOLOGRAPHIC FOIL OVERLAY */}
          <div
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(245,158,11,0.3) 25%, rgba(168,85,247,0.3) 50%, transparent 80%)`,
              opacity: glare.opacity,
            }}
            className="absolute inset-0 pointer-events-none transition-opacity duration-200 mix-blend-color-dodge z-20"
          />

          {/* Cyber Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 pointer-events-none" />

          {/* TOP SECTION */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gamepad2 className="w-5 h-5 text-amber-400" />
              <span className="font-mono font-black text-white text-[11px] tracking-widest uppercase">
                GAMING <span className="text-amber-400">CORNER</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> OFFICIAL PASS
            </span>
          </div>

          {/* MIDDLE SECTION */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl p-1 bg-linear-to-tr from-amber-500 via-purple-600 to-cyan-400 shadow-lg shadow-purple-600/40">
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-full h-full object-cover rounded-xl bg-black"
                />
              </div>
              {isAdmin && (
                <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-slate-900 border border-amber-400 rounded-lg text-amber-400 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-white tracking-wider uppercase font-mono">
                {username}
              </h3>
              <p className="text-[9px] text-purple-400 font-mono tracking-widest uppercase font-bold mt-0.5">
                {isAdmin ? '● SYSTEM ADMIN' : '● VERIFIED MEMBER'}
              </p>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="relative z-10 space-y-2 font-mono">
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 text-[9px]">
              <div className="flex justify-between text-slate-400">
                <span>DISCORD ID:</span>
                <span className="text-slate-200 font-bold">{userId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> ACTIVE MEMBER
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between opacity-50 px-1">
              <div className="h-4 w-24 bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,transparent_2px,transparent_4px)]" />
              <span className="text-[8px] text-slate-400">GC-ID-PASS</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAMPILKAN TOMBOL DOWNLOAD HANYA JIKA showDownload = true */}
      {showDownload && (
        <button
          onClick={downloadCard}
          disabled={isDownloading}
          className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-purple-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider hover:from-amber-400 hover:to-purple-500 shadow-lg shadow-purple-600/30 transition border border-amber-300/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          {isDownloading ? 'EXPORTING...' : 'DOWNLOAD ID CARD (PNG)'}
        </button>
      )}
    </div>
  );
}