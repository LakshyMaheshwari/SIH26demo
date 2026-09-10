import React, { useState } from 'react';

const PRESETS = [
  {
    key: 'P0', idx: 0,
    name: 'Priya S.', sub: 'PHC Mandawar · 34F',
    level: 'Level 0 — Healthy', severity: 0,
    badge: 'No DR', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    conf: '98.7%',
  },
  {
    key: 'A1', idx: 1,
    name: 'Arjun M.', sub: 'Kishangarh SC · 49M',
    level: 'Level 1 — Mild NPDR', severity: 1,
    badge: 'Mild', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    conf: '89.1%',
  },
  {
    key: 'G2', idx: 2,
    name: 'Geeta S.', sub: 'Alwar District · 58F',
    level: 'Level 2 — Moderate NPDR', severity: 2,
    badge: 'Moderate', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    conf: '96.4%',
    star: true,
  },
  {
    key: 'K3', idx: 3,
    name: 'Kiran D.', sub: 'Behror Mobile Unit · 71F',
    level: 'Level 3 — Severe NPDR', severity: 3,
    badge: 'Severe', badgeColor: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
    conf: '97.9%',
  },
];

export default function Upload({ navigate, onSelectPatient, handleUpload }) {
  const [selected, setSelected] = useState(2);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef(null);

  function handleStart(presetIdx) {
    const p = PRESETS[presetIdx ?? selected];
    onSelectPatient(p);
    navigate('processing');
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (handleUpload) handleUpload(file);
      else handleStart();
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (handleUpload) handleUpload(file);
      else handleStart();
    }
  }

  return (
    <main className="min-h-screen pt-14 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Patient Intake</h1>
              <p className="text-xs text-slate-400 mt-0.5">Upload fundus image or select a demo preset</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            Camera Ready · Non-Mydriatic OD/OS
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Drop zone */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept=".jpg,.jpeg,.png,.dcm,.dicom"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative w-full min-h-[260px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-[#0B5563] bg-teal-50 scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/30'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${dragOver ? 'bg-[#0B5563]' : 'bg-slate-100'}`}>
                <span className={`material-symbols-outlined text-[28px] transition-colors ${dragOver ? 'text-white' : 'text-slate-400'}`}>
                  {dragOver ? 'download' : 'cloud_upload'}
                </span>
              </div>
              <p className="text-[15px] font-semibold text-slate-800 mb-1">
                {dragOver ? 'Drop to upload' : 'Drag & drop fundus image'}
              </p>
              <p className="text-xs text-slate-400 mb-4">
                or <span className="text-[#0B5563] font-semibold">click to browse</span> from device / USB
              </p>
              <div className="flex items-center gap-2">
                {['.DICOM', '.JPG', '.PNG'].map(f => (
                  <span key={f} className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-slate-100 text-slate-500 rounded-md border border-slate-200">{f}</span>
                ))}
              </div>
              {/* Selected indicator */}
              <div className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 border border-teal-100">
                <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                <span className="text-xs font-mono text-teal-800 font-semibold">
                  Selected preset: OD_Fundus_{PRESETS[selected].key}_Case8821.dcm
                </span>
              </div>
            </div>

            {/* Run analysis button */}
            <button
              onClick={() => handleStart()}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#0B5563] hover:bg-[#08404a] text-white text-base font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings:"'FILL' 1"}}>play_circle</span>
              Run AI Analysis
              <span className="material-symbols-outlined text-[18px] opacity-70">arrow_forward</span>
            </button>

            {/* Bottom trust strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-[#0B5563]">shield</span>
                Zero-Knowledge On-Device
              </span>
              <span>·</span>
              <span>DICOM Tag Anonymization: Active</span>
              <span className="ml-auto font-mono text-slate-300">SESSION #DR-2025-0841</span>
            </div>
          </div>

          {/* Right: Preset patients */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Demo Presets</p>
              <span className="text-[11px] text-slate-400">Click to select + run</span>
            </div>
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => { setSelected(p.idx); handleStart(p.idx); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer group ${
                  selected === p.idx
                    ? 'border-[#0B5563] bg-white shadow-md ring-2 ring-[#0B5563]/10'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                }`}
              >
                {/* Avatar dot */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  selected === p.idx ? 'bg-[#0B5563] text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}>
                  {p.key}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {p.name}{p.star ? ' ★' : ''}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${p.badgeColor}`}>{p.badge}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{p.sub}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                    <span className="text-[11px] text-slate-500">{p.level}</span>
                    <span className="ml-auto text-[11px] font-mono text-slate-400">AI: {p.conf}</span>
                  </div>
                </div>
              </button>
            ))}

            {/* Hint */}
            <p className="text-[11px] text-slate-400 text-center pt-1">
              ★ Geeta S. is the recommended demo patient (Moderate NPDR)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
