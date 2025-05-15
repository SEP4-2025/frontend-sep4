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
            const sign = diff > 0 ? '+' : ''; // Handles positive, negative will show its own sign
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

    // Updated grid classes: mobile will be 2 columns, sm also 2, md 3, lg 5.
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-1">
            {/* Temperature Card (1st item) */}
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
                        {formatComparisonText(temperatureSensorDataAverageToday, temperatureSensorDataAverageYesterday, '°C', 1)}
                    </span>
                </div>
            </div>
            
            {/* Humidity Card (2nd item) */}
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
                        {formatComparisonText(humiditySensorDataAverageToday, humiditySensorDataAverageYesterday, '%', 1)}
                    </span>
                </div>
            </div>
            
            {/* Soil Moisture Card (3rd item) */}
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
                        {formatComparisonText(soilMoistureSensorDataAverageToday, soilMoistureSensorDataAverageYesterday, '%', 1)}
                    </span>
                </div>
            </div>
            
            {/* Light Intensity Card (4th item) - Moved before Water Level */}
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
                        {formatComparisonText(lightSensorDataAverageToday, lightSensorDataAverageYesterday, ' lux', 0)}
                    </span>
                </div>
            </div>

            {/* Water Level Card (5th item) - Will span full width on mobile and sm screens */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-white'} shadow-sm col-span-2 md:col-span-1`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-500">Water Level</h3>
                    <WaterLevelIcon />
                </div>
                <div className="flex flex-col">
                    {/* Assuming waterLevelSensorData is not available, using placeholder */}
                    <span className="text-3xl font-bold">N/A</span> 
                    <span className="text-xs text-gray-500">Data unavailable</span>
                    {/* If you have waterLevelSensorData, use it like other sensors:
                    <span className="text-3xl font-bold">
                        {waterLevelSensorData && typeof waterLevelSensorData.value === 'number' ? 
                            `${waterLevelSensorData.value.toFixed(1)}%` : 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {formatComparisonText(waterLevelSensorDataAverageToday, waterLevelSensorDataAverageYesterday, '%', 1)}
                    </span>
                    */}
                </div>
            </div>
        </div>
    );
}
export default Sensor_card;