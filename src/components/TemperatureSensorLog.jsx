import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import NotificationCard from '../components/Notification-card';
import Notification_pop_up from './Notification-pop-up.jsx';

function TemperatureSensorLog ({notifications}) {
    const { darkMode } = useDarkMode();

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    //dummy data
    notifications = [
    {
        type: "Warning",
        message: "A mario lo financia el PSOE.",
        timeStamp: "2025-05-13 10:00 AM",
    },
    {
        type: "Info",
        message: "Sensor reading normalized.",
        timeStamp: "2025-05-13 11:00 AM",
    },
    {
        type: "Alert",
        message: "Sensor not responding.",
        timeStamp: "2025-05-13 12:15 PM",
    },
    {
        type: "Status",
        message: "Connection re-established.",
        timeStamp: "2025-05-13 12:45 PM",
    },
    ];

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <p className='Manrope font-bold text-center text-lg mb-3'>Temperature sensor log</p>
                    <div>
                        {notifications.slice(0, 2).map((n, index) => (
                        <NotificationCard key={index} notification={n} />
                        ))}
                        <button className={`p-2 mt-4 rounded-md mx-auto text-center underline w-full ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`} onClick={openModal}>{/*Notification Button */ }
                            View All Alerts
                        </button>
                        <Notification_pop_up isOpen={isModalOpen} onClose={closeModal} title="Sensor log" description="Here you can the history of all log readings in your greenhouse"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TemperatureSensorLog;