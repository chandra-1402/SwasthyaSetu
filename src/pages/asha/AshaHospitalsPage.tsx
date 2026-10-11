import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  Clock, 
  Bed, 
  Phone, 
  Send,
  CheckCircle2, 
  AlertCircle,
  Filter,
  Check,
  Navigation
} from 'lucide-react';
import { HospitalSelectModal } from '../../components/asha/HospitalSelectModal';
import { HospitalDirectionsModal } from '../../components/common/HospitalDirectionsModal';

export const AshaHospitalsPage: React.FC = () => {
  const { hospitals, patients } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [filterIcu, setFilterIcu] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Referral trigger modal
  const [referringHospital, setReferringHospital] = useState<Hospital | null>(null);
  const [hospitalForDirections, setHospitalForDirections] = useState<Hospital | null>(null);

  const specialties = ['All', 'Maternity Care', 'Emergency ICU', 'Pediatrics', 'Cardiology', 'Trauma'];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmergency = !filterEmergency || h.emergencyReady;
    const matchesIcu = !filterIcu || h.icuBedsAvailable > 0;
    const matchesSpecialty = selectedSpecialty === 'All' || h.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    return matchesSearch && matchesEmergency && matchesIcu && matchesSpecialty;
  });

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>Equipped Healthcare Facilities Directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time bed readiness and doctor roster across Bokaro Steel City (BGH, Muskan, K.M. Memorial, Medicant, Wellmark)
          </p>
        </div>
      </div>

      {/* Search and Filters Bar (Requirement 12) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, block, or district..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterEmergency(!filterEmergency)}
              className={`px-3 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 border ${
                filterEmergency 
                  ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm' 
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              <span>Emergency 24x7</span>
              {filterEmergency && <Check className="w-3.5 h-3.5 text-rose-600" />}
            </button>

            <button
              onClick={() => setFilterIcu(!filterIcu)}
              className={`px-3 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 border ${
                filterIcu 
                  ? 'bg-teal-100 text-teal-800 border-teal-300 shadow-sm' 
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              <span>ICU Available</span>
              {filterIcu && <Check className="w-3.5 h-3.5 text-teal-600" />}
            </button>
          </div>
        </div>

        {/* Specialty tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-slate-400 font-semibold shrink-0">Specialties:</span>
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedSpecialty === spec 
                  ? 'bg-teal-700 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid (Requirement 12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map(hospital => (
          <div
            key={hospital.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-500 hover:shadow-md transition space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {hospital.type}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{hospital.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{hospital.address}</span>
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                  hospital.emergencyReady 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}>
                  {hospital.emergencyReady ? '24x7 Emergency' : 'Standard Hours'}
                </span>
              </div>

              {/* Distance and Travel ETA */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs mt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
                  <span className="font-extrabold text-slate-900">{hospital.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Est. ETA</span>
                  <span className="font-extrabold text-slate-900">{hospital.travelTimeMinutes} mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">ICU Beds</span>
                  <span className={`font-extrabold ${hospital.icuBedsAvailable > 0 ? 'text-teal-700' : 'text-rose-600'}`}>
                    {hospital.icuBedsAvailable} / {hospital.totalIcuBeds}
                  </span>
                </div>
              </div>

              {/* Capacity Status */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>General Beds Open:</span>
                  <strong className="text-slate-900">{hospital.generalBedsAvailable} beds</strong>
                </div>
                <div className="flex justify-between">
                  <span>Maternity Labor Beds:</span>
                  <strong className="text-slate-900">{hospital.maternityBedsAvailable} beds</strong>
                </div>
                <div className="flex justify-between">
                  <span>Attending Medical Officer:</span>
                  <strong className="text-teal-700">{hospital.doctorsOnDuty[0]?.name} ({hospital.doctorsOnDuty[0]?.specialty})</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                  title="Call hospital"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>

                <button
                  onClick={() => setHospitalForDirections(hospital)}
                  className="flex items-center gap-1.5 text-teal-800 hover:text-teal-900 font-bold px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 transition"
                  title="Get turn-by-turn driving directions"
                >
                  <Navigation className="w-3.5 h-3.5 text-teal-600" />
                  <span>Directions</span>
                </button>
              </div>

              <button
                onClick={() => setReferringHospital(hospital)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md shadow-teal-700/20 transition ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Refer Patient</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Modal if triggered from hospital directory */}
      {referringHospital && (
        <HospitalSelectModal
          patient={patients[0]}
          riskLevel="HIGH"
          primaryDiagnosisHint={`Emergency Referral to ${referringHospital.name} from Healthcare Directory`}
          initialHospitalId={referringHospital.id}
          onClose={() => setReferringHospital(null)}
        />
      )}

      {/* Directions & Live Navigation Modal */}
      {hospitalForDirections && (
        <HospitalDirectionsModal
          hospital={hospitalForDirections}
          userOrigin="Sector 9 Sub-Centre, Bokaro Steel City"
          onClose={() => setHospitalForDirections(null)}
        />
      )}
    </div>
  );
};
