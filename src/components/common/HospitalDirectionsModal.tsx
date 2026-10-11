import React, { useState } from 'react';
import { Hospital, RouteDetails } from '../../types';
import { 
  Navigation, 
  MapPin, 
  ExternalLink, 
  Clock, 
  Car, 
  Phone, 
  Ambulance, 
  Copy, 
  Check, 
  Route, 
  ShieldCheck, 
  AlertCircle,
  X,
  Compass
} from 'lucide-react';

interface HospitalDirectionsModalProps {
  hospital: Hospital;
  userOrigin?: string;
  onClose: () => void;
}

const HOSPITAL_ROUTES: Record<string, RouteDetails> = {
  'HOSP-BK-01': {
    via: 'Sector 4 Main Avenue & City Centre Link Road',
    trafficStatus: 'Smooth Flow • Fastest Ambulance Corridor',
    ambulanceCorridor: true,
    steps: [
      { instruction: 'Depart from Sector 9 Sub-Centre gate heading northeast', distance: '0.8 km', detail: 'Follow Sector 9 Main Arterial Road' },
      { instruction: 'At Dr. B.R. Ambedkar Chowk roundabout, take 2nd exit onto Sector 4 Avenue', distance: '1.4 km', detail: 'Wide 4-lane median with emergency priority lane' },
      { instruction: 'Pass City Centre Market and Bokaro Mall on right side', distance: '0.6 km', detail: 'Keep left toward medical complex approach' },
      { instruction: 'Turn left into Bokaro General Hospital: Gate #2 for 24x7 Emergency/ICU or Gate #1 for OPD Consultation', distance: '0.4 km', detail: 'Emergency triage ambulance drop-off bay directly ahead' }
    ]
  },
  'HOSP-BK-02': {
    via: 'Sector 9 South Road & Chas NH-218 Main Road',
    trafficStatus: 'Moderate Urban Flow • Clear Route',
    ambulanceCorridor: false,
    steps: [
      { instruction: 'Head south on Sector 9 Link Road toward Chas Sub-Division', distance: '1.2 km', detail: 'Proceed straight through Chas railway crossing overpass' },
      { instruction: 'Turn left at Chas Junction onto NH-218 / Chas Main Road', distance: '2.6 km', detail: 'Follow main commercial market corridor' },
      { instruction: 'Continue past Chas Old Bus Stand & Sub-Divisional Complex', distance: '0.7 km', detail: 'Keep right lane' },
      { instruction: 'Arrive at Muskan Hospital on right side next to Chas Health Centre', distance: '0.3 km', detail: 'Ground floor emergency reception and ambulance ramp' }
    ]
  },
  'HOSP-BK-03': {
    via: 'Chas Bypass Highway Ring Road',
    trafficStatus: 'Highway Clearance • Optimal Speed',
    ambulanceCorridor: true,
    steps: [
      { instruction: 'Head southeast from Sector 9 toward Chas Bypass Connecting Link', distance: '2.0 km', detail: 'Straight past Chas Industrial Area' },
      { instruction: 'Merge onto Bokaro-Chas Bypass 4-lane Highway', distance: '2.4 km', detail: 'Uninterrupted bypass corridor' },
      { instruction: 'Continue past Dharamshala Chowk service road exit', distance: '0.7 km', detail: 'Take hospital dedicated entry lane' },
      { instruction: 'Arrive at K.M. Memorial Hospital & Research Centre Main Emergency Entrance', distance: '0.3 km', detail: 'Dedicated emergency triage and cardiac cath-lab ramp' }
    ]
  },
  'HOSP-BK-04': {
    via: 'Sector 11 Junction & Sector 12 Outer Ring Road',
    trafficStatus: 'Light Traffic • Smooth Flow',
    ambulanceCorridor: true,
    steps: [
      { instruction: 'Head east on Sector 9 North Arterial Road', distance: '2.1 km', detail: 'Follow Bokaro Steel City ring road signage' },
      { instruction: 'At Sector 11 Junction, turn right onto Sector 12 Outer Road', distance: '3.0 km', detail: 'Pass Bokaro Ispat Vidyalaya' },
      { instruction: 'Continue past Sector 12 Sub-Station and community park', distance: '0.8 km', detail: 'Hospital signboards clearly visible' },
      { instruction: 'Arrive at Medicant Hospital & Research Centre Main Gate', distance: '0.3 km', detail: 'Separate gates for 24x7 Emergency and OPD parking' }
    ]
  },
  'HOSP-BK-05': {
    via: 'Cooperative Colony Main Access Road',
    trafficStatus: 'Moderate Residential Flow',
    ambulanceCorridor: false,
    steps: [
      { instruction: 'Head east on Sector 9 connecting corridor toward Cooperative Colony', distance: '3.5 km', detail: 'Follow Chas-Bokaro link artery' },
      { instruction: 'Turn right into Cooperative Colony Avenue past Sector Health Sub-Centre', distance: '2.6 km', detail: 'Drive past Cooperative Colony Community Hall' },
      { instruction: 'Turn left at Bank of India branch onto Hospital Road', distance: '0.7 km', detail: 'Slow down for residential speed cushions' },
      { instruction: 'Arrive at Wellmark Hospital Main OPD & Inpatient Entrance', distance: '0.3 km', detail: 'Parking and patient reception on left' }
    ]
  }
};

