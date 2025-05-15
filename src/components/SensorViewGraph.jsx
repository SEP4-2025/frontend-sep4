import { useDarkMode } from '../context/DarkModeContext';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { useState, useEffect, useMemo } from 'react'; // Added useEffect and useMemo

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Sensor configurations defined at the top of this file
export const SENSOR_CONFIG = {
  temperature: {
    name: 'Temperature',
    unit: 'ºC',
    apiType: 'temperature',
    defaultIdeal: 22, // Fallback if threshold is not available
  },
  humidity: {
    name: 'Humidity',
    unit: '%',
    apiType: 'humidity',
    defaultIdeal: 60,
  },
  light: {
    name: 'Light Intensity',
    unit: 'lux',
    apiType: 'light',
    defaultIdeal: 5000,
  },
  soilMoisture: {
    name: 'Soil Moisture',
    unit: '%',
    apiType: 'soilMoisture',
    defaultIdeal: 50,
  },
};

export const SENSOR_TYPES = Object.keys(SENSOR_CONFIG);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  annotationPlugin
);

function SensorViewGraph({
    graphData, // This prop will come from SensorViewPage
    loading,
    error,
    selectedSensorKey,
    onSensorSelect,
    sensorConfigCollection, 
    sensorTypesCollection 
}) {
    const { darkMode } = useDarkMode();
    const [open, setOpen] = useState(false);

    const { 
        history = [], 
        idealValue = 0, 
        status = 'N/A', 
        lastMeasurementValue = 'N/A', 
        unit = '', 
        name = 'Sensor' 
    } = graphData || {};

    const handleDropdownSelect = (sensorKey) => {
        onSensorSelect(sensorKey);
        setOpen(false);
    };

    const deviationData = useMemo(() => {
        if (history && history.length > 0 && idealValue !== null && idealValue !== undefined) {
            return history.map(d => {
                const val = Number(d.value);
                const ideal = Number(idealValue);
                if (ideal === 0) {
                    return val === 0 ? 0 : (val > 0 ? 100 : -100); 
                }
                return ((val - ideal) / ideal) * 100;
            });
        }
        return [0];
    }, [history, idealValue]);

    const yAxisLimits = useMemo(() => {
        let minY = -100;
        let maxY = 100;
        if (deviationData.length > 0 && deviationData.some(val => val !== 0)) { // Check if there's actual data
            const dataMin = Math.min(...deviationData);
            const dataMax = Math.max(...deviationData);
            minY = Math.min(minY, Math.floor(dataMin / 10) * 10); // Round down to nearest 10 for cleaner scale
            maxY = Math.max(maxY, Math.ceil(dataMax / 10) * 10);   // Round up to nearest 10
        }
        // Ensure a minimum span if values are very close or within default
        if (maxY - minY < 20) { // e.g. if all data is between -5 and 5
            const mid = (minY + maxY) / 2;
            minY = Math.min(-100, mid - 50); // Ensure it covers at least -100 to 100 if possible
            maxY = Math.max(100, mid + 50);
             // Re-check default bounds
            minY = Math.min(-100, minY);
            maxY = Math.max(100, maxY);
        }


        return { min: minY, max: maxY };
    }, [deviationData]);


    const chartData = {
        labels: history && history.length > 0 ? history.map(d => d.date) : ['N/A'],
        datasets: [
            {
                label: `Deviation from Ideal (${idealValue !== undefined && idealValue !== null ? Number(idealValue).toFixed(1) : 'N/A'}${unit || ''})`,
                data: deviationData,
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.6)',
                tension: 0.4,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: darkMode ? 'white' : 'black',
                },
            },
            annotation: {
                annotations: {
                    idealLine: {
                        type: 'line',
                        yMin: 0, 
                        yMax: 0,
                        borderColor: darkMode ? 'rgba(150, 255, 150, 0.7)' : 'rgba(0, 128, 0, 0.7)',
                        borderWidth: 2,
                        borderDash: [6, 6],
                        label: {
                            content: `Ideal (Threshold: ${idealValue !== undefined && idealValue !== null ? Number(idealValue).toFixed(1) : 'N/A'}${unit || ''})`,
                            enabled: true,
                            position: 'start',
                            backgroundColor: darkMode ? 'rgba(50,50,50,0.7)' : 'rgba(200,200,200,0.7)',
                            color: darkMode ? 'white' : 'black',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    safeZone: { type: 'box', yMin: -20, yMax: 20, backgroundColor: 'rgba(144, 238, 144, 0.2)' },
                    warningZoneTop: { type: 'box', yMin: 20, yMax: 50, backgroundColor: 'rgba(255, 255, 0, 0.2)' },
                    dangerZoneTop: { 
                        type: 'box', 
                        yMin: 50, 
                        yMax: yAxisLimits.max, // Extend to the top of the Y-axis
                        backgroundColor: 'rgba(255, 99, 132, 0.2)' 
                    },
                    warningZoneBottom: { type: 'box', yMin: -50, yMax: -20, backgroundColor: 'rgba(255, 255, 0, 0.2)' },
                    dangerZoneBottom: { 
                        type: 'box', 
                        yMin: yAxisLimits.min, // Extend to the bottom of the Y-axis
                        yMax: -50, 
                        backgroundColor: 'rgba(255, 99, 132, 0.2)' 
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let tooltipLabel = context.dataset.label || '';
                        if (tooltipLabel.includes('Deviation')) {
                            tooltipLabel = `Deviation: ${context.parsed.y.toFixed(2)}%`;
                            if (graphData && graphData.history && graphData.history[context.dataIndex] && graphData.history[context.dataIndex].value !== undefined) {
                                tooltipLabel += ` (Value: ${Number(graphData.history[context.dataIndex].value).toFixed(1)}${unit || ''})`;
                            }
                        }
                        return tooltipLabel;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: darkMode ? 'white' : 'black' },
            },
            y: {
                ticks: { callback: (value) => `${value}%`, color: darkMode ? 'white' : 'black' },
                title: { display: true, text: 'Deviation (%)', color: darkMode ? 'white' : 'black' },
                min: yAxisLimits.min,
                max: yAxisLimits.max,
            },
        },
    };

    const displayName = loading ? 'Loading...' : (name || 'Sensor');

    return (
        <div className={`w-full ${darkMode ? 'darkMode' : ''}`}>
            <div className={`rounded-lg p-4 mb-4 shadow-md ${darkMode ? 'bg-slate-700' : 'bg-navbar-color'}`}>
                <div className={`Manrope flex flex-col h-full p-3 border rounded-lg ${darkMode ? 'border-gray-700 bg-slate-600' : 'border-gray-300 bg-gray-50'}`}>
                    {/* ... existing JSX for dropdown and info ... */}
                    <div className='flex lg:flex-row flex-col justify-between items-center mb-3'>
                        <div className="relative flex items-center h-12">
                            <button
                                onClick={() => setOpen(!open)}
                                className={`h-full flex justify-center items-center w-auto min-w-[200px] rounded-md shadow-sm px-4 py-2 ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-500' : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                            >
                                Sensor: {displayName}
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {open && sensorTypesCollection && sensorConfigCollection && (
                                <div className={`absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-700'}`}>
                                    <div className="py-1">
                                        {sensorTypesCollection.map(sensorKey => (
                                            <a
                                                key={sensorKey}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handleDropdownSelect(sensorKey); }}
                                                className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} ${selectedSensorKey === sensorKey ? (darkMode ? 'bg-slate-600' : 'bg-gray-100') : ''}`}
                                            >
                                                {sensorConfigCollection[sensorKey]?.name || sensorKey}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`flex flex-row h-full rounded-lg items-center justify-center shadow-sm p-3 text-sm ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            Status: {loading ? "..." : (status || 'N/A')}
                        </div>
                        <div className={`flex flex-row h-full items-center justify-center rounded-lg shadow-sm p-3 text-sm ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            Last: {loading ? "..." : `${lastMeasurementValue !== 'N/A' && lastMeasurementValue !== undefined ? Number(lastMeasurementValue).toFixed(1) : 'N/A'}${unit || ''}`} (Ideal: {idealValue !== undefined && idealValue !== null ? Number(idealValue).toFixed(1) : 'N/A'}{unit || ''})
                        </div>
                    </div>

                    {error && <div className="text-center p-4 text-red-500">{error}</div>}
                    
                    <div style={{ height: '400px' }}>
                         {loading && (!history || history.length === 0) ? (
                            <div className={`text-center p-10 ${darkMode ? 'text-white' : 'text-black'}`}>Loading chart data...</div>
                         ) : !loading && !error && (!history || history.length === 0) ? (
                            <div className={`text-center p-10 ${darkMode ? 'text-white' : 'text-black'}`}>No historical data available for {displayName}.</div>
                         ) : !error && history && history.length > 0 ? (
                            <Line data={chartData} options={options} />
                         ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SensorViewGraph;