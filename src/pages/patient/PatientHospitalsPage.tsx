import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import { InteractiveHospitalMap } from '../../components/patient/InteractiveHospitalMap';
import { BookAppointmentModal } from '../../components/patient/BookAppointmentModal';
import { HospitalDirectionsModal } from '../../components/common/HospitalDirectionsModal';
import { 
  Building2, 
  Search, 
  MapPin, 
  Star, 
  Bed, 
  Calendar, 
  Phone, 
  Filter, 
  CheckCircle2, 
  Map as MapIcon, 
  ListFilter,
  Check,
  Navigation,
  ExternalLink,
  Compass
} from 'lucide-react';

export const PatientHospitalsPage: React.FC = () => {
  const { hospitals } = useApp();

  const [search, setSearch] = useState('');
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);
  const [selectedHospitalForDirections, setSelectedHospitalForDirections] = useState<Hospital | null>(null);
  const [activeHospitalId, setActiveHospitalId] = useState<string | null>(hospitals[0]?.id || null);

  const specialties = ['All', 'Maternity Care', 'Emergency ICU', 'Pediatrics', 'Cardiology', 'High Risk Pregnancy'];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
                          h.district.toLowerCase().includes(search.toLowerCase()) ||
                          h.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesEmergency = !filterEmergency || h.emergencyReady;
    const matchesSpecialty = selectedSpecialty === 'All' || h.specialties.includes(selectedSpecialty);

    return matchesSearch && matchesEmergency && matchesSpecialty;
  });

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <span>Hospital Discovery & Live Bed Tracking</span>
          </h1>
          <p className="text-xs text-slate-500">
            Find certified healthcare facilities, compare bed capacity, and reserve appointment tokens in Bokaro Steel City
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              viewMode === 'map' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Radar Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              viewMode === 'list' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visual Area (Requirement 16) */}
      {viewMode === 'map' && (
        <InteractiveHospitalMap
          hospitals={filteredHospitals}
          selectedHospitalId={activeHospitalId}
          onSelectHospital={(h) => setActiveHospitalId(h.id)}
          onBookAppointment={(h) => setSelectedHospitalForModal(h)}
          onGetDirections={(h) => setSelectedHospitalForDirections(h)}
        />
      )}

      {/* Search and Filters Bar (Requirement 16) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hospitals, specialties or locations (e.g. Bokaro General Hospital, Muskan, ICU, Maternity)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterEmergency(!filterEmergency)}
              className={`px-4 py-3 rounded-2xl font-bold transition flex items-center gap-1.5 border ${
                filterEmergency 
                  ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm' 
                  : 'bg-slate-50 text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
            >
              <span>24x7 Emergency Ready</span>
              {filterEmergency && <Check className="w-3.5 h-3.5 text-rose-600" />}
            </button>
          </div>
        </div>

        {/* Specialty Filter tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-slate-400 font-semibold shrink-0">Specialties:</span>
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedSpecialty === spec 
                  ? 'bg-sky-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards (Requirement 16) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map(hospital => (
          <div
            key={hospital.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-400 hover:shadow-md transition space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                    {hospital.type}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{hospital.name}</h3>
                  <button
                    onClick={() => setSelectedHospitalForDirections(hospital)}
                    className="text-xs text-slate-500 hover:text-sky-700 mt-1 flex items-center gap-1 group transition text-left cursor-pointer"
                    title="Click to view route and directions"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 shrink-0 transition-colors" />
                    <span className="underline decoration-slate-300 group-hover:decoration-sky-600 font-medium">
                      {hospital.address}
                    </span>
                    <span className="text-[10px] text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1 font-bold">
                      • Directions
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-black text-xs bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{hospital.rating}</span>
                </div>
              </div>

              {/* Real-time Bed capacity breakdown */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs mt-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
                  <span className="font-extrabold text-slate-900">{hospital.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">ICU Beds</span>
                  <span className={`font-extrabold ${hospital.icuBedsAvailable > 0 ? 'text-teal-700' : 'text-rose-600'}`}>
                    {hospital.icuBedsAvailable} open
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">General Beds</span>
                  <span className="font-extrabold text-emerald-700">{hospital.generalBedsAvailable} open</span>
                </div>
              </div>

              {/* Services tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {hospital.specialties.map(spec => (
                  <span key={spec} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Call Desk, Directions & Book Appointment (Requirement 16) */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                  title="Call hospital desk"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Desk</span>
                </a>

                {/* Directions Button */}
                <button
                  onClick={() => setSelectedHospitalForDirections(hospital)}
                  className="flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-bold px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 hover:border-sky-300 transition shadow-2xs group"
                  title="Get turn-by-turn driving directions"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span>Directions</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-sky-600 border border-slate-200 transition"
                  title="Open directly in Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                onClick={() => setSelectedHospitalForModal(hospital)}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition ml-auto"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Booking Modal */}
      {selectedHospitalForModal && (
        <BookAppointmentModal
          hospital={selectedHospitalForModal}
          onClose={() => setSelectedHospitalForModal(null)}
        />
      )}

      {/* Hospital Directions & Navigation Modal */}
      {selectedHospitalForDirections && (
        <HospitalDirectionsModal
          hospital={selectedHospitalForDirections}
          onClose={() => setSelectedHospitalForDirections(null)}
        />
      )}
    </div>
  );
};
