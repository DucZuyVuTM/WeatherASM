import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from './shared/ui/Layout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Forecast } from './pages/forecast/Forecast';
import { Alerts } from './pages/alerts/Alerts';
import { Analysis } from './pages/analysis/Analysis';
import { Compare } from './pages/compare/Compare';
import { Profile } from './pages/profile/Profile';
import { AppDispatch, RootState } from './app/store';
import { checkAuth } from './features/auth/authSlice';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="forecast" element={<Forecast />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="compare" element={<Compare />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
