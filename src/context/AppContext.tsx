import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AshaWorkerProfile, 
  Hospital, 
  Patient, 
  PatientProfile, 
  Referral, 
  TriageAssessment, 
  LabReport, 
  Appointment,
  ReferralStatus
} from '../types';
import { 
  INITIAL_ASHA_WORKER, 
  INITIAL_PATIENTS, 
  INITIAL_HOSPITALS, 
  INITIAL_ASSESSMENTS, 
  INITIAL_REFERRALS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_LAB_REPORTS, 
  INITIAL_PATIENT_PROFILE 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  timestamp: number;
}

interface AppContextType {
  // Connectivity & Offline
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  offlineQueueCount: number;
  isSyncing: boolean;
  syncOfflineData: () => Promise<void>;

  // ASHA Auth
  isAshaLoggedIn: boolean;
  ashaWorker: AshaWorkerProfile;
  loginAsha: () => void;
  logoutAsha: () => void;

  // Patient Auth
  isPatientLoggedIn: boolean;
  patientUser: PatientProfile;
  loginPatient: () => void;
  logoutPatient: () => void;

  // Data collections
  patients: Patient[];
  assessments: TriageAssessment[];
  hospitals: Hospital[];
  referrals: Referral[];
  appointments: Appointment[];
  labReports: LabReport[];

  // Mutations
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt' | 'registeredByAshaId' | 'synced'>) => Patient;
  addAssessment: (assessment: Omit<TriageAssessment, 'id' | 'assessedAt' | 'ashaWorkerId' | 'ashaWorkerName'>) => TriageAssessment;
  createReferral: (referralData: {
    patientId: string;
    hospitalId: string;
    riskLevel: any;
    primaryDiagnosisHint: string;
    urgencyReason: string;
  }) => Referral;
  simulateHospitalAcceptance: (referralId: string) => void;
  bookAppointment: (appointmentData: {
    hospitalId: string;
    department: string;
    doctorName: string;
    date: string;
    timeSlot: string;
    type?: any;
    symptomsSummary?: string;
  }) => Appointment;
  togglePatientTodayStatus: (patientId: string) => void;

