import React, { useState, useEffect} from 'react';
import { useDarkMode } from '../context/DarkModeContext';

function ClockCard(){
    const { darkMode } = useDarkMode();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); 

        return () => clearInterval(timer); 
    }, [currentTime]); 

    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString();


    return (
        <div className={`p-4 rounded-lg shadow-sm ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <div className="flex items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Local Time</h3>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-bold">{formattedTime}</span>
                <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
        </div>
    );

}

export default ClockCard;