import React, { useState } from 'react';

const SEVERITY_DETAILS = {
  0: {
    title: "No Apparent DR (ICDR Level 0)",
    category: "Healthy Fundus",
    description: "No diabetic retinopathy lesions detected. Clean vitreous and healthy macular architecture.",
    color: "emerald",
    bg: "bg-emerald-600",
    bannerBg: "bg-emerald-50 border-emerald-200 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-800",
    action: "Routine Annual Screening",
  },
  1: {
    title: "Mild NPDR (ICDR Level 1)",
    category: "Microaneurysms Only",
    description: "Isolated microaneurysms detected in peripheral quadrants. No macular edema or hard exudates.",
    color: "amber",
    bg: "bg-amber-600",
    bannerBg: "bg-amber-50 border-amber-200 text-amber-900",
    badge: "bg-amber-100 text-amber-800",
    action: "Review in 6–12 Months",
  },
  2: {
    title: "Moderate NPDR (ICDR Level 2)",
    category: "Microaneurysms & Blot Hemorrhages",
    description: "Microaneurysms and intraretinal hemorrhages in nasal & inferior quadrants. Early exudation noted.",
    color: "orange",
    bg: "bg-orange-600",
    bannerBg: "bg-orange-50 border-orange-200 text-orange-900",
    badge: "bg-orange-100 text-orange-800",
    action: "Specialist Triage Required",
  },
  3: {
    title: "Severe NPDR (ICDR Level 3)",
    category: "4-2-1 Rule Triggered",
    description: "Extensive intraretinal hemorrhages in all 4 quadrants, venous beading, and soft exudates (cotton-wool spots).",
    color: "rose",
    bg: "bg-rose-600",
    bannerBg: "bg-rose-50 border-rose-200 text-rose-900",
    badge: "bg-rose-100 text-rose-800",
    action: "Urgent Specialist Referral",
  },
  4: {
    title: "Proliferative DR (ICDR Level 4)",
    category: "Neovascularization (PDR)",
    description: "Neovascularization of the disc/retina with vitreous hemorrhage risk. High threat to central vision.",
    color: "red",
    bg: "bg-red-700",
    bannerBg: "bg-red-50 border-red-200 text-red-950",
    badge: "bg-red-100 text-red-800",
    action: "Emergency Laser / Surgical Review",
  },
};

