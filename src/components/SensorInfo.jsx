import { useDarkMode } from '../context/DarkModeContext';
import infoIcon from '../assets/material-symbols--info-outline-rounded.svg';

function SensorInfo (date, temp, currentDeviation, action) {
    const { darkMode } = useDarkMode();

    //dummy data
    date = "13/05/2025, 21:18";
    temp = 5;
    currentDeviation = -32;
    action = "Warm the greenhouse"

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-row h-full p-3 gap-3 items-start border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <img src={infoIcon} alt="logo" className={`w-7 max-w-xs h-10 ${darkMode ? 'filter invert' : ''}`} />
                    <div className='flex flex-col'>
                        <p className='font-bold'>{date}</p>
                        <p>Temp: {temp}ºC</p>
                        <p>Current deviation: {currentDeviation}%</p>
                        <p>Recomended action: {action}</p>
                    </div>
                </div>
            </div>
        </div>
                
    )
}
export default SensorInfo;