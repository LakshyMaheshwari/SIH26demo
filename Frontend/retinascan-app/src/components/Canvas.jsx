import React, { useState } from 'react';

const SEVERITY_CLASSIFICATIONS = {
  0: {
    level: "ICDR Level 0",
    name: "No Apparent Diabetic Retinopathy",
    desc: "Clean vascular tree with no microaneurysms, hemorrhages, or exudates. Normal foveal architecture.",
    ma: "0 lesions",
    he: "None",
    cws: "None",
    dme: "0.2%",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  1: {
    level: "ICDR Level 1",
    name: "Mild Non-Proliferative Retinopathy",
    desc: "Isolated microaneurysms detected in temporal periphery. Absence of hard exudates and venous changes.",
    ma: "3 lesions",
    he: "1 punctate",
    cws: "None",
    dme: "4.1%",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  2: {
    level: "ICDR Level 2",
    name: "Moderate Non-Proliferative Retinopathy",
    desc: "Multiple microaneurysms detected in >2 quadrants. Blot hemorrhages with early macular circinate lipid exudates present.",
    ma: "14 lesions",
    he: "6 distinct",
    cws: "2 foci",
    dme: "64.8%",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
  3: {
    level: "ICDR Level 3",
    name: "Severe Non-Proliferative Retinopathy",
    desc: "Extensive intraretinal hemorrhages in 4 quadrants, significant venous beading, and prominent cotton wool spots.",
    ma: "38 lesions",
    he: "Multiple clusters",
    cws: "8 foci",
    dme: "88.4%",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  4: {
    level: "ICDR Level 4",
    name: "Proliferative Diabetic Retinopathy (PDR)",
    desc: "Neovascularization of the disc/elsewhere with high hemorrhage risk. Requires urgent laser/surgical intervention.",
    ma: "> 50 lesions",
    he: "Extensive",
    cws: "Widespread",
    dme: "94.6%",
    badge: "bg-red-50 text-red-800 border-red-200",
  },
};

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
  const [layerHeatmap, setLayerHeatmap] = useState(true);
  const [layerVessels, setLayerVessels] = useState(true);
  const [layerExudates, setLayerExudates] = useState(true);
  const [isInverted, setIsInverted] = useState(false);

  const currentSeverity = severity ?? patient?.severity ?? 2;
  const currentEye = selectedEye || 'od';
  const info = SEVERITY_CLASSIFICATIONS[currentSeverity] || SEVERITY_CLASSIFICATIONS[2];

  const fundusPath = `/images/img_${currentSeverity}_${currentEye}.jpg`;
  const heatmapPath = heatmapUrl || `/images/heatmap_${currentSeverity}_${currentEye}.jpg`;

  const [notes, setNotes] = useState(
    `Verified ${info.name}. Prescribe optical coherence tomography (OCT) scan and ophthalmology review within ${currentSeverity >= 2 ? '14 days' : 'annual routine window'}.`
  );

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigate) navigate('queue');
  };

  const handleRefer = () => {
    if (onRefer) onRefer();
    else if (navigate) navigate('referral');
  };

  return (
    <main className="w-full min-h-screen bg-slate-50 pt-20 pb-16 font-body-md text-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-6">

        {/* Header bar: Back button + Case tag */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Queue</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-md font-medium">
              CASE: <strong className="text-slate-900">{patient?.id || '#DR-88219'}</strong> · {currentEye.toUpperCase()} ACTIVE
            </span>
            <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold border ${info.badge}`}>
              {info.level}
            </span>
          </div>
        </div>

        {/* Main Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: PACS Inspection Canvas & Controls (7 or 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Control Strip */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              
              {/* Eye Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setSelectedEye('od')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentEye === 'od'
                      ? 'bg-[#0B5563] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>OD (Right)</span>
                </button>
                <button
                  onClick={() => setSelectedEye('os')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentEye === 'os'
                      ? 'bg-[#0B5563] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>OS (Left)</span>
                </button>
              </div>

              {/* Layer Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLayerHeatmap(v => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    layerHeatmap
                      ? 'bg-teal-50 text-teal-800 border-teal-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {layerHeatmap ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span>Heatmap</span>
                </button>

                <button
                  onClick={() => setLayerVessels(v => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    layerVessels
                      ? 'bg-teal-50 text-teal-800 border-teal-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {layerVessels ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span>Grid & Markers</span>
                </button>

                <button
                  onClick={() => setIsInverted(v => !v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isInverted
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">contrast</span>
                  <span>Invert</span>
                </button>
              </div>

            </div>

            {/* Canvas Viewport */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-3">
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden select-none flex items-center justify-center cursor-crosshair shadow-inner">
                {/* Base Fundus Image */}
                <img
                  alt={`Fundus Retina ${currentEye.toUpperCase()}`}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: isInverted ? 'invert(100%) contrast(140%) hue-rotate(180deg)' : 'none' }}
                  src={fundusPath}
                  onError={(e) => {
                    e.target.src = '/images/img_2_od.jpg';
                  }}
                />

                {/* Grad-CAM Layer */}
                {layerHeatmap && (
                  <img
                    src={heatmapPath}
                    alt="Grad-CAM Overlay"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-75 pointer-events-none transition-opacity duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Reticle & Lesion Bounding Boxes */}
                {layerVessels && currentSeverity >= 2 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45" fill="none" viewBox="0 0 800 600">
                    <circle cx="400" cy="300" r="75" stroke="#38bdf8" strokeDasharray="4 4" strokeWidth="1.5"/>
                    <circle cx="400" cy="300" r="170" stroke="#38bdf8" strokeDasharray="6 6" strokeWidth="1.2"/>
                    <line stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1" x1="400" x2="400" y1="20" y2="580"/>
                    <line stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1" x1="20" x2="780" y1="300" y2="300"/>
                    
                    {/* Lesion 1 */}
                    <circle cx="485" cy="340" fill="#f97316" fillOpacity="0.4" r="16"/>
                    <circle cx="485" cy="340" fill="#ef4444" r="4"/>
                    <rect fill="#0f172a" fillOpacity="0.85" height="22" rx="4" width="115" x="505" y="328"/>
                    <text fill="#e2e8f0" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" x="512" y="343">MA #01 (p=0.98)</text>
                    
                    {/* Lesion 2 */}
                    <circle cx="330" cy="240" fill="#f97316" fillOpacity="0.4" r="20"/>
                    <circle cx="330" cy="240" fill="#ef4444" r="5"/>
                    <rect fill="#0f172a" fillOpacity="0.85" height="22" rx="4" width="120" x="200" y="228"/>
                    <text fill="#e2e8f0" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" x="207" y="243">HEM #04 (Blot)</text>
                  </svg>
                )}

                {/* HUD info overlays */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-teal-300 font-mono text-[11px] font-semibold uppercase">
                    {currentEye}: {currentEye === 'od' ? 'RIGHT EYE' : 'LEFT EYE'}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 font-mono text-[11px]">
                    ANALYTICAL CANVAS
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 font-mono text-[11px]">
                    ZOOM: 1.0× NATIVE
                  </span>
                </div>
              </div>

              {/* Viewport footer tools strip */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500 font-mono">
                <span>Remidio NM-FOP 10 · 2048×1536</span>
                <span>Fovea Centered · 45° FOV</span>
              </div>
            </div>

          </div>

          {/* Right: Specialist Diagnostic Sign-Off & Referral Dispatch (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Diagnosis Summary Card */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">Automated Pathometry</h3>
                <span className="text-[11px] font-bold font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  ICDR SCALE
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-slate-900">{info.name}</span>
                <p className="text-xs text-slate-500 leading-relaxed">{info.desc}</p>
              </div>

              {/* Lesion metrics table */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { label: 'Microaneurysms', val: info.ma },
                  { label: 'Hard Exudates', val: info.he },
                  { label: 'Cotton-Wool Spots', val: info.cws },
                  { label: 'Macular Edema Risk', val: info.dme, highlight: currentSeverity >= 2 },
                ].map((m) => (
                  <div key={m.label} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{m.label}</span>
                    <span className={`font-mono text-xs font-bold mt-0.5 ${m.highlight ? 'text-orange-600' : 'text-slate-800'}`}>
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Notes Card */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Specialist Tele-Notes</h3>
                <span className="text-[11px] text-slate-400 font-mono">Dr. Arvind Mehta</span>
              </div>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 leading-relaxed transition-all"
                placeholder="Enter clinical observations, treatment orders, or tele-consult instructions..."
              />

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                <span>Appends digital cryptographic signature</span>
              </div>
            </div>

            {/* Primary Action Button: Move to Referral Slip */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Action</span>
                <span className="text-xs font-semibold text-slate-700 mt-0.5">
                  Generate Official Clinical Referral Slip
                </span>
              </div>

              <button
                onClick={handleRefer}
                className="w-full px-6 py-4 rounded-xl bg-[#0B5563] hover:bg-[#093f4a] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">assignment</span>
                <span>Issue Referral Slip</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
