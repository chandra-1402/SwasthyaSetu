import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  AlertTriangle, 
  Send, 
  PlusCircle, 
  Stethoscope, 
  Wifi, 
  WifiOff, 
  CloudSync, 
  Building2, 
  ChevronRight,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';
import { DashboardMetricDetailModal, DashboardMetricType } from '../../components/asha/DashboardMetricDetailModal';

export const AshaDashboardPage: React.FC = () => {
  const { ashaWorker, isOnline, offlineQueueCount, patients, assessments, referrals, toggleOnlineStatus } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal drill-down state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<DashboardMetricType>('patients-today');

  // Handle URL query parameters (e.g. /asha/dashboard?view=patients-today)
  useEffect(() => {
    const metricParam = searchParams.get('metric') || searchParams.get('view');
    if (metricParam && ['patients-today', 'high-risk', 'pending-referrals', 'follow-ups'].includes(metricParam)) {
      setSelectedMetric(metricParam as DashboardMetricType);
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const openMetricModal = (metric: DashboardMetricType) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('view', metric);
      return next;
    }, { replace: true });
  };

  const closeMetricModal = () => {
    setIsModalOpen(false);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('view');
      next.delete('metric');
      return next;
    }, { replace: true });
  };

  const getRiskBadge = (risk: string) => {
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

  const initialMockCases = [
    {
      name: 'Sita Devi',
      age: 26,
      village: 'Sector 9, Bokaro',
      risk: 'HIGH',
      status: 'Referred (BGH Awaiting)',
      referralId: 'REF-2026-BK-8842',
      complaint: 'Gestational BP 165/105 with vision blur',
      patientId: 'PAT-BK-001'
    },
    {
      name: 'Ramesh Kumar',
      age: 42,
      village: 'Sector 4, Bokaro',
      risk: 'LOW',
      status: 'Monitoring (Done)',
      referralId: undefined,
      complaint: 'Mild seasonal pyrexia (vitals normal)',
      patientId: 'PAT-BK-002'
    },
    {
      name: 'Anita Kumari',
      age: 31,
      village: 'Sector 12, Bokaro',
      risk: 'MODERATE',
      status: 'Follow-up Due',
      referralId: undefined,
      complaint: 'Vomiting & abdominal tenderness',
      patientId: 'PAT-BK-003'
    },
    {
      name: 'Manoj Soren',
      age: 55,
      village: 'Cooperative Colony',
      risk: 'HIGH',
      status: 'Referred (K.M. Memorial)',
      referralId: 'REF-2026-BK-8819',
      complaint: 'Acute chest pain & tachycardia',
      patientId: 'PAT-BK-004'
    }
  ];

  // Strictly top 3 recent assessments (as required: "display only the top 3 recent assessments, not more than three")
  const recentCases = [
    ...assessments.map(a => {
      const ref = referrals.find(r => r.patientId === a.patientId);
      return {
        name: a.patientName,
        age: a.patientAge,
        village: a.patientVillage,
        risk: a.riskLevel,
        status: ref ? `Referred (${ref.status})` : 'Assessed (Saved)',
        referralId: ref?.id || a.referralId,
        complaint: a.chiefComplaint || a.symptoms.slice(0, 2).join(', '),
        patientId: a.patientId,
      };
    }),
    ...initialMockCases
  ].filter((item, idx, arr) => arr.findIndex(x => x.patientId === item.patientId) === idx).slice(0, 3);

  // Dynamic counts derived from state
  const todayPatients = patients.filter(p => p.todayScheduled !== false);
  const todayCount = todayPatients.length;
  const completedTodayCount = todayPatients.filter(p => p.todayVisitStatus === 'completed').length;
  const pendingTodayCount = todayPatients.filter(p => p.todayVisitStatus === 'pending').length;

  const highRiskCount = patients.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'EMERGENCY').length;
  const pendingReferralsCount = referrals.filter(r => r.status === 'Awaiting Hospital Response' || r.status === 'Hospital Notified').length;
  const followUpsDueCount = patients.filter(p => p.followUpDue === true).length;

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Welcome Card & Connectivity Status Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg flex flex-col xl:flex-row xl:items-center justify-between gap-5 w-full">
        <div className="space-y-2 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold">
            <span>Sub-Centre Chas • Bokaro Steel City</span>
            <span>•</span>
            <span>Cluster #2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
            Good morning, {ashaWorker.name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 leading-relaxed max-w-2xl">
            Today's village round: Sector 9 & Chas municipal sectors. {todayCount} households scheduled for maternal & infant vitals follow-up.
          </p>
        </div>

        {/* Connectivity status block */}
        <div className="bg-teal-950/80 p-3.5 sm:p-4 rounded-2xl border border-teal-700/60 flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-300">Device Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
              isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-400 text-slate-950'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isOnline ? 'Online — Cloud Synced' : 'Offline Mode (Local Storage)'}
            </span>
          </div>

          {!isOnline && offlineQueueCount > 0 && (
            <Link
              to="/asha/sync"
              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
            >
              <CloudSync className="w-3.5 h-3.5 animate-spin" />
              <span>{offlineQueueCount} records waiting to sync</span>
            </Link>
          )}

          <div className="flex gap-2">
            <button
              onClick={toggleOnlineStatus}
              className="text-[10px] text-teal-200 underline hover:text-white"
            >
              Simulate {isOnline ? 'Offline' : 'Online'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
        {/* Metric 1: Patients Today */}
        <button
          type="button"
          onClick={() => openMetricModal('patients-today')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-lg transition-all text-left flex items-center justify-between group cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-600"
          title="Click to view detailed list of all 12 patients for today"
        >
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-teal-700 transition">
                Patients Today
              </span>
              <span className="text-[10px] font-bold text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
              {todayCount}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block truncate">
              {completedTodayCount} done, {pendingTodayCount} pending
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <Users className="w-5 h-5" />
          </div>
        </button>

        {/* Metric 2: High Risk Cases */}
        <button
          type="button"
          onClick={() => openMetricModal('high-risk')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 hover:border-rose-500 shadow-xs hover:shadow-lg transition-all text-left flex items-center justify-between group cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-500"
          title="Click to view high-risk priority patients"
        >
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block">
                High Risk Cases
              </span>
              <span className="text-[10px] font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 block">
              {highRiskCount}
            </span>
            <span className="text-[10px] text-rose-700 font-semibold mt-0.5 block truncate">
              Requires facility transfer
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </button>

        {/* Metric 3: Pending Referrals */}
        <button
          type="button"
          onClick={() => openMetricModal('pending-referrals')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-lg transition-all text-left flex items-center justify-between group cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-500"
          title="Click to view active referrals awaiting hospital bed"
        >
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-amber-700 transition">
                Pending Referrals
              </span>
              <span className="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
              {pendingReferralsCount}
            </span>
            <span className="text-[10px] text-amber-600 font-semibold mt-0.5 block truncate">
              Awaiting hospital bed
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <Send className="w-5 h-5" />
          </div>
        </button>

        {/* Metric 4: Follow-ups Due */}
        <button
          type="button"
          onClick={() => openMetricModal('follow-ups')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-sky-500 shadow-xs hover:shadow-lg transition-all text-left flex items-center justify-between group cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-500"
          title="Click to view follow-ups due"
        >
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block group-hover:text-sky-700 transition">
                Follow-ups Due
              </span>
              <span className="text-[10px] font-bold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
              {followUpsDueCount}
            </span>
            <span className="text-[10px] text-teal-600 font-semibold mt-0.5 block truncate">
              Antenatal & Infant
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full">
        <Link
          to="/asha/register-patient"
          className="p-4 rounded-2xl bg-white hover:bg-teal-50 border-2 border-teal-600 text-teal-900 flex items-center gap-3 transition shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm truncate">Register New Patient</h4>
            <p className="text-[11px] text-slate-500 truncate">Low-literacy intake</p>
          </div>
        </Link>

        <Link
          to="/asha/triage"
          className="p-4 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white flex items-center gap-3 transition shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm truncate">Run AI Risk Triage</h4>
            <p className="text-[11px] text-teal-200 truncate">Decision-Support Tool</p>
          </div>
        </Link>

        <Link
          to="/asha/hospitals"
          className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-3 transition shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm truncate">Check Bokaro Hospitals</h4>
            <p className="text-[11px] text-slate-500 truncate">BGH, Muskan, K.M. Memorial</p>
          </div>
        </Link>
      </div>

      {/* Recent Cases Table - Top 3 Assessments */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden w-full">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">Recent Patient Assessments</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                Top 3 Recent
              </span>
            </div>
            <p className="text-xs text-slate-500">Priority cases triaged under Sub-Centre Chas, Bokaro Steel City</p>
          </div>
          <Link
            to="/asha/patients"
            className="text-xs text-teal-700 font-bold hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Patients ({patients.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-5">Patient Name</th>
                <th className="py-3 px-3 sm:px-4">Age / Location</th>
                <th className="py-3 px-3 sm:px-4">Chief Complaint / Vitals</th>
                <th className="py-3 px-3 sm:px-4 text-center">Risk Level</th>
                <th className="py-3 px-3 sm:px-4">Status</th>
                <th className="py-3 px-4 sm:px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCases.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 sm:px-5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="truncate">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-slate-600 font-medium">
                    {c.age} yrs • {c.village}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-slate-700 max-w-[200px] truncate">
                    {c.complaint}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${getRiskBadge(c.risk)}`}>
                      {c.risk}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4">
                    <span className="font-semibold text-slate-700">{c.status}</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      {c.risk === 'HIGH' && (
                        <Link
                          to="/asha/referrals"
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200 transition"
                        >
                          Referral Slip
                        </Link>
                      )}
                      <Link
                        to={`/asha/triage?patientId=${c.patientId}`}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-teal-700 hover:text-white rounded-lg text-xs font-semibold transition"
                      >
                        View Assessment
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modal for Detailed Category Drill-down */}
      <DashboardMetricDetailModal
        initialMetric={selectedMetric}
        isOpen={isModalOpen}
        onClose={closeMetricModal}
      />
    </div>
  );
};
