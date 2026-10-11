import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Building2, ShieldCheck, Stethoscope, Users, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            About Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Bridging India’s Rural Healthcare Frontier
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SwasthyaSetu forms a unified digital health infrastructure designed to support frontline health workers and connect rural patients to lifesaving hospital beds.
          </p>
        </div>

        {/* The Two Halves */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-teal-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">SwasthyaSetu Frontline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equips Accredited Social Health Activists (ASHAs) with clinical algorithmic decision support, offline-first data persistence, and automated risk scoring based on physiological vital signs and maternal danger signals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-sky-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">HospiTrack</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides patients and medical directors with live bed availability, ICU readiness, doctor rosters, and incoming referral status to prevent maternal mortality caused by delayed admissions.
            </p>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Important Clinical Safety Standard</span>
          </div>
          <p className="leading-relaxed">
            SwasthyaSetu is explicitly engineered as a <strong>decision-support tool</strong> and is strictly not an automated medical diagnostic tool. All clinical recommendations are calculated using published National Health Mission (NHM) and IMNCI triage rules. Emergency medical evaluations must always be completed by licensed healthcare professionals.
          </p>
        </div>

        {/* Call to action */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Ready to explore the prototype?</h3>
            <p className="text-xs text-slate-400 mt-1">Jump directly into the ASHA frontline triage or patient hospital finder.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/asha/dashboard"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition"
            >
              ASHA Dashboard
            </Link>
            <Link
              to="/patient/dashboard"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition"
            >
              Patient Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
