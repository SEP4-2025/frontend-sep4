import React, { useState, useEffect } from 'react';
import LogCard from './LogCard.jsx';
import filterArrow from '../assets/filterArrow.png';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import { useMobileDetection } from '../utils/useMobileDetection.js'; // Import the hook

function LogPopup({ isOpen, onClose, title, description, logs }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { darkMode } = useDarkMode();
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const isMobile = useMobileDetection(); // Use the hook

    useEffect(() => {
        let result = Array.isArray(logs) ? [...logs] : [];

        if (selectedFilter) {
            if (selectedFilter.toLowerCase() === "watering") {
                result = result.filter(log => {
                    const hasWaterPumpId = log.waterPumpId != null; 
                    const hasNoSensorReadingId = log.sensorReadingId === null || typeof log.sensorReadingId === 'undefined';
                    const isWateringLog = hasWaterPumpId && hasNoSensorReadingId;
                    
                    return isWateringLog;
                });
            } else {
                result = result.filter(log => {
                    const hasSensorType = log.sensorType !== null && typeof log.sensorType !== 'undefined';
                    return hasSensorType && log.sensorType.toLowerCase() === selectedFilter.toLowerCase();
                });
            }
        }
        setFilteredLogs(result);
    }, [logs, selectedFilter]);

    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterSelection = (filter) => {
        setSelectedFilter(filter);
        setIsFilterOpen(false);
    };

    const filterOptions = ["Temperature", "Humidity", "Light", "Soil Moisture", "Watering"];

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
            <div
                className={`relative border-1 rounded-xl flex flex-col overflow-hidden ${
                    darkMode ? 'border-gray-600 bg-black' : 'bg-white border-gray-500'
                }`}
                style={{
                    width: isMobile ? '90%' : '80%',
                    height: isMobile ? '85%' : '60%',
                }}
            >
                {/* Header */}
                <div className="p-4">
                    <div className={`flex flex-col ${isMobile ? 'items-center' : 'justify-between items-center lg:flex-row'}`}>
                        {/* Title */}
                        <h1 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-black'} mb-2 lg:mb-0`}>
                            {isMobile ? "Logs" : (title || "Log History")}
                        </h1>

                        {/* Filter Button */}
                        <div className={`relative ${isMobile ? 'self-end mt-2' : ''}`}>
                            <button
                                className={`px-4 py-2 rounded-md focus:outline-none border cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                                onClick={toggleFilterMenu}
                            >
                                <div className="flex items-center">
                                    <p>{selectedFilter ? selectedFilter : "All Types"}</p>
                                    <img
                                        src={filterArrow}
                                        className={`w-5 h-5 ml-2 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''} ${darkMode ? 'filter invert' : ''}`}
                                        alt="Filter Arrow"
                                    />
                                </div>
                            </button>

                            {/* Filter Menu */}
                            {isFilterOpen && (
                                <div className={`absolute top-full right-0 mt-1 border rounded-md w-48 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} z-10`}>
                                    <ul className="py-1">
                                        <li
                                            className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                            onClick={() => handleFilterSelection(null)}
                                        >
                                            All Types
                                        </li>
                                        {filterOptions.map(option => (
                                            <li
                                                key={option}
                                                className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handleFilterSelection(option)}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Description - Hidden on mobile */}
                    {!isMobile && (
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-400'} mt-2`}>
                            {description || "Detailed log entries."}
                        </p>
                    )}
                </div>


                {/* Logs List */}
                <div className="flex-1 overflow-y-auto px-4">
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                            <LogCard key={log.id || index} log={log} />
                        ))
                    ) : (
                        <p className="text-center py-4">No logs available for the selected filter.</p>
                    )}
                </div>

                {/* Footer with Close Button */}
                <div className="p-4 border-t border-gray-300 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className={`w-full px-4 py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogPopup;