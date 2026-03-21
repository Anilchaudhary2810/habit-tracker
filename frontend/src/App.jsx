import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Planning from './pages/Planning';
import Leaderboard from './pages/Leaderboard';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
            style: {
                background: '#0f172a',
                color: '#fff',
                border: '1px solid #1e293b',
                borderRadius: '1rem',
                fontSize: '14px',
                fontWeight: '600'
            }
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/planning" 
            element={
              <ProtectedRoute>
                <Planning />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
