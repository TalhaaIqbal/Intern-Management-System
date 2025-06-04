import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/NavBar';

import Dashboard from './pages/Dashboard/InternDashboard';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Register from './pages/Register';
import DomainSelection from './pages/DomainSelection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/domain-selection" element={<DomainSelection />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
