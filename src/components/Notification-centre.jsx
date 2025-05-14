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
        <div className={`rounded-lg p-5 shadow-sm h-[380px] flex flex-col ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                <div className="flex items-center">
                    <div className="group relative">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                        <span className={`absolute hidden group-hover:block top-[-30px] right-0 px-2 py-1 text-xs rounded-md whitespace-nowrap ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 shadow-md'}`}>
                            SignalR {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className={`flex-grow overflow-y-auto ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {recentNotifications.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                        {notificationElements}
                    </div>
                ) : (
                    <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No new notifications
                    </div>
                )}
            </div>
            
            {/* View All Alerts button - larger and centered at bottom */}
            <div className="flex justify-center mt-auto pt-4">
                <button 
                    onClick={openModal}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${darkMode ? 
                        'bg-slate-600 text-white hover:bg-slate-500' : 
                        'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    View All Alerts
                </button>
            </div>
            
            <Notification_pop_up 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                notificationData={notificationData} 
                notificationPreferences={notificationPreferences} 
            />
        </div>
    );
}

export default Notification_centre;
