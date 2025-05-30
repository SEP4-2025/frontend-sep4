import { useDarkMode } from '../context/DarkModeContext';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Line } from 'react-chartjs-2';
import { useState, useMemo } from 'react';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

export const SENSOR_CONFIG = {
  temperature: {
    name: 'Temperature',
    unit: 'ºC',
    apiType: 'temperature',
    defaultIdeal: 22,
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
    graphData, 
    loading,
    error,
    selectedSensorKey,
    onSensorSelect,
    sensorConfigCollection, 
    sensorTypesCollection 
}) {
    const { darkMode } = useDarkMode();
    const [open, setOpen] = useState(false); 
    const [mobileOpen, setMobileOpen] = useState(false); 

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
        setMobileOpen(false);
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
        if (deviationData.length > 0 && deviationData.some(val => val !== 0)) {
            const dataMin = Math.min(...deviationData);
            const dataMax = Math.max(...deviationData);
            minY = Math.min(minY, Math.floor(dataMin / 10) * 10); 
            maxY = Math.max(maxY, Math.ceil(dataMax / 10) * 10);   
        }
        if (maxY - minY < 20) { 
            const mid = (minY + maxY) / 2;
            minY = Math.min(-100, mid - 50); 
            maxY = Math.max(100, mid + 50);
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
                        yMax: yAxisLimits.max, 
                        backgroundColor: 'rgba(255, 99, 132, 0.2)' 
                    },
                    warningZoneBottom: { type: 'box', yMin: -50, yMax: -20, backgroundColor: 'rgba(255, 255, 0, 0.2)' },
                    dangerZoneBottom: { 
                        type: 'box', 
                        yMin: yAxisLimits.min, 
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

    const sensorSelectorDropdown = (isMobile = false) => (
        <div className="relative">
            <button
                onClick={() => isMobile ? setMobileOpen(!mobileOpen) : setOpen(!open)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
                <span className="font-medium">Select Sensor</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </button>
            {(isMobile ? mobileOpen : open) && sensorTypesCollection && sensorConfigCollection && (
                <div className={`absolute top-full ${isMobile ? 'right-0' : 'lg:right-auto lg:left-0'} mt-1 w-56 rounded-lg shadow-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-100 text-gray-700'} z-20`}>
                    <div className="py-1">
                        {sensorTypesCollection.map(sensorKey => (
                            <button
                                key={sensorKey}
                                onClick={() => handleDropdownSelect(sensorKey)}
                                className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-50'} ${selectedSensorKey === sensorKey ? (darkMode ? 'bg-slate-600 font-medium' : 'bg-gray-100 font-medium') : ''}`}
                            >
                                {sensorConfigCollection[sensorKey]?.name || sensorKey}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full">
            <div className={`rounded-lg shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="p-6">
                    {/* Mobile-only Title (centered) */}
                    <h2 className="text-xl font-semibold text-center mb-4 lg:hidden">
                        Sensor
                    </h2>

                    {/* Mobile: Status Card (left) and Sensor Selector (right) */}
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                        {/* Status Card for Mobile - Adjusted for height matching */}
                        <div className={`flex items-center rounded-lg px-3 py-2 border ${darkMode ? 'border-slate-500 bg-slate-600' : 'border-gray-200 bg-gray-50'}`}>
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Status:</span>
                            <span className="font-bold">{loading ? "..." : (status || 'N/A')}</span>
                        </div>
                        {/* Sensor Selector for Mobile */}
                        {sensorSelectorDropdown(true)}
                    </div>

                    {/* Desktop: Title (left) and Sensor Selector (right) */}
                    <div className="hidden lg:flex lg:flex-row items-center lg:justify-between mb-4">
                        <h2 className="font-bold text-2xl">
                            {displayName} Monitoring
                        </h2>
                        {sensorSelectorDropdown(false)}
                    </div>
                    
                    {/* Desktop Info boxes - Hidden on mobile, shown on lg and up */}
                    <div className="hidden lg:flex flex-wrap gap-4 mb-4">
                        <div className={`flex items-center rounded-lg px-4 py-2 ${darkMode ? 'bg-slate-600' : 'bg-gray-50'}`}>
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Status:</span>
                            <span className="text-sm font-bold">{loading ? "..." : (status || 'N/A')}</span>
                        </div>
                        <div className={`flex items-center rounded-lg px-4 py-2 ${darkMode ? 'bg-slate-600' : 'bg-gray-50'}`}>
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Last Value:</span>
                            <span className="text-sm font-bold">
                                {loading ? "..." : `${lastMeasurementValue !== 'N/A' && lastMeasurementValue !== undefined ? Number(lastMeasurementValue).toFixed(1) : 'N/A'}${unit || ''}`}
                            </span>
                        </div>
                        <div className={`flex items-center rounded-lg px-4 py-2 ${darkMode ? 'bg-slate-600' : 'bg-gray-50'}`}>
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-2`}>Ideal Value:</span>
                            <span className="text-sm font-bold">
                                {idealValue !== undefined && idealValue !== null ? Number(idealValue).toFixed(1) : 'N/A'}{unit || ''}
                            </span>
                        </div>
                    </div>

                    {error && <div className="text-center p-4 text-red-500 mb-4">{error}</div>}
                    
                    {/* Graph area - Hidden on mobile, shown on lg and up */}
                    <div className={`hidden lg:block rounded-lg ${darkMode ? 'bg-slate-600' : 'bg-gray-50'} p-4`}>
                        <div style={{ height: '400px' }}>
                            {loading && (!history || history.length === 0) ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Loading chart data...</div>
                                </div>
                            ) : !loading && !error && (!history || history.length === 0) ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>No historical data available for {displayName}.</div>
                                </div>
                            ) : !error && history && history.length > 0 ? (
                                <Line data={chartData} options={options} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SensorViewGraph;