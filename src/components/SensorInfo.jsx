import { useDarkMode } from '../context/DarkModeContext';
import infoIcon from '../assets/material-symbols--info-outline-rounded.svg';

function SensorInfo ({ lastMeasurementValue, idealValue, unit, sensorName, sensorKey }) {
    const { darkMode } = useDarkMode();

    const currentDate = new Date().toLocaleString();

    let deviationPercentage = 0;
    let deviationText = "N/A";

    if (lastMeasurementValue !== null && lastMeasurementValue !== undefined && lastMeasurementValue !== 'N/A' &&
        idealValue !== null && idealValue !== undefined && idealValue !== 'N/A') {
        
        const currentVal = Number(lastMeasurementValue);
        const idealVal = Number(idealValue);

        if (idealVal === 0) {
            deviationPercentage = currentVal === 0 ? 0 : (currentVal > 0 ? 100 : -100);
        } else {
            deviationPercentage = ((currentVal - idealVal) / Math.abs(idealVal)) * 100;
        }
        deviationText = `${deviationPercentage.toFixed(1)}%`;
    }

    let recommendedAction = "Review sensor readings or check connection.";
    const deviationThreshold = 10; // Example: 10% deviation triggers a specific action

    if (lastMeasurementValue !== null && lastMeasurementValue !== undefined && lastMeasurementValue !== 'N/A') {
        if (Math.abs(deviationPercentage) <= deviationThreshold) {
            recommendedAction = "Conditions are near optimal.";
        } else {
            switch (sensorKey) {
                case 'temperature':
                    recommendedAction = deviationPercentage > 0 ? "Cool the greenhouse" : "Warm the greenhouse";
                    break;
                case 'humidity':
                    recommendedAction = deviationPercentage > 0 ? "Reduce humidity" : "Increase humidity";
                    break;
                case 'light':
                    // Light recommendations can be complex (e.g., duration vs. intensity)
                    // Simple example:
                    recommendedAction = deviationPercentage > 0 ? "Monitor light levels (may be high)" : "Increase light exposure";
                    break;
                case 'soilMoisture':
                    recommendedAction = deviationPercentage > 0 ? "Allow soil to dry (may be too moist)" : "Water the plants";
                    break;
                default:
                    recommendedAction = "Consult guidelines for this sensor.";
            }
        }
    }


    const displayValue = (lastMeasurementValue !== null && lastMeasurementValue !== undefined && lastMeasurementValue !== 'N/A')
        ? `${Number(lastMeasurementValue).toFixed(1)}${unit || ''}`
        : 'N/A';

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-row h-full p-3 gap-3 items-start border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <img src={infoIcon} alt="logo" className={`w-7 max-w-xs h-10 ${darkMode ? 'filter invert' : ''}`} />
                    <div className='flex flex-col'>
                        <p className='font-bold'>{currentDate}</p>
                        <p>{sensorName || 'Sensor'}: {displayValue}</p>
                        <p>Current deviation: {deviationText}</p>
                        <p>Recommended action: {recommendedAction}</p>
                    </div>
                </div>
            </div>
        </div>
                
    )
}
export default SensorInfo;