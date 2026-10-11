import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Patient, RiskLevel } from '../../types';
import {
  X,
  Users,
  AlertTriangle,
  Send,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  Phone,
  Stethoscope,
  Building2,
  Sparkles,
  Ambulance,
  HeartPulse,
  Baby,
  ChevronRight,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export type DashboardMetricType = 'patients-today' | 'high-risk' | 'pending-referrals' | 'follow-ups';

interface DashboardMetricDetailModalProps {
  initialMetric: DashboardMetricType;
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardMetricDetailModal: React.FC<DashboardMetricDetailModalProps> = ({
  initialMetric,
  isOpen,
  onClose,
}) => {
  const {
    patients,
    referrals,
    assessments,
    hospitals,
    togglePatientTodayStatus,
    simulateHospitalAcceptance,
    addToast
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardMetricType>(initialMetric);
  const [searchQuery, setSearchQuery] = useState('');
  const [todayFilter, setTodayFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [followUpFilter, setFollowUpFilter] = useState<'all' | 'antenatal' | 'infant' | 'adult'>('all');

  // Sync tab with initialMetric when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMetric);
      setSearchQuery('');
    }
  }, [isOpen, initialMetric]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Data computations for Patients Today
  const todayPatients = patients.filter(p => p.todayScheduled !== false);
  const todayCompleted = todayPatients.filter(p => p.todayVisitStatus === 'completed');
  const todayPending = todayPatients.filter(p => p.todayVisitStatus === 'pending');
  const completedCount = todayCompleted.length;
  const pendingCount = todayPending.length;
  const totalTodayCount = todayPatients.length;
  const completionPercentage = totalTodayCount > 0 ? Math.round((completedCount / totalTodayCount) * 100) : 0;

  const filteredTodayPatients = todayPatients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.visitPurpose && p.visitPurpose.toLowerCase().includes(searchQuery.toLowerCase()));

    if (todayFilter === 'completed') return matchesSearch && p.todayVisitStatus === 'completed';
    if (todayFilter === 'pending') return matchesSearch && p.todayVisitStatus === 'pending';
    return matchesSearch;
  });

  // 2. High Risk Patients
  const highRiskPatients = patients.filter(
    p => p.riskLevel === 'HIGH' || p.riskLevel === 'EMERGENCY'
  );
  const filteredHighRiskPatients = highRiskPatients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Pending Referrals
  const pendingReferralsList = referrals.filter(
    r => r.status === 'Awaiting Hospital Response' || r.status === 'Hospital Notified'
  );
  const filteredPendingReferrals = pendingReferralsList.filter(r =>
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. Follow-ups Due
  const followUpPatients = patients.filter(p => p.followUpDue === true);
  const filteredFollowUpPatients = followUpPatients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.followUpReason && p.followUpReason.toLowerCase().includes(searchQuery.toLowerCase()));

    if (followUpFilter === 'antenatal') return matchesSearch && p.isPregnant;
    if (followUpFilter === 'infant') return matchesSearch && p.isChildCase;
    if (followUpFilter === 'adult') return matchesSearch && !p.isPregnant && !p.isChildCase;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                Frontline Operations Drill-down
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 hidden sm:inline">Sub-Centre Chas, Bokaro</span>
            </div>
            <h2 id="modal-title" className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
              {activeTab === 'patients-today' && 'Today\'s Village Round Patient List'}
              {activeTab === 'high-risk' && 'High Risk Clinical Priority Cases'}
              {activeTab === 'pending-referrals' && 'Active Referrals Awaiting Hospital Bed'}
              {activeTab === 'follow-ups' && 'Scheduled Follow-ups Due (Antenatal & Infant)'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition shadow-xs shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Interactive Category Tabs */}
        <div className="p-2 sm:px-6 bg-slate-100/70 border-b border-slate-200 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => { setActiveTab('patients-today'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeTab === 'patients-today'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 ring-2 ring-teal-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patients Today</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'patients-today' ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-700'
            }`}>
              {totalTodayCount}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('high-risk'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeTab === 'high-risk'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 ring-2 ring-rose-500/30'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>High Risk Cases</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'high-risk' ? 'bg-rose-700 text-rose-100' : 'bg-rose-100 text-rose-800'
            }`}>
              {highRiskPatients.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('pending-referrals'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeTab === 'pending-referrals'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 ring-2 ring-amber-500/30'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Pending Referrals</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'pending-referrals' ? 'bg-amber-700 text-amber-100' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingReferralsList.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('follow-ups'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeTab === 'follow-ups'
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/25 ring-2 ring-sky-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-sky-600" />
            <span>Follow-up Due</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'follow-ups' ? 'bg-sky-800 text-sky-100' : 'bg-slate-100 text-slate-700'
            }`}>
              {followUpPatients.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* ======================= TAB 1: PATIENTS TODAY ======================= */}
          {activeTab === 'patients-today' && (
            <div className="space-y-4">
              {/* Summary Stats Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">Total Scheduled</span>
                    <span className="text-2xl font-black text-teal-950 mt-0.5 block">{totalTodayCount} Households</span>
                    <span className="text-[11px] text-teal-700 font-semibold mt-0.5 block">Sector 9 & Chas</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
                    {totalTodayCount}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Completed / Done</span>
                    <span className="text-2xl font-black text-emerald-950 mt-0.5 block">{completedCount} Done</span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">Vitals recorded & saved</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Pending Visits</span>
                    <span className="text-2xl font-black text-amber-950 mt-0.5 block">{pendingCount} Pending</span>
                    <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Scheduled for afternoon</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Today's Village Round Completion Progress</span>
                    <span className="text-teal-700">{completedCount} of {totalTodayCount} completed ({completionPercentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search name, household, complaint..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setTodayFilter('all')}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                      todayFilter === 'all'
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({totalTodayCount})
                  </button>
                  <button
                    onClick={() => setTodayFilter('completed')}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                      todayFilter === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ✓ Done ({completedCount})
                  </button>
                  <button
                    onClick={() => setTodayFilter('pending')}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                      todayFilter === 'pending'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    ⏳ Pending ({pendingCount})
                  </button>
                </div>
              </div>

              {/* Patient List Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Patient & Household</th>
                        <th className="py-3 px-3">Scheduled Time & Purpose</th>
                        <th className="py-3 px-3">Vitals / Clinical Note</th>
                        <th className="py-3 px-3 text-center">Risk Level</th>
                        <th className="py-3 px-3 text-center">Visit Status</th>
                        <th className="py-3 px-4 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTodayPatients.map((patient, idx) => {
                        const isDone = patient.todayVisitStatus === 'completed';
                        return (
                          <tr key={patient.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${
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
                                    <span className="font-bold text-slate-900">{patient.name}</span>
                                    {patient.householdNo && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                        {patient.householdNo}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 font-normal">
                                    {patient.age} yrs • {patient.gender} • {patient.village}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{patient.todayScheduledTime || '09:00 AM'}</span>
                              </div>
                              <div className="text-[11px] text-teal-700 font-medium truncate max-w-[190px]">
                                {patient.visitPurpose || 'Routine Health Follow-up'}
                              </div>
                            </td>

                            <td className="py-3 px-3 text-slate-600 text-[11px] max-w-[210px]">
                              {patient.lastVitalsSummary ? (
                                <span className="font-medium text-slate-700">{patient.lastVitalsSummary}</span>
                              ) : (
                                <span className="text-slate-400 italic">No vitals logged yet</span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getRiskBadge(patient.riskLevel)}`}>
                                {patient.riskLevel || 'LOW'}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
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
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => togglePatientTodayStatus(patient.id)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                                    isDone
                                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600'
                                  }`}
                                >
                                  {isDone ? 'Mark Pending' : 'Mark Done'}
                                </button>
                                <button
                                  onClick={() => {
                                    onClose();
                                    navigate(`/asha/triage?patientId=${patient.id}`);
                                  }}
                                  className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                                >
                                  <Stethoscope className="w-3 h-3" />
                                  <span>Triage</span>
                                </button>
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
          )}

          {/* ======================= TAB 2: HIGH RISK CASES ======================= */}
          {activeTab === 'high-risk' && (
            <div className="space-y-4">
              {/* Alert Header Banner */}
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-rose-950 text-sm sm:text-base">
                      {highRiskPatients.length} High Risk Priority Cases Requiring Facility Care
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase">
                      Urgent Action
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                    Patients below have presented red-flag symptoms (severe gestational hypertension, suspected acute coronary syndrome, or severe puerperal pyrexia). Ensure hospital admission confirmation or emergency transport dispatch.
                  </p>
                </div>
              </div>

              {/* High Risk Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredHighRiskPatients.map(patient => {
                  const patientAssess = assessments.find(a => a.patientId === patient.id);
                  const patientRef = referrals.find(r => r.patientId === patient.id);

                  return (
                    <div
                      key={patient.id}
                      className="bg-white rounded-2xl border-2 border-rose-200 hover:border-rose-400 p-4.5 space-y-3.5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold border border-rose-200">
                            {patient.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>HIGH RISK</span>
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-base text-slate-900">{patient.name}</h4>
                          <p className="text-xs text-slate-500">
                            {patient.age} yrs • {patient.gender} • {patient.village}
                          </p>
                        </div>

                        {/* Clinical Presentation & Vitals */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <div className="text-[11px] font-bold text-rose-900">
                            Chief Complaint / Red Flags:
                          </div>
                          <p className="text-slate-700 leading-snug">
                            {patientAssess?.chiefComplaint || patient.lastVitalsSummary || 'Severe clinical warning signs detected'}
                          </p>

                          {patientAssess?.vitals && (
                            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px] font-mono">
                              <div>BP: <strong className="text-rose-700">{patientAssess.vitals.bloodPressureSystolic}/{patientAssess.vitals.bloodPressureDiastolic}</strong></div>
                              <div>HR: <strong>{patientAssess.vitals.heartRate} bpm</strong></div>
                              <div>SpO2: <strong>{patientAssess.vitals.spO2}%</strong></div>
                              <div>Temp: <strong>{patientAssess.vitals.temperature}°F</strong></div>
                            </div>
                          )}
                        </div>

                        {/* Referral Status Badge */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500 font-medium">Facility Transfer:</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            patientRef?.status === 'Hospital Accepted'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {patientRef ? patientRef.status : 'Referral Advised'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {patientRef ? (
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/asha/referrals`);
                            }}
                            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>View Referral Slip ({patientRef.id})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/asha/triage?patientId=${patient.id}`);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-rose-600 to-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Initiate Emergency Referral</span>
                          </button>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              navigate(`/asha/triage?patientId=${patient.id}`);
                            }}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold transition text-center"
                          >
                            Full Assessment
                          </button>
                          <a
                            href="tel:108"
                            className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1"
                          >
                            <Ambulance className="w-3 h-3 text-emerald-700" />
                            <span>Call 108</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= TAB 3: PENDING REFERRALS ======================= */}
          {activeTab === 'pending-referrals' && (
            <div className="space-y-4">
              {/* Alert Banner */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
                      {pendingReferralsList.length} Referrals Awaiting Hospital Bed Allocation
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Packaged referral records transmitted to Bokaro health facilities. Admitting teams are currently verifying emergency triage & obstetric bed availability.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/asha/referrals');
                  }}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-extrabold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition shrink-0"
                >
                  <span>Open Referrals Hub</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Pending Referrals List */}
              <div className="space-y-3.5">
                {filteredPendingReferrals.map(ref => {
                  const targetHospital = hospitals.find(h => h.id === ref.hospitalId);

                  return (
                    <div
                      key={ref.id}
                      className="bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-400 p-4 sm:p-5 shadow-xs transition space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg">
                            {ref.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            {ref.riskLevel} PRIORITY
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                            Awaiting Bed Confirmation
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 font-medium">
                          Initiated: {new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 108 Transport Notified
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Patient Column */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Details</span>
                          <h4 className="font-extrabold text-sm text-slate-900">{ref.patientName}</h4>
                          <p className="text-slate-600">{ref.patientAge} yrs • {ref.patientGender} • {ref.village}</p>
                          <p className="text-slate-500 font-mono text-[11px]">Contact: {ref.patientPhone}</p>
                        </div>

                        {/* Clinical Reason */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Diagnosis / Clinical Urgency</span>
                          <p className="font-bold text-slate-800">{ref.primaryDiagnosisHint}</p>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{ref.urgencyReason}</p>
                        </div>

                        {/* Destination Hospital */}
                        <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Designated Receiving Facility</span>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                            <span className="truncate">{ref.hospitalName}</span>
                          </div>
                          {targetHospital && (
                            <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                              <div>Distance: <strong>{targetHospital.distanceKm} km</strong> (~{targetHospital.travelTimeMinutes} mins)</div>
                              <div className="text-emerald-700 font-semibold">
                                Live Beds: {targetHospital.maternityBedsAvailable} Maternity, {targetHospital.icuBedsAvailable} ICU
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Actions Strip */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                        <button
                          onClick={() => simulateHospitalAcceptance(ref.id)}
                          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Simulate Hospital Bed Confirmation (Demo)</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onClose();
                              navigate('/asha/referrals');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>Open Tracker</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= TAB 4: FOLLOW-UPS DUE ======================= */}
          {activeTab === 'follow-ups' && (
            <div className="space-y-4">
              {/* Header Banner */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sky-950 text-sm sm:text-base">
                    {followUpPatients.length} Scheduled Maternal & Infant Follow-ups Due
                  </h3>
                  <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">
                    Essential follow-up protocols for Sub-Centre Chas: Antenatal vitals review, Infant immunization card checks, and post-illness fever monitoring.
                  </p>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setFollowUpFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                    followUpFilter === 'all'
                      ? 'bg-sky-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({followUpPatients.length})
                </button>
                <button
                  onClick={() => setFollowUpFilter('antenatal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                    followUpFilter === 'antenatal'
                      ? 'bg-purple-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Antenatal ANC (2)
                </button>
                <button
                  onClick={() => setFollowUpFilter('infant')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                    followUpFilter === 'infant'
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Infant Immunization (2)
                </button>
                <button
                  onClick={() => setFollowUpFilter('adult')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                    followUpFilter === 'adult'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Post-Illness Vitals (1)
                </button>
              </div>

              {/* Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredFollowUpPatients.map(patient => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 p-4 shadow-xs transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                          {patient.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">
                          {patient.followUpDueDate || 'Due Today'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${
                          patient.isPregnant ? 'bg-purple-100 text-purple-800' : patient.isChildCase ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{patient.name}</h4>
                          <p className="text-[11px] text-slate-500">
                            {patient.age} yrs • {patient.gender} • {patient.village}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Follow-up Protocol:</span>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {patient.followUpReason || 'Routine health review & vitals follow-up'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          navigate(`/asha/triage?patientId=${patient.id}`);
                        }}
                        className="flex-1 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Record Vitals & Triage</span>
                      </button>

                      <a
                        href={`tel:${patient.phone}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition shrink-0"
                        title="Call patient"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Strip */}
        <div className="p-3.5 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 text-xs">
          <span className="text-slate-500 text-[11px]">
            Connected as <strong>Sunita Devi (ASHA-BK-10234)</strong> • Sub-Centre Chas
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                navigate('/asha/patients');
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold transition flex items-center gap-1 shadow-xs"
            >
              <span>Open Full Patient Registry</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
