import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import { useDarkMode } from '../context/DarkModeContext';

function Sensor_card({ lightSensorData, temperatureSensorData, humiditySensorData, soilMoistureSensorData,
    lightSensorDataAverageToday, temperatureSensorDataAverageToday, humiditySensorDataAverageToday, soilMoistureSensorDataAverageToday,
    lightSensorDataAverageYesterday, temperatureSensorDataAverageYesterday, humiditySensorDataAverageYesterday, soilMoistureSensorDataAverageYesterday }) {
    
    const { darkMode } = useDarkMode();

    const formatComparisonText = (todayData, yesterdayData, unit, precision = 1) => {
        if (todayData && typeof todayData.value === 'number' &&
            yesterdayData && typeof yesterdayData.value === 'number') {
            
            const diff = todayData.value - yesterdayData.value;
            const displayDiffString = diff.toFixed(precision);
            const sign = diff > 0 ? '+' : '';
            return `${sign}${displayDiffString}${unit} from yesterday`;
        }
        return 'No comparison data';
    };

    return (
        <div className="flex flex-row justify-evenly">
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Temperature</p>
                        <img src={temperatureIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="temperature icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>
                        {temperatureSensorData && typeof temperatureSensorData.value === 'number' ? `${temperatureSensorData.value.toFixed(1)}°C` : 'N/A'}
                    </p>
                    <p className='Manrope text-xs text-gray-400'>
                        {formatComparisonText(temperatureSensorDataAverageToday, temperatureSensorDataAverageYesterday, '°C', 1)}
                    </p>
                </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Humidity</p>
                        <img src={humidityIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="humidity icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>
                        {humiditySensorData && typeof humiditySensorData.value === 'number' ? `${humiditySensorData.value.toFixed(1)}%` : 'N/A'}
                    </p>
                    <p className='Manrope text-xs text-gray-400'>
                        {formatComparisonText(humiditySensorDataAverageToday, humiditySensorDataAverageYesterday, '%', 1)}
                    </p>
                </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Soil Moisture</p>
                        <img src={soilMoistureIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="soil moisture icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>
                        {soilMoistureSensorData && typeof soilMoistureSensorData.value === 'number' ? `${soilMoistureSensorData.value.toFixed(1)}%` : 'N/A'}
                    </p>
                    <p className='Manrope text-xs text-gray-400'>
                        {formatComparisonText(soilMoistureSensorDataAverageToday, soilMoistureSensorDataAverageYesterday, '%', 1)}
                    </p>
                </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Water Level</p>
                        <img src={waterLevelIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="water level icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>88%</p>
                    <p className='Manrope text-xs text-gray-400'>Last watered 6 h ago</p>
                </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Light intensity</p>
                        <img src={lightIntensityIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="light intensity icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>
                        {lightSensorData && typeof lightSensorData.value === 'number' ? `${lightSensorData.value.toFixed(0)} lux` : 'N/A'}
                    </p>
                    <p className='Manrope text-xs text-gray-400'>
                        {formatComparisonText(lightSensorDataAverageToday, lightSensorDataAverageYesterday, 'lux', 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}
export default Sensor_card;