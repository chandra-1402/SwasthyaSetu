import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Hospital } from '../../types';
import { HospitalDirectionsModal } from '../../components/common/HospitalDirectionsModal';
import { 
  Building2, 
  Calendar, 
  FileText, 
  Share2, 
  HeartPulse, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Phone,
  ShieldAlert,
  Ambulance,
  Search,
  Navigation
} from 'lucide-react';

export const PatientDashboardPage: React.FC = () => {
  const { patientUser, appointments, labReports, referrals, hospitals } = useApp();
  const navigate = useNavigate();

  const [selectedHospitalForDirections, setSelectedHospitalForDirections] = useState<Hospital | null>(null);

  // Find active referral (strictly for logged-in patient)
  const patientReferrals = referrals.filter(r => r.patientId === patientUser.id || r.patientName?.toLowerCase() === patientUser.name.toLowerCase());
  const activeReferral = patientReferrals.find(r => r.status !== 'Completed') || patientReferrals[0] || referrals[0];
  const upcomingAppointment = appointments.find(a => a.status === 'Upcoming');

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Welcome Banner (Requirement 15) */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-850 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800/80 border border-sky-700 text-sky-200 text-xs font-semibold">
            <span>Ayushman Bharat Health Account</span>
            <span>•</span>
            <span className="font-mono text-emerald-300">ABHA: {patientUser.abhaNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Good morning, {patientUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-sky-200 max-w-xl">
            Welcome to HospiTrack. Access real-time hospital bed status, outpatient booking tokens, diagnostic reports, and emergency referrals.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <Link
            to="/patient/hospitals"
            className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition"
          >
            <Search className="w-4 h-4" />
            <span>Discover Nearby Hospitals</span>
          </Link>
        </div>
      </div>

      {/* ACTIVE EMERGENCY REFERRAL BANNER (Cross-Portal Highlight! Requirement 15 & 25) */}
      {activeReferral && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white border-2 border-rose-600/80 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800">
                  Active Emergency Referral Dispatched
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{activeReferral.id}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Referral to {activeReferral.hospitalName}
                </h3>
                <p className="text-xs text-rose-200/90 mt-1 max-w-2xl leading-relaxed">
                  Initiated by ASHA Worker <strong className="text-white">{activeReferral.ashaWorkerName}</strong> based on high-risk maternal vitals assessment. Destination facility triage desk notified.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Status: <strong className="text-emerald-400">{activeReferral.status}</strong></span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Ambulance className="w-4 h-4 text-rose-400" />
                  <span>Transport: <strong className="text-white">{activeReferral.ambulanceContact}</strong></span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <button
                onClick={() => {
                  const targetHospital = hospitals.find(
                    h => h.id === activeReferral.hospitalId || h.name.toLowerCase() === activeReferral.hospitalName.toLowerCase()
                  ) || hospitals[0];
                  setSelectedHospitalForDirections(targetHospital);
                }}
                className="px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition"
              >
                <Navigation className="w-4 h-4" />
                <span>View Route & GPS</span>
              </button>
              <Link
                to="/patient/referrals"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
              >
                <span>Track Referral Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions (Requirement 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/patient/hospitals"
          className="p-4 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-900 flex flex-col justify-between shadow-sm transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Find Hospital</h4>
            <p className="text-[11px] text-slate-500">Live bed radar</p>
          </div>
        </Link>

        <Link
          to="/patient/appointments"
          className="p-4 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-900 flex flex-col justify-between shadow-sm transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Book OPD Token</h4>
            <p className="text-[11px] text-slate-500">Specialist schedule</p>
          </div>
        </Link>

        <Link
          to="/patient/reports"
          className="p-4 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-900 flex flex-col justify-between shadow-sm transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">View Reports</h4>
            <p className="text-[11px] text-slate-500">CBC & Ultrasound</p>
          </div>
        </Link>

        <Link
          to="/patient/referrals"
          className="p-4 rounded-2xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-900 flex flex-col justify-between shadow-sm transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">My Referrals</h4>
            <p className="text-[11px] text-slate-500">ASHA link timeline</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointment Card (Requirement 15) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Upcoming OPD Consultation</span>
            </h3>
            <Link to="/patient/appointments" className="text-xs text-sky-700 font-bold hover:underline">
              View All
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{upcomingAppointment.doctorName}</h4>
                  <p className="text-slate-600 mt-0.5">{upcomingAppointment.department}</p>
                  <p className="text-[11px] text-slate-500">{upcomingAppointment.hospitalName}</p>
                </div>
                <span className="font-mono text-base font-black text-sky-700 bg-white px-3 py-1 rounded-xl shadow-sm border border-sky-200">
                  Token #{upcomingAppointment.tokenNumber}
                </span>
              </div>

              <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>{upcomingAppointment.date} at {upcomingAppointment.timeSlot}</span>
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                  Confirmed
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No scheduled appointments.</p>
          )}
        </div>

        {/* Recent Digital Lab Reports (Requirement 15) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Verified Diagnostic Reports</span>
            </h3>
            <Link to="/patient/reports" className="text-xs text-sky-700 font-bold hover:underline">
              View All ({labReports.length})
            </Link>
          </div>

          <div className="space-y-2.5">
            {labReports.slice(0, 2).map(rep => (
              <div
                key={rep.id}
                onClick={() => navigate('/patient/reports')}
                className="cursor-pointer p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{rep.title}</h5>
                    <span className="text-[10px] text-slate-400">{rep.hospitalName} • {rep.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Hospital Capacity Snapshot (Requirement 15) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Live Hospital Bed Availability</h3>
            <p className="text-xs text-slate-500">Real-time status for Bokaro Steel City health network</p>
          </div>
          <Link to="/patient/hospitals" className="text-xs text-sky-700 font-bold hover:underline">
            Open Interactive Map
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {hospitals.map(hosp => (
            <div key={hosp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {hosp.distanceKm} km away
                </span>
                <span className={`text-[10px] font-bold ${hosp.emergencyReady ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {hosp.emergencyReady ? '24x7 ER' : 'OPD Only'}
                </span>
              </div>
              <h5 className="font-bold text-slate-900 line-clamp-1">{hosp.name}</h5>
              <div className="flex justify-between pt-2 border-t border-slate-200/80 text-[11px]">
                <span className="text-slate-500">Beds Open:</span>
                <strong className="text-emerald-700">{hosp.generalBedsAvailable} general</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500">ICU Open:</span>
                <strong className={hosp.icuBedsAvailable > 0 ? 'text-teal-700 font-bold' : 'text-rose-600 font-bold'}>
                  {hosp.icuBedsAvailable} beds
                </strong>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  onClick={() => setSelectedHospitalForDirections(hosp)}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 transition"
                  title="View route and turn-by-turn directions"
                >
                  <Navigation className="w-3 h-3 text-sky-600" />
                  <span>Directions</span>
                </button>
                <a
                  href={`tel:${hosp.phone}`}
                  className="text-[10px] text-slate-500 hover:text-slate-900 font-medium"
                >
                  Call Desk
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Directions Modal */}
      {selectedHospitalForDirections && (
        <HospitalDirectionsModal
          hospital={selectedHospitalForDirections}
          onClose={() => setSelectedHospitalForDirections(null)}
        />
      )}
    </div>
  );
};
