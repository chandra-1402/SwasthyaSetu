import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { HeartHandshake, WifiOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export const AshaLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsha, isOnline, toggleOnlineStatus, ashaWorker } = useApp();

  const [ashaId, setAshaId] = useState('');
  const [phone, setPhone] = useState('');
  const [authMethod, setAuthMethod] = useState<'otp' | 'pin'>('pin');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ashaId.trim() || !phone.trim() || !otp.trim()) {
      setError('Please enter your ASHA Worker ID, phone number, and security PIN/OTP.');
      return;
    }
    setError('');
    loginAsha();
    navigate('/asha/dashboard');
  };

  const handleUseDemoAccount = () => {
    setAshaId('ASHA-BK-10234');
    setPhone('9835044219');
    setOtp('4421');
    setError('');
  };

  return (
    <div className="min-h-screen bg-teal-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Subtle backdrop pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Back to Home Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-900/50 mb-4 border border-teal-500/40">
          <HeartHandshake className="w-9 h-9" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">SwasthyaSetu</h2>
        <p className="mt-1 text-xs text-teal-200 font-medium">Frontline Community Healthcare Worker Login</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl shadow-2xl border border-teal-800/40 space-y-5">
          {/* Offline Mode Banner (Requirement 5) */}
          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-teal-900">
                <WifiOff className="w-4 h-4 text-teal-700" />
                <span>Offline Mode Available</span>
              </span>
              <button
                type="button"
                onClick={toggleOnlineStatus}
                className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded font-semibold hover:bg-teal-800 transition"
              >
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              Core patient assessment and triage can continue when internet connectivity is unavailable. Records save locally.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">ASHA Unique Worker ID</label>
              <input
                type="text"
                required
                value={ashaId}
                onChange={e => {
                  setAshaId(e.target.value);
                  setError('');
                }}
                placeholder="e.g. ASHA-BK-10234"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Registered Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 font-medium">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="98350 44219"
                  className="w-full p-3 pl-12 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Auth toggle */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  authMethod === 'otp' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                One-Time OTP
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('pin')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  authMethod === 'pin' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Security PIN
              </button>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {authMethod === 'otp' ? 'Enter 4-Digit OTP' : 'Enter 4-Digit Security PIN'}
              </label>
              <input
                type="password"
                required
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="••••"
                className="w-full p-3 text-center tracking-widest text-base font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 transition"
              >
                <span>Login to SwasthyaSetu (ASHA)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Account Button (Requirement 5) */}
              <button
                type="button"
                onClick={handleUseDemoAccount}
                className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-2xl text-xs border border-teal-300 flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                <span>Autofill Demo Credentials (Sunita Devi • ASHA-BK-10234)</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sub-Centre Chas • Bokaro Steel City</span>
            <span className="text-teal-700 font-semibold">MoHFW Approved Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
