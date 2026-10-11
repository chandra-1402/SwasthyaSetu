import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  HeartHandshake, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Check 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterAsha = () => {
    navigate('/asha/login');
  };

  const handleEnterPatient = () => {
    navigate('/patient/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white overflow-x-hidden">
      {/* Clean Hero Section without duplicate buttons or banners */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-18 border-b border-slate-200 bg-gradient-to-b from-white via-teal-50/20 to-slate-50">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-teal-200/30 to-sky-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            <span>Offline-First • AI-Assisted • Referral Connected</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
            Smarter Healthcare. <br />
            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
              From the Last Mile to the Right Care.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            SwasthyaSetu helps frontline healthcare workers assess clinical risk, connect patients with appropriate healthcare facilities, and streamline emergency referrals — <strong className="text-slate-800 font-semibold">even in low-connectivity areas</strong>.
          </p>

          <p className="text-[11px] text-slate-500 mt-4">
            *Clinical decision support system. Provides algorithmic risk assistance; does not replace medical diagnosis.
          </p>
        </div>
      </section>

      {/* PORTAL SELECTION SECTION - The Single Dedicated Login Entry for Both Users */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Two Specialized Operational Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Select Your Healthcare Portal
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
              Access your dedicated workspace. ASHA workers and patients operate through distinct, specialized interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* CARD 1: ASHA-SAHAYAK (For ASHA Workers) */}
            <div className="rounded-3xl border-2 border-teal-600 bg-gradient-to-b from-teal-50/50 to-white p-7 sm:p-8 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md shadow-teal-800/20">
                    <HeartHandshake className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide bg-teal-100 text-teal-900 px-3 py-1 rounded-full border border-teal-300">
                    Frontline Worker
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">SWASTHYASETU ASHA</h3>
                <p className="text-xs font-bold text-teal-800 uppercase tracking-wide mt-1">For Frontline Healthcare Workers</p>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  "Assess patients, identify high-risk cases and coordinate referrals."
                </p>

                {/* Features checklist */}
                <div className="mt-6 pt-5 border-t border-teal-200/70 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span><strong>Offline-first workflow</strong> (functions without mobile data)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span><strong>Symptom & vital entry</strong> with red-flag detection</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span><strong>AI-assisted triage</strong> & risk classification</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span><strong>Emergency referral</strong> & nearby hospital availability</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    <span><strong>Patient history</strong> & follow-up tracking</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-teal-100">
                <button
                  onClick={handleEnterAsha}
                  className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-2xl text-base shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Login to ASHA Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="mt-2 text-center text-xs text-teal-800 font-medium">
                  Authentication required • Enter Worker ID & PIN
                </div>
              </div>
            </div>

            {/* CARD 2: HOSPITRACK (For Patients) */}
            <div className="rounded-3xl border-2 border-sky-600 bg-gradient-to-b from-sky-50/50 to-white p-7 sm:p-8 shadow-lg flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-700/20">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-300">
                    Patients & Families
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950">HOSPITRACK</h3>
                <p className="text-xs font-bold text-sky-800 uppercase tracking-wide mt-1">For Patients & Families</p>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  "Find hospitals, check availability, book appointments and manage healthcare information."
                </p>

                {/* Features checklist */}
                <div className="mt-6 pt-5 border-t border-sky-200/70 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>Hospital discovery</strong> & location search</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>Bed availability</strong> (ICU, general, maternity)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>Appointment booking</strong> with digital OPD tokens</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>Digital lab reports</strong> (NABL accredited preview)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                    <span><strong>Referral tracking</strong> linked to frontline ASHA assessments</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-sky-100">
                <button
                  onClick={handleEnterPatient}
                  className="w-full py-4 bg-sky-700 hover:bg-sky-800 text-white font-extrabold rounded-2xl text-base shadow-md shadow-sky-700/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Login to Patient Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="mt-2 text-center text-xs text-sky-800 font-medium">
                  Authentication required • Enter Mobile & OTP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY & PROBLEM / SOLUTION */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">
                Problem Statement
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                Closing Critical Gaps in Rural & Maternal Health Delivery
              </h2>
              <div className="mt-6 space-y-3.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <strong className="text-rose-400 block mb-1">Delays in Rural Assessment</strong>
                  In rural and remote areas, frontline healthcare workers must recognize danger signs with limited access to doctors and hospital information.
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <strong className="text-amber-400 block mb-1">Blind Referrals & Secondary Transfers</strong>
                  Patients are often referred to hospitals without knowing if beds, specialists, or blood are available, causing life-threatening delays.
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <strong className="text-emerald-400 block mb-1">Disconnected Information</strong>
                  Hospitals are unaware of incoming emergencies until arrival. SwasthyaSetu pre-alerts triage staff before the ambulance reaches the gates.
                </div>
              </div>
            </div>

            <div className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>The SwasthyaSetu Solution</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Offline-First Decision Engine</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Runs on smartphones in zero connectivity zones and syncs safely once reconnected.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Algorithmic Risk Stratification</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Standardized clinical guidelines evaluate vitals and red flags to eliminate guesswork.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Direct Hospital Capacity Linkage</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Transfers digital referral records directly to receiving hospitals in Bokaro Steel City.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center text-xs text-slate-400">
                <span>Unified Last-Mile Network</span>
                <span className="text-teal-400 font-semibold">Bokaro Health District</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats footer */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-teal-700">100%</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Offline Capable</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">&lt; 3 mins</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Triage to Referral</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-teal-700">5</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Bokaro Hospitals</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">0 ms</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Sync Latency</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
