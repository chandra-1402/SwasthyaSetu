import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  PlusCircle, 
  Stethoscope, 
  HeartPulse, 
  ChevronRight, 
  CheckCircle2, 
  WifiOff, 
  AlertTriangle, 
  CalendarCheck,
  Check,
  Clock
} from 'lucide-react';
import { RiskLevel } from '../../types';

export const AshaPatientsPage: React.FC = () => {
  const { patients, togglePatientTodayStatus } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'high-risk' | 'follow-up' | 'pregnant' | 'offline'>('all');

  // Sync with URL query parameter
  useEffect(() => {
    const f = searchParams.get('filter');
    if (f && ['all', 'today', 'high-risk', 'follow-up', 'pregnant', 'offline'].includes(f)) {
      setFilterType(f as any);
    }
  }, [searchParams]);

  const handleFilterChange = (type: typeof filterType) => {
    setFilterType(type);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (type === 'all') {
        next.delete('filter');
      } else {
        next.set('filter', type);
      }
      return next;
    }, { replace: true });
  };

  const todayPatients = patients.filter(p => p.todayScheduled !== false);
  const highRiskPatients = patients.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'EMERGENCY');
  const followUpPatients = patients.filter(p => p.followUpDue === true);
  const pregnantPatients = patients.filter(p => p.isPregnant);
  const offlinePatients = patients.filter(p => p.isOfflineCreated);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.village.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.toLowerCase().includes(search.toLowerCase()) ||
                          (p.visitPurpose && p.visitPurpose.toLowerCase().includes(search.toLowerCase()));

    if (filterType === 'today') return matchesSearch && p.todayScheduled !== false;
    if (filterType === 'high-risk') return matchesSearch && (p.riskLevel === 'HIGH' || p.riskLevel === 'EMERGENCY');
    if (filterType === 'follow-up') return matchesSearch && p.followUpDue === true;
    if (filterType === 'pregnant') return matchesSearch && p.isPregnant;
    if (filterType === 'offline') return matchesSearch && p.isOfflineCreated;
    return matchesSearch;
  });

  const getRiskBadge = (risk?: RiskLevel) => {
    switch (risk) {
      case 'EMERGENCY':
        return 'bg-red-100 text-red-800 border-red-300 font-black';
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'LOW':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Community Patient Registry</span>
          </h1>
          <p className="text-xs text-slate-500">
            Assigned households under Sub-Centre Chas, Bokaro Steel City ({patients.length} registered beneficiaries)
          </p>
        </div>

        <Link
          to="/asha/register-patient"
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-700/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Patient</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3 text-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, village, or clinical purpose..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition ${
              filterType === 'all' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Patients ({patients.length})
          </button>

          <button
            onClick={() => handleFilterChange('today')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              filterType === 'today' ? 'bg-teal-800 text-white shadow-xs' : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Today's Round ({todayPatients.length})</span>
          </button>

          <button
            onClick={() => handleFilterChange('high-risk')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              filterType === 'high-risk' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>High Risk ({highRiskPatients.length})</span>
          </button>

          <button
            onClick={() => handleFilterChange('follow-up')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              filterType === 'follow-up' ? 'bg-sky-700 text-white shadow-xs' : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Follow-up Due ({followUpPatients.length})</span>
          </button>

          <button
            onClick={() => handleFilterChange('pregnant')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              filterType === 'pregnant' ? 'bg-purple-700 text-white shadow-xs' : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-purple-600" />
            <span>Pregnant ({pregnantPatients.length})</span>
          </button>

          <button
            onClick={() => handleFilterChange('offline')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              filterType === 'offline' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Queued Offline ({offlinePatients.length})</span>
          </button>
        </div>
      </div>

      {/* Patient Cards / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Patient Name & ID</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Category & Purpose</th>
                <th className="py-3 px-3 text-center">Risk Level</th>
                <th className="py-3 px-3 text-center">Today's Visit</th>
                <th className="py-3 px-4">Sync Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map(patient => {
                const isDone = patient.todayVisitStatus === 'completed';

                return (
                  <tr key={patient.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${
                          patient.riskLevel === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : patient.isPregnant
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="block">{patient.name}</span>
                            {patient.householdNo && (
                              <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-500 font-mono">
                                {patient.householdNo}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">{patient.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{patient.age} yrs • {patient.gender}</div>
                      <div className="text-[10px] text-slate-400">{patient.village}, {patient.district}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {patient.isPregnant ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <HeartPulse className="w-3 h-3 text-rose-600" />
                          Pregnant ({patient.pregnancyWeeks || 32}w)
                        </span>
                      ) : patient.isChildCase ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          Infant Care
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">General Adult</span>
                      )}
                      {patient.visitPurpose && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                          {patient.visitPurpose}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${getRiskBadge(patient.riskLevel)}`}>
                        {patient.riskLevel || 'LOW'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      {patient.todayScheduled !== false ? (
                        <button
                          onClick={() => togglePatientTodayStatus(patient.id)}
                          title="Click to toggle visit status"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Pending</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Not today</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {patient.synced ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cloud Synced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                          <WifiOff className="w-3 h-3 text-amber-600" /> Queued Locally
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/asha/triage?patientId=${patient.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Triage</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
