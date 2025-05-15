import React, { useState, useMemo } from 'react';
import Notification_card from './Notification-card.jsx';
import filterArrow from '../assets/filterArrow.png';
import { useDarkMode } from '../context/DarkModeContext';

// Props are now: isOpen, onClose, title, description, notifications (compiled logs)
function Notification_pop_up({ isOpen, onClose, title, description, notifications }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { darkMode } = useDarkMode();
    const [activeFilter, setActiveFilter] = useState('All'); // Default filter

    // Ensure notifications is an array
    const logs = Array.isArray(notifications) ? notifications : [];

    const filterOptions = ['All', 'Temperature', 'Humidity', 'Light', 'Soil Moisture', 'General', 'Unknown'];

    const displayableLogs = useMemo(() => {
        if (activeFilter === 'All') {
            return logs;
        }
        return logs.filter(log => log.sensorType === activeFilter);
    }, [logs, activeFilter]);

    if (!isOpen) return null;

    const toggleFilterMenu = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setIsFilterOpen(false);
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 max-h-screen pl-[10%] z-50 ${darkMode ? 'bg-gray-900/50' : 'bg-black/50'}`}>
            <div className={`border-1 rounded-xl pl-2 pb-2 pt-1 pr-1 mx-auto w-4/5 h-3/5 p-2 m-15 flex flex-col overflow-hidden ${darkMode ? 'darkMode border-gray-600 bg-black' : 'bg-white border-gray-500 bg-navbar-color'}`}>
                <div className='flex flex-col p-2 gap-4'>
                    <div className='text-left'>
                        {/* Use title and description from props */}
                        <h1 className={`Manrope text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-black'}`}>
                            {title || "Notifications"} 
                        </h1>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>
                            {description || "Here you can see relevant entries."}
                        </p>
                    </div>
                    {/* filter button */}
                    <div className="flex justify-end w-full">
                        <div className="relative w-1/5 min-w-[150px]"> {/* Added min-width for better appearance */}
                            <button
                                className={`w-full px-4 py-2 rounded-md focus:outline-none border cursor-pointer ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                                onClick={toggleFilterMenu}>
                                <div className={`flex flex-row justify-between items-center w-full`}>
                                    <p className='Manrope'>{activeFilter}</p>
                                    <img src={filterArrow} className={`w-5 h-5 transition-transform duration-750 ${isFilterOpen ? 'rotate-180' : ''}  ${darkMode ? 'filter invert' : ''}`} alt="filter arrow" />
                                </div>
                            </button>

                            {/* Filter menu */}
                            {isFilterOpen && (
                                <div className={`absolute top-full right-0 mt-1 border rounded-md w-full dropdown-animation z-10 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                                    <ul className="py-1 text-left cursor-pointer max-h-60 overflow-y-auto">
                                        {filterOptions.map(filterOption => (
                                            <li
                                                key={filterOption}
                                                className={`px-4 py-2 cursor-pointer ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handleFilterChange(filterOption)}
                                            >
                                                {filterOption}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className={`flex-1 overflow-y-auto pr-2 max-h-[calc(100%-120px)] ${darkMode ? 'text-gray-100' : 'text-black'}`}> {/* Adjusted max-h */}
                    {displayableLogs.length > 0 ? (
                        displayableLogs.map((log, index) => (
                            // Pass the log object to Notification_card
                            <Notification_card key={index} notification={log} />
                        ))
                    ) : (
                        <p className="text-center py-4">No logs available for the selected filter.</p>
                    )}
                </div>
                <div className="text-center mt-auto pt-2 pb-2"> {/* Added pb-2 for spacing */}
                    <button
                        className={`p-2 mt-2 rounded-md mx-auto underline cursor-pointer ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
                        onClick={() => {
                            onClose();
                            setIsFilterOpen(false); // Close filter menu on popup close
                            setActiveFilter('All'); // Reset filter
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notification_pop_up;