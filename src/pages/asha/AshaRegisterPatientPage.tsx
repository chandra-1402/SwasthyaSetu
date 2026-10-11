import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserPlus, Sparkles, ArrowRight, ShieldCheck, Baby, HeartPulse } from 'lucide-react';

export const AshaRegisterPatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPatient, isOnline } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Sector 9');
  const [district, setDistrict] = useState('Bokaro Steel City');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyWeeks, setPregnancyWeeks] = useState<number | ''>('');
  const [isChildCase, setIsChildCase] = useState(false);
  const [abhaId, setAbhaId] = useState('');

  const handleAutofillSitaDevi = () => {
    setName('Sita Devi');
    setAge(26);
    setGender('Female');
    setPhone('9431120491');
    setVillage('Sector 9');
    setDistrict('Bokaro Steel City');
    setEmergencyContact('+91 98351 09871 (Husband - Rajesh)');
    setIsPregnant(true);
    setPregnancyWeeks(32);
    setAbhaId('91-4829-1029-4412');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    const newPatient = addPatient({
      name,
      age: Number(age),
      gender,
      phone: phone || '+91 94311 00000',
      village: village || 'Sector 9',
      district: district || 'Bokaro Steel City',
      emergencyContact: emergencyContact || 'Family member',
      isPregnant,
      pregnancyWeeks: isPregnant && pregnancyWeeks ? Number(pregnancyWeeks) : undefined,
      isChildCase,
      abhaId: abhaId || undefined,
    });

    // Continue directly to triage assessment screen with this patient!
    navigate(`/asha/triage?patientId=${newPatient.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-700/20">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">New Patient Registration</h1>
            <p className="text-xs text-slate-500">Fast low-literacy intake form (Auto-queues offline)</p>
          </div>
        </div>

        {/* 1-Click Autofill Button for Hackathon Demo */}
        <button
          type="button"
          onClick={handleAutofillSitaDevi}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Autofill "Sita Devi" (Demo)</span>
        </button>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Core details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            1. Basic Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 text-sm block mb-1.5">
                Patient Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sita Devi"
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 text-sm block mb-1.5">
                Age (in years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                max={120}
                value={age}
                onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 26"
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Gender Selector with large easy click controls */}
          <div>
            <label className="font-bold text-slate-800 text-sm block mb-1.5">Gender</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Female', 'Male', 'Other'] as const).map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-2xl text-sm font-bold transition border-2 ${
                    gender === g
                      ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 text-sm block mb-1.5">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="94311 20491"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 text-sm block mb-1.5">Emergency Contact Details</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                placeholder="e.g. Rajesh (Husband) 9835109871"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Sector */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            2. Village & Jurisdiction
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 text-sm block mb-1.5">Village Name</label>
              <input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 text-sm block mb-1.5">District</label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Special Health Condition Indicators (Maternal / Infant) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
            3. Vulnerability Indicators
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pregnancy check */}
            <div
              onClick={() => setIsPregnant(!isPregnant)}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-center justify-between ${
                isPregnant ? 'border-teal-600 bg-teal-50/80 shadow-sm' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isPregnant ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Maternal / Pregnancy</h4>
                  <p className="text-[11px] text-slate-500">Antenatal care protocol</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPregnant}
                onChange={() => {}}
                className="w-5 h-5 text-teal-600 rounded"
              />
            </div>

            {/* Child case check */}
            <div
              onClick={() => setIsChildCase(!isChildCase)}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition flex items-center justify-between ${
                isChildCase ? 'border-teal-600 bg-teal-50/80 shadow-sm' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isChildCase ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Child / Infant Case</h4>
                  <p className="text-[11px] text-slate-500">IMNCI pediatric protocol</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isChildCase}
                onChange={() => {}}
                className="w-5 h-5 text-teal-600 rounded"
              />
            </div>
          </div>

          {/* Conditional Pregnancy Weeks */}
          {isPregnant && (
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 animate-in fade-in">
              <label className="font-bold text-teal-950 block mb-1">
                Gestational Age (Pregnancy Weeks)
              </label>
              <input
                type="number"
                min={1}
                max={42}
                value={pregnancyWeeks}
                onChange={e => setPregnancyWeeks(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 32 weeks"
                className="w-full p-3 bg-white border border-teal-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          )}

          {/* Optional ABHA ID */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Ayushman Bharat Health Account (ABHA ID / Placeholder)
            </label>
            <input
              type="text"
              value={abhaId}
              onChange={e => setAbhaId(e.target.value)}
              placeholder="91-4829-1029-4412"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-mono text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-teal-700/25 flex items-center justify-center gap-2 transition"
          >
            <span>Continue to Clinical Risk Assessment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="mt-2 text-center text-[11px] text-slate-500">
            {isOnline ? 'Online — Record will sync to cloud repository.' : 'Offline — Record safely cached in local storage.'}
          </div>
        </div>
      </form>
    </div>
  );
};
