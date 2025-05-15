import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { updateSensorThreshold } from '../api/index.js'; // Import the API function

// SensorSettings now accepts props to know which sensor is selected
function SensorSettings ({ selectedSensorKey, sensorConfig }) {
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
            // Optionally, you might want to clear the input or re-fetch data in the parent component
            // setThresholdValue(''); // Clear input on success
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
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <p className='Manrope font-bold text-center text-lg mb-3'>
                        Update Threshold for: {sensorConfig && selectedSensorKey && sensorConfig[selectedSensorKey] ? sensorConfig[selectedSensorKey].name : 'Sensor'}
                    </p>
                    <div className='mb-3'> {/* Reduced mb-5 to mb-3 */}
                        <p className='mb-2'>New Threshold Value ({sensorConfig && selectedSensorKey && sensorConfig[selectedSensorKey] ? sensorConfig[selectedSensorKey].unit : ''})</p>
                        <input
                            type="text" // Changed to text to allow for easier validation before parseInt
                            placeholder="Enter new threshold"
                            value={thresholdValue}
                            onChange={handleInputChange}
                            className={`border rounded-md p-2 focus:outline-none w-full ${darkMode ? 'bg-slate-500 border-gray-600 text-white placeholder-gray-300 focus:ring-2 focus:ring-green-400' : 'border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-green-500'}`}
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
                        className={getButtonClasses()}
                        disabled={!selectedSensorKey} // Disable button if no sensor is selected
                    >
                        Update Threshold
                    </button>
                </div>
            </div>
        </div>
    );
}
export default SensorSettings;