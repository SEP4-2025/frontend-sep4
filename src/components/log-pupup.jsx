import React, { useState, useEffect } from 'react';
import LogCard from './Log-card.jsx';
import filterArrow from '../assets/filterArrow.png';
import { useDarkMode } from '../context/DarkModeContext';

function LogPopup({ isOpen, onClose, logs, title, description }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { darkMode } = useDarkMode();
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);

    useEffect(() => {
        let result = logs || [];

        if (selectedFilter) {
            result = result.filter(log => log.sensorType?.toLowerCase() === selectedFilter.toLowerCase());
        }
        // Logs are assumed to be pre-sorted by date from dataCompiler
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

    const filterOptions = ["Temperature", "Humidity", "Light", "Soil Moisture", "General"];

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 max-h-screen pl-[10%] z-50 ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
            <div className={`border-1 rounded-xl pl-2 pb-2 pt-1 pr-1 mx-auto w-4/5 h-3/5 p-2 m-15 flex flex-col overflow-hidden ${darkMode ? 'darkMode border-gray-600 bg-black' : 'bg-white border-gray-500 bg-navbar-color'}`}>
                <div className='flex flex-col p-2 gap-4'>
                    <div className='text-left'>
                        <h1 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-black'}`}>
                            {title || "Log History"}
                        </h1>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>
                            {description || "Detailed log entries."}
                        </p>
                    </div>
                    {/* filter button */}
                    <div className="flex justify-end w-full">
                        <div className="relative w-1/5">
                            <button
                                className={`w-full px-4 py-2 rounded-md focus:outline-none border cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                                onClick={toggleFilterMenu}>
                                <div className={`flex flex-row justify-between items-center w-full`}>
                                    <p className='Manrope'>{selectedFilter ? `${selectedFilter}` : "All Types"}</p>
                                    <img src={filterArrow} className={`w-5 h-5 transition-transform duration-750 ${isFilterOpen ? 'rotate-180' : ''}  ${darkMode ? 'filter invert' : ''}`} alt="filter arrow" />
                                </div>
                            </button>

                            {isFilterOpen && (
                                <div className={`absolute top-full right-0 mt-1 border rounded-md w-48 dropdown-animation z-10 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                                    <ul className="py-1 text-left cursor-pointer">
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
                </div>

                <div className={`flex-1 overflow-y-auto pr-2 max-h-[calc(60vh-120px)] ${darkMode ? 'text-gray-100' : 'text-black'}`}>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => (
                            // Assuming log objects have a unique 'id' or use index if not.
                            // For stability, if logs have unique IDs from backend, prefer log.id
                            <LogCard key={log.id || index} log={log} />
                        ))
                    ) : (
                        <p className="text-center py-4">No logs available for the selected filter.</p>
                    )}
                </div>
                <div className="text-center mt-auto pt-2 pb-2">
                    <button
                        className={`p-2 mt-2 rounded-md mx-auto underline cursor-pointer ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
                        onClick={() => {
                            onClose();
                            setIsFilterOpen(false); // Close filter menu on popup close
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogPopup;