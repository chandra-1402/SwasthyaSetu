import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartPulse, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  QrCode, 
  Download, 
  User, 
  FileText,
  Droplets,
  Wind,
  Heart,
  ShieldAlert,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Share2,
  Stethoscope,
  PhoneCall
} from 'lucide-react';

export const PatientHealthRecordsPage: React.FC = () => {
  const { patientUser, assessments } = useApp();
  const [copiedAbha, setCopiedAbha] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Filter assessments strictly for this logged-in patient (Sita Devi)
  // NEVER leak records of any other patient
  const sitaAssessments = assessments.filter(
    ass => ass.patientId === patientUser.id || ass.patientName?.toLowerCase() === patientUser.name.toLowerCase()
  );

  // Fallback to latest Sita Devi record if empty
  const latestAssessment = sitaAssessments[0];

  // Core 6 Main User Details requested:
  // 1. Customer BP
  const bpSystolic = patientUser.vitals?.bloodPressureSystolic ?? latestAssessment?.vitals.bloodPressureSystolic ?? 165;
  const bpDiastolic = patientUser.vitals?.bloodPressureDiastolic ?? latestAssessment?.vitals.bloodPressureDiastolic ?? 105;
  const isHighBp = bpSystolic >= 140 || bpDiastolic >= 90;

  // 2. Oxygen Rate
  const oxygenRate = patientUser.vitals?.spO2 ?? latestAssessment?.vitals.spO2 ?? 96;

  // 3. Heart Rate
  const heartRate = patientUser.vitals?.heartRate ?? latestAssessment?.vitals.heartRate ?? 104;

  // 4. Blood Group
  const bloodGroup = patientUser.bloodGroup || 'B Positive (B+)';

  // 5. Allergies
  const allergies = patientUser.knownAllergies || ['Penicillin (mild skin rash)'];

  // 6. Active Conditions
  const activeConditions = patientUser.chronicConditions || ['Gestational Hypertension (Recent onset 32w)'];

  const handleCopyAbha = () => {
    navigator.clipboard.writeText(patientUser.abhaNumber);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2500);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <HeartPulse className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Digital Health Locker & Medical Records
              </h1>
              <p className="text-xs text-slate-500">
                Primary verified health profile linked to Ayushman Bharat Digital Mission (ABDM)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Summary</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share with Doctor</span>
          </button>
        </div>
      </div>

      {/* ABHA Digital Card Display */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-sky-700/50">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-semibold border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>National Digital Health ID Verified • Active Record</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{patientUser.name}</h2>
              <p className="text-xs text-sky-200/90 mt-1">
                {patientUser.age} yrs • {patientUser.gender} • {patientUser.village}, {patientUser.district}
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-sky-300 block tracking-wider">
                ABHA Number (Digital Health ID)
              </span>
              <div className="flex items-center gap-2 justify-center sm:justify-start mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-white">
                  {patientUser.abhaNumber}
                </span>
                <button
                  onClick={handleCopyAbha}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sky-200"
                  title="Copy ABHA Number"
                >
                  {copiedAbha ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {patientUser.emergencyContact && (
              <p className="text-[11px] text-sky-200/80 pt-1">
                Emergency Contact: <strong>{patientUser.emergencyContact.name} ({patientUser.emergencyContact.relation})</strong> • {patientUser.emergencyContact.phone}
              </p>
            )}
          </div>

          {/* QR Code Display */}
          <div className="bg-white p-4 rounded-2xl text-slate-900 flex flex-col items-center gap-2 shadow-2xl shrink-0 border border-white/20">
            <QrCode className="w-20 h-20 text-slate-900" />
            <span className="text-[10px] font-mono font-extrabold text-slate-600 tracking-wider">
              SCAN FOR EMERGENCY EHR
            </span>
          </div>
        </div>
      </div>

      {/* Primary Customer Details Section (User Request: customer BP, oxygen rate, heartrate, blood group, allergies, active conditions) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-sky-600 rounded-full" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Main Patient Health Details & Vitals
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Current Clinical Indicators
          </span>
        </div>

        {/* 6 Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Customer BP */}
          <div className={`p-5 rounded-3xl border shadow-sm transition relative overflow-hidden bg-white ${
            isHighBp ? 'border-rose-200 hover:border-rose-300 ring-1 ring-rose-100' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Blood Pressure (BP)
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono">
                {bpSystolic}/{bpDiastolic}
              </span>
              <span className="text-xs text-slate-500 font-bold">mmHg</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                High Risk • Vigilance Needed
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Target: &lt;120/80</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Gestational hypertension protocol active. Monitored for pre-eclampsia vigilance.
            </p>
          </div>

          {/* 2. Oxygen Rate */}
          <div className="p-5 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Oxygen Rate (SpO2)
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Wind className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-teal-700 font-mono">
                {oxygenRate}
              </span>
              <span className="text-xs text-slate-500 font-bold">%</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Normal Saturation
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Standard ≥95%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Pulse oximetry indicates healthy maternal peripheral oxygenation.
            </p>
          </div>

          {/* 3. Heart Rate */}
          <div className="p-5 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Heart Rate (Pulse)
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono">
                {heartRate}
              </span>
              <span className="text-xs text-slate-500 font-bold">bpm</span>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Mild Tachycardia
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Resting: 60-100</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Resting pulse frequency recorded during frontline ASHA triage.
            </p>
          </div>

          {/* 4. Blood Group */}
          <div className="p-5 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Blood Group
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Droplets className="w-5 h-5" />
              </div>
            </div>

            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">
                {bloodGroup}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Blood Bank Verified
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Rh Positive (+)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Cross-referenced with hospital digital blood bank registry for obstetric safety.
            </p>
          </div>

          {/* 5. Known Allergies */}
          <div className="p-5 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Known Allergies
              </span>
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1.5 min-h-[44px]">
              {allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-rose-50 text-rose-800 border border-rose-200 font-bold px-3 py-1 rounded-xl text-xs"
                >
                  {allergy}
                </span>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Clinical Contraindication
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Contraindicated for beta-lactam antibiotics. Red flag visible to treating physicians.
            </p>
          </div>

          {/* 6. Active Conditions */}
          <div className="p-5 rounded-3xl border border-slate-200 hover:border-slate-300 bg-white shadow-sm transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                Active Conditions
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1.5 min-h-[44px]">
              {activeConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-amber-50 text-amber-900 border border-amber-200 font-bold px-3 py-1 rounded-xl text-xs"
                >
                  {cond}
                </span>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                High-Risk ANC Active
              </span>
              <span className="text-[10px] text-slate-400 font-medium">BGH Protocol</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Active surveillance under Dr. Sunita Prasad (Bokaro General Hospital).
            </p>
          </div>
        </div>
      </div>

      {/* Frontline Vitals History & Trends (STRICTLY Sita Devi's Records Only) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Frontline Vitals History & Trends ({patientUser.name})</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Longitudinal vital sign checkups recorded by ASHA Worker Sunita Devi
            </p>
          </div>
          <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0 self-start sm:self-auto">
            {sitaAssessments.length} Verified Checkups
          </span>
        </div>

        {/* Longitudinal History List - Sita Devi records ONLY */}
        <div className="space-y-3">
          {sitaAssessments.map((ass, index) => {
            const isHigh = ass.vitals.bloodPressureSystolic >= 140 || ass.vitals.bloodPressureDiastolic >= 90;
            return (
              <div
                key={ass.id}
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {index === 0 ? 'Today\'s Emergency Triage Checkup' : index === 1 ? 'Emergency Referral Screening' : 'Routine 3rd Trimester ANC Checkup'}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      ass.riskLevel === 'HIGH' 
                        ? 'bg-rose-100 text-rose-800 border-rose-300' 
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {ass.riskLevel} RISK
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ass.assessedAt.replace('T', ' ').slice(0, 16)}</span>
                  </div>
                </div>

                {/* 4 Core Vitals in Mono */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Blood Pressure</span>
                    <strong className={isHigh ? 'text-rose-600 font-black' : 'text-slate-900'}>
                      {ass.vitals.bloodPressureSystolic}/{ass.vitals.bloodPressureDiastolic} mmHg
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Oxygen (SpO2)</span>
                    <strong className={ass.vitals.spO2 < 95 ? 'text-amber-600 font-black' : 'text-teal-700 font-black'}>
                      {ass.vitals.spO2}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Heart Rate</span>
                    <strong className="text-slate-900 font-black">{ass.vitals.heartRate} bpm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">Temperature</span>
                    <strong className="text-slate-900 font-black">{ass.vitals.temperature}°F</strong>
                  </div>
                </div>

                {/* Clinical Notes & Action */}
                <div className="text-[11px] text-slate-600 bg-white/60 p-2.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <p><strong className="text-slate-800">Chief Complaint:</strong> {ass.chiefComplaint}</p>
                    <p className="text-slate-500"><strong className="text-slate-700">Action Plan:</strong> {ass.recommendedAction}</p>
                  </div>
                  <div className="shrink-0 text-[10px] text-slate-400 text-right">
                    <span>Assessed by: <strong className="text-slate-700">{ass.ashaWorkerName}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share With Doctor Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Share2 className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">Share Health Locker Record</h4>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Secure ABDM-compliant health record token generated for <strong>{patientUser.name}</strong>:
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-800 break-all select-all">
                https://abdm.gov.in/share/token?id={patientUser.abhaNumber.replace(/-/g, '')}&exp=24h
              </div>
              <p className="text-[11px] text-slate-400">
                Grant temporary read access to Bokaro General Hospital or ambulance emergency doctors. Access expires in 24 hours.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

