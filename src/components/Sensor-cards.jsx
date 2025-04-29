import temperatureIcon from '../assets/solar--temperature-bold.svg';
import humidityIcon from '../assets/carbon--humidity-alt.svg';
import waterLevelIcon from '../assets/hugeicons--humidity.svg';
import lightIntensityIcon from '../assets/entypo--light-up.svg';

function Sensor_card({overviewData}) {
    const getSensorData = (sensorType) => {
        if (!Array.isArray(overviewData)) {
            return {
                current: { value: 0 },
                difference: 0
            };
        }
        const sensor = overviewData.find(data => data.type === sensorType);
        return{
            current : sensor.current.value || 0,
            difference: sensor.history.length > 1
            ? sensor.current.value - sensor.history[1].value
            : 0
        };
    };
    const temperatureData = getSensorData('temperature');
    const humidityData = getSensorData('humidity');
    const lightIntensityData = getSensorData('lightIntensity');
    // we need to somehow get the water level data from the database, for now we will just use a dummy value
    return (
        <div className='flex flex-row justify-evenly '>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/5'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Temperature</p>
                    <img src={temperatureIcon} className="ml-auto" alt="temperature icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{temperatureData.current.value}°C</p>
                <p className='Manrope text-xs text-gray-400'>{temperatureData.difference} °C from yesterday</p>
            </div >
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/5'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Humidity</p>
                    <img src={humidityIcon} className="ml-auto" alt="humidity icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{humidityData.current.value}%</p>
                <p className='Manrope text-xs text-gray-400'>{humidityData.difference}% from yesterday</p>
            </div>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/5'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Water Level</p>
                    <img src={waterLevelIcon} className="ml-auto" alt="water level icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>88%</p>
                <p className='Manrope text-xs text-gray-400'>Last watered 6 h ago</p>
            </div>
            <div className='border-1 border-gray-500 rounded-xl pl-2 bg-navbar-color pb-2 pt-1 pr-1 w-1/5'>
                <div className='flex flex-row'>
                    <p className='Manrope text-xl'>Light intensity</p>
                    <img src={lightIntensityIcon} className="ml-auto" alt="light intensity icon" width="23" height="2" />
                </div>
                <p className='Manrope text-l font-bold'>{lightIntensityData.current.value}lux</p>
                <p className='Manrope text-xs text-gray-400'>{lightIntensityData.difference}lux from yesterday</p>
            </div>
        </div>
    );
}
export default Sensor_card;