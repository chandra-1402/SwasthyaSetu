import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, Phone, MapPin, Heart, QrCode, LogOut } from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { patientUser, logoutPatient } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6 w-full overflow-x-hidden">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-sky-600/30">
            {patientUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{patientUser.name}</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                ABHA Active
              </span>
            </div>
            <p className="text-xs text-sky-700 font-semibold mt-0.5">Ayushman Bharat Digital Health Profile</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Health ID: {patientUser.abhaNumber}</p>
          </div>
        </div>

        {/* Identity Details */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Personal & Household Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Age & Gender</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{patientUser.age} yrs • {patientUser.gender}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Registered Phone</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{patientUser.phone}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Village & Sub-Centre</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{patientUser.village} (Chas Sector)</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">District & State</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{patientUser.district}, Jharkhand</span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-3 text-xs pt-3 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Designated Emergency Contact
          </h3>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-950">
            <div>
              <span className="font-bold text-sm block">{patientUser.emergencyContact.name} ({patientUser.emergencyContact.relation})</span>
              <span className="text-xs text-rose-700">{patientUser.emergencyContact.phone}</span>
            </div>
            <a
              href={`tel:${patientUser.emergencyContact.phone}`}
              className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition"
              title="Call Emergency Contact"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Dedicated Logout Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              logoutPatient();
              navigate('/');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Patient Session & Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
