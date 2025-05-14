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

function Navbar() {
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/loginPage');
    window.location.reload(); // Ensures auth state is reset
  };

  return (
    <div className={`w-64 flex flex-col h-full ${darkMode ? 'bg-[#28463a]' : 'bg-[#28463a]'} shadow-md`}>
      {/* Logo and Brand */}
      <div className="py-6 px-4 flex flex-col items-center">
        <img src={growMateLogo} className="w-12 h-12 mb-2" alt="GrowMate Logo" />
        <h1 className="text-white text-xl font-medium">GrowMate</h1>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {/* Dashboard Link */}
        <Link 
          to="/dashboard" 
          className={`flex items-center px-2 py-2 text-white rounded transition-colors ${isActive('/dashboard') ? 'bg-[#345c4e]' : 'hover:bg-[#345c4e]'}`}
        >
          <img src={homeIcon} alt="Dashboard-icon" width="20" height="20" className="mr-3 filter invert" />
          <span>Dashboard</span>
        </Link>

        {/* Water Management Link */}
        <Link 
          to="/water-management" 
          className={`flex items-center px-2 py-2 text-white rounded transition-colors ${isActive('/water-management') ? 'bg-[#345c4e]' : 'hover:bg-[#345c4e]'}`}
        >
          <img src={waterIcon} alt="Water-icon" width="20" height="20" className="mr-3 filter invert" />
          <span>Water Management</span>
        </Link>

        {/* Sensor View Link */}
        <Link 
          to="/sensor-view" 
          className={`flex items-center px-2 py-2 text-white rounded transition-colors ${isActive('/sensor-view') ? 'bg-[#345c4e]' : 'hover:bg-[#345c4e]'}`}
        >
          <img src={sensorIcon} alt="Sensor-icon" width="20" height="20" className="mr-3 filter invert" />
          <span>Sensor View</span>
        </Link>

        {/* Gallery Link */}
        <Link 
          to="/gallery" 
          className={`flex items-center px-2 py-2 text-white rounded transition-colors ${isActive('/gallery') ? 'bg-[#345c4e]' : 'hover:bg-[#345c4e]'}`}
        >
          <img src={galleryIcon} alt="Gallery-icon" width="20" height="20" className="mr-3 filter invert" />
          <span>Gallery</span>
        </Link>

        {/* Settings Link */}
        <Link 
          to="/settings" 
          className={`flex items-center px-2 py-2 text-white rounded transition-colors ${isActive('/settings') ? 'bg-[#345c4e]' : 'hover:bg-[#345c4e]'}`}
        >
          <img src={settingsIcon} alt="Settings-icon" width="20" height="20" className="mr-3 filter invert" />
          <span>Settings</span>
        </Link>

        {/* About Link */}
        <Link 
          to="/about" 
          className={`flex items-center px-2 py-2 text-white rounded transition-colors ${isActive('/about') ? 'bg-[#345c4e]' : 'hover:bg-[#345c4e]'}`}
        >
          <img src={aboutIcon} alt="About-us-icon" width="20" height="20" className="mr-3 filter invert" />
          <span>About us</span>
        </Link>
      </nav>
      
      {/* Bottom Section with Support and Logout */}
      <div className="mt-auto p-4">
        {/* Support Section */}
        <div className="flex items-center mb-4 p-2">
          <img src={supportIcon} alt="Support" width="30" height="30" className="rounded-full mr-3 filter invert" />
          <div>
            <p className="text-sm text-white">Need help?</p>
            <p className="text-xs text-gray-300">Contact support</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-2 py-2 text-white hover:bg-[#345c4e] rounded transition-colors w-full"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
