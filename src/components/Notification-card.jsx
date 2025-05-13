import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import notificationIcon from '../assets/notification-icon.svg';
import { useDarkMode } from '../context/DarkModeContext';

function Notification_card({notification}) {
    const { darkMode } = useDarkMode();

    // Helper function to get the notification icon based on the type
    const getNotificationIcon = () => {
        const type = notification?.type.toLowerCase();

        if (type.includes('temperature')) return temperatureIcon;
        if (type.includes('humidity')) return humidityIcon;
        if (type.includes('soil')) return soilMoistureIcon;
        if (type.includes('moisture')) return soilMoistureIcon;
        if (type.includes('watering')) return waterLevelIcon;
        if (type.includes('light')) return lightIntensityIcon;

        return notificationIcon; // Default icon 
    }
    
    return (
    <div className={`border rounded-xl p-2 w-full flex flex-col z-51 mb-2 ${darkMode ? 'darkMode border-gray-600 bg-black' : 'border-gray-400 bg-white'}`}>
        <div className="flex justify_start">
            <img src={getNotificationIcon()} alt="notification icon" width="23" height="2" className={`${darkMode ? 'filter invert' : ''}`} />
                <div className='text-left pl-2'>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-black'}`}>{notification?.type || "No type available"}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification?.message || "No message available"}</p>
                </div>
        </div>
        <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{notification?.timeStamp || "No time available"}</div>
    </div>
    
    )}

export default Notification_card;

