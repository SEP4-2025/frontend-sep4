import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import waterLevelIcon from '../assets/hugeicons--humidity.svg'; // Assuming this is the correct icon for water level
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';
import { useDarkMode } from '../context/DarkModeContext';
import React from 'react';

function SensorCard({ 
    lightSensorData, temperatureSensorData, humiditySensorData, soilMoistureSensorData, waterLevelCardData, // Added waterLevelCardData
    lightSensorDataAverageToday, temperatureSensorDataAverageToday, humiditySensorDataAverageToday, soilMoistureSensorDataAverageToday,
    lightSensorDataAverageYesterday, temperatureSensorDataAverageYesterday, humiditySensorDataAverageYesterday, soilMoistureSensorDataAverageYesterday 
}) {
    
    const { darkMode } = useDarkMode();

    const formatComparisonText = (todayData, yesterdayData, unit, precision = 1) => {
        if (todayData && typeof todayData.value === 'number' &&
            yesterdayData && typeof yesterdayData.value === 'number') {
            
            const diff = todayData.value - yesterdayData.value;
            // Ensure diff is a number before calling toFixed
            if (isNaN(diff)) return 'Comparison error';
            const displayDiffString = diff.toFixed(precision);
            const sign = diff > 0 ? '+' : '';
            return `${sign}${displayDiffString}${unit} from yesterday`;
        }
        return 'No comparison data';
    };

    const TemperatureIcon = () => (
        <img src={temperatureIcon} alt="Temperature" className={`w-6 h-6 ${ darkMode ? 'invert' : ''}`} />
    );
    
    const HumidityIcon = () => (
        <img src={humidityIcon} alt="Humidity" className={`w-6 h-6 ${ darkMode ? 'invert' : ''}`}/>
    );
    
    const SoilMoistureIcon = () => (
        <img src={soilMoistureIcon} alt="Soil Moisture" className={`w-6 h-6 ${ darkMode ? 'invert' : ''}`} />
    );
    
    const WaterLevelIcon = () => (
        <img src={waterLevelIcon} alt="Water Level" className={`w-6 h-6 ${ darkMode ? 'invert' : ''}`} />
    );
    
    const LightIntensityIcon = () => (
        <img src={lightIntensityIcon} alt="Light Intensity" className={`w-6 h-6 ${ darkMode ? 'invert' : ''}`} />
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-1">
            {/* Temperature Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`} data-testid="temperature-card">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</h3>
                    <TemperatureIcon />
                </div>
                <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {temperatureSensorData && typeof temperatureSensorData.value === 'number' ? 
                            `${temperatureSensorData.value.toFixed(1)}°C` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatComparisonText(temperatureSensorDataAverageToday, temperatureSensorDataAverageYesterday, '°C', 1)}
                    </span>
                </div>
            </div>
            
            {/* Humidity Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`} data-testid="humidity-card">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Humidity</h3>
                    <HumidityIcon />
                </div>
                <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {humiditySensorData && typeof humiditySensorData.value === 'number' ? 
                            `${humiditySensorData.value.toFixed(1)}%` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatComparisonText(humiditySensorDataAverageToday, humiditySensorDataAverageYesterday, '%', 1)}
                    </span>
                </div>
            </div>
            
            {/* Soil Moisture Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`} data-testid="soil-moisture-card">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Soil Moisture</h3>
                    <SoilMoistureIcon />
                </div>
                <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {soilMoistureSensorData && typeof soilMoistureSensorData.value === 'number' ? 
                            `${soilMoistureSensorData.value.toFixed(1)}%` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatComparisonText(soilMoistureSensorDataAverageToday, soilMoistureSensorDataAverageYesterday, '%', 1)}
                    </span>
                </div>
            </div>
            
            {/* Light Intensity Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`} data-testid="light-intensity-card">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Light Intensity</h3>
                    <LightIntensityIcon />
                </div>
                <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {lightSensorData && typeof lightSensorData.value === 'number' ? 
                            `${lightSensorData.value.toFixed(0)} lux` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatComparisonText(lightSensorDataAverageToday, lightSensorDataAverageYesterday, ' lux', 0)}
                    </span>
                </div>
            </div>

            {/* Water Level Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm col-span-2 md:col-span-1`} data-testid="water-level-card">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Water Level</h3>
                    <WaterLevelIcon />
                </div>
                <div className="flex flex-col">
                    <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {waterLevelCardData && typeof waterLevelCardData.value === 'number' ? 
                            `${waterLevelCardData.value.toFixed(0)}%` 
                            : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {waterLevelCardData && typeof waterLevelCardData.currentLevelMl === 'number' && typeof waterLevelCardData.capacityMl === 'number' ?
                            `${waterLevelCardData.currentLevelMl}ml / ${waterLevelCardData.capacityMl}ml`
                            : 'Details unavailable'}
                        {/* Comparison data for water level is not yet implemented in dataCompiler
                            If it were, it would look like:
                            formatComparisonText(waterLevelAverageToday, waterLevelAverageYesterday, '%', 0) 
                        */}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default SensorCard;