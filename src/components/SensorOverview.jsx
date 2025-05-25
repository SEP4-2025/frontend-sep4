import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useDarkMode } from '../context/DarkModeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const defaultSensorHistory = [];
const defaultLatestValue = { value: null, date: null }; // Using object for consistency

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
  const [selectedSensor, setSelectedSensor] = useState("temperature");
  const [yAxisConfig, setYAxisConfig] = useState({ min: -30, max: 70 }); 
  
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
          backgroundColor: `${getColor(selectedSensor)}33`, 
          tension: 0.4,
          spanGaps: true,
        }]
      });
      let defaultMin = 0, defaultMax = 100;
      if (selectedSensor === "temperature") { defaultMin = -30; defaultMax = 70; }
      else if (selectedSensor === "light") { defaultMax = 2000; }
      setYAxisConfig({ min: defaultMin, max: defaultMax });
      return;
    }
    
    const now = new Date();
    let displayLabels = [];
    let dataPoints = [];

    if (timeframe === "30d" || timeframe === "7d") {
      const numDays = timeframe === "30d" ? 30 : 7;
      const oneDayOffset = 24 * 60 * 60 * 1000; // 1 day in milliseconds

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
            // Adjust itemDate by adding 1 day
            const adjustedItemDate = new Date(itemDate.getTime() + oneDayOffset);
            return adjustedItemDate >= dayDate && adjustedItemDate < dayEnd;
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
      const oneHourOffset = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(now);
        hourDate.setHours(now.getHours() - (23 - i), 0, 0, 0); 
        displayLabels.push(hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

        const hourEnd = new Date(hourDate);
        hourEnd.setHours(hourDate.getHours() + 1);

        const valuesInHour = sourceData
          .filter(item => {
            const itemDate = new Date(item.date);
            // Adjust itemDate by adding 1 hour
            const adjustedItemDate = new Date(itemDate.getTime() + oneHourOffset);
            return adjustedItemDate >= hourDate && adjustedItemDate < hourEnd;
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
        spanGaps: true,
      }]
    });

    let baseMin = 0;
    let baseMax = 100; 
    if (selectedSensor === "temperature") { baseMin = -30; baseMax = 70; }
    else if (selectedSensor === "light") { baseMax = 2000; }

    let currentYMin = baseMin;
    let currentYMax = baseMax;

    const validDataPoints = dataPoints.filter(p => p !== null && !isNaN(p));

    if (validDataPoints.length > 0) {
      const dataMin = Math.min(...validDataPoints);
      const dataMax = Math.max(...validDataPoints);
      let useDataMin = false;
      let useDataMax = false;

      if (dataMin < currentYMin) { currentYMin = dataMin; useDataMin = true; }
      if (dataMax > currentYMax) { currentYMax = dataMax; useDataMax = true; }
      
      const actualDataRange = dataMax - dataMin;

      if (useDataMin) {
        const padding = (actualDataRange > 0) ? actualDataRange * 0.1 : (Math.abs(currentYMin * 0.1) || 5);
        currentYMin -= padding;
      }
      if (useDataMax) {
        const padding = (actualDataRange > 0) ? actualDataRange * 0.1 : (Math.abs(currentYMax * 0.1) || 5);
        currentYMax += padding;
      }

      if (currentYMax - currentYMin < 10 && validDataPoints.length > 0) {
        const dataMidpoint = (dataMin + dataMax) / 2;
        currentYMin = dataMidpoint - 5;
        currentYMax = dataMidpoint + 5;
        if (baseMin === 0 && currentYMin < 0 && selectedSensor !== "temperature") {
          currentYMin = 0;
        }
      }
    }

    if (currentYMin >= currentYMax) {
        if (validDataPoints.length > 0) {
            const val = validDataPoints[0];
            currentYMin = val - 5;
            currentYMax = val + 5;
        } else { 
            currentYMin = baseMin;
            currentYMax = baseMin + 10; 
        }
        if (baseMin === 0 && currentYMin < 0 && selectedSensor !== "temperature") {
          currentYMin = 0;
        }
    }
    
    setYAxisConfig({
      min: Math.floor(currentYMin),
      max: Math.ceil(currentYMax),
    });

  }, [selectedSensor, timeframe, temperatureHistory, humidityHistory, lightHistory, soilMoistureHistory, darkMode]); // Added darkMode to dependencies for getColor

  const getColor = (sensorType) => {
    // Colors can be adjusted based on dark mode if needed, or kept static
    switch (sensorType) {
      case "temperature": return "#FF0000"; 
      case "humidity": return "#0000FF";    
      case "light": return "#FFD700";       
      case "soilMoisture": return "#008000"; 
      default: return darkMode ? "#60a5fa" : "#2563eb"; // Example: Tailwind blue-400/blue-600
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
  
  const chartJsPlugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = darkMode ? '#1e293b' : '#ffffff'; 
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

  return (
    <div className={`w-full rounded-lg p-5 shadow-sm mt-8 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
      <div className="hidden lg:block">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <div>
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Sensor History</h3>
            <p className="text-xs text-gray-500 mt-1">Historical sensor data</p>
          </div>
          <div className="flex items-center space-x-4">
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
  
    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} lg:mt-6`}>Averages for today</h4>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-center">
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Temperature</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestTemperature?.value != null ? `${latestTemperature.value}°C` : 'N/A'}
        </p>
      </div>
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Humidity</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestHumidity?.value != null ? `${latestHumidity.value}%` : 'N/A'}
        </p>
      </div>
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Light</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestLight?.value != null ? `${latestLight.value} lux` : 'N/A'}
        </p>
      </div>
      <div className={`p-2 rounded ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
        <p className="text-xs text-gray-500">Soil Moisture</p>
        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {latestSoilMoisture?.value != null ? `${latestSoilMoisture.value}%` : 'N/A'}
        </p>
      </div>
    </div>
    </div>
  );
}