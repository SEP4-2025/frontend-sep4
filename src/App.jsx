import './App.css';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import SensorViewPage from './pages/SensorViewPage';
// import { useDarkMode } from './context/DarkModeContext'; // If needed for App level dark mode

function App() {
  return (
    <Router> {/* This is the single Router for your application */}
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("token"));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // State for mobile navbar

  // const { darkMode } = useDarkMode(); // Uncomment if you use darkMode for the root app background

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const hideNavbarRoutes = ["/", "/loginPage"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {!shouldHideNavbar && isAuthenticated && (
        // Navbar is now passed the necessary props for mobile functionality
        <Navbar isMobileNavOpen={isMobileNavOpen} toggleMobileNav={toggleMobileNav} />
      )}
      <main className="flex-1 overflow-y-auto h-screen">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/loginPage" replace />
              ) : (
                <StartPage />
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
                <Dashboard toggleMobileNav={toggleMobileNav} />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/water-management"
            element={
              isAuthenticated ? (
                <WaterManagement toggleMobileNav={toggleMobileNav} />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/sensor-view"
            element={
              isAuthenticated ? (
                <SensorViewPage toggleMobileNav={toggleMobileNav} />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              isAuthenticated ? (
                <GalleryPage toggleMobileNav={toggleMobileNav} />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? (
                <SettingsPage toggleMobileNav={toggleMobileNav} />
              ) : (
                <Navigate to="/loginPage" replace />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? (
                <AboutUsPage toggleMobileNav={toggleMobileNav} />
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
          {/* Fallback route for any other paths */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/loginPage"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;