import React, { useState } from 'react';
import Notification_card from './Notification-card.jsx';
import Notification_pop_up from './Notification-pop-up.jsx';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import { useNotificationHub } from '../context/NotificationHubContext.jsx';
import { useDarkMode } from '../context/DarkModeContext';

function Notification_centre() {
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
        notificationElements = <p className='text-center py-2'>No notifications available</p>
    }

    return (
    <div className={`rounded-lg p-4 shadow-md w-1/3 mt-[2%] ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
        <div className={`flex flex-col p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
        <div className='flex flex-col p-2 gap-4'>
            <p className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : ''}`}>Notification Centre</p>
            <p className={`Manrope text-l ${darkMode ? 'text-gray-200' : ''}`}>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</p>
            <div className={`${darkMode ? 'text-gray-100' : 'text-black'}`}>{/*Notification section */ }
                {notificationElements}
                <div className="text-center"> 
                <button className={`p-2 mt-4 rounded-md mx-auto underline ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`} onClick={openModal}>{/*Notification Button */ }
                    View All Alerts
                </button>
                <Notification_pop_up isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </div>
        </div>
        </div>
    </div>
    );
}

export default Notification_centre;
