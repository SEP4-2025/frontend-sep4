import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import genericLogIcon from '../assets/notification-icon.svg'; 

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
        
        return <img src={genericLogIcon} alt="Log Entry" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
    };

    
    const formattedDate = log?.timeStamp?.split('T')[0] || "No date available";
    
    


    return (
        <div className={`rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'} p-4 mb-2 last:mb-0`}>
            <div className="flex items-start gap-3">
                <div className="text-info-500">
                    {getLogIconSVG()}
                </div>
                <div className="flex-1">
                    {/* Timestamp for Desktop */}
                    <div className={`hidden lg:flex items-center justify-between mb-2`}>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formattedDate} 
                        </span>
                    </div>
                    
                    <div className="space-y-1">
                        <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {log?.sensorType}: {log?.value || "N/A"}{log?.unit || ""}
                        </p>
                        
                        {log?.deviation && (
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Current deviation: {log.deviation}
                            </p>
                        )}
                        
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Event: {log.type === "Log Entry" ? log.message : `${log.sensorType} reading recorded.`}
                        </p>

                        {/* Timestamp for Mobile - appears as the last item */}
                        <p className={`lg:hidden text-sm font-medium mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formattedDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogCard;