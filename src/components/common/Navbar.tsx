import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Building2, 
  Wifi, 
  WifiOff, 
  LogOut, 
  Menu, 
  X, 
  Activity,
  PhoneCall
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isOnline, 
    toggleOnlineStatus, 
    offlineQueueCount, 
    isAshaLoggedIn, 
    ashaWorker, 
    logoutAsha,
    isPatientLoggedIn,
    patientUser,
    logoutPatient
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = location.pathname;
  const isAshaRoute = pathname.startsWith('/asha');
  const isPatientRoute = pathname.startsWith('/patient');
  const isPublicRoute = !isAshaRoute && !isPatientRoute;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Offline Alert Strip when disconnected */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 mx-auto">
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE MODE: Device is disconnected. Assessments and registrations are safely cached locally.</span>
            {offlineQueueCount > 0 && (
              <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {offlineQueueCount} queued
              </span>
            )}
          </div>
          <button
            onClick={toggleOnlineStatus}
            className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded hover:bg-slate-800 transition"
          >
            Reconnect
          </button>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Brand Area */}
          <div className="flex items-center gap-3 shrink-0">
            {isAshaRoute ? (
              <Link to="/asha/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-slate-900">SwasthyaSetu</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded border border-teal-300">
                      ASHA
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-700 font-medium hidden sm:block">Bokaro Steel City Cluster</p>
                </div>
              </Link>
            ) : isPatientRoute ? (
              <Link to="/patient/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-slate-900">SwasthyaSetu</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded border border-sky-300">
                      PATIENT
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-700 font-medium hidden sm:block">Hospital Discovery & Bed Tracking</p>
                </div>
              </Link>
            ) : (
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-sky-600 flex items-center justify-center text-white shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">SwasthyaSetu</span>
                  <span className="text-slate-300 font-light">|</span>
                  <span className="font-semibold text-slate-700 text-sm">Health Network</span>
                </div>
              </Link>
            )}
          </div>

          {/* Public Center Navigation Links with clean spacing */}
          {isPublicRoute && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/" className={`hover:text-teal-700 transition whitespace-nowrap ${pathname === '/' ? 'text-teal-700 font-bold' : ''}`}>
                Home
              </Link>
              <Link to="/how-it-works" className={`hover:text-teal-700 transition whitespace-nowrap ${pathname === '/how-it-works' ? 'text-teal-700 font-bold' : ''}`}>
                How It Works
              </Link>
              <Link to="/about" className={`hover:text-teal-700 transition whitespace-nowrap ${pathname === '/about' ? 'text-teal-700 font-bold' : ''}`}>
                About & Mission
              </Link>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Online / Offline Simulator Toggle */}
            <button
              onClick={toggleOnlineStatus}
              title="Toggle Online/Offline state simulation"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                  : 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* ASHA Portal Active Header Elements */}
            {isAshaRoute && isAshaLoggedIn && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{ashaWorker.name}</span>
                  <span className="text-[10px] text-teal-700 font-mono font-medium">{ashaWorker.id}</span>
                </div>
                <button
                  onClick={() => {
                    logoutAsha();
                    navigate('/');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Logout ASHA Session and Return to Home"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Patient Portal Active Header Elements */}
            {isPatientRoute && (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 text-[11px] font-bold">
                  <PhoneCall className="w-3 h-3 text-rose-600" />
                  <span>Ambulance: 108</span>
                </div>

                {isPatientLoggedIn && (
                  <div className="flex items-center gap-2">
                    <div className="hidden lg:flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-800">{patientUser.name}</span>
                      <span className="text-[10px] text-sky-700 font-medium">Bokaro</span>
                    </div>
                    <button
                      onClick={() => {
                        logoutPatient();
                        navigate('/');
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Logout Patient Session and Return to Home"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {isPublicRoute && (
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-1.5 text-slate-700">Home</Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-1.5 text-slate-700">How It Works</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-1.5 text-slate-700">About & Mission</Link>
            </div>
          )}

          {isAshaRoute && (
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link to="/asha/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Dashboard</Link>
              <Link to="/asha/register-patient" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Register Patient</Link>
              <Link to="/asha/triage" onClick={() => setMobileMenuOpen(false)} className="py-1 text-teal-700 font-bold">AI Risk Triage</Link>
              <Link to="/asha/referrals" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Referrals</Link>
              <Link to="/asha/hospitals" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Hospitals</Link>
              <Link to="/asha/sync" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Offline Sync</Link>
              {isAshaLoggedIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutAsha();
                    navigate('/');
                  }}
                  className="mt-2 py-2 px-3 text-left font-bold text-rose-600 bg-rose-50 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout to Landing Page</span>
                </button>
              )}
            </div>
          )}

          {isPatientRoute && (
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link to="/patient/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Dashboard</Link>
              <Link to="/patient/hospitals" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Find Hospitals</Link>
              <Link to="/patient/appointments" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Appointments</Link>
              <Link to="/patient/reports" onClick={() => setMobileMenuOpen(false)} className="py-1 text-slate-700">Lab Reports</Link>
              <Link to="/patient/referrals" onClick={() => setMobileMenuOpen(false)} className="py-1 text-sky-700 font-bold">My Referrals</Link>
              {isPatientLoggedIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutPatient();
                    navigate('/');
                  }}
                  className="mt-2 py-2 px-3 text-left font-bold text-rose-600 bg-rose-50 rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout to Landing Page</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
