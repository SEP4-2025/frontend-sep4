import { useDarkMode } from '../context/DarkModeContext';
import WaterManagementGraph from '../components/WaterManagementGraph';
import WaterManagementStatus from '../components/WaterManagementStatus';
import AutomaticWatering from '../components/AutomaticWatering';
import WateringCard from '../components/WateringCard';
import React, { useState, useEffect } from 'react';
import { compileWaterPumpData } from '../utils/dataCompiler';

function WaterManagement () {

    const { darkMode } = useDarkMode();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [waterPumpData, setWaterPumpData] = useState({
        pumpData: {},
        waterLevel: 0,
        lastWatered: null,
        autoWatering: false,
        thresholdValue: 50,
        waterTankCapacity: 1000
    });
    
    // Default pump ID - in a real app, this might come from user settings or URL params
    const pumpId = 1;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await compileWaterPumpData(pumpId);
                setWaterPumpData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching water pump data:', err);
                setError('Failed to load water management data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        
        // Refresh data every 30 seconds
        const intervalId = setInterval(fetchData, 30000);
        
        return () => clearInterval(intervalId);
    }, [pumpId]);
    
    const refreshData = async () => {
        try {
            setLoading(true);
            const data = await compileWaterPumpData(pumpId);
            setWaterPumpData(data);
            setError(null);
        } catch (err) {
            console.error('Error refreshing water pump data:', err);
            setError('Failed to refresh water management data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <main className={`flex-grow overflow-y-auto px-4 py-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {/* Title */}
                <div className='flex flex-col mb-6'>
                    <h1 className={`hidden lg:block ${darkMode ? 'Jacques-Francois text-5xl px-3 text-gray-100' : 'Jacques-Francois text-5xl px-3 text-gray-800'}`}>Water Management</h1>
                    <p className={`hidden lg:block ${darkMode ? 'Manrope p-3 text-gray-400' : 'Manrope p-3 ml-1 text-gray-400'}`}>Water your greenhouse</p>
                </div>

            {error && (
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-red-800 text-white' : 'bg-red-100 text-red-700'}`}>
                    {error}
                    <button 
                        onClick={refreshData} 
                        className={`ml-4 px-3 py-1 rounded-lg ${darkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-white hover:bg-gray-100'}`}
                    >
                        Retry
                    </button>
                </div>
            )}

            {loading && !waterPumpData.pumpData.id ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6"> {/* Parent Flex Container */}
                    {/* Left side panel */}
                    <div className='w-full lg:w-2/3 flex flex-col gap-6'>
                        <div className="hidden lg:block">
                            <WaterManagementGraph/>
                        </div>
                        <AutomaticWatering 
                            pumpId={pumpId}
                            isAutomatic={waterPumpData.autoWatering}
                            isLoading={loading}
                            onUpdate={refreshData}
                        />
                        <WateringCard
                            title="Set Pump Threshold"
                            pumpId={pumpId}
                            thresholdValue={waterPumpData.thresholdValue}
                            onUpdate={refreshData}
                            isLoading={loading}
                        />
                    </div> {/* Closes Left Panel */}

                    {/* Right side panel */}
                    <div className="flex flex-col w-full lg:w-1/3 gap-6 mt-6 lg:mt-0">
                        <WaterManagementStatus 
                            waterNeeded={waterPumpData.thresholdValue}
                            lastWatered={waterPumpData.lastWatered}
                            waterPumpStatus={waterPumpData.pumpData && waterPumpData.pumpData.isOnline ? "Online" : "Offline"}
                            isLoading={loading}
                        />
                        <WateringCard 
                            title="Water the greenhouse" 
                            pumpId={pumpId}
                            thresholdValue={waterPumpData.thresholdValue}
                            onUpdate={refreshData}
                            isLoading={loading}
                        />
                        <WateringCard 
                            title="Refill the water tank" 
                            tankLevel={true} 
                            value={Math.round((waterPumpData.waterLevel / waterPumpData.waterTankCapacity) * 100)}
                            pumpId={pumpId}
                            waterLevel={waterPumpData.waterLevel}
                            waterTankCapacity={waterPumpData.waterTankCapacity}
                            onUpdate={refreshData}
                            isLoading={loading}
                        />
                    </div> {/* Closes Right Panel */}
                </div> /* Closes Parent Flex Container */
            )}
            </main>
        </div>
    )
}

export default WaterManagement;