  // UI helpers
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isDemoGuideOpen: boolean;
  setIsDemoGuideOpen: (open: boolean) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'ASHA_SAHAYAK_V5_AUTH_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}isOnline`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [offlineQueue, setOfflineQueue] = useState<any[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}offlineQueue`);
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Auth States
  const [isAshaLoggedIn, setIsAshaLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}ashaAuth`) === 'true';
  });

  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}patientAuth`) === 'true';
  });

  const [ashaWorker] = useState<AshaWorkerProfile>(INITIAL_ASHA_WORKER);
  const [patientUser] = useState<PatientProfile>(INITIAL_PATIENT_PROFILE);

  // Domain Collections with LocalStorage caching
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}patients`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 12) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PATIENTS;
  });

  const [assessments, setAssessments] = useState<TriageAssessment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}assessments`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          const hasToday = parsed.some(a => a.id === 'ASSESS-BK-001-TODAY');
          if (hasToday) {
            return parsed;
          }
          const sitaAssessments = INITIAL_ASSESSMENTS.filter(a => a.patientId === 'PAT-BK-001');
          const otherAssessments = parsed.filter((a: TriageAssessment) => a.patientId !== 'PAT-BK-001');
          return [...sitaAssessments, ...otherAssessments];
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ASSESSMENTS;
  });

  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}referrals`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          // Guarantee that only the first referral is awaiting hospital response, and bottom 3 are completed
          return parsed.map((ref: Referral, idx: number) => {
            if (idx === 0) {
              return { ...ref, status: 'Awaiting Hospital Response' as ReferralStatus };
            } else {
              return { ...ref, status: 'Completed' as ReferralStatus, transportArranged: true };
            }
          });
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_REFERRALS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [labReports] = useState<LabReport[]>(INITIAL_LAB_REPORTS);

  // Demo Guide Modal state
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}isOnline`, JSON.stringify(isOnline));
  }, [isOnline]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}offlineQueue`, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}patients`, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}assessments`, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}referrals`, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}appointments`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}ashaAuth`, String(isAshaLoggedIn));
  }, [isAshaLoggedIn]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}patientAuth`, String(isPatientLoggedIn));
  }, [isPatientLoggedIn]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type, timestamp: Date.now() };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleOnlineStatus = () => {
    setIsOnline(prev => {
      const next = !prev;
      if (next) {
        addToast('Back Online', 'Internet connectivity detected. Cloud sync ready.', 'success');
      } else {
        addToast('Offline Mode Activated', 'Core patient assessment & triage will continue locally.', 'warning');
      }
      return next;
    });
  };

  const loginAsha = () => {
    setIsAshaLoggedIn(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}ashaAuth`, 'true');
    addToast('Welcome Sunita Devi', 'Logged into SwasthyaSetu ASHA Portal.', 'success');
  };

  const logoutAsha = () => {
    setIsAshaLoggedIn(false);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}ashaAuth`, 'false');
    addToast('Logged Out', 'ASHA session ended securely. Returned to home.', 'info');
  };

  const loginPatient = () => {
    setIsPatientLoggedIn(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}patientAuth`, 'true');
    addToast('Welcome Back', 'Logged into SwasthyaSetu Citizen Portal.', 'success');
  };

  const logoutPatient = () => {
    setIsPatientLoggedIn(false);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}patientAuth`, 'false');
    addToast('Logged Out', 'Patient session closed. Returned to home.', 'info');
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'registeredAt' | 'registeredByAshaId' | 'synced'>): Patient => {
    const newId = `PAT-BK-${String(patients.length + 1).padStart(3, '0')}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      registeredAt: new Date().toISOString(),
      registeredByAshaId: ashaWorker.id,
      synced: isOnline,
      isOfflineCreated: !isOnline,
    };

    setPatients(prev => [newPatient, ...prev]);

    if (!isOnline) {
      setOfflineQueue(prev => [...prev, { type: 'PATIENT_CREATE', data: newPatient, timestamp: Date.now() }]);
      addToast(
        'Saved Locally (Offline)',
        `${newPatient.name} stored in device database. Will sync when reconnected.`,
        'warning'
      );
    } else {
      addToast('Patient Registered', `${newPatient.name} successfully registered.`, 'success');
    }

    return newPatient;
  };

  const addAssessment = (assessmentData: Omit<TriageAssessment, 'id' | 'assessedAt' | 'ashaWorkerId' | 'ashaWorkerName'>): TriageAssessment => {
    const newId = `ASSESS-BK-${String(assessments.length + 1).padStart(3, '0')}`;
    const newAssessment: TriageAssessment = {
      ...assessmentData,
      id: newId,
      assessedAt: new Date().toISOString(),
      ashaWorkerId: ashaWorker.id,
      ashaWorkerName: ashaWorker.name,
    };

    setAssessments(prev => [newAssessment, ...prev]);

    if (!isOnline) {
      setOfflineQueue(prev => [...prev, { type: 'ASSESSMENT_CREATE', data: newAssessment, timestamp: Date.now() }]);
      addToast('Triage Saved Locally', 'Assessment recorded locally on device.', 'warning');
    }

    return newAssessment;
  };

  const createReferral = (referralData: {
    patientId: string;
    hospitalId: string;
    riskLevel: any;
    primaryDiagnosisHint: string;
    urgencyReason: string;
  }): Referral => {
    const patient = patients.find(p => p.id === referralData.patientId) || INITIAL_PATIENTS[0];
    const hospital = hospitals.find(h => h.id === referralData.hospitalId) || hospitals[0];
    const newId = `REF-2026-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReferral: Referral = {
      id: newId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientPhone: patient.phone,
      village: patient.village,
      ashaWorkerId: ashaWorker.id,
      ashaWorkerName: ashaWorker.name,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      riskLevel: referralData.riskLevel,
      primaryDiagnosisHint: referralData.primaryDiagnosisHint,
      urgencyReason: referralData.urgencyReason,
      createdAt: new Date().toISOString(),
      status: 'Awaiting Hospital Response',
      statusTimeline: [
        {
          status: 'Awaiting Hospital Response',
          timestamp: new Date().toISOString(),
          note: `Emergency referral generated by ASHA ${ashaWorker.name} for ${patient.name}.`
        }
      ],
      transportArranged: false,
      ambulanceContact: '108 (Dispatched alert sent)',
    };

    setReferrals(prev => [newReferral, ...prev]);

    // Also update any matching assessment if present
    setAssessments(prev => prev.map(a => a.patientId === patient.id ? { ...a, referralId: newId } : a));

    if (!isOnline) {
      setOfflineQueue(prev => [...prev, { type: 'REFERRAL_CREATE', data: newReferral, timestamp: Date.now() }]);
      addToast('Referral Queued (Offline)', 'Emergency referral queued. Will ping hospital network once online.', 'warning');
    } else {
      addToast('Emergency Referral Dispatched', `Referral ${newId} sent to ${hospital.name}.`, 'danger');
    }

    return newReferral;
  };

  const simulateHospitalAcceptance = (referralId: string) => {
    setReferrals(prev => prev.map(ref => {
      if (ref.id === referralId) {
        const nextStatus: ReferralStatus = 'Hospital Accepted';
        const newTimeline = [
          ...ref.statusTimeline,
          {
            status: 'Hospital Notified' as ReferralStatus,
            timestamp: new Date(Date.now() - 30000).toISOString(),
            note: 'Referral package received by Hospital Emergency Command.'
          },
          {
            status: nextStatus,
            timestamp: new Date().toISOString(),
            note: 'Emergency bed reserved & admitting doctor notified. 108 Ambulance en route.'
          }
        ];
        return {
          ...ref,
          status: nextStatus,
          statusTimeline: newTimeline,
          transportArranged: true
        };
      }
      return ref;
    }));

    addToast(
      'Hospital Accepted Referral!',
      `Referral #${referralId} accepted by medical team. Bed confirmed.`,
      'success'
    );
  };

  const bookAppointment = (appointmentData: {
    hospitalId: string;
    department: string;
    doctorName: string;
    date: string;
    timeSlot: string;
    type?: any;
    symptomsSummary?: string;
  }): Appointment => {
    const hospital = hospitals.find(h => h.id === appointmentData.hospitalId) || hospitals[0];
    const newId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: newId,
      patientId: patientUser.id,
      patientName: patientUser.name,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      department: appointmentData.department,
      doctorName: appointmentData.doctorName,
      date: appointmentData.date,
      timeSlot: appointmentData.timeSlot,
      tokenNumber: Math.floor(1 + Math.random() * 25),
      type: appointmentData.type || 'Specialist Evaluation',
      status: 'Upcoming',
      symptomsSummary: appointmentData.symptomsSummary || 'Consultation booked via HospiTrack'
    };

    setAppointments(prev => [newAppointment, ...prev]);
    addToast('Appointment Confirmed!', `Booked at ${hospital.name} for ${appointmentData.date}`, 'success');

    return newAppointment;
  };

  const togglePatientTodayStatus = (patientId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const nextStatus = p.todayVisitStatus === 'completed' ? 'pending' : 'completed';
        addToast(
          nextStatus === 'completed' ? 'Visit Completed' : 'Marked as Pending',
          `${p.name}'s status is now marked as ${nextStatus.toUpperCase()}.`,
          nextStatus === 'completed' ? 'success' : 'info'
        );
        return { ...p, todayVisitStatus: nextStatus };
      }
      return p;
    }));
  };

  const syncOfflineData = async () => {
    if (offlineQueue.length === 0) {
      addToast('Already Synced', 'All local records are up to date.', 'info');
      return;
    }

    setIsSyncing(true);
    // Simulate real cloud network sync
    await new Promise(res => setTimeout(res, 1800));

    // Mark all patients as synced
    setPatients(prev => prev.map(p => ({ ...p, synced: true, isOfflineCreated: false })));
    setOfflineQueue([]);
    setIsOnline(true);
    setIsSyncing(false);

    addToast(
      'Synchronization Complete',
      'All local records successfully verified and pushed to HospiTrack cloud.',
      'success'
    );
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}isOnline`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}offlineQueue`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}patients`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}assessments`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}referrals`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}appointments`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}ashaAuth`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}patientAuth`);

    setPatients(INITIAL_PATIENTS);
    setAssessments(INITIAL_ASSESSMENTS);
    setReferrals(INITIAL_REFERRALS);
    setAppointments(INITIAL_APPOINTMENTS);
    setIsOnline(true);
    setOfflineQueue([]);
    addToast('Demo State Reset', 'Fresh hackathon prototype data restored.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isOnline,
        toggleOnlineStatus,
        offlineQueueCount: offlineQueue.length,
        isSyncing,
        syncOfflineData,
        isAshaLoggedIn,
        ashaWorker,
        loginAsha,
        logoutAsha,
        isPatientLoggedIn,
        patientUser,
        loginPatient,
        logoutPatient,
        patients,
        assessments,
        hospitals,
        referrals,
        appointments,
        labReports,
        addPatient,
        addAssessment,
        createReferral,
        simulateHospitalAcceptance,
        bookAppointment,
        togglePatientTodayStatus,
        toasts,
        addToast,
        removeToast,
        isDemoGuideOpen,
        setIsDemoGuideOpen,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
