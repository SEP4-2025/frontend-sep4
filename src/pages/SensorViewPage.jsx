import { useDarkMode } from '../context/DarkModeContext';
import SensorViewGraph from '../components/SensorViewGraph';
import TemperatureSensorLog from '../components/TemperatureSensorLog';
import SensorSettings from '../components/SensorSettings';
import SensorInfo from '../components/SensorInfo';
import SensorIcon from '../assets/material-symbols--nest-remote-comfort-sensor-outline-rounded.svg';


function SensorViewPage () {
    const { darkMode } = useDarkMode();

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`flex flex-row gap-4 p-6`}>
                <img src={SensorIcon} alt="logo" className={`w-10 max-w-xs h-10 ${darkMode ? 'filter invert' : ''}`} />
                <h1 className='Jacques-Francois text-5xl'>Sensor view</h1>
            </div>
            <div className='flex flex-row'>
                <div className='flex flex-col w-2/3 p-5 gap-5'>
                    <SensorViewGraph/>
                    <SensorInfo/>
                </div>
                <div className='flex flex-col w-1/3 p-5 gap-5'>
                    <TemperatureSensorLog/>
                    <SensorSettings/>
                </div>
            </div>
        </div>
    )
}
export default SensorViewPage;