import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Activity, Building2, Send, CloudSync, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Frontline Registration & Screening',
      desc: 'ASHA worker registers the patient via a low-literacy friendly mobile interface with optional pregnancy weeks tracking. Operates fully offline without network.',
      icon: Stethoscope,
      badge: 'Offline-First'
    },
    {
      num: '02',
      title: 'Symptom & Vital Signs Input',
      desc: 'Vital signs (Temperature, Heart Rate, BP, SpO2, Respiratory Rate) and danger symptoms (headache, vision blur, bleeding) are recorded.',
      icon: Activity,
      badge: 'Standardized'
    },
    {
      num: '03',
      title: 'AI-Assisted Triage & Risk Stratification',
      desc: 'The decision-support engine processes evidence-based clinical rules to categorize risk as LOW, MODERATE, HIGH, or EMERGENCY with clinical rationale.',
      icon: ShieldCheck,
      badge: 'Clinical Rules'
    },
    {
      num: '04',
      title: 'Real-Time Hospital Capacity Matching',
      desc: 'For high-risk cases, the system queries nearby hospitals by distance, available ICU beds, oxygen, and emergency readiness.',
      icon: Building2,
      badge: 'Live Capacity'
    },
    {
      num: '05',
      title: 'Emergency Referral & 108 Dispatch',
      desc: 'An automated digital referral (e.g. REF-2026-JH-8842) is created with clinical notes and pre-alerts hospital admitting staff.',
      icon: Send,
      badge: 'Pre-Arrival Alert'
    },
    {
      num: '06',
      title: 'Cross-Portal Patient & Cloud Sync',
      desc: 'The patient and their family can open HospiTrack to track their referral status and bed reservation in real-time.',
      icon: CloudSync,
      badge: 'Unified Network'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Clinical Workflow Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            How The Triage & Referral Pipeline Operates
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From the rural doorstep to tertiary emergency admission — a synchronized protocol built for high stress and zero latency.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-teal-400 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-base flex items-center justify-center shrink-0">
                  {s.num}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-50 items-center justify-center text-slate-400">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/asha/triage"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl shadow-lg shadow-teal-700/25 transition text-sm"
          >
            <span>Test the AI Triage Screen Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