export const HospitalDirectionsModal: React.FC<HospitalDirectionsModalProps> = ({
  hospital,
  userOrigin = 'Sector 9, Bokaro Steel City',
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const routeData: RouteDetails = HOSPITAL_ROUTES[hospital.id] || {
    via: `${hospital.address} Direct Corridor`,
    trafficStatus: 'Normal Traffic Conditions',
    ambulanceCorridor: hospital.emergencyReady,
    steps: [
      { instruction: `Depart from ${userOrigin} toward main district road`, distance: '1.0 km' },
      { instruction: `Follow navigation markers toward ${hospital.address}`, distance: `${Math.max(0.5, hospital.distanceKm - 1.5).toFixed(1)} km` },
      { instruction: `Arrive at ${hospital.name}`, distance: '0.5 km' }
    ]
  };

  // Google Maps Directions destination URL
  // Destination by exact coordinates & hospital name for 100% precision
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userOrigin)}&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}&travelmode=driving`;

  const handleCopyDirections = () => {
    const text = `DIRECTIONS TO ${hospital.name.toUpperCase()}\nDestination: ${hospital.address}\nDistance: ${hospital.distanceKm} km (approx ${hospital.travelTimeMinutes} mins)\nVia: ${routeData.via}\n\nTURN-BY-TURN STEPS:\n${routeData.steps.map((s, i) => `${i + 1}. ${s.instruction} (${s.distance})`).join('\n')}\n\nHospital Phone: ${hospital.phone}\nEmergency Helpline: 108`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-indigo-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm font-bold"
            title="Close directions modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Navigation className="w-4 h-4" />
            </span>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-sky-300">
              Live Route & Directions
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {hospital.name}
          </h3>
          <p className="text-xs text-sky-200/90 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{hospital.address}</span>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Journey Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100">
              <span className="text-[10px] text-sky-600 block font-bold uppercase">Estimated Time</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-sky-950">{hospital.travelTimeMinutes}</span>
                <span className="text-[10px] font-bold text-sky-700">mins</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Distance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-slate-900">{hospital.distanceKm}</span>
                <span className="text-[10px] font-bold text-slate-500">km</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] text-emerald-700 block font-bold uppercase">Emergency ICU</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-emerald-800">{hospital.icuBedsAvailable}</span>
                <span className="text-[10px] font-bold text-emerald-700">beds open</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Facility Beds</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-black text-slate-900">{hospital.generalBedsAvailable}</span>
                <span className="text-[10px] font-bold text-slate-500">general</span>
              </div>
            </div>
          </div>

          {/* Route Status Strip */}
          <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[11px] font-bold block text-slate-200">
                  Via: {routeData.via}
                </span>
                <span className="text-[10px] text-emerald-400">
                  {routeData.trafficStatus}
                </span>
              </div>
            </div>
            {routeData.ambulanceCorridor && (
              <span className="text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-1 rounded-lg shrink-0">
                108 Priority Lane
              </span>
            )}
          </div>

          {/* From / To Points */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 font-medium">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                A
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting Point (Current Location)</span>
                <span className="font-bold text-slate-900 text-xs">{userOrigin}</span>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-sky-300 ml-3 h-3 my-0.5" />

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                B
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Destination Facility</span>
                <span className="font-bold text-slate-900 text-xs">{hospital.name} ({hospital.address})</span>
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Guidance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
                <Route className="w-4 h-4 text-sky-600" />
                <span>Turn-by-Turn Route Guidance</span>
              </h4>
              <button
                onClick={handleCopyDirections}
                className="flex items-center gap-1 text-[11px] text-sky-700 font-bold hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Route</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-white divide-y divide-slate-100">
              {routeData.steps.map((step, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${idx === 0 ? '' : 'pt-2.5'}`}>
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-xs leading-snug">
                      {step.instruction}
                    </p>
                    {step.detail && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {step.detail}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                    {step.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Ambulance Transport Notice */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-rose-950">
            <div className="flex items-start gap-2.5">
              <Ambulance className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-xs block">Need Emergency Transit Assistance?</span>
                <span className="text-[11px] text-rose-800 leading-relaxed block mt-0.5">
                  108 Ambulance service is linked with this hospital route. Free emergency maternal & critical transport available 24x7.
                </span>
              </div>
            </div>
            <a
              href="tel:108"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shrink-0 transition shadow-sm"
            >
              Call 108
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href={`tel:${hospital.phone}`}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Desk ({hospital.phone})</span>
          </a>

          {/* Primary Action Button: Open Google Maps for Live Navigation */}
          <button
            onClick={handleOpenGoogleMaps}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition transform active:scale-95"
          >
            <Compass className="w-4 h-4 text-sky-200" />
            <span>Open in Google Maps (Live GPS)</span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
