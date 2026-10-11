import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Referral, ReferralStatus, Hospital } from '../../types';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles, 
  ChevronRight, 
  Phone, 
  Ambulance, 
  Calendar,
  ArrowRight,
  Check,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HospitalDirectionsModal } from '../../components/common/HospitalDirectionsModal';

export const AshaReferralsPage: React.FC = () => {
  const { referrals, simulateHospitalAcceptance, addToast, hospitals } = useApp();
  const navigate = useNavigate();

  const [hospitalForDirections, setHospitalForDirections] = useState<Hospital | null>(null);

  const [selectedReferralId, setSelectedReferralId] = useState<string>(
    referrals.length > 0 ? referrals[0].id : ''
  );

  const selectedReferral = referrals.find(r => r.id === selectedReferralId) || referrals[0];

  const timelineSteps: { status: ReferralStatus; label: string; desc: string }[] = [
    { status: 'Awaiting Hospital Response', label: 'Assessment Completed', desc: 'Frontline vitals and risk calculated' },
    { status: 'Hospital Notified', label: 'Referral Package Created', desc: 'Digital case file transmitted via HospiTrack' },
    { status: 'Hospital Accepted', label: 'Hospital Notified & Accepted', desc: 'Admitting unit bed reserved & 108 vehicle assigned' },
    { status: 'Patient En Route', label: 'Patient En Route', desc: 'Ambulance transport in progress' },
    { status: 'Admitted', label: 'Facility Admission', desc: 'Patient in hospital triage room' },
  ];

  const getStepState = (stepStatus: ReferralStatus, currentStatus: ReferralStatus) => {
    const order: ReferralStatus[] = [
      'Awaiting Hospital Response',
      'Hospital Notified',
      'Hospital Accepted',
      'Patient En Route',
      'Admitted',
      'Completed'
    ];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepStatus);

    if (stepIndex <= currentIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-teal-600" />
            <span>Emergency Referral Network Tracking</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time status updates and hospital acknowledgment timeline
          </p>
        </div>

        {/* Demo Fast-forward simulation button (Requirement 11) */}
        {selectedReferral && selectedReferral.status !== 'Completed' && selectedReferral.status !== 'Hospital Accepted' && (
          <button
            onClick={() => simulateHospitalAcceptance(selectedReferral.id)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Simulate Hospital Acceptance (Demo)</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Referrals List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Cases ({referrals.length})
          </h3>

          <div className="space-y-3">
            {referrals.map(ref => {
              const isSelected = selectedReferral?.id === ref.id;
              return (
                <div
                  key={ref.id}
                  onClick={() => setSelectedReferralId(ref.id)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 shadow-md ring-1 ring-teal-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-black text-teal-900">{ref.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      ref.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {ref.riskLevel}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">{ref.patientName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ref.patientAge} yrs • {ref.village}</p>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[150px]">{ref.hospitalName}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                      ref.status === 'Completed'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : ref.status === 'Awaiting Hospital Response'
                        ? 'text-amber-800 bg-amber-50 border-amber-200'
                        : 'text-sky-700 bg-sky-50 border-sky-200'
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Timeline & Slip for Selected Referral (Requirement 11) */}
        {selectedReferral && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Top Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-700 block">
                    REFERRAL TRACKING: #{selectedReferral.id}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>{selectedReferral.patientName}</span>
                    <ArrowRight className="w-4 h-4 text-teal-600" />
                    <span>{selectedReferral.hospitalName}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Dispatched by ASHA {selectedReferral.ashaWorkerName} ({selectedReferral.ashaWorkerId})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Status</span>
                  <span className="inline-block mt-1 text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full">
                    {selectedReferral.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline Component (Requirement 11) */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Referral Progression Timeline:
                </h4>

                <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineSteps.map((step, idx) => {
                    const state = getStepState(step.status, selectedReferral.status);
                    const isDone = state === 'completed';

                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div
                          className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${
                            isDone 
                              ? 'bg-teal-600 text-white ring-4 ring-teal-100' 
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>

                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-sm ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                            {isDone && (
                              <span className="text-[10px] font-mono text-slate-400">Recorded</span>
                            )}
                          </div>
                          <p className={`mt-0.5 ${isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Logistics & Transport */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                  <Ambulance className="w-4 h-4 text-rose-600" />
                  <span>Emergency Logistics & Admission Protocol</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Ambulance Fleet Status</span>
                    <span className="font-bold text-slate-900">{selectedReferral.ambulanceContact}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Chief Clinical Indication</span>
                    <span className="font-medium text-slate-900">{selectedReferral.primaryDiagnosisHint}</span>
                  </div>
                </div>

                {(() => {
                  const targetHosp = hospitals.find(
                    h => h.id === selectedReferral.hospitalId || h.name.toLowerCase() === selectedReferral.hospitalName.toLowerCase()
                  ) || hospitals[0];

                  return (
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHospitalForDirections(targetHosp)}
                        className="flex-1 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>View Ambulance Route ({targetHosp.distanceKm} km • {targetHosp.travelTimeMinutes} mins)</span>
                      </button>
                      <a
                        href={`tel:${targetHosp.phone}`}
                        className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call Facility</span>
                      </a>
                    </div>
                  );
                })()}
              </div>

              {/* Footer Note */}
              <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
                <span>Hospital Admission Desk Pre-Alert Active</span>
                <span className="text-teal-700 font-semibold font-mono">Bokaro Health Network</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Directions Modal */}
      {hospitalForDirections && (
        <HospitalDirectionsModal
          hospital={hospitalForDirections}
          userOrigin={`${selectedReferral.village} Sub-Centre, Bokaro Steel City`}
          onClose={() => setHospitalForDirections(null)}
        />
      )}
    </div>
  );
};