export default function Results({
  navigate,
  patient,
  severity = 2,
  selectedEye = 'od',
  setSelectedEye = () => {},
  heatmapUrl = '',
  onQueue
}) {
  const [isInverted, setIsInverted] = useState(false);
  const [heatmapVisible, setHeatmapVisible] = useState(true);

  const currentSeverity = severity ?? patient?.severity ?? 2;
  const currentEye = selectedEye || 'od';
  const info = SEVERITY_DETAILS[currentSeverity] || SEVERITY_DETAILS[2];

  const fundusPath = `/images/img_${currentSeverity}_${currentEye}.jpg`;
  const heatmapPath = heatmapUrl || `/images/heatmap_${currentSeverity}_${currentEye}.jpg`;

  const name = patient?.fullName || patient?.name || 'Smt. Geeta Sharma';
  const confidence = patient?.confidence ?? (95 + currentSeverity * 1.1).toFixed(1);

  const handleQueueClick = () => {
    if (onQueue) {
      onQueue();
    } else if (navigate) {
      navigate('queue');
    }
  };

  return (
    <main className="w-full min-h-screen bg-slate-50 pt-20 pb-16 font-body-md text-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-6">

        {/* Top bar: Back breadcrumb & System Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate ? navigate('upload') : null}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-xs cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Upload</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-mono text-xs font-medium">
              CASE: <strong className="text-slate-900">{patient?.id || '#DR-2026-8841'}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              EDGE-INFERRED · LOCAL RIG
            </span>
          </div>
        </div>

        {/* Patient header card */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-xl bg-teal-50 border border-teal-200 text-[#0B5563] flex items-center justify-center font-bold text-lg shrink-0">
              <span className="material-symbols-outlined text-[28px]">person</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl md:text-2xl text-slate-900 font-bold tracking-tight">{name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold tracking-wide uppercase">
                  {patient?.gender === 'M' ? 'Male' : 'Female'} · {patient?.age || 54} Y
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold tracking-wide uppercase">
                  Type 2 Diabetes ({patient?.age ? `${patient.age - 46} yrs` : '8 yrs'})
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                <span>Location: <strong className="text-slate-700">{patient?.village || 'PHC Mandawar, Alwar'}</strong></span>
                <span>•</span>
                <span>Camera: <strong className="text-slate-700">Forus 3nethra 45°</strong></span>
                <span>•</span>
                <span className="font-mono text-slate-600">Captured: Today, 14:28 IST</span>
              </div>
            </div>
          </div>

          {/* Controls: Eye Toggle + Invert + Heatmap */}
          <div className="flex flex-wrap items-center gap-2.5">
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
                <span>Right Eye (OD)</span>
              </button>
              <button
                onClick={() => setSelectedEye('os')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentEye === 'os'
                    ? 'bg-[#0B5563] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Left Eye (OS)</span>
              </button>
            </div>

            {/* Invert */}
            <button
              onClick={() => setIsInverted(v => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                isInverted
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">contrast</span>
              <span>Optical Invert</span>
            </button>

            {/* Heatmap */}
            <button
              onClick={() => setHeatmapVisible(v => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                heatmapVisible
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {heatmapVisible ? 'visibility' : 'visibility_off'}
              </span>
              <span>Grad-CAM: {heatmapVisible ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Severity Banner */}
        <div className={`w-full rounded-2xl border p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors ${info.bannerBg}`}>
          <div className="flex items-start md:items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${info.bg}`}>
              <span className="material-symbols-outlined text-[28px]">
                {currentSeverity === 0 ? 'verified' : currentSeverity >= 3 ? 'emergency' : 'warning'}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xl font-bold tracking-tight text-slate-900">{info.title}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${info.badge}`}>
                  {info.category}
                </span>
              </div>
              <p className="text-sm text-slate-700 mt-1 max-w-2xl font-normal leading-relaxed">
                {patient?.findings || info.description}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center">
            <span className="px-4 py-2 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs font-mono text-xs font-bold uppercase text-slate-900 tracking-wide">
              {info.action}
            </span>
          </div>
        </div>

        {/* Core two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Fundus Viewport (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0B5563] text-[20px]">center_focus_strong</span>
                  <span className="font-bold text-slate-900 text-sm">
                    Fundus Heatmap Examination ({currentEye === 'od' ? 'Right Eye / OD' : 'Left Eye / OS'})
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold">
                  FOV 45° MACULAR
                </span>
              </div>

              {/* Viewport Box */}
              <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden select-none flex items-center justify-center group cursor-crosshair shadow-inner" id="retinaViewport">
                <img
                  alt={`Fundus Retina ${currentEye.toUpperCase()}`}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: isInverted ? 'invert(100%) contrast(140%) hue-rotate(180deg)' : 'none' }}
                  src={fundusPath}
                  onError={(e) => {
                    e.target.src = '/images/img_2_od.jpg';
                  }}
                />

                {/* Heatmap Overlay */}
                {heatmapVisible && (
                  <img
                    src={heatmapPath}
                    alt="Grad-CAM Heatmap"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-75 pointer-events-none transition-opacity duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* SVG Quadrant Reticle */}
                {heatmapVisible && currentSeverity >= 2 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" fill="none" viewBox="0 0 800 600">
                    <circle cx="400" cy="300" r="70" stroke="#38bdf8" strokeDasharray="4 4" strokeWidth="1.5"/>
                    <circle cx="400" cy="300" r="160" stroke="#38bdf8" strokeDasharray="6 6" strokeWidth="1.2"/>
                    <line stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1" x1="400" x2="400" y1="20" y2="580"/>
                    <line stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="1" x1="20" x2="780" y1="300" y2="300"/>
                    <text fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" x="410" y="45">SUPERIOR</text>
                    <text fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" x="410" y="575">INFERIOR</text>
                    <text fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" x="35" y="290">TEMPORAL</text>
                    <text fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" x="715" y="290">NASAL</text>
                    {/* Lesion Annotation Marker 1 */}
                    <circle cx="485" cy="340" fill="#f97316" fillOpacity="0.4" r="16"/>
                    <circle cx="485" cy="340" fill="#ef4444" r="4"/>
                    <rect fill="#0f172a" fillOpacity="0.85" height="22" rx="4" width="115" x="505" y="328"/>
                    <text fill="#e2e8f0" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" x="512" y="343">MA #01 (p=0.98)</text>
                    {/* Lesion Annotation Marker 2 */}
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
                    {heatmapVisible ? 'GRAD-CAM++ ACTIVE' : 'HEATMAP MUTED'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 font-mono text-[11px]">
                    ZOOM: 1.0×
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-emerald-400 font-mono text-[11px]">
                    QUALITY: 94/100
                  </span>
                </div>
              </div>

              {/* Viewport Telemetry Row */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: 'Camera Hardware', value: 'Forus 3nethra Pro' },
                  { label: 'Pupil Status', value: 'Non-Mydriatic (4.2mm)' },
                  { label: 'Optical Density', value: `${currentEye.toUpperCase()} 1.14 (Optimal)`, highlight: true },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
                    <span className={`font-mono text-xs font-bold mt-0.5 ${m.highlight ? 'text-[#0B5563]' : 'text-slate-800'}`}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Pathological Findings & Model Metrics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Inference Confidence Card */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0B5563] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                  <h2 className="font-bold text-slate-900 text-sm">Diagnostic Confidence</h2>
                </div>
                <span className="font-mono text-xl font-bold text-[#0B5563]">{confidence}%</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#0B5563] rounded-full transition-all duration-700"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
                <div className="flex justify-between font-mono text-[11px] text-slate-500">
                  <span>Standard Cutoff: 85.0%</span>
                  <span className="text-teal-700 font-bold">High Certainty (+{(confidence - 85).toFixed(1)}%)</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                DeepRetina-v4 ensemble model confirmed ICDR Level {currentSeverity} microvascular presentation with 0 dropped frames and zero cloud roundtrip.
              </p>
            </div>

            {/* Findings Breakdown */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900 text-sm">Pathological Biomarkers</h2>
                <span className="text-[11px] font-bold font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {currentEye.toUpperCase()} QUADRANTS
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  {
                    icon: 'lens_blur',
                    label: 'Microaneurysms & Blot Hems',
                    sub: 'Lesion count in nasal/inferior sectors',
                    val: currentSeverity === 0 ? '0 detected' : currentSeverity === 1 ? '3 detected' : '14 detected',
                    detail: currentSeverity === 0 ? 'Clear fundus' : '8 nasal / 6 inferior',
                    alert: currentSeverity >= 2,
                  },
                  {
                    icon: 'visibility_off',
                    label: 'Macular Edema Risk (DME)',
                    sub: 'Foveal avascular zone distance',
                    val: currentSeverity === 0 ? 'Negative' : currentSeverity < 3 ? 'Borderline' : 'High Risk',
                    detail: '> 500µm from center',
                    badge: true,
                    badgeColor: currentSeverity === 0 ? 'bg-emerald-50 text-emerald-700' : currentSeverity < 3 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700',
                  },
                  {
                    icon: 'scatter_plot',
                    label: 'Hard Exudates (Lipid)',
                    sub: 'Discrete ring patterns',
                    val: currentSeverity === 0 ? 'None' : currentSeverity === 1 ? '1 punctate' : 'Minimal (2 clusters)',
                    detail: 'Superior temporal quadrant',
                  },
                  {
                    icon: 'alt_route',
                    label: 'Venous Caliber (AVR)',
                    sub: 'Arteriolar-to-venous ratio',
                    val: currentSeverity >= 3 ? '0.52 (Beading)' : '0.64 (Normal)',
                    detail: currentSeverity >= 3 ? 'Venous beading noted' : 'No beading observed',
                  },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-[#0B5563] shrink-0">
                        <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{item.label}</span>
                        <span className="text-[11px] text-slate-500">{item.sub}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      {item.badge ? (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${item.badgeColor}`}>
                          {item.val}
                        </span>
                      ) : (
                        <span className={`font-mono text-xs font-bold ${item.alert ? 'text-orange-600' : 'text-slate-800'}`}>
                          {item.val}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Protocol Info */}
            <div className="w-full bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0B5563] text-[22px] mt-0.5">assignment_turned_in</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">National Health Protocol</span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Rural MoHFW protocol advises tele-ophthalmology sign-off within 48 hours for Grade {currentSeverity} cases before dispensary discharge.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Strip / CTA to Review Queue */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Step: Tele-Triage Verification</span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Submit to Regional Tele-Ophthalmology Queue</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Packages telemetry, full 45° DICOM images, and Grad-CAM layer to the district ophthalmologist triage console.
            </p>
          </div>
          <button
            onClick={handleQueueClick}
            className="w-full md:w-auto px-8 py-4 text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2.5 bg-[#0B5563] text-white hover:bg-[#093f4a] hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">outbox</span>
            <span>Send for Review</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </main>
  );
}
