import React from 'react';

export default function Header({ screen, navigate }) {
  const links = [
    { key: 'home',     label: 'Home',     icon: 'home' },
    { key: 'upload',   label: 'Upload',   icon: 'upload_file' },
    { key: 'results',  label: 'Results',  icon: 'analytics' },
    { key: 'queue',    label: 'Queue',    icon: 'list_alt' },
    { key: 'canvas',   label: 'Canvas',   icon: 'draw' },
    { key: 'referral', label: 'Referral', icon: 'outbox' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      background: '#ffffff',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #e2e8f0',
    }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <div
          onClick={() => navigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #0369a1, #0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ color: '#ffffff', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>visibility</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', fontFamily: 'Manrope, sans-serif' }}>RetinaScan XAI</span>
            <span style={{ fontSize: 10, color: '#0369a1', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>Clinical · SIH 2026</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(link => {
            const active = screen === link.key;
            return (
              <button
                key={link.key}
                onClick={() => navigate(link.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 12px',
                  borderRadius: 8,
                  fontSize: 12.5, fontWeight: 500, letterSpacing: '0.01em',
                  cursor: 'pointer', border: 'none',
                  background: active ? 'rgba(3,105,161,0.08)' : 'transparent',
                  color: active ? '#0369a1' : '#334155',
                  boxShadow: active ? 'inset 0 0 0 1px rgba(3,105,161,0.3)' : 'none',
                  transition: 'all 0.15s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#0369a1'; e.currentTarget.style.background = 'rgba(3,105,161,0.04)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#334155'; e.currentTarget.style.background = 'transparent'; } }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{link.icon}</span>
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 20,
            background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>Model Active</span>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(3,105,161,0.1), rgba(2,132,199,0.1))',
            border: '1px solid rgba(3,105,161,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', fontFamily: 'JetBrains Mono, monospace' }}>DR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
