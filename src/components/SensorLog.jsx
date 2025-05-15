import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import NotificationCard from './Notification-card.jsx';
import Notification_pop_up from './Notification-pop-up.jsx';

// Removed sensorName from props
function SensorLog ({ notifications }) { 
    const { darkMode } = useDarkMode();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Ensure notifications is an array before trying to slice or check length
    const displayNotifications = Array.isArray(notifications) ? notifications : [];

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    {/* Changed title to "Log" */}
                    <p className='Manrope font-bold text-center text-lg mb-3'>Log</p>
                    <div>
                        {displayNotifications.length > 0 ? (
                            displayNotifications.slice(0, 2).map((n, index) => (
                                <NotificationCard key={index} notification={n} />
                            ))
                        ) : (
                            <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No logs available for the last 30 days.</p>
                        )}
                        {displayNotifications.length > 2 && (
                            <button 
                                className={`p-2 mt-4 rounded-md mx-auto text-center underline w-full ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`} 
                                onClick={openModal}
                            >
                                View All Logs
                            </button>
                        )}
                        <Notification_pop_up 
                            isOpen={isModalOpen} 
                            onClose={closeModal} 
                            title="Log History" 
                            description="Here you can see the history of all log readings from the last 30 days."
                            // Pass all (already date-filtered and sorted) notifications
                            notifications={displayNotifications} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SensorLog;