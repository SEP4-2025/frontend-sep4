import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import Navbar from './components/Navbar';
import Plant_upload_popup from './components/Plant-upload-popup';

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import StartPage from './pages/StartPage';
import GalleryPage from './pages/GalleryPage';
import WaterManagement from './pages/WaterManagement';
import AboutUsPage from './pages/AboutUsPage';


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

  const hideNavbarRoutes = ["/", "/loginPage"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

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
                <Navigate to="/loginPage" replace />
              ) : (
                <StartPage/>
              )
            }
          />
          <Route
            path="/loginPage"
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
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/water-management"
            element={
              isAuthenticated ? (
                <WaterManagement />
              ) : (
                <Navigate to="/loginPage" replace />
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
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              isAuthenticated ? (
                <GalleryPage />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <SettingsPage />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? (
                  <AboutUsPage />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/popup-page"
            element={
            isAuthenticated ? (
              <Plant_upload_popup />
            ) : (
              <Navigate to="/loginPage" replace />
            )
          }
        />
        </Routes>
      </main>
    </div>
  );
}

export default App;
