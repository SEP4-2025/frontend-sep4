import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import LogCard from './Log-card.jsx'; // Changed import
import LogPopup from './log-pupup.jsx'; // Changed import

function SensorLog ({ logs }) { // Changed prop name from notifications to logs
    const { darkMode } = useDarkMode();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const displayLogs = Array.isArray(logs) ? logs : [];

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    <p className='Manrope font-bold text-center text-lg mb-3'>Log</p>
                    <div>
                        {displayLogs.length > 0 ? (
                            displayLogs.slice(0, 2).map((log, index) => (
                                // Assuming log objects have a unique 'id' or use index if not.
                                // For stability, if logs have unique IDs from backend, prefer log.id
                                <LogCard key={log.id || index} log={log} /> // Changed component
                            ))
                        ) : (
                            <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No logs available for the last 30 days.</p>
                        )}
                        {displayLogs.length > 2 && (
                            <button 
                                className={`p-2 mt-4 rounded-md mx-auto text-center underline w-full ${darkMode ? 'text-gray-100 hover:text-gray-300' : 'text-black hover:text-gray-700'}`} 
                                onClick={openModal}
                            >
                                View All Logs
                            </button>
                        )}
                        <LogPopup // Changed component
                            isOpen={isModalOpen} 
                            onClose={closeModal} 
                            title="Log History" 
                            description="Here you can see the history of all log readings from the last 30 days."
                            logs={displayLogs} // Pass all (already date-filtered and sorted) logs
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SensorLog;