import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("token"));

  const shouldHideNavbar = location.pathname === "/";

  return (
    <div className="flex min-h-screen">
      {!shouldHideNavbar && isAuthenticated && (
        <div className="h-screen overflow-y-auto flex-shrink-0 border-r border-black">
          <Navbar />
        </div>
      )}
      <main className="flex-1 overflow-y-auto h-screen">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/water-management"
            element={
              isAuthenticated ? (
                <div className="p-4">
                  <h1>Water Managment</h1>
                  <p>Water managment page coming soon</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/sensor-view"
            element={
              isAuthenticated ? (
                <div className="p-4">
                  <h1>Sensor View</h1>
                  <p>Sensor view page coming soon</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              isAuthenticated ? (
                <div className="p-4">
                  <h1>Gallery</h1>
                  <p>Gallery page coming soon</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <SettingsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? (
                <div className="p-4">
                  <h1>About Us</h1>
                  <p>About us page coming soon</p>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
