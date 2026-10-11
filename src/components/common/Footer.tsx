import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Building2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Medical disclaimer alert banner */}
        <div className="mb-10 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3 text-xs leading-relaxed text-slate-400">
          <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Clinical Safety & Regulatory Disclaimer: </span>
            SwasthyaSetu is an offline-first clinical decision support system designed to assist Accredited Social Health Activists (ASHA workers) in risk stratification, danger-sign recognition, and emergency referral coordination.
            The system provides algorithmic decision support and triage recommendations based on clinical guidelines; it does <strong className="text-slate-200">not</strong> formulate medical diagnoses or replace licensed physicians. All emergency cases require clinical evaluation at equipped facilities.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                SS
              </div>
              <span className="font-bold text-white text-base">SwasthyaSetu</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "From the last mile to the right care." Bridging rural healthcare barriers through offline-first AI-assisted triage and real-time hospital referral connectivity.
            </p>
            <div className="text-xs text-teal-400 font-medium">
              National Health Innovation Prototype
            </div>
          </div>

          {/* Col 2: ASHA Worker Portal */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-teal-400" />
              <span>ASHA Worker Portal</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/asha/dashboard" className="hover:text-teal-400 transition-colors">Worker Dashboard</Link></li>
              <li><Link to="/asha/triage" className="hover:text-teal-400 transition-colors">Risk Assessment Triage</Link></li>
              <li><Link to="/asha/register-patient" className="hover:text-teal-400 transition-colors">Offline Patient Registration</Link></li>
              <li><Link to="/asha/referrals" className="hover:text-teal-400 transition-colors">Emergency Referral Dispatch</Link></li>
              <li><Link to="/asha/sync" className="hover:text-teal-400 transition-colors">Offline Queue & Cloud Sync</Link></li>
            </ul>
          </div>

          {/* Col 3: HospiTrack Patient Portal */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>HospiTrack Patient Portal</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/patient/dashboard" className="hover:text-sky-400 transition-colors">Patient Dashboard</Link></li>
              <li><Link to="/patient/hospitals" className="hover:text-sky-400 transition-colors">Hospital Bed Availability</Link></li>
              <li><Link to="/patient/referrals" className="hover:text-sky-400 transition-colors">Track ASHA Referrals</Link></li>
              <li><Link to="/patient/appointments" className="hover:text-sky-400 transition-colors">OPD Appointment Booking</Link></li>
              <li><Link to="/patient/reports" className="hover:text-sky-400 transition-colors">Digital Diagnostic Reports</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Hackathon */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Platform Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built with an offline-first IndexedDB/LocalStorage replication schema, clinical triage rules, and real-time cross-portal referral synchronization.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">Offline-First</span>
              <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">Clinical Triage</span>
              <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">108 Referral Sync</span>
              <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">ABHA Ready</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SwasthyaSetu. Unified Rural Healthcare Innovation.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition">About System</Link>
            <Link to="/how-it-works" className="hover:text-slate-400 transition">Workflow Rules</Link>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">State/National Hackathon Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
