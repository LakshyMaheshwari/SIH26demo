import React from 'react';

// Shared header used on every page
export default function Header({ screen, navigate }) {
  const links = [
    { key: 'home',    label: 'Home',     icon: 'home' },
    { key: 'upload',  label: 'Upload',   icon: 'upload_file' },
    { key: 'results', label: 'Results',  icon: 'analytics' },
    { key: 'queue',   label: 'Queue',    icon: 'list_alt' },
    { key: 'canvas',  label: 'Canvas',   icon: 'draw' },
    { key: 'referral',label: 'Referral', icon: 'outbox' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="h-14 w-full px-6 md:px-12 flex items-center justify-between max-w-[1600px] mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('home')}>
          <div className="w-8 h-8 rounded-lg bg-[#0B5563] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]" style={{fontVariationSettings:"'FILL' 1"}}>visibility</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-slate-900 tracking-tight group-hover:text-[#0B5563] transition-colors">RetinaScan XAI</span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-bold text-teal-700 bg-teal-50 tracking-wide">Clinical Demo</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(link => (
            <button
              key={link.key}
              onClick={() => navigate(link.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                screen === link.key
                  ? 'bg-[#0B5563] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Edge Model Ready
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0B5563] flex items-center justify-center">
            <span className="text-[11px] text-white font-bold">DR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
