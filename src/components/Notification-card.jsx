import temperatureIcon from '../assets/solar--temperature-bold.svg';
import { useDarkMode } from '../context/DarkModeContext';

function Notification_card({notification}) {
    const { darkMode } = useDarkMode();
    
    return (
    <div className={`border rounded-xl p-2 w-full flex flex-col z-51 mb-2 ${darkMode ? 'darkMode border-gray-600 bg-black' : 'border-gray-400 bg-white'}`}>
        <div className="flex justify_start">
            <img src={temperatureIcon} alt="temperature icon" width="23" height="2" className={`${darkMode ? 'filter invert' : ''}`} />
                <div className='text-left pl-2'>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-black'}`}>{notification?.type || "No type available"}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification?.message || "No message available"}</p>
                </div>
        </div>
        <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{notification?.timeStamp || "No time available"}</div>
    </div>
    
    )}

export default Notification_card;

