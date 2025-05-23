import React, { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext.jsx';
import LogCard from './LogCard.jsx'; 
import LogPopup from './LogPopup.jsx'; 

function SensorLog ({ logs }) { 
    const { darkMode } = useDarkMode();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const displayLogs = Array.isArray(logs) ? logs : [];

    return (
        <div className="w-full">
            <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="p-6">
                    <h2 className="font-bold text-xl mb-4">Activity Log</h2>
                    <div className={`rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                        {displayLogs.length > 0 ? (
                            <div className="space-y-3">
                                {displayLogs.slice(0, 2).map((log, index) => (
                                    <LogCard key={log.id || index} log={log} />
                                ))}
                                
                                {displayLogs.length > 2 && (
                                    <button 
                                        className={`w-full mt-3 py-2 rounded-lg text-center ${darkMode ? 'bg-slate-700 hover:bg-slate-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`} 
                                        onClick={openModal}
                                    >
                                        View All Logs
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`} data-testid="no-logs-message">No logs available for the last 30 days.</p>
                            </div>
                        )}
                        
                        <LogPopup
                            isOpen={isModalOpen} 
                            onClose={closeModal} 
                            title="Log History" 
                            description="Here you can see the history of all log readings from the last 30 days."
                            logs={displayLogs}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SensorLog;