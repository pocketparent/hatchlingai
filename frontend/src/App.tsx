import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Journal from '@/pages/Journal';
import Settings from '@/pages/Settings';
// import Login from '@/pages/Login'; ❌ temporarily disable

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Journal />} />
        <Route path="/settings" element={<Settings />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}
