
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import UpdatePassword from './pages/UpdatePassword';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import NewAgreement from './pages/NewAgreement';
import AgreementDetails from './pages/AgreementDetails';
import Profile from './pages/Profile';
import AgreementsLibrary from './pages/AgreementsLibrary';
import TipsLibrary from './pages/TipsLibrary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './services/supabase';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth Event:', event); // Debug log
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Navigating to update-password'); // Debug log
        navigate('/update-password');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/new" element={<PrivateRoute><NewAgreement /></PrivateRoute>} />
      <Route path="/library" element={<PrivateRoute><AgreementsLibrary /></PrivateRoute>} />
      <Route path="/tips" element={<PrivateRoute><TipsLibrary /></PrivateRoute>} />
      <Route path="/details/:id" element={<PrivateRoute><AgreementDetails /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
