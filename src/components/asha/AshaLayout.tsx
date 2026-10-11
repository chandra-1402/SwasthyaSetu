import React from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Stethoscope, 
  Send, 
  Building2, 
  CloudSync, 
  UserCheck, 
  AlertCircle,
  LogOut
} from 'lucide-react';

export const AshaLayout: React.FC = () => {
  const { offlineQueueCount, ashaWorker, isAshaLoggedIn, logoutAsha } = useApp();
  const navigate = useNavigate();

  if (!isAshaLoggedIn) {
    return <Navigate to="/asha/login" replace />;
  }

  const navItems = [
    { to: '/asha/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/asha/register-patient', label: 'Register Patient', icon: UserPlus },
    { to: '/asha/patients', label: 'Patients', icon: Users },
    { to: '/asha/triage', label: 'AI Risk Triage', icon: Stethoscope, highlight: true },
    { to: '/asha/referrals', label: 'Referrals', icon: Send },
    { to: '/asha/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/asha/sync', label: 'Sync Data', icon: CloudSync, badge: offlineQueueCount > 0 ? offlineQueueCount : undefined },
    { to: '/asha/profile', label: 'My Profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col w-full overflow-x-hidden">
      <div className="flex-1 flex flex-col md:flex-row w-full min-w-0">
        {/* Desktop Sidebar */}
        <aside className="w-full md:w-60 lg:w-64 bg-teal-950 text-white flex-shrink-0 flex flex-col justify-between hidden md:flex border-r border-teal-900">
          <div className="p-4 space-y-5">
            {/* ASHA Profile Card in Sidebar */}
            <div className="p-3.5 rounded-2xl bg-teal-900/60 border border-teal-800 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-teal-950 font-extrabold text-base shadow-sm shrink-0">
                SD
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{ashaWorker.name}</h4>
                <p className="text-xs text-teal-300 truncate">Bokaro Steel City Cluster</p>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[10px] bg-teal-800 text-teal-200 px-1.5 py-0.2 rounded font-medium">
                    {ashaWorker.id}
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
                          ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-900/40 translate-x-1'
                          : item.highlight
                          ? 'bg-teal-900/40 text-emerald-300 hover:bg-teal-900/80 border border-emerald-500/20'
                          : 'text-teal-100 hover:bg-teal-900/60 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.highlight ? 'text-emerald-400' : 'text-teal-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Offline Assist Footer in Sidebar */}
          <div className="p-3.5 m-3 mb-2 rounded-2xl bg-teal-900/40 border border-teal-800/80 text-xs text-teal-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline Ready Protocol</span>
            </div>
            <p className="text-[10px] leading-relaxed text-teal-300">
              Registration, symptom logging & triage operate smoothly with zero connectivity.
            </p>
          </div>

          {/* Logout button */}
          <div className="px-3 pb-3">
            <button
              onClick={() => {
                logoutAsha();
                navigate('/');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-teal-900/80 hover:bg-rose-900/80 hover:text-white text-teal-200 text-xs font-bold border border-teal-800 transition"
              title="Logout session and return to Landing Page"
            >
              <LogOut className="w-3.5 h-3.5 text-teal-300" />
              <span>Logout & Return Home</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area - Full screen width responsive with zero horizontal scrolling */}
        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-7 overflow-x-hidden pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation for ASHA Workers on Smartphone */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-teal-950 border-t border-teal-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? 'text-emerald-300 font-bold scale-105' : 'text-teal-300/70 hover:text-white'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
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
