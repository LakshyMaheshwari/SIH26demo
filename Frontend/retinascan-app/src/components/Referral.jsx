import React, { useState } from 'react';

export default function Referral({ navigate, patient, severity = 2, selectedEye = 'od' }) {
  const [toast, setToast] = useState(false);

  const name = patient?.fullName || patient?.name || 'Smt. Geeta Sharma';
  const age = patient?.age || 58;
  const gender = patient?.gender === 'M' ? 'Male' : 'Female';
  const currentSeverity = severity ?? patient?.severity ?? 2;
  const currentEye = selectedEye?.toUpperCase() || 'OD';

  const severityNames = {
    0: "No Apparent Diabetic Retinopathy (Healthy)",
    1: "Mild Non-Proliferative Diabetic Retinopathy (NPDR)",
    2: "Moderate Non-Proliferative Diabetic Retinopathy (NPDR)",
    3: "Severe Non-Proliferative Diabetic Retinopathy (NPDR)",
    4: "Proliferative Diabetic Retinopathy (PDR)",
  };

  function handleDownload() {
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  }

  return (
    <main className="w-full min-h-screen bg-slate-100/60 pt-20 pb-20 font-body-md text-slate-800">
      <div className="max-w-4xl mx-auto px-6 md:px-8 flex flex-col gap-6">

        {/* Top actions bar */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => navigate('canvas')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Diagnostic Canvas</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B5563] text-white text-xs font-bold hover:bg-[#093f4a] transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export PDF Bundle</span>
            </button>
          </div>
        </div>

        {/* Referral Slip Document */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-10 flex flex-col gap-6 relative overflow-hidden print:border-none print:shadow-none print:p-0">
          
          {/* Government / Tele-Ocular Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-[#0B5563] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">local_hospital</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-[#0B5563] font-mono text-[10px] font-bold uppercase tracking-wider">
                    MoHFW · Tele-Ocular Core
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    DISPATCH #{patient?.id?.replace('#', '') || 'RS-2026-0841'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Clinical Tele-Ophthalmology Referral
                </h1>
                <p className="text-xs text-slate-500">
                  National Diabetic Retinopathy Point-of-Care Triage Protocol
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                {currentSeverity >= 2 ? 'Priority Triage' : 'Standard Triage'}
              </span>
              <span className="font-mono text-[11px] text-slate-400 mt-1">
                Issued: Today, 14:32 IST
              </span>
            </div>
          </div>

          {/* Core Two Column Clinical Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left 7 cols: Patient Demographics & Diagnostics */}
            <div className="md:col-span-7 flex flex-col gap-5">
              
              {/* Patient Identification Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Patient Identification
                  </span>
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    ABHA VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Full Name</span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">{name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Demographics</span>
                    <span className="text-sm font-semibold text-slate-800 block mt-0.5">{gender}, {age} Years</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-[11px] text-slate-400 block">Ayushman Bharat Health Account (ABHA ID)</span>
                    <span className="text-xs font-mono font-bold text-[#0B5563] block mt-0.5 tracking-wider">
                      91-0421-8821-4409
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Assessment */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Diagnostic Impression & Biomarkers
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Verified ICDR Grade</span>
                    <span className="text-sm font-bold text-slate-900">
                      {severityNames[currentSeverity] || severityNames[2]}
                    </span>
                    <span className="text-xs text-[#0B5563] font-mono font-semibold">
                      ICDR Level {currentSeverity} · Bilateral ({currentEye} Primary Focus)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Retinal Biomarkers</span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                        {patient?.findings || 'Microaneurysms detected in nasal quadrant'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Macular Edema Status</span>
                      <span className={`text-xs font-bold block mt-0.5 ${currentSeverity >= 2 ? 'text-orange-600' : 'text-emerald-700'}`}>
                        {currentSeverity >= 2 ? 'CSME Suspicious (>500µm)' : 'Negative'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 cols: Routing Facility & Action Window */}
            <div className="md:col-span-5 flex flex-col gap-5 justify-between">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-3.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-2">
                  Referral Target & Routing
                </span>

                <div>
                  <span className="text-[11px] text-slate-400 block">Designated Facility</span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">Dept. of Ophthalmology</span>
                  <span className="text-xs text-slate-600 block">District Hospital Alwar, Rajasthan</span>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">Facility PIN: 301001 · Tel: +91 144 233 4511</span>
                </div>

                <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                    Action Timeline
                  </span>
                  <span className="text-sm font-bold text-teal-900 block mt-0.5">
                    Within 14 – 21 Days
                  </span>
                  <span className="text-[11px] text-teal-700 block mt-0.5">
                    Target Window Closes: 30-OCT-2026
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Tele-Consultant Reviewer</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[#0B5563] text-[18px]">badge</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">Dr. Arvind Mehta, MS (Ophthal)</span>
                      <span className="text-[10px] font-mono text-slate-400">Tele-Consultant ID #602 · Node 04</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Seal & QR Block */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cryptographic Seal</span>
                  <span className="font-mono text-[10px] text-slate-600 mt-0.5">SHA256: 8f9b...a104</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>Encrypted Electronic Record</span>
                  </span>
                </div>

                <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100">
                    <rect fill="currentColor" height="28" width="28" x="5" y="5"/>
                    <rect fill="white" height="18" width="18" x="10" y="10"/>
                    <rect fill="currentColor" height="10" width="10" x="14" y="14"/>
                    <rect fill="currentColor" height="28" width="28" x="67" y="5"/>
                    <rect fill="white" height="18" width="18" x="72" y="10"/>
                    <rect fill="currentColor" height="10" width="10" x="76" y="14"/>
                    <rect fill="currentColor" height="28" width="28" x="5" y="67"/>
                    <rect fill="white" height="18" width="18" x="10" y="72"/>
                    <rect fill="currentColor" height="10" width="10" x="14" y="76"/>
                    <circle cx="50" cy="50" fill="currentColor" r="8"/>
                    <rect fill="currentColor" height="20" width="8" x="40" y="15"/>
                    <rect fill="currentColor" height="12" width="12" x="75" y="45"/>
                    <rect fill="currentColor" height="10" width="15" x="50" y="75"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* Protocol Directives Strip */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Instructions for Patient & Community Health Worker (ASHA)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex flex-col gap-1">
                <strong className="text-slate-900 text-xs">For Patient / Family:</strong>
                <p className="leading-relaxed text-[11px]">
                  Carry this slip, Aadhaar card, and current diabetes prescriptions to District Hospital Alwar (Counter 4 - Eye OPD).
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-slate-900 text-xs">For ASHA / Health Worker:</strong>
                <p className="leading-relaxed text-[11px]">
                  Confirm transport logistics within 7 days and record hospital seal in the e-Sanjeevani tablet buffer upon visit.
                </p>
              </div>
            </div>
          </div>

          {/* FHIR Trace Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
            <span>HL7-FHIR R4 #90184 · SHA-256 Retinal Hash Verified</span>
            <span>Gateway Node: RJ-ALW-09</span>
          </div>

        </div>

        {/* Start Over Button / Cycle Complete */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 no-print">
          <button
            onClick={() => navigate('home')}
            className="px-8 py-4 rounded-xl bg-[#0B5563] hover:bg-[#093f4a] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">sync</span>
            <span>Start Over / New Patient Screening</span>
          </button>
          <span className="text-xs text-slate-400">
            Session saved and synchronized with local cache.
          </span>
        </div>

      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#0B5563] text-white rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Clinical referral package generated successfully.</span>
        </div>
      )}
    </main>
  );
}
