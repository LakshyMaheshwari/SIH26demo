import React, { useEffect, useState } from 'react';

const STEPS = [
  { icon: 'upload_file',    label: 'Loading Fundus Image',           sub: 'DICOM packet verified & decompressed' },
  { icon: 'psychology',     label: 'Running DeepRetina-v4 Inference', sub: 'ResNet-152 edge model executing on-device' },
  { icon: 'hub',            label: 'Generating Grad-CAM++ Heatmap',   sub: 'XAI saliency map rendering complete' },
];

export default function Processing({ navigate, patient }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => { setDone(true); }, 2500);
    const t4 = setTimeout(() => navigate('results'), 2800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const progress = done ? 100 : Math.round((step / STEPS.length) * 100);

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-slate-950 pt-0">
      <div className="w-full max-w-xl mx-auto px-8 py-16 flex flex-col items-center">

        {/* Spinner */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-10">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-800"></div>
          {/* Spinning arc */}
          <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 border-r-teal-400/30"></div>
          {/* Inner icon */}
          <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
            <span
              className="material-symbols-outlined text-teal-400 text-[28px]"
              style={{fontVariationSettings: done ? "'FILL' 1" : "'FILL' 0"}}
            >
              {done ? 'check_circle' : 'biotech'}
            </span>
          </div>
        </div>

        {/* Status text */}
        <h1 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">
          {done ? 'Analysis Complete' : 'Analysing Fundus Image…'}
        </h1>
        <p className="text-sm text-slate-400 text-center mb-10 font-mono">
          {patient ? `${patient.name} · ICDR Level ${patient.severity ?? '?'}` : 'DeepRetina-v4 running on-device'}
        </p>

        {/* Steps */}
        <div className="w-full flex flex-col gap-3 mb-8">
          {STEPS.map((s, i) => {
            const isActive = i === step && !done;
            const isDone   = i < step || done;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-500 ${
                  isDone
                    ? 'bg-teal-950/60 border-teal-800/50'
                    : isActive
                    ? 'bg-slate-900 border-slate-700 ring-1 ring-teal-500/30'
                    : 'bg-slate-900/40 border-slate-800/50 opacity-40'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-teal-500/20' : isActive ? 'bg-slate-800' : 'bg-slate-900'
                }`}>
                  {isDone
                    ? <span className="material-symbols-outlined text-teal-400 text-[18px]" style={{fontVariationSettings:"'FILL' 1"}}>check</span>
                    : isActive
                    ? <span className="material-symbols-outlined text-teal-400 text-[18px] animate-pulse">{s.icon}</span>
                    : <span className="material-symbols-outlined text-slate-600 text-[18px]">{s.icon}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${isDone || isActive ? 'text-white' : 'text-slate-600'}`}>{s.label}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{s.sub}</p>
                </div>
                {isActive && (
                  <div className="flex items-center gap-1">
                    {[0, 150, 300].map(d => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
                        style={{animationDelay: `${d}ms`}}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
            <span>Inference pipeline</span>
            <span className={done ? 'text-teal-400' : 'text-slate-400'}>{progress}% complete</span>
          </div>
        </div>

        {/* Device info */}
        <div className="mt-8 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="material-symbols-outlined text-slate-500 text-[16px]">tablet_android</span>
          <span className="text-[11px] font-mono text-slate-500">Remidio FOP NM · Bundi-04 PHC · Offline Buffer: 32 MB</span>
        </div>
      </div>
    </main>
  );
}
