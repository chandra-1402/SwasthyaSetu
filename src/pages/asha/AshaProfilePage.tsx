import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserCheck, ShieldCheck, Award, MapPin, Phone, Building2, HeartHandshake, LogOut } from 'lucide-react';

export const AshaProfilePage: React.FC = () => {
  const { ashaWorker, logoutAsha } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-teal-700/30">
            SD
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{ashaWorker.name}</h1>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-300">
                Active Worker
              </span>
            </div>
            <p className="text-xs text-teal-800 font-semibold mt-0.5">Accredited Social Health Activist (ASHA)</p>
            <p className="text-xs text-slate-400 font-mono mt-1">Unique Worker ID: {ashaWorker.id}</p>
          </div>
        </div>

        {/* Assigned Jurisdiction */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-slate-500">
            Assigned Community Cluster
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Sub-Centre</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{ashaWorker.subCenter}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Primary Block</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{ashaWorker.block}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">District</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{ashaWorker.district}, {ashaWorker.state}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Population Covered</span>
              <span className="font-bold text-teal-700 mt-0.5 block">{ashaWorker.patientsCovered} Residents</span>
            </div>
          </div>
        </div>

        {/* Training Certifications */}
        <div className="space-y-3 text-xs pt-3 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>National Health Mission Accreditations</span>
          </h3>

          <div className="space-y-2">
            {ashaWorker.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs flex items-center justify-between text-teal-950">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-700" />
            <span>Official Helpline: {ashaWorker.phone}</span>
          </div>
          <span className="font-bold">Bokaro Health District Registry</span>
        </div>

        {/* Dedicated Logout Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              logoutAsha();
              navigate('/');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout ASHA Session & Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
