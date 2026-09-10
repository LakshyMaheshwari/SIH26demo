import React from 'react';

const STATS = [
  { num: '98.4%', label: 'Sensitivity', desc: 'Validated against ICDR clinical grading' },
  { num: '140ms', label: 'Inference', desc: 'On-device, no cloud dependency' },
  { num: '5K+', label: 'Patients Screened', desc: 'Across 18 rural PHCs in Rajasthan' },
  { num: 'ICDR', label: 'Grading Standard', desc: 'Int\'l Clinical DR severity scale' },
];

const FEATURES = [
  {
    icon: 'biotech',
    title: 'Explainable AI Grading',
    desc: 'Grad-CAM++ saliency maps pinpoint every microaneurysm, hemorrhage, and hard exudate — giving field workers and remote specialists visual proof, not just a number.',
    tag: 'XAI',
  },
  {
    icon: 'wifi_off',
    title: 'Offline-First Architecture',
    desc: 'Runs fully on a handheld tablet with no internet. Cases queue locally and auto-sync to district hospital servers when connectivity resumes.',
    tag: 'Edge',
  },
  {
    icon: 'outbox',
    title: 'Tele-Referral Pipeline',
    desc: 'One-tap dispatch packages the full DICOM image, AI report, and Grad-CAM overlay into a HL7-FHIR R4 bundle sent directly to the ophthalmologist queue.',
    tag: 'FHIR R4',
  },
];

export default function Home({ navigate }) {
  return (
    <main className="w-full min-h-screen bg-white font-body-md text-on-surface">
      {/* ─────────── HERO ─────────── */}
      <section className="pt-24 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left copy */}
          <div className="flex flex-col gap-6">
            {/* Status pill */}
            <div className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-teal-800 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              SIH 2026 · Problem #SIH26038 · MathWorks Track
            </div>

            <h1 className="font-headline-xl text-[42px] leading-[1.15] tracking-tight text-slate-900 font-bold">
              AI-Powered Diabetic<br/>
              <span className="text-[#0B5563]">Retinopathy Screening</span><br/>
              for Rural India
            </h1>

            <p className="text-[15px] leading-7 text-slate-500 max-w-lg">
              RetinaScan XAI brings specialist-grade fundus analysis directly to primary health centres — no ophthalmologist on-site required. Instant ICDR grading, explainable heatmaps, and seamless tele-referral.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('upload')}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0B5563] text-white text-sm font-bold shadow-md hover:bg-[#093f4a] hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings:"'FILL' 1"}}>play_circle</span>
                Run Live Demo
              </button>
              <button
                onClick={() => navigate('queue')}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">assignment</span>
                View Queue
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              {['MathWorks Sponsored', 'ICDR Validated', 'HL7-FHIR R4', 'NHA Ayushman'].map(b => (
                <span key={b} className="px-3 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-full tracking-wide">{b}</span>
              ))}
            </div>
          </div>

          {/* Right — clinical card */}
          <div className="relative hidden lg:block">
            {/* Outer card */}
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-800 border-b border-slate-700/60">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 tracking-wide">RetinaScan XAI — Canvas View — OD Active</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  EDGE INFERENCE READY
                </span>
              </div>

              {/* Mock fundus frame */}
              <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center">
                <img
                  src="/images/img_2_od.jpg"
                  alt="Fundus OD demo"
                  className="w-full h-full object-cover opacity-85"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                {/* HUD overlays */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm text-cyan-300 text-[10px] font-mono tracking-wider">OD • RIGHT EYE</span>
                  <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-mono">GRAD-CAM++ ACTIVE</span>
                </div>
                <div className="absolute top-3 right-3 pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-[#F97316]/90 text-white text-[10px] font-bold tracking-widest">MODERATE NPDR</span>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1.5 pointer-events-none">
                  <span className="px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">2848 × 2848</span>
                  <span className="px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">QUALITY 92/100</span>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-5 py-3.5 bg-slate-800 border-t border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-300 font-bold">GS</div>
                  <div>
                    <p className="text-[11px] text-white font-semibold">Smt. Geeta Sharma</p>
                    <p className="text-[10px] text-slate-400 font-mono">#DR-88219 • 58F • Alwar District</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">Conf: 96.4%</span>
                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">Urgent Triage</span>
                </div>
              </div>
            </div>

            {/* Floating lesion card */}
            <div className="absolute -bottom-5 -left-8 bg-white rounded-xl shadow-xl border border-slate-100 p-4 w-48">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-2">Detected Lesions</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-700">Microaneurysms</span>
                  <span className="text-[11px] font-bold text-[#F97316]">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-700">Hard Exudates</span>
                  <span className="text-[11px] font-bold text-amber-600">6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-700">Cotton Wool</span>
                  <span className="text-[11px] font-bold text-slate-600">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── STATS BAR ─────────── */}
      <section className="border-t border-b border-slate-100 bg-slate-50 py-8 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="flex flex-col">
              <span className="text-3xl font-bold text-[#0B5563] tracking-tight">{s.num}</span>
              <span className="text-sm font-semibold text-slate-800 mt-0.5">{s.label}</span>
              <span className="text-xs text-slate-400 mt-0.5 leading-4">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-semibold text-[#0B5563] uppercase tracking-widest">How it works</span>
          <h2 className="text-[28px] font-bold text-slate-900 mt-1 tracking-tight">Built for the last mile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-teal-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0B5563] text-[22px]">{f.icon}</span>
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold text-teal-700 bg-teal-50 rounded-full tracking-widest uppercase">{f.tag}</span>
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-[13px] leading-6 text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── GOLDEN PATH CTA ─────────── */}
      <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-[#0B5563] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-teal-200 text-xs font-bold uppercase tracking-widest mb-2">Live Hackathon Demo</p>
            <h3 className="text-2xl font-bold text-white mb-2">Walk the golden path</h3>
            <p className="text-teal-100/80 text-sm max-w-md leading-6">
              Select a preset patient (Level 0–3), watch the AI inference, review heatmaps, and generate a tele-referral slip — in under 30 seconds.
            </p>
            <div className="flex gap-4 mt-4">
              {[
                { level: 0, label: 'Level 0', color: 'bg-emerald-400' },
                { level: 1, label: 'Level 1', color: 'bg-amber-400' },
                { level: 2, label: 'Level 2 ★', color: 'bg-orange-400' },
                { level: 3, label: 'Level 3', color: 'bg-red-400' },
              ].map(p => (
                <div key={p.level} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`}></span>
                  <span className="text-[11px] text-teal-100 font-semibold">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate('upload')}
            className="flex items-center gap-3 px-10 py-4 rounded-xl bg-white text-[#0B5563] text-base font-bold hover:bg-teal-50 shadow-md transition-all duration-200 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings:"'FILL' 1"}}>play_circle</span>
            Start Clinical Demo
          </button>
        </div>
      </section>

      {/* ─────────── FOOTER-LIKE INFO ─────────── */}
      <section className="pb-10 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#0B5563]">local_hospital</span>
            <span className="font-semibold text-slate-600">RetinaScan XAI</span>
            <span>· Rural DR Screening · SIH 2026 #SIH26038</span>
          </div>
          <div className="flex items-center gap-4">
            <span>MathWorks Sponsored</span>
            <span>·</span>
            <span>Team Prototype — Not for clinical use</span>
          </div>
        </div>
      </section>
    </main>
  );
}
