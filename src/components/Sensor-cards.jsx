import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';
import soilMoistureIcon from '../assets/soil-moisture-icon.svg';

function Sensor_card({ lightSensorData, temperatureSensorData, humiditySensorData, soilMoistureSensorData,
    lightSensorDataAverageToday, temperatureSensorDataAverageToday, humiditySensorDataAverageToday, soilMoistureSensorDataAverageToday,
    lightSensorDataAverageYesterday, temperatureSensorDataAverageYesterday, humiditySensorDataAverageYesterday, soilMoistureSensorDataAverageYesterday }) {

    return (
        <div className='flex flex-row justify-evenly '>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/6'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Temperature</p>
                    <img src={temperatureIcon} className="ml-auto" alt="temperature icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{temperatureSensorData.value.toFixed(1)}°C</p>
                <p className='Manrope text-xs text-gray-400'>
                    {temperatureSensorDataAverageToday && temperatureSensorDataAverageYesterday ?
                        `${(temperatureSensorDataAverageToday > temperatureSensorDataAverageYesterday ? '+' : '-')}${(temperatureSensorDataAverageToday - temperatureSensorDataAverageYesterday).toFixed(1)}°C from yesterday` :
                        'No comparison data'}
                </p>
            </div >
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/6'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Humidity</p>
                    <img src={humidityIcon} className="ml-auto" alt="humidity icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{humiditySensorData.value.toFixed(1)}%</p>
                <p className='Manrope text-xs text-gray-400'>
                    {humiditySensorDataAverageToday && humiditySensorDataAverageYesterday ?
                        `${(humiditySensorDataAverageToday > humiditySensorDataAverageYesterday ? '+' : '-')}${(humiditySensorDataAverageToday - humiditySensorDataAverageYesterday).toFixed(1)}% from yesterday` :
                        'No comparison data'}
                </p>
            </div>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/6'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Soil Moisture</p>
                    <img src={soilMoistureIcon} className="ml-auto" alt="soil moisture icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{soilMoistureSensorData.value.toFixed(1)}%</p>
                <p className='Manrope text-xs text-gray-400'>
                    {soilMoistureSensorDataAverageToday && soilMoistureSensorDataAverageYesterday ?
                        `${(soilMoistureSensorDataAverageToday > soilMoistureSensorDataAverageYesterday ? '+' : '-')}${(soilMoistureSensorDataAverageToday- soilMoistureSensorDataAverageYesterday).toFixed(1)}% from yesterday` :
                        'No comparison data'}
                </p>
            </div>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/6'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Water Level</p>
                    <img src={waterLevelIcon} className="ml-auto" alt="water level icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>88%</p>
                <p className='Manrope text-xs text-gray-400'>Last watered 6 h ago</p>
            </div>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/6'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Light intensity</p>
                    <img src={lightIntensityIcon} className="ml-auto" alt="light intensity icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{lightSensorData.value.toFixed(0)} lux</p>
                <p className='Manrope text-xs text-gray-400'>
                    {lightSensorDataAverageToday && lightSensorDataAverageYesterday ?
                        `${(lightSensorDataAverageToday > lightSensorDataAverageYesterday ? '+' : '-')}${(lightSensorDataAverageToday- lightSensorDataAverageYesterday).toFixed(0)}lux from yesterday` :
                        'No comparison data'}
                </p>
            </div>
        </div>
    );
}
export default Sensor_card;