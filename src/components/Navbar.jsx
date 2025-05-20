import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import growMateLogo from '../assets/GrowMate_Logo_Transparent.png';
import supportIcon from '../assets/mdi--support.svg';
import homeIcon from '../assets/mynaui--home.svg';
import waterIcon from '../assets/lets-icons--water.svg';
import sensorIcon from '../assets/material-symbols--nest-remote-comfort-sensor-outline-rounded.svg';
import galleryIcon from '../assets/solar--gallery-broken.svg';
import settingsIcon from '../assets/akar-icons--gear.svg';
import aboutIcon from '../assets/material-symbols--info-outline-rounded.svg';

// New close icon for mobile
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function Navbar({ isMobileNavOpen, toggleMobileNav }) {
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/loginPage');
    window.location.reload(); // Ensures auth state is reset
    if (isMobileNavOpen) { // Close nav on mobile after action
      toggleMobileNav();
    }
  };

  const handleLinkClick = () => {
    if (isMobileNavOpen) {
      toggleMobileNav(); // Close mobile nav when a link is clicked
    }
  };

  const navLinks = [
    { to: "/dashboard", icon: homeIcon, text: "Dashboard", alt: "Dashboard-icon" },
    { to: "/water-management", icon: waterIcon, text: "Water Management", alt: "Water-icon" },
    { to: "/sensor-view", icon: sensorIcon, text: "Sensor View", alt: "Sensor-icon" },
    { to: "/gallery", icon: galleryIcon, text: "Gallery", alt: "Gallery-icon" },
    { to: "/settings", icon: settingsIcon, text: "Settings", alt: "Settings-icon" },
    { to: "/about", icon: aboutIcon, text: "About us", alt: "About-us-icon" },
  ];

  return (
    <>
      {/* Overlay for mobile, shown when nav is open */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={toggleMobileNav}
          aria-hidden="true"
        ></div>
      )}

      {/* Navbar container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col h-full
          w-64 
          ${darkMode ? 'bg-slate-800' : 'bg-[#28463a]'}
          text-white
          shadow-md
          transform transition-transform duration-300 ease-in-out
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          lg:h-screen
          lg:flex-shrink-0
        `}
      >
        {/* Mobile Header with Close Button - only on mobile */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center">
            <img src={growMateLogo} className="w-8 h-8 mr-2" alt="GrowMate Logo" />
            <h1 className="text-lg font-medium">GrowMate</h1>
          </div>
          <button onClick={toggleMobileNav} className="p-2" aria-label="Close navigation menu">
            <CloseIcon />
          </button>
        </div>

        {/* Logo and Brand - hidden on mobile when nav is open, shown on desktop */}
        <div className="hidden lg:flex py-6 px-4 flex-col items-center">
          <img src={growMateLogo} className="w-20 h-20 mb-2" alt="GrowMate Logo" /> {/* Increased size */}
          <h1 className="text-3xl font-medium">GrowMate</h1> {/* Adjusted font size */}
        </div>
        
        {/* Navigation Links: flex-1 allows this to grow and push footer down */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={`flex items-center px-2 py-2 rounded transition-colors ${
                isActive(link.to) ? (darkMode ? 'bg-slate-700' : 'bg-[#345c4e]') : (darkMode ? 'hover:bg-slate-700' : 'hover:bg-[#345c4e]')
              }`}
            >
              <img src={link.icon} alt={link.alt} width="20" height="20" className="mr-3 filter invert" />
              <span>{link.text}</span>
            </Link>
          ))}
        </nav>
        
        {/* Bottom Section with Support and Logout: mt-auto pushes to bottom if space available */}
        <div className="mt-auto p-4 border-t border-gray-700">
          {/* Support Section */}
          <div className={`flex items-center mb-4 p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-[#345c4e]'}`}>
            <img src={supportIcon} alt="Support" width="30" height="30" className="rounded-full mr-3 filter invert" />
            <div>
              <p className="text-sm">Need help?</p>
              <p className="text-xs text-gray-400">Contact support</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center px-2 py-2 rounded transition-colors w-full text-white ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;