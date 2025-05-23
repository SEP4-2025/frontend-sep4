import { useState, useEffect } from 'react';
import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const defaultSensorHistory = [];
const defaultLatestValue = null;

export function SensorOverview({
  temperatureHistory = defaultSensorHistory,
  humidityHistory = defaultSensorHistory,
  lightHistory = defaultSensorHistory,
  soilMoistureHistory = defaultSensorHistory,
  latestTemperature = defaultLatestValue,
  latestHumidity = defaultLatestValue,
  latestLight = defaultLatestValue,
  latestSoilMoisture = defaultLatestValue,
}) {
  const { darkMode } = useDarkMode();
  const [timeframe, setTimeframe] = useState("24h");
  const [selectedSensor, setSelectedSensor] = useState("temperature"); // Default to temperature graph
  const [yAxisConfig, setYAxisConfig] = useState({ min: -30, max: 70 }); // Initial for temperature
  
  const [processedChartData, setProcessedChartData] = useState({
    labels: [],
    datasets: [{
      label: '', 
      data: [], 
      borderColor: '', 
      backgroundColor: '', 
      tension: 0.4, 
      spanGaps: true,
    }]
  });

  useEffect(() => {
    let sourceData;
    switch (selectedSensor) {
      case "temperature": sourceData = temperatureHistory; break;
      case "humidity":    sourceData = humidityHistory;    break;
      case "light":       sourceData = lightHistory;       break;
      case "soilMoisture":sourceData = soilMoistureHistory;break;
      default:            sourceData = [];
    }

    if (!sourceData || sourceData.length === 0) {
      setProcessedChartData({
        labels: [],
        datasets: [{
          label: `${selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Over Time`,
          data: [],
          borderColor: getColor(selectedSensor),
          backgroundColor: `${getColor(selectedSensor)}33`, // 33 for ~20% opacity
          tension: 0.4,
          spanGaps: true,
        }]
      });
      // Set y-axis to defaults for the selected sensor when no data
      let defaultMin = 0, defaultMax = 100;
      if (selectedSensor === "temperature") { defaultMin = -30; defaultMax = 70; }
      else if (selectedSensor === "light") { defaultMax = 2000; } // min is 0
      setYAxisConfig({ min: defaultMin, max: defaultMax });
      return;
    }
    
    const now = new Date();
    let displayLabels = [];
    let dataPoints = [];

    if (timeframe === "30d" || timeframe === "7d") {
      const numDays = timeframe === "30d" ? 30 : 7;
      for (let i = 0; i < numDays; i++) {
        const dayDate = new Date(now);
        dayDate.setDate(now.getDate() - (numDays - 1 - i));
        dayDate.setHours(0, 0, 0, 0); 
        displayLabels.push(dayDate.toISOString().split('T')[0]); 

        const dayEnd = new Date(dayDate);
        dayEnd.setDate(dayDate.getDate() + 1);

        const valuesInDay = sourceData
          .filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= dayDate && itemDate < dayEnd;
          })
          .map(item => item.value);

        if (valuesInDay.length > 0) {
          const avg = valuesInDay.reduce((a, b) => a + b, 0) / valuesInDay.length;
          dataPoints.push(parseFloat(avg.toFixed(2)));
        } else {
          dataPoints.push(null);
        }
      }
    } else if (timeframe === "24h") {
      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(now);
        hourDate.setHours(now.getHours() - (23 - i), 0, 0, 0); // Start from 23 hours ago up to current hour start
        displayLabels.push(hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

        const hourEnd = new Date(hourDate);
        hourEnd.setHours(hourDate.getHours() + 1);

        const valuesInHour = sourceData
          .filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= hourDate && itemDate < hourEnd;
          })
          .map(item => item.value);

        if (valuesInHour.length > 0) {
          const avg = valuesInHour.reduce((a, b) => a + b, 0) / valuesInHour.length;
          dataPoints.push(parseFloat(avg.toFixed(2)));
        } else {
          dataPoints.push(null);
        }
      }
    }

    setProcessedChartData({
      labels: displayLabels,
      datasets: [{
        label: `${selectedSensor.charAt(0).toUpperCase() + selectedSensor.slice(1)} Over Time`,
        data: dataPoints,
        borderColor: getColor(selectedSensor),
        backgroundColor: `${getColor(selectedSensor)}33`,
        tension: 0.4,
        spanGaps: true, // This will draw lines between points with null data in between
      }]
    });

    // Calculate Y-axis min/max
    let baseMin = 0;
    let baseMax = 100; // Default for humidity and soil moisture
    if (selectedSensor === "temperature") { baseMin = -30; baseMax = 70; }
    else if (selectedSensor === "light") { baseMax = 2000; } // min is 0

    let currentYMin = baseMin;
    let currentYMax = baseMax;

    const validDataPoints = dataPoints.filter(p => p !== null && !isNaN(p));

    if (validDataPoints.length > 0) {
      const dataMin = Math.min(...validDataPoints);
      const dataMax = Math.max(...validDataPoints);

      let useDataMin = false;
      let useDataMax = false;

      if (dataMin < currentYMin) {
        currentYMin = dataMin;
        useDataMin = true;
      }
      if (dataMax > currentYMax) {
        currentYMax = dataMax;
        useDataMax = true;
      }
      
      const actualDataRange = dataMax - dataMin;

      // Add padding if data exceeds base range
      if (useDataMin) {
        const padding = (actualDataRange > 0) ? actualDataRange * 0.1 : (Math.abs(currentYMin * 0.1) || 5);
        currentYMin -= padding;
      }
      if (useDataMax) {
        const padding = (actualDataRange > 0) ? actualDataRange * 0.1 : (Math.abs(currentYMax * 0.1) || 5);
        currentYMax += padding;
      }

      // Ensure a minimum visual span if the calculated range is too small or all points are same
      if (currentYMax - currentYMin < 10 && validDataPoints.length > 0) {
        const dataMidpoint = (dataMin + dataMax) / 2;
        currentYMin = dataMidpoint - 5;
        currentYMax = dataMidpoint + 5;
        if (baseMin === 0 && currentYMin < 0 && selectedSensor !== "temperature") { // Don't go below 0 for non-temp sensors if baseMin was 0
          currentYMin = 0;
        }
      }
    }
    // else, currentYMin and currentYMax remain baseMin and baseMax

    // Final safety check to prevent min >= max
    if (currentYMin >= currentYMax) {
        if (validDataPoints.length > 0) {
            const val = validDataPoints[0]; // Use the first valid point as a reference
            currentYMin = val - 5;
            currentYMax = val + 5;
        } else { // No valid data points, use base with a small span
            currentYMin = baseMin;
            currentYMax = baseMin + 10; // Default span if baseMin === baseMax
        }
        if (baseMin === 0 && currentYMin < 0 && selectedSensor !== "temperature") {
          currentYMin = 0;
        }
    }
    
    setYAxisConfig({
      min: Math.floor(currentYMin),
      max: Math.ceil(currentYMax),
    });

  }, [selectedSensor, timeframe, temperatureHistory, humidityHistory, lightHistory, soilMoistureHistory]);

  const getColor = (sensorType) => {
    switch (sensorType) {
      case "temperature": return "#FF0000"; // Red
      case "humidity": return "#0000FF";    // Blue
      case "light": return "#FFD700";       // Gold/Yellow
      case "soilMoisture": return "#008000"; // Green
      default: return "#22c55e"; // Default green (Tailwind green-500)
    }
  };

  const getUnit = (sensorType) => {
    switch (sensorType) {
      case "temperature": return "°C";
      case "humidity": case "soilMoisture": return "%";
      case "light": return "lux";
      default: return "";
    }
  };

  const chartTextColor = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  
  // Define chart background plugin
  const chartJsPlugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff'; // slate-800 or white
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };
  return (
    <div className={`w-full rounded-lg p-5 shadow-sm mt-8 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      {/* Sensor History Section - Hidden on Mobile */}
      <div className="hidden lg:block">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Sensor History</h3>
            <p className="text-xs text-gray-500 mt-1">Historical sensor data</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Sensor Selection Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedSensor("temperature")}
                className={`p-2 rounded-md text-xs transition-colors ${selectedSensor === "temperature" ?
                  (darkMode ? 'bg-slate-600 text-white' : 'bg-gray-100 text-gray-900') :
                  (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')}`}
              >
                Temperature
              </button>
              <button
                onClick={() => setSelectedSensor("humidity")}
                className={`p-2 rounded-md text-xs transition-colors ${selectedSensor === "humidity" ?
                  (darkMode ? 'bg-slate-600 text-white' : 'bg-gray-100 text-gray-900') :
                  (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')}`}
              >
                Humidity
              </button>
              <button
                onClick={() => setSelectedSensor("light")}
                className={`p-2 rounded-md text-xs transition-colors ${selectedSensor === "light" ?
                  (darkMode ? 'bg-slate-600 text-white' : 'bg-gray-100 text-gray-900') :
                  (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')}`}
              >
                Light
              </button>
              <button
                onClick={() => setSelectedSensor("soilMoisture")}
                className={`p-2 rounded-md text-xs transition-colors ${selectedSensor === "soilMoisture" ?
                  (darkMode ? 'bg-slate-600 text-white' : 'bg-gray-100 text-gray-900') :
                  (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')}`}
              >
                Soil
              </button>
            </div>
  
            {/* Time Period Selector */}
            <div className="flex items-center border-l pl-4 border-gray-200 dark:border-gray-600">
              <select
                className={`rounded-md px-2 py-1 text-xs ${darkMode ?
                  'bg-slate-600 text-white border-slate-500' :
                  'bg-gray-100 text-gray-700 border-gray-200'}`}
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* Chart */}
        <div className={`mt-4 rounded-lg overflow-hidden p-4 h-[300px] ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <Line
            data={processedChartData}
            plugins={[chartJsPlugin]}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: timeframe === "24h" ? "Time (HH:MM)" : "Date (YYYY-MM-DD)",
                    color: chartTextColor,
                  },
                  ticks: { display: true, autoSkip: true, color: chartTextColor },
                  grid: { color: gridColor },
                },
                y: {
                  title: { display: true, text: `Value (${getUnit(selectedSensor)})`, color: chartTextColor },
                  min: yAxisConfig.min,
                  max: yAxisConfig.max,
                  ticks: { color: chartTextColor },
                  grid: { color: gridColor },
                },
              },
              plugins: {
                legend: {
                  labels: { color: chartTextColor }
                },
                tooltip: {
                  backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  titleColor: darkMode ? '#e2e8f0' : '#1f2937',
                  bodyColor: darkMode ? '#e2e8f0' : '#1f2937',
                  borderColor: darkMode ? 'rgba(100, 116, 139, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  borderWidth: 1
                }
              }
            }}
          />
        </div>
      </div>
  
        {/* Averages for Today - Visible on All Devices */}
    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} lg:mt-6`}>Averages for today</h4>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-center">
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Temperature</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestTemperature?.value ? `${latestTemperature.value}°C` : 'N/A'}
        </p>
      </div>
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Humidity</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestHumidity?.value ? `${latestHumidity.value}%` : 'N/A'}
        </p>
      </div>
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Light</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestLight?.value ? `${latestLight.value} lux` : 'N/A'}
        </p>
      </div>
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Soil Moisture</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestSoilMoisture?.value ? `${latestSoilMoisture.value}%` : 'N/A'}
        </p>
      </div>
    </div>
    </div>
  );
}