import './App.css';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import Navbar from './components/Navbar';
import Plant_upload_popup from './components/Plant-upload-popup';
import MobileHeader from './components/MobileHeader'; // Added import
import { useMobileDetection } from './utils/useMobileDetection'; // Added import

// Pages
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import StartPage from './pages/StartPage';
import GalleryPage from './pages/GalleryPage';
import WaterManagement from './pages/WaterManagement';
import AboutUsPage from './pages/AboutUsPage';
import SensorViewPage from './pages/SensorViewPage';
import PlantManagement from './pages/PlantManagement';
// import { useDarkMode } from './context/DarkModeContext'; // If needed for App level dark mode

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMobile = useMobileDetection(); // Added hook usage

  // const { darkMode } = useDarkMode(); // Uncomment if you use darkMode for the root app background

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const hideNavbarAndMobileHeaderRoutes = ["/", "/loginPage"]; // Renamed for clarity
  const shouldHideNavbarAndMobileHeader = hideNavbarAndMobileHeaderRoutes.includes(location.pathname);

  // Function to get page title based on path
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/water-management":
        return "Water Management";
      case "/sensor-view":
        return "Sensor View";
      case "/gallery":
        return "Plant Gallery";
      case "/plant-management":
        return "Plant Management";
      case "/settings":
        return "Settings";
      case "/about":
        return "About Us";
      default:
        return "GrowMate"; // Default title
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen">
      {!shouldHideNavbarAndMobileHeader && isAuthenticated && (
        <Navbar isMobileNavOpen={isMobileNavOpen} toggleMobileNav={toggleMobileNav} />
      )}
      <main className="flex-1 overflow-y-auto h-screen">
        {isMobile && !shouldHideNavbarAndMobileHeader && isAuthenticated && (
          <MobileHeader toggleMobileNav={toggleMobileNav} title={currentPageTitle} />
        )}
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
                <SensorViewPage />
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
            path="/plant-management"
            element={
              isAuthenticated ? (
                <PlantManagement />
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
          {/* Fallback route for any other paths */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/loginPage"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;