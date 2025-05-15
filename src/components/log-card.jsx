import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import genericLogIcon from '../assets/notification-icon.svg'; // Using notification icon as a generic log icon

function LogCard({ log }) {
    const { darkMode } = useDarkMode();

    const getLogIconSVG = () => {
        const type = log?.sensorType?.toLowerCase() || "";

        if (type.includes('temperature')) {
            return <img src={temperatureIcon} alt="Temperature" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('humidity')) {
            return <img src={humidityIcon} alt="Humidity" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('soil') || type.includes('moisture')) {
            return <img src={soilMoistureIcon} alt="Soil Moisture" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('light')) {
            return <img src={lightIntensityIcon} alt="Light Intensity" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        // Default log icon (General)
        return <img src={genericLogIcon} alt="Log Entry" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
    };

    return (
        <div className="py-3 px-1">
            <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                    {getLogIconSVG()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {log?.sensorType || "Log Entry"}
                        </p>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {log?.timeStamp || "No time available"}
                        </span>
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {log?.message || "No message available"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LogCard;