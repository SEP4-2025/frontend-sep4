import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import Notification_pop_up from './Notification-pop-up.jsx';
import { useNotificationHub } from '../context/NotificationHubContext.jsx';
import { useDarkMode } from '../context/DarkModeContext';

function Notification_centre({ notificationData, notificationPreferences }) {
    const { notifications, isConnected } = useNotificationHub();
    const { darkMode } = useDarkMode();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const recentNotifications = notifications.slice(0, 3);
    let notificationElements;
    if (recentNotifications.length > 0) {
        notificationElements = recentNotifications.map((notification, index) => (
            <Notification_card key={index} notification={notification} />
        ));
    } else {
        notificationElements = <p className='text-center py-2'>No new notifications available</p>
    }

    return (
        <div className={`rounded-lg p-4 shadow-md w-1/3 mt-[2%] z-50 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`flex flex-col p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                <div className='flex flex-col p-2 gap-4'>
                    <div className='flex flex-row gap-2'>
                        <p className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>Notification Centre</p>
                        <div className="group relative ml-auto">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`absolute hidden group-hover:block top-[-30px] right-[-15px] px-2 py-1 text-xs rounded-md whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-md'}`}>
                                SignalR {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                    <div className={`${darkMode ? 'text-gray-100' : 'text-black'}`}>{/*Notification section */}
                        {notificationElements}
                        <div className="text-center">
                            <button className={`cursor-pointer p-2 mt-4 rounded-md mx-auto underline ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`} onClick={openModal}>{/*Notification Button */}
                                View All Alerts
                            </button>
                            <Notification_pop_up isOpen={isModalOpen} onClose={closeModal} notificationData={notificationData} notificationPreferences={notificationPreferences} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notification_centre;
