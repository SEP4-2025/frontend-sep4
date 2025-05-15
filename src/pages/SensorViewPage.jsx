import { useDarkMode } from '../context/DarkModeContext';
// Import SENSOR_CONFIG and SENSOR_TYPES from SensorViewGraph.jsx
import SensorViewGraph, { SENSOR_CONFIG, SENSOR_TYPES } from '../components/SensorViewGraph';
import SensorLog from '../components/SensorLog'; 
import SensorSettings from '../components/SensorSettings';
import SensorInfo from '../components/SensorInfo';
import SensorIcon from '../assets/material-symbols--nest-remote-comfort-sensor-outline-rounded.svg';
import { useState, useEffect } from 'react';
import { compileSensorViewGraphData, compileSensorLogs } from '../utils/dataCompiler';

function SensorViewPage () {
    const { darkMode } = useDarkMode();
    const [selectedSensorKey, setSelectedSensorKey] = useState(SENSOR_TYPES[0]);
    const [allDisplayLogs, setAllDisplayLogs] = useState([]); 
    
    const initialSensorConfig = SENSOR_CONFIG[selectedSensorKey];
    const [graphData, setGraphData] = useState({
        history: [],
        idealValue: initialSensorConfig.defaultIdeal,
        status: 'Loading...',
        lastMeasurementValue: 'N/A',
        unit: initialSensorConfig.unit,
        name: initialSensorConfig.name,
        error: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
            if (!selectedSensorKey) return;

            setLoading(true);
            const currentSensorConfig = SENSOR_CONFIG[selectedSensorKey];

            setGraphData(prevData => ({
                ...prevData,
                history: [],
                idealValue: currentSensorConfig.defaultIdeal,
                status: 'Loading...',
                lastMeasurementValue: 'N/A',
                unit: currentSensorConfig.unit,
                name: currentSensorConfig.name,
                error: null,
            }));
            setAllDisplayLogs([]); 

            try {
                const [compiledGraphData, compiledAllLogsData] = await Promise.all([
                    compileSensorViewGraphData(
                        currentSensorConfig.apiType,
                        currentSensorConfig,
                        signal
                    ),
                    compileSensorLogs('all', signal) 
                ]);

                if (!signal.aborted) {
                    setGraphData(compiledGraphData);
                    setAllDisplayLogs(compiledAllLogsData); 
                }
            } catch (err) {
                if (err.name !== 'AbortError' && !signal.aborted) {
                    console.error(`Unhandled error in SensorViewPage fetching data for ${currentSensorConfig.name}:`, err);
                    setGraphData({ 
                        history: [],
                        idealValue: currentSensorConfig.defaultIdeal,
                        status: 'Error',
                        lastMeasurementValue: 'N/A',
                        unit: currentSensorConfig.unit,
                        name: currentSensorConfig.name,
                        error: `Failed to load data. Please try again.`,
                    });
                    setAllDisplayLogs([]); 
                } else if (err.name === 'AbortError') {
                    console.log("Fetch aborted in SensorViewPage useEffect.");
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            controller.abort();
        };
    }, [selectedSensorKey]);

    const handleSensorSelect = (sensorKey) => {
        setSelectedSensorKey(sensorKey);
    };

    return (
        <div className={`p-8 min-h-screen ${darkMode ? 'bg-slate-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
            {/* Title */}
            <div className='flex flex-col mb-6'>
                <h1 className={darkMode ? 'Jacques-Francois text-5xl px-3 text-gray-100' : 'Jacques-Francois text-5xl px-3 text-gray-800'}>Sensor View</h1>
                <p className={darkMode ? 'Manrope p-3 text-gray-400' : 'Manrope p-3 ml-3 text-gray-400'}>Monitor greenhouse conditions</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
                <div className='w-full lg:w-2/3 flex flex-col gap-6'>
                    <SensorViewGraph
                        graphData={graphData}
                        loading={loading}
                        error={graphData.error} 
                        selectedSensorKey={selectedSensorKey}
                        onSensorSelect={handleSensorSelect}
                        sensorConfigCollection={SENSOR_CONFIG} 
                        sensorTypesCollection={SENSOR_TYPES}   
                    />
                    <SensorInfo
                        lastMeasurementValue={graphData.lastMeasurementValue}
                        idealValue={graphData.idealValue}
                        unit={graphData.unit}
                        sensorName={graphData.name}
                        sensorKey={selectedSensorKey}
                    /> 
                </div>
                
                {/* Right side panel */}
                <div className='w-full lg:w-1/3 flex flex-col gap-6 mt-6 lg:mt-0'>
                    <SensorLog logs={allDisplayLogs} />
                    <SensorSettings 
                        selectedSensorKey={selectedSensorKey}
                        sensorConfig={SENSOR_CONFIG}
                    />
                </div>
            </div>
        </div>
    )
}
export default SensorViewPage;