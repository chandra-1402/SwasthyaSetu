import React, { useState } from 'react';
import { Hospital, Patient, RiskLevel, Referral } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Bed, 
  Send, 
  X, 
  ArrowRight,
  ShieldAlert,
  Ambulance,
  Navigation,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HospitalDirectionsModal } from '../common/HospitalDirectionsModal';

interface HospitalSelectModalProps {
  patient: Patient;
  riskLevel: RiskLevel;
  primaryDiagnosisHint: string;
  initialHospitalId?: string;
  onClose: () => void;
}

export const HospitalSelectModal: React.FC<HospitalSelectModalProps> = ({
  patient,
  riskLevel,
  primaryDiagnosisHint,
  initialHospitalId,
  onClose,
}) => {
  const { hospitals, createReferral, isOnline, patients } = useApp();
  const navigate = useNavigate();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patient.id);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(initialHospitalId || hospitals[0]?.id || 'HOSP-BK-01');
  const [hospitalForDirections, setHospitalForDirections] = useState<Hospital | null>(null);

  const activePatient = patients.find(p => p.id === selectedPatientId) || patient;

  const [urgencyReason, setUrgencyReason] = useState<string>(() => {
    if (primaryDiagnosisHint) {
      return `${riskLevel} Risk Alert: ${primaryDiagnosisHint} Urgent facility admission and specialist evaluation required.`;
    }
    return `Critical clinical triage findings for ${patient?.name || 'patient'} (${patient?.age || '26'}y, ${patient?.village || 'Sector 9'}). Immediate evaluation required.`;
  });
  const [createdReferral, setCreatedReferral] = useState<Referral | null>(null);

  const handleCreate = () => {
    const ref = createReferral({
      patientId: activePatient.id,
      hospitalId: selectedHospitalId,
      riskLevel,
      primaryDiagnosisHint,
      urgencyReason,
    });
    setCreatedReferral(ref);
  };

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-5 flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
              <Ambulance className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Emergency Facility Referral</h3>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-400/40 px-2 py-0.5 rounded-full font-bold">
                  {riskLevel} RISK
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Patient: <span className="text-white font-semibold">{activePatient.name}</span> ({activePatient.age} yrs • {activePatient.village})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {createdReferral ? (
          <div className="p-6 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Referral Dispatched Successfully
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Emergency Referral Created</h3>
              <p className="text-xs text-slate-500 mt-1">
                Data queued and transmitted to destination hospital command desk.
              </p>
            </div>

            {/* Referral confirmation card */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Referral ID</span>
                  <span className="font-mono text-base font-black text-teal-800">{createdReferral.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Initial Status</span>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {createdReferral.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Patient</span>
                  <span className="font-bold text-slate-900 text-sm">{createdReferral.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assessed Risk</span>
                  <span className="font-bold text-rose-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{createdReferral.riskLevel}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Destination Hospital</span>
                  <span className="font-bold text-slate-900">{createdReferral.hospitalName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Emergency Transport</span>
                  <span className="font-bold text-slate-800">{createdReferral.ambulanceContact}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block text-[10px]">Primary Clinical Impression</span>
                <span className="font-medium text-slate-800">{createdReferral.primaryDiagnosisHint}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHospitalForDirections(selectedHospital)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition border border-slate-300"
              >
                <Navigation className="w-4 h-4 text-teal-600" />
                <span>View Route & GPS Directions</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/asha/referrals');
                }}
                className="flex-1 py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-2xl text-xs shadow-md shadow-teal-700/25 flex items-center justify-center gap-2 transition"
              >
                <span>Track Referral in Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            {/* Optional Patient Selector if multiple patients exist */}
            {patients.length > 1 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-bold text-slate-700">Patient:</span>
                </div>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 max-w-xs"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y • {p.village}) {p.isPregnant ? '• Pregnant' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 text-sm block mb-1">
                Select Equipped Healthcare Facility:
              </label>
              <p className="text-slate-500 text-xs mb-3">
                Showing hospitals within immediate radius sorted by emergency bed availability and travel time.
              </p>

              <div className="space-y-3">
                {hospitals.map((hosp) => {
                  const isSelected = selectedHospitalId === hosp.id;
                  return (
                    <div
                      key={hosp.id}
                      onClick={() => setSelectedHospitalId(hosp.id)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 shadow-md ring-1 ring-teal-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{hosp.name}</h4>
                            <span className="text-[10px] text-slate-500 font-medium">{hosp.type} • {hosp.district}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            hosp.emergencyReady
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}>
                            {hosp.emergencyReady ? 'Emergency: Available' : 'Emergency: Unavailable'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-[11px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setHospitalForDirections(hosp);
                          }}
                          className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900 transition font-bold"
                          title="View route and turn-by-turn driving directions"
                        >
                          <Navigation className="w-3.5 h-3.5 text-teal-600" />
                          <span>Route: <strong className="text-slate-900 underline">{hosp.distanceKm} km</strong></span>
                        </button>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>ETA: <strong className="text-slate-900">{hosp.travelTimeMinutes} mins</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>ICU: <strong className={hosp.icuBedsAvailable > 0 ? 'text-teal-700 font-bold' : 'text-rose-600 font-bold'}>{hosp.icuBedsAvailable} open</strong></span>
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Maternity Beds: {hosp.maternityBedsAvailable} | General: {hosp.generalBedsAvailable}</span>
                        <span className="text-teal-700 font-medium">Doctor on duty: {hosp.doctorsOnDuty[0]?.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinical Referral Reason */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Emergency Referral Rationale / Urgency Reason</label>
              <textarea
                rows={2}
                value={urgencyReason}
                onChange={e => setUrgencyReason(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-[11px] text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Referral generates an instant HL7/FHIR compliant digital case package transmitted to the hospital admission desk and dispatches an emergency transport prompt.
              </span>
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Create Emergency Referral ({selectedHospital.name})</span>
            </button>
          </div>
        )}
      </div>

      {/* Hospital Directions & Live Navigation Modal */}
      {hospitalForDirections && (
        <HospitalDirectionsModal
          hospital={hospitalForDirections}
          userOrigin={`${activePatient.village} Sub-Centre, Bokaro Steel City`}
          onClose={() => setHospitalForDirections(null)}
        />
      )}
    </div>
  );
};
