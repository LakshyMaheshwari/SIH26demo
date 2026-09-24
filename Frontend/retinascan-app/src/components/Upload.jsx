import React, { useState } from 'react';
import { demoPresets, severityColors } from '../data.js';

const D = {
  bg:    '#f8fafc', panel: '#ffffff', border: '#e2e8f0',
  teal:  '#0369a1', text: '#0f172a', sub: '#334155', muted: '#64748b',
  mono:  'JetBrains Mono, "Courier New", monospace',
};

const SEVERITY_LABELS = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'Prolif. DR'];
const SEVERITY_COLORS = ['#22c55e', '#84cc16', '#f59e0b', '#ea580c', '#dc2626'];

/* Auto-generate PHC ID */
function genId() {
  return `PHC-MNW-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

function Field({ label, value, onChange, type = 'text', readOnly = false, unit, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontFamily: D.mono, fontSize: 10, color: D.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {options ? (
          <select value={value} onChange={e => onChange(e.target.value)} style={{
            width: '100%', padding: '9px 12px',
            background: readOnly ? '#f1f5f9' : '#ffffff',
            border: `1px solid ${D.border}`, borderRadius: 7,
            color: D.text, fontFamily: D.mono, fontSize: 12, outline: 'none',
            appearance: 'none',
          }}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type} value={value}
            onChange={e => onChange && onChange(e.target.value)}
            readOnly={readOnly}
            style={{
              width: '100%', padding: '9px 12px',
              background: readOnly ? '#f1f5f9' : '#ffffff',
              border: `1px solid ${readOnly ? D.border : '#cbd5e1'}`,
              borderRadius: 7, color: readOnly ? D.sub : D.text,
              fontFamily: D.mono, fontSize: 12, outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => { if (!readOnly) e.target.style.borderColor = 'rgba(3,105,161,0.5)'; }}
            onBlur={e => { e.target.style.borderColor = readOnly ? D.border : '#cbd5e1'; }}
          />
        )}
        {unit && (
          <span style={{
            position: 'absolute', right: 10,
            fontFamily: D.mono, fontSize: 10, color: D.muted,
          }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

function isLikelyFundus(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/jpg'];
  if (!validTypes.includes(file.type)) return false;
  if (file.size < 50000) return false; // <50KB probably not a fundus
  return true;
}

export default function Upload({ navigate, onSelectPatient, handleUpload }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patId] = useState(genId());
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Female', diabetesDuration: '', hba1c: '', eye: 'od',
  });
  const [dragOver, setDragOver] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');

  function selectPreset(p) {
    setSelectedPatient(p);
    setForm({
      name: p.fullName || p.name,
      age: String(p.age),
      gender: p.gender === 'M' ? 'Male' : 'Female',
      diabetesDuration: String(p.diabetesDuration || ''),
      hba1c: String(p.hba1c || ''),
      eye: 'od',
    });
    if (onSelectPatient) onSelectPatient({ ...p, selectedEye: 'od' });
  }

  function handleStart() {
    if (!selectedPatient) return;
    if (onSelectPatient) onSelectPatient({ ...selectedPatient, selectedEye: form.eye });
    navigate('qualitycheck');
  }

  const canStart = !!selectedPatient;

  return (
    <div style={{
      minHeight: '100vh', background: D.bg, color: D.text,
      fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column',
    }}>

      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '8px 20px', background: D.panel, borderBottom: `1px solid ${D.border}`,
        flexShrink: 0,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.4)' }} />
        <span style={{ fontFamily: D.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: D.text }}>
          POINT-OF-CARE ACQUISITION · PATIENT INTAKE
        </span>
        <span style={{ padding: '3px 10px', borderRadius: 5, background: '#f1f5f9', border: `1px solid ${D.border}`, fontFamily: D.mono, fontSize: 10, color: D.sub }}>
          PHC Mandawar · Alwar District, Rajasthan
        </span>
        <div style={{ flex: 1 }} />
        <button onClick={() => navigate('home')} style={{
          all: 'unset', cursor: 'pointer', padding: '5px 12px', borderRadius: 6,
          background: '#f1f5f9', border: `1px solid ${D.border}`,
          fontFamily: D.mono, fontSize: 10, color: D.sub,
        }}>← Home</button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>

        {/* ════ LEFT: Intake form ════ */}
        <div style={{
          flex: '0 0 420px', padding: '28px 28px',
          borderRight: `1px solid ${D.border}`, background: '#ffffff',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 800, color: D.text, letterSpacing: '-0.01em' }}>
              Patient Registration
            </h2>
            <p style={{ margin: 0, fontFamily: D.mono, fontSize: 11, color: D.muted }}>Select a demo patient, then verify or edit fields</p>
          </div>

          {/* Auto ID */}
          <div style={{ padding: '10px 14px', background: 'rgba(3,105,161,0.06)', border: '1px solid rgba(3,105,161,0.2)', borderRadius: 8 }}>
            <div style={{ fontFamily: D.mono, fontSize: 9, color: D.teal, letterSpacing: '0.1em', marginBottom: 4 }}>AUTO-GENERATED PATIENT ID</div>
            <div style={{ fontFamily: D.mono, fontSize: 16, fontWeight: 800, color: D.teal }}>{selectedPatient?.id || patId}</div>
          </div>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Patient Full Name"    value={form.name}             onChange={v => setForm(f => ({ ...f, name: v }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Age (years)"        value={form.age}              onChange={v => setForm(f => ({ ...f, age: v }))}              type="number" />
              <Field label="Gender"             value={form.gender}           onChange={v => setForm(f => ({ ...f, gender: v }))}            options={['Female', 'Male', 'Other']} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Diabetes Duration"  value={form.diabetesDuration} onChange={v => setForm(f => ({ ...f, diabetesDuration: v }))} type="number" unit="yrs" />
              <Field label="HbA1c"              value={form.hba1c}            onChange={v => setForm(f => ({ ...f, hba1c: v }))}            type="number" unit="%" />
            </div>
          </div>

          {/* Eye selector */}
          <div>
            <div style={{ fontFamily: D.mono, fontSize: 10, color: D.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
              Select Eye for Screening
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { key: 'od', label: 'OD', sub: 'Right Eye (Oculus Dexter)' },
                { key: 'os', label: 'OS', sub: 'Left Eye (Oculus Sinister)' },
                { key: 'both', label: 'BOTH', sub: 'Bilateral Screening' },
              ].map(e => (
                <button key={e.key} onClick={() => setForm(f => ({ ...f, eye: e.key }))} style={{
                  all: 'unset', cursor: 'pointer', flex: 1,
                  padding: '10px 8px', borderRadius: 8, textAlign: 'center',
                  background: form.eye === e.key ? 'rgba(3,105,161,0.08)' : '#ffffff',
                  border: `1px solid ${form.eye === e.key ? 'rgba(3,105,161,0.4)' : D.border}`,
                }}>
                  <div style={{ fontFamily: D.mono, fontSize: 14, fontWeight: 800, color: form.eye === e.key ? D.teal : D.sub }}>{e.label}</div>
                  <div style={{ fontFamily: D.mono, fontSize: 9, color: D.muted, marginTop: 3 }}>{e.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            style={{
              all: 'unset', cursor: canStart ? 'pointer' : 'not-allowed',
              padding: '14px 20px', borderRadius: 10, textAlign: 'center',
              background: canStart ? 'rgba(3,105,161,0.1)' : '#f1f5f9',
              border: `1px solid ${canStart ? 'rgba(3,105,161,0.5)' : D.border}`,
              fontFamily: D.mono, fontSize: 13, fontWeight: 700,
              color: canStart ? D.teal : D.muted,
              transition: 'all 0.15s',
            }}
          >
            {canStart ? '▶ Start Image Quality Assessment' : '← Select a patient to begin'}
          </button>

          {canStart && (
            <div style={{ fontFamily: D.mono, fontSize: 10, color: D.muted, textAlign: 'center' }}>
              IQA → DeepRetina-v4 inference → Grad-CAM++ XAI
            </div>
          )}
        </div>

        {/* ════ RIGHT: Demo patient selector ════ */}
        <div style={{ flex: 1, padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 800, color: D.text, letterSpacing: '-0.01em' }}>
              Demo Patients
            </h2>
            <p style={{ margin: 0, fontFamily: D.mono, fontSize: 11, color: D.muted }}>Click any patient to auto-fill the intake form</p>
          </div>

          {/* Patient preset cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {demoPresets.map(p => {
              const sCol = SEVERITY_COLORS[p.severity] || '#22c55e';
              const isSelected = selectedPatient?.id === p.id;
              return (
                <button key={p.id} onClick={() => selectPreset(p)} style={{
                  all: 'unset', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 18px', borderRadius: 12,
                  background: isSelected ? `${sCol}12` : '#ffffff',
                  border: `1px solid ${isSelected ? sCol + '60' : D.border}`,
                  borderLeft: `4px solid ${sCol}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  transition: 'all 0.15s',
                }}>
                  {/* Retina thumbnail */}
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                    border: `2px solid ${sCol}50`,
                    boxShadow: isSelected ? `0 0 12px ${sCol}40` : 'none',
                  }}>
                    <img
                      src={`/images/img_${p.severity}_od.jpg`}
                      alt={p.fullName}
                      onError={e => { e.target.src = '/images/img_2_od.jpg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: D.text, marginBottom: 3 }}>
                      {p.fullName || p.name}
                    </div>
                    <div style={{ fontFamily: D.mono, fontSize: 10, color: D.sub, marginBottom: 6 }}>
                      {p.age}Y · {p.gender === 'F' ? 'Female' : 'Male'} · {p.village}
                    </div>
                    <div style={{ fontFamily: D.mono, fontSize: 10, color: D.muted }}>
                      {p.findings}
                    </div>
                  </div>

                  {/* Grade badge */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 6,
                      background: `${sCol}18`, border: `1px solid ${sCol}40`,
                      fontFamily: D.mono, fontSize: 11, fontWeight: 700, color: sCol,
                      marginBottom: 5,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: sCol }} />
                      Level {p.severity}
                    </div>
                    <div style={{ fontFamily: D.mono, fontSize: 10, color: D.muted }}>{p.confidence}% conf.</div>
                  </div>

                  {isSelected && (
                    <span style={{ fontFamily: D.mono, fontSize: 10, fontWeight: 700, color: D.teal }}>✓ SELECTED</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Upload preview */}
          {uploadPreview && (
            <div style={{
              padding: '16px', borderRadius: 12,
              background: 'rgba(3,105,161,0.06)', border: '1px solid rgba(3,105,161,0.2)',
              marginBottom: 16, textAlign: 'center',
            }}>
              <div style={{ fontFamily: D.mono, fontSize: 10, color: D.teal, fontWeight: 700, marginBottom: 8 }}>
                ✓ Fundus image detected — ready for analysis
              </div>
              <img src={uploadPreview} alt="Preview" style={{
                width: 120, height: 120, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid rgba(3,105,161,0.3)',
              }} />
              <div style={{ fontFamily: D.mono, fontSize: 9, color: D.muted, marginTop: 6 }}>
                {uploadPreview.split(',')[0].split(';')[1]?.split('=')[1] || 'Uploaded image'}
              </div>
            </div>
          )}

          {/* Error message */}
          {uploadError && (
            <div style={{
              padding: '12px 16px', borderRadius: 8,
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
              marginBottom: 16, fontSize: 12, color: '#dc2626', fontFamily: D.mono,
            }}>
              <span style={{ fontFamily: D.mono }}>{uploadError} — Please upload a retinal fundus image (JPG/PNG/TIFF, &gt;50KB)</span>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault(); setDragOver(false); setUploadError('');
              const file = e.dataTransfer.files[0];
              if (file) {
                if (!isLikelyFundus(file)) {
                  setUploadError('Not a recognized fundus format');
                  return;
                }
                const url = URL.createObjectURL(file);
                setUploadPreview(url);
                if (handleUpload) handleUpload(file);
              }
            }}
            style={{
              padding: '24px 20px', borderRadius: 12, textAlign: 'center',
              border: `2px dashed ${dragOver ? D.teal : D.border}`,
              background: dragOver ? 'rgba(3,105,161,0.06)' : '#ffffff',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontFamily: D.mono, fontSize: 11, color: D.muted, marginBottom: 6 }}>
              Or drop a real fundus image here to run live inference
            </div>
            <div style={{ fontFamily: D.mono, fontSize: 10, color: D.muted }}>
              JPG · PNG · TIFF · DICOM supported · Min 50KB
            </div>
            <label style={{
              display: 'inline-block', marginTop: 12,
              padding: '7px 18px', borderRadius: 7,
              background: '#f1f5f9', border: `1px solid ${D.border}`,
              fontFamily: D.mono, fontSize: 11, color: D.sub, cursor: 'pointer',
            }}>
              Browse File
              <input type="file" accept=".jpg,.jpeg,.png,.tiff,.dcm" style={{ display: 'none' }}
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) {
                    if (!isLikelyFundus(f)) {
                      setUploadError('Invalid file type or size');
                      return;
                    }
                    setUploadError('');
                    setUploadPreview(URL.createObjectURL(f));
                    if (handleUpload) handleUpload(f);
                  }
                }} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
