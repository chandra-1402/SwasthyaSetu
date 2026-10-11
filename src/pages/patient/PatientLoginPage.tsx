import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Building2, ArrowRight, Sparkles, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export const PatientLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginPatient, patientUser } = useApp();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !otp.trim()) {
      setError('Please enter your registered mobile number and 4-digit OTP.');
      return;
    }
    setError('');
    loginPatient();
    navigate('/patient/dashboard');
  };

  const handleUseDemoPatient = () => {
    setPhone('9431120491');
    setEmail('sita.devi@bokaro.health');
    setOtp('1029');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-600/20 via-indigo-600/20 to-teal-600/10 blur-3xl pointer-events-none rounded-full" />

      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-16 h-16 rounded-3xl bg-sky-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-sky-600/30 mb-4 border border-sky-400/30">
          <Building2 className="w-9 h-9" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">SwasthyaSetu</h2>
        <p className="mt-1 text-sm font-semibold text-sky-400">HospiTrack Citizen Healthcare Portal</p>
        <p className="mt-1 text-xs text-slate-400">
          Hospital Discovery, Bed Tracking & Emergency Referrals for Citizens
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl shadow-2xl border border-slate-200 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Mobile Phone Number</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400 font-medium">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="94311 20491"
                  className="w-full p-3.5 pl-12 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-sky-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="patient@gmail.com"
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Enter Verification OTP</label>
              <input
                type="password"
                required
                maxLength={4}
                value={otp}
                onChange={e => {
                  setOtp(e.target.value);
                  setError('');
                }}
                placeholder="••••"
                className="w-full p-3.5 text-center tracking-widest text-base font-mono font-bold bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1 text-center">
                Demo OTP: 1029 (or any 4 digits)
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Continue to Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleUseDemoPatient}
                className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-2xl text-xs border border-sky-300 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Autofill Demo Citizen (Sita Devi • Bokaro)</span>
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>ABDM Health Portal</span>
            </span>
            <span className="text-sky-700 font-semibold">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </div>
  );
};
