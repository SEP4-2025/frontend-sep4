import React, { useState, useEffect} from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function ClockCard(){
    const { darkMode } = useDarkMode();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // It creates a timer that updates the current time every second

        return () => clearInterval(timer); // It prevents it still running in the background when the component is no longer in use
    }, [currentTime]); // updates display every second, no need for additional components

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString();


    return (
        <div className={`rounded-full p-4 shadow-md w-1/6 mb-6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
            <div className={`flex flex-col h-full p-3 border rounded-full text-center ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                <p className={`Manrope text-2xl ${darkMode ? 'text-gray-100' : ''}`}>{formattedTime}</p>
                <p className={`Manrope text-l ${darkMode ? 'text-gray-300' : ''}`}>{formattedDate}</p>
            </div>
        </div>
    );

}

export default ClockCard;