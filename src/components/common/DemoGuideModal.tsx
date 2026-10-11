import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Stethoscope, 
  UserCheck, 
  Building2, 
  Clock 
} from 'lucide-react';

interface DemoStep {
  step: number;
  title: string;
  desc: string;
  route: string;
  portal: 'Public' | 'ASHA' | 'Patient';
  actionLabel?: string;
  badge?: string;
}

export const DemoGuideModal: React.FC = () => {
  const { 
    isDemoGuideOpen, 
    setIsDemoGuideOpen, 
    resetAllDemoData, 
    isOnline, 
    toggleOnlineStatus, 
    loginAsha, 
    loginPatient,
    simulateHospitalAcceptance,
    referrals 
  } = useApp();

  const navigate = useNavigate();

  if (!isDemoGuideOpen) return null;

  const demoSteps: DemoStep[] = [
    {
      step: 1,
      title: 'Unified Healthcare Landing Page',
      desc: 'View product vision, dual-portal separation, and workflow architecture.',
      route: '/',
      portal: 'Public',
      actionLabel: 'Go to Landing Page'
    },
    {
      step: 2,
      title: 'ASHA Worker Secure Login',
      desc: 'Frontline authentication with offline capability indicator & 1-click Demo credentials.',
      route: '/asha/login',
      portal: 'ASHA',
      actionLabel: 'Open ASHA Login'
    },
    {
      step: 3,
      title: 'ASHA Clinical Dashboard',
      desc: '12 daily patients, 3 high-risk cases, offline queue metrics, and immediate actions.',
      route: '/asha/dashboard',
      portal: 'ASHA',
      actionLabel: 'View ASHA Dashboard'
    },
    {
      step: 4,
      title: 'Register High-Risk Patient (Sita Devi)',
      desc: 'Low-literacy friendly form with pregnancy weeks tracking and offline saving.',
      route: '/asha/register-patient',
      portal: 'ASHA',
      actionLabel: 'Open Patient Registration'
    },
    {
      step: 5,
      title: 'Symptom & Vital Assessment',
      desc: 'Input vitals (BP 165/105, SpO2 96%, HR 104) and danger signs.',
      route: '/asha/triage',
      portal: 'ASHA',
      actionLabel: 'Open Triage Assessment'
    },
    {
      step: 6,
      title: 'Run AI-Assisted Clinical Triage',
      desc: '4-stage clinical simulation analyzing symptoms, clinical rules, and Pre-Eclampsia risk.',
      route: '/asha/triage',
      portal: 'ASHA',
      badge: 'Core Innovation',
      actionLabel: 'Run Triage'
    },
    {
      step: 7,
      title: 'High-Risk Result Card & Guidance',
      desc: 'Clear visual risk breakdown, clinical rationale, and medical safety disclaimer.',
      route: '/asha/triage',
      portal: 'ASHA',
      actionLabel: 'Inspect Result'
    },
    {
      step: 8,
      title: 'Find Suitable Hospital with Real-Time Capacity',
      desc: 'Filter nearby facilities by distance, ICU beds, oxygen, and emergency readiness.',
      route: '/asha/hospitals',
      portal: 'ASHA',
      actionLabel: 'View Nearby Hospitals'
    },
    {
      step: 9,
      title: 'Create Emergency Referral (REF-2026)',
      desc: 'Dispatch emergency transfer package with 108 ambulance coordination.',
      route: '/asha/referrals',
      portal: 'ASHA',
      actionLabel: 'Open Referral Tracking'
    },
    {
      step: 10,
      title: 'Simulate Hospital Acceptance',
      desc: 'Simulate hospital bed reservation and acceptance response directly in timeline.',
      route: '/asha/referrals',
      portal: 'ASHA',
      actionLabel: 'Simulate Bed Acceptance'
    },
    {
      step: 11,
      title: 'Switch to HospiTrack Patient Portal',
      desc: 'Demonstrate that the two portals are completely separate consumer experiences.',
      route: '/patient/login',
      portal: 'Patient',
      actionLabel: 'Open Patient Portal'
    },
    {
      step: 12,
      title: 'Patient Dashboard & Active Referral Banner',
      desc: 'Consumer dashboard showing upcoming appointments, reports, and active emergency alert.',
      route: '/patient/dashboard',
      portal: 'Patient',
      actionLabel: 'View Patient Dashboard'
    },
    {
      step: 13,
      title: 'My Referrals: Live Linked Case',
      desc: 'Patient sees the exact emergency referral created by ASHA worker with live timeline!',
      route: '/patient/referrals',
      portal: 'Patient',
      badge: 'Unified Data Model',
      actionLabel: 'View Patient Referrals'
    },
    {
      step: 14,
      title: 'Offline-First Synchronization Demo',
      desc: 'Simulate dropping connectivity, queueing triage records, and syncing back to cloud.',
      route: '/asha/sync',
      portal: 'ASHA',
      actionLabel: 'Open Offline Sync'
    }
  ];

  const handleExecuteStep = (step: DemoStep) => {
    if (step.portal === 'ASHA') {
      loginAsha();
    } else if (step.portal === 'Patient') {
      loginPatient();
    }

    if (step.step === 10 && referrals.length > 0) {
      simulateHospitalAcceptance(referrals[0].id);
    }

    navigate(step.route);
    setIsDemoGuideOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-teal-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Hackathon 3-Minute Demo Navigator</h3>
                <span className="text-xs bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full font-medium">
                  Judge Mode
                </span>
              </div>
              <p className="text-xs text-slate-300">
                End-to-end interactive workflow from frontline village triage to hospital bed referral.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick controls bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-600">Simulate Network:</span>
            <button
              onClick={toggleOnlineStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-sm ${
                isOnline 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              {isOnline ? 'Online (Connected)' : 'Offline Mode (Local Storage)'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loginAsha();
                navigate('/asha/dashboard');
                setIsDemoGuideOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-medium transition-colors"
            >
              Jump to ASHA Portal
            </button>
            <button
              onClick={() => {
                loginPatient();
                navigate('/patient/dashboard');
                setIsDemoGuideOpen(false);
              }}
              className="px-2.5 py-1.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-medium transition-colors"
            >
              Jump to Patient Portal
            </button>
            <button
              onClick={resetAllDemoData}
              title="Reset all test records to defaults"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset State
            </button>
          </div>
        </div>

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 divide-y divide-slate-100">
          {demoSteps.map((step) => (
            <div
              key={step.step}
              className="pt-2.5 first:pt-0 flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  step.portal === 'ASHA' 
                    ? 'bg-teal-100 text-teal-800' 
                    : step.portal === 'Patient'
                    ? 'bg-sky-100 text-sky-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {step.step}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{step.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold uppercase ${
                      step.portal === 'ASHA' 
                        ? 'bg-teal-50 text-teal-700 border border-teal-200' 
                        : step.portal === 'Patient'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {step.portal}
                    </span>
                    {step.badge && (
                      <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-md font-bold">
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleExecuteStep(step)}
                className="shrink-0 flex items-center gap-1.5 bg-white group-hover:bg-teal-600 text-slate-700 group-hover:text-white border border-slate-300 group-hover:border-teal-600 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <span>{step.actionLabel || 'Launch'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time local state active (Updates propagate instantaneously across portals)</span>
          </div>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
