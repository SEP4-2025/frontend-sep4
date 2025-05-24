import React, { useState, useEffect } from 'react';
import NotificationCard from './NotificationCard.jsx'; 
import filterArrow from '../assets/filterArrow.png';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useNotificationHub } from '../context/NotificationHubContext.jsx';
import { useMobileDetection } from '../utils/useMobileDetection.js'; 

function NotificationPopup({ isOpen, onClose, notificationData, notificationPreferences }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { darkMode } = useDarkMode();
    const { notifications } = useNotificationHub();
    const [notificationList, setNotificationList] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const isMobile = useMobileDetection(); 

    const allNotifications = [...(notifications || []), ...(notificationData || [])];
    const combinedNotifications = allNotifications.filter((notification, index, self) =>
        index === self.findIndex((n) => n.id === notification.id)
    );

    useEffect(() => {
        let result = combinedNotifications;
        if (notificationPreferences) {
            result = result.filter(notification => {
                const matchingPreference = notificationPreferences.find(
                    preference => preference.type?.toLowerCase() === notification.type?.toLowerCase()
                );
                return !matchingPreference || matchingPreference.isEnabled === true;
            });
        }

        if (selectedFilter) {
            result = result.filter(notification => notification.type?.toLowerCase() === selectedFilter.toLowerCase());
        }

        result.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setNotificationList(result);
    }, [notificationData, notificationPreferences, notifications, selectedFilter, combinedNotifications]);

    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
          <div
            className={`relative border-1 rounded-xl flex flex-col overflow-hidden ${
              darkMode ? 'border-gray-600 bg-black' : 'bg-white border-gray-500'
            }`}
            style={{
              width: isMobile ? '90%' : '80%',
              height: isMobile ? '85%' : '60%',
            }}
          >
            {/* Header */}
            <div className="p-4">
              <div className={`flex flex-col ${isMobile ? 'items-center' : 'justify-between items-center lg:flex-row'}`}>
                {/* Title */}
                <h1 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-black'} mb-2 lg:mb-0`}>
                  {isMobile ? 'Notifications' : 'Notification Centre'}
                </h1>
      
                {/* Filter Button */}
                <div className={`relative ${isMobile ? 'self-end' : ''}`}>
                  <button
                    className={`px-4 py-2 rounded-md focus:outline-none border cursor-pointer ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={toggleFilterMenu}
                  >
                    <div className="flex items-center">
                      <p>{selectedFilter ? selectedFilter : 'All'}</p>
                      <img
                        src={filterArrow}
                        className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                          isFilterOpen ? 'rotate-180' : ''
                        } ${darkMode ? 'filter invert' : ''}`}
                        alt="Filter Arrow"
                      />
                    </div>
                  </button>
      
                  {/* Filter Menu */}
                  {isFilterOpen && (
                    <div
                      className={`absolute top-full right-0 mt-1 border rounded-md w-48 ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <ul className="py-1">
                        <li
                          className={`px-4 py-2 cursor-pointer ${
                            darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedFilter(null);
                            setIsFilterOpen(false);
                          }}
                        >
                          All
                        </li>
                        <li
                          className={`px-4 py-2 cursor-pointer ${
                            darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedFilter('Temperature');
                            setIsFilterOpen(false);
                          }}
                        >
                          Temperature
                        </li>
                        <li
                          className={`px-4 py-2 cursor-pointer ${
                            darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedFilter('Soil Moisture');
                            setIsFilterOpen(false);
                          }}
                        >
                          Soil Moisture
                        </li>
                        <li
                          className={`px-4 py-2 cursor-pointer ${
                            darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedFilter('Humidity');
                            setIsFilterOpen(false);
                          }}
                        >
                          Humidity
                        </li>
                        <li
                          className={`px-4 py-2 cursor-pointer ${
                            darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedFilter('Light');
                            setIsFilterOpen(false);
                          }}
                        >
                          Light Intensity
                        </li>
                        <li
                          className={`px-4 py-2 cursor-pointer ${
                            darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedFilter('Watering');
                            setIsFilterOpen(false);
                          }}
                        >
                          Watering
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
      
              {/* Subtitle */}
              {!isMobile && (
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-400'} mt-2`}>
                  Here you can see old and new notifications from your plant
                </p>
              )}
            </div>
      
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto px-4">
              {notificationList.length > 0 ? (
                notificationList.map((notification, index) => (
                  <NotificationCard key={index} notification={notification} />
                ))
              ) : (
                <p className="text-center py-4">No notifications available</p>
              )}
            </div>
      
            {/* Footer with Close Button */}
            <div className="p-4 border-t border-gray-300">
              <button
                onClick={onClose}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                  darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
}

export default NotificationPopup;