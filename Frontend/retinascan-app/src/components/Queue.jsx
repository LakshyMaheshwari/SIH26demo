import React, { useState } from 'react';

export default function Queue({ navigate, patient, severity = 2, selectedEye = 'od' }) {
  const [activeTab, setActiveTab] = useState('all');

  const name = patient?.fullName || patient?.name || 'Smt. Geeta Sharma';
  const currentSeverity = severity ?? patient?.severity ?? 2;
  const currentEye = selectedEye?.toUpperCase() || 'OD';

  const severityConfigs = {
    0: { label: 'Level 0 — Healthy', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    1: { label: 'Level 1 — Mild NPDR', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    2: { label: 'Level 2 — Moderate NPDR', badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    3: { label: 'Level 3 — Severe NPDR', badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    4: { label: 'Level 4 — Proliferative DR', badge: 'bg-red-50 text-red-800 border-red-200', dot: 'bg-red-600' },
  };

  const currentSevConfig = severityConfigs[currentSeverity] || severityConfigs[2];

  return (
    <main className="w-full min-h-screen bg-slate-50 pt-20 pb-16 font-body-md text-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-6">

        {/* Breadcrumb + Node telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('results')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Results</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 font-mono text-xs text-slate-600">
              <span className="material-symbols-outlined text-[15px] text-[#0B5563]">satellite_alt</span>
              <span>CAMP_CLUSTER: RAJ-ALWAR-04</span>
            </span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-mono text-xs text-slate-500">
              AUTO-SYNC: 15s
            </span>
          </div>
        </div>

        {/* Header section with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B5563]">
                Tele-Ophthalmology Triage Pipeline
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase">
                Tier 1 Priority
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl text-slate-900 font-bold tracking-tight">Review Queue</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                1 Pending Specialist Sign-Off
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Actionable (3)
            </button>
            <button
              onClick={() => setActiveTab('specialist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'specialist'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Specialist (1)
            </button>
            <button
              onClick={() => setActiveTab('staging')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'staging'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sync Buffer (2)
            </button>
          </div>
        </div>

        {/* Triage Table Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center">
            <div className="col-span-5 lg:col-span-4">Patient Demographics</div>
            <div className="col-span-3 lg:col-span-3">Screening Center & Hardware</div>
            <div className="col-span-2 lg:col-span-3">AI ICDR Grade</div>
            <div className="col-span-2 lg:col-span-2 text-right">Action</div>
          </div>

          {/* PRIMARY ACTIVE CASE: CURRENT PATIENT */}
          <div className="border-b border-slate-100 bg-teal-50/20 hover:bg-teal-50/40 transition-colors">
            <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center">
              
              {/* Patient info */}
              <div className="col-span-5 lg:col-span-4 flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-teal-100/70 border border-teal-200 text-[#0B5563] flex items-center justify-center font-bold text-sm shrink-0">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 truncate">{name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-teal-100 text-[#0B5563] font-mono text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span>{patient?.id || '#DR-88219'}</span>
                    <span>•</span>
                    <span>{patient?.age || 58}Y / {patient?.gender || 'F'}</span>
                  </div>
                </div>
              </div>

              {/* Location & hardware */}
              <div className="col-span-3 lg:col-span-3 flex flex-col justify-center min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {patient?.village || 'PHC Mandawar Center'}
                </span>
                <span className="text-[11px] text-slate-500 truncate">Alwar District · Unit Delta</span>
                <span className="font-mono text-[10px] text-slate-400 mt-0.5">Forus 3nethra · Macula 45°</span>
              </div>

              {/* Grade */}
              <div className="col-span-2 lg:col-span-3 flex flex-col justify-center">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border w-fit ${currentSevConfig.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentSevConfig.dot}`}></span>
                  {currentSevConfig.label}
                </span>
                <span className="text-[11px] text-slate-500 font-mono mt-1">
                  Conf: {patient?.confidence ?? 96.4}% · {currentEye} Active
                </span>
              </div>

              {/* Action */}
              <div className="col-span-2 lg:col-span-2 flex justify-end">
                <button
                  onClick={() => navigate('canvas')}
                  className="px-4 py-2.5 rounded-xl bg-[#0B5563] hover:bg-[#093f4a] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  <span>Open Case</span>
                </button>
              </div>

            </div>

            {/* Microvascular telemetry snippet */}
            <div className="px-6 py-3 bg-white/60 border-t border-teal-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="material-symbols-outlined text-[#0B5563] text-[18px]">psychology</span>
                <span className="text-[11px]">
                  <strong>AI Telemetry:</strong> Microvascular remodeling detected. Immediate tele-ophthalmology verification recommended before dispensary exit.
                </span>
              </div>
              <span className="font-mono text-[11px] text-orange-600 font-bold shrink-0">
                Priority: Within 48 Hours
              </span>
            </div>
          </div>

          {/* SECONDARY ROW 1 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
            <div className="col-span-5 lg:col-span-4 flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                RK
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">Ram Kishore</span>
                <span className="text-xs text-slate-400 font-mono">#DR-88220 · 64Y / M</span>
              </div>
            </div>

            <div className="col-span-3 lg:col-span-3 flex flex-col justify-center min-w-0">
              <span className="text-xs font-semibold text-slate-700 truncate">Kishangarh Sub-Center</span>
              <span className="text-[11px] text-slate-400">Tablet Rig #02</span>
            </div>

            <div className="col-span-2 lg:col-span-3 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Level 0 — Healthy
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5">Conf: 98.7%</span>
            </div>

            <div className="col-span-2 lg:col-span-2 flex justify-end">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                Archived
              </span>
            </div>
          </div>

          {/* SECONDARY ROW 2 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors">
            <div className="col-span-5 lg:col-span-4 flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                FD
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">Fatima Dawood</span>
                <span className="text-xs text-slate-400 font-mono">#DR-88221 · 49Y / F</span>
              </div>
            </div>

            <div className="col-span-3 lg:col-span-3 flex flex-col justify-center min-w-0">
              <span className="text-xs font-semibold text-slate-700 truncate">Behror Mobile Camp</span>
              <span className="text-[11px] text-slate-400">Handheld Unit Delta</span>
            </div>

            <div className="col-span-2 lg:col-span-3 flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Level 1 — Mild NPDR
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5">Conf: 89.1%</span>
            </div>

            <div className="col-span-2 lg:col-span-2 flex justify-end">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">
                Scheduled
              </span>
            </div>
          </div>

        </div>

        {/* Telemetry metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {[
            { icon: 'speed', label: 'Mean On-Device Time', val: '140 ms / eye' },
            { icon: 'cloud_sync', label: 'Local Encrypted Buffer', val: '32 MB Cached' },
            { icon: 'schedule', label: 'Tele-Review SLA Target', val: '< 30 Minutes', highlight: true },
            { icon: 'verified', label: 'Validated Engine', val: 'DeepRetina-v4 XAI' },
          ].map((item) => (
            <div key={item.label} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 text-[#0B5563] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-slate-400 font-medium truncate">{item.label}</span>
                <span className={`font-mono text-xs font-bold mt-0.5 ${item.highlight ? 'text-teal-700' : 'text-slate-800'}`}>
                  {item.val}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
