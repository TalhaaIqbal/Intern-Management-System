import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/NavBar';
import InternDashboard from './pages/Dashboard/InternDashboard';
import AdminDashboard from './pages/Dashboard/admin/AdminDashboard';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import Register from './pages/Register';
import DomainSelection from './pages/DomainSelection';
import PrivateRoute from './components/PrivateRoutes';
import TaskManagement from './pages/Dashboard/admin/TaskManagement';
import EvaluateSubmissions from './pages/Dashboard/admin/EvaluateSubmissions';

function AppContent() {
  const location = useLocation();
  const hideLogoutRoutes = ['/login', '/register'];
  const isLogoutVisible = !hideLogoutRoutes.includes(location.pathname);

  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50">
      {isLogoutVisible && <Navigation />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={token ? <Navigate to="/intern-dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/intern-dashboard" replace /> : <Register />}
          />

          {/* Protected routes */}
          <Route path="/domain-selection" element={<PrivateRoute>
                <DomainSelection />
              </PrivateRoute> }/>

          <Route path="/intern-dashboard" element={<PrivateRoute>
                <InternDashboard />
              </PrivateRoute> }/>

          <Route path="/admin-dashboard" element={<PrivateRoute>
                <AdminDashboard />
              </PrivateRoute> }/>

          <Route path="/" element={<PrivateRoute>
                <Tasks />
              </PrivateRoute>} />

          <Route path="/admin/tasks" element={<PrivateRoute>
            <TaskManagement />
          </PrivateRoute>} />

          <Route path="/admin/submissions" element={<PrivateRoute>
            <EvaluateSubmissions />
          </PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;