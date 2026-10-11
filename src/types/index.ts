export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';

export type ReferralStatus = 
  | 'Awaiting Hospital Response' 
  | 'Hospital Notified' 
  | 'Hospital Accepted' 
  | 'Patient En Route' 
  | 'Admitted' 
  | 'Completed';

export interface VitalSigns {
  temperature: number; // in Fahrenheit
  heartRate: number; // bpm
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  spO2: number; // %
  respiratoryRate: number; // breaths/min
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  village: string;
  district: string;
  emergencyContact: string;
  abhaId?: string;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  isChildCase?: boolean;
  registeredAt: string;
  registeredByAshaId: string;
  isOfflineCreated?: boolean;
  synced?: boolean;
  todayScheduled?: boolean;
  todayVisitStatus?: 'completed' | 'pending';
  todayScheduledTime?: string;
  visitPurpose?: string;
  householdNo?: string;
  riskLevel?: RiskLevel;
  followUpDue?: boolean;
  followUpReason?: string;
  followUpDueDate?: string;
  lastVitalsSummary?: string;
}

export interface TriageAssessment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientVillage: string;
  symptoms: string[];
  vitals: VitalSigns;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  chiefComplaint: string;
  durationDays: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  clinicalRationale: string[];
  recommendedAction: string;
  assessedAt: string;
  ashaWorkerId: string;
  ashaWorkerName: string;
  referralId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'District Hospital' | 'Community Health Centre' | 'Sub-Divisional Hospital' | 'Tertiary Care' | 'Private Multi-Specialty';
  district: string;
  address: string;
  distanceKm: number;
  travelTimeMinutes: number;
  emergencyReady: boolean;
  icuBedsAvailable: number;
  totalIcuBeds: number;
  generalBedsAvailable: number;
  totalGeneralBeds: number;
  maternityBedsAvailable: number;
  oxygenAvailable: boolean;
  doctorsOnDuty: {
    name: string;
    specialty: string;
  }[];
  specialties: string[];
  phone: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteStep {
  instruction: string;
  distance: string;
  detail?: string;
}

export interface RouteDetails {
  via: string;
  trafficStatus: string;
  ambulanceCorridor: boolean;
  steps: RouteStep[];
}

export interface Referral {
  id: string; // e.g. REF-2026-JH-8842
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  village: string;
  ashaWorkerId: string;
  ashaWorkerName: string;
  hospitalId: string;
  hospitalName: string;
  riskLevel: RiskLevel;
  primaryDiagnosisHint: string;
  urgencyReason: string;
  createdAt: string;
  status: ReferralStatus;
  statusTimeline: {
    status: ReferralStatus;
    timestamp: string;
    note: string;
  }[];
  transportArranged: boolean;
  ambulanceContact?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  tokenNumber: number;
  type: 'In-Person Consultation' | 'Specialist Evaluation' | 'Follow-up';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  symptomsSummary?: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Ultrasound';
  date: string;
  hospitalName: string;
  doctorName: string;
  status: 'Available' | 'Pending Review';
  summary: string;
  fileSize: string;
  parameters: {
    name: string;
    result: string;
    referenceRange: string;
    isAbnormal: boolean;
  }[];
}

export interface AshaWorkerProfile {
  id: string; // ASHA-JH-10234
  name: string;
  phone: string;
  village: string;
  subCenter: string;
  block: string;
  district: string;
  state: string;
  patientsCovered: number;
  experienceYears: number;
  certifications: string[];
  avatarUrl?: string;
}

export interface PatientVitals {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spO2: number;
  heartRate: number;
  temperature: number;
  respiratoryRate?: number;
  recordedAt?: string;
  recordedBy?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  village: string;
  district: string;
  bloodGroup: string;
  abhaNumber: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  knownAllergies: string[];
  chronicConditions: string[];
  vitals?: PatientVitals;
}
