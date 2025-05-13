import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import Notification_card from './Notification-card.jsx';
import filterArrow from '../assets/filterArrow.png';
import { useDarkMode } from '../context/DarkModeContext';
import { useNotificationHub } from '../context/NotificationHubContext.jsx';
import { useNotificationHub } from '../context/NotificationHubContext.jsx';

function Notification_pop_up({ isOpen, onClose, title, description, notificationData, notificationPreferences }) {
function Notification_pop_up({ isOpen, onClose, title, description, notificationData, notificationPreferences }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { darkMode } = useDarkMode();
    const { notifications } = useNotificationHub()
    const [notificationList, setNotificationList] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);

    const allNotifications = [...(notifications || []), ...(notificationData || [])]; // All notifications with duplicates
    const combinedNotifications = allNotifications.filter((notification, index, self) =>     // Remove duplicates
        index === self.findIndex((n) => n.id === notification.id)
    );

    useEffect(() => {
        // Filter notifications based on preferences section
        let result = combinedNotifications;
        if (notificationPreferences) {
            result = result.filter(notification => {
                const matchingPreference = notificationPreferences.find(
                    preference => preference.type?.toLowerCase() === notification.type?.toLowerCase()
                );
                return !matchingPreference || matchingPreference.isEnabled === true;
            })
        }

        // Filter notifications based on selected filter
        if (selectedFilter) {
            result = result.filter(notification => notification.type?.toLowerCase() === selectedFilter.toLowerCase());
        }

        result.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setNotificationList(result);

    }, [notificationData, notificationPreferences, notifications, selectedFilter]);

    const { darkMode } = useDarkMode();
    const { notifications } = useNotificationHub()
    const [notificationList, setNotificationList] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);

    const allNotifications = [...(notifications || []), ...(notificationData || [])]; // All notifications with duplicates
    const combinedNotifications = allNotifications.filter((notification, index, self) =>     // Remove duplicates
        index === self.findIndex((n) => n.id === notification.id)
    );

    useEffect(() => {
        // Filter notifications based on preferences section
        let result = combinedNotifications;
        if (notificationPreferences) {
            result = result.filter(notification => {
                const matchingPreference = notificationPreferences.find(
                    preference => preference.type?.toLowerCase() === notification.type?.toLowerCase()
                );
                return !matchingPreference || matchingPreference.isEnabled === true;
            })
        }

        // Filter notifications based on selected filter
        if (selectedFilter) {
            result = result.filter(notification => notification.type?.toLowerCase() === selectedFilter.toLowerCase());
        }

        result.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setNotificationList(result);

    }, [notificationData, notificationPreferences, notifications, selectedFilter]);


    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 max-h-screen pl-[10%] ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
            <div className={`border-1 rounded-xl pl-2 pb-2 pt-1 pr-1 mx-auto w-4/5 h-3/5 p-2 m-15 flex flex-col overflow-hidden    ${darkMode ? 'darkMode border-gray-600 bg-black' : 'bg-white border-gray-500 bg-navbar-color'}`}>
                <div className='flex flex-col p-2 gap-4'>
                    <div className='text-left'>
                        <h1 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-black'}`}>{title || 'Notification Center'}</h1>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>{description || 'Here you can see old and new notifications from your plant'}</p>
                    </div>
                    {/* filter button */}
                    <div className="flex justify-end w-full">
                        <div className="relative w-1/5">
                            <button
                                className={`w-full px-4 py-2 rounded-md focus:outline-none border cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                                onClick={toggleFilterMenu}>
                                <div className={`flex flex-row justify-between items-center w-full`}>
                                    <p className='Manrope'>{selectedFilter ? `${selectedFilter}` : "All"}</p>
                                    <img src={filterArrow} className={`w-5 h-5 transition-transform duration-750 ${isFilterOpen ? 'rotate-180' : ''}  ${darkMode ? 'filter invert' : ''}`} alt="temperature icon" width="23" height="2" />
                                </div>
                            </button>

                            {/* Filter menu */}
                            {isFilterOpen && (
                                <div className={`absolute top-full right-0 mt-1 border rounded-md w-48 dropdown-animation ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                                    <ul className="py-1 text-left cursor-pointer">
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => {
                                                setSelectedFilter(null);
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            All
                                        </li>
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => {
                                                setSelectedFilter('Temperature');
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            Temperature
                                        </li>
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => {
                                                setSelectedFilter('Soil Moisture');
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            Soil Moisture
                                        </li>
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => {
                                                setSelectedFilter('Humidity');
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            Humidity
                                        </li>
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => {
                                                setSelectedFilter('Light');
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            Light Intensivity
                                        </li>
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
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
                </div>

                {/* Notifications */}
                <div className={`flex-1 overflow-y-auto pr-2 max-h-[60vh] ${darkMode ? 'text-gray-100' : 'text-black'}`}>
                    {notificationList.length > 0 ? (
                        notificationList.map((notification, index) => (
                            <Notification_card key={index} notification={notification} />
                        ))
                    ) : (
                        <p className="text-center py-4">No notifications available</p>
                    )}
                    <div className="text-center mt-auto pt-2">
                <div className={`flex-1 overflow-y-auto pr-2 max-h-[60vh] ${darkMode ? 'text-gray-100' : 'text-black'}`}>
                    {notificationList.length > 0 ? (
                        notificationList.map((notification, index) => (
                            <Notification_card key={index} notification={notification} />
                        ))
                    ) : (
                        <p className="text-center py-4">No notifications available</p>
                    )}
                    <div className="text-center mt-auto pt-2">
                        <button
                            className={`p-2 mt-4 rounded-md mx-auto underline cursor-pointer ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
                            onClick={() => {
                                onClose();
                                setIsFilterOpen(false);
                            }}
                            className={`p-2 mt-4 rounded-md mx-auto underline cursor-pointer ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
                            onClick={() => {
                                onClose();
                                setIsFilterOpen(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification_pop_up;
