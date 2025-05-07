import { Link, useLocation } from 'react-router-dom';
import growMateLogo from '../assets/GrowMate_Logo_Transparent.png';
import supportIcon from '../assets/mdi--support.svg';
import homeIcon from '../assets/mynaui--home.svg';
import waterIcon from '../assets/lets-icons--water.svg';
import sensorIcon from '../assets/material-symbols--nest-remote-comfort-sensor-outline-rounded.svg';
import galleryIcon from '../assets/solar--gallery-broken.svg';
import settingsIcon from '../assets/akar-icons--gear.svg';
import aboutIcon from '../assets/material-symbols--info-outline-rounded.svg';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="w-64 bg-navbar-color text-white flex flex-col items-center p-4 min-h-full">
      <img src={growMateLogo} className="logo" alt="GrowMate Logo" />
      <h1 className='Jacques-Francois text-black text-center text-xl'> GrowMate </h1>
      <div className="border-b border-black w-4/5 mx-auto mt-1" />
      
      <Link to="/dashboard" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/') ? 'bg-green-100' : 'hover:bg-green-50'}`}>
        <img src={homeIcon} className='' alt="Dashboard-icon" width="20" height="20" />
        <p className='Navbar-content self-start p-2'>Dashboard</p>
      </Link>
      
      <Link to="/water-management" className={`flex flex-row items-start w-full justify-start pl-3 py-2 ${isActive('/water-management') ? 'bg-green-100' : 'hover:bg-green-50'}`}>
        <img src={waterIcon} className='mt-2.5' alt="Water-icon" width="20" height="20"/>
        <p className='Navbar-content self-start p-2'>Water Management</p>
      </Link>
      
      <Link to="/sensor-view" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/sensor-view') ? 'bg-green-100' : 'hover:bg-green-50'}`}>
        <img src={sensorIcon} className='' alt="Sensor-icon" width="20" height="20" />
        <p className='Navbar-content self-start p-2'>Sensor View</p>
      </Link>
      
      <Link to="/gallery" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/gallery') ? 'bg-green-100' : 'hover:bg-green-50'}`}>
        <img src={galleryIcon} className='' alt="Gallery-icon" width="20" height="20" />
        <p className='Navbar-content self-start p-2'>Gallery</p>
      </Link>
      
      <Link to="/settings" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/settings') ? 'bg-green-100' : 'hover:bg-green-50'}`}>
        <img src={settingsIcon} className='' alt="Settings-icon" width="20" height="20" />
        <p className='Navbar-content self-start p-2'>Settings</p>
      </Link>
      
      <Link to="/about" className={`flex flex-row w-full justify-start pl-3 py-2 ${isActive('/about') ? 'bg-green-100' : 'hover:bg-green-50'}`}>
        <img src={aboutIcon} className='' alt="About-us-icon" width="20" height="20" />
        <p className='Navbar-content self-start p-2'>About us</p>
      </Link>
      
      <div className="border-b border-black w-4/5 mx-auto mt-auto" />
      <div className="Section-card flex flex-row mt-5 mb-2">
        <img src={supportIcon} className='bg-support-icon-color border-b rounded-full max-h-10 self-center ml-2' alt="Support" width="38" height="38" />
        <div className='flex flex-col pr-2 pl-2'>
          <p className='text-sm pt-2 text-black pr-2 pl-1'>Need help?</p>
          <p className='text-xs text-gray-500 pr-2 pl-1 pb-2'>Contact support</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
