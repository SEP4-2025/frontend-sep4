import { useDarkMode } from '../context/DarkModeContext';
import infoIcon from '../assets/material-symbols--info-outline-rounded.svg';
import React from 'react';

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
    const deviationThreshold = 10; 

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
        <div className="w-full">
            <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="p-6">
                    <h2 className="font-bold text-xl mb-4">Current Status</h2>
                    <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                        <div className="flex items-start gap-3">
                            <div className="text-info-500 mt-1">
                                <img src={infoIcon} alt="Info" className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {currentDate}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {sensorName || 'Sensor'}: {displayValue}
                                    </p>
                                    
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Current deviation: {deviationText}
                                    </p>
                                    
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Recommended action: {recommendedAction}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SensorInfo;