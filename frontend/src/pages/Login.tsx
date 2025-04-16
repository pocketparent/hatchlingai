import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Journal from '@/pages/Journal';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
// import Login from '@/pages/Login'; // disabled for now

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/journal" />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
