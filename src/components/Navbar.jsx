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
    <div className={`w-64 flex flex-col items-center p-4 min-h-full ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-navbar-color text-white'}`}>
      <img src={growMateLogo} className="logo" alt="GrowMate Logo" />
      <h1 className={`Jacques-Francois text-center text-xl ${darkMode ? 'text-gray-100' : 'text-black'}`}> GrowMate </h1>
      <div className={`border-b w-4/5 mx-auto mt-1 ${darkMode ? 'border-gray-600' : 'border-black'}`} />

      <Link to="/dashboard" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/dashboard') ? (darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-700 font-semibold') : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-50')}`}>
        <img src={homeIcon} alt="Dashboard-icon" width="20" height="20" className={`${darkMode && isActive('/dashboard') ? 'filter invert' : ''} ${darkMode && !isActive('/dashboard') ? 'filter invert' : ''}`} /> {/* Invert icons for dark mode visibility if needed */}
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''} ${isActive('/dashboard') ? (darkMode ? 'text-white' : 'text-green-700 font-semibold') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>Dashboard</p>
      </Link>

      <Link to="/water-management" className={`flex flex-row items-start w-full justify-start pl-3 py-2 ${isActive('/water-management') ? (darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-700 font-semibold') : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-50')}`}>
        <img src={waterIcon} className={`mt-2.5 ${darkMode && isActive('/water-management') ? 'filter invert' : ''} ${darkMode && !isActive('/water-management') ? 'filter invert' : ''}`} alt="Water-icon" width="20" height="20" />
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''} ${isActive('/water-management') ? (darkMode ? 'text-white' : 'text-green-700 font-semibold') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>Water Management</p>
      </Link>

      <Link to="/sensor-view" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/sensor-view') ? (darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-700 font-semibold') : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-50')}`}>
        <img src={sensorIcon} alt="Sensor-icon" width="20" height="20" className={`${darkMode && isActive('/sensor-view') ? 'filter invert' : ''} ${darkMode && !isActive('/sensor-view') ? 'filter invert' : ''}`} />
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''} ${isActive('/sensor-view') ? (darkMode ? 'text-white' : 'text-green-700 font-semibold') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>Sensor View</p>
      </Link>

      <Link to="/gallery" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/gallery') ? (darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-700 font-semibold') : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-50')}`}>
        <img src={galleryIcon} alt="Gallery-icon" width="20" height="20" className={`${darkMode && isActive('/gallery') ? 'filter invert' : ''} ${darkMode && !isActive('/gallery') ? 'filter invert' : ''}`} />
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''} ${isActive('/gallery') ? (darkMode ? 'text-white' : 'text-green-700 font-semibold') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>Gallery</p>
      </Link>

      <Link to="/settings" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/settings') ? (darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-700 font-semibold') : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-50')}`}>
        <img src={settingsIcon} alt="Settings-icon" width="20" height="20" className={`${darkMode && isActive('/settings') ? 'filter invert' : ''} ${darkMode && !isActive('/settings') ? 'filter invert' : ''}`} />
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''} ${isActive('/settings') ? (darkMode ? 'text-white' : 'text-green-700 font-semibold') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>Settings</p>
      </Link>

      <Link to="/about" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/about') ? (darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-700 font-semibold') : (darkMode ? 'hover:bg-gray-600' : 'hover:bg-green-50')}`}>
        <img src={aboutIcon} alt="About-us-icon" width="20" height="20" className={`${darkMode && isActive('/about') ? 'filter invert' : ''} ${darkMode && !isActive('/about') ? 'filter invert' : ''}`} />
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''} ${isActive('/about') ? (darkMode ? 'text-white' : 'text-green-700 font-semibold') : (darkMode ? 'text-gray-200' : 'text-gray-700')}`}>About us</p>
      </Link>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`w-full text-left pl-3 py-2 mt-auto font-medium ${darkMode ? 'hover:bg-red-800 text-red-400' : 'hover:bg-red-100 text-red-700'}`}
      >
        <p className={`Navbar-content self-start p-2 ${darkMode ? 'filter invert' : ''}`}>Logout</p> {/* Apply invert filter in dark mode */}
      </button>

      <div className={`border-b w-4/5 mx-auto ${darkMode ? 'border-gray-600' : 'border-black'}`} />

      {/* Support Section */}
      <div className={`Section-card flex flex-row mt-5 mb-2 rounded-md p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}> {/* Added padding and conditional bg for Section-card */}
        <img src={supportIcon} className={`rounded-full max-h-10 self-center ${darkMode ? 'bg-gray-600' : 'bg-support-icon-color'}`} alt="Support" width="38" height="38" />
        <div className='flex flex-col pr-2 pl-2'>
          <p className={`text-sm pt-2 pr-2 pl-1 ${darkMode ? 'text-gray-200' : 'text-black'}`}>Need help?</p>
          <p className={`text-xs pr-2 pl-1 pb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact support</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
