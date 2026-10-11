import React from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Search, 
  Calendar, 
  FileText, 
  Share2, 
  HeartPulse, 
  User, 
  ShieldCheck,
  LogOut 
} from 'lucide-react';

export const PatientLayout: React.FC = () => {
  const { patientUser, referrals, isPatientLoggedIn, logoutPatient } = useApp();
  const navigate = useNavigate();

  if (!isPatientLoggedIn) {
    return <Navigate to="/patient/login" replace />;
  }

  const activeReferralsCount = referrals.filter(r => r.status !== 'Completed').length;

  const navItems = [
    { to: '/patient/dashboard', label: 'Home Dashboard', icon: Home },
    { to: '/patient/hospitals', label: 'Find Hospitals', icon: Search },
    { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { to: '/patient/reports', label: 'Digital Lab Reports', icon: FileText },
    { to: '/patient/referrals', label: 'My Referrals', icon: Share2, badge: activeReferralsCount > 0 ? activeReferralsCount : undefined },
    { to: '/patient/health-records', label: 'Health Records', icon: HeartPulse },
    { to: '/patient/profile', label: 'Profile & ABHA', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <div className="flex-1 flex flex-col md:flex-row w-full min-w-0">
        {/* Desktop Modern Consumer Sidebar */}
        <aside className="w-full md:w-60 lg:w-64 bg-white text-slate-700 flex-shrink-0 flex flex-col justify-between hidden md:flex border-r border-slate-200 shadow-xs">
          <div className="p-4 space-y-5">
            {/* Patient Profile Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 border border-sky-100 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                SD
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">{patientUser.name}</h4>
                <p className="text-xs text-slate-500 truncate">{patientUser.age} yrs • {patientUser.village}</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                    ABHA Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/20'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Emergency support card in sidebar */}
          <div className="p-3.5 m-3 mb-2 rounded-2xl bg-slate-900 text-white space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">24x7 HospiCare Helpline</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Bokaro hospital bed verification & ambulance coordination.
            </p>
            <div className="pt-0.5 text-xs font-mono font-bold text-sky-300">
              1800-11-4477
            </div>
          </div>

          {/* Logout button */}
          <div className="px-3 pb-3">
            <button
              onClick={() => {
                logoutPatient();
                navigate('/');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold border border-slate-200 transition"
              title="Logout session and return to Landing Page"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              <span>Logout & Return Home</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area - Full screen width responsive with zero horizontal scrolling */}
        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-7 overflow-x-hidden pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation for Patient */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-900'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
