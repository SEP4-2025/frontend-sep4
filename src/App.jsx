import './App.css';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import Navbar from './components/Navbar';
// PlantUploadPopup is imported but not used in App.jsx, consider removing if not needed globally here
// import PlantUploadPopup from './components/PlantUploadPopup.jsx';
import MobileHeader from './components/MobileHeader';
import { useMobileDetection } from './utils/useMobileDetection';
import { useDarkMode } from './context/DarkModeContext'; // Import useDarkMode

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
  const isMobile = useMobileDetection();
  const { darkMode } = useDarkMode(); // Get darkMode state

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const hideNavbarAndMobileHeaderRoutes = ["/", "/loginPage"];
  const shouldHideNavbarAndMobileHeader = hideNavbarAndMobileHeaderRoutes.includes(location.pathname);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/dashboard": return "Dashboard";
      case "/water-management": return "Water Management";
      case "/sensor-view": return "Sensor View";
      case "/gallery": return "Plant Gallery";
      case "/plant-management": return "Plant Management";
      case "/settings": return "Settings";
      case "/about": return "About Us";
      default: return "GrowMate";
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    // This outer div is a flex row for Navbar + main content.
    // min-h-screen ensures it covers the viewport height.
    // A base background for the entire app (e.g., behind the navbar if it's transparent or has gaps)
    <div className={`flex min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
      {!shouldHideNavbarAndMobileHeader && isAuthenticated && (
        <Navbar isMobileNavOpen={isMobileNavOpen} toggleMobileNav={toggleMobileNav} />
      )}
      {/*
        MAIN CONTENT AREA:
        - `flex-1`: Takes up remaining width.
        - `overflow-y-auto`: Handles scrolling for page content.
        - `h-screen` REMOVED. Its height is now governed by the parent flex container.
        - Sets the background and default text color for the area where pages are rendered.
      */}
      <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
        {isMobile && !shouldHideNavbarAndMobileHeader && isAuthenticated && (
          <MobileHeader toggleMobileNav={toggleMobileNav} title={currentPageTitle} />
        )}
        {/*
          If MobileHeader is fixed (e.g., sticky top-0) and has a known height,
          you might need to add padding-top to the div wrapping <Routes> or directly to <main>
          to prevent page content from being obscured by the MobileHeader.
          Example: <div className="pt-16"> <Routes>...</Routes> </div> if MobileHeader is h-16.
          For now, assuming MobileHeader flows in document or its height is accounted for.
        */}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/loginPage" replace /> : <StartPage />} />
          <Route path="/loginPage" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/loginPage" replace />} />
          <Route path="/water-management" element={isAuthenticated ? <WaterManagement /> : <Navigate to="/loginPage" replace />} />
          <Route path="/sensor-view" element={isAuthenticated ? <SensorViewPage /> : <Navigate to="/loginPage" replace />} />
          <Route path="/gallery" element={isAuthenticated ? <GalleryPage /> : <Navigate to="/loginPage" replace />} />
          <Route path="/plant-management" element={isAuthenticated ? <PlantManagement /> : <Navigate to="/loginPage" replace />} />
          <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/loginPage" replace />} />
          <Route path="/about" element={isAuthenticated ? <AboutUsPage /> : <Navigate to="/loginPage" replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/loginPage"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;