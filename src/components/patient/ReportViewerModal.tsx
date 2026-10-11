import React from 'react';
import { LabReport } from '../../types';
import { X, Download, Printer, ShieldCheck, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReportViewerModalProps {
  report: LabReport | null;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({ report, onClose }) => {
  const { addToast } = useApp();

  if (!report) return null;

  const handleDownload = () => {
    addToast('Report Downloaded', `${report.title} PDF saved to downloads folder.`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{report.title}</h3>
              <p className="text-[11px] text-slate-400">{report.hospitalName} • Verified Diagnostic Record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Diagnostic Report Content Formatted like a real Indian diagnostic slip */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 bg-white">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight">{report.hospitalName}</h2>
              <p className="text-xs text-slate-500">Government Accredited NABL Certified Clinical Laboratory</p>
              <p className="text-xs text-slate-500">Bokaro Steel City Health District • Ayushman Bharat Network</p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block">Report ID: {report.id}</span>
              <span className="text-slate-500 block">Date: {report.date}</span>
              <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {report.status}
              </span>
            </div>
          </div>

          {/* Patient Details Sub-header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name</span>
              <span className="font-bold text-slate-900">{report.patientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient ID</span>
              <span className="font-medium text-slate-700">{report.patientId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Referring Doctor</span>
              <span className="font-medium text-slate-700">{report.doctorName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
              <span className="font-medium text-slate-700">{report.category}</span>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
            <span className="font-bold text-sky-950 block mb-1">Clinical Impression / Summary:</span>
            <p className="text-slate-700 leading-relaxed">{report.summary}</p>
          </div>

          {/* Parameters Table */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Investigation Findings</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Test Parameter</th>
                    <th className="py-2.5 px-3">Result</th>
                    <th className="py-2.5 px-3">Reference Range</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.parameters.map((param, i) => (
                    <tr key={i} className={param.isAbnormal ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                      <td className="py-2 px-3 font-medium text-slate-800">{param.name}</td>
                      <td className={`py-2 px-3 font-bold ${param.isAbnormal ? 'text-amber-700' : 'text-slate-900'}`}>
                        {param.result}
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{param.referenceRange}</td>
                      <td className="py-2 px-3 text-right">
                        {param.isAbnormal ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800 block">Digitally Signed & Validated</span>
                <span className="text-[10px]">Ayushman Bharat Digital Mission (ABDM) Compliant</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 block">{report.doctorName}</span>
              <span className="text-[10px]">Senior Consultant Pathologist</span>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">Size: {report.fileSize} • Encrypted FHIR v4.0 JSON/PDF</span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
