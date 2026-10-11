import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Layouts
import { AshaLayout } from './components/asha/AshaLayout';
import { PatientLayout } from './components/patient/PatientLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

// ASHA Worker Pages
import { AshaLoginPage } from './pages/asha/AshaLoginPage';
import { AshaDashboardPage } from './pages/asha/AshaDashboardPage';
import { AshaRegisterPatientPage } from './pages/asha/AshaRegisterPatientPage';
import { AshaTriagePage } from './pages/asha/AshaTriagePage';
import { AshaReferralsPage } from './pages/asha/AshaReferralsPage';
import { AshaHospitalsPage } from './pages/asha/AshaHospitalsPage';
import { AshaPatientsPage } from './pages/asha/AshaPatientsPage';
import { AshaSyncPage } from './pages/asha/AshaSyncPage';
import { AshaProfilePage } from './pages/asha/AshaProfilePage';

// Patient Pages
import { PatientLoginPage } from './pages/patient/PatientLoginPage';
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage';
import { PatientHospitalsPage } from './pages/patient/PatientHospitalsPage';
import { PatientAppointmentsPage } from './pages/patient/PatientAppointmentsPage';
import { PatientReportsPage } from './pages/patient/PatientReportsPage';
import { PatientReferralsPage } from './pages/patient/PatientReferralsPage';
import { PatientHealthRecordsPage } from './pages/patient/PatientHealthRecordsPage';
import { PatientProfilePage } from './pages/patient/PatientProfilePage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />
          
          <div className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />

              {/* ASHA Auth */}
              <Route path="/asha/login" element={<AshaLoginPage />} />

              {/* ASHA Protected Operational Portal */}
              <Route path="/asha" element={<AshaLayout />}>
                <Route index element={<Navigate to="/asha/dashboard" replace />} />
                <Route path="dashboard" element={<AshaDashboardPage />} />
                <Route path="register-patient" element={<AshaRegisterPatientPage />} />
                <Route path="triage" element={<AshaTriagePage />} />
                <Route path="patients" element={<AshaPatientsPage />} />
                <Route path="referrals" element={<AshaReferralsPage />} />
                <Route path="hospitals" element={<AshaHospitalsPage />} />
                <Route path="sync" element={<AshaSyncPage />} />
                <Route path="profile" element={<AshaProfilePage />} />
              </Route>

              {/* Patient Auth */}
              <Route path="/patient/login" element={<PatientLoginPage />} />

              {/* HospiTrack Patient Portal */}
              <Route path="/patient" element={<PatientLayout />}>
                <Route index element={<Navigate to="/patient/dashboard" replace />} />
                <Route path="dashboard" element={<PatientDashboardPage />} />
                <Route path="hospitals" element={<PatientHospitalsPage />} />
                <Route path="appointments" element={<PatientAppointmentsPage />} />
                <Route path="reports" element={<PatientReportsPage />} />
                <Route path="referrals" element={<PatientReferralsPage />} />
                <Route path="health-records" element={<PatientHealthRecordsPage />} />
                <Route path="profile" element={<PatientProfilePage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <Footer />

          {/* Global Notifications */}
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
