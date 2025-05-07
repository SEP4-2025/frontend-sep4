import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'

// Pages
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/loginPage'
import StartPage from './pages/StartPage'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/loginPage"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
      <div className="flex min-h-screen">
      {!shouldHideNavbar && (
          <div className="h-screen overflow-y-auto flex-shrink-0 border-r border-black">
            <Navbar />
          </div>
        )}
        <main className="flex-1 overflow-y-auto h-screen">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/loginPage" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/water-management" element={<div className="p-4"><h1>Water Managment</h1><p>Water managment page coming soon</p></div>} />
              <Route path="/sensor-view" element={<div className="p-4"><h1>Sensor View</h1><p>Sensor view page coming soon</p></div>} />
              <Route path="/gallery" element={<div className="p-4"><h1>Gallery</h1><p>Gallery page coming soon</p></div>} />
              <Route path="/settings" element={<div className="p-4"><h1>Settings</h1><p>Settings page coming soon</p></div>} />
              <Route path="/about" element={<div className="p-4"><h1>About Us</h1><p>About us page coming soon</p></div>} />
            </Routes>
        </main>
      </div>
  )
}

export default App
