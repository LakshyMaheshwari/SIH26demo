import React, { useState, useRef, useEffect } from 'react';
import {
  lesionsBySeverity,
  lesionTypes,
  getProbabilityDistribution,
  getLesionRegion,
  severityColors,
} from '../data.js';
import { API_BASE } from '../config.js';

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const D = {
  bg:      '#f8fafc',
  panel:   '#ffffff',
  border:  '#e2e8f0',
  teal:    '#0369a1',
  dim:     '#334155',
  text:    '#0f172a',
  sub:     '#334155',
  muted:   '#64748b',
  mono:    'JetBrains Mono, "Courier New", monospace',
};

/* ── Grade config ──────────────────────────────────────────────────────────── */
const GRADE_LABELS = [
  { key: 0, name: 'Grade 0: No DR',           color: '#22c55e' },
  { key: 1, name: 'Grade 1: Mild NPDR',        color: '#84cc16' },
  { key: 2, name: 'Grade 2: Moderate NPDR',    color: '#f59e0b' },
  { key: 3, name: 'Grade 3: Severe NPDR',      color: '#ea580c' },
  { key: 4, name: 'Grade 4: Proliferative DR', color: '#dc2626' },
];

/* ── Lesion legend types ───────────────────────────────────────────────────── */
const LEGEND_TYPES = [
  { type: 'neovascular',   label: 'Neovascularization', color: '#ec4899' },
  { type: 'hemorrhage',    label: 'Hemorrhage',          color: '#ef4444' },
  { type: 'hardExudate',   label: 'Hard Exudate',        color: '#00d4aa' },
  { type: 'microaneurysm', label: 'Microaneurysm',       color: '#eab308' },
  { type: 'cottonWool',    label: 'Cotton Wool Spot',    color: '#a855f7' },
];

/* ── Quadrant label ────────────────────────────────────────────────────────── */
function getQuadrant(x, y) {
  const horiz = x < 50 ? 'T' : 'N';  // Temporal / Nasal
  const vert  = y < 50 ? 'S' : 'I';  // Superior / Inferior
  return vert + horiz; // ST SN IT IN
}

/* ── Inline CSS animation styles ─────────────────────────────────────────────
   We inject a single <style> block once so we don't need a CSS file.     */
const KEYFRAMES = `
  @keyframes pin-pulse {
    0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.8; }
    50%  { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
    100% { transform: translate(-50%,-50%) scale(1);   opacity: 0; }
  }
  @keyframes pin-in {
    from { transform: translate(-50%,-50%) scale(0); opacity: 0; }
    to   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
  }
  @keyframes row-highlight {
    0%   { background: rgba(3,105,161,0.15); }
    100% { background: transparent; }
  }
`;

