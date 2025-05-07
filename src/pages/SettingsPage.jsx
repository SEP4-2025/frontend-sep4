import React, { useState } from 'react';

// Import SVG paths
import gearIconPath from '../assets/akar-icons--gear.svg'; // Using a known good icon for header
import bellIconPath from '../assets/ion--notifications-outline.svg';
import moonIconPath from '../assets/material-symbols--dark-mode-outline.svg';
import fontIconPath from '../assets/majesticons--font-size.svg';

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

const SettingsPage = () => {
  const [notifications, setNotifications] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('Medium');

  // Icon wrapper components for consistent styling
  const IconWrapper = ({ children }) => <div className="w-8 h-8 text-gray-600 flex items-center justify-center">{children}</div>;

  return (
    <div className="flex-1 p-8 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center">
          <IconWrapper><img src={gearIconPath} alt="Settings" className="w-full h-full" /></IconWrapper> <span className="Jacques-Francois ml-3">Settings</span>
        </h1>
      </header>

      <div className="space-y-8 max-w-2xl ">
        {/* Notification Preferences */}
        <div className="bg-navbar-color p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Notification preferences</h2>
          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <IconWrapper><img src={bellIconPath} alt="Notifications" className="w-full h-full" /></IconWrapper>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-800">Notifications: {notifications}</p>
                <p className="text-sm text-gray-500">Temperature exceeded normal level</p>
              </div>
            </div>
            <div className="relative">
              <select 
                value={notifications} 
                onChange={(e) => setNotifications(e.target.value)}
                className="appearance-none bg-transparent text-gray-800 py-2 pl-3 pr-8 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Important">Important</option>
                <option value="None">None</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Color Mode */}
        <div className="bg-navbar-color p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Color mode</h2>
          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <IconWrapper><img src={moonIconPath} alt="Color Mode" className="w-full h-full" /></IconWrapper>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-800">Dark mode: {darkMode ? 'On' : 'Off'}</p>
                <p className="text-sm text-gray-500">Temperature exceeded normal level</p>
              </div>
            </div>
            <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="darkModeToggle" 
                  className="sr-only" 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                />
                <div className={`block w-14 h-8 rounded-full ${darkMode ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${darkMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Font Preferences */}
        <div className="bg-navbar-color p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Font preferences</h2>
          <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <IconWrapper><img src={fontIconPath} alt="Font Size" className="w-full h-full" /></IconWrapper>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-800">Font size: {fontSize}</p>
                <p className="text-sm text-gray-500">Temperature exceeded normal level</p>
              </div>
            </div>
            <div className="relative">
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
                className="appearance-none bg-transparent text-gray-800 py-2 pl-3 pr-8 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
