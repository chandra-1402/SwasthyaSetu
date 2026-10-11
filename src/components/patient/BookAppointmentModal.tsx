import React, { useState } from 'react';
import { Hospital } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, User, Building2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface BookAppointmentModalProps {
  hospital: Hospital | null;
  onClose: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ hospital, onClose }) => {
  const { bookAppointment, hospitals } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospital ? hospital.id : hospitals[0].id);
  const currentHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  const [department, setDepartment] = useState<string>(currentHospital.specialties[0] || 'General Medicine');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(
    currentHospital.doctorsOnDuty[0]?.name || 'Dr. Alok Verma'
  );
  const [date, setDate] = useState<string>('2026-09-29');
  const [timeSlot, setTimeSlot] = useState<string>('10:30 AM');
  const [notes, setNotes] = useState<string>('Routine consultation & vitals follow-up');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmedToken, setConfirmedToken] = useState<number>(12);

  const availableSlots = [
    '09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', 
    '12:00 PM', '02:30 PM', '03:15 PM', '04:00 PM'
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const token = Math.floor(1 + Math.random() * 25);
    setConfirmedToken(token);

    bookAppointment({
      hospitalId: currentHospital.id,
      department,
      doctorName: selectedDoctor,
      date,
      timeSlot,
      symptomsSummary: notes,
    });

    setIsConfirmed(true);
  };

  if (!hospital && !isConfirmed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Book OPD Consultation</h3>
              <p className="text-[11px] text-sky-200">Ayushman Bharat Priority Token Scheduling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isConfirmed ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">Token reserved at {currentHospital.name}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">OPD Token Number</span>
                <span className="font-mono font-black text-base text-sky-700">#{confirmedToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor</span>
                <span className="font-semibold text-slate-900">{selectedDoctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-900">{department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot</span>
                <span className="font-semibold text-slate-900">{date} at {timeSlot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Hospital Address</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">{currentHospital.address}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition"
              >
                Done / View in Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {/* Hospital details */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Selected Healthcare Facility</span>
              </label>
              <select
                value={selectedHospitalId}
                onChange={e => {
                  setSelectedHospitalId(e.target.value);
                  const h = hospitals.find(x => x.id === e.target.value);
                  if (h) {
                    setDepartment(h.specialties[0] || 'General Medicine');
                    setSelectedDoctor(h.doctorsOnDuty[0]?.name || 'Medical Officer');
                  }
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.distanceKm} km • {h.generalBedsAvailable} beds open)
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Select Department / Specialty</label>
              <div className="grid grid-cols-2 gap-2">
                {currentHospital.specialties.map(spec => (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => setDepartment(spec)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition ${
                      department === spec 
                        ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-1 ring-sky-500' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>Attending Specialist</span>
              </label>
              <select
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {currentHospital.doctorsOnDuty.map((doc, idx) => (
                  <option key={idx} value={doc.name}>
                    {doc.name} — {doc.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">Primary Reason / Symptoms (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                placeholder="Mention complaints for doctor's pre-brief..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Confirm OPD Appointment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
