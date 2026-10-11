import React, { useState } from 'react';
import { Hospital } from '../../types';
import { MapPin, Navigation, BedDouble, AlertCircle, Phone, Star, ShieldCheck } from 'lucide-react';

interface InteractiveHospitalMapProps {
  hospitals: Hospital[];
  selectedHospitalId: string | null;
  onSelectHospital: (hospital: Hospital) => void;
  onBookAppointment: (hospital: Hospital) => void;
  onGetDirections?: (hospital: Hospital) => void;
}

export const InteractiveHospitalMap: React.FC<InteractiveHospitalMapProps> = ({
  hospitals,
  selectedHospitalId,
  onSelectHospital,
  onBookAppointment,
  onGetDirections
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'icu'>('all');

  const filteredHospitals = hospitals.filter(h => {
    if (activeFilter === 'emergency') return h.emergencyReady;
    if (activeFilter === 'icu') return h.icuBedsAvailable > 0;
    return true;
  });

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden text-white flex flex-col lg:flex-row">
      {/* Map visual rendering area */}
      <div className="relative flex-1 min-h-[360px] lg:min-h-[440px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden p-6 flex flex-col justify-between">
        {/* Background stylized grid & road lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          {/* Mock Road routes */}
          <path d="M 50 200 Q 250 80 450 180 T 800 240" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="4 4" />
          <path d="M 120 400 Q 300 280 600 320 T 900 150" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 3" />
          <circle cx="280" cy="220" r="140" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.3" className="animate-ping" style={{ animationDuration: '4s' }} />
        </svg>

        {/* Top Floating Controls on Map */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Live Hospital Network Radar</span>
            <span className="text-slate-500">|</span>
            <span className="text-sky-400 font-mono">Bokaro Steel City Zone</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${activeFilter === 'all' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All ({hospitals.length})
            </button>
            <button
              onClick={() => setActiveFilter('emergency')}
              className={`px-3 py-1 rounded-lg font-medium transition ${activeFilter === 'emergency' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Emergency Ready
            </button>
            <button
              onClick={() => setActiveFilter('icu')}
              className={`px-3 py-1 rounded-lg font-medium transition ${activeFilter === 'icu' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ICU Available
            </button>
          </div>
        </div>

        {/* Simulated Interactive Pin Placement */}
        <div className="relative z-10 my-auto py-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredHospitals.map((hospital, idx) => {
            const isSelected = selectedHospitalId === hospital.id;
            return (
              <div
                key={hospital.id}
                onClick={() => onSelectHospital(hospital)}
                className={`cursor-pointer transition-all transform hover:scale-105 p-3 rounded-2xl border backdrop-blur-md ${
                  isSelected
                    ? 'bg-sky-900/90 border-sky-400 shadow-lg shadow-sky-500/30 ring-2 ring-sky-400'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <div className={`p-1.5 rounded-lg ${hospital.emergencyReady ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-700 text-slate-300'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-900/80 px-2 py-0.5 rounded-full text-sky-300 font-mono">
                    {hospital.distanceKm} km
                  </span>
                </div>

                <div className="font-bold text-xs text-white line-clamp-1 mb-1">{hospital.name}</div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{hospital.type.split(' ')[0]}</span>
                  <span className={`font-semibold ${hospital.generalBedsAvailable > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {hospital.generalBedsAvailable} beds open
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Legend */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> 24x7 Emergency Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Beds Available
            </span>
          </div>
          <span className="font-mono text-slate-500">GPS Simulation Mode</span>
        </div>
      </div>

      {/* Selected Hospital Quick Details Panel */}
      {selectedHospital && (
        <div className="w-full lg:w-80 bg-slate-850 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                  {selectedHospital.type}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedHospital.rating}</span>
                </div>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{selectedHospital.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedHospital.address}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Emergency Status</span>
                <span className={`font-bold mt-0.5 block ${selectedHospital.emergencyReady ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedHospital.emergencyReady ? 'Open / 24x7' : 'Standard OPD'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Distance / Time</span>
                <span className="font-bold text-white mt-0.5 block">
                  {selectedHospital.distanceKm} km ({selectedHospital.travelTimeMinutes} mins)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">General Beds</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">
                  {selectedHospital.generalBedsAvailable} / {selectedHospital.totalGeneralBeds}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">ICU Beds</span>
                <span className="font-bold text-sky-400 mt-0.5 block">
                  {selectedHospital.icuBedsAvailable} / {selectedHospital.totalIcuBeds}
                </span>
              </div>
            </div>

            {/* Doctors */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Duty Doctors Available:</span>
              <div className="space-y-1">
                {selectedHospital.doctorsOnDuty.slice(0, 2).map((doc, i) => (
                  <div key={i} className="text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span className="font-medium text-slate-200">{doc.name}</span>
                    <span className="text-[10px] text-teal-400">{doc.specialty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            {onGetDirections ? (
              <button
                onClick={() => onGetDirections(selectedHospital)}
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/30 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions & Live GPS</span>
              </button>
            ) : (
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.coordinates.lat},${selectedHospital.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/30 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Google Maps)</span>
              </a>
            )}

            <button
              onClick={() => onBookAppointment(selectedHospital)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition"
            >
              Book OPD Appointment
            </button>
            <a
              href={`tel:${selectedHospital.phone}`}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-800 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Helpline ({selectedHospital.phone})</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
