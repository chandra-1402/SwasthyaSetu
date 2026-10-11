import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { evaluateClinicalTriage, TriageEvaluationResult } from '../../utils/triageEngine';
import { HospitalSelectModal } from '../../components/asha/HospitalSelectModal';
import { 
  Stethoscope, 
  Sparkles, 
  Activity, 
  Heart, 
  Wind, 
  Thermometer, 
  AlertCircle, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Ambulance, 
  Building2, 
  Save, 
  History,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AshaTriagePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { patients, assessments, addAssessment, addToast } = useApp();

  // Find or default selected patient with safe fallback
  const patientIdParam = searchParams.get('patientId');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patientIdParam || (patients.length > 0 ? patients[0].id : 'PAT-BK-001')
  );

  // Synchronize when patientIdParam changes in URL
  useEffect(() => {
    if (patientIdParam && patients.some(p => p.id === patientIdParam)) {
      setSelectedPatientId(patientIdParam);
      setTriageResult(null);
      setIsSaved(false);
    }
  }, [patientIdParam, patients]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0] || {
    id: 'PAT-BK-001',
    name: 'Sita Devi',
    age: 26,
    gender: 'Female',
    village: 'Sector 9',
    district: 'Bokaro Steel City',
    phone: '94311 20491',
    isPregnant: true,
    pregnancyWeeks: 32,
    synced: true,
    registeredAt: new Date().toISOString(),
    registeredByAshaId: 'ASHA-JH-10234',
  };

  // Symptoms selection state
  const availableSymptoms = [
    'Severe headache',
    'Blurred vision / Spots',
    'Breathing difficulty',
    'Chest pain',
    'Vaginal Bleeding',
    'High Fever / Chills',
    'Severe abdominal pain',
    'Vomiting / Nausea',
    'Dizziness / Fainting',
    'Unconsciousness',
    'Swelling in face / hands',
    'Decreased fetal movement'
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Severe headache',
    'Blurred vision / Spots',
    'Swelling in face / hands'
  ]);

  // Vitals State allowing empty string to prevent React 0/NaN jumping glitch
  const [temperature, setTemperature] = useState<number | ''>(99.4);
  const [heartRate, setHeartRate] = useState<number | ''>(104);
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState<number | ''>(165);
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState<number | ''>(105);
  const [spO2, setSpO2] = useState<number | ''>(96);
  const [respiratoryRate, setRespiratoryRate] = useState<number | ''>(22);
  const [durationDays, setDurationDays] = useState<number | ''>(2);
  const [chiefComplaint, setChiefComplaint] = useState<string>(
    'Sudden throbbing headache, blurred vision, and epigastric discomfort in 32nd week of pregnancy.'
  );

  // Triage Execution & Animation States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [triageResult, setTriageResult] = useState<TriageEvaluationResult | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showHistorySection, setShowHistorySection] = useState<boolean>(false);

  // Referral Modal Trigger State
  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);

  // Dynamic context adjustment when patient changes
  useEffect(() => {
    if (selectedPatient) {
      if (selectedPatient.isPregnant) {
        if (!chiefComplaint || chiefComplaint.includes('General') || chiefComplaint.includes('Pediatric')) {
          setChiefComplaint('Maternal assessment: Throbbing headache and visual discomfort in 32nd week of pregnancy.');
          setSelectedSymptoms(['Severe headache', 'Blurred vision / Spots', 'Swelling in face / hands']);
          setBloodPressureSystolic(165);
          setBloodPressureDiastolic(105);
          setHeartRate(104);
          setTemperature(99.4);
          setSpO2(96);
        }
      } else if (selectedPatient.isChildCase) {
        setChiefComplaint('Pediatric assessment: Congestion, poor feeding, mild pyrexia.');
        setSelectedSymptoms(['Breathing difficulty', 'High Fever / Chills']);
        setBloodPressureSystolic(96);
        setBloodPressureDiastolic(62);
        setHeartRate(112);
        setTemperature(101.4);
        setSpO2(95);
      } else if (selectedPatient.gender === 'Male' && chiefComplaint.includes('pregnancy')) {
        setChiefComplaint('General assessment: Chest tightness, shortness of breath, and fatigue.');
        setSelectedSymptoms(['Breathing difficulty', 'Chest pain']);
        setBloodPressureSystolic(148);
        setBloodPressureDiastolic(94);
        setHeartRate(98);
        setTemperature(98.8);
        setSpO2(94);
      }
    }
  }, [selectedPatientId]);

  // Processing steps text
  const processingStages = [
    'Analyzing symptoms and clinical history...',
    'Applying clinical decision rules & danger algorithms...',
    'Assessing risk stratification score...',
    'Generating referral recommendation & facility matching...'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
    setTriageResult(null);
    setIsSaved(false);
  };

  // Demo Presets for seamless testing
  const loadHighRiskPreset = () => {
    setSelectedSymptoms([
      'Severe headache',
      'Blurred vision / Spots',
      'Swelling in face / hands'
    ]);
    setTemperature(99.4);
    setHeartRate(104);
    setBloodPressureSystolic(165);
    setBloodPressureDiastolic(105);
    setSpO2(96);
    setRespiratoryRate(22);
    setDurationDays(2);
    setChiefComplaint('Severe persistent headache, vision disturbance, epigastric discomfort in 32nd week of pregnancy.');
    setTriageResult(null);
    setIsSaved(false);
  };

  const loadEmergencyPreset = () => {
    setSelectedSymptoms([
      'Breathing difficulty',
      'Chest pain',
      'Dizziness / Fainting'
    ]);
    setTemperature(102.2);
    setHeartRate(130);
    setBloodPressureSystolic(84);
    setBloodPressureDiastolic(54);
    setSpO2(84);
    setRespiratoryRate(34);
    setDurationDays(1);
    setChiefComplaint('Severe respiratory distress, central cyanosis, and chest pain upon inspiration.');
    setTriageResult(null);
    setIsSaved(false);
  };

  const loadNormalPreset = () => {
    setSelectedSymptoms(['High Fever / Chills']);
    setTemperature(99.0);
    setHeartRate(74);
    setBloodPressureSystolic(118);
    setBloodPressureDiastolic(78);
    setSpO2(99);
    setRespiratoryRate(16);
    setDurationDays(1);
    setChiefComplaint('Mild seasonal body ache and low-grade pyrexia. Hydration adequate.');
    setTriageResult(null);
    setIsSaved(false);
  };

  const handleRunTriage = async () => {
    setIsProcessing(true);
    setTriageResult(null);

    // Realistic clinical processing animation
    for (let i = 0; i < processingStages.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Sanitize vital inputs
    const cleanVitals = {
      temperature: typeof temperature === 'number' && temperature > 0 ? temperature : 98.6,
      heartRate: typeof heartRate === 'number' && heartRate > 0 ? heartRate : 76,
      bloodPressureSystolic: typeof bloodPressureSystolic === 'number' && bloodPressureSystolic > 0 ? bloodPressureSystolic : 120,
      bloodPressureDiastolic: typeof bloodPressureDiastolic === 'number' && bloodPressureDiastolic > 0 ? bloodPressureDiastolic : 80,
      spO2: typeof spO2 === 'number' && spO2 > 0 ? spO2 : 98,
      respiratoryRate: typeof respiratoryRate === 'number' && respiratoryRate > 0 ? respiratoryRate : 16,
    };

    const evaluation = evaluateClinicalTriage({
      symptoms: selectedSymptoms,
      vitals: cleanVitals,
      isPregnant: selectedPatient?.isPregnant,
      pregnancyWeeks: selectedPatient?.pregnancyWeeks,
      chiefComplaint,
      age: selectedPatient?.age
    });

    setTriageResult(evaluation);
    setIsProcessing(false);

    // Save to AppContext
    addAssessment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      patientVillage: selectedPatient.village,
      symptoms: selectedSymptoms,
      vitals: cleanVitals,
      isPregnant: selectedPatient.isPregnant,
      pregnancyWeeks: selectedPatient.pregnancyWeeks,
      chiefComplaint,
      durationDays: typeof durationDays === 'number' && durationDays > 0 ? durationDays : 1,
      riskLevel: evaluation.riskLevel,
      riskScore: evaluation.riskScore,
      clinicalRationale: evaluation.clinicalRationale,
      recommendedAction: evaluation.recommendedAction,
    });

    setIsSaved(true);
  };

  const handleSaveAssessment = () => {
    setIsSaved(true);
    addToast('Assessment Saved', `Triage assessment for ${selectedPatient.name} recorded in digital log.`, 'success');
  };

  // Find previous assessments for this patient
  const patientPastAssessments = assessments.filter(a => a.patientId === selectedPatient.id);

  // Out of range flags
  const isBpHigh = typeof bloodPressureSystolic === 'number' && bloodPressureSystolic >= 140;
  const isDiaHigh = typeof bloodPressureDiastolic === 'number' && bloodPressureDiastolic >= 90;
  const isO2Low = typeof spO2 === 'number' && spO2 < 93;
  const isHrElevated = typeof heartRate === 'number' && (heartRate > 105 || heartRate < 50);
  const isTempHigh = typeof temperature === 'number' && temperature >= 100.5;
  const isRrHigh = typeof respiratoryRate === 'number' && respiratoryRate >= 24;

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Top Patient Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-teal-700/20 shrink-0">
            {selectedPatient?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-slate-900">{selectedPatient?.name}</h2>
              {selectedPatient?.isPregnant && (
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  Pregnant: {selectedPatient?.pregnancyWeeks || 32} Weeks
                </span>
              )}
              {selectedPatient?.isChildCase && (
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  Pediatric Case
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Age: {selectedPatient?.age} yrs • Village: {selectedPatient?.village} • Patient ID: <span className="font-mono">{selectedPatient?.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch patient dropdown */}
          <select
            value={selectedPatientId}
            onChange={e => {
              setSelectedPatientId(e.target.value);
              setTriageResult(null);
              setIsSaved(false);
            }}
            className="text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.village}) {p.isPregnant ? '— Pregnant' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate('/asha/register-patient')}
            className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 px-3.5 py-2.5 rounded-xl font-bold border border-teal-200 transition shrink-0"
          >
            + New
          </button>
        </div>
      </div>

      {/* Screen Title & Demo Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            <span>Patient Risk Assessment</span>
          </h1>
          <p className="text-xs text-slate-500">
            Offline clinical decision support engine for danger-sign recognition
          </p>
        </div>

        {/* Demo Fast Load Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadHighRiskPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>High Risk Preset (Pre-Eclampsia)</span>
          </button>

          <button
            type="button"
            onClick={loadEmergencyPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-900 border border-red-300 hover:bg-red-100 transition shadow-xs"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Preset (Code Red)</span>
          </button>

          <button
            type="button"
            onClick={loadNormalPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Normal Preset</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Symptoms */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              1. Observed Symptoms & Danger Signs
            </h3>
            <p className="text-xs text-slate-500">Select all presenting symptoms reported during home visit</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {selectedSymptoms.length} selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {availableSymptoms.map(sym => {
            const isSelected = selectedSymptoms.includes(sym);
            const isCritical = sym.includes('headache') || sym.includes('Bleeding') || sym.includes('Chest') || sym.includes('Unconsciousness');
            return (
              <button
                type="button"
                key={sym}
                onClick={() => toggleSymptom(sym)}
                className={`p-3 rounded-2xl text-left text-xs font-bold transition flex items-center justify-between border-2 cursor-pointer ${
                  isSelected
                    ? isCritical 
                      ? 'border-rose-500 bg-rose-50/80 text-rose-950 shadow-xs' 
                      : 'border-teal-600 bg-teal-50/80 text-teal-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="pr-1">{sym}</span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  isSelected ? (isCritical ? 'bg-rose-600 text-white' : 'bg-teal-600 text-white') : 'bg-slate-200 text-transparent'
                }`}>
                  <Check className="w-2.5 h-2.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Vital Signs with Safe Glitch-Free Inputs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              2. Measured Vital Signs
            </h3>
            <p className="text-xs text-slate-500">Record physical vitals using ASHA diagnostic kit</p>
          </div>
          {(isBpHigh || isDiaHigh || isO2Low) && (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>Abnormal Vitals Detected</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Blood Pressure */}
          <div className={`p-4 rounded-2xl border space-y-2 transition ${
            isBpHigh || isDiaHigh ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Heart className={`w-4 h-4 ${isBpHigh || isDiaHigh ? 'text-rose-600' : 'text-rose-500'}`} />
                <span>Blood Pressure</span>
              </span>
              <span className="text-[10px] text-slate-500">mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={bloodPressureSystolic}
                onChange={e => {
                  const val = e.target.value;
                  setBloodPressureSystolic(val === '' ? '' : Number(val));
                  setTriageResult(null);
                  setIsSaved(false);
                }}
                placeholder="120"
                className={`w-full p-2.5 rounded-xl font-mono font-bold text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  isBpHigh ? 'bg-rose-100 border-rose-400 text-rose-950 font-black' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <span className="font-bold text-slate-400 text-base">/</span>
              <input
                type="number"
                value={bloodPressureDiastolic}
                onChange={e => {
                  const val = e.target.value;
                  setBloodPressureDiastolic(val === '' ? '' : Number(val));
                  setTriageResult(null);
                  setIsSaved(false);
                }}
                placeholder="80"
                className={`w-full p-2.5 rounded-xl font-mono font-bold text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  isDiaHigh ? 'bg-rose-100 border-rose-400 text-rose-950 font-black' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <span className="text-[10px] text-slate-500 block text-center">
              Systolic / Diastolic (Normal: 120/80)
            </span>
          </div>

          {/* SpO2 */}
          <div className={`p-4 rounded-2xl border space-y-2 transition ${
            isO2Low ? 'bg-rose-50/70 border-rose-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-500" />
                <span>Oxygen Saturation (SpO2)</span>
              </span>
              <span className="text-[10px] text-slate-500">%</span>
            </div>
            <input
              type="number"
              min={40}
              max={100}
              value={spO2}
              onChange={e => {
                const val = e.target.value;
                setSpO2(val === '' ? '' : Number(val));
                setTriageResult(null);
                setIsSaved(false);
              }}
              placeholder="98"
              className={`w-full p-2.5 rounded-xl font-mono font-bold text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isO2Low ? 'bg-rose-100 border-rose-400 text-rose-950 font-black' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-500 block text-center">
              Pulse Oximeter reading (Normal &ge; 95%)
            </span>
          </div>

          {/* Heart Rate */}
          <div className={`p-4 rounded-2xl border space-y-2 transition ${
            isHrElevated ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Heart Rate (Pulse)</span>
              </span>
              <span className="text-[10px] text-slate-500">bpm</span>
            </div>
            <input
              type="number"
              value={heartRate}
              onChange={e => {
                const val = e.target.value;
                setHeartRate(val === '' ? '' : Number(val));
                setTriageResult(null);
                setIsSaved(false);
              }}
              placeholder="76"
              className={`w-full p-2.5 rounded-xl font-mono font-bold text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isHrElevated ? 'bg-amber-100 border-amber-400 text-amber-950' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-500 block text-center">
              Radial pulse count (Normal: 60-100)
            </span>
          </div>

          {/* Temperature */}
          <div className={`p-4 rounded-2xl border space-y-2 transition ${
            isTempHigh ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <span>Body Temperature</span>
              </span>
              <span className="text-[10px] text-slate-500">°F</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={e => {
                const val = e.target.value;
                setTemperature(val === '' ? '' : Number(val));
                setTriageResult(null);
                setIsSaved(false);
              }}
              placeholder="98.6"
              className={`w-full p-2.5 rounded-xl font-mono font-bold text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isTempHigh ? 'bg-amber-100 border-amber-400 text-amber-950' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-500 block text-center">
              Oral / Axillary reading (Normal: 98.6°F)
            </span>
          </div>

          {/* Respiratory Rate */}
          <div className={`p-4 rounded-2xl border space-y-2 transition ${
            isRrHigh ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-emerald-600" />
                <span>Respiratory Rate</span>
              </span>
              <span className="text-[10px] text-slate-500">breaths/min</span>
            </div>
            <input
              type="number"
              value={respiratoryRate}
              onChange={e => {
                const val = e.target.value;
                setRespiratoryRate(val === '' ? '' : Number(val));
                setTriageResult(null);
                setIsSaved(false);
              }}
              placeholder="18"
              className={`w-full p-2.5 rounded-xl font-mono font-bold text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isRrHigh ? 'bg-amber-100 border-amber-400 text-amber-950' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <span className="text-[10px] text-slate-500 block text-center">
              Breaths counted over 60 seconds (Normal: 12-20)
            </span>
          </div>

          {/* Duration */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Symptom Duration</span>
              <span className="text-[10px] text-slate-500">Days</span>
            </div>
            <input
              type="number"
              min={1}
              value={durationDays}
              onChange={e => {
                const val = e.target.value;
                setDurationDays(val === '' ? '' : Number(val));
                setTriageResult(null);
                setIsSaved(false);
              }}
              placeholder="1"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-center text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <span className="text-[10px] text-slate-500 block text-center">
              Onset time frame
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Clinical Notes & History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
          3. Chief Complaint & Clinical Observations
        </h3>
        <textarea
          rows={2}
          value={chiefComplaint}
          onChange={e => {
            setChiefComplaint(e.target.value);
            setTriageResult(null);
            setIsSaved(false);
          }}
          placeholder="Enter notes on patient appearance, speech, hydration, or fetal movements..."
          className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
        />
      </div>

      {/* Run AI-Assisted Triage Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleRunTriage}
          className="w-full py-4 bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-teal-700/25 flex items-center justify-center gap-3 transition transform active:scale-[0.99] disabled:opacity-75 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span>{isProcessing ? 'Processing Clinical Triage...' : 'Run AI-Assisted Triage'}</span>
        </button>
      </div>

      {/* Realistic 4-Stage Processing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-400 animate-ping"></span>
                <span className="font-bold text-sm text-teal-300">Evaluating Clinical Decision Rules</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Stage {processingStep + 1} of 4</span>
            </div>

            {/* Stage text */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm font-semibold text-slate-200">
              {processingStages[processingStep]}
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-4 gap-2">
              {processingStages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx <= processingStep ? 'bg-teal-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRIAGE RESULT CARD */}
      <AnimatePresence>
        {triageResult && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8"
          >
            {/* Top result header with large visual risk color */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">
                  Clinical Stratification Result
                </span>
                <div className="flex items-center gap-3">
                  <div className="text-2xl sm:text-3xl font-black">
                    {triageResult.riskLevel === 'HIGH' && (
                      <span className="flex items-center gap-2 text-rose-600">
                        <AlertCircle className="w-7 h-7 text-rose-600" />
                        <span>HIGH RISK</span>
                      </span>
                    )}
                    {triageResult.riskLevel === 'EMERGENCY' && (
                      <span className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-7 h-7 text-red-600" />
                        <span>EMERGENCY (CODE RED)</span>
                      </span>
                    )}
                    {triageResult.riskLevel === 'MODERATE' && (
                      <span className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-7 h-7 text-amber-500" />
                        <span>MODERATE RISK</span>
                      </span>
                    )}
                    {triageResult.riskLevel === 'LOW' && (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        <span>LOW RISK</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-300">
                    Risk Score: {triageResult.riskScore} / 100
                  </span>
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl sm:text-right">
                <span className="text-[10px] text-rose-700 font-bold uppercase block">Urgency Classification</span>
                <span className="text-sm font-black text-rose-900 block mt-0.5">{triageResult.urgencyLevel}</span>
                <span className="text-[11px] text-rose-700 font-medium">{triageResult.requiredFacilityType}</span>
              </div>
            </div>

            {/* Risk Indicators */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Risk Indicators & Clinical Rationale:
              </h4>
              <div className="space-y-2">
                {triageResult.clinicalRationale.map((rat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                    <span className="font-medium leading-relaxed">{rat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDED ACTION */}
            <div className="p-5 rounded-2xl bg-teal-50/80 border-2 border-teal-600/40 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-teal-900 block">
                RECOMMENDED ACTION:
              </span>
              <p className="text-sm font-bold text-teal-950 leading-relaxed">
                {triageResult.recommendedAction}
              </p>
            </div>

            {/* STRICT MEDICAL SAFETY DISCLAIMER */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-900">Safety & Decision Support Disclaimer: </strong>
                This tool provides decision support and does not diagnose medical conditions. Final clinical decisions must be made by qualified healthcare professionals. Emergency cases must be evaluated promptly at an equipped healthcare facility.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* Find Suitable Hospital -> Triggers Emergency Referral Flow */}
              {(triageResult.riskLevel === 'HIGH' || triageResult.riskLevel === 'EMERGENCY' || triageResult.riskLevel === 'MODERATE') && (
                <button
                  type="button"
                  onClick={() => setIsReferralModalOpen(true)}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Ambulance className="w-5 h-5 animate-pulse" />
                  <span>Find Suitable Hospital</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Save Assessment */}
              <button
                type="button"
                onClick={handleSaveAssessment}
                className={`px-6 py-4 font-bold text-xs rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                  isSaved 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300'
                }`}
              >
                {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-teal-700" />}
                <span>{isSaved ? 'Assessment Saved' : 'Save Assessment'}</span>
              </button>

              {/* Toggle Patient History View */}
              <button
                type="button"
                onClick={() => setShowHistorySection(!showHistorySection)}
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>{showHistorySection ? 'Hide History' : 'View Patient History'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accordion / Embedded Patient Assessment History */}
      {showHistorySection && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                <span>Recorded Assessment History for {selectedPatient.name}</span>
              </h3>
              <p className="text-slate-500 text-xs">Longitudinal records stored on device</p>
            </div>
            <button
              onClick={() => navigate('/asha/patients')}
              className="text-teal-700 font-bold hover:underline"
            >
              All Patients &rarr;
            </button>
          </div>

          {patientPastAssessments.length === 0 ? (
            <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl">
              No prior assessments on record for {selectedPatient.name}. Run your first triage assessment above.
            </div>
          ) : (
            <div className="space-y-3">
              {patientPastAssessments.map(record => (
                <div key={record.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        record.riskLevel === 'HIGH' || record.riskLevel === 'EMERGENCY'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : record.riskLevel === 'MODERATE'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        {record.riskLevel} RISK (Score: {record.riskScore}/100)
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{record.id}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{record.assessedAt.split('T')[0]}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
                      <strong className={record.vitals.bloodPressureSystolic >= 140 ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                        {record.vitals.bloodPressureSystolic}/{record.vitals.bloodPressureDiastolic} mmHg
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SpO2</span>
                      <strong className={record.vitals.spO2 < 93 ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                        {record.vitals.spO2}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Heart Rate</span>
                      <strong className="text-slate-900">{record.vitals.heartRate} bpm</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Temperature</span>
                      <strong className="text-slate-900">{record.vitals.temperature}°F</strong>
                    </div>
                  </div>

                  {record.referralId && (
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Emergency Referral: <strong className="text-teal-700 font-mono">{record.referralId}</strong></span>
                      <button
                        onClick={() => navigate('/asha/referrals')}
                        className="text-teal-700 hover:underline font-bold"
                      >
                        View Referral Timeline &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Emergency Referral Modal Popup */}
      {isReferralModalOpen && (
        <HospitalSelectModal
          patient={selectedPatient}
          riskLevel={triageResult?.riskLevel || 'HIGH'}
          primaryDiagnosisHint={chiefComplaint}
          onClose={() => setIsReferralModalOpen(false)}
        />
      )}
    </div>
  );
};
