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

    return (
        <div className="flex flex-row justify-evenly">
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Temperature</p>
                        <img src={temperatureIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="temperature icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>{temperatureSensorData.value.toFixed(1)}°C</p>
                    <p className='Manrope text-xs text-gray-400'>
                        {temperatureSensorDataAverageToday && temperatureSensorDataAverageYesterday ?
                            `${(temperatureSensorDataAverageToday > temperatureSensorDataAverageYesterday ? '+' : '-')}${(temperatureSensorDataAverageToday - temperatureSensorDataAverageYesterday).toFixed(1)}°C from yesterday` :
                            'No comparison data'}
                    </p>
                </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Humidity</p>
                        <img src={humidityIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="humidity icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>{humiditySensorData.value.toFixed(1)}%</p>
                    <p className='Manrope text-xs text-gray-400'>
                        {humiditySensorDataAverageToday && humiditySensorDataAverageYesterday ?
                            `${(humiditySensorDataAverageToday > humiditySensorDataAverageYesterday ? '+' : '-')}${(humiditySensorDataAverageToday - humiditySensorDataAverageYesterday).toFixed(1)}% from yesterday` :
                            'No comparison data'}
                    </p>
                </div>
            </div>
            
            <div className={`rounded-lg p-4 shadow-md w-1/6 ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`flex flex-col h-full p-2 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <div className='flex flex-row'>
                        <p className={`Manrope text-xl ${darkMode ? 'text-gray-100' : ''}`}>Soil Moisture</p>
                        <img src={soilMoistureIcon} className={`ml-auto ${darkMode ? 'filter invert' : ''}`} alt="soil moisture icon" width="23" height="2" />
                    </div>
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>{soilMoistureSensorData.value.toFixed(1)}%</p>
                    <p className='Manrope text-xs text-gray-400'>
                        {soilMoistureSensorDataAverageToday && soilMoistureSensorDataAverageYesterday ?
                            `${(soilMoistureSensorDataAverageToday > soilMoistureSensorDataAverageYesterday ? '+' : '-')}${(soilMoistureSensorDataAverageToday- soilMoistureSensorDataAverageYesterday).toFixed(1)}% from yesterday` :
                            'No comparison data'}
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
                    <p className={`Manrope text-l font-bold ${darkMode ? 'text-gray-100' : ''}`}>{lightSensorData.value.toFixed(0)} lux</p>
                    <p className='Manrope text-xs text-gray-400'>
                        {lightSensorDataAverageToday && lightSensorDataAverageYesterday ?
                            `${(lightSensorDataAverageToday > lightSensorDataAverageYesterday ? '+' : '-')}${(lightSensorDataAverageToday- lightSensorDataAverageYesterday).toFixed(0)}lux from yesterday` :
                            'No comparison data'}
                    </p>
                </div>
            </div>
        </div>
    );
}
export default Sensor_card;