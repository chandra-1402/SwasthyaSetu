import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Clinical Test Cases Data
const casesData = JSON.parse(
  readFileSync(join(__dirname, '../sample-data/clinical-cases.json'), 'utf8')
);

/**
 * Triage Evaluation Algorithm mirroring frontline CDSS specification
 */
function evaluateClinicalTriage(input) {
  const { symptoms = [], vitals = {}, isPregnant, pregnancyWeeks } = input;
  const rationales = [];
  let score = 10; // baseline

  const cleanVitals = {
    temperature: (vitals && vitals.temperature && vitals.temperature >= 80 && !isNaN(vitals.temperature)) ? vitals.temperature : 98.6,
    heartRate: (vitals && vitals.heartRate && vitals.heartRate > 20 && !isNaN(vitals.heartRate)) ? vitals.heartRate : 76,
    bloodPressureSystolic: (vitals && vitals.bloodPressureSystolic && vitals.bloodPressureSystolic > 30 && !isNaN(vitals.bloodPressureSystolic)) ? vitals.bloodPressureSystolic : 120,
    bloodPressureDiastolic: (vitals && vitals.bloodPressureDiastolic && vitals.bloodPressureDiastolic > 20 && !isNaN(vitals.bloodPressureDiastolic)) ? vitals.bloodPressureDiastolic : 80,
    spO2: (vitals && vitals.spO2 && vitals.spO2 >= 40 && !isNaN(vitals.spO2)) ? vitals.spO2 : 98,
    respiratoryRate: (vitals && vitals.respiratoryRate && vitals.respiratoryRate > 5 && !isNaN(vitals.respiratoryRate)) ? vitals.respiratoryRate : 16,
  };

  const symptomList = symptoms.map(s => s.toLowerCase());

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

  // Oxygen Saturation Triage
  if (cleanVitals.spO2 < 88) {
    score += 55;
    rationales.push(`Critical hypoxemia: SpO2 ${cleanVitals.spO2}% (< 88% is life-threatening)`);
  } else if (cleanVitals.spO2 < 93) {
    score += 35;
    rationales.push(`Significant hypoxemia: SpO2 ${cleanVitals.spO2}% (< 93%)`);
  }

  // Blood Pressure Triage
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

  // Heart Rate Triage
  if (cleanVitals.heartRate > 125 || cleanVitals.heartRate < 45) {
    score += 30;
    rationales.push(`Dangerous heart rate: ${cleanVitals.heartRate} bpm (severe tachycardia or bradycardia)`);
  } else if (cleanVitals.heartRate > 105) {
    score += 15;
    rationales.push(`Elevated heart rate: ${cleanVitals.heartRate} bpm`);
  }

  // Temperature Triage
  if (cleanVitals.temperature >= 103) {
    score += 30;
    rationales.push(`Severe hyperpyrexia: Temperature ${cleanVitals.temperature}°F`);
  } else if (cleanVitals.temperature >= 100.5) {
    score += 15;
    rationales.push(`Pyrexia (fever): Temperature ${cleanVitals.temperature}°F`);
  }

  // Respiratory Rate
  if (cleanVitals.respiratoryRate >= 30) {
    score += 35;
    rationales.push(`Tachypnea: Respiratory rate ${cleanVitals.respiratoryRate} breaths/min`);
  }

  // Maternal Risk Specific Evaluation
  if (isPregnant) {
    score += 10;
    const hasHeadache = symptomList.some(s => s.includes('headache'));
    const hasVisionBlur = symptomList.some(s => s.includes('vision') || s.includes('blur'));
    const hasBleeding = symptomList.some(s => s.includes('bleed'));

    if ((cleanVitals.bloodPressureSystolic >= 140 || cleanVitals.bloodPressureDiastolic >= 90) && (hasHeadache || hasVisionBlur)) {
      score += 40;
      rationales.push(`High maternal alert: Pregnancy (${pregnancyWeeks || '3rd trimester'} wks) with Hypertension + Visual/Neurological symptoms`);
    }

    if (hasBleeding) {
      score += 50;
      rationales.push(`Antepartum hemorrhage danger sign: Vaginal bleeding during pregnancy requires urgent tertiary obstetric care.`);
    }
  }

  // Emergency Symptoms
  if (hasEmergencySymptom) {
    score += 50;
    rationales.push('Direct emergency symptom identified from clinical checklist');
  }

  if (symptomList.some(s => s.includes('vomit') || s.includes('dizziness'))) {
    score += 15;
    rationales.push('Symptoms of dehydration / fluid loss reported');
  }

  const finalScore = Math.min(Math.max(score, 12), 99);

  let riskLevel = 'LOW';
  let urgencyLevel = 'Routine';
  let recommendedAction = 'Routine community monitoring, basic first-aid, and scheduled follow-up.';
  let requiredFacilityType = 'Sub-Centre / Primary Health Centre (PHC)';

  if (finalScore >= 80 || hasEmergencySymptom || (vitals.spO2 && vitals.spO2 < 88)) {
    riskLevel = 'HIGH';
    if (finalScore >= 90 || (vitals.spO2 && vitals.spO2 < 85)) {
      riskLevel = 'EMERGENCY';
      urgencyLevel = 'Code Red';
      recommendedAction = 'Immediate 108 emergency transport to nearest tertiary emergency facility.';
      requiredFacilityType = 'Tertiary Trauma Care / Multi-Specialty Hospital';
    } else {
      urgencyLevel = 'Immediate';
      recommendedAction = 'Urgent medical referral within 2 hours. Notify District Hospital Emergency.';
      requiredFacilityType = 'District Hospital or FRU (First Referral Unit)';
    }
  } else if (finalScore >= 45) {
    riskLevel = 'MODERATE';
    urgencyLevel = 'Priority';
    recommendedAction = 'Refer for clinical evaluation at Community Health Centre (CHC) within 24 hours.';
    requiredFacilityType = 'Community Health Centre (CHC) / Medical Officer';
  } else {
    riskLevel = 'LOW';
    urgencyLevel = 'Routine';
    recommendedAction = 'Provide symptomatic relief as per sub-centre guidelines.';
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

test('Clinical Triage Engine - Sample Cases Verification', async (t) => {
  for (const testCase of casesData.cases) {
    await t.test(`Evaluating ${testCase.id}: ${testCase.name}`, () => {
      const result = evaluateClinicalTriage({
        symptoms: testCase.symptoms,
        vitals: testCase.vitals,
        isPregnant: testCase.isPregnant,
        pregnancyWeeks: testCase.pregnancyWeeks,
      });

      assert.equal(
        result.riskLevel,
        testCase.expectedTriage.riskLevel,
        `Expected riskLevel ${testCase.expectedTriage.riskLevel} for ${testCase.name}, got ${result.riskLevel}`
      );

      assert.equal(
        result.urgencyLevel,
        testCase.expectedTriage.urgencyLevel,
        `Expected urgencyLevel ${testCase.expectedTriage.urgencyLevel} for ${testCase.name}, got ${result.urgencyLevel}`
      );

      if (testCase.expectedTriage.minScore) {
        assert.ok(
          result.riskScore >= testCase.expectedTriage.minScore,
          `Expected riskScore >= ${testCase.expectedTriage.minScore}, got ${result.riskScore}`
        );
      }

      if (testCase.expectedTriage.maxScore) {
        assert.ok(
          result.riskScore <= testCase.expectedTriage.maxScore,
          `Expected riskScore <= ${testCase.expectedTriage.maxScore}, got ${result.riskScore}`
        );
      }

      assert.ok(result.clinicalRationale.length > 0, 'Should produce at least one clinical rationale');
    });
  }
});

test('Clinical Triage Engine - Robustness & Edge Cases', async (t) => {
  await t.test('Handles missing/empty vitals gracefully with defaults', () => {
    const result = evaluateClinicalTriage({
      symptoms: [],
      vitals: {},
      isPregnant: false,
    });
    assert.equal(result.riskLevel, 'LOW');
    assert.equal(result.urgencyLevel, 'Routine');
    assert.ok(result.riskScore >= 10 && result.riskScore <= 25);
    assert.ok(result.clinicalRationale.length >= 1);
  });

  await t.test('Triggers Emergency on profound hypoxemia regardless of symptoms', () => {
    const result = evaluateClinicalTriage({
      symptoms: [],
      vitals: { spO2: 80, heartRate: 85, bloodPressureSystolic: 120, bloodPressureDiastolic: 80 },
    });
    assert.equal(result.riskLevel, 'EMERGENCY');
    assert.equal(result.urgencyLevel, 'Code Red');
    assert.ok(result.riskScore >= 60);
  });

  await t.test('Triggers Maternal High Risk on hypertension with neurological symptoms', () => {
    const result = evaluateClinicalTriage({
      symptoms: ['severe headache', 'blurred vision'],
      vitals: { bloodPressureSystolic: 155, bloodPressureDiastolic: 98 },
      isPregnant: true,
      pregnancyWeeks: 34,
    });
    assert.equal(result.riskLevel, 'HIGH');
    assert.ok(result.riskScore >= 80);
    assert.ok(result.clinicalRationale.some(r => r.includes('Maternal alert') || r.includes('maternal alert')));
  });
});
