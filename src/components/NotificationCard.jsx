import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import notificationIcon from '../assets/notification-icon.svg';
import { useDarkMode } from '../context/DarkModeContext';

function NotificationCard({ notification }) {
    const { darkMode } = useDarkMode();

    // Determine the importance tier of the notification
    const getImportanceTier = () => {
        const type = notification?.type?.toLowerCase();
        const message = notification?.message;

        if (type && type.includes('watering')) {
            return "Info";
        }

        if (!message) {
            return "Info"; // Default to "Info"
        }

        // Regex to find a number followed by '%' or 'Celcius' (case-insensitive)
        // It captures the number part.
        const deviationRegex = /(\d+(\.\d+)?)\s*(%|Celcius)/i;
        const match = message.match(deviationRegex);

        if (match && match[1]) {
            const deviationPercentage = parseFloat(match[1]);

            if (deviationPercentage < 5) {
                return "Info";
            } else if (deviationPercentage >= 5 && deviationPercentage < 10) {
                return "Caution";
            } else if (deviationPercentage >= 10) {
                return "DANGER";
            }
        }

        // Fallback if no parsable deviation is found in the message
        return "Info";
    };

    // Get the notification icon based on the type
    const getNotificationIconSVG = () => {
        const type = notification?.type?.toLowerCase();

        if (!type) {
             return <img src={notificationIcon} alt="Notification" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }

        if (type.includes('temperature')) {
            return <img src={temperatureIcon} alt="Temperature" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('humidity')) {
            return <img src={humidityIcon} alt="Humidity" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('soil') || type.includes('moisture')) {
            return <img src={soilMoistureIcon} alt="Soil Moisture" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('watering')) {
            return <img src={waterLevelIcon} alt="Water Level" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }
        if (type.includes('light')) {
            return <img src={lightIntensityIcon} alt="Light Intensity" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
        }

        // Default notification icon
        return <img src={notificationIcon} alt="Notification" className={`w-5 h-5 ${darkMode ? 'invert' : ''}`} />;
    };

    // Format the timestamp to YYYY-MM-DD
    const formattedDate = notification?.timeStamp?.split('T')[0] || "No date available";
    const importanceTier = getImportanceTier();

    return (
        <div className="py-3 px-1">
            <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                    {getNotificationIconSVG()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between">
                        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {`[${importanceTier}] ${notification?.type || "No type available"} Caution`}
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {notification?.message || "No message available"}
                    </p>
                    <span className="text-xs text-gray-500 mt-1">
                        {formattedDate}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default NotificationCard;