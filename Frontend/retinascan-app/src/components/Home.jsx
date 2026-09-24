import React, { useEffect, useState } from 'react';
import { allPatients } from '../data.js';

// ── Derived stats from real data ────────────────────────────────────────────
const screeningsToday   = allPatients.length;
const pendingReview     = allPatients.filter(p => p.severity >= 3).length;
const referableCount    = allPatients.filter(p => p.severity >= 2).length;
const lowConfidence     = allPatients.filter(p => p.confidence < 90).length;

// ── Inline SVG icons ─────────────────────────────────────────────────────────
function IconCapture() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="20" cy="22" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="20" cy="22" r="2.5" fill="currentColor"/>
      <path d="M14 10 L16 6 H24 L26 10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="32" cy="14" r="2" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

function IconPACS() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="32" height="28" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="4" y1="14" x2="36" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      <rect x="9" y="18" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="23" y1="20" x2="31" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="23" y1="24" x2="29" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="23" y1="28" x2="31" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="28" width="6" height="8" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="14" y="20" width="6" height="16" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="23" y="14" width="6" height="22" rx="1" fill="currentColor" opacity="0.85"/>
      <rect x="32" y="8" width="4" height="28" rx="1" fill="currentColor"/>
      <path d="M8 22 L17 16 L26 10 L34 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
    </svg>
  );
}

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({ icon, title, subtitle, accent, onClick, badge, stats }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${accent}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 220,
      }}
    >
      {/* Subtle glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(to bottom, ${accent}12, transparent)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent, marginBottom: 20,
        transition: 'background 0.2s',
      }}>
        {icon}
      </div>

      {badge && (
        <span style={{
          position: 'absolute', top: 24, right: 24,
          padding: '3px 10px', borderRadius: 20,
          background: `${accent}20`, border: `1px solid ${accent}40`,
          fontSize: 10, fontWeight: 700, color: accent,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>{badge}</span>
      )}

      <h2 style={{
        margin: '0 0 8px', fontSize: 20, fontWeight: 800,
        color: '#0f172a', fontFamily: 'Manrope, Inter, sans-serif',
        letterSpacing: '-0.01em',
      }}>{title}</h2>

      <p style={{
        margin: '0 0 24px', fontSize: 13, lineHeight: 1.6,
        color: '#64748b',
      }}>{subtitle}</p>

      {/* Mini stats */}
      {stats && (
        <div style={{ display: 'flex', gap: 20, marginTop: 'auto' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700,
                color: s.color || accent, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Arrow */}
      <div style={{
        position: 'absolute', bottom: 28, right: 28,
        color: hovered ? accent : '#64748b',
        fontSize: 20, transition: 'all 0.2s',
        transform: hovered ? 'translateX(3px)' : 'translateX(0)',
      }}>→</div>
    </button>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({ label, value, color, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 20px', borderRadius: 12,
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <span style={{ fontSize: 18, opacity: 0.8 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 800,
          color: color, lineHeight: 1,
        }}>{value}</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Home({ navigate }) {
  const [tick, setTick] = useState(0);

  // Animate the counter tick on mount for a nice entry feel
  useEffect(() => {
    const t = setTimeout(() => setTick(1), 100);
    return () => clearTimeout(t);
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Ambient glow orbs */}
      <div style={{ position: 'absolute', top: -200, left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(3,105,161,0.04)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -100, right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(2,132,199,0.04)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px 60px', position: 'relative', zIndex: 1 }}>

        {/* ── Header strip ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 0 40px', borderBottom: '1px solid #e2e8f0',
          marginBottom: 48,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Logo eye SVG */}
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(3,105,161,0.08)', border: '1px solid rgba(3,105,161,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <ellipse cx="13" cy="13" rx="11" ry="7" stroke="#0369a1" strokeWidth="1.8"/>
                <circle cx="13" cy="13" r="4" stroke="#0369a1" strokeWidth="1.8"/>
                <circle cx="13" cy="13" r="2" fill="#0369a1"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>RetinaScan XAI</div>
              <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>SIH 26038 · MathWorks · Clinical Edition</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* System time */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{timeStr}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{dateStr} · PHC Mandawar, Alwar</div>
            </div>
            {/* Online badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 20,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
                boxShadow: '0 0 6px #22c55e',
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>System Online</span>
            </div>
          </div>
        </div>

        {/* ── Hero headline ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 20, marginBottom: 16,
            background: 'rgba(3,105,161,0.08)', border: '1px solid rgba(3,105,161,0.2)',
            fontSize: 11, fontWeight: 600, color: '#0369a1',
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0369a1' }} />
            SMART INDIA HACKATHON 2026 · PROBLEM ID SIH26038
          </div>

          <h1 style={{
            margin: '0 0 14px',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#0f172a',
            maxWidth: 680,
          }}>
            AI-Powered{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0369a1, #0284c7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Diabetic Retinopathy
            </span>{' '}
            Screening
          </h1>

          <p style={{ margin: 0, fontSize: 16, color: '#64748b', maxWidth: 560, lineHeight: 1.7 }}>
            Explainable AI for rural India PHCs — ResNet-50 with Grad-CAM++. 
            Detects all 5 ICDR grades in under 2 seconds, offline.
          </p>
        </div>

        {/* ── Live stat strip ── */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 48,
          padding: '20px 24px', borderRadius: 16,
          background: '#ffffff', border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <div style={{ flex: 1, display: 'flex', gap: 24 }}>
            <StatChip icon="📋" label="Screenings Today" value={screeningsToday} color="#0284c7" />
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <StatChip icon="⏳" label="Pending Review" value={pendingReview} color="#f59e0b" />
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <StatChip icon="🔴" label="Referable Cases" value={referableCount} color="#ea580c" />
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <StatChip icon="⚠" label="Low Confidence" value={lowConfidence} color="#a855f7" />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 16px',
            fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace',
            borderLeft: '1px solid #e2e8f0',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            All data from<br />allPatients[ ]
          </div>
        </div>

        {/* ── Three module cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          <ModuleCard
            icon={<IconCapture />}
            accent="#0369a1"
            title="Point-of-Care Acquisition"
            subtitle="Capture and screen a new patient fundus image at the PHC. Runs fully offline — no cloud required."
            badge="Primary Flow"
            onClick={() => navigate('upload')}
            stats={[
              { label: 'Avg time', value: '< 2s' },
              { label: 'Accuracy', value: '97.6%' },
            ]}
          />

          <ModuleCard
            icon={<IconPACS />}
            accent="#0284c7"
            title="Clinician Diagnostic PACS"
            subtitle="Review AI-flagged cases, examine Grad-CAM heatmaps, annotate lesion findings, and issue referrals."
            badge="Review Queue"
            onClick={() => navigate('queue')}
            stats={[
              { label: 'Pending', value: pendingReview, color: '#f59e0b' },
              { label: 'Referable', value: referableCount, color: '#ea580c' },
            ]}
          />

          <ModuleCard
            icon={<IconAnalytics />}
            accent="#a855f7"
            title="District Capacity Analytics"
            subtitle="Program throughput, coverage maps, ophthalmologist workload, and backlog projections."
            badge="Admin"
            onClick={() => navigate('admin')}
            stats={[
              { label: 'Coverage', value: '73%' },
              { label: 'PHCs active', value: '12' },
            ]}
          />
        </div>

        {/* ── Bottom strip ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderRadius: 12,
          background: '#ffffff', border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          fontSize: 12,
        }}>
          <div style={{ display: 'flex', gap: 24, color: '#64748b', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
            <span>ResNet-50 v2.4.1</span>
            <span>·</span>
            <span>Grad-CAM++ XAI</span>
            <span>·</span>
            <span>IQA v2.1</span>
            <span>·</span>
            <span>FHIR R4 Compliant</span>
            <span>·</span>
            <span>MathWorks Toolkit Enabled</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
            Press Ctrl+Shift+R to reset demo
          </div>
        </div>
      </div>
    </main>
  );
}
