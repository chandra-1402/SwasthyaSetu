import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookAppointmentModal } from '../../components/patient/BookAppointmentModal';
import { 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  CheckCircle2, 
  PlusCircle, 
  FileText, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const PatientAppointmentsPage: React.FC = () => {
  const { appointments, hospitals } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const pastAppointments = appointments.filter(a => a.status !== 'Upcoming');

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <span>Outpatient (OPD) Consultations</span>
          </h1>
          <p className="text-xs text-slate-500">
            Ayushman Bharat digital token scheduling and priority consultation pass
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New OPD Appointment</span>
        </button>
      </div>

      {/* UPCOMING APPOINTMENTS (Requirement 17) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Upcoming Scheduled Visits ({upcomingAppointments.length})
        </h3>

        {upcomingAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-2">
            <p className="text-xs text-slate-500">No active upcoming appointments.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-sky-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Book an appointment now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAppointments.map(apt => (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                      {apt.department}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{apt.doctorName}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.hospitalName}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Token Pass</span>
                    <span className="font-mono text-xl font-black text-sky-700">#{apt.tokenNumber}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>{apt.date} at {apt.timeSlot}</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    Verified Token
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  <strong>Notes: </strong>{apt.symptomsSummary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST APPOINTMENTS (Requirement 17) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Consultation History ({pastAppointments.length})
        </h3>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs">
          {pastAppointments.map(apt => (
            <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
              <div>
                <span className="font-bold text-slate-900 text-sm">{apt.doctorName}</span>
                <p className="text-slate-500">{apt.department} • {apt.hospitalName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{apt.symptomsSummary}</p>
              </div>

              <div className="flex sm:flex-col sm:items-end justify-between text-slate-500">
                <span className="font-semibold text-slate-800">{apt.date}</span>
                <span className="text-[10px] text-slate-400 font-mono">Token #{apt.tokenNumber} • Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookAppointmentModal
          hospital={hospitals[0]}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
