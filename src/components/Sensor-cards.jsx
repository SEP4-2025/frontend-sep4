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

    const formatComparisonText = (currentData, yesterdayData, unit, precision = 1) => {
        if (currentData && typeof currentData.value === 'number' &&
            yesterdayData && typeof yesterdayData.value === 'number') {
            
            const diff = currentData.value - yesterdayData.value;
            const displayDiffString = diff.toFixed(precision);
            const sign = diff > 0 ? '+' : '';
            return `${sign}${displayDiffString}${unit} from yesterday`;
        }
        return 'No comparison data';
    };

    // Using imported icon assets instead of SVG paths
    const TemperatureIcon = () => (
        <img src={temperatureIcon} alt="Temperature" className="w-6 h-6" />
    );
    
    const HumidityIcon = () => (
        <img src={humidityIcon} alt="Humidity" className="w-6 h-6" />
    );
    
    const SoilMoistureIcon = () => (
        <img src={soilMoistureIcon} alt="Soil Moisture" className="w-6 h-6" />
    );
    
    const WaterLevelIcon = () => (
        <img src={waterLevelIcon} alt="Water Level" className="w-6 h-6" />
    );
    
    const LightIntensityIcon = () => (
        <img src={lightIntensityIcon} alt="Light Intensity" className="w-6 h-6" />
    );

    return (
        <div className="grid grid-cols-5 gap-4 mb-1">
            {/* Temperature Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500">Temperature</h3>
                    <TemperatureIcon />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        {temperatureSensorData && typeof temperatureSensorData.value === 'number' ? 
                            `${temperatureSensorData.value.toFixed(1)}°C` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatComparisonText(temperatureSensorData, temperatureSensorDataAverageYesterday, '°C', 1)}
                    </span>
                </div>
            </div>
            
            {/* Humidity Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500">Humidity</h3>
                    <HumidityIcon />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        {humiditySensorData && typeof humiditySensorData.value === 'number' ? 
                            `${humiditySensorData.value.toFixed(1)}%` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatComparisonText(humiditySensorData, humiditySensorDataAverageYesterday, '%', 1)}
                    </span>
                </div>
            </div>
            
            {/* Soil Moisture Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500">Soil Moisture</h3>
                    <SoilMoistureIcon />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        {soilMoistureSensorData && typeof soilMoistureSensorData.value === 'number' ? 
                            `${soilMoistureSensorData.value.toFixed(1)}%` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatComparisonText(soilMoistureSensorData, soilMoistureSensorDataAverageYesterday, '%', 1)}
                    </span>
                </div>
            </div>
            
            {/* Water Level Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500">Water Level</h3>
                    <WaterLevelIcon />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">88%</span>
                    <span className="text-xs text-gray-500">Last watered 6 h ago</span>
                </div>
            </div>
            
            {/* Light Intensity Card */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500">Light Intensity</h3>
                    <LightIntensityIcon />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-bold">
                        {lightSensorData && typeof lightSensorData.value === 'number' ? 
                            `${lightSensorData.value.toFixed(0)} lux` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatComparisonText(lightSensorData, lightSensorDataAverageYesterday, ' lux', 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}
export default Sensor_card;