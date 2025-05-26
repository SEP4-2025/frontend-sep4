import React, { useState, useEffect } from 'react';
import { useFontSize } from '../context/FontSizeContext';
import { useDarkMode } from '../context/DarkModeContext';
import {
  getNotificationPreferencesData,
  toggleNotificationPreferenceData
} from '../utils/dataCompiler';

// Icons
import gearIconPath from '../assets/akar-icons--gear.svg';
import bellIconPath from '../assets/ion--notifications-outline.svg';
import moonIconPath from '../assets/material-symbols--dark-mode-outline.svg';
import fontIconPath from '../assets/majesticons--font-size.svg';
import humidityIconPath from '../assets/carbon--humidity-alt.svg';
import soilMoistureIconPath from '../assets/soil-moisture-icon.svg';
import temperatureIconPath from '../assets/solar--temperature-bold.svg';
import lightIconPath from '../assets/entypo--light-up.svg';
import wateringIconPath from '../assets/lets-icons--water.svg';

const SettingsPage = () => { 
  const [notificationPrefs, setNotificationPrefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode, setDarkMode } = useDarkMode();
  const { fontSizeKey, setFontSizeKey, FONT_SIZES_CONFIG } = useFontSize();

  useEffect(() => {
    const fetchNotificationPrefs = async () => {
      setLoading(true);
      try {
        const data = await getNotificationPreferencesData();
        setNotificationPrefs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching notification preferences:', err);
        setError('Failed to load notification preferences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationPrefs();
  }, []);

  const handleToggleNotification = async (gardenerId, type) => {
    try {
      await toggleNotificationPreferenceData(gardenerId, type);
      setNotificationPrefs(prev => prev.map(p => p.gardenerId === gardenerId && p.type === type ? { ...p, isEnabled: !p.isEnabled } : p));
    } catch {
      setError('Failed to update notification preference.');
    }
  };

  const IconWrapper = ({ children }) => (
    <div className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{children}</div>
  );

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <main className="flex-grow overflow-y-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6"> {/* Main two-column container */}
          {/* Left Column */}
          <div className="flex-1 space-y-8 max-w-3xl">
            <header className="mb-6 hidden sm:block">
              <h1 className="text-4xl font-bold flex items-center">
                <IconWrapper><img src={gearIconPath} alt="Settings" className={`w-full h-full ${darkMode ? 'invert' : ''}`} /></IconWrapper>
                <span className="Jacques-Francois ml-3">Settings</span>
              </h1>
            </header>

            {/* Notification Preferences Card */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="flex items-center gap-2 mb-1">
                <img src={bellIconPath} alt="Notifications" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                <h2 className="text-2xl font-semibold">Notification preferences</h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>Configure which notifications you want to receive</p>

              {error && <div className="text-red-600">{error}</div>}

              {loading ? <p>Loading...</p> : (
                <div>
                  {notificationPrefs.map((pref) => {
                    let iconSrc;
                    switch(pref.type.toLowerCase()) {
                      case 'humidity': iconSrc = humidityIconPath; break;
                      case 'soil moisture': iconSrc = soilMoistureIconPath; break;
                      case 'temperature': iconSrc = temperatureIconPath; break;
                      case 'light': iconSrc = lightIconPath; break;
                      case 'watering': iconSrc = wateringIconPath; break;
                      default: iconSrc = bellIconPath;
                    }
                    const isLastItem = notificationPrefs.indexOf(pref) === notificationPrefs.length - 1;
                    return (
                      <div
                        key={`${pref.gardenerId}-${pref.type}`}
                        className={`flex items-center justify-between py-4 ${!isLastItem ? `${darkMode ? 'border-slate-600' : 'border-gray-100'} border-b` : ''}`}
                      >
                        <div className="flex items-center">
                          <img src={iconSrc} alt={pref.type} className={`w-6 h-6 ${darkMode ? 'invert' : ''}`} />
                          <div className="ml-4">
                            <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{pref.type} notifications</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{pref.isEnabled ? 'Enabled' : 'Disabled'}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pref.isEnabled}
                            onChange={() => handleToggleNotification(pref.gardenerId, pref.type)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    );
                  })}
                  {notificationPrefs.length === 0 && (
                    <div className="py-4 text-center">
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>No notification preferences available.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Configured for specific alignment */}
          <div className="w-full lg:w-96 flex flex-col">
            {/* Color Mode Card: mt-16 to align with Notification Preferences card top */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-white'} p-6 rounded-lg shadow-md mt-16`}>
              <div className="flex items-center gap-2 mb-1">
                <img src={moonIconPath} alt="Dark Mode" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                <h2 className="text-xl font-semibold">Color mode</h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>Adjust visual theme for your preference</p>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <div className="ml-1">
                    <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>Dark mode</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Toggle dark mode for a better low-light experience</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>

            {/* Spacer to push Font Preferences to the bottom if Notification Preferences is taller */}
            {/* min-h-[2rem] ensures a minimum space similar to space-y-8 */}
            <div className="flex-grow min-h-[2rem]"></div>

            {/* Font Preferences Card: No top margin here, flex-grow pushes it down */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-white'} p-6 rounded-lg shadow-md`}>
              <div className="flex items-center gap-2 mb-1">
                <img src={fontIconPath} alt="Font Settings" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />
                <h2 className="text-xl font-semibold">Font preferences</h2>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>Customize text appearance throughout the app</p>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <div className={`w-6 h-6 flex items-center justify-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>Font size</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Select your preferred text size</p>
                  </div>
                </div>
                <select
                  value={fontSizeKey}
                  onChange={(e) => setFontSizeKey(e.target.value)}
                  className={`border ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-800'} rounded-md px-3 py-2 min-w-[120px]`}
                >
                  {Object.keys(FONT_SIZES_CONFIG).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;