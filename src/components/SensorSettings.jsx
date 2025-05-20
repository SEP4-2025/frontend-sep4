import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { updateSensorThreshold } from '../api/index.js'; // Import the API function

// SensorSettings now accepts props to know which sensor is selected
function SensorSettings ({ selectedSensorKey, sensorConfig, onThresholdUpdate }) {
    const { darkMode } = useDarkMode();
    const [thresholdValue, setThresholdValue] = useState('');
    const [popupMessage, setPopupMessage] = useState({ text: '', type: '' }); // type can be 'success' or 'error'

    // Effect to clear input and message when selected sensor changes
    useEffect(() => {
        setThresholdValue(''); // Clear input when sensor changes
        setPopupMessage({ text: '', type: '' }); // Clear popup message
    }, [selectedSensorKey]);

    const handleInputChange = (event) => {
        setThresholdValue(event.target.value);
        // Popup will not clear on input change, it will persist until next update or sensor change
    };

    const displayPopup = (message, type) => {
        setPopupMessage({ text: message, type: type });
        // Popup will not disappear automatically
    };

    const handleUpdate = async () => {
        if (!selectedSensorKey || !sensorConfig || !sensorConfig[selectedSensorKey]) {
            displayPopup('No sensor selected or configuration missing.', 'error');
            return;
        }

        const currentSensorApiType = sensorConfig[selectedSensorKey].apiType;
        const valueAsInt = parseInt(thresholdValue, 10);

        if (isNaN(valueAsInt) || thresholdValue.trim() === '' || !Number.isInteger(Number(thresholdValue))) {
            displayPopup('Invalid input. Please enter a whole number.', 'error');
            return;
        }

        try {
            await updateSensorThreshold(currentSensorApiType, valueAsInt);
            displayPopup(`Threshold for ${sensorConfig[selectedSensorKey].name} updated successfully to ${valueAsInt}.`, 'success');
            if (onThresholdUpdate) onThresholdUpdate(); // Trigger the callback
        } catch (error) {
            console.error("Failed to update sensor threshold:", error);
            displayPopup(`Error updating threshold: ${error.message || 'Unknown error'}`, 'error');
        }
    };

    const getButtonClasses = () => {
        let baseClasses = `rounded-lg p-2 mt-4 text-white w-full`;
        if (darkMode) {
            return `${baseClasses} bg-slate-800 hover:bg-slate-700`;
        }
        return `${baseClasses} bg-gray-600 hover:bg-gray-700`;
    };
    
    const getPopupClasses = () => {
        if (!popupMessage.text) return 'hidden';
        let baseClasses = 'p-2 mt-2 mb-2 text-sm rounded-md text-center';
        if (popupMessage.type === 'success') {
            // Adjusted success colors
            return `${baseClasses} ${darkMode ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`;
        }
        if (popupMessage.type === 'error') {
            // Adjusted error colors
            return `${baseClasses} ${darkMode ? 'bg-rose-800 text-rose-200' : 'bg-rose-100 text-rose-700'}`;
        }
        return 'hidden';
    };


    return (
        <div className="w-full">
            <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`} data-testid="sensor-settings-container">
                <div className="p-6">
                    <h2 className="font-bold text-xl mb-4">Threshold Settings</h2>
                    <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                        <div className="mb-4">
                            <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`} data-testid="sensor-name-label">
                                {sensorConfig && selectedSensorKey && sensorConfig[selectedSensorKey] ? sensorConfig[selectedSensorKey].name : 'Sensor'} Threshold
                            </p>
                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Set the minimum value for triggering notifications ({sensorConfig && selectedSensorKey && sensorConfig[selectedSensorKey] ? sensorConfig[selectedSensorKey].unit : ''})
                            </p>
                            
                            <input
                                type="text"
                                placeholder="Enter threshold value"
                                value={thresholdValue}
                                onChange={handleInputChange}
                                className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-700 text-white border-slate-500' : 'bg-white text-gray-800 border-gray-300'}`}
                            />
                        </div>
                        
                        {/* Popup Message Area */}
                        {popupMessage.text && (
                            <div className={getPopupClasses()}>
                                {popupMessage.text}
                            </div>
                        )}

                        <button
                            onClick={handleUpdate}
                            className={`w-full rounded-lg py-2.5 px-4 text-white font-medium transition-colors ${!selectedSensorKey ? 'bg-gray-400 cursor-not-allowed' : (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700')}`}
                            disabled={!selectedSensorKey}
                        >
                            Update Threshold
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SensorSettings;