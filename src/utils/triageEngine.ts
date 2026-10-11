import { RiskLevel, VitalSigns } from '../types';

export interface TriageEvaluationInput {
  symptoms: string[];
  vitals: VitalSigns;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  chiefComplaint?: string;
  age?: number;
}

export interface TriageEvaluationResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  clinicalRationale: string[];
  recommendedAction: string;
  urgencyLevel: 'Routine' | 'Priority' | 'Immediate' | 'Code Red';
  requiredFacilityType: string;
}

export function evaluateClinicalTriage(input: TriageEvaluationInput): TriageEvaluationResult {
  const { symptoms, vitals, isPregnant, pregnancyWeeks } = input;
  const rationales: string[] = [];
  let score = 10; // baseline

  // Sanitize vital signs to prevent zero, NaN, or unbounded calculations
  const cleanVitals = {
    temperature: (vitals && vitals.temperature && vitals.temperature >= 80 && !isNaN(vitals.temperature)) ? vitals.temperature : 98.6,
    heartRate: (vitals && vitals.heartRate && vitals.heartRate > 20 && !isNaN(vitals.heartRate)) ? vitals.heartRate : 76,
    bloodPressureSystolic: (vitals && vitals.bloodPressureSystolic && vitals.bloodPressureSystolic > 30 && !isNaN(vitals.bloodPressureSystolic)) ? vitals.bloodPressureSystolic : 120,
    bloodPressureDiastolic: (vitals && vitals.bloodPressureDiastolic && vitals.bloodPressureDiastolic > 20 && !isNaN(vitals.bloodPressureDiastolic)) ? vitals.bloodPressureDiastolic : 80,
    spO2: (vitals && vitals.spO2 && vitals.spO2 >= 40 && !isNaN(vitals.spO2)) ? vitals.spO2 : 98,
    respiratoryRate: (vitals && vitals.respiratoryRate && vitals.respiratoryRate > 5 && !isNaN(vitals.respiratoryRate)) ? vitals.respiratoryRate : 16,
  };

  const symptomList = (symptoms || []).map(s => s.toLowerCase());

  // 1. Extreme Critical Red Flags (EMERGENCY)
  const emergencyKeywords = [
    'unconscious',
    'chest pain',
    'breathing difficulty',
    'respiratory distress',
    'profuse bleed',
    'seizure',
    'convulsion'
  ];

  const hasEmergencySymptom = emergencyKeywords.some(keyword => 
    symptomList.some(s => s.includes(keyword))
  );

  if (cleanVitals.spO2 < 88) {
    score += 55;
    rationales.push(`Critical hypoxemia: SpO2 ${cleanVitals.spO2}% (< 88% is life-threatening)`);
  } else if (cleanVitals.spO2 < 93) {
    score += 35;
    rationales.push(`Significant hypoxemia: SpO2 ${cleanVitals.spO2}% (< 93%)`);
  }

  if (cleanVitals.bloodPressureSystolic >= 170 || cleanVitals.bloodPressureDiastolic >= 110) {
    score += 45;
    rationales.push(`Hypertensive crisis: BP ${cleanVitals.bloodPressureSystolic}/${cleanVitals.bloodPressureDiastolic} mmHg`);
  } else if (cleanVitals.bloodPressureSystolic >= 145 || cleanVitals.bloodPressureDiastolic >= 95) {
    score += 25;
    rationales.push(`Significant hypertension: BP ${cleanVitals.bloodPressureSystolic}/${cleanVitals.bloodPressureDiastolic} mmHg`);
  } else if (cleanVitals.bloodPressureSystolic < 85) {
    score += 40;
    rationales.push(`Severe hypotension / shock indicator: Systolic ${cleanVitals.bloodPressureSystolic} mmHg`);
  }

  if (cleanVitals.heartRate > 125 || cleanVitals.heartRate < 45) {
    score += 30;
    rationales.push(`Dangerous heart rate: ${cleanVitals.heartRate} bpm (severe tachycardia or bradycardia)`);
  } else if (cleanVitals.heartRate > 105) {
    score += 15;
    rationales.push(`Elevated heart rate: ${cleanVitals.heartRate} bpm`);
  }

  if (cleanVitals.temperature >= 103) {
    score += 30;
    rationales.push(`Severe hyperpyrexia: Temperature ${cleanVitals.temperature}°F`);
  } else if (cleanVitals.temperature >= 100.5) {
    score += 15;
    rationales.push(`Pyrexia (fever): Temperature ${cleanVitals.temperature}°F`);
  }

  if (cleanVitals.respiratoryRate >= 30) {
    score += 35;
    rationales.push(`Tachypnea: Respiratory rate ${cleanVitals.respiratoryRate} breaths/min`);
  }

  // Maternal risk specific evaluation
  if (isPregnant) {
    score += 10;
    const hasHeadache = symptomList.some(s => s.includes('headache'));
    const hasVisionBlur = symptomList.some(s => s.includes('vision') || s.includes('blur'));
    const hasBleeding = symptomList.some(s => s.includes('bleed'));

    if ((cleanVitals.bloodPressureSystolic >= 140 || cleanVitals.bloodPressureDiastolic >= 90) && (hasHeadache || hasVisionBlur)) {
      score += 40;
      rationales.push(`High maternal alert: Pregnancy (${pregnancyWeeks || '3rd trimester'} wks) with Hypertension + Visual/Neurological symptoms (Imminent Pre-Eclampsia / Eclampsia risk)`);
    }

    if (hasBleeding) {
      score += 50;
      rationales.push(`Antepartum hemorrhage danger sign: Vaginal bleeding during pregnancy requires urgent tertiary obstetric care.`);
    }
  }

  // Symptom based scoring
  if (hasEmergencySymptom) {
    score += 50;
    rationales.push('Direct emergency symptom identified from clinical checklist');
  }

  if (symptomList.some(s => s.includes('vomit') || s.includes('dizziness'))) {
    score += 15;
    rationales.push('Symptoms of dehydration / fluid loss reported');
  }

  // Cap score 0 - 100
  const finalScore = Math.min(Math.max(score, 12), 99);

  let riskLevel: RiskLevel = 'LOW';
  let urgencyLevel: TriageEvaluationResult['urgencyLevel'] = 'Routine';
  let recommendedAction = 'Routine community monitoring, basic first-aid, and scheduled follow-up.';
  let requiredFacilityType = 'Sub-Centre / Primary Health Centre (PHC)';

  if (finalScore >= 80 || hasEmergencySymptom || vitals.spO2 < 88) {
    riskLevel = 'HIGH'; // Or EMERGENCY if ultra critical
    if (finalScore >= 90 || vitals.spO2 < 85) {
      riskLevel = 'EMERGENCY';
      urgencyLevel = 'Code Red';
      recommendedAction = 'Immediate 108 emergency transport to nearest tertiary emergency facility. Continuous oxygen and lateral tilt.';
      requiredFacilityType = 'Tertiary Trauma Care / Multi-Specialty Hospital';
    } else {
      urgencyLevel = 'Immediate';
      recommendedAction = 'Urgent medical referral within 2 hours. Notify District Hospital Emergency / Obstetric triage.';
      requiredFacilityType = 'District Hospital or FRU (First Referral Unit)';
    }
  } else if (finalScore >= 45) {
    riskLevel = 'MODERATE';
    urgencyLevel = 'Priority';
    recommendedAction = 'Refer for clinical evaluation at Community Health Centre (CHC) within 24 hours. Initiate rehydration / monitoring.';
    requiredFacilityType = 'Community Health Centre (CHC) / Medical Officer';
  } else {
    riskLevel = 'LOW';
    urgencyLevel = 'Routine';
    recommendedAction = 'Provide symptomatic relief as per sub-centre guidelines. Advise red flag return precautions if symptoms worsen.';
    requiredFacilityType = 'Sub-Centre / Home Monitoring';
  }

  if (rationales.length === 0) {
    rationales.push('Vitals are within physiological reference ranges.');
    rationales.push('No acute danger signs detected during physical assessment.');
  }

  return {
    riskLevel,
    riskScore: finalScore,
    clinicalRationale: rationales,
    recommendedAction,
    urgencyLevel,
    requiredFacilityType,
  };
}
