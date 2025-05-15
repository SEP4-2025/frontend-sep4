import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
// import waterLevelIcon from '../assets/hugeicons--humidity.svg'; // This was for 'Watering', can be removed or kept if 'General' might use it.
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import notificationIcon from '../assets/notification-icon.svg'; // Default/General icon
import { useDarkMode } from '../context/DarkModeContext';

function Notification_card({notification}) {
    const { darkMode } = useDarkMode();

    // Helper function to get the notification icon based on the sensorType
    const getNotificationIconSVG = () => {
        const type = notification?.sensorType?.toLowerCase(); // Use sensorType

        if (type === 'temperature') {
            return <img src={temperatureIcon} alt="Temperature" className={`w-5 h-5 ${ darkMode ? 'invert' : ''}`} />;
        }
        if (type === 'humidity') {
            return <img src={humidityIcon} alt="Humidity" className={`w-5 h-5 ${ darkMode ? 'invert' : ''}`} />;
        }
        if (type === 'soil moisture') { // Matches 'Soil Moisture' from mapSensorIdToText
            return <img src={soilMoistureIcon} alt="Soil Moisture" className={`w-5 h-5 ${ darkMode ? 'invert' : ''}`} />;
        }
        if (type === 'light') {
            return <img src={lightIntensityIcon} alt="Light" className={`w-5 h-5 ${ darkMode ? 'invert' : ''}`} />;
        }
        // For 'General', 'Unknown', or any other type
        return <img src={notificationIcon} alt="Log Entry" className={`w-5 h-5 ${ darkMode ? 'invert' : ''}`} />;
    };
    
    return (
        <div className="py-3 px-1">
            <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                    {getNotificationIconSVG()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {/* Display sensorType as the title of the card */}
                            {notification?.sensorType || "Log Entry"} 
                        </p>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {notification?.timeStamp || "No time available"}
                        </span>
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {notification?.message || "No message available"}
                    </p>
                </div>
            </div>
        </div>
    
    )}

export default Notification_card;