import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      width: '100%', background: '#ffffff', borderTop: '1px solid #e2e8f0',
      padding: '12px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        <span style={{ fontWeight: 600, color: '#334155' }}>RetinaScan XAI</span>
        <span>·</span>
        <span>DR Inference v2.4.1</span>
        <span>·</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>140ms edge latency</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#64748b' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#0B5563' }}>✓</span>
          HIPAA · Offline-First
        </span>
        <span>SIH 2026 · MathWorks Track · Prototype only</span>
      </div>
    </footer>
  );
}
