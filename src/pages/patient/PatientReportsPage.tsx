import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { LabReport } from '../../types';
import { ReportViewerModal } from '../../components/patient/ReportViewerModal';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search
} from 'lucide-react';

export const PatientReportsPage: React.FC = () => {
  const { labReports, addToast } = useApp();
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [search, setSearch] = useState('');

  const filteredReports = labReports.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase()) ||
    r.hospitalName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (report: LabReport, e: React.MouseEvent) => {
    e.stopPropagation();
    addToast('Report Downloaded', `${report.title} saved to offline downloads.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>Digital Diagnostic Laboratory Reports</span>
          </h1>
          <p className="text-xs text-slate-500">
            NABL-accredited diagnostic slips verified under Ayushman Bharat Digital Mission (ABDM)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports by test name (e.g. CBC, Ultrasound, Urine, Platelets)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-sky-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Reports List Cards (Requirement 18) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map(report => (
          <div
            key={report.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-400 hover:shadow-md transition space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {report.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{report.hospitalName}</span>
                  </p>
                </div>

                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {report.status}
                </span>
              </div>

              {/* Summary */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Summary Impression</span>
                <p className="line-clamp-2 leading-relaxed">{report.summary}</p>
              </div>

              {/* Date & Consultant */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{report.date}</span>
                </span>
                <span className="font-medium text-slate-700">{report.doctorName}</span>
              </div>
            </div>

            {/* Buttons: View Report & Download (Requirement 18) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">{report.fileSize}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDownload(report, e)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Viewer Modal with interactive parameter table */}
      {selectedReport && (
        <ReportViewerModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};