/* ── Main component ────────────────────────────────────────────────────────── */
export default function Canvas({
  navigate,
  patient,
  severity = 2,
  selectedEye = 'od',
  setSelectedEye = () => {},
  heatmapUrl = '',
  onRefer,
  onBack,
}) {
  const [showHeatmap,  setShowHeatmap]  = useState(false);
  const [showPins,     setShowPins]     = useState(true);
  const [showRedFree,  setShowRedFree]  = useState(false);
  const [rejected,     setRejected]     = useState(false);
  const [zoom,         setZoom]         = useState(100);
  const [hoveredId,    setHoveredId]    = useState(null);
  const [notes,        setNotes]        = useState('');
  const listRef = useRef(null);

  const sev      = severity ?? patient?.severity ?? 2;
  const eye      = selectedEye || 'od';
  const lesions  = lesionsBySeverity[sev] || [];
  const probs    = getProbabilityDistribution(sev);
  const studyId  = patient?.id?.replace('#', '') || 'STUDY-' + (patient?.id || 'DR88219');

  const fundusPath  = `/images/img_${sev}_${eye}.jpg`;
  // Only prepend backend URL for actual backend paths, not local /images/ paths
  const heatmapPath = (heatmapUrl && heatmapUrl.includes('_live_'))
    ? (heatmapUrl.startsWith('/images/') ? heatmapUrl : `${API_BASE}${heatmapUrl}`)
    : `/images/heatmap_${sev}_${eye}.jpg`;

  // Quadrant counts
  const quadCounts = { ST: 0, SN: 0, IT: 0, IN: 0 };
  lesions.forEach(l => { const q = getQuadrant(l.x, l.y); if (quadCounts[q] !== undefined) quadCounts[q]++; });

  // Present lesion types (for legend)
  const presentTypes = LEGEND_TYPES.filter(t => lesions.some(l => l.type === t.type));

  const handleBack  = () => { if (onBack)  onBack();              else if (navigate) navigate('queue');    };
  const handleRefer = () => { if (onRefer) onRefer();             else if (navigate) navigate('referral'); };

  // Scroll findings table to highlighted row
  useEffect(() => {
    if (hoveredId && listRef.current) {
      const el = listRef.current.querySelector(`[data-id="${hoveredId}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [hoveredId]);

  // Inject keyframe animations once
  useEffect(() => {
    const id = 'canvas-keyframes';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = KEYFRAMES;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div style={{
      height: '100%',
      background: D.bg,
      color: D.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      fontSize: 13,
    }}>

      {/* ── Workstation title bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '8px 20px',
        background: D.panel,
        borderBottom: `1px solid ${D.border}`,
        flexShrink: 0,
      }}>
        {/* Green status dot + title */}
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.4)', flexShrink: 0,
        }} />
        <span style={{ fontFamily: D.mono, fontSize: 11, fontWeight: 700, color: D.text, letterSpacing: '0.08em' }}>
          DIAGNOSTIC RETINAL SALIENCY WORKSTATION
        </span>

        {/* Study chip */}
        <span style={{
          padding: '3px 10px', borderRadius: 5,
          background: '#f1f5f9', border: `1px solid ${D.border}`,
          fontFamily: D.mono, fontSize: 10, color: D.sub,
        }}>
          {studyId} · Eye: <strong style={{ color: D.teal }}>{eye.toUpperCase()} ({eye === 'od' ? 'Right' : 'Left'})</strong>
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Back + Refer */}
        <button onClick={handleBack} style={{
          all: 'unset', cursor: 'pointer',
          padding: '5px 12px', borderRadius: 6,
          background: '#f1f5f9', border: `1px solid ${D.border}`,
          fontFamily: D.mono, fontSize: 10, color: D.sub,
        }}>← Queue</button>

        <button onClick={handleRefer} style={{
          all: 'unset', cursor: 'pointer',
          padding: '5px 14px', borderRadius: 6,
          background: 'rgba(3,105,161,0.15)', border: '1px solid rgba(3,105,161,0.4)',
          fontFamily: D.mono, fontSize: 10, color: D.teal, fontWeight: 700,
        }}>Issue Referral →</button>
      </div>

      {/* ── Two-panel body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'auto', minHeight: 0 }}>

        {/* ════════════════════════════════════════════
            LEFT PANEL — PACS Viewport
        ════════════════════════════════════════════ */}
        <div style={{
          flex: '0 0 62%', display: 'flex', flexDirection: 'column',
          borderRight: `1px solid ${D.border}`,
          background: D.panel,
        }}>

          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            background: D.panel,
            borderBottom: `1px solid ${D.border}`,
            flexShrink: 0, flexWrap: 'wrap',
          }}>
            {/* Red-Free filter button */}
            <ToolBtn
              active={showRedFree}
              onClick={() => setShowRedFree(v => !v)}
              label="Red-Free (540nm)"
            />

            <div style={{ width: 1, height: 20, background: D.border }} />

            {/* Grad-CAM toggle — mutually exclusive with pins */}
            <ToolBtn
              active={showHeatmap}
              onClick={() => { setShowHeatmap(v => !v); setShowPins(false); }}
              label="Grad-CAM++"
              accent
            />

            <div style={{ width: 1, height: 20, background: D.border }} />

            {/* Pins toggle — mutually exclusive with heatmap */}
            <ToolBtn
              active={showPins}
              onClick={() => { setShowPins(v => !v); setShowHeatmap(false); }}
              label={`Pins (${lesions.length})`}
              icon="⊕"
            />

            <div style={{ flex: 1 }} />

            {/* Zoom control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} style={iconBtnStyle}>−</button>
              <span style={{ fontFamily: D.mono, fontSize: 10, color: D.teal, minWidth: 40, textAlign: 'center' }}>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} style={iconBtnStyle}>+</button>
            </div>

            {/* Reset */}
            <button onClick={() => { setZoom(100); setShowPins(true); setShowHeatmap(false); setShowRedFree(false); setRejected(false); }}
              style={iconBtnStyle} title="Reset view">↺</button>
          </div>

          {/* Viewport — dark bg so GradCAM screen-blend is visible */}
          <div style={{
            flex: 1, position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#1a1a2e',
            cursor: 'crosshair',
          }}>

            {/* Patient info — top left overlay */}
            <div style={{
              position: 'absolute', top: 14, left: 14, zIndex: 10,
              background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(8px)',
              border: `1px solid rgba(255,255,255,0.12)`,
              borderRadius: 6, padding: '8px 12px',
              fontFamily: D.mono, fontSize: 10, lineHeight: 1.8, color: '#94a3b8',
            }}>
              <div><span style={{ color: '#475569' }}>PATIENT: </span><strong style={{ color: '#e2e8f0' }}>{studyId}</strong></div>
              <div><span style={{ color: '#475569' }}>STUDY: </span>CFP 45° RETINAL SCAN</div>
              <div><span style={{ color: '#475569' }}>EYE: </span><strong style={{ color: '#38bdf8' }}>{eye.toUpperCase()} ({eye === 'od' ? 'RIGHT' : 'LEFT'})</strong></div>
              <div><span style={{ color: '#475569' }}>FOV: </span>45 DEGREE POSTERIOR POLE</div>
            </div>

            {/* Technical info — top right overlay */}
            <div style={{
              position: 'absolute', top: 14, right: 14, zIndex: 10,
              background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(8px)',
              border: `1px solid rgba(255,255,255,0.12)`,
              borderRadius: 6, padding: '8px 12px',
              fontFamily: D.mono, fontSize: 10, lineHeight: 1.8, color: '#94a3b8',
              textAlign: 'right',
            }}>
              <div><span style={{ color: '#475569' }}>ZOOM: </span><strong style={{ color: '#e2e8f0' }}>{zoom}%</strong></div>
              <div><span style={{ color: '#475569' }}>RED-FREE: </span><strong style={{ color: showRedFree ? '#4ade80' : '#475569' }}>{showRedFree ? 'ON' : 'OFF'}</strong></div>
              <div><span style={{ color: '#475569' }}>SALIENCY: </span><strong style={{ color: showHeatmap ? '#38bdf8' : '#475569' }}>{showHeatmap ? 'Grad-CAM++' : 'OFF'}</strong></div>
              <div><span style={{ color: '#475569' }}>RESOLUTION: </span>512 × 512 px</div>
            </div>

            {/* ── Circular fundus image with pins ── */}
            <div style={{
              position: 'relative',
              width: `${Math.min(540, 540 * zoom / 100)}px`,
              height: `${Math.min(540, 540 * zoom / 100)}px`,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(0,0,0,0.8)',
              flexShrink: 0,
            }}>
              {/* Fundus base */}
              <img
                src={fundusPath}
                alt={`Fundus OD Sev${sev}`}
                onError={e => { e.target.src = '/images/img_2_od.jpg'; }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  display: 'block',
                  filter: showRedFree
                    ? 'sepia(1) saturate(0.4) hue-rotate(100deg) contrast(1.3) brightness(1.1)'
                    : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />

              {/* Grad-CAM heatmap overlay */}
              {showHeatmap && (
                <img
                  src={heatmapPath}
                  alt="Grad-CAM"
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                    mixBlendMode: 'normal', opacity: 0.7,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Lesion pins */}
              {showPins && lesions.map((lesion, idx) => {
                const lt = lesionTypes[lesion.type] || lesionTypes.microaneurysm;
                const isHov = hoveredId === lesion.id;
                return (
                  <div
                    key={lesion.id}
                    style={{
                      position: 'absolute',
                      left: `${lesion.x}%`,
                      top:  `${lesion.y}%`,
                      zIndex: isHov ? 30 : 10,
                      pointerEvents: 'auto',
                    }}
                    onMouseEnter={() => setHoveredId(lesion.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Pulse ring */}
                    <div style={{
                      position: 'absolute',
                      width: 22, height: 22,
                      borderRadius: '50%',
                      border: `1.5px solid ${lt.color}`,
                      animation: `pin-pulse 2s ${idx * 0.15}s infinite`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                    }} />

                    {/* Pin dot */}
                    <div style={{
                      width: isHov ? 18 : 12,
                      height: isHov ? 18 : 12,
                      borderRadius: '50%',
                      background: lt.color,
                      border: `2px solid rgba(255,255,255,0.85)`,
                      boxShadow: `0 0 ${isHov ? 12 : 6}px ${lt.color}90`,
                      transform: 'translate(-50%, -50%)',
                      transition: 'all 0.15s cubic-bezier(0.4,0,0.2,1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: `pin-in 0.3s ${idx * 0.05}s both`,
                      cursor: 'crosshair',
                    }}>
                      {isHov && (
                        <span style={{ fontSize: 7, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: D.mono }}>
                          {lesion.id}
                        </span>
                      )}
                    </div>

                    {/* Hover tooltip */}
                    {isHov && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%', left: '50%',
                        transform: 'translateX(-50%) translateY(-10px)',
                        background: 'rgba(255,255,255,0.96)',
                        border: `1px solid ${lt.color}60`,
                        borderRadius: 7,
                        padding: '7px 11px',
                        whiteSpace: 'nowrap',
                        zIndex: 50,
                        pointerEvents: 'none',
                        boxShadow: `0 4px 20px rgba(0,0,0,0.7), 0 0 0 1px ${lt.color}30`,
                      }}>
                        <div style={{ fontFamily: D.mono, fontSize: 11, fontWeight: 700, color: lt.color, marginBottom: 3 }}>
                          #{lesion.id < 10 ? '0' + lesion.id : lesion.id} {lt.label.toUpperCase()}
                        </div>
                        <div style={{ fontFamily: D.mono, fontSize: 10, color: '#cbd5e1' }}>
                          Conf: <strong style={{ color: '#0f172a' }}>{lesion.confidence}%</strong>
                          &nbsp;&nbsp;Dim: <strong style={{ color: '#cbd5e1' }}>{(lesion.confidence * 0.056).toFixed(1)}%</strong>
                        </div>
                        <div style={{ fontFamily: D.mono, fontSize: 10, color: '#64748b', marginTop: 2 }}>
                          [{(lesion.x / 100).toFixed(2)}, {(lesion.y / 100).toFixed(2)}]
                        </div>
                        {/* Tooltip arrow */}
                        <div style={{
                          position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
                          width: 8, height: 8, background: 'rgba(255,255,255,0.96)',
                          border: `1px solid ${lt.color}60`, borderTop: 'none', borderLeft: 'none',
                          transform: 'translateX(-50%) rotate(45deg)',
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quadrant Radar — bottom right inset */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(8px)',
              border: `1px solid rgba(255,255,255,0.12)`,
              borderRadius: 8, padding: '10px 14px',
              fontFamily: D.mono, fontSize: 11,
              zIndex: 20,
            }}>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: '0.1em', marginBottom: 8, textAlign: 'center' }}>⊕ QUADRANT RADAR</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 20px', textAlign: 'center' }}>
                {[
                  { q: 'ST', label: 'ST' },
                  { q: 'SN', label: 'SN' },
                  { q: 'IT', label: 'IT' },
                  { q: 'IN', label: 'IN' },
                ].map(({ q, label }) => (
                  <div key={q}>
                    <span style={{ color: '#475569' }}>{label}: </span>
                    <strong style={{ color: '#38bdf8' }}>{quadCounts[q]}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 3-panel comparison strip ── */}
          <div style={{
            display: 'flex', gap: 0,
            borderTop: `1px solid #0f172a`,
            background: '#0a0e1a',
            flexShrink: 0,
            height: 110,
          }}>
            {[
              { label: 'ORIGINAL',   imgSrc: fundusPath,   filter: 'none',          accent: '#38bdf8', active: !showRedFree && !showHeatmap && !showPins },
              { label: 'RED-FREE',   imgSrc: fundusPath,   filter: 'sepia(1) saturate(0.4) hue-rotate(100deg) contrast(1.3) brightness(1.1)', accent: '#4ade80', active: showRedFree },
              { label: 'GRAD-CAM++', imgSrc: heatmapPath,  filter: 'none',          accent: '#fbbf24', active: showHeatmap, isHeatmap: true },
            ].map((panel, i) => (
              <div
                key={i}
                onClick={() => {
                  if (i === 0) { setShowRedFree(false); setShowHeatmap(false); setShowPins(true); }
                  if (i === 1) { setShowRedFree(v => !v); setShowHeatmap(false); }
                  if (i === 2) { setShowHeatmap(v => !v); setShowPins(false); setShowRedFree(false); }
                }}
                style={{
                  flex: 1, position: 'relative', cursor: 'pointer', overflow: 'hidden',
                  borderRight: i < 2 ? `1px solid #1e2a3a` : 'none',
                  outline: panel.active ? `2px solid ${panel.accent}` : 'none',
                  outlineOffset: '-2px',
                  transition: 'outline 0.2s',
                }}
              >
                {panel.isHeatmap ? (
                  <>
                    <img src={fundusPath} alt="fundus" onError={e => { e.target.src = '/images/img_2_od.jpg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.5 }} />
                    <img src={heatmapPath} alt="gradcam" onError={e => { e.target.style.display='none'; }}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'screen', opacity: 0.9 }} />
                  </>
                ) : (
                  <img src={panel.imgSrc} alt={panel.label} onError={e => { e.target.src = '/images/img_2_od.jpg'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: panel.filter }} />
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  padding: '16px 8px 6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700, color: panel.active ? panel.accent : '#64748b', letterSpacing: '0.08em' }}>
                    {panel.label}
                  </span>
                  {panel.active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: panel.accent, boxShadow: `0 0 4px ${panel.accent}` }} />}
                </div>
              </div>
            ))}
          </div>

          {/* ── Legend strip ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            padding: '10px 16px',
            background: D.panel, borderTop: `1px solid ${D.border}`,
            flexShrink: 0, flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: D.mono, fontSize: 9, color: D.muted, letterSpacing: '0.08em' }}>
              Pathological Markers:
            </span>
            {presentTypes.map(t => (
              <span key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: D.sub }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: t.color, display: 'inline-block',
                  boxShadow: `0 0 5px ${t.color}`,
                }} />
                {t.label}
              </span>
            ))}
            <div style={{ flex: 1 }} />
            <span style={{ fontFamily: D.mono, fontSize: 9, color: D.muted }}>
              Ben Graham Normalization · 512×512 Standard
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT PANEL — Metrics & Findings
        ════════════════════════════════════════════ */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: D.bg, overflow: 'hidden',
        }}>

          {/* ── ICDR Probability Distribution ── */}
          <div style={{
            padding: '18px 20px 16px',
            borderBottom: `1px solid ${D.border}`,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: D.mono, fontSize: 11, fontWeight: 700, color: D.text, letterSpacing: '0.06em' }}>
                ICDR ORDINAL PROBABILITY DISTRIBUTION
              </span>
              <span style={{ fontFamily: D.mono, fontSize: 9, color: D.teal, border: `1px solid ${D.border}`, padding: '2px 8px', borderRadius: 4 }}>
                Calibrated Softmax
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {GRADE_LABELS.map(g => {
                const prob    = probs[g.key] || 0;
                const isPred  = g.key === sev;
                return (
                  <div key={g.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Active indicator */}
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: isPred ? g.color : 'transparent',
                      border: isPred ? `2px solid ${g.color}` : '2px solid transparent',
                      boxShadow: isPred ? `0 0 6px ${g.color}` : 'none',
                    }} />
                    {/* Label */}
                    <span style={{
                      fontFamily: D.mono, fontSize: 11, minWidth: 168,
                      color: isPred ? D.text : D.sub,
                      fontWeight: isPred ? 700 : 400,
                    }}>
                      {g.name}
                    </span>
                    {/* Bar */}
                    <div style={{ flex: 1, height: 5, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${prob}%`,
                        background: isPred ? g.color : '#cbd5e1',
                        borderRadius: 3,
                        boxShadow: isPred ? `0 0 8px ${g.color}60` : 'none',
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                    {/* Percent */}
                    <span style={{
                      fontFamily: D.mono, fontSize: 11, minWidth: 32, textAlign: 'right',
                      color: isPred ? g.color : D.sub,
                      fontWeight: isPred ? 700 : 400,
                    }}>
                      {prob}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Indexed findings table ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px 10px',
              borderBottom: `1px solid ${D.border}`,
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: D.mono, fontSize: 11, fontWeight: 700, color: D.text, letterSpacing: '0.06em' }}>
                INDEXED PATHOLOGICAL FINDINGS ({lesions.length})
              </span>
              <span style={{ fontFamily: D.mono, fontSize: 9, color: D.teal }}>
                U-Net Segmentor (IDRiD)
              </span>
            </div>

            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '28px 80px 1fr 90px 44px',
              padding: '6px 20px',
              borderBottom: `1px solid ${D.border}`,
              flexShrink: 0,
            }}>
              {['#', 'Finding', 'Region', 'Coords', 'Conf'].map(h => (
                <span key={h} style={{ fontFamily: D.mono, fontSize: 9, color: D.muted, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {/* Scrollable rows */}
            <div
              ref={listRef}
              style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}
            >
              {lesions.length === 0 && (
                <div style={{ padding: '32px 20px', textAlign: 'center', fontFamily: D.mono, fontSize: 12, color: D.muted }}>
                  No lesions detected for Grade 0 (Healthy Fundus)
                </div>
              )}
              {lesions.map((lesion, idx) => {
                const lt     = lesionTypes[lesion.type] || lesionTypes.microaneurysm;
                const region = getLesionRegion(lesion.x, lesion.y);
                const isHov  = hoveredId === lesion.id;
                return (
                  <div
                    key={lesion.id}
                    data-id={lesion.id}
                    onMouseEnter={() => setHoveredId(lesion.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 80px 1fr 90px 44px',
                      padding: '8px 20px',
                      alignItems: 'center',
                      background: isHov ? 'rgba(3,105,161,0.07)' : 'transparent',
                      borderLeft: isHov ? `2px solid ${D.teal}` : '2px solid transparent',
                      transition: 'all 0.12s',
                      cursor: 'pointer',
                      borderBottom: `1px solid #e2e8f0`,
                    }}
                  >
                    {/* # */}
                    <span style={{ fontFamily: D.mono, fontSize: 11, color: D.muted }}>#{lesion.id}</span>

                    {/* Type badge */}
                    <span style={{
                      padding: '2px 8px', borderRadius: 4,
                      background: `${lt.color}20`,
                      border: `1px solid ${lt.color}50`,
                      fontFamily: D.mono, fontSize: 10, fontWeight: 700,
                      color: lt.color,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {lt.symbol}
                    </span>

                    {/* Region */}
                    <span style={{ fontFamily: D.mono, fontSize: 11, color: D.sub }}>{region}</span>

                    {/* Coords */}
                    <span style={{ fontFamily: D.mono, fontSize: 10, color: D.muted }}>
                      [{(lesion.x / 100).toFixed(2)}, {(lesion.y / 100).toFixed(2)}]
                    </span>

                    {/* Confidence */}
                    <span style={{
                      fontFamily: D.mono, fontSize: 11, fontWeight: 700,
                      color: lesion.confidence >= 90 ? '#22c55e' : lesion.confidence >= 80 ? D.teal : '#f59e0b',
                    }}>
                      {lesion.confidence}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── Bottom action bar ── */}
            <div style={{
              padding: '12px 20px',
              borderTop: `1px solid ${D.border}`,
              display: 'flex', gap: 10,
              flexShrink: 0,
              background: D.panel,
            }}>
              {/* Notes textarea */}
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Clinical notes — Dr. Arvind Mehta…"
                style={{
                  flex: 1, background: '#f1f5f9',
                  border: `1px solid ${D.border}`, borderRadius: 6,
                  color: D.text, fontFamily: D.mono, fontSize: 11,
                  padding: '8px 10px', resize: 'none', outline: 'none',
                  lineHeight: 1.5,
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(3,105,161,0.4)'; }}
                onBlur={e =>  { e.target.style.borderColor = D.border; }}
              />
              {/* Reject button */}
              <button
                onClick={() => { setRejected(true); }}
                style={{
                  all: 'unset', cursor: 'pointer',
                  padding: '0 16px', borderRadius: 7,
                  background: rejected ? 'rgba(220,38,38,0.25)' : 'rgba(220,38,38,0.1)',
                  border: `1px solid ${rejected ? 'rgba(220,38,38,0.7)' : 'rgba(220,38,38,0.35)'}`,
                  fontFamily: D.mono, fontSize: 11, fontWeight: 700,
                  color: rejected ? '#f87171' : '#ef4444',
                  display: 'flex', alignItems: 'center', gap: 6,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                {rejected ? '✗ Grade Rejected' : '✗ Reject Grade'}
              </button>

              {/* Confirm button */}
              <button
                onClick={() => { setRejected(false); handleRefer(); }}
                disabled={rejected}
                style={{
                  all: 'unset', cursor: rejected ? 'not-allowed' : 'pointer',
                  padding: '0 18px', borderRadius: 7,
                  background: rejected ? 'rgba(100,116,139,0.12)' : 'rgba(3,105,161,0.18)',
                  border: `1px solid ${rejected ? 'rgba(100,116,139,0.25)' : 'rgba(3,105,161,0.4)'}`,
                  fontFamily: D.mono, fontSize: 11, fontWeight: 700,
                  color: rejected ? D.muted : D.teal,
                  display: 'flex', alignItems: 'center', gap: 6,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  opacity: rejected ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                ✓ Confirm Grade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ─────────────────────────────────────────────── */
function ToolBtn({ active, onClick, label, accent, icon }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 5,
      background: active ? (accent ? 'rgba(3,105,161,0.15)' : '#e2e8f0') : 'transparent',
      border: `1px solid ${active ? (accent ? 'rgba(3,105,161,0.4)' : '#cbd5e1') : 'transparent'}`,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
      color: active ? (accent ? '#0369a1' : '#0f172a') : '#64748b',
      transition: 'all 0.12s',
    }}>
      {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
      {/* Checkbox-style indicator for Grad-CAM */}
      {accent && (
        <span style={{
          width: 12, height: 12, borderRadius: 3,
          background: active ? '#0369a1' : 'transparent',
          border: `1.5px solid ${active ? '#0369a1' : '#64748b'}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {active && <span style={{ fontSize: 8, color: '#ffffff', fontWeight: 900 }}>✓</span>}
        </span>
      )}
      {label}
    </button>
  );
}

const iconBtnStyle = {
  all: 'unset', cursor: 'pointer',
  width: 24, height: 24, borderRadius: 4,
  background: '#f1f5f9', border: '1px solid #e2e8f0',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
  color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1, transition: 'background 0.1s',
};
