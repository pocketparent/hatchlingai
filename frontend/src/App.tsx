import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Journal from '@/pages/Journal';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Journal /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